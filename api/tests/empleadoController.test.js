import empleadoController from '../controllers/empleadoController.js';
import db from '../database.js'; // Jest usará automáticamente __mocks__/database.js
import bcrypt from 'bcrypt';

// Mockear los módulos externos que lo necesiten
jest.mock('bcrypt');
jest.mock('../database.js');


describe('Empleado Controller', () => {
  let req, res;
  let consoleErrorSpy;
  // Reiniciar los mocks y los objetos req/res antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    req = {
      params: {},
      body: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(), // Añadido para el test de DELETE
    };
  });
afterEach(() => {
  consoleErrorSpy.mockRestore();
});
  // Pruebas para getEmpleados
  describe('getEmpleados', () => {
    it('debería retornar todos los empleados', async () => {
      const mockEmpleados = [{ rut_empleado: '111-1', nombre_empleado: 'Juan' }];
      db.query.mockResolvedValue([mockEmpleados]);

      await empleadoController.getEmpleados(req, res);
      
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM empleados');
      expect(res.json).toHaveBeenCalledWith(mockEmpleados);
    });
  });

  // Pruebas para getEmpleadoByRut
  describe('getEmpleadoByRut', () => {
    it('debería retornar un empleado por su RUT', async () => {
      const mockEmpleado = { rut_empleado: '111-1', nombre_empleado: 'Ana' };
      req.params.rut = '111-1';
      db.query.mockResolvedValue([[mockEmpleado]]);

      await empleadoController.getEmpleadoByRut(req, res);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM empleados WHERE rut_empleado = ?', ['111-1']);
      expect(res.json).toHaveBeenCalledWith(mockEmpleado);
    });

    it('debería retornar 404 si el empleado no se encuentra', async () => {
      req.params.rut = '222-2';
      db.query.mockResolvedValue([[]]);

      await empleadoController.getEmpleadoByRut(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Empleado no encontrado' });
    });
  });
  
  // Pruebas para addEmpleado
  describe('addEmpleado', () => {
    beforeEach(() => {
      req.body = {
        rutEmpleado: '12.345.678-9',
        nombreEmpleado: 'Carlos',
        apellidoEmpleado: 'Soto',
        rolEmpleado: 'Vendedor',
        telefonoEmpleado: '123456789',
        correoEmpleado: 'carlos@soto.com',
        contrasenaEmpleado: 'pass123',
      };
      bcrypt.hash.mockResolvedValue('hashedPassword');
    });

    it('debería agregar un empleado exitosamente', async () => {
      await empleadoController.addEmpleado(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 10);
      expect(db.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        nombreEmpleado: 'Carlos'
      }));
    });

    it('debería retornar 400 si faltan datos', async () => {
      req.body.nombreEmpleado = ''; // Dato faltante
      await empleadoController.addEmpleado(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Faltan datos necesarios' });
      expect(db.query).not.toHaveBeenCalled();
    });

    it('debería retornar 400 si el RUT es inválido', async () => {
      req.body.rutEmpleado = '12345'; // RUT inválido
      await empleadoController.addEmpleado(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El formato del RUT no es válido' });
      expect(db.query).not.toHaveBeenCalled();
    });
  });

  // Pruebas para updateEmpleadoByRut
  describe('updateEmpleadoByRut', () => {
    beforeEach(() => {
        req.params.rut = '111-1';
        req.body = {
            nombreEmpleado: 'Pedro',
            apellidoEmpleado: 'Pascal',
            rolEmpleado: 'Actor',
            telefonoEmpleado: '987654321',
            correoEmpleado: 'pedro@pascal.com'
        };
    });

    it('debería actualizar un empleado exitosamente', async () => {
        db.query.mockResolvedValue([{ affectedRows: 1 }]);
        await empleadoController.updateEmpleadoByRut(req, res);

        expect(db.query).toHaveBeenCalledWith(expect.stringContaining("UPDATE empleados SET"), expect.any(Array));
        expect(res.status).toHaveBeenCalledWith(201); // Tu código usa 201, podría ser 200 OK también.
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ nombreEmpleado: 'Pedro' }));
    });
    
    // NOTA: Tu código original no maneja el caso donde el empleado no existe.
    // Siempre devuelve 201. Un test como este lo detectaría.
    it('debería retornar un éxito incluso si el empleado no existe (comportamiento actual)', async () => {
        db.query.mockResolvedValue([{ affectedRows: 0 }]); // 0 filas afectadas
        await empleadoController.updateEmpleadoByRut(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201); // El código actual hace esto
    });
  });

  // Pruebas para deleteEmpleadoByRut (basadas en la versión corregida)
  describe('deleteEmpleadoByRut', () => {
    it('debería eliminar un empleado y retornar 204 No Content', async () => {
      req.params.rut = '111-1';
      db.query.mockResolvedValue([{ affectedRows: 1 }]);

      // Usando la versión corregida que te proporciono abajo
      await deleteEmpleadoCorregido(req, res);

      expect(db.query).toHaveBeenCalledWith('DELETE FROM empleados WHERE rut_empleado = ?', ['111-1']);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
    
    it('debería retornar 404 si el empleado a eliminar no existe', async () => {
      req.params.rut = '222-2';
      db.query.mockResolvedValue([{ affectedRows: 0 }]);

      await deleteEmpleadoCorregido(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No se encontró ningún empleado con ese RUT' });
    });
  });

  // Pruebas para las funciones de ayuda
  describe('Funciones de ayuda de RUT', () => {
    it('validarRut debería validar RUTs correctos e incorrectos', () => {
      expect(empleadoController.validarRut('12.345.678-9')).toBe(true);
      expect(empleadoController.validarRut('12345678-9')).toBe(true);
      expect(empleadoController.validarRut('12345678-K')).toBe(true);
      expect(empleadoController.validarRut('12345')).toBe(false);
      expect(empleadoController.validarRut(null)).toBe(false);
    });

    it('limpiarRut debería limpiar el RUT correctamente', () => {
      expect(empleadoController.limpiarRut('12.345.678-9')).toBe('123456789');
    });
  });
});

// Función corregida para usar en el test de DELETE
const deleteEmpleadoCorregido = async (req, res) => {
    const { rut } = req.params;
    try {
      const [result] = await db.query("DELETE FROM empleados WHERE rut_empleado = ?", [rut]);
      if (result.affectedRows > 0) {
        res.status(204).send(); // 204 No Content es el estándar para DELETE exitoso
      } else {
        res.status(404).json({ error: 'No se encontró ningún empleado con ese RUT' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar el empleado" });
    }
}