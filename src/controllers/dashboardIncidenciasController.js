import prisma from '../prismaClient.js';

export const obtenerIncidenciasDashboard = async (req, res) => {
    try {
        const incidencias = await prisma.incidencia.findMany({
            take: 10,
            orderBy: { fecha: 'desc' },
            include: { usuario: true }
        });

        const abiertas = incidencias.filter(i => i.estado === 'Abierta').length;
        const resueltas = incidencias.filter(i => i.estado === 'Resuelta').length;

        const tipos = incidencias.reduce((acc, i) => {
            acc[i.tipo] = (acc[i.tipo] || 0) + 1;
            return acc;
        }, {});

        const reporte = {
            resumen: {
                abiertas,
                resueltas,
                tipos
        },
        detalle: incidencias.map(i => ({
            incidenciaId: i.id,
            tipo: i.tipo, // Daño / Faltante / Diferencia
            estado: i.estado,
            fecha: i.fecha,
            descripcion: i.descripcion,
            responsable: i.usuario?.nombre || 'Sin asignar'
        }))
        };

        res.json(reporte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener incidencias para dashboard' });
    }
};
