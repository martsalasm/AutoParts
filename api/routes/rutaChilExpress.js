import express from "express";
const router = express.Router();
import chilExpressController from "../controllers/chilExpressController.js";


router.post("/validarCobertura", chilExpressController.validarCobertura);
router.post("/calcularDespacho", chilExpressController.calcularDespacho);
export default router;