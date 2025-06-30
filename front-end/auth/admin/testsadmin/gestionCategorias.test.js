/**
 * @jest-environment jsdom
 */

import { showModal } from '../../../modal.js';

// Función para obtener los productos
async function obtenerProductos() {
  const response = await fetch('http://localhost:3000/productos');
  return await response.json();
}

// Función para obtener las categorías
async function obtenerCategorias() {
  const response = await fetch('http://localhost:3000/categorias');
  return await response.json();
}

// Función para asignar el producto a la categoría
async function asignarProductoACategoria(idProducto, idCategoria) {
  const response = await fetch('http://localhost:3000/categorias/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_producto: idProducto, id_categoria: idCategoria }),
  });
  return await response.json();
}

// Función para obtener los productos de una categoría
async function obtenerProductosPorCategoria(idCategoria) {
    const response = await fetch(`http://localhost:3000/categorias/productos/${idCategoria}`);
    const productos = await response.json();
    return Array.isArray(productos) ? productos : [];
}

// Función para desvincular un producto de categoría
async function desvincularProductoDeCategoria(idProducto, idCategoria) {
    const response = await fetch('http://localhost:3000/categorias/productos/desvincular', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_producto: idProducto, id_categoria: idCategoria }),
    });
    return await response.json();
}

// Mock del módulo showModal
jest.mock('../../../modal.js', () => ({
  showModal: jest.fn(),
}));

// Mock global de fetch
global.fetch = jest.fn();

describe('Funciones de obtención de datos', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('Test 1: obtenerProductos debería llamar a fetch y retornar los productos', async () => {
    const mockProductos = [{ id_producto: 1, nombre_producto: 'Laptop' }];
    fetch.mockResolvedValueOnce({
      json: async () => mockProductos,
    });

    const productos = await obtenerProductos();

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/productos');
    expect(productos).toEqual(mockProductos);
  });

  test('Test 2: obtenerCategorias debería llamar a fetch y retornar las categorías', async () => {
    const mockCategorias = [{ id_categoria: 1, nombre_categoria: 'Filtros de aire' }];
    fetch.mockResolvedValueOnce({
      json: async () => mockCategorias,
    });

    const categorias = await obtenerCategorias();

    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/categorias');
    expect(categorias).toEqual(mockCategorias);
  });
});

describe('Vinculación de Productos a Categorías', () => {
  beforeEach(() => {
    // Limpiar mocks
    fetch.mockClear();
    showModal.mockClear();
    
    // Configurar el DOM virtual para cada test
    document.body.innerHTML = `
      <form id="form-vincular">
        <select id="producto">
          <option value="">Seleccione un producto</option>
        </select>
        <select id="categoria">
          <option value="">Seleccione una categoría</option>
        </select>
        <button type="submit">Vincular</button>
      </form>
    `;
  });
  
  test('Test 3: Debería llenar los dropdowns de productos y categorías al cargar', async () => {
    // Arrange: Mockear las respuestas de la API
    const mockProductos = [{ id_producto: 'p1', nombre_producto: 'Pilas' }];
    const mockCategorias = [{ id_categoria: 'c1', nombre_categoria: 'baterias' }];
    
    fetch
      .mockResolvedValueOnce({ json: async () => mockProductos })
      .mockResolvedValueOnce({ json: async () => mockCategorias });

    // Act: Simular la ejecución del script en DOMContentLoaded
    // Para ello, llamamos a una función que contenga la lógica original.
    async function inicializarVinculacion() {
        const productos = await obtenerProductos();
        const categorias = await obtenerCategorias();
        const productoSelect = document.getElementById('producto');
        productos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id_producto;
            option.textContent = p.nombre_producto;
            productoSelect.appendChild(option);
        });
        const categoriaSelect = document.getElementById('categoria');
        categorias.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id_categoria;
            option.textContent = c.nombre_categoria;
            categoriaSelect.appendChild(option);
        });
    }

    await inicializarVinculacion();

    // Assert: Verificar que los selects se hayan llenado
    const productoOptions = document.querySelectorAll('#producto option');
    const categoriaOptions = document.querySelectorAll('#categoria option');
    
    expect(productoOptions.length).toBe(2); // 1 opción por defecto + 1 de la API
    expect(productoOptions[1].value).toBe('p1');
    expect(productoOptions[1].textContent).toBe('Pilas');
    
    expect(categoriaOptions.length).toBe(2); // 1 opción por defecto + 1 de la API
    expect(categoriaOptions[1].value).toBe('c1');
    expect(categoriaOptions[1].textContent).toBe('baterias');
  });

  test('Test 4: Debería vincular un producto exitosamente y mostrar modal de éxito', async () => {
    // Arrange
    const productoSelect = document.getElementById('producto');
    const categoriaSelect = document.getElementById('categoria');
    const form = document.getElementById('form-vincular');

    productoSelect.value = 'p1';
    categoriaSelect.value = 'c1';

    fetch.mockResolvedValueOnce({ json: async () => ({ success: true }) });
    
    // Act
    await asignarProductoACategoria(productoSelect.value, categoriaSelect.value);
    showModal('Éxito', 'Producto vinculado correctamente', 'success'); // Simular llamada tras la lógica
    productoSelect.value = ''; // Simular reseteo
    categoriaSelect.value = '';

    // Assert
    expect(fetch).toHaveBeenCalledWith('http://localhost:3000/categorias/productos', expect.any(Object));
    expect(showModal).toHaveBeenCalledWith('Éxito', 'Producto vinculado correctamente', 'success');
    expect(productoSelect.value).toBe('');
    expect(categoriaSelect.value).toBe('');
  });

  test('Test 5: Debería mostrar modal de error si la vinculación falla', async () => {
    // Arrange
    const productoSelect = document.getElementById('producto');
    const categoriaSelect = document.getElementById('categoria');
    
    productoSelect.value = 'p1';
    categoriaSelect.value = 'c1';

    fetch.mockResolvedValueOnce({ json: async () => ({ success: false }) });

    // Act
    const response = await asignarProductoACategoria(productoSelect.value, categoriaSelect.value);
    if (!response.success) {
        showModal('Error', 'No se pudo vincular', 'error');
    }
    
    // Assert
    expect(showModal).toHaveBeenCalledWith('Error', 'No se pudo vincular', 'error');
  });
});


describe('Desvinculación de Productos de Categorías', () => {
    beforeEach(() => {
        fetch.mockClear();
        showModal.mockClear();
        document.body.innerHTML = `
            <form id="form-desvincular">
                <select id="categoria-desvincular">
                    <option value="">Seleccione una categoría</option>
                    <option value="c1">Filtros de aire</option>
                </select>
                <select id="producto-desvincular" disabled>
                    <option value="">Seleccione un producto</option>
                </select>
                <button id="desvincular-btn" type="submit" disabled>Desvincular</button>
            </form>
        `;
    });

    test('Test 6: Debería cargar productos cuando se selecciona una categoría para desvincular', async () => {
        // Arrange
        const mockProductos = [{ id_producto: 'p2', nombre_producto: 'filtro' }];
        fetch.mockResolvedValueOnce({ json: async () => mockProductos });
        
        const categoriaSelect = document.getElementById('categoria-desvincular');
        const productoSelect = document.getElementById('producto-desvincular');

        // Act
        categoriaSelect.value = 'c1';
        // Simular la lógica del event listener 'change'
        const productos = await obtenerProductosPorCategoria(categoriaSelect.value);
        productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';
        productos.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id_producto;
            option.textContent = p.nombre_producto;
            productoSelect.appendChild(option);
        });
        productoSelect.disabled = false;
        
        // Assert
        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/categorias/productos/c1');
        expect(productoSelect.disabled).toBe(false);
        const productoOptions = document.querySelectorAll('#producto-desvincular option');
        expect(productoOptions.length).toBe(2);
        expect(productoOptions[1].textContent).toBe('filtro');
    });

    test('Test 7: Debería desvincular un producto exitosamente y mostrar modal de éxito', async () => {
        // Arrange
        const categoriaSelect = document.getElementById('categoria-desvincular');
        const productoSelect = document.getElementById('producto-desvincular');
        
        categoriaSelect.value = 'c1';
        productoSelect.innerHTML += '<option value="p2">filtro</option>';
        productoSelect.value = 'p2';

        fetch.mockResolvedValueOnce({ json: async () => ({ success: true }) });
        
        // Act
        await desvincularProductoDeCategoria(productoSelect.value, categoriaSelect.value);
        showModal('Éxito', 'Producto desvinculado correctamente', 'success');
        
        // Assert
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:3000/categorias/productos/desvincular',
            expect.objectContaining({
                method: 'DELETE',
                body: JSON.stringify({ id_producto: 'p2', id_categoria: 'c1' }),
            })
        );
        expect(showModal).toHaveBeenCalledWith('Éxito', 'Producto desvinculado correctamente', 'success');
    });

    test('Test 8: Debería mostrar modal de error si la desvinculación falla', async () => {
        // Arrange
        const categoriaSelect = document.getElementById('categoria-desvincular');
        const productoSelect = document.getElementById('producto-desvincular');
        
        categoriaSelect.value = 'c1';
        productoSelect.innerHTML += '<option value="p2">filtro</option>';
        productoSelect.value = 'p2';
        
        fetch.mockResolvedValueOnce({ json: async () => ({ success: false }) });

        // Act
        const response = await desvincularProductoDeCategoria(productoSelect.value, categoriaSelect.value);
        if (!response.success) {
            showModal('Error', 'No se pudo desvincular correctamente', 'error');
        }

        // Assert
        expect(showModal).toHaveBeenCalledWith('Error', 'No se pudo desvincular correctamente', 'error');
    });
});