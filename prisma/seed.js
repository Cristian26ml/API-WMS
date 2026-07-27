// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Inicializando Roles del Sistema WMS...');

    const rolesDefinidos = [
        { nombre: 'Administrativo', descripcion: 'Acceso total a la consola de administración WMS' },
        { nombre: 'Supervisor', descripcion: 'Supervisión de andenes, inspecciones y auditorías' },
        { nombre: 'Operario', descripcion: 'Operador de terminales móviles PDA para Picking y Recepción' }
    ];

    for (const r of rolesDefinidos) {
        const existe = await prisma.rol.findFirst({ where: { nombre: r.nombre } });
        if (!existe) {
            await prisma.rol.create({ data: r });
            console.log(`✅ Rol '${r.nombre}' creado.`);
        }
    }

    const rolAdmin = await prisma.rol.findFirst({ where: { nombre: 'Administrativo' } });

    const passwordHash = await bcrypt.hash('admin123', 10);
    const usuarioAdmin = await prisma.usuario.upsert({
        where: { email: 'admin@wmsmascotas.cl' },
        update: { password: passwordHash },
        create: {
            nombre: 'Administrador Central',
            email: 'admin@wmsmascotas.cl',
            password: passwordHash,
            rolId: rolAdmin.id
        },
    });

    console.log('\n ¡Semilla de roles y usuarios ejecutada con éxito!');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });