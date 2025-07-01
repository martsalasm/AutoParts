import db from "../database.js";
import empleadoController from "./empleadoController.js";

const getOrdenes =  async (req , res) => {
    try {
        const [rows] = await db.query("SELECT * FROM ordenes");
        if (rows.length === 0) {
            return res.status(404).json({ error: "No se encontraron ordenes" });
        }
        res.json(rows);
    }
    catch (error){
        console.error(error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
};

const getOrdenById = async (req, res) => {
    const id =  req.params.id;
 try {
    const [ordenRows] = await db.query("SELECT * FROM ordenes WHERE id_orden = ?", [id]);
    if (ordenRows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }
    const orden = ordenRows[0];

    const [productosRows] = await db.query(
      `
      SELECT
      do.cantidad,
      do.precio_unitario,
      p.id_producto,
      p.nombre_producto,
      p.descripcion_producto,
      p.stock,
      p.url_imagen
      FROM detalle_orden do
      JOIN productos p ON do.id_producto = p.id_producto
      WHERE do.id_orden = ?
      `,[id]
    );
    orden.productos = productosRows;
    res.json(orden);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la orden" });
  }

};

const getOrdenesByCliente = async (req, res) =>{
    const rut = req.params.rut;

  try {
    const [rows] = await db.query ("SELECT * FROM ordenes WHERE rut_cliente = ?",[rut]);
    if ( rows.length === 0){
      return res.status(404).json({error: "No se encontraron ordenes asociadas con el rut proporcionado"})
    }
    res.status(200).json(rows);
  }
  
  catch(error){
    console.error(error);
    res.status(500).json({error: "Error al obtener las ordenes x rut"})
  }
};

const addOrden = async(req,res) => {
  const {
    nombre_cliente,
    apellido_cliente,
    rut_cliente,
    tipo_cliente,
    correo_cliente,
    telefono_cliente,
    tipo_envio,
    direccion_cliente,
    apartamento_cliente,
    region_cliente,
    comuna_cliente,
    valor_envio,
    metodo_pago,
    total,
    estado,
    productos
  } = req.body;

  if (!nombre_cliente || !apellido_cliente || !rut_cliente || !tipo_cliente || !correo_cliente
     || !telefono_cliente || !tipo_envio || !direccion_cliente || !region_cliente
     ||!comuna_cliente|| !metodo_pago || !total 
     || !estado ||  !productos ) {
    return res.status(400).json({ message: 'Faltan campos por completar' });
  };
  const rut_limpio = empleadoController.limpiarRut(rut_cliente);
  const validacion = empleadoController.validarRut(rut_cliente);
  if (!validacion) {
    return res.status(400).json({ error: "El formato del RUT no es válido" });
  }


  try{
    const [result] = await db.query(
      `INSERT INTO ordenes (nombre_cliente, apellido_cliente, rut_cliente, tipo_cliente, correo_cliente
      , telefono_cliente, tipo_envio, direccion_cliente, apartamento_cliente, region_cliente
      , comuna_cliente, valor_envio, metodo_pago, total, estado)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        nombre_cliente,
        apellido_cliente,
        rut_limpio,
        tipo_cliente,
        correo_cliente,
        telefono_cliente,
        tipo_envio,
        direccion_cliente,
        apartamento_cliente,
        region_cliente,
        comuna_cliente,
        valor_envio,
        metodo_pago,
        total,
        estado
      ]
    );
    const ordenId = result.insertId;

    for (const producto of productos){
      const { id_producto, cantidad, precio} = producto;
      await db.query(
        `INSERT INTO detalle_orden (id_orden, id_producto, cantidad, precio_unitario)
        VALUES(?, ?, ?, ?)`,
        [ordenId, id_producto, cantidad, precio]
      );
    }
      res.status(201).json({ message: "Orden agregada exitosamente", id_orden: ordenId });
  }

  catch(error){
    console.error(error);
    res.status(500).json({ error: "Error al agregar la orden" });
  }
};

export default {
  getOrdenes,
  getOrdenById,
  getOrdenesByCliente,
  addOrden
};