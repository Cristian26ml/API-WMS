// controllers/uaController.js
import prisma from '../prismaClient.js';

// 1. Obtener el siguiente correlativo numérico libre para generar UAs nuevas
export const obtenerSiguienteCorrelativoUA = async (req, res) => {
    try {
        const uas = await prisma.unidadAlmacenamiento.findMany({ select: { codigo: true } });
        let maxNumero = 1000000;

        uas.forEach(ua => {
            const num = parseInt(ua.codigo.replace(/\D/g, ''), 10);
            if (!isNaN(num) && num > maxNumero) maxNumero = num;
        });

        res.json({ siguienteCorrelativo: maxNumero + 1 });
    } catch (error) {
        console.error("Error al obtener correlativo UA:", error);
        res.status(500).json({ error: 'Error al calcular el siguiente número correlativo' });
    }
};

// 2. Crear o actualizar UA limpia (sin exigir producto)
export const crearOActualizarUA = async (req, res) => {
    try {
        const { codigo, estado, ubicacionId } = req.body;

        if (!codigo) {
            return res.status(400).json({ error: 'El código de la UA es obligatorio.' });
        }

        const parsedUbicacionId = (ubicacionId && !isNaN(parseInt(ubicacionId))) 
            ? parseInt(ubicacionId) 
            : null;

        const estadoFinal = estado || 'Vacía';

        // Buscamos si la UA existe
        const uaExistente = await prisma.unidadAlmacenamiento.findUnique({
            where: { codigo: codigo }
        });

        let unidad;

        if (uaExistente) {
            unidad = await prisma.unidadAlmacenamiento.update({
                where: { codigo: codigo },
                data: {
                    estado: estadoFinal,
                    ubicacionId: parsedUbicacionId
                }
            });
        } else {
            // Estructuramos data dinámicamente para evitar pasar nulls no deseados
            const dataCreacion = {
                codigo: codigo,
                estado: estadoFinal
            };

            if (parsedUbicacionId) {
                dataCreacion.ubicacionId = parsedUbicacionId;
            }

            unidad = await prisma.unidadAlmacenamiento.create({
                data: dataCreacion
            });
        }

        res.status(201).json(unidad);
    } catch (error) {
        console.error("❌ ERROR DETALLADO AL GUARDAR UA EN PRISMA:", error);
        res.status(500).json({ 
            error: 'Fallo al guardar la UA en base de datos.',
            detalle: error.message 
        });
    }
};

// 3. Listar UAs
export const listarUAs = async (req, res) => {
    try {
        const uas = await prisma.unidadAlmacenamiento.findMany({
            include: {
                ubicacion: true,
                inventario: { include: { producto: true } }
            }
        });
        res.json(uas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener listado de UAs.' });
    }
};

// 🗑️ 4. NUEVA FUNCIÓN: Eliminar una UA por ID
export const eliminarUA = async (req, res) => {
    try {
        const { id } = req.params;

        const idNumerico = parseInt(id, 10);
        if (isNaN(idNumerico)) {
            return res.status(400).json({ error: 'El ID de la UA debe ser un número válido.' });
        }

        // Verificamos si la UA existe antes de borrar
        const uaExistente = await prisma.unidadAlmacenamiento.findUnique({
            where: { id: idNumerico }
        });

        if (!uaExistente) {
            return res.status(404).json({ error: 'La Unidad de Almacenamiento no fue encontrada.' });
        }

        // Validación de Seguridad WMS: Si la UA no está vacía o tiene inventario asignado
        if (uaExistente.inventarioId !== null) {
            return res.status(400).json({ 
                error: 'No se puede eliminar una UA que tiene mercadería/inventario asignado. Debe vaciarse o desvincularse primero.' 
            });
        }

        await prisma.unidadAlmacenamiento.delete({
            where: { id: idNumerico }
        });

        res.json({ mensaje: `✓ Unidad de Almacenamiento [${uaExistente.codigo}] eliminada correctamente.` });
    } catch (error) {
        console.error("❌ Error al eliminar UA:", error);
        res.status(500).json({ error: 'Error al intentar eliminar la Unidad de Almacenamiento en la base de datos.' });
    }
};