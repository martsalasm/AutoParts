import db from "../database.js";

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
    const [rows] = await db.query("SELECT * FROM ordenes WHERE id_orden = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }
    res.json(rows[0]);
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
     ||!comuna_cliente || !valor_envio || !metodo_pago || !total 
     || !estado ||  !productos ) {
    return res.status(400).json({ message: 'Faltan campos por completar' });
  };

  try{
    const [result] = await db.query(
      `INSERT INTO ordenes (nombre_cliente, apellido_cliente, rut_cliente, tipo_cliente, correo_cliente
      , telefono_cliente, tipo_envio, direccion_cliente, apartamento_cliente, region_cliente
      , comuna_cliente, valor_envio, metodo_pago, total, estado)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
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
        estado
      ]
    );
    const ordenId = result.insertId;

    for (const producto of productos){
      const { id_producto, cantidad, precio} = producto;
      await db.query(
        `INSERT INTO detalle_orden (id_orden, id_producto, cantidad, precio_unitario),
        VALUES(?, ?, ?, ?)`,
        [ordenId, id_producto, cantidad, precio]
      );
    }
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