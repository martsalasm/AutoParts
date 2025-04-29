import express from "express";
const router = express.Router();

//router.route("/").get((req, res) => {
//    res.send("Lista de productos");
//  })
//.put((req, res) => {
//    res.send("Producto actualizado");
//  })
// .post((req, res) => {
//    res.send("Producto creado");
//  });
router.get("/:id", (req, res) => {
  res.send(`Producto con id: ${req.params.id}`);
});

// async function getProductsById() {
// const products = await pool.query("SELECT * FROM products");
// return products;}
router.put("/:id", (req, res) => {
  res.send(`Producto con id: ${req.params.id} actualizado`);
});

router.delete("/:id", (req, res) => {
  res.send(`Producto con id: ${req.params.id} eliminado`);
});

router.param("id", (req, res, next, id) => {
  console.log(`ID del producto: ${id}`);
  next();
});
export default router;
