import express from 'express';
import { crearInventario, listarInventarios, actualizarInventario, eliminarInventario, obtenerReporteParaCompras } from '../controllers/inventariosController.js';

const router = express.Router();

router.post('/', crearInventario);
router.get('/', listarInventarios);
router.put('/:id', actualizarInventario);
router.delete('/:id', eliminarInventario);
router.get('/reporte-compras', obtenerReporteParaCompras);

export default router;
