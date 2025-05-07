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
                <button class="add-to-cart" data-id="${product.id_producto}">Agregar al carrito</button>
            `;
            productsContainer.appendChild(productCard);
        });
    }).catch(error => {
        console.error("Error al cagar los productos:", error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const mostSoldProductsContainer = document.getElementById("most-sold");
    fetch("http://localhost:3000/productos")
    .then(response => response.json())
    .then(data => {
        data.forEach(product => {
            if (product.id_producto === 3 || product.id_producto == 6 || product.id_producto == 9) {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");
                productCard.innerHTML = `
                    <h2 class=card-title>${product.nombre_producto}</h2>
                    <img src="${product.url_imagen}" alt="${product.nombre_producto}">
                    <p>Precio: $${product.precio}</p>
                    <p>Precio Mayorista: $${product.preciob2b}</p>
                    <p> Stock: ${product.stock} unidades</p>
                    <button class="add-to-cart" data-id="${product.id_producto}">Agregar al carrito</button>
                `;
                mostSoldProductsContainer.appendChild(productCard);
            }
        });
    }).catch(error => {
        console.error("Error al cargar los productos más vendidos:", error);
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