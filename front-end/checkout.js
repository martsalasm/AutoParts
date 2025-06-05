import { getAdjustedPrice } from "./global.js";

let valorTotal = 0;
let subtotal = 0;
let totalWeight = 0;
let maxHeight = 0;
let maxWidth = 0;
let maxLength = 0;


const total = document.getElementById("checkout-total");
const formatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});
// Mostramos el subtotal del carrito al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    document.getElementById("checkout-subtotal").textContent = "$0";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/productos/detalles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos: cart }),
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }

    const productos = await res.json();



    productos.forEach((prod) => {
      const item = cart.find((c) => Number(c.id) === Number(prod.id));
      if (!item) {
        console.warn(`Producto con ID ${prod.id} no encontrado en el carrito`);
        return;
      }
      const adjustedPrice = getAdjustedPrice(prod);
      subtotal += adjustedPrice * item.quantity;
      valorTotal = subtotal;
      const quantity = item.quantity;
      if (prod.weight) totalWeight += prod.weight * quantity;
      if (prod.height && prod.height > maxHeight) maxHeight = prod.height;
      if (prod.width && prod.width > maxWidth) maxWidth = prod.width;
      if (prod.length && prod.length > maxLength) maxLength = prod.length;
    });

    document.getElementById("checkout-subtotal").textContent = formatter.format(subtotal);
  } catch (err) {
    console.error("Error al obtener productos del backend:", err);
  }
});

function bloquearFinalizeBtn() {
  const finalizeBtn = document.getElementById("finalize-btn");
  if (finalizeBtn) finalizeBtn.disabled = true;
}
function desbloquearFinalizeBtn() {
  const finalizeBtn = document.getElementById("finalize-btn");
  if (finalizeBtn) finalizeBtn.disabled = false;
}


document.addEventListener("DOMContentLoaded", () => {
  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");
  let regionesComunasData = [];

  fetch("comunas-regiones.json")
    .then((response) => response.json())
    .then((data) => {
      regionesComunasData = data.regiones;
      regionesComunasData.forEach((regionData) => {
        const option = document.createElement("option");
        option.value = regionData.region;
        option.textContent = regionData.region;
        regionSelect.appendChild(option);
      });

      console.log("Regiones cargadas correctamente");
    })
    .catch((error) => {
      console.error("Error al cargar las regiones:", error);
    });

  regionSelect.addEventListener('change', () => {
    const selectedRegion = regionSelect.value;
    const regionData = regionesComunasData.find(
      (region) => region.region === selectedRegion
    );
    comunaSelect.innerHTML = "";

    if (regionData && regionData.comunas) {
      regionData.comunas.forEach((comuna) => {
        const option = document.createElement('option');
        option.value = comuna;
        option.textContent = comuna;
        comunaSelect.appendChild(option);
      });
    } else {
      console.warn(`No se encontraron comunas para la región: ${selectedRegion}`);
    }
  });

  // Verificar cobertura cuando cambia comuna
  comunaSelect.addEventListener("change", () => {
    const selectedRegion = regionSelect.value;
    const selectedComuna = comunaSelect.value;
    desbloquearFinalizeBtn();
    if (selectedRegion && selectedComuna) {
      const selectedRegionData = regionesComunasData.find(
        (region) => region.region === selectedRegion
      );
      const regionCode = selectedRegionData ? selectedRegionData.regionId : "";

      if (!regionCode) {
        console.warn(`No se encontró el código para la región: ${selectedRegion}`);
        return;
      }

      fetch("http://localhost:3000/chilexpress/validarCobertura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: selectedRegion,
          comuna: selectedComuna,
          regionCode: regionCode,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.tieneCobertura) {
            console.log(`Cobertura disponible para ${selectedRegion}, ${selectedComuna}`);
            if (data.countyCode) {
              console.log("Código de comuna:", data.countyCode);
              const destinationCountyCode = data.countyCode;
              const originCountyCode = "STGO";

              const packageData = {
                weight: totalWeight,
                height: maxHeight,
                width: maxWidth,
                length: maxLength,
              }

              const bodyData = {
                originCountyCode: originCountyCode,
                destinationCountyCode: destinationCountyCode,
                package: packageData,
                productType: 3,
                declaredWorth: subtotal,
              }
              fetch("http://localhost:3000/chilexpress/calcularDespacho", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyData),
              }).then((response) => {
                if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
                return response.json();
              })
                .then((despachoData) => {
                  console.log("Opciones de despacho:", despachoData);

                  const courierOptions = despachoData.data?.courierServiceOptions || [];
                  const envioElement = document.getElementById("checkout-shipping");

                  if (courierOptions.length === 0) {
                    envioElement.textContent = "En este momento nuestro servicio de despacho no tiene opciones disponibles, porfavor comunicarse con servicio al cliente.";
                    bloquearFinalizeBtn();
                  }
                  else {
                    const option = courierOptions[1] ?? courierOptions[0];
                    const despachoValor = option && option.serviceValue !== undefined ? Number(option.serviceValue) : 0;
                    envioElement.textContent = formatter.format(despachoValor);
                    console.log("Valor del despacho:", despachoValor);
                    valorTotal = subtotal + despachoValor;
                    total.textContent = formatter.format(valorTotal);
                  }
                })
                .catch((error) => {
                  console.error("Error al calcular el despacho:", error);
                });
            }
          } else {
            console.warn(`No hay cobertura disponible para ${selectedRegion}, ${selectedComuna}`);
            const envioElement = document.getElementById("checkout-shipping");
            envioElement.textContent = "Chilexpress no cuenta con cobertura a esta comuna, porfavor comunicarse con servicio al cliente.";
            bloquearFinalizeBtn();
          }
        })
        .catch((error) => {
          console.error("Error al verificar la cobertura:", error);
        });
    }
  });
});

document.getElementById('checkout-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  if (paymentMethod !== 'webpay') {
    return;
  }

  const ordenId = `orden_${Date.now()}`;
  const sessionId = `session_${Date.now()}`;
  const monto = valorTotal;
  const returnUrl = 'http://localhost:3000/webpay/confirmar';

  try {
    const res = await fetch('http://localhost:3000/webpay/iniciar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monto, ordenId, sessionId, returnUrl }),
    });
    const data = await res.json();

    if (data.url && data.token) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.url;

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'token_ws';
      tokenInput.value = data.token;

      form.appendChild(tokenInput);
      document.body.appendChild(form);

      form.submit();
    } else {
      console.log('Error al iniciar el pago');
    }

  } catch (error) {
    console.error('Error al iniciar pago:', error);
  }
});