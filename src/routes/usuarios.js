// src/routes/usuarios.js (o rutas donde tengas /api/auth)
import { Router } from 'express';
import { 
  loginUsuario, 
  crearUsuario, 
  listarUsuarios, 
  actualizarUsuario, 
  eliminarUsuario 
} from '../controllers/usuariosController.js';

const router = Router();

router.post('/login', loginUsuario);

router.get('/', listarUsuarios);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

export default router;