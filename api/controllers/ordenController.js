import db from database.js;

const getOrdenes =  async (req , res) => {
    try {
        const [rows] = await db.query("SELECT * FROM ordenes");
        res.json(rows);
    }
    catch (error){
        console.error(error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
}

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

}