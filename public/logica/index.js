document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('MiFormulario');
  const alerta = document.getElementById('mensajeAlerta');

  if (!formulario) return;

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(formulario);
    const datos = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const resultado = await res.json();

      if (res.ok) {
        alert('✅ ¡Muchas gracias! La encuesta ha sido guardada exitosamente.');
        formulario.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('❌ Error: ' + resultado.error);
      }
    } catch (err) {
      alert('❌ Error de conexión al guardar: ' + err.message);
      console.error(err);
    }
  });
});
