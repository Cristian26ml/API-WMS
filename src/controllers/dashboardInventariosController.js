import prisma from '../prismaClient.js';

export const obtenerInventariosDashboard = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany({
            include: {
                proveedor: true,
                inventarios: {
                    include: { ubicacion: true}
                }
            }
        });

        const reporte = productos.map(producto => {
            const stockDisponible = producto.inventarios
                .filter(inv => inv.estado.toLowerCase() === 'disponible')
                .reduce((sum, inv) => sum + inv.cantidad, 0);
            
            const stockBloqueado = producto.inventarios
                .filter(inv => inv.estado.toLowerCase() !== 'disponible')
                .reduce((sum, inv) => sum + inv.cantidad, 0);

            return {
                productoId: producto.id,
                codigo: producto.codigo,
                nombre: producto.nombre,
                proveedor: producto.proveedor?.nombre || 'Sin Proveedor Asignado',
                stockMinimo: producto.stockMinimo || 0,
                stockDisponible,
                stockBloqueado,
                requiereReposicion: stockDisponible < (producto.stockMinimo || 0),
                detalle: producto.inventarios.map(inv => ({
                    ubicacion: inv.ubicacion.codigo,
                    zona: inv.ubicacion.zona,
                    lote: inv.lote,
                    estado: inv.estado,
                    cantidad: inv.cantidad,
                    vence: inv.fechaVencimiento
                }))
            };
        });

        res.json(reporte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener inventarios para dashboard'});
    }
};