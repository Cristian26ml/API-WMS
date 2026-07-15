import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Nos aseguramos de cargar las variables de entorno
dotenv.config();

// Creamos la conexión cruda de Postgres usando el paquete 'pg'
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// Se la pasamos al adaptador oficial de Prisma 7
const adapter = new PrismaPg(pool);

// Inicializamos Prisma pasándole el adaptador requerido
const prisma = new PrismaClient({ adapter });

export default prisma;