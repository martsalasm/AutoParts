import express from "express";
const router = express.Router();
import ordenController from "../controllers/ordenController";

router.get("/", ordenController.getOrdenes);
router.get("/:id", ordenController.getOrdenById);
router.get("/:rut", ordenController.getOrdenesByCliente);