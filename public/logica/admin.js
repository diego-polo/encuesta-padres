let respuestasGuardadas = [];

async function iniciarSesion() {
  const clave = document.getElementById('inputClave').value;
  const errorMsg = document.getElementById('errorLogin');
  errorMsg.style.display = 'none';

  try {
    const res = await fetch('/api/ver-respuestas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: clave })
    });

    const resultado = await res.json();

    if (!res.ok) {
      throw new Error(resultado.error || 'Acceso no autorizado');
    }

    // Si la contraseña es correcta, mostramos la tabla
    respuestasGuardadas = resultado;
    document.getElementById('seccionLogin').style.display = 'none';
    document.getElementById('panelDatos').style.display = 'block';

    const tbody = document.getElementById('cuerpoTabla');
    tbody.innerHTML = '';

    if (resultado.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 25px;">Aún no hay respuestas registradas.</td></tr>';
      return;
    }

    resultado.forEach(f => {
      tbody.innerHTML += `
        <tr>
          <td><strong>#${f.id}</strong></td>
          <td>${f.nombre_acudiente}</td>
          <td>${f.nombre_estudiante}</td>
          <td><span class="badge-grado">${f.grado}</span></td>
          <td style="font-size: 12px; line-height: 1.6;">
            <strong>P1 (Lectura/Tipo texto):</strong> ${f.pregunta1 || '-'}<br>
            <strong>P2 (Tecnología/Comprensión):</strong> ${f.pregunta2 || '-'}<br>
            <strong>P3 (Poesía y Comprensión):</strong> ${f.pregunta3 || '-'}<br>
            <strong>P4 (Apps/Audios de poesía):</strong> ${f.pregunta4 || '-'}<br>
            <strong>P5 (Libro TIC reciente):</strong> ${f.pregunta5 || '-'}<br>
            <strong>P6 (Disposición a apoyar):</strong> ${f.pregunta6 || '-'}
          </td>
          <td style="color: #64748b; font-size: 12px;">${f.fecha}</td>
        </tr>
      `;
    });

  } catch (err) {
    errorMsg.innerText = '❌ ' + err.message;
    errorMsg.style.display = 'block';
  }
}

// Permitir entrar presionando "Enter" en el teclado
document.getElementById('inputClave').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    iniciarSesion();
  }
});

// Función para descargar en Excel (.CSV con codificación UTF-8 para tildes y eñes)
function descargarExcel() {
  if (respuestasGuardadas.length === 0) return alert('No hay datos para exportar.');
  
  let csv = "\uFEFFID,Acudiente,Estudiante,Grado,Pregunta 1,Pregunta 2,Pregunta 3,Pregunta 4,Pregunta 5,Pregunta 6,Fecha\n";
  
  respuestasGuardadas.forEach(f => {
    csv += `"${f.id}","${f.nombre_acudiente}","${f.nombre_estudiante}","${f.grado}","${(f.pregunta1||'').replace(/"/g, '""')}","${(f.pregunta2||'').replace(/"/g, '""')}","${(f.pregunta3||'').replace(/"/g, '""')}","${(f.pregunta4||'').replace(/"/g, '""')}","${(f.pregunta5||'').replace(/"/g, '""')}","${(f.pregunta6||'').replace(/"/g, '""')}","${f.fecha}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = "investigacion_padres_UT.csv";
  enlace.click();
}
