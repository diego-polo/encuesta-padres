const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 CONTRASEÑA OFICIAL DEL PANEL DE ADMINISTRACIÓN
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Luisa2341@#";

// 🗄️ CONEXIÓN A LA BASE DE DATOS SQLITE
const db = new sqlite3.Database('./encuesta.db', (err) => {
  if (err) {
    console.error('❌ Error al conectar la base de datos:', err.message);
  } else {
    console.log('✅ Base de datos SQL conectada.');
  }
});

// 📋 CREAR TABLA PARA LA INVESTIGACIÓN (Si no existe)
db.run(`CREATE TABLE IF NOT EXISTS respuestas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_acudiente TEXT,
  nombre_estudiante TEXT,
  grado TEXT,
  pregunta1 TEXT,
  pregunta2 TEXT,
  pregunta3 TEXT,
  pregunta4 TEXT,
  pregunta5 TEXT,
  pregunta6 TEXT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// 📌 1. RUTA PARA GUARDAR LAS RESPUESTAS DE LOS PADRES
app.post('/api/guardar', (req, res) => {
  const { 
    nombre_acudiente, 
    nombre_estudiante, 
    grado, 
    pregunta1, 
    pregunta2, 
    pregunta3, 
    pregunta4, 
    pregunta5, 
    pregunta6 
  } = req.body;

  const sql = `INSERT INTO respuestas 
    (nombre_acudiente, nombre_estudiante, grado, pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, pregunta6) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [
    nombre_acudiente, 
    nombre_estudiante, 
    grado, 
    pregunta1, 
    pregunta2, 
    pregunta3, 
    pregunta4, 
    pregunta5, 
    pregunta6
  ], function(err) {
    if (err) {
      console.error('Error al guardar en SQL:', err);
      return res.status(500).json({ error: 'Hubo un error al guardar los datos en el servidor.' });
    }
    res.status(201).json({ mensaje: '¡Muchas gracias! Respuestas registradas correctamente.' });
  });
});

// 🔒 2. RUTA PRIVADA: VER RESPUESTAS (PROTEGIDA CON CONTRASEÑA)
app.post('/api/ver-respuestas', (req, res) => {
  const { password } = req.body;

  // Verificación de contraseña
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta. Acceso no autorizado.' });
  }

  // Si la clave es correcta, entrega los datos
  db.all(`SELECT * FROM respuestas ORDER BY fecha DESC`, [], (err, filas) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar la base de datos.' });
    }
    res.json(filas);
  });
});

// 🚀 INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en el puerto ${PORT}`);
});
