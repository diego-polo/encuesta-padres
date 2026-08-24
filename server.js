const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Permite recibir datos en formato JSON desde el formulario
app.use(express.json());

// Hace accesible la carpeta "public" (donde están tus HTML, CSS e imágenes)
app.use(express.static('public'));


const PASSWORD_ADMIN = "Luisa2341@#"; // <-- PON TU CONTRASEÑA AQUÍ



const db = new sqlite3.Database('./encuesta.db', (err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
  } else {
    console.log('✅ Base de datos SQL conectada correctamente.');
  }
});


db.run(`CREATE TABLE IF NOT EXISTS respuestas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_acudiente TEXT,
  telefono TEXT,
  nombre_estudiante TEXT,
  grado TEXT,
  mensaje TEXT,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP
)`);


// ====================================================================
// 3. RUTA PÚBLICA: Guardar respuestas de los padres
// ====================================================================
app.post('/api/guardar', (req, res) => {
  const { nombre_acudiente, telefono, nombre_estudiante, grado, mensaje } = req.body;

  const sql = `INSERT INTO respuestas (nombre_acudiente, telefono, nombre_estudiante, grado, mensaje) VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [nombre_acudiente, telefono, nombre_estudiante, grado, mensaje], function (err) {
    if (err) {
      console.error('Error al guardar en SQL:', err);
      return res.status(500).json({ error: 'Hubo un error al guardar la información.' });
    }
    res.json({ mensaje: '¡Información guardada exitosamente!', idGuardado: this.lastID });
  });
});


// ====================================================================
// 4. RUTA PRIVADA: Ver respuestas (SOLO CON CONTRASEÑA)
// ====================================================================
app.post('/api/ver-respuestas', (req, res) => {
  const { password } = req.body;

  // Verificamos si la contraseña coincide
  if (password !== PASSWORD_ADMIN) {
    return res.status(401).json({ error: 'Contraseña incorrecta. Acceso denegado.' });
  }

  // Si la clave es correcta, consultamos la base de datos SQL
  db.all(`SELECT * FROM respuestas ORDER BY fecha DESC`, [], (err, filas) => {
    if (err) {
      return res.status(500).json({ error: 'Error al consultar la base de datos.' });
    }
    res.json(filas);
  });
});


// ====================================================================
// 5. INICIAR EL SERVIDOR
// ====================================================================
const PUERTO = 3000;
app.listen(PUERTO, () => {
  console.log(`🚀 Servidor funcionando en: http://localhost:${PUERTO}`);
  console.log(`🔒 Panel de administración privado: http://localhost:${PUERTO}/admin.html`);
});