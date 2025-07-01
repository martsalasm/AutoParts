  const token = localStorage.getItem('token');
  const loginLink = document.getElementById('login-link');
  const tipo = localStorage.getItem('tipo');
  const tipo_cliente = localStorage.getItem('tipo_cliente');
  const rol = localStorage.getItem('rol');
  import { showModal } from './modal.js';
  
  
if (token && tipo ==="empleado" && rol === "admin") {
    loginLink.textContent = 'Mi Perfil';
    loginLink.href = 'http://localhost:5501/front-end/auth/admin/admin-panel.html';
  };
if (token && tipo ==="cliente"){
    loginLink.textContent = 'Mi Perfil';
    loginLink.href = 'http://localhost:5501/front-end/auth/cliente/cliente-panel.html';
}

export function getAdjustedPrice(product) {
  const tipo = localStorage.getItem('tipo');
  const tipo_cliente = localStorage.getItem('tipo_cliente');


  if (tipo === 'cliente' && tipo_cliente === 'B2B') {
    return product.preciob2b || product.precio;
  }

  return product.precio;
}


// Función para obtener el carrito del localStorage
// Esta función devuelve el carrito almacenado en el localStorage como un objeto JavaScript
export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveCartToStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Función para actualizar el contador del carrito
// Esta función cuenta la cantidad total de productos en el carrito y actualiza el contador en la interfaz
export function updateCartCount() {
  const cart = getCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cart-count").textContent = cartCount;
}

// Función para agregar un producto al carrito
 export function addToCart(productId, cantidad = 1) {
  const id = Number(productId);
  const cart = getCart();
  const productIndex = cart.findIndex((item) => item.id === id);

  fetch(`http://localhost:3000/productos/${productId}`)
    .then(res => res.json())
    .then(product => {
      const stock = product.stock;
      if (productIndex > -1) {
        const nuevaCantidad = cart[productIndex].quantity + cantidad;
        cart[productIndex].quantity = Math.min(nuevaCantidad, stock);
      } else {
        cart.push({ id, quantity: Math.min(cantidad, stock) });

      }
        saveCartToStorage(cart);
        showModal('¡Éxito!', 'Producto agregado al carrito.', 'success'); 
        updateCartCount();
    })
    .catch(err => console.error("Error al verificar el stock:", err));
    showModal('Error', 'No se pudo agregar el producto.', 'error');
}

export function handleImageError(image) {
  image.onerror = null; // Evita bucles si la imagen de respaldo también falla.
  image.src = '../media/logoautoparts2.png'; // Ruta a tu imagen de respaldo.
}
window.handleImageError = handleImageError;