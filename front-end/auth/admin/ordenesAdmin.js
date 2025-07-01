document.addEventListener("DOMContentLoaded", () => {
    const ordenDetailsContainer = document.getElementById("orden-details");
    const productsOrdenContainer = document.getElementById("products-orden");
    // --- NUEVO: Referencia al botón de descarga ---
    const downloadCsvBtn = document.getElementById("download-csv-btn");

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
    };

    const urlParams = new URLSearchParams(window.location.search);
    const ordenId = urlParams.get('id');

    if (!ordenId) {
        ordenDetailsContainer.innerHTML = "<p>Error: No se ha encontrado el ID de la orden.</p>";
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
            // --- Renderizado de la página (sin cambios) ---
            const fechaFormateada = new Date(data.fecha).toLocaleString('es-CL');
            ordenDetailsContainer.innerHTML = `
                <h2>Resumen de la Orden</h2>
                <p><strong>Código de orden:</strong> #${data.id_orden}</p>
                <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                <p><strong>Método de Pago:</strong> ${data.metodo_pago}</p>
                
                <h2 style="margin-top: 2rem;">Datos del Cliente</h2>
                <p><strong>Nombre:</strong> ${data.nombre_cliente} ${data.apellido_cliente}</p>
                <p><strong>RUT:</strong> ${data.rut_cliente}</p>
                <p><strong>Correo:</strong> ${data.correo_cliente}</p>
                <p><strong>Teléfono:</strong> ${data.telefono_cliente}</p>
                
                <h2 style="margin-top: 2rem;">Datos de Entrega</h2>
                <p><strong>Tipo de Envío:</strong> ${data.tipo_envio}</p>
                <p><strong>Dirección:</strong> ${data.direccion_cliente}, ${data.comuna_cliente}, ${data.region_cliente}</p>
                ${data.apartamento_cliente ? `<p><strong>Departamento:</strong> ${data.apartamento_cliente}</p>` : ''}
            `;

            const productosHTML = data.productos && data.productos.length > 0
                ? data.productos.map(p => `
                    <tr>
                        <td class="product-info">
                            <img src="${p.url_imagen}" onerror="handleImageError(this)" alt="${p.nombre_producto}">
                            <span>${p.nombre_producto}</span>
                        </td>
                        <td style="text-align:center;">${p.cantidad}</td>
                        <td style="text-align:right;">${formatCurrency(p.precio_unitario)}</td>
                        <td style="text-align:right;">${formatCurrency(p.cantidad * p.precio_unitario)}</td>
                    </tr>
                `).join('')
                : '<tr><td colspan="4">No hay productos asociados a esta orden.</td></tr>';

            productsOrdenContainer.innerHTML = `
                <h2>Productos en la Orden</h2>
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
            
            //Habilitar el botón y añadir el evento de clic ---
            downloadCsvBtn.disabled = false; // Habilitar el botón una vez que los datos están cargados
            downloadCsvBtn.addEventListener('click', () => generateAndDownloadCSV(data));

        })
        .catch(error => {
            console.error("Error al cargar los detalles de la orden:", error);
            ordenDetailsContainer.innerHTML = `<p>Error al cargar los detalles de la orden: ${error.message}</p>`;
        });
});


/**
 * Genera y descarga un archivo CSV con formato de boleta.
 * - Muestra el precio unitario neto (sin IVA).
 * - Detalla los costos de envío por separado al final.
 * @param {object} orderData - El objeto JSON con los datos de la orden.
 */
function generateAndDownloadCSV(orderData) {
    // 1. Definir constantes y datos generales (sin cambios)
    const RUT_EMISOR = "11.111.111-1";
    const NOMBRE_EMISOR = "AUTOPARTS";
    const fechaEmision = new Date(orderData.fecha).toISOString().split('T')[0];
    const clienteNombreCompleto = `${orderData.nombre_cliente} ${orderData.apellido_cliente}`;

    const csvRows = [];

    // 2. Crear la cabecera con la información general (sin cambios)
    csvRows.push(`"Boleta Orden #${orderData.id_orden}"`);
    csvRows.push(`"Fecha Emisión:",${fechaEmision}`);
    csvRows.push(`"Emisor:",${NOMBRE_EMISOR}`);
    csvRows.push(`"RUT Emisor:",${RUT_EMISOR}`);
    csvRows.push(`"Cliente:",${clienteNombreCompleto}`);
    csvRows.push(`"RUT Cliente:",${orderData.rut_cliente}`);
    csvRows.push(`"Forma de Pago:",${orderData.metodo_pago}`);
    csvRows.push(''); 

    // 3. Crear la cabecera de la tabla de detalles
    const detailHeaders = [
        "Detalle",
        "Cantidad",
        "Precio Unitario (Neto)", // Se aclara que es el valor neto
        "Subtotal (Neto)",
        "IVA (19%)",
        "Total"
    ];
    csvRows.push(detailHeaders.join(','));

    // 4. Procesar cada producto para la tabla de detalles
    orderData.productos.forEach(p => {
        const totalProductoLinea = p.cantidad * p.precio_unitario;
        // Se calcula el precio unitario neto
        const precioUnitarioNeto = Math.round(p.precio_unitario / 1.19);
        // El subtotal neto es la cantidad por el precio unitario neto
        const subtotalNeto = p.cantidad * precioUnitarioNeto;
        // El IVA es la diferencia para llegar al total
        const iva = totalProductoLinea - subtotalNeto;

        const row = [
            `"${p.nombre_producto}"`,
            p.cantidad,
            precioUnitarioNeto,
            subtotalNeto,
            iva,
            totalProductoLinea
        ];
        csvRows.push(row.join(','));
    });

    // 5. NUEVO: Procesar el envío por separado al final del archivo
    if (orderData.valor_envio && orderData.valor_envio > 0) {
        // Añadir líneas en blanco para separar
        csvRows.push('');
        csvRows.push('');
        
        const totalEnvio = orderData.valor_envio;
        // Se calcula el IVA sobre el total del envío
        const ivaEnvio = Math.round(totalEnvio * 0.19);
        // El subtotal es el total menos el IVA calculado
        const subtotalEnvio = totalEnvio - ivaEnvio;

        // Se añaden las filas de resumen del envío
        csvRows.push(`"Subtotal Envío:",${subtotalEnvio}`);
        csvRows.push(`"IVA Envío (19%):",${ivaEnvio}`);
        csvRows.push(`"Total Envío:",${totalEnvio}`);
    }

    // 6. Crear y descargar el archivo (sin cambios)
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Boleta_Orden_${orderData.id_orden}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function handleImageError(image) {
  image.onerror = null; 
  image.src = '../../../media/logoautoparts2.png'; 
}
window.handleImageError = handleImageError;