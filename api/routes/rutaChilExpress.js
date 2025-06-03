import express from "express";
const router = express.Router();
import coberturaController from "../controllers/coberturaController.js";

router.post("/validarCobertura", coberturaController.validarCobertura);

export default router;