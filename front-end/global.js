  const token = localStorage.getItem('token');
  const loginLink = document.getElementById('login-link');
  const tipo = localStorage.getItem('tipo');
  const tipo_cliente = localStorage.getItem('tipo_cliente');
  const rol = localStorage.getItem('rol');
  
  
  
  if (token && tipo ==="empleado" && rol === "admin") {
    loginLink.textContent = 'Mi Perfil';
    loginLink.href = 'http://localhost:5501/front-end/auth/admin/admin-panel.html';
  };

export function getAdjustedPrice(product) {
  const tipo = localStorage.getItem('tipo');
  const tipo_cliente = localStorage.getItem('tipo_cliente');

  console.log('Tipo:', tipo); // Debugging line
  console.log('Tipo Cliente:', tipo_cliente); // Debugging line

  if (tipo === 'cliente' && tipo_cliente === 'B2B') {
    return product.preciob2b || product.precio;
  }

  return product.precio;
}

