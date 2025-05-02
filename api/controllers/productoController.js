import db from "../database.js";

const getProductos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
}

const addProducto = async (req, res) => {
  const { nombre, precio, preciob2b, marca, stock } = req.body;
  if (!nombre || !precio || !preciob2b || !marca || stock === undefined) {
    return res.status(400).json({ error: "Faltan datos necesarios" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO productos (nombre_producto, precio, preciob2b, marca, stock) VALUES (?, ?, ?, ?, ?)", 
      [nombre, precio, preciob2b, marca, stock]
    );
    res.status(201).json({ id: result.insertId, nombre, precio, preciob2b, marca, stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
};


const getProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM productos WHERE id_producto = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};



export default{
    getProductos,
    addProducto,
    getProductoById
}