import * as http from "http";
import { URL } from "url";

const servidor = http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

    if (url.pathname === "/hora-saludo") {
        const nombre = url.searchParams.get("nombre") ?? "visitante";
        const hora = new Date().getHours();
        
        // Lógica de negocio
        const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

        // Respuesta calculada al instante
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<h1>${saludo}, ${nombre}</h1>`);
        return;
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("No encontrado");
});

servidor.listen(3002, () => console.log("Contenedor dinámico escuchando en http://localhost:3002"));