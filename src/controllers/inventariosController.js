import prisma from '../prismaClient.js';

export const crearInventario = async (req, res) => {
    try {
        const inventario = await prisma.inventario.create({ data: req.body });
        res.status(201).json(inventario);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear inventario' });
    }
};

export const listarInventarios = async (req, res) => {
    try {
        const inventarios = await prisma.inventario.findMany({
            include: { producto: true, ubicacion: true }
        });
        res.json(inventarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener inventarios' });
    }
};

export const actualizarInventario = async (req, res) => {
    try {
        const { id } = req.params;
        const inventario = await prisma.inventario.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(inventario);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar inventario' });
    }
};

export const eliminarInventario = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.inventario.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensaje: 'Inventario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar inventario' });
    }
};

export const obtenerReporteParaCompras = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany({
            include: {
                proveedor: true, 
                inventarios: {
                    include: { ubicacion: true }
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
                stockMinimoRequerido: producto.stockMinimo || 0,
                stockActualDisponible: stockDisponible,
                stockActualBloqueado: stockBloqueado,
                requiereReposicion: stockDisponible < (producto.stockMinimo || 0),
                detallesAlmacen: producto.inventarios.map(inv => ({
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
        res.status(500).json({ error: 'Error al generar el reporte de reposición para compras' });
    }
};