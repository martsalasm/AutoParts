

// Funcion para iniciar el carrito en el localStorage si no existe
function initializeCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}

// Función para agregar un producto al carrito
function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex > -1) {
        cart[productIndex].quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}
// Función para actualizar el contador del carrito
// Esta función cuenta la cantidad total de productos en el carrito y actualiza el contador en la interfaz
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

// Función para obtener el carrito del localStorage
// Esta función devuelve el carrito almacenado en el localStorage como un objeto JavaScript
function getCart() {
    return JSON.parse(localStorage.getItem('cart'));
}
// Función para eliminar un producto del carrito
// Esta función busca el producto en el carrito y lo elimina, o reduce su cantidad si hay más de uno
function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart'))
    const cartContainer = document.getElementById("cart-container");
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !==-1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;}
        else {
            cart.splice(productIndex, 1);
        
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    
        renderCart(cartContainer,cart);
        updateCartCount();
    }
}

// Función para renderizar el carrito en la interfaz
function renderCart(cartContainer, cart) {
    // Esto limpia el contenedor del carrito y lo vuelve a llenar con los productos actuales
    // Si el carrito está vacío, muestra un mensaje
    // Si hay productos, los muestra en el contenedor
    cartContainer.innerHTML = "";
    if (cart.length === 0) {
        cartContainer.innerHTML = "<h2 style='display: flex; justify-content:center; align-items:center; margin: 12.5% 0';>El carrito está vacío :(</h2>";
    }
        else{
            // Aquí se hace una llamada a la API para obtener los productos
            fetch("http://localhost:3000/productos")
            .then(response => response.json())
            .then(data => {
                const products = data.reduce((acc, product) => {
                    acc[product.id_producto] = product;
                    return acc;
                }, {});
            //Aquí se recorre el carrito y se crean los elementos HTML para cada producto
            // Se crea un contenedor para cada producto y se le añade la información del producto
            cart.forEach(item => {
                const product = products[item.id];
                if (product) {
                    const cartCard = document.createElement("div");
                    cartCard.classList.add("cart-card");
                    cartCard.innerHTML = `
                                            <img src="${product.url_imagen}" alt="${product.nombre_producto}">
                                            <h2 class=cart-product-title>${product.nombre_producto}</h2>
                                            <p>Cantidad: ${item.quantity}</p>
                                            <p>Precio: $${product.precio}</p>
                                        `;
                    const trashButton = document.createElement("button");
                    trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                    cartCard.appendChild(trashButton);
                    // Añadir evento al botón de eliminar
                    // Al hacer clic en el botón de eliminar, se llama a la función removeFromCart
                    trashButton.addEventListener("click", () => {
                        removeFromCart(item.id);});
                    cartContainer.appendChild(cartCard);
                }
            });
            })
            .catch(error => {
                console.error("Error al cargar los productos del carrito:", error);
            });
        }
    }

// Evento para cargar el carrito al cargar la página
// Al cargar la página, se obtiene el contenedor del carrito y se llama a la función renderCart
    document.addEventListener("DOMContentLoaded", () => {
        const cartContainer = document.getElementById("cart-container");
        const cart = getCart();
        renderCart(cartContainer, cart);
    });




export default { initializeCart, addToCart, updateCartCount };