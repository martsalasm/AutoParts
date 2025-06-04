import express from 'express';
const router = express.Router();
import webpayController from '../controllers/webpayController.js';

router.post('/iniciar', webpayController.iniciarPago);
router.post('/confirmar', webpayController.confirmarPago);
router.get('/confirmar', webpayController.confirmarPago); 


export default router;