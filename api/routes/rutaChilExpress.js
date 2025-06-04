import express from "express";
const router = express.Router();
import coberturaController from "../controllers/coberturaController.js";
import calcularDespachoController from "../controllers/calcularDespachoController.js";


router.post("/validarCobertura", coberturaController.validarCobertura);
router.post("/calcularDespacho", calcularDespachoController.calcularDespacho);
export default router;