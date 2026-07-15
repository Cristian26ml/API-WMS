import express from 'express';
import { obtenerInventariosDashboard } from '../controllers/dashboardInventariosController.js';

const router = express.Router();

router.get('/', obtenerInventariosDashboard);

export default router;