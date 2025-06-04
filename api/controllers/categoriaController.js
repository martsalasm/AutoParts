import db from "../database.js";

const getCategorias = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categorias ORDER BY id_categoria");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
}

const getCategoriaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM categorias WHERE id_categoria = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la categoría" });
  }
};

const addCategoria = async (req, res) => {
  const { nombreCategoria } = req.body;
  if (!nombreCategoria) {
    return res.status(400).json({ error: "Falta el nombre de la categoría" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO categorias (nombre_categoria) VALUES (?)",
      [nombreCategoria]
    );
    res.status(201).json({ id_categoria: result.insertId, nombre_categoria: nombreCategoria });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar la categoría" });
  }
}

const updateCategoriaById = async (req, res) => {
  const { id } = req.params;
  const { nombreCategoria } = req.body;
  if (!nombreCategoria) {
    return res.status(400).json({ error: "Falta el nombre de la categoría" });
  }
  try {
    const [result] = await db.query(
      "UPDATE categorias SET nombre_categoria = ? WHERE id_categoria = ?",
      [nombreCategoria, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json({ message: "Categoría actualizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la categoría" });
  }
};

const deleteCategoriaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM categorias WHERE id_categoria = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar la categoría" });
  }
}
// metodo get para obtener todos los productos de una categoria
// Este método asume que existe una tabla producto_categoria que relaciona productos con categorías
const getProductosByCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT p.* FROM productos p JOIN producto_categoria pc ON p.id_producto = pc.id_producto WHERE id_categoria = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la categoría" });
  }
};
// metodo post para agregar un producto a una categoria
// Este método asume que existe una tabla producto_categoria que relaciona productos con categorías
const addProductoToCategoria = async (req, res) => {
  const { id_categoria, id_producto } = req.body;
  if (!id_categoria || !id_producto) {
    return res.status(400).json({ error: "Faltan datos necesarios" });
  }
  try {
    const [result] = await db.query(
      "INSERT INTO producto_categoria (id_categoria, id_producto) VALUES (?, ?)",
      [id_categoria, id_producto]
    );
    res.status(201).json({ id: result.insertId, id_categoria, id_producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto a la categoría" });
  }
}



export default {
    getCategorias,
    getCategoriaById,
    addCategoria,
    updateCategoriaById,
    deleteCategoriaById,
    getProductosByCategoria,
    addProductoToCategoria
}