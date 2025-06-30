import { showModal } from "../../modal.js";


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
      showModal('Éxito', 'Producto vinculado correctamente', 'success');
    } else {
      showModal('Error', 'No se pudo vincular', 'error');
    }

    // Resetear los selects
    productoSelect.value = '';
    categoriaSelect.value = '';
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

document.addEventListener('DOMContentLoaded', async function() {
  const categorias = await obtenerCategorias();

  // Llenar dropdown de categorías
  const categoriaSelect = document.getElementById('categoria-desvincular');
  categorias.forEach(categoria => {
    const option = document.createElement('option');
    option.value = categoria.id_categoria;
    option.textContent = categoria.nombre_categoria;
    categoriaSelect.appendChild(option);
  });

  // Event listener para cuando se selecciona una categoría
  categoriaSelect.addEventListener('change', async function() {
    const idCategoria = categoriaSelect.value;
    const productoSelect = document.getElementById('producto-desvincular');
    const botonDesvincular = document.getElementById('desvincular-btn');

    // Si se seleccionó una categoría
    if (idCategoria) {
      // Habilitamos el dropdown de productos
      productoSelect.disabled = false;
      botonDesvincular.disabled = false;

      // Obtenemos los productos de la categoría seleccionada
      const productos = await obtenerProductosPorCategoria(idCategoria);

      // Limpiar las opciones previas
      productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';

      // Llenar el dropdown de productos
      productos.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.id_producto;
        option.textContent = producto.nombre_producto;
        productoSelect.appendChild(option);
      });
    } else {
      // Si no hay categoría seleccionada, deshabilitar el dropdown de productos
      productoSelect.disabled = true;
      botonDesvincular.disabled = true;
    }
  });

  // Formulario para desvincular producto
  const formDesvincular = document.getElementById('form-desvincular');
  formDesvincular.addEventListener('submit', async function(event) {
    event.preventDefault();

    const idProducto = document.getElementById('producto-desvincular').value;
    const idCategoria = document.getElementById('categoria-desvincular').value;

    if (!idProducto || !idCategoria) {
      console.log('Por favor, selecciona un producto y una categoría');
      return;
    }

    const response = await desvincularProductoDeCategoria(idProducto, idCategoria);
    if (response.success) {
      showModal('Éxito', 'Producto desvinculado correctamente', 'success');
    } else {
      showModal('Error', 'No se pudo desvincular correctamente', 'error');
    }

    // Resetear los selects
    document.getElementById('producto-desvincular').value = '';
    document.getElementById('categoria-desvincular').value = '';
  });
});

// Función para obtener los productos de una categoría
async function obtenerProductosPorCategoria(idCategoria) {
  const response = await fetch(`http://localhost:3000/categorias/productos/${idCategoria}`);
  const productos = await response.json();
  
  // Verifica si productos es un arreglo antes de usar forEach
  if (Array.isArray(productos)) {
    return productos;
  } else {
    console.error('Se esperaba un arreglo de productos, pero se recibió:', productos);
    return [];
  }
}

// Función para desvincular un producto de categoría
async function desvincularProductoDeCategoria(idProducto, idCategoria) {
  const response = await fetch('http://localhost:3000/categorias/productos/desvincular', {
    method: 'DELETE',
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
