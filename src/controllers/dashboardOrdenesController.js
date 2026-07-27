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
                movimientos: {
                    create: req.body.productos.map(p => ({
                        cantidad: p.cantidad,
                        tipo: "Entrada", // o "Salida" según corresponda
                        inventario: {
                            connect: { id: p.inventarioId } // debes pasar inventarioId en el body
                        }
                    }))
                }
            },
            include: {
                usuario: true,
                movimientos: {
                    include: {
                        inventario: {
                            include: { producto: true }
                        }
                    }
                }
            }
        });

        // Transformar la orden al formato esperado por el frontend
        const reporteOrden = {
            ordenId: nuevaOrden.id,
            tipo: nuevaOrden.tipo,
            estado: nuevaOrden.estado,
            fecha: nuevaOrden.fecha,
            responsable: nuevaOrden.usuario?.nombre || 'Sin asignar',
            productos: nuevaOrden.movimientos.map(mov => ({
                codigo: mov.inventario.producto.codigo,
                nombre: mov.inventario.producto.nombre,
                cantidad: mov.cantidad
            }))
        };

        io.emit('ordenCreada', reporteOrden);
        res.json(reporteOrden);
    } catch (error) {
        console.error("Error al crear orden:", error);
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
                movimientos: {
                    include: {
                        inventario: {
                            include: { producto: true }
                        }
                    }
                }
            }
        });

        const reporte = ordenes.map(orden => ({
            ordenId: orden.id,
            tipo: orden.tipo,
            estado: orden.estado,
            fecha: orden.fecha,
            responsable: orden.usuario?.nombre || 'Sin asignar',
            productos: orden.movimientos.map(mov => ({
                codigo: mov.inventario.producto.codigo,
                nombre: mov.inventario.producto.nombre,
                cantidad: mov.cantidad
            }))
        }));

        res.json(reporte);
    } catch (error) {
        console.error("Error al obtener órdenes:", error);
        res.status(500).json({ error: 'Error al obtener órdenes para dashboard' });
    }
};
