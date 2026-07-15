import prisma from '../prismaClient.js';

export const crearProveedor = async (req, res) => {
    try {
        const proveedor = await prisma.proveedor.create({ data: req.body });
        res.status(201).json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear proveedor' });
    }
};

export const listarProveedores = async (req, res) => {
    try {
        const proveedores = await prisma.proveedor.findMany();
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener proveedores' });
    }
};

export const actualizarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const proveedor = await prisma.proveedor.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
};

export const eliminarProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.proveedor.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensaje: 'Proveedor eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
};
