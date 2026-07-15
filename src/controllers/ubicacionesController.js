import prisma from '../prismaClient.js';

export const crearUbicacion = async (req, res) => {
    try {
        const ubicacion = await prisma.ubicacion.create({ data: req.body });
        res.status(201).json(ubicacion);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear ubicación' });
    }
};

export const listarUbicaciones = async (req, res) => {
    try {
        const ubicaciones = await prisma.ubicacion.findMany({
            include: { inventarios: true, unidadesAlmacenamiento: true }
        });
        res.json(ubicaciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ubicaciones' });
    }
};

export const actualizarUbicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const ubicacion = await prisma.ubicacion.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(ubicacion);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar ubicación' });
    }
};

export const eliminarUbicacion = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.ubicacion.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensaje: 'Ubicación eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar ubicación' });
    }
};
