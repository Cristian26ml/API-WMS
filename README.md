========================================================================
BACKEND - SISTEMA DE GESTION DE ALMACEN (WMS)
========================================================================

Este proyecto es el backend para el Sistema de Gestion de Almacen (WMS), 
construido con Node.js, Express, Socket.IO y Prisma ORM (v7). La 
arquitectura esta disenada para ejecutarse en entornos locales 
aislados mediante contenedores y adaptadores de bases de datos nativos.

------------------------------------------------------------------------
REQUISITOS PREVIOS
------------------------------------------------------------------------

Antes de iniciar, asegurate de tener instalado:
* Node.js (Version v18 o superior)
* Docker Desktop (Para gestionar la base de datos de forma aislada)

NOTA CRITICA PARA WINDOWS: Para evitar errores de inicializacion del 
motor de Prisma (PrismaClientInitializationError), NUNCA clones ni 
ejecutes este proyecto dentro de carpetas sincronizadas por OneDrive, 
Dropbox o iCloud. Corre el proyecto siempre desde una ruta fisica 
local nativa (ejemplo: C:\Proyectos\API-WMS).

------------------------------------------------------------------------
INSTALACION Y CONFIGURACION INICIAL
------------------------------------------------------------------------

Sigue estos pasos para levantar el entorno de desarrollo desde cero:

1. Inicializar el proyecto Node.js
Crea el archivo 'package.json' con la configuracion por defecto corriendo 
en tu terminal:
   
   npm init -y

* Asegurate de agregar "type": "module" en tu package.json para habilitar 
el soporte nativo de ES Modules (import/export).

2. Instalar dependencias del sistema
Instala las librerias necesarias para el funcionamiento del servidor, 
seguridad, tiempo real y el Driver Adapter obligatorio de Prisma 7:

   npm install express prisma @prisma/client express-validator helmet cors dotenv @prisma/adapter-pg pg socket.io

* Express: Framework web para las rutas de la API.
* Socket.io: Motor de comunicacion bidireccional en tiempo real.
* Prisma & @prisma/client: ORM para la gestion de la base de datos.
* @prisma/adapter-pg & pg: Adaptador de controlador obligatorio en 
  Prisma 7 para conectar el cliente con PostgreSQL de forma local.
* Helmet & Cors: Capas de seguridad HTTP y control de acceso.
* Express-validator: Validacion de datos entrantes (SKUs, cantidades).
* Dotenv: Gestion de variables de entorno de forma segura.

3. Instalar dependencias de desarrollo
Herramientas secundarias que optimizan el flujo de trabajo en desarrollo:

   npm install --save-dev nodemon prettier

* Nodemon: Reinicia el servidor automaticamente al guardar cambios.
* Prettier: Mantiene el formateo de codigo unificado.

4. Levantar la Base de Datos con Docker
El proyecto utiliza Docker Compose para levantar una instancia aislada 
y limpia de PostgreSQL 15 (Alpine) junto con un volumen para la 
persistencia de datos.

Asegurate de tener Docker Desktop abierto (con el motor en ejecucion) 
y ejecuta el siguiente comando en la raiz del proyecto:

   docker compose up -d

5. Configuracion de Variables de Entorno (.env)
Crea un archivo .env en la raiz del proyecto y configura tu cadena de 
conexion apuntando al contenedor de Docker junto con el tipo de motor:

   DATABASE_URL="postgresql://cristian:tu_password_seguro@localhost:5434/wms_db?schema=public"
   PORT=3000
   PRISMA_CLIENT_ENGINE_TYPE="library"

6. Configurar el archivo de conexion (Prisma 7)
A partir de Prisma 7, las conexiones ya no se inyectan en el archivo 
schema.prisma. Asegurate de tener el archivo prisma.config.ts en la 
raiz del proyecto para mapear la URL desde las variables de entorno:

   import { defineConfig } from '@prisma/config';

   export default defineConfig({
     datasource: {
       url: process.env.DATABASE_URL,
     },
   });

7. Sincronizar y Migrar la Base de Datos
Una vez que el contenedor de Docker este encendido y los archivos de 
configuracion listos, ejecuta las migraciones para impactar el esquema:

   npx prisma migrate dev --name init
------------------------------------------------------------------------
ESTRUCTURA DEL PROYECTO
------------------------------------------------------------------------

El backend esta estructurado de forma modular bajo la siguiente jerarquia:

* server.js: Punto de entrada de la aplicacion. Eleva el servidor HTTP, 
  inicializa la instancia global de Socket.IO para eventos en tiempo real 
  y maneja las conexiones activas.
* src/prismaClient.js: Instancia centralizada de Prisma Client que 
  inicializa el Driver Adapter (PrismaPg) requerido por Prisma 7, 
  optimizando el Connection Pool hacia el contenedor de Docker.
* src/app.js: Cerebro del servidor Express. Configura los middlewares 
  globales de seguridad (Helmet, CORS, JSON parsing) y centraliza el 
  enrutador mapeando los modulos core.
* src/routes/: Rutas de la API estructuradas por dominio.
* src/controllers/: Capa de controladores para la logica de negocios.

------------------------------------------------------------------------
MODULOS IMPLEMENTADOS (CORE WMS)
------------------------------------------------------------------------

El sistema cuenta con 10 modulos logisticos interconectados con el ORM:

1.  Incidencias: Registro de mermas, anomalias y problemas en el stock.
2.  Indicadores: Consultas de rendimiento del almacen (KPIs).
3.  Inventarios: Gestion avanzada de stock real por Lote, Fecha de 
    Vencimiento y Estado (Disponible, Reservado, Danado).
4.  Movimientos: Registro de entradas, salidas y transferencias.
5.  Ordenes: Solicitudes de picking, despacho y ordenes de compra.
6.  Productos: Maestro de articulos con SKU y Stock Minimo de control.
7.  Proveedores: Catalogo de abastecedores asociados a los productos.
8.  Roles: Niveles de permisos del sistema (Admin, Compras, Operario).
9.  Ubicaciones: Mapa fisico del almacen (Pasillos, Estantes, Zonas).
10. Usuarios: Registro de personal vinculado a un rol e ID especifico.

* Incluye Reporte de Reposicion Activo para Compras en:
  GET /api/inventarios/reporte-compras (Cruza Stock Minimo vs Disponible)
========================================================================
