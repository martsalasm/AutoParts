document.addEventListener("DOMContentLoaded", () => {
    const ordenDetailsContainer = document.getElementById("orden-details");
    const productsOrdenContainer = document.getElementById("products-orden");
    
    // Obtener el ID de la orden desde el localStorage
    const ordenId = localStorage.getItem("ordenId");
    localStorage.removeItem("cart");

    if (!ordenId) {
        ordenDetailsContainer.innerHTML = "<p>No se encontró una orden para mostrar. Gracias por tu visita.</p>";
        return;
    }

    // Función para formatear números a moneda CLP
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    };

    fetch(`http://localhost:3000/ordenes/${ordenId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener la orden");
            }
            return response.json();
        })
        .then(data => {
            // --- Renderizar Resumen de la Orden ---
            const fechaFormateada = new Date(data.fecha).toLocaleString('es-CL');
            ordenDetailsContainer.innerHTML = `
                <h2>Resumen de la Orden</h2>
                <p><strong>Código de orden:</strong> #${data.id_orden}</p>
                <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                <p><strong>Método de Pago:</strong> ${data.metodo_pago}</p>
                
                <h2 style="margin-top: 2rem;">Datos de Entrega</h2>
                <p><strong>Cliente:</strong> ${data.nombre_cliente} ${data.apellido_cliente}</p>
                <p><strong>Email:</strong> ${data.correo_cliente}</p>
                <p><strong>Tipo de Envío:</strong> ${data.tipo_envio}</p>
                <p><strong>Dirección:</strong> ${data.direccion_cliente}, ${data.comuna_cliente}</p>
                ${data.apartamento_cliente ? `<p><strong>Departamento:</strong> ${data.apartamento_cliente}</p>` : ''}
            `;

            // --- Renderizar Tabla de Productos y Totales ---
            const productosHTML = data.productos && data.productos.length > 0
                ? data.productos.map(p => `
                    <tr>
                        <td class="product-info">
                            <img src="${p.url_imagen || '/media/placeholder.png'}" alt="${p.nombre_producto}">
                            <span>${p.nombre_producto}</span>
                        </td>
                        <td style="text-align:center;">${p.cantidad}</td>
                        <td style="text-align:right;">${formatCurrency(p.precio_unitario)}</td>
                        <td style="text-align:right;">${formatCurrency(p.cantidad * p.precio_unitario)}</td>
                    </tr>
                `).join('')
                : '<tr><td colspan="4">No hay productos asociados a esta orden.</td></tr>';

            productsOrdenContainer.innerHTML = `
                <h2>Productos Comprados</h2>
                <div style="overflow-x:auto;">
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th style="text-align:center;">Cantidad</th>
                                <th style="text-align:right;">Precio Unit.</th>
                                <th style="text-align:right;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productosHTML}
                        </tbody>
                    </table>
                </div>
                <div class="totals-section">
                    <p><strong>Subtotal productos:</strong> ${formatCurrency(data.total - (data.valor_envio || 0))}</p>
                    <p><strong>Valor Envío:</strong> ${formatCurrency(data.valor_envio || 0)}</p>
                    <h3>Total Pagado: ${formatCurrency(data.total)}</h3>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error al cargar los detalles de la orden:", error);
            ordenDetailsContainer.innerHTML = "<p>Error al cargar los detalles de la orden.</p>";
        });

});