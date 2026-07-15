import express from 'express';
import { obtenerResumenDashboard } from '../controllers/dashboardController.js';
import { obtenerInventariosDashboard } from '../controllers/dashboardInventariosController.js';
import { obtenerOrdenesDashboard } from '../controllers/dashboardOrdenesController.js';
import { obtenerIncidenciasDashboard } from '../controllers/dashboardIncidenciasController.js';

const router = express.Router();

// Resumen general del dashboard
router.get('/', obtenerResumenDashboard);

// Subrutas para cada sección
router.get('/inventarios', obtenerInventariosDashboard);
router.get('/ordenes', obtenerOrdenesDashboard);
router.get('/incidencias', obtenerIncidenciasDashboard);

export default router;
