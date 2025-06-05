import db from "../database.js";

// Controlador de productos para operaciones CRUD

// metodo get para obtener todos los productos
const getProductos = async (req, res) => {  
  try {
    const [rows] = await db.query("SELECT * FROM productos");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
}

//metodo get para obtener un producto por id
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

//Metodo para obtener varios productos por ids

const getProductosByIds = async (req, res) => {
  const { productos } = req.body;
  if (!Array.isArray(productos) || productos.length === 0 || !productos) {
    return res.status(400).json({ error: "Faltan ids de productos" });
  }

  const ids = productos.map(producto => producto.id);
  if (ids.length === 0) {
    return res.status(400).json({ error: "La lista de productos esta.. vacia?" });
  }

try {
    const [rows] = await db.query(
      `SELECT id_producto AS id, nombre_producto AS nombre, precio, preciob2b, product_weight as weight, product_height as height, product_width as width, product_length as length FROM productos WHERE id_producto IN (?)`,
      [ids]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos por ID" });
  }
}


// metodo post para agregar un producto
const addProducto = async (req, res) => {
  const {
    nombre,
    descripcion,
    precio,
    preciob2b,
    marca,
    stock,
    imagen,
    peso,
    alto,
    ancho,
    largo
  } = req.body;

  if (
    !nombre || !descripcion || !precio || !preciob2b || !marca || stock === undefined || !imagen || 
    peso === undefined || alto === undefined || ancho === undefined || largo === undefined
  ) {
    return res.status(400).json({ error: "Faltan datos necesarios" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO productos (
        nombre_producto, descripcion_producto, precio, preciob2b, marca, stock,
        url_imagen, product_weight, product_height, product_width, product_length
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        descripcion,
        precio,
        preciob2b,
        marca,
        stock,
        imagen,
        peso,
        alto,
        ancho,
        largo,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      descripcion,
      precio,
      preciob2b,
      marca,
      stock,
      imagen,
      peso,
      alto,
      ancho,
      largo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
};


// metodo put para actualizar un producto por id
const updateProductoById = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, preciob2b, marca, stock, imagen } = req.body;
  if (!nombre || !precio || !preciob2b || !marca || !imagen || stock === undefined) {
    return res.status(400).json({ error: "Faltan datos necesarios" });
  }

  try {
    const [result] = await db.query(
      "UPDATE productos SET nombre_producto = ?, precio = ?, preciob2b = ?, marca = ?,stock = ?, url_imagen=?  WHERE id_producto = ?",
      [nombre, precio, preciob2b, marca, stock,imagen, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ id, nombre, precio, preciob2b, marca, stock, imagen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};


// metodo delete para eliminar un producto por id
const deleteProductoById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM productos WHERE id_producto = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};



export default{
    getProductos,
    addProducto,
    getProductoById,
    getProductosByIds,
    deleteProductoById,
    updateProductoById,
}