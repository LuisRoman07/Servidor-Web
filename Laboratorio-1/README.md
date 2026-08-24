# Laboratorio 1 - Gestión de Servidores Web (Sección A)

## Estructura
- `codigo/` — código fuente y configuración (TypeScript + Node.js)
- `capturas/` — capturas de pantalla solicitadas en el examen

## Instalación
```bash
cd codigo
npm install
```

## Ejercicio 1 — Servidor estático (puerto 3001)
1. Coloca el `index.html` proporcionado dentro de `codigo/public/`.
2. Ejecuta:
```bash
npm run estatico
```
3. Abre http://localhost:3001

## Ejercicio 2 — Servidor Express (puerto 3000)
```bash
npm run express
```

Rutas disponibles:
- `GET /api/usuarios`
- `GET /api/usuarios/:id`
- `POST /api/usuarios` (body JSON: `{ "nombre": "...", "email": "..." }`)
- `GET /api/health`

Incluye `helmet`, `express-rate-limit` (30 peticiones/minuto) y un middleware
de manejo de errores que nunca expone el stack trace al cliente.
