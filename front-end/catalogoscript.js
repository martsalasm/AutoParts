import cart from "./cart.js";
import { getAdjustedPrice } from "./global.js";
const formatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
});

// Función para mostrar los productos en la página de catálogo
document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.getElementById("products-container");
  fetch("http://localhost:3000/productos")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((product) => {
        const productCard = document.createElement("div");
        const adjustedPrice = getAdjustedPrice(product);
        productCard.classList.add("product-card");
        productCard.innerHTML = `
                <h2 class=card-title>${product.nombre_producto}</h2>
                <img src="${product.url_imagen}" alt="${product.nombre_producto}">
                <p>Precio: ${formatter.format(adjustedPrice)}</p>
                <p>Marca: ${product.marca}</p>
                <p> Stock: ${product.stock} unidades</p>
                <button class="add-to-cart" data-id="${product.id_producto}">Agregar al carrito<i class="fas fa-shopping-cart" style="display:inline; margin-left:10px"></i> </button>
            `;
        productsContainer.appendChild(productCard);
        productCard.addEventListener("click", (event) => {
          if (!event.target.classList.contains("add-to-cart")) {
            const productId = product.id_producto;
            window.location.href = `producto.html?id=${productId}`;
          }
        });
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
      console.error("Error al cagar los productos:", error);
    });
});

// Función para mostrar/ocultar las categorías
document.getElementById("categorias-title").addEventListener("click", () => {
  var categoriasList = document.getElementsByClassName("categorias-list");

  for (let i = 0; i < categoriasList.length; i++) {
    if (window.innerWidth <= 600) {
      categoriasList[i].classList.toggle("visible");
    }
  }
});

// Función para renderizar productos
function renderProducts(data) {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = ""; // Limpia productos anteriores

  data.forEach((product) => {
    const productCard = document.createElement("div");
    const adjustedPrice = getAdjustedPrice(product);
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <h2 class="card-title">${product.nombre_producto}</h2>
      <img src="${product.url_imagen}" alt="${product.nombre_producto}">
      <p>Precio: $${adjustedPrice}</p>
      <p>Marca: ${product.marca}</p>
      <p>Stock: ${product.stock} unidades</p>
      <button class="add-to-cart" data-id="${product.id_producto}">
        Agregar al carrito <i class="fas fa-shopping-cart" style="display:inline; margin-left:10px"></i>
      </button>
    `;
    productsContainer.appendChild(productCard);
  });

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = event.target.getAttribute("data-id");
      cart.addToCart(productId);
      console.log("Producto agregado al carrito!");
    });
  });
}

document.querySelectorAll("li[data-id]").forEach((item) => {
  item.addEventListener("click", () => {
    const categoriaId = item.getAttribute("data-id");

    fetch(`http://localhost:3000/categorias/productos/${categoriaId}`)
      .then((response) => {
        if (!response.ok) throw new Error("No se encontraron productos");
        return response.json();
      })
      .then((data) => {
        renderProducts(data);
      })
      .catch((error) => {
        console.error("Error al cargar productos por categoría:", error);
      });
  });
});
