import db from "../database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import empleadoController from "./empleadoController.js";
dotenv.config();
// Controlador de autenticación para operaciones de inicio de sesión

const secretKey = process.env.JWT_SECRET_KEY;

const login = async (req, res) => {
    const {rut, password} = req.body;
    const cleanedRut = empleadoController.limpiarRut(rut);
    try {
        const [empleados] = await db.query("SELECT * FROM empleados WHERE rut_empleado = ?", [cleanedRut]);
        if (empleados.length === 1) {
           const empleado = empleados[0];
           const isPasswordValid = await bcrypt.compare(password, empleado.contrasena_empleado);
           if (isPasswordValid){
                const token = jwt.sign({ rut: empleado.rut_empleado, rol: empleado.rol_empleado }, secretKey, { expiresIn: '1h' });
                return res.json({ token, tipo:"empleado", rol: empleado.rol_empleado, nombre: empleado.nombre_empleado, apellido: empleado.apellido_empleado });
           }
    }
    
    const [clientes] = await db.query("SELECT * FROM clientes WHERE rut_cliente = ?", [cleanedRut]);
    if (clientes.length === 1) {
        const cliente = clientes[0];
        const isPasswordValid = await bcrypt.compare(password, cliente.contrasena_cliente);
        if (isPasswordValid) {
            const token = jwt.sign({ rut: cliente.rut_cliente, tipo:"cliente", tipo_cliente:cliente.tipo_cliente}, secretKey, { expiresIn: '1h' });
            return res.json({ token, tipo: "cliente", nombre: cliente.nombre_cliente, apellido: cliente.apellido_cliente, tipo_cliente: cliente.tipo_cliente});
        }
    }

    res.status(401).json({ error: "Credenciales inválidas" });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export default{
    login
};