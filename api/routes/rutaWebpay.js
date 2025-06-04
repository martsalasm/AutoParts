import express from 'express';
const router = express.Router();
import webpayController from '../controllers/webpayController.js';

router.post('/crear-transaccion', webpayController.crearTransaccion);
router.post('/retorno', webpayController.confirmarTransaccion);



export default router;