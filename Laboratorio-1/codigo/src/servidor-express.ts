import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = 3000;

// ---------- Middlewares base ----------
app.use(express.json());
app.use(helmet());

// Limita a 30 peticiones por minuto por IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones, intente de nuevo más tarde" },
});
app.use(limiter);

// ---------- "Base de datos" en memoria ----------
interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

let usuarios: Usuario[] = [
  { id: 1, nombre: "Ana López", email: "ana.lopez@example.com" },
  { id: 2, nombre: "Carlos Pérez", email: "carlos.perez@example.com" },
  { id: 3, nombre: "María Gómez", email: "maria.gomez@example.com" },
];
let nextId = 4;

// ---------- Rutas ----------

// GET /api/usuarios
app.get("/api/usuarios", (req: Request, res: Response) => {
  res.json(usuarios);
});

// GET /api/usuarios/:id
app.get("/api/usuarios/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json(usuario);
});

// POST /api/usuarios
app.post("/api/usuarios", (req: Request, res: Response) => {
  const { nombre, email } = req.body ?? {};

  if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
    return res.status(400).json({ error: "El campo 'nombre' es requerido" });
  }
  if (!email || typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({ error: "El campo 'email' es requerido" });
  }

  const nuevoUsuario: Usuario = {
    id: nextId++,
    nombre: nombre.trim(),
    email: email.trim(),
  };

  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

// GET /api/health
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ---------- Ruta no encontrada ----------
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// ---------- Middleware de manejo de errores ----------
// Nunca se expone el stack trace al cliente
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error no controlado:", err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
