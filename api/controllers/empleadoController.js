import db from "../database.js";
import bcrypt from "bcrypt";

//Controlador de empleados para operaciones CRUD

// metodo get para obtener todos los empleados
const getEmpleados = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM empleados");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los empleados" });
  }
}
// metodo get para obtener un empleado por rut
const getEmpleadoByRut = async (req, res) => {
  const { rut } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM empleados WHERE rut_empleado = ?", [rut]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }
    else if (rows.length > 1) {
      return res.status(500).json({ error: "Error, se encontraron varios empleados con el mismo rut" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el empleado" });
  };
};

//metodo post para agregar un empleado
const addEmpleado = async (req, res) => {
const { rutEmpleado, nombreEmpleado, apellidoEmpleado, rolEmpleado, telefonoEmpleado, correoEmpleado, contrasenaEmpleado} = req.body;
if (!rutEmpleado || !nombreEmpleado || !apellidoEmpleado || !rolEmpleado || !telefonoEmpleado || !correoEmpleado || !contrasenaEmpleado) {
  return res.status(400).json({ error: "Faltan datos necesarios" });
}
  // ** Validación del RUT utilizando la regex **
  if (!validarRut(rutEmpleado)) {
    return res.status(400).json({ error: "El formato del RUT no es válido" });
  }
  const cleanedRut = limpiarRut(rutEmpleado);
  try {
    const hashedPassword = await bcrypt.hash(contrasenaEmpleado, 10);
    const [result] = await db.query(
      "INSERT INTO empleados (rut_empleado, nombre_empleado, apellido_empleado, rol_empleado, telefono_empleado, correo_empleado, contrasena_empleado) VALUES (?, ?, ?, ?, ?, ?, ?)", 
      [cleanedRut, nombreEmpleado, apellidoEmpleado, rolEmpleado, telefonoEmpleado, correoEmpleado, hashedPassword]
    );
    res.status(201).json({ rutEmpleado, nombreEmpleado, apellidoEmpleado, rolEmpleado, telefonoEmpleado, correoEmpleado });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el empleado" });
  }
};


// metodo put para actualizar un empleado por rut
const updateEmpleadoByRut = async (req, res) => {
  const { rut } = req.params;
  const { nombreEmpleado, apellidoEmpleado, rolEmpleado, telefonoEmpleado, correoEmpleado} = req.body;
  if (!nombreEmpleado || !apellidoEmpleado || !rolEmpleado || !telefonoEmpleado || !correoEmpleado) {
    return res.status(400).json({ error: "Faltan datos necesarios" });
  }
  try {
    const [result] = await db.query(
      "UPDATE empleados SET nombre_empleado = ?, apellido_empleado = ?, rol_empleado = ?, telefono_empleado = ?, correo_empleado=? WHERE rut_empleado = ?",
      [nombreEmpleado, apellidoEmpleado, rolEmpleado, telefonoEmpleado, correoEmpleado, rut]
    );
    res.status(201).json({ rut, nombreEmpleado, apellidoEmpleado, rolEmpleado, telefonoEmpleado, correoEmpleado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el empleado" });
  }
}

//metodo delete para eliminar un empleado por rut
const deleteEmpleadoByRut = async (req, res) => {
  const { rut } = req.params;
  try {
    const [result] = await db.query("DELETE FROM empleados WHERE rut_empleado = ?", [rut]);
    res.status(200).json({ message: "Empleado eliminado" });
    if (result.affectedRows > 0) {
      res.send({ message: 'Empleado eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'No se encontró ningún empleado con ese RUT' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el empleado" });
  }
}


  // Función de validación del RUT
  function validarRut(rut) {
    if (typeof rut !== 'string') {
      return false;
    }
    const rutLimpio = rut.replace(/\./g, ''); // Eliminar puntos
    const regex = /^([1-9]|[1-9]\d|[1-9]\d{2})(\d{3})*-(\d|k|K)$/;
    return regex.test(rutLimpio);
  }
  function limpiarRut(rut) {
    return rut.replace(/\./g, '').replace(/-/g, '');
  }

export default {
getEmpleados,
getEmpleadoByRut,
addEmpleado,
updateEmpleadoByRut,
deleteEmpleadoByRut,
limpiarRut,
validarRut
};