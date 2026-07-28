import * as http from "http";
import * as fs from "fs";
import * as path from "path";

const servidor = http.createServer((req, res) => {
    const archivo = path.join(__dirname, "publico", "saludo.html");

    fs.readFile(archivo, (error, contenido) => {
        if (error) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Archivo no encontrado");
            return;
        }

        // No se calcula nada. Solo se lee y se entrega tal cual.
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(contenido);
    });
});

servidor.listen(3001, () => console.log("Servidor estático escuchando en http://localhost:3001"));