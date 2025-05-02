import express from "express";
const router = express.Router();
import productoController from "../controllers/productoController.js";

router.get("/", productoController.getProductos);
router.post("/", productoController.addProducto);
router.get("/:id", productoController.getProductoById);


export default router;
