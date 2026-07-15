import express from 'express';
import { crearOrden, listarOrdenes, actualizarOrden, eliminarOrden } from '../controllers/ordenesController.js';

const router = express.Router();

router.post('/', crearOrden);
router.get('/', listarOrdenes);
router.put('/:id', actualizarOrden);
router.delete('/:id', eliminarOrden);

export default router;
