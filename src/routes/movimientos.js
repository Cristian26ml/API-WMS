import express from 'express';
import { crearMovimiento, listarMovimientos, actualizarMovimiento, eliminarMovimiento } from '../controllers/movimientosController.js';

const router = express.Router();

router.post('/', crearMovimiento);
router.get('/', listarMovimientos);
router.put('/:id', actualizarMovimiento);
router.delete('/:id', eliminarMovimiento);

export default router;
