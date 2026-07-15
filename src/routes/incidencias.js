import express from 'express';
import { crearIncidencia, listarIncidencias, actualizarIncidencia, eliminarIncidencia } from '../controllers/incidenciasController.js';

const router = express.Router();

router.post('/', crearIncidencia);
router.get('/', listarIncidencias);
router.put('/:id', actualizarIncidencia);
router.delete('/:id', eliminarIncidencia);

export default router;
