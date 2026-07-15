import prisma from '../prismaClient.js';

export const obtenerResumenDashboard = async (req, res) => {
    try {
        const [
            productosActivos,
            ordenesPendientes,
            movimientosMes,
            incidenciasAbiertas,
            inventarios,
            indicadores
        ] = await Promise.all([
            prisma.producto.count(),
            prisma.orden.count({ where: { estado: 'Pendiente' } }),
            prisma.movimiento.count({
                where: {
                    fecha: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            }),
            prisma.incidencia.count({ where: { estado: 'Abierta' } }),
            prisma.inventario.findMany({
                include: { producto: true, ubicacion: true }
            }),
            prisma.indicador.findMany()
        ]);

        const bajoStock = inventarios.filter(inv => inv.cantidad < (inv.producto.stockMinimo || 0)).length;
        const proximosVencimientos = inventarios.filter(inv => {
            const diasRestantes = (new Date(inv.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24);
            return diasRestantes <= 30;
        }).length;

        res.json({
            resumen: {
                productosActivos,
                ordenesPendientes,
                movimientosMes,
                incidenciasAbiertas,
                bajoStock,
                proximosVencimientos
            },
            indicadores
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener resumen del dashboard' });
    }
};
