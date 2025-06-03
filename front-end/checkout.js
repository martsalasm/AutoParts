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

    let subtotal = 0;

    productos.forEach((prod) => {
      const item = cart.find((c) => Number(c.id) === Number(prod.id));
      if (!item) {
        console.warn(`Producto con ID ${prod.id} no encontrado en el carrito`);
        return;
      }
      subtotal += prod.precio * item.quantity;
    });

    document.getElementById("checkout-subtotal").textContent = `$${subtotal}`;
    /* window.checkoutData = {
            subtotal,
            productos,
            cart
        };*/
  } catch (err) {
    console.error("Error al obtener productos del backend:", err);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const regionSelect = document.getElementById("region");
  const comunaSelect = document.getElementById("comuna");
  let regionesComunasData = [];

  fetch("comunas-regiones.json")
    .then((response) => response.json())
    .then((data) => {
      regionesComunasData= data.regiones;
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
      console.warn(
        `No se encontraron comunas para la región: ${selectedRegion}`
      );
    }
  });
});

document
  .getElementById("checkout-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const costumerData = {
      rut: document.getElementById("rut").value,
      name: document.getElementById("name").value,
      lastname: document.getElementById("lastname").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      region: document.getElementById("region").value,
      comuna: document.getElementById("comuna").value,
      address: document.getElementById("address").value,
      apartment: document.getElementById("apartment").value,
      paymentMethod: document.querySelector('input[name="payment"]:checked')
        .value,
    };
  });
