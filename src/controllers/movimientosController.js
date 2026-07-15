import prisma from '../prismaClient.js';

export const crearMovimiento = async (req, res) => {
    try {
        const movimiento = await prisma.movimiento.create({ data: req.body });
        res.status(201).json(movimiento);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear movimiento' });
    }
};

export const listarMovimientos = async (req, res) => {
    try {
        const movimientos = await prisma.movimiento.findMany({
            include: { inventario: true, orden: true }
        });
        res.json(movimientos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener movimientos' });
    }
};

export const actualizarMovimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const movimiento = await prisma.movimiento.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(movimiento);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar movimiento' });
    }
};

export const eliminarMovimiento = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.movimiento.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensaje: 'Movimiento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar movimiento' });
    }
};
