function initializeCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
}



initializeCart();


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

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}
function getCart() {
    return JSON.parse(localStorage.getItem('cart'));
}

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


function renderCart(cartContainer, cart) {
    cartContainer.innerHTML = "";
    if (cart.length === 0) {
        cartContainer.innerHTML = "<h2 style='display: flex; justify-content:center; align-items:center; margin: 12.5% 0';>El carrito está vacío :(</h2>";
    }
        else{
            fetch("http://localhost:3000/productos")
            .then(response => response.json())
            .then(data => {
                const products = data.reduce((acc, product) => {
                    acc[product.id_producto] = product;
                    return acc;
                }, {});
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


    document.addEventListener("DOMContentLoaded", () => {
        const cartContainer = document.getElementById("cart-container");
        const cart = getCart();
        renderCart(cartContainer, cart);
    });




export default { initializeCart, addToCart, updateCartCount };