// Esperar a que todo el documento HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

  const formulario = document.getElementById('formEncuesta');

  if (!formulario) {
    console.error("❌ No se encontró ningún elemento con id='formEncuesta'");
    return;
  }

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const noti = document.getElementById('notificacion');
    const btn = document.getElementById('btnSubmit');
    
    if (btn) {
      btn.innerText = 'Enviando...';
      btn.disabled = true;
    }

    // 1. Recolectar datos ingresados por el padre
    const datos = {
      nombre_acudiente: document.getElementById('nombre_acudiente').value,
      telefono: document.getElementById('telefono').value,
      nombre_estudiante: document.getElementById('nombre_estudiante').value,
      grado: document.getElementById('grado').value,
      mensaje: document.getElementById('mensaje').value
    };

    try {
      // 2. Enviar datos al servidor
      const res = await fetch('/api/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const resultado = await res.json();

      if (res.ok) {
        if (noti) {
          noti.className = 'notificacion exito';
          noti.innerText = '✅ ' + resultado.mensaje;
          noti.style.display = 'block';
        }
        formulario.reset(); // Limpia los campos del formulario
      } else {
        throw new Error(resultado.error || 'Error al guardar en el servidor');
      }
    } catch (err) {
      if (noti) {
        noti.className = 'notificacion error';
        noti.innerText = '❌ ' + err.message;
        noti.style.display = 'block';
      }
      console.error(err);
    } finally {
      if (btn) {
        btn.innerText = 'Enviar Respuesta';
        btn.disabled = false;
      }
    }
  });

});
