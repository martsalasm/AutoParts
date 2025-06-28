document.addEventListener("DOMContentLoaded", () => {
  const ordenDetails = document.getElementById("orden-details");
  const productsOrden = document.getElementById("products-orden");
  let subtotal = 0;

  // Obtener el ID de la orden desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const ordenId = urlParams.get('id'); // Se asume que el parámetro en la URL es 'id'

  if (!ordenId) {
    ordenDetails.innerHTML = "<p>Error: No se ha encontrado el ID de la orden.</p>";
    return;
  }

  fetch(`http://localhost:3000/ordenes/${ordenId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al obtener la orden");
      }
      return response.json();
    })
    .then(data => {
      subtotal = data.total;
      ordenDetails.innerHTML = `
        <h2>Fecha: ${new Date(data.fecha).toLocaleString()} <br> Código de orden: #${data.id_orden}</h2>
        <h2>Datos Cliente</h2>
        <p><strong>Nombre Cliente:</strong> ${data.nombre_cliente} ${data.apellido_cliente}</p>
        <p><strong>Rut: </strong>${data.rut_cliente}</p>
        <p><strong>Correo:</strong> ${data.correo_cliente}</p>
        <p><strong>Teléfono:</strong> ${data.telefono_cliente}</p>
        <p><strong>Tipo de Envío:</strong> ${data.tipo_envio}</p>
        <p><strong>Dirección:</strong> ${data.direccion_cliente}, ${data.comuna_cliente}, ${data.region_cliente}</p>
        ${data.apartamento_cliente ? `<p><strong>Apartamento:</strong> ${data.apartamento_cliente}</p>` : ''}
        <p><strong>Método de Pago:</strong> ${data.metodo_pago}</p>
      `;

      productsOrden.innerHTML = `
        <h2>Productos:</h2>
        <div style="overflow-x:auto; width:100%; margin-top:20px;">
          <table border="0" cellpadding="10" cellspacing="0" style="width:100%; border-collapse:collapse; background-color:rgb(36,36,36); border-radius:5px;">
            <thead>
              <tr>
                <th>Producto</th>
                <th style="text-align:center; padding:10px;">Cantidad</th>
                <th style="text-align:center; padding:10px;">Precio Unitario</th>
                <th style="text-align:center; padding:10px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${data.productos && data.productos.length > 0 ? 
                data.productos.map(producto => `
                  <tr>
                    <td style="display: flex; align-items: center; gap: 10px;">
                      <img src="${producto.url_imagen}" alt="${producto.nombre_producto}" style="width:50px; height:50px; object-fit:cover;">
                      <span>${producto.nombre_producto}</span>
                    </td>
                    <td style="text-align:center;">${producto.cantidad}</td>
                    <td style="text-align:center;">$${producto.precio_unitario.toLocaleString('es-CL')}</td>
                    <td style="text-align:center;">$${(producto.cantidad * producto.precio_unitario).toLocaleString('es-CL')}</td>
                  </tr>
                `).join('')
                : '<tr><td colspan="4">No hay productos asociados a esta orden.</td></tr>'
              }
            </tbody>
          </table>
        </div>
        <p style="text-align:right"><strong>Valor Envío:</strong> $${data.valor_envio ? data.valor_envio.toLocaleString('es-CL') : '0'}</p>
        <h2 style="text-align:right">Total: $${subtotal.toLocaleString('es-CL')}</h2>
      `;
    })
    .catch(error => {
      console.error("Error al cargar los detalles de la orden:", error);
      ordenDetails.innerHTML = "<p>Error al cargar los detalles de la orden.</p>";
    });
});
