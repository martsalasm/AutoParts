import db from "../database.js";
import bcrypt from "bcrypt";
import empleadoController from "./empleadoController.js";


const getClientes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM clientes ORDER BY id_cliente");
    res.json(rows);}
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los clientes" });
    }
};

const getClienteByRut = async (req, res) => {
  const { rut } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM clientes WHERE rut_cliente = ?", [rut]);
    if (rows.length === 0) {
        return res.status(404).json({ error: "Cliente no encontrado" });
        }
    else if (rows.length > 1) {
        return res.status(500).json({ error: "Error, se encontraron varios clientes con el mismo rut" });
    }
    res.json(rows[0]);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el cliente" });
    }
};




const addCliente = async (req, res) => {
  const {
    rutCliente,
    nombreCliente,
    apellidoCliente,
    telefonoCliente,
    correoCliente,
    tipoCliente,
    contraseña
  } = req.body;

  if (!rutCliente || !nombreCliente || !apellidoCliente || !telefonoCliente || !correoCliente || !contraseña) {
    return res.status(400).json({ error: "Faltan datos necesarios" });
  }
    if (!empleadoController.validarRut(rutCliente)) {
    return res.status(400).json({ error: "El formato del RUT no es válido" });
  }
  const cleanedRut = limpiarRut(rutCliente);
  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    await db.query(
      `INSERT INTO clientes 
       (rut_cliente, nombre_cliente, apellido_cliente, telefono_cliente, correo_cliente, tipo_cliente, contraseña_cliente)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [cleanedRut, nombreCliente, apellidoCliente, telefonoCliente, correoCliente, tipoCliente || 'B2C', hashedPassword]
    );

    res.status(201).json({ message: "Cliente creado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el cliente" });
  }
};


const deleteClienteByRut = async (req, res) => {
  const { rut } = req.params;
  try {
    const [result] = await db.query("DELETE FROM clientes WHERE rut_cliente = ?", [rut]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el cliente" });
  }
};


export default {
  addCliente,
  getClientes,
  getClienteByRut,
  deleteClienteByRut
};