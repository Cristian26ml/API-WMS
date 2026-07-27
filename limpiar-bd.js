// C:\Proyectos\API-WMS\limpiar-bd.js
import prisma from './src/prismaClient.js';
import bcrypt from 'bcryptjs';

async function limpiarBaseDeDatos() {
  console.log('🚨 ATENCIÓN: Iniciando vaciado de la base de datos WMS...');

  try {
    // 1. Obtener los nombres de todas las tablas en la base de datos
    const tablas = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname='public' AND tablename != '_prisma_migrations';
    `;

    if (tablas.length === 0) {
      console.log('ℹ️ No se encontraron tablas para limpiar.');
      return;
    }

    const nombresTablas = tablas.map(t => `"${t.tablename}"`).join(', ');

    // 2. Vaciamos tablas y reiniciamos contadores (IDs)
    console.log('🧹 Vaciando datos de todas las tablas...');
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${nombresTablas} RESTART IDENTITY CASCADE;`);

    console.log('✅ Base de datos vaciada con éxito.');

    // 3. Regenerar Roles base
    console.log('🌱 Regenerando roles esenciales...');
    const rolAdmin = await prisma.rol.create({
      data: {
        nombre: 'Administrativo',
        descripcion: 'Acceso total a la consola de administración WMS'
      }
    });

    await prisma.rol.create({
      data: {
        nombre: 'Supervisor',
        descripcion: 'Supervisión de andenes, inspecciones y auditorías'
      }
    });

    await prisma.rol.create({
      data: {
        nombre: 'Operario',
        descripcion: 'Operador de terminales móviles PDA para Picking y Recepción'
      }
    });

    // 4. Recrear Usuario Administrador asegurando campos de auditoría
    console.log('👤 Recreando usuario admin@wmsmascotas.cl...');
    const passwordHash = await bcrypt.hash('admin123', 10);
    const ahora = new Date();

    const admin = await prisma.usuario.create({
      data: {
        nombre: 'Administrador Central',
        email: 'admin@wmsmascotas.cl',
        password: passwordHash,
        rolId: rolAdmin.id,
        createdAt: ahora,
        updatedAt: ahora
      }
    });

    console.log('\n✨ ¡PROCESO FINALIZADO CON ÉXITO!');
    console.log('--------------------------------------------------');
    console.log(` Base de datos: 100% limpia`);
    console.log(` Roles creados: Administrativo, Supervisor, Operario`);
    console.log(` Usuario activo: ${admin.email}`);
    console.log(` Contraseña:    admin123`);
    console.log('--------------------------------------------------\n');

  } catch (error) {
    console.error('❌ Error al intentar vaciar la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

limpiarBaseDeDatos();