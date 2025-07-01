document.addEventListener("DOMContentLoaded", () => {
  // Contenedores donde se mostrará la información
  const summaryContainer = document.getElementById("order-summary-container");
  const productsContainer = document.getElementById("order-products-container");
  const mainContainer = document.querySelector(".order-detail-container");

  // --- 1. Obtener ID de la orden y Token de autenticación ---
  const urlParams = new URLSearchParams(window.location.search);
  const ordenId = urlParams.get('id');
  const token = localStorage.getItem('token');

  // Si falta el ID o el token, no continuar y mostrar error
  if (!ordenId || !token) {
    mainContainer.innerHTML = "<h1>Error de Acceso</h1><p>No se pudo verificar la orden o tu sesión. Por favor, <a href='misOrdenes.html'>vuelve al listado</a> e inténtalo de nuevo.</p>";
    return;
  }
  
  // Función para decodificar el RUT del usuario desde el token JWT
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };
  
  const userData = parseJwt(token);
  const userRut = userData ? userData.rut : null;

  // --- 2. Realizar la petición al servidor ---
  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/ordenes/${ordenId}`, {
        headers: {
          'Authorization': `Bearer ${token}` // ¡Clave! Enviar el token para la autorización
        }
      });

      if (!response.ok) {
        throw new Error(`No se pudo obtener la orden. Código: ${response.status}`);
      }

      const order = await response.json();
      
      // --- 3. ¡Verificación de seguridad! ---
      // Comprobar que el RUT de la orden coincida con el RUT del token
      if (order.rut_cliente !== userRut) {
        throw new Error("Acceso denegado. Esta orden no te pertenece.");
      }
      
      // Si todo está bien, renderizar los datos
      renderOrderSummary(order);
      renderOrderProducts(order);

    } catch (error) {
      console.error("Error al cargar los detalles de la orden:", error);
      mainContainer.innerHTML = `<h1>Error al Cargar la Orden</h1><p>${error.message}</p><a href="misOrdenes.html" class="boton-volver">Volver</a>`;
    }
  };

  // --- 4. Funciones para renderizar el HTML ---

  // Muestra el resumen (fecha, envío, dirección)
  const renderOrderSummary = (order) => {
    const fechaFormateada = new Date(order.fecha).toLocaleString('es-CL');
    summaryContainer.innerHTML = `
      <h2>Resumen de la Orden</h2>
      <p><strong>Código de orden:</strong> #${order.id_orden}</p>
      <p><strong>Fecha:</strong> ${fechaFormateada}</p>
      <p><strong>Método de Pago:</strong> ${order.metodo_pago}</p>
      
      <h2 style="margin-top: 2rem;">Detalles de Entrega</h2>
      <p><strong>Tipo de Envío:</strong> ${order.tipo_envio}</p>
      <p><strong>Dirección:</strong> ${order.direccion_cliente}, ${order.comuna_cliente}, ${order.region_cliente}</p>
      ${order.apartamento_cliente ? `<p><strong>Departamento:</strong> ${order.apartamento_cliente}</p>` : ''}
    `;
  };

  // Muestra la tabla de productos y los totales
  const renderOrderProducts = (order) => {
    productsContainer.innerHTML = `
      <h2>Productos en tu Orden</h2>
      <div style="overflow-x:auto;">
        <table class="products-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th style="text-align:center;">Cantidad</th>
              <th style="text-align:right;">Precio Unit.</th>
              <th style="text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.productos.map(p => `
              <tr>
                <td class="product-info">
                  <img src="${p.url_imagen}" onerror="handleImageError(this)  alt="${p.nombre_producto}">
                  <span>${p.nombre_producto}</span>
                </td>
                <td style="text-align:center;">${p.cantidad}</td>
                <td style="text-align:right;">${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(p.precio_unitario)}</td>
                <td style="text-align:right;">${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(p.cantidad * p.precio_unitario)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="totals-section">
        <p><strong>Subtotal productos:</strong> ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.total - (order.valor_envio || 0))}</p>
        <p><strong>Valor Envío:</strong> ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.valor_envio || 0)}</p>
        <h3>Total Pagado: ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(order.total)}</h3>
      </div>
    `;
  };

  fetchOrderDetails();
});

function handleImageError(image) {
  image.onerror = null; // Evita bucles si la imagen de respaldo también falla.
  image.src = '../../../media/logoautoparts2.png'; // Ruta a tu imagen de respaldo.
}
window.handleImageError = handleImageError;