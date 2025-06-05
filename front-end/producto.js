import { getAdjustedPrice } from "./global.js";
// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const formatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});


if (productId) {
  fetch(`http://localhost:3000/productos/${productId}`)
    .then((response) => {
      if (!response.ok) throw new Error("Producto no encontrado");
      return response.json();
    })
    .then((product) => {
      const container = document.getElementById("product-detail");
      const adjustedPrice = getAdjustedPrice(product);
      container.innerHTML = `
        <h1>${product.nombre_producto}</h1>
        <img src="${product.url_imagen}" alt="${product.nombre_producto}" />
        <p><strong>Marca:</strong> ${product.marca}</p>
        <p><strong>Precio:</strong> ${formatter.format(product.precio)}</p>
        <p><strong>Precio Mayorista:</strong> ${formatter.format(product.preciob2b)}</p>
        <p><strong>Stock:</strong> ${product.stock}</p>
        <p><strong>Descripción:</strong> ${product.descripcion_producto}</p>
        <p><strong>Peso:</strong> ${product.product_weight} kg</p>
        <p><strong>Dimensiones:</strong> ${product.product_height} x ${product.product_width} x ${product.product_length} cm</p>

        <div class="cantidad-container">
            <button id="decrease" class="boton-cantidad"><i class="fa-solid fa-minus"></i></button>
            <input type="number" id="cantidad" class="cantidad-input" value="1" min="1" max="${product.stock}">
            <button id="increase" class="boton-cantidad"><i class="fa-solid fa-plus"></i></button>
        </div>
    
        <button class="add-to-cart" data-id="${product.id_producto}">Agregar al carrito</button>
      `;
const inputCantidad = document.getElementById("cantidad");
const botonIncrease = document.getElementById("increase");
const botonDecrease = document.getElementById("decrease");

botonIncrease.addEventListener("click", () => {
  let cantidad = parseInt(inputCantidad.value);
  if (cantidad < product.stock) {
    inputCantidad.value = cantidad + 1;
  }
});

botonDecrease.addEventListener("click", () => {
  let cantidad = parseInt(inputCantidad.value);
  if (cantidad > 1) {
    inputCantidad.value = cantidad - 1;
  }
});

inputCantidad.addEventListener("change", () => {
  let cantidad = parseInt(inputCantidad.value);
  if (cantidad < 1) inputCantidad.value = 1;
  if (cantidad > product.stock) inputCantidad.value = product.stock;
});

      // Agrega funcionalidad al botón
        document.querySelector(".add-to-cart").addEventListener("click", () => {
            const cantidad = parseInt(document.getElementById("cantidad").value) || 1;
                import("./cart.js").then((module) => {
                    module.default.addToCart(product.id_producto, cantidad);
                console.log("Producto agregado al carrito");
        });
      });
    })
    .catch((error) => {
      document.getElementById("product-detail").innerText = "Producto no disponible.";
      console.error("Error:", error);
    });
}
