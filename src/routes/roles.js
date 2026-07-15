import express from 'express';
import { crearRol, listarRoles, actualizarRol, eliminarRol } from '../controllers/rolesController.js';

const router = express.Router();

router.post('/', crearRol);
router.get('/', listarRoles);
router.put('/:id', actualizarRol);
router.delete('/:id', eliminarRol);

export default router;
