import express from 'express';
const router = express.Router();
import clienteController from '../controllers/clienteController';


router.get('/', clienteController.getClientes);
router.get('/:rut', clienteController.getClienteByRut);
router.post('/', clienteController.addCliente);
router.delete('/:rut', clienteController.deleteCliente);


export default router;