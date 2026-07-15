import prisma from '../prismaClient.js';

export const crearIndicador = async (req, res) => {
    try {
        const indicador = await prisma.indicador.create({ data: req.body });
        res.status(201).json(indicador);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear indicador' });
    }
};

export const listarIndicadores = async (req, res) => {
    try {
        const indicadores = await prisma.indicador.findMany();
        res.json(indicadores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener indicadores' });
    }
};

export const actualizarIndicador = async (req, res) => {
    try {
        const { id } = req.params;
        const indicador = await prisma.indicador.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(indicador);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar indicador' });
    }
};

export const eliminarIndicador = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.indicador.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensaje: 'Indicador eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar indicador' });
    }
};
