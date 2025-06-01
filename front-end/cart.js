// Funcion para iniciar el carrito en el localStorage si no existe
function initializeCart() {
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
  }
}
// Función para obtener el carrito del localStorage
// Esta función devuelve el carrito almacenado en el localStorage como un objeto JavaScript
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCartToStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Función para agregar un producto al carrito
function addToCart(productId) {
  const cart = getCart();
  const productIndex = cart.findIndex((item) => item.id === productId);
  if (productIndex > -1) {
    cart[productIndex].quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  updateCartUI(cart);
}
// Función para actualizar el contador del carrito
// Esta función cuenta la cantidad total de productos en el carrito y actualiza el contador en la interfaz
function updateCartCount() {
  const cart = getCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = cartCount;
}
// Función para actualizar la interfaz del carrito
// Esta función guarda el carrito en el localStorage y renderiza el carrito en la interfaz
function updateCartUI(cart) {
  saveCartToStorage(cart);
  const cartContainer = document.getElementById("cart-container");
  renderCart(cartContainer, cart);
}

// Función para eliminar un producto del carrito
// Esta función busca el producto en el carrito y lo elimina, o reduce su cantidad si hay más de uno
function removeFromCart(productId) {
  const cart = getCart();
  const cartContainer = document.getElementById("cart-container");
  const productIndex = cart.findIndex((item) => item.id === productId);
  if (productIndex !== -1) {
    cart.splice(productIndex, 1);
    updateCartUI(cart);
  }
}

// Función para renderizar el carrito en la interfaz
function renderCart(cartContainer, cart) {
  // Esto limpia el contenedor del carrito y lo vuelve a llenar con los productos actuales
  // Si el carrito está vacío, muestra un mensaje
  // Si hay productos, los muestra en el contenedor
  cartContainer.innerHTML = "";
  if (cart.length === 0) {
    cartContainer.innerHTML =
      "<h2 style='display: flex; justify-content:center; align-items:center; margin: 12.5% 0'>El carrito está vacío :(</h2>";
      const subtotalElement = document.getElementById("cart-subtotal");
        document.getElementById("subtotal-container").style.display = "none";
    if (subtotalElement) {
    subtotalElement.textContent = "$0";
    }

  } else {
    // Aquí se hace una llamada a la API para obtener los productos
    fetch("http://localhost:3000/productos")
      .then((response) => response.json())
      .then((data) => {
        const products = data.reduce((acc, product) => {
          acc[product.id_producto] = product;
          return acc;
        }, {});

        let subtotal = 0;
        //Aquí se recorre el carrito y se crean los elementos HTML para cada producto
        // Se crea un contenedor para cada producto y se le añade la información del producto
        cart.forEach((item) => {
          const product = products[item.id];
          if (product) {
            const cartCard = document.createElement("div");
            cartCard.classList.add("cart-card");
            cartCard.innerHTML = `
                                            <img src="${product.url_imagen}" alt="${product.nombre_producto}">
                                            <h2 class=cart-product-title>${product.nombre_producto}</h2>
                                            <p>Precio Unitario: $${product.precio}</p>
                                        `;
            subtotal += product.precio * item.quantity;
            const cantidadContainer = document.createElement("div");
            cantidadContainer.classList.add("cantidad-container");

            const botonResta = document.createElement("button");
            botonResta.innerHTML = '<i class="fa-solid fa-minus"></i>';
            botonResta.classList.add("boton-cantidad");
            botonResta.addEventListener("click", () => {
              if (item.quantity > 1) {
                item.quantity -= 1;
                updateCartUI(cart);
              }
            });

            const cantidadInput = document.createElement("input");
            cantidadInput.type = "number";
            cantidadInput.value = item.quantity;
            cantidadInput.min = 1;
            const maxValue = product.stock;
            cantidadInput.max = maxValue;
            cantidadInput.classList.add("cantidad-input");
            cantidadInput.addEventListener("change", () => {
              const newValue = parseInt(cantidadInput.value);
              if (newValue > 0 && newValue <= maxValue) {
                item.quantity = newValue;
                updateCartUI(cart);
              } else {
                console.log(`La cantidad máxima es ${maxValue}`);
                cantidadInput.value = item.quantity;
              }
              
            });

            const botonSuma = document.createElement("button");
            botonSuma.innerHTML = '<i class="fa-solid fa-plus"></i>';
            botonSuma.classList.add("boton-cantidad");
            botonSuma.addEventListener("click", () => {
              if (item.quantity < maxValue) {
                item.quantity += 1;
                updateCartUI(cart);
              } else {
                console.log(`La cantidad máxima es ${maxValue}`);
              }
            });
            cantidadContainer.appendChild(botonResta);
            cantidadContainer.appendChild(cantidadInput);
            cantidadContainer.appendChild(botonSuma);
            cartCard.appendChild(cantidadContainer);

            const trashContainer = document.createElement("div");
            trashContainer.classList.add("trash-container");
            const trashButton = document.createElement("button");
            trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            trashContainer.appendChild(trashButton);
            cartCard.appendChild(trashContainer);
            // Añadir evento al botón de eliminar
            // Al hacer clic en el botón de eliminar, se llama a la función removeFromCart
            trashButton.addEventListener("click", () => {
              removeFromCart(item.id);
            });
            cartContainer.appendChild(cartCard);
          }
        });
        if (cartContainer.children.length >0) {
          document.getElementById("subtotal-container").style.display = "flex";
        }
        const subtotalElement = document.getElementById("cart-subtotal");
        if (subtotalElement) {
          subtotalElement.textContent = `$${new Intl.NumberFormat(
            "es-CL"
          ).format(subtotal)}`;
        }
      })
      .catch((error) => {
        console.error("Error al cargar los productos del carrito:", error);
      });
  }
  updateCartCount();
}

// Evento para cargar el carrito al cargar la página
// Al cargar la página, se obtiene el contenedor del carrito y se llama a la función renderCart
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cart = getCart();
  renderCart(cartContainer, cart);
});

export default { initializeCart, addToCart, updateCartCount };
