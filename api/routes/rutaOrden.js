import express from "express";
const router = express.Router();
import ordenController from "../controllers/ordenController.js";

router.get("/", ordenController.getOrdenes);
router.get("/:id", ordenController.getOrdenById);
router.get("/cliente/:rut", ordenController.getOrdenesByCliente);
router.post("/", ordenController.addOrden);
export default router;