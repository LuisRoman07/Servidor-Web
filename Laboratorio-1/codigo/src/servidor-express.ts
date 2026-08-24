import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas peticiones, intente de nuevo más tarde" },
});
app.use(limiter);


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


app.get("/api/usuarios", (req: Request, res: Response) => {
  res.json(usuarios);
});


app.get("/api/usuarios/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json(usuario);
});


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


app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});


app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error no controlado:", err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
