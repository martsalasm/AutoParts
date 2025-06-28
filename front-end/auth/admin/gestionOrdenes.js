 // Función para cargar las órdenes desde el servidor
  const loadOrdenes = async () => {
    try {
      const response = await fetch('http://localhost:3000/ordenes');
      if (!response.ok) {
        throw new Error('No se pudieron obtener las órdenes');
      }
      const ordenes = await response.json();
      const tableBody = document.querySelector('#ordenes-table tbody');

      if (ordenes.length === 0) {
        document.getElementById('error-message').innerText = 'No se encontraron órdenes.';
        return;
      }

      ordenes.forEach(orden => {
        const row = document.createElement('tr');
        row.dataset.rut = orden.rut_cliente; // Guardamos el RUT como atributo de la fila
        row.innerHTML = `
          <td>${orden.id_orden}</td>
          <td>${orden.rut_cliente}</td>
          <td>${orden.nombre_cliente} ${orden.apellido_cliente}</td>
          <td>${orden.correo_cliente}</td>
          <td>${new Date(orden.fecha).toLocaleString()}</td>
          <td>$${orden.total}</td>
        `;

        // Agregar evento de clic a la fila
        row.addEventListener('click', () => {
          window.location.href = `ordenesAdmin.html?id=${orden.id_orden}`;
        });

        tableBody.appendChild(row);
      });
    } catch (error) {
      document.getElementById('error-message').innerText = error.message;
    }
  };

  // Función para filtrar las filas según el RUT
  const filterRows = () => {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const rows = document.querySelectorAll('#ordenes-table tbody tr');

    rows.forEach(row => {
      const rut = row.dataset.rut.toLowerCase();
      if (rut.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  };

  // Evento para activar el filtro cuando el usuario escribe en la barra de búsqueda
  document.getElementById('search-bar').addEventListener('input', filterRows);

  window.onload = loadOrdenes;