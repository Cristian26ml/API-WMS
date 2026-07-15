import express from 'express';
import { crearIndicador, listarIndicadores, actualizarIndicador, eliminarIndicador } from '../controllers/indicadoresController.js';

const router = express.Router();

router.post('/', crearIndicador);
router.get('/', listarIndicadores);
router.put('/:id', actualizarIndicador);
router.delete('/:id', eliminarIndicador);

export default router;
