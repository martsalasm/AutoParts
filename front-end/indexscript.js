import cart from "./cart.js";

//función para mostrar los productos destacados
document.addEventListener("DOMContentLoaded", () => {
  const mostSoldProductsContainer = document.getElementById("most-sold");
  fetch("http://localhost:3000/categorias/productos/1")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
          <h2 class="card-title">${product.nombre_producto}</h2>
          <img src="${product.url_imagen}" alt="${product.nombre_producto}">
          <p>Precio: $${product.precio}</p>
          <p>Marca: ${product.marca}</p>
          <p>Stock: ${product.stock} unidades</p>
          <button class="add-to-cart" data-id="${product.id_producto}">Agregar al carrito</button>
        `;
        mostSoldProductsContainer.appendChild(productCard);
      });
      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", (event) => {
          const productId = event.target.getAttribute("data-id");
          cart.addToCart(productId);
          console.log("Producto agregado al carrito!");
        });
      });
    })
    .catch((error) => {
      console.error("Error al cargar los productos destacados:", error);
    });
});