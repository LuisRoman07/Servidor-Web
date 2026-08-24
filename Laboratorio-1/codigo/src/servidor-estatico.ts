import * as http from "http";
import * as fs from "fs";
import * as path from "path";

const PORT = 3001;


const INDEX_PATH = path.join(__dirname, "..", "public", "index.html");

const server = http.createServer((req, res) => {

  fs.readFile(INDEX_PATH, "utf-8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Error interno del servidor: no se pudo leer index.html");
      console.error("Error leyendo index.html:", err.message);
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor estático corriendo en http://localhost:${PORT}`);
});
