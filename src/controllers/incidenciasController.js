import prisma from '../prismaClient.js';

export const crearIncidencia = async (req, res) => {
    try {
        const incidencia = await prisma.incidencia.create({ data: req.body });
        res.status(201).json(incidencia);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear incidencia' });
    }
};

export const listarIncidencias = async (req, res) => {
    try {
        const incidencias = await prisma.incidencia.findMany({
            include: { usuario: true, inventario: true }
        });
        res.json(incidencias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener incidencias' });
    }
};

export const actualizarIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const incidencia = await prisma.incidencia.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(incidencia);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar incidencia' });
    }
};

export const eliminarIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.incidencia.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensaje: 'Incidencia eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar incidencia' });
    }
};
