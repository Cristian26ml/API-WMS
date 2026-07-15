import express from 'express';
import { obtenerIncidenciasDashboard } from '../controllers/dashboardIncidenciasController.js';

const router = express.Router();

router.get('/', obtenerIncidenciasDashboard);

export default router;
