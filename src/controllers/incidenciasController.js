// src/controllers/incidenciasController.js
import prisma from '../prismaClient.js';

// 📊 1. OBTENER DASHBOARD Y REGISTRO DE INCIDENCIAS
export const obtenerDashboardIncidencias = async (req, res) => {
    try {
        const incidencias = await prisma.incidencia.findMany({
            include: {
                usuario: { select: { id: true, nombre: true, email: true } },
                inventario: { include: { producto: true } }
            },
            orderBy: { id: 'desc' }
        });

        // Formatear los datos según lo que espera el Frontend React
        const detalle = incidencias.map(inc => {
            const productoData = inc.inventario?.producto;
            return {
                incidenciaId: inc.id,
                tipo: inc.tipo || 'General',
                estado: inc.estado || 'Abierta',
                descripcion: inc.descripcion,
                resolucion: inc.resolucion || null,
                cantidad: inc.cantidad || 1,
                responsable: inc.usuario?.nombre || 'Operador Bodega',
                fecha: inc.createdAt,
                producto: productoData ? `${productoData.sku ? `SKU-${productoData.sku}` : 'PROD'} — ${productoData.nombre}` : null,
                inventarioId: inc.inventarioId
            };
        });

        // Cálculo de métricas
        const total = detalle.length;
        const abiertas = detalle.filter(d => d.estado?.toLowerCase().includes('abierta')).length;
        const resueltas = detalle.filter(d => d.estado?.toLowerCase().includes('resuelta')).length;

        const tipos = {};
        detalle.forEach(d => {
            tipos[d.tipo] = (tipos[d.tipo] || 0) + 1;
        });

        res.json({
            resumen: { total, abiertas, resueltas, tipos },
            detalle
        });
    } catch (error) {
        console.error("❌ Error al obtener incidencias:", error);
        res.status(500).json({ error: 'Error al obtener incidencias' });
    }
};

// 📋 2. LISTAR INCIDENCIAS (Compatibilidad)
export const listarIncidencias = async (req, res) => {
    try {
        const incidencias = await prisma.incidencia.findMany({
            include: { usuario: true, inventario: { include: { producto: true } } },
            orderBy: { id: 'desc' }
        });
        res.json(incidencias);
    } catch (error) {
        console.error("❌ Error al listar incidencias:", error);
        res.status(500).json({ error: 'Error al obtener incidencias' });
    }
};

// ➕ 3. CREAR INCIDENCIA (Notifica vía Socket.io)
export const crearIncidencia = async (req, res) => {
    try {
        const { tipo, descripcion, estado, usuarioId, inventarioId, productoId, cantidad } = req.body;

        const dataIncidencia = {
            tipo: tipo || 'Producto Dañado',
            descripcion,
            estado: estado || 'Abierta',
            cantidad: cantidad ? parseInt(cantidad, 10) : 1
        };

        if (usuarioId) dataIncidencia.usuarioId = parseInt(usuarioId, 10);
        if (inventarioId) dataIncidencia.inventarioId = parseInt(inventarioId, 10);

        const nuevaIncidencia = await prisma.incidencia.create({
            data: dataIncidencia,
            include: {
                usuario: { select: { nombre: true } },
                inventario: { include: { producto: true } }
            }
        });

        const productoData = nuevaIncidencia.inventario?.producto;
        const incidenciaFormateada = {
            incidenciaId: nuevaIncidencia.id,
            tipo: nuevaIncidencia.tipo,
            estado: nuevaIncidencia.estado,
            descripcion: nuevaIncidencia.descripcion,
            cantidad: nuevaIncidencia.cantidad,
            responsable: nuevaIncidencia.usuario?.nombre || 'Operador Bodega',
            fecha: nuevaIncidencia.createdAt,
            producto: productoData ? `${productoData.sku ? `SKU-${productoData.sku}` : 'PROD'} — ${productoData.nombre}` : null
        };

        // Emitir evento por Socket.io en tiempo real si está configurado en server.js
        const io = req.app.get('io');
        if (io) {
            io.emit('incidenciaReportada', incidenciaFormateada);
        }

        res.status(201).json(incidenciaFormateada);
    } catch (error) {
        console.error("❌ Error al crear incidencia:", error);
        res.status(500).json({ error: 'Error al crear incidencia' });
    }
};

// 🔄 4. RESOLVER INCIDENCIA (Logística Inversa + Impacto en Kardex/Stock)
export const resolverIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { accion, resolucionNotas, usuarioId } = req.body; 
        // accion opcional: 'MERMA' (descontar stock) o 'REINGRESO' (sumar stock)

        const incidencia = await prisma.incidencia.findUnique({
            where: { id: parseInt(id, 10) },
            include: { inventario: true }
        });

        if (!incidencia) {
            return res.status(404).json({ error: "Incidencia no encontrada." });
        }

        const estadoFinal = accion === 'MERMA' ? 'Resuelta - Merma' : accion === 'REINGRESO' ? 'Resuelta - Reingreso' : 'Resuelta';

        // Actualizamos la incidencia y registramos la trazabilidad en Kardex
        const updateData = {
            estado: estadoFinal,
            resolucion: resolucionNotas || `Resuelta vía ${accion || 'Gestión Manual'}`
        };

        const incidenciaActualizada = await prisma.incidencia.update({
            where: { id: parseInt(id, 10) },
            data: updateData
        });

        // Si la incidencia tiene inventario/producto y requiere ajuste de Logística Inversa:
        if (incidencia.inventarioId && (accion === 'MERMA' || accion === 'REINGRESO')) {
            const esMerma = accion === 'MERMA';
            const cambioStock = esMerma ? -Math.abs(incidencia.cantidad || 1) : Math.abs(incidencia.cantidad || 1);

            // 1. Actualizar el stock
            if (incidencia.inventario?.productoId) {
                await prisma.producto.update({
                    where: { id: incidencia.inventario.productoId },
                    data: { stock: { increment: cambioStock } }
                }).catch(() => {});
            }

            // 2. Crear movimiento en el Kardex
            await prisma.movimiento.create({
                data: {
                    tipo: esMerma ? 'AJUSTE' : 'ENTRADA',
                    cantidad: Math.abs(incidencia.cantidad || 1),
                    motivo: `Logística Inversa (Incidencia #${incidencia.id}): ${resolucionNotas || accion}`,
                    inventarioId: incidencia.inventarioId,
                    usuarioId: usuarioId ? parseInt(usuarioId, 10) : null
                }
            });
        }

        const io = req.app.get('io');
        if (io) {
            io.emit('incidenciaResuelta', incidenciaActualizada);
        }

        res.json({ mensaje: 'Incidencia resuelta exitosamente', incidencia: incidenciaActualizada });
    } catch (error) {
        console.error("❌ Error al resolver incidencia:", error);
        res.status(500).json({ error: 'Error al resolver incidencia' });
    }
};

// ✏️ 5. ACTUALIZAR GENÉRICO
export const actualizarIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const incidencia = await prisma.incidencia.update({
            where: { id: parseInt(id, 10) },
            data: req.body
        });
        res.json(incidencia);
    } catch (error) {
        console.error("❌ Error al actualizar incidencia:", error);
        res.status(500).json({ error: 'Error al actualizar incidencia' });
    }
};

// 🗑️ 6. ELIMINAR INCIDENCIA
export const eliminarIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.incidencia.delete({
            where: { id: parseInt(id, 10) }
        });
        res.json({ mensaje: 'Incidencia eliminada correctamente' });
    } catch (error) {
        console.error("❌ Error al eliminar incidencia:", error);
        res.status(500).json({ error: 'Error al eliminar incidencia' });
    }
};