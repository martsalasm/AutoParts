import express from "express";
const router = express.Router();
import empleadoController from "../controllers/empleadoController.js";

router.get("/", empleadoController.getEmpleados);
router.get("/:rut", empleadoController.getEmpleadoByRut);
router.post("/", empleadoController.addEmpleado);
router.put("/:rut", empleadoController.updateEmpleadoByRut);
router.delete("/:rut", empleadoController.deleteEmpleadoByRut);
export default router;