import express from 'express';
const router = express.Router();
import clienteController from '../controllers/clienteController.js';


router.get('/', clienteController.getClientes);
router.get('/:rut', clienteController.getClienteByRut);
router.post('/', clienteController.addCliente);
router.delete('/:rut', clienteController.deleteClienteByRut);


export default router;