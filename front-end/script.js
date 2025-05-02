document.addEventListener("DOMContentLoaded", ()=>{
    const productsContainer = document.getElementById("products-container");
    fetch("http://localhost:3000/productos")
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <h2 class=card-title>${product.nombre_producto}</h2>
                <img src="${product.url_imagen}" alt="${product.nombre_producto}">
                <p>Precio: $${product.precio}</p>
                <p>Precio Mayorista: $${product.preciob2b}</p>
                <p> Stock: ${product.stock}</p>
                <button class="add-to-cart" data-id="${product.id_producto}">Agregar al carrito</button>
            `;
            productsContainer.appendChild(productCard);
        });
    }).catch(error => {
        console.error("Error al cagar los productos:", error);
    });
});