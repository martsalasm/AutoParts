  // Se ejecuta cuando el DOM está completamente cargado
  document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    
    // Si no hay token, redirigir al login para seguridad
    if (!token) {
      window.location.href = '../login.html'; // Ajusta la ruta a tu página de login
      return;
    }

    // Función para decodificar el payload del token JWT
    const parseJwt = (token) => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
      } catch (e) {
        console.error("Error al decodificar el token:", e);
        return null;
      }
    };
    
    const tokenData = parseJwt(token);
    
    // Si el token es inválido o no contiene el RUT
    if (!tokenData || !tokenData.rut) {
      const messageContainer = document.getElementById('message-container');
      messageContainer.textContent = 'Error: No se pudo verificar tu identidad. Por favor, inicia sesión de nuevo.';
      document.querySelector('#ordenes-table thead').style.display = 'none'; // Ocultar cabecera
      return;
    }

    const clienteRut = tokenData.rut;
    loadUserOrders(clienteRut, token);
  });

  // Función para cargar las órdenes del cliente desde el servidor
  const loadUserOrders = async (rut, token) => {
    const tableBody = document.querySelector('#ordenes-table tbody');
    const messageContainer = document.getElementById('message-container');
    console.log(rut)
    try {
      // Usamos el endpoint que nos indicaste para buscar por RUT
      const response = await fetch(`http://localhost:3000/ordenes/cliente/${rut}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          messageContainer.textContent = 'Aún no tienes órdenes registradas.';
          document.querySelector('#ordenes-table thead').style.display = 'none'; // Ocultar cabecera
          return;
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const ordenes = await response.json();
      
      if (ordenes.length === 0) {
        messageContainer.textContent = 'Aún no tienes órdenes registradas.';
        document.querySelector('#ordenes-table thead').style.display = 'none'; // Ocultar cabecera
        return;
      }

      // Si hay órdenes, ocultamos el mensaje de "cargando"
      messageContainer.style.display = 'none';

      // Limpiamos el cuerpo de la tabla por si acaso
      tableBody.innerHTML = '';
      
      ordenes.forEach(orden => {
        const row = document.createElement('tr');
        
        const fechaFormateada = new Date(orden.fecha).toLocaleDateString('es-CL', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
        
        const totalFormateado = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(orden.total);

        row.innerHTML = `
          <td>#${orden.id_orden}</td>
          <td>${fechaFormateada}</td>
          <td>${totalFormateado}</td>
          <td>
            <button class="detalle-btn" onclick="verDetalle(${orden.id_orden})">Ver Detalle</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

    } catch (error) {
      console.error('Error al cargar las órdenes:', error);
      messageContainer.textContent = 'No se pudieron cargar tus órdenes. Inténtalo de nuevo más tarde.';
      document.querySelector('#ordenes-table thead').style.display = 'none';
    }
  };

  const verDetalle = (idOrden) => {
    window.location.href = `ordenesCliente.html?id=${idOrden}`;
  };
