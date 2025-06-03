import express from "express";
const router = express.Router();
import productoController from "../controllers/productoController.js";

router.get("/", productoController.getProductos);
router.get("/:id", productoController.getProductoById);
router.post("/", productoController.addProducto);
router.delete("/:id", productoController.deleteProductoById);
router.put("/:id", productoController.updateProductoById);
router.post("/detalles", productoController.getProductosByIds);
export default router;
