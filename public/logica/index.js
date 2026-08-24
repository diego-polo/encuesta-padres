document.getElementById('formEncuesta').addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que la página se recargue

  const noti = document.getElementById('notificacion');
  const btn = document.getElementById('btnSubmit');
  
  btn.innerText = 'Enviando...';
  btn.disabled = true;

  // 1. Recolectar datos
  const datos = {
    nombre_acudiente: document.getElementById('nombre_acudiente').value,
    telefono: document.getElementById('telefono').value,
    nombre_estudiante: document.getElementById('nombre_estudiante').value,
    grado: document.getElementById('grado').value,
    mensaje: document.getElementById('mensaje').value
  };

  try {
    // 2. Enviar a server.js
    const res = await fetch('/api/guardar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    const resultado = await res.json();

    if (res.ok) {
      noti.className = 'notificacion exito';
      noti.innerText = '✅ ' + resultado.mensaje;
      noti.style.display = 'block';
      document.getElementById('formEncuesta').reset(); // Limpia los campos
    } else {
      throw new Error(resultado.error || 'Error al guardar');
    }
  } catch (err) {
    noti.className = 'notificacion error';
    noti.innerText = '❌ ' + err.message;
    noti.style.display = 'block';
  } finally {
    btn.innerText = 'Enviar Respuesta';
    btn.disabled = false;
  }
});
