// src/routes/incidencias.js
import { Router } from 'express';
import {
    obtenerDashboardIncidencias,
    listarIncidencias,
    crearIncidencia,
    resolverIncidencia,
    actualizarIncidencia,
    eliminarIncidencia
} from '../controllers/incidenciasController.js';

const router = Router();

// 📊 Dashboard / Tiempo Real + Registro Completo
router.get('/', obtenerDashboardIncidencias);

// 📋 Listado plano de incidencias
router.get('/lista', listarIncidencias);

// ➕ Crear nueva incidencia (Reporte desde Bodega)
router.post('/', crearIncidencia);

// 🔄 Resolver Incidencia (Acciones de Logística Inversa: Merma o Reingreso)
router.put('/:id/resolver', resolverIncidencia);

// ✏️ Actualización genérica de la incidencia
router.put('/:id', actualizarIncidencia);

// 🗑️ Eliminar incidencia
router.delete('/:id', eliminarIncidencia);

export default router;
