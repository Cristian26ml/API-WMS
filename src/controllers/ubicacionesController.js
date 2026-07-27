import prisma from '../prismaClient.js';

// En tu controllers/ubicacionesController.js
export const crearUbicacion = async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            // Inserción en lote (1 a N)
            const ubicacionesCreadas = await prisma.ubicacion.createMany({
                data: req.body,
                skipDuplicates: true // Evita errores si alguna ubicación ya existía
            });
            return res.status(201).json(ubicacionesCreadas);
        }

        // Inserción individual
        const ubicacion = await prisma.ubicacion.create({ data: req.body });
        res.status(201).json(ubicacion);
    } catch (error) {
        console.error("Error al crear ubicación:", error);
        res.status(500).json({ error: 'Error al registrar ubicaciones en la infraestructura' });
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
        const idNumerico = parseInt(id, 10);

        if (isNaN(idNumerico)) {
            return res.status(400).json({ error: 'El ID de ubicación enviado no es un número válido.' });
        }

        // 1. Buscamos la ubicación verificando sus relaciones con inventario y UAs
        const ubicacionExistente = await prisma.ubicacion.findUnique({
            where: { id: idNumerico },
            include: {
                inventarios: true,
                unidadesAlmacenamiento: true
            }
        });

        if (!ubicacionExistente) {
            return res.status(404).json({ error: 'La ubicación no existe en la base de datos.' });
        }

        // 2. VALIDACIÓN LOGÍSTICA: Bloquea el borrado si hay mercadería o pallets asignados
        const tieneStock = ubicacionExistente.inventarios && ubicacionExistente.inventarios.length > 0;
        const tieneUAs = ubicacionExistente.unidadesAlmacenamiento && ubicacionExistente.unidadesAlmacenamiento.length > 0;

        if (tieneStock || tieneUAs) {
            return res.status(400).json({ 
                error: `No se puede eliminar la ubicación [${ubicacionExistente.rack}] porque contiene inventario o UAs asignadas. Vacíe o reubique la posición antes de eliminar.` 
            });
        }

        // 3. Borrado seguro de la posición
        await prisma.ubicacion.delete({
            where: { id: idNumerico }
        });

        res.json({ mensaje: `✓ Ubicación [${ubicacionExistente.rack}] eliminada correctamente.` });
    } catch (error) {
        console.error("Error al eliminar ubicación:", error);
        res.status(500).json({ error: 'Error interno al intentar eliminar la ubicación.' });
    }
};
