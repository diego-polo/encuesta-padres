document.addEventListener('DOMContentLoaded', () => {

  // 🎯 AQUÍ: Usamos tu ID exacto "MiFormulario"
  const formulario = document.getElementById('MiFormulario');

  if (!formulario) {
    console.error("❌ No se encontró el formulario 'MiFormulario'");
    return;
  }

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ⚠️ REVISA que estos ID también coincidan con los que tú le pusiste a tus inputs:
    const datos = {
      nombre_acudiente: document.getElementById('nombre_acudiente').value,
      telefono: document.getElementById('telefono').value,
      nombre_estudiante: document.getElementById('nombre_estudiante').value,
      grado: document.getElementById('grado').value,
      mensaje: document.getElementById('mensaje').value
    };

    try {
      const res = await fetch('/api/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const resultado = await res.json();

      if (res.ok) {
        alert('✅ ' + resultado.mensaje); // O tu mensaje bonito
        formulario.reset();
      } else {
        alert('❌ ' + resultado.error);
      }
    } catch (err) {
      alert('❌ Error al enviar datos: ' + err.message);
    }
  });

});
