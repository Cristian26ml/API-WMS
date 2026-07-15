import app from './src/app.js';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor WMS corriendo en http://localhost:${PORT}`);
});
