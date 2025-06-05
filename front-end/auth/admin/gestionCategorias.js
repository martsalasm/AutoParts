document.addEventListener('DOMContentLoaded', async function() {
  // Obtener los productos y categorías
  const productos = await obtenerProductos();
  const categorias = await obtenerCategorias();

  // Llenar el dropdown de productos
  const productoSelect = document.getElementById('producto');
  productos.forEach(producto => {
    const option = document.createElement('option');
    option.value = producto.id_producto;
    option.textContent = producto.nombre_producto;
    productoSelect.appendChild(option);
  });

  // Llenar el dropdown de categorías
  const categoriaSelect = document.getElementById('categoria');
  categorias.forEach(categoria => {
    const option = document.createElement('option');
    option.value = categoria.id_categoria;
    option.textContent = categoria.nombre_categoria;
    categoriaSelect.appendChild(option);
  });

  // Lógica para el formulario de vinculación
  const formVincular = document.getElementById('form-vincular');
  formVincular.addEventListener('submit', async function(event) {
    event.preventDefault();

    const idProducto = productoSelect.value;
    const idCategoria = categoriaSelect.value;

    // Validación
    if (!idProducto || !idCategoria) {
      console.log('Por favor, selecciona un producto y una categoría');
      return;
    }

    // Enviar la solicitud para vincular el producto a la categoría
    const response = await asignarProductoACategoria(idProducto, idCategoria);
    if (response.success) {
      console.log('Producto asignado correctamente a la categoría');
    } else {
      console.log('Hubo un error al asignar el producto a la categoría');
    }
  });
});

// Función para obtener los productos
async function obtenerProductos() {
  const response = await fetch('http://localhost:3000/productos');
  const productos = await response.json();
  return productos;
}

// Función para obtener las categorías
async function obtenerCategorias() {
  const response = await fetch('http://localhost:3000/categorias');
  const categorias = await response.json();
  return categorias;
}

// Función para asignar el producto a la categoría
async function asignarProductoACategoria(idProducto, idCategoria) {
  const response = await fetch('http://localhost:3000/categorias/productos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_producto: idProducto,
      id_categoria: idCategoria,
    }),
  });
  return await response.json();
}
