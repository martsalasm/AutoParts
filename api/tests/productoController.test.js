import productoController from '../controllers/productoController.js';
import db from '../database.js'; // Jest usará automáticamente el mock de __mocks__/database.js

// Mockear las dependencias necesarias. En este caso, solo la base de datos.
jest.mock('../database.js');

describe('Producto Controller', () => {
  let req, res;
  let consoleErrorSpy;

  // Configuración que se ejecuta antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
    // Silenciar console.error para mantener la salida limpia
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Crear objetos req y res simulados y frescos para cada test
    req = {
      params: {},
      body: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  // Restaurar la función console.error después de cada prueba
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // Pruebas para getProductos
  describe('getProductos', () => {
    it('debería retornar todos los productos y un estado 200', async () => {
      const mockProductos = [{ id_producto: 1, nombre_producto: 'Filtro de Aceite' }];
      db.query.mockResolvedValue([mockProductos]);

      await productoController.getProductos(req, res);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM productos order by nombre_producto');
      expect(res.json).toHaveBeenCalledWith(mockProductos);
    });

    it('debería retornar un error 500 si la base de datos falla', async () => {
        db.query.mockRejectedValue(new Error('DB Error'));
        await productoController.getProductos(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener los productos' });
    });
  });

  // Pruebas para getProductoById
  describe('getProductoById', () => {
    it('debería retornar un producto por su ID', async () => {
      const mockProducto = { id_producto: 1, nombre_producto: 'Pastillas de Freno' };
      req.params.id = 1;
      db.query.mockResolvedValue([[mockProducto]]);

      await productoController.getProductoById(req, res);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM productos WHERE id_producto = ?', [1]);
      expect(res.json).toHaveBeenCalledWith(mockProducto);
    });

    it('debería retornar 404 si el producto no se encuentra', async () => {
      req.params.id = 99;
      db.query.mockResolvedValue([[]]); // Simula que no se encontró nada

      await productoController.getProductoById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
    });
  });

  // Pruebas para getProductosByIds
  describe('getProductosByIds', () => {
    it('debería retornar múltiples productos dados sus IDs', async () => {
        req.body.productos = [{ id: 1 }, { id: 2 }];
        const mockResult = [
            { id: 1, nombre: 'Producto 1' },
            { id: 2, nombre: 'Producto 2' }
        ];
        db.query.mockResolvedValue([mockResult]);

        await productoController.getProductosByIds(req, res);

        expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE id_producto IN (?)'), [[1, 2]]);
        expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it('debería retornar 400 si el array de productos está vacío o no es un array', async () => {
        req.body.productos = [];
        await productoController.getProductosByIds(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Faltan ids de productos' });
    });
  });

  // Pruebas para addProducto
  describe('addProducto', () => {
    beforeEach(() => {
      req.body = {
        nombre: 'Bujía',
        descripcion: 'Bujía de iridio',
        precio: 15000,
        preciob2b: 12000,
        marca: 'NGK',
        stock: 100,
        imagen: 'url/imagen.jpg',
        peso: 0.1,
        alto: 10,
        ancho: 2,
        largo: 2,
        updated_by: 'testUser'
      };
    });

    it('debería agregar un producto exitosamente', async () => {
      db.query.mockResolvedValue([{ insertId: 101 }]);

      await productoController.addProducto(req, res);

      expect(db.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 101,
        nombre: 'Bujía'
      }));
    });

    it('debería retornar 400 si faltan datos necesarios', async () => {
      req.body.nombre = undefined; // Quitar un dato necesario
      await productoController.addProducto(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Faltan datos necesarios' });
      expect(db.query).not.toHaveBeenCalled();
    });
  });

  // Pruebas para updateProductoById
  describe('updateProductoById', () => {
    beforeEach(() => {
        req.params.id = 1;
        req.body = {
            nombre: 'Filtro de Aire K&N',
            precio: 50000,
            preciob2b: 45000,
            marca: 'K&N',
            stock: 50,
            imagen: 'url/nueva_imagen.jpg',
            updated_by: 'testUser'
        };
    });

    it('debería actualizar un producto exitosamente', async () => {
        db.query.mockResolvedValue([{ affectedRows: 1 }]);
        await productoController.updateProductoById(req, res);

        expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE productos SET'), expect.any(Array));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1, nombre: 'Filtro de Aire K&N' }));
    });

    it('debería retornar 404 si el producto a actualizar no se encuentra', async () => {
        db.query.mockResolvedValue([{ affectedRows: 0 }]);
        await productoController.updateProductoById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
    });
  });

  // Pruebas para deleteProductoById
  describe('deleteProductoById', () => {
    it('debería eliminar un producto y retornar 204 No Content', async () => {
      req.params.id = 1;
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      await productoController.deleteProductoById(req, res);

      expect(db.query).toHaveBeenCalledWith('DELETE FROM productos WHERE id_producto = ?', [1]);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('debería retornar 404 si el producto a eliminar no se encuentra', async () => {
      req.params.id = 99;
      db.query.mockResolvedValue([{ affectedRows: 0 }]);

      await productoController.deleteProductoById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Producto no encontrado' });
    });
  });
});
