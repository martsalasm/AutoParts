import express from 'express';
const router = express.Router();
import categoriaController from '../controllers/categoriaController.js';

router.get('/', categoriaController.getCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post('/', categoriaController.addCategoria);
router.put('/:id', categoriaController.updateCategoriaById);
router.get("/productos/:id", categoriaController.getProductosByCategoria);
router.post("/productos", categoriaController.addProductoToCategoria);
router.delete("/productos/desvincular", categoriaController.deleteProductoFromCategoria);
router.delete('/:id', categoriaController.deleteCategoriaById);
export default router;