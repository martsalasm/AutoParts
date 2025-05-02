import express from "express";
const router = express.Router();
import empleadoController from "../controllers/empleadoController.js";

router.get("/", empleadoController.getEmpleados);


export default router;