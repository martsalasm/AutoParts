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
                <p> Stock: ${product.stock} unidades</p>
                <button class="add-to-cart" data-id="${product.id_producto}">Agregar al carrito<i class="fas fa-shopping-cart" style="display:inline; margin-left:10px"></i> </button>
            `;
            productsContainer.appendChild(productCard);
        });
    }).catch(error => {
        console.error("Error al cagar los productos:", error);
    });
});


document.getElementById("categorias-title").addEventListener("click", () => {
    var categoriasList = document.getElementsByClassName("categorias-list");

    for (let i = 0; i < categoriasList.length; i++) {
        if (window.innerWidth <= 600) {
            categoriasList[i].classList.toggle('visible');
        }
    }
});