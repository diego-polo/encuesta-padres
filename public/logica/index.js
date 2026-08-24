document.addEventListener('DOMContentLoaded', () => {

  const formulario = document.getElementById('MiFormulario');

  if (!formulario) {
    console.error("❌ No se encontró el formulario con id='MiFormulario'");
    return;
  }

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita recargar la página

    // 🚀 MAGIA: FormData recoge automáticamente todos los campos del formulario sin importar los ID
    const formData = new FormData(formulario);
    const datos = Object.fromEntries(formData.entries());

    console.log("📦 Datos que se van a enviar:", datos);

    try {
      const respuesta = await fetch('/api/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();

      if (respuesta.ok) {
        alert('✅ ' + resultado.mensaje);
        formulario.reset(); // Limpia los campos
      } else {
        alert('❌ Error: ' + (resultado.error || 'No se pudo guardar'));
      }
    } catch (error) {
      alert('❌ Error de conexión con el servidor: ' + error.message);
      console.error(error);
    }
  });

});
