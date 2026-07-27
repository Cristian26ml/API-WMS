import prisma from '../prismaClient.js';

export const obtenerIncidenciasDashboard = async (req, res) => {
  try {
    const incidencias = await prisma.incidencia.findMany({
      take: 10,
      orderBy: { fecha: 'desc' },
      include: {
        usuario: true,
        inventario: {
          include: { producto: true }
        }
      }
    });

    // Calcular incidencias abiertas y resueltas
    const abiertas = incidencias.filter(i => i.estado === 'Abierta').length;
    const resueltas = incidencias.filter(i => i.estado === 'Resuelta').length;

    // Agrupar por tipo
    const tipos = incidencias.reduce((acc, i) => {
      acc[i.tipo] = (acc[i.tipo] || 0) + 1;
      return acc;
    }, {});

    // Transformar al formato esperado por el frontend
    const reporte = {
      resumen: {
        total: incidencias.length,
        abiertas,
        resueltas,
        tipos
      },
      detalle: incidencias.map(i => ({
        incidenciaId: i.id,
        tipo: i.tipo, // Daño / Faltante / Diferencia
        estado: i.estado, // Abierta / Resuelta / EnProceso
        fecha: i.fecha,
        descripcion: i.descripcion,
        responsable: i.usuario?.nombre || 'Sin asignar',
        producto: i.inventario?.producto?.nombre || 'Sin producto',
        fotoUrl: i.fotoUrl
      }))
    };

    res.json(reporte);
  } catch (error) {
    console.error("Error al obtener incidencias para dashboard:", error);
    res.status(500).json({ error: 'Error al obtener incidencias para dashboard' });
  }
};
