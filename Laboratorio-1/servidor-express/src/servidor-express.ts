import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(helmet());

// Límite de peticiones: 30 por minuto
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30,
  message: { error: "Demasiadas peticiones, intente más tarde." },
});
app.use(limiter);

// Datos ficticios
interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

let usuarios: Usuario[] = [
  { id: 1, nombre: "Ana Pérez", email: "ana@example.com" },
  { id: 2, nombre: "Luis Gómez", email: "luis@example.com" },
  { id: 3, nombre: "María López", email: "maria@example.com" },
];
let nextId = 4;

// Rutas dinámicas
app.get("/api/usuarios", (req: Request, res: Response) => {
  res.json(usuarios);
});

app.get("/api/usuarios/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  res.json(usuario);
});

app.post("/api/usuarios", (req: Request, res: Response) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ error: "Campos nombre y email son obligatorios" });
  }
  const nuevoUsuario: Usuario = { id: nextId++, nombre, email };
  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Middleware de errores (sin stack trace)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
