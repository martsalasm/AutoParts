  const token = localStorage.getItem('token');
  const loginLink = document.getElementById('login-link');
  const tipo = localStorage.getItem('tipo');
  const tipoCliente = localStorage.getItem('tipoCliente');
  const rol = localStorage.getItem('rol');
  
  
  
  if (token && tipo ==="empleado" && rol === "admin") {
    loginLink.textContent = 'Mi Perfil';
    loginLink.href = '/auth/admin/admin-panel.html';
  }