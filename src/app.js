import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import productosRoutes from './routes/productos.js';
import usuariosRoutes from './routes/usuarios.js';
import rolesRoutes from './routes/roles.js';
import ubicacionesRoutes from './routes/ubicaciones.js';
import inventariosRoutes from './routes/inventarios.js';
import ordenesRoutes from './routes/ordenes.js';
import movimientosRoutes from './routes/movimientos.js';
import incidenciasRoutes from './routes/incidencias.js';
import indicadoresRoutes from './routes/indicadores.js';
import proveedoresRoutes from './routes/proveedores.js';
import dashboardRoutes from './routes/dashboard.js';
import dashboardInventariosRoutes from './routes/dashboardInventarios.js';
import dashboardOrdenesRoutes from './routes/dashboardOrdenes.js';
import dashboardIncidenciasRoutes from './routes/dashboardIncidencias.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/ubicaciones', ubicacionesRoutes);
app.use('/api/inventarios', inventariosRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/indicadores', indicadoresRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/dashboard/inventarios', dashboardInventariosRoutes);
app.use('/api/dashboard/ordenes', dashboardOrdenesRoutes);
app.use('/api/dashboard/incidencias', dashboardIncidenciasRoutes);

export default app;