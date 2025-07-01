import clienteController from '../controllers/clienteController.js';
import db from '../database.js';
import bcrypt from 'bcrypt';
import empleadoController from '../controllers/empleadoController.js';

// 1. Mockear los módulos externos
jest.mock('../database.js');
jest.mock('bcrypt');
jest.mock('../controllers/empleadoController.js');

describe('Cliente Controller', () => {
  let req, res;
  let consoleErrorSpy;
  // 2. Reiniciar los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // 3. Crear objetos req y res simulados
    req = {
      params: {},
      body: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Permite encadenar res.status().json()
    };
  });
afterEach(() => {
  consoleErrorSpy.mockRestore();
});
  // Pruebas para getClientes
  describe('getClientes', () => {
    it('debería retornar todos los clientes y un estado 200', async () => {
      const mockClientes = [{ id: 1, nombre: 'Juan' }, { id: 2, nombre: 'Ana' }];
      db.query.mockResolvedValue([mockClientes]); // Simula una respuesta exitosa de la DB

      await clienteController.getClientes(req, res);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM clientes');
      expect(res.json).toHaveBeenCalledWith(mockClientes);
    });

    it('debería retornar un error 500 si la consulta a la base de datos falla', async () => {
      const dbError = new Error('Error de conexión');
      db.query.mockRejectedValue(dbError); // Simula un error en la DB

      await clienteController.getClientes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener los clientes' });
    });
  });

  // Pruebas para getClienteByRut
  describe('getClienteByRut', () => {
    it('debería retornar un cliente si se encuentra por su RUT', async () => {
      const mockCliente = { rut_cliente: '12345678-9', nombre_cliente: 'Carlos' };
      req.params.rut = '12345678-9';
      db.query.mockResolvedValue([[mockCliente]]); // La DB devuelve un array con un resultado

      await clienteController.getClienteByRut(req, res);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM clientes WHERE rut_cliente = ?', [req.params.rut]);
      expect(res.json).toHaveBeenCalledWith(mockCliente);
    });

    it('debería retornar un error 404 si el cliente no se encuentra', async () => {
      req.params.rut = '11111111-1';
      db.query.mockResolvedValue([[]]); // La DB devuelve un array vacío

      await clienteController.getClienteByRut(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
    });
    
    it('debería retornar un error 500 si se encuentran múltiples clientes con el mismo RUT', async () => {
        const mockCliente1 = { rut_cliente: '12345678-9', nombre_cliente: 'Carlos' };
        const mockCliente2 = { rut_cliente: '12345678-9', nombre_cliente: 'Carlos duplicado' };
        req.params.rut = '12345678-9';
        db.query.mockResolvedValue([[mockCliente1, mockCliente2]]); // La DB devuelve múltiples resultados

        await clienteController.getClienteByRut(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error, se encontraron varios clientes con el mismo rut' });
    });
  });

  // Pruebas para addCliente
  describe('addCliente', () => {
    beforeEach(() => {
      // Configuración común para las pruebas de addCliente
      req.body = {
        rutCliente: '20123456-7',
        nombreCliente: 'Nuevo',
        apellidoCliente: 'Cliente',
        telefonoCliente: '987654321',
        correoCliente: 'nuevo@cliente.com',
        contrasena: 'password123',
        tipoCliente: 'B2C'
      };
      // Mock de funciones auxiliares
      empleadoController.validarRut.mockReturnValue(true);
      empleadoController.limpiarRut.mockReturnValue('201234567');
      bcrypt.hash.mockResolvedValue('hashedPassword');
    });

    it('debería agregar un cliente exitosamente y retornar un estado 201', async () => {
      db.query.mockResolvedValue([{}]); // Simula inserción exitosa

      await clienteController.addCliente(req, res);
      
      expect(empleadoController.validarRut).toHaveBeenCalledWith(req.body.rutCliente);
      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.contrasena, 10);
      expect(db.query).toHaveBeenCalledWith(expect.any(String), [
        '201234567',
        req.body.nombreCliente,
        req.body.apellidoCliente,
        req.body.telefonoCliente,
        req.body.correoCliente,
        req.body.tipoCliente,
        'hashedPassword'
      ]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Cliente creado exitosamente' });
    });

    it('debería retornar un error 400 si faltan datos', async () => {
      req.body.nombreCliente = ''; // Dato faltante

      await clienteController.addCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Faltan datos necesarios' });
      expect(db.query).not.toHaveBeenCalled(); // Verifica que no se intentó insertar en la DB
    });

    it('debería retornar un error 400 si el RUT no es válido', async () => {
      empleadoController.validarRut.mockReturnValue(false); // Simula RUT inválido

      await clienteController.addCliente(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El formato del RUT no es válido' });
      expect(db.query).not.toHaveBeenCalled();
    });
  });
  
  // Pruebas para deleteClienteByRut
  describe('deleteClienteByRut', () => {
    it('debería eliminar un cliente y retornar un mensaje de éxito', async () => {
        req.params.rut = '12345678-9';
        // Simula que la eliminación afectó a 1 fila
        db.query.mockResolvedValue([{ affectedRows: 1 }]); 

        await clienteController.deleteClienteByRut(req, res);

        expect(db.query).toHaveBeenCalledWith('DELETE FROM clientes WHERE rut_cliente = ?', [req.params.rut]);
        expect(res.json).toHaveBeenCalledWith({ message: 'Cliente eliminado exitosamente' });
    });

    it('debería retornar un error 404 si el cliente a eliminar no existe', async () => {
        req.params.rut = '11111111-1';
        // Simula que la eliminación no afectó a ninguna fila
        db.query.mockResolvedValue([{ affectedRows: 0 }]); 

        await clienteController.deleteClienteByRut(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Cliente no encontrado' });
    });

    it('debería retornar un error 500 si la eliminación falla en la base de datos', async () => {
        req.params.rut = '12345678-9';
        const dbError = new Error('Error de DB');
        db.query.mockRejectedValue(dbError); // Simula un error en la DB

        await clienteController.deleteClienteByRut(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al eliminar el cliente' });
    });
  });
});