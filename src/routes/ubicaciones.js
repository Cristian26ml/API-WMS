import express from 'express';
import { crearUbicacion, listarUbicaciones, actualizarUbicacion, eliminarUbicacion } from '../controllers/ubicacionesController.js';

const router = express.Router();

router.post('/', crearUbicacion);
router.get('/', listarUbicaciones);
router.put('/:id', actualizarUbicacion);
router.delete('/:id', eliminarUbicacion);

export default router;
