// controllers/dashboardInventariosController.js
import prisma from '../prismaClient.js';

export const obtenerInventariosDashboard = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        inventarios: {
          include: { 
            ubicacion: true,
            unidadesAlmacenamiento: true // 🚨 Relación exacta según tu schema.prisma
          }
        }
      }
    });

    const reporte = productos.map(producto => {
      const stockDisponible = producto.inventarios
        .filter(inv => inv.estado.toLowerCase() === 'disponible')
        .reduce((sum, inv) => sum + inv.cantidad, 0);

      const stockBloqueado = producto.inventarios
        .filter(inv => inv.estado.toLowerCase() !== 'disponible')
        .reduce((sum, inv) => sum + inv.cantidad, 0);

      return {
        productoId: producto.id,
        codigo: producto.codigo,
        nombre: producto.nombre,
        categoria: producto.categoria,
        unidadMedida: producto.unidadMedida,
        stockDisponible,
        stockBloqueado,
        requiereReposicion: false, 
        
        detalle: producto.inventarios.map(inv => {
          // Extraemos el código de la UA asociada desde el arreglo
          const codigoUA = inv.unidadesAlmacenamiento && inv.unidadesAlmacenamiento.length > 0
            ? inv.unidadesAlmacenamiento[0].codigo 
            : 'SIN_UA';

          return {
            bodega: inv.ubicacion.bodega,
            zona: inv.ubicacion.zona,
            rack: inv.ubicacion.rack, // Contiene el código compacto como A1001
            posicion: inv.ubicacion.posicion, // Contiene la coordenada A - 10 - 01
            ua: codigoUA,
            lote: inv.lote,
            estado: inv.estado,
            cantidad: inv.cantidad,
            vence: inv.fechaVencimiento
          };
        })
      };
    });

    res.json(reporte);
  } catch (error) {
    console.error("Error al obtener inventarios:", error);
    res.status(500).json({ error: 'Error al obtener inventarios para dashboard' });
  }
};