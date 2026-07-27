// src/controllers/movimientosController.js
import prisma from '../prismaClient.js';

// 📋 LISTAR MOVIMIENTOS CON USUARIO RESPONSABLE
export const listarMovimientos = async (req, res) => {
    try {
        const movimientos = await prisma.movimiento.findMany({
            include: {
                inventario: {
                    include: {
                        producto: true
                    }
                },
                orden: true,
                usuario: {
                    select: { id: true, nombre: true, email: true } // Traemos los datos del responsable
                }
            },
            orderBy: { id: 'desc' }
        });
        res.json(movimientos);
    } catch (error) {
        console.error("❌ Error al listar movimientos:", error);
        res.status(500).json({ error: 'Error al obtener movimientos' });
    }
};

// ➕ CREAR MOVIMIENTO VINCULANDO AL OPERADOR
export const crearMovimiento = async (req, res) => {
    try {
        const { tipo, cantidad, inventarioId, productoId, usuarioId, ordenId, motivo } = req.body;

        const dataMovimiento = {
            tipo: tipo ? tipo.toUpperCase() : 'ENTRADA',
            cantidad: parseInt(cantidad, 10),
            motivo: motivo || 'Ajuste de inventario'
        };

        if (inventarioId) dataMovimiento.inventarioId = parseInt(inventarioId, 10);
        if (ordenId) dataMovimiento.ordenId = parseInt(ordenId, 10);
        if (usuarioId) dataMovimiento.usuarioId = parseInt(usuarioId, 10); // ID del usuario que hace el ajuste

        const movimiento = await prisma.movimiento.create({
            data: dataMovimiento,
            include: {
                inventario: { include: { producto: true } },
                orden: true,
                usuario: true
            }
        });

        // Actualización de stock en Producto (si aplica)
        const targetProductoId = productoId || movimiento.inventario?.productoId;
        if (targetProductoId) {
            const esSalida = tipo?.toUpperCase() === 'SALIDA';
            const cambio = esSalida ? -Math.abs(dataMovimiento.cantidad) : Math.abs(dataMovimiento.cantidad);

            await prisma.producto.update({
                where: { id: parseInt(targetProductoId, 10) },
                data: { stock: { increment: cambio } }
            }).catch(() => {});
        }

        res.status(201).json(movimiento);
    } catch (error) {
        console.error("❌ Error al crear movimiento:", error);
        res.status(500).json({ error: 'Error al crear movimiento' });
    }
};
// ✏️ 3. ACTUALIZAR MOVIMIENTO
export const actualizarMovimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const movimiento = await prisma.movimiento.update({
            where: { id: parseInt(id, 10) },
            data: req.body
        });
        res.json(movimiento);
    } catch (error) {
        console.error("Error al actualizar movimiento:", error);
        res.status(500).json({ error: 'Error al actualizar movimiento' });
    }
};

// 🗑️ 4. ELIMINAR MOVIMIENTO
export const eliminarMovimiento = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.movimiento.delete({
            where: { id: parseInt(id, 10) }
        });
        res.json({ mensaje: 'Movimiento eliminado correctamente' });
    } catch (error) {
        console.error("Error al eliminar movimiento:", error);
        res.status(500).json({ error: 'Error al eliminar movimiento' });
    }
};