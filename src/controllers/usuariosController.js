import prisma from '../prismaClient.js';

export const crearUsuario = async (req, res) => {
    try {
        const usuario = await prisma.usuario.create({ data: req.body });
        res.status(201).json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            include: { rol: true } // para traer también el rol asociado
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await prisma.usuario.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.usuario.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};
