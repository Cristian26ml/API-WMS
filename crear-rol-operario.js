// crear-rol-operario.js
import prisma from './src/prismaClient.js';

async function agregarRolOperario() {
    console.log('Creando rol Operario...');

    const rolOperario = await prisma.rol.upsert({
        where: { id: 3 }, 
        update: {},
        create: {
            nombre: 'Operario',
            descripcion: 'Acceso a terminales móviles PDA (Picking, Recepción y Conteos en Bodega)'
        }
    });

    const rolSupervisor = await prisma.rol.upsert({
        where: { id: 2 },
        update: {},
        create: {
            nombre: 'Supervisor',
            descripcion: 'Supervisión de andenes, inspecciones y auditorías de inventario'
        }
    });

    console.log(' Roles creados / verificados exitosamente:');
    console.log(`   - ID ${rolSupervisor.id}: ${rolSupervisor.nombre}`);
    console.log(`   - ID ${rolOperario.id}: ${rolOperario.nombre}`);
}

agregarRolOperario()
    .catch(console.error)
    .finally(() => prisma.$disconnect());