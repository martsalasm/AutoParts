import express from "express";
const router = express.Router();
import getProductos from "../controllers/productoController.js";

router.get("/:id", (req, res) => {
  res.send(`Producto con id: ${req.params.id}`);
});

router.put("/:id", (req, res) => {
  res.send(`Producto con id: ${req.params.id} actualizado`);
});

router.delete("/:id", (req, res) => {
  res.send(`Producto con id: ${req.params.id} eliminado`);
});

export default router;
