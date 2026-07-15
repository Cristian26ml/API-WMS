import prisma from '../prismaClient.js';

export const crearProducto = async (req, res) => {
    try {
        const producto = await prisma.producto.create({ data: req.body });
        res.status(201).json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto' });
    }
};

export const listarProductos = async (req, res) => {
    try {
        const productos = await prisma.producto.findMany();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

export const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await prisma.producto.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.producto.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};
