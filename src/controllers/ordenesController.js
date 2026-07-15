import prisma from '../prismaClient.js';

export const crearOrden = async (req, res) => {
    try {
        const orden = await prisma.orden.create({ data: req.body });
        res.status(201).json(orden);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear orden' });
    }
};

export const listarOrdenes = async (req, res) => {
    try {
        const ordenes = await prisma.orden.findMany({
            include: { usuario: true, movimientos: true }
        });
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener órdenes' });
    }
};

export const actualizarOrden = async (req, res) => {
    try {
        const { id } = req.params;
        const orden = await prisma.orden.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(orden);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar orden' });
    }
};

export const eliminarOrden = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.orden.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensaje: 'Orden eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar orden' });
    }
};
