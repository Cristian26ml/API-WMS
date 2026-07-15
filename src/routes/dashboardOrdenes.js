import express from 'express';
import { obtenerOrdenesDashboard, crearOrden } from '../controllers/dashboardOrdenesController.js';

const router = express.Router();

router.get('/', obtenerOrdenesDashboard);
router.post('/', crearOrden);

export default router;
