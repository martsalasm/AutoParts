import db from "../database.js";

//Controlador de empoleados para operaciones CRUD

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


export default {
getEmpleados
};