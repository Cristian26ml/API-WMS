// routes/unidadesAlmacenamiento.js
import express from 'express';
import { 
    crearOActualizarUA, 
    listarUAs, 
    obtenerSiguienteCorrelativoUA,
    eliminarUA 
} from '../controllers/uaController.js';

const router = express.Router();

router.get('/', listarUAs);
router.post('/', crearOActualizarUA);
router.get('/siguiente-correlativo', obtenerSiguienteCorrelativoUA);
router.delete('/:id', eliminarUA); // 👈 Nueva ruta para eliminar por ID

export default router;