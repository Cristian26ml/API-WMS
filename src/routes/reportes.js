// src/routes/reportes.js
import { Router } from 'express';
import { obtenerKPIsOperacionales } from '../controllers/reportesController.js';

const router = Router();

router.get('/kpis', obtenerKPIsOperacionales);

export default router;