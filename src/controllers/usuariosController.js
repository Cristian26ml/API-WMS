// src/controllers/usuariosController.js
import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';

export const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Debe ingresar correo y contraseña.' });
        }

        const usuario = await prisma.usuario.findUnique({
            where: { email: email.trim().toLowerCase() },
            include: { rol: true }
        });

        if (!usuario) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
        }

        const esPasswordValida = await bcrypt.compare(password, usuario.password);

        if (!esPasswordValida) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
        }

        res.json({
            token: "WMS_JWT_SESSION_TOKEN_2026", 
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol?.nombre || 'Administrativo'
            }
        });

    } catch (error) {
        console.error('Error en loginUsuario:', error);
        res.status(500).json({ error: 'Error interno en el servidor al intentar iniciar sesión' });
    }
};

export const crearUsuario = async (req, res) => {
    try {
        const { password, ...restoDatos } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const usuario = await prisma.usuario.create({
            data: {
                ...restoDatos,
                password: hashedPassword
            },
            include: { rol: true }
        });

        res.status(201).json(usuario);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            include: { rol: true }
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...restoDatos } = req.body;

        let datosAActualizar = { ...restoDatos };
        if (password) {
            datosAActualizar.password = await bcrypt.hash(password, 10);
        }

        const usuario = await prisma.usuario.update({
            where: { id: parseInt(id) },
            data: datosAActualizar,
            include: { rol: true }
        });

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.usuario.delete({
            where: { id: parseInt(id) }
        });
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};