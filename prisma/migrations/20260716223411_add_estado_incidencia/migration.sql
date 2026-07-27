-- CreateEnum
CREATE TYPE "EstadoIncidencia" AS ENUM ('Abierta', 'Resuelta', 'EnProceso');

-- DropForeignKey
ALTER TABLE "Incidencia" DROP CONSTRAINT "Incidencia_inventarioId_fkey";

-- DropForeignKey
ALTER TABLE "Incidencia" DROP CONSTRAINT "Incidencia_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Incidencia" ADD COLUMN     "estado" "EstadoIncidencia" NOT NULL DEFAULT 'Abierta',
ALTER COLUMN "usuarioId" DROP NOT NULL,
ALTER COLUMN "inventarioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_inventarioId_fkey" FOREIGN KEY ("inventarioId") REFERENCES "Inventario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
