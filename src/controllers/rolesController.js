import prisma from '../prismaClient.js';

export const crearRol = async (req, res) => {
    try {
        const rol = await prisma.rol.create({ data: req.body });
        res.status(201).json(rol);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear rol' });
    }
};

export const listarRoles = async (req, res) => {
    try {
        const roles = await prisma.rol.findMany({
            include: { usuarios: true } // opcional: muestra usuarios asociados
        });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener roles' });
    }
};

export const actualizarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const rol = await prisma.rol.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(rol);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar rol' });
    }
};

export const eliminarRol = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.rol.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensaje: 'Rol eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar rol' });
    }
};
