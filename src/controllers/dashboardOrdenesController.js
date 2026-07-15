import prisma from '../prismaClient.js';
import { io } from '../../server.js';

export const crearOrden = async (req, res) => {
    try {
        const nuevaOrden = await prisma.orden.create({
            data: {
                tipo: req.body.tipo,
                estado: req.body.estado,
                fecha: new Date(),
                usuarioId: req.body.usuarioId,
                productos: {
                    create: req.body.productos.map(p => ({
                        productoId: p.productoId,
                        cantidad: p.cantidad
                    }))
                }
            },
            include: {
                usuario: true,
                productos: { include: { producto: true } }
            }
        });

        io.emit('ordenCreada', nuevaOrden);

        res.json(nuevaOrden);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear orden' });
    }
};

export const obtenerOrdenesDashboard = async (req, res) => {
    try {
        const ordenes = await prisma.orden.findMany({
            take: 10,
            orderBy: { fecha: 'desc' },
            include: {
                usuario: true,
                productos: {
                    include: { producto: true }
                }
            }
        });

        const reporte = ordenes.map(orden => ({
            ordenId: orden.id,
            tipo: orden.tipo,
            estado: orden.estado,
            fecha: orden.fecha,
            responsable: orden.usuario?.nombre || 'Sin asignar',
            productos: orden.productos.map(p => ({
                codigo: p.producto.codigo,
                nombre: p.producto.nombre,
                cantidad: p.cantidad
            }))
        }));

        res.json(reporte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener órdenes para dashboard' });
    }
};