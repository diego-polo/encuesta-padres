// Conectamos el botón de enviar con nuestro Backend SQL
    document.getElementById('miFormulario').addEventListener('submit', async function(e) {
      e.preventDefault(); // Evita que la página se recargue
      const aviso = document.getElementById('mensajeAviso');
      // 1. Recogemos los datos que escribió el usuario
      const datos = {
        nombre_acudiente: document.getElementById('nombre_acudiente').value,
        telefono: document.getElementById('telefono').value,
        nombre_estudiante: document.getElementById('nombre_estudiante').value,
        grado: document.getElementById('grado').value,
        mensaje: document.getElementById('mensaje').value
      };
      try {
        // 2. Enviamos los datos al servidor (server.js)
        const respuesta = await fetch('/api/guardar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos)
        });
        const resultado = await respuesta.json();
        if (respuesta.ok) {
          aviso.className = 'aviso exito';
          aviso.innerText = resultado.mensaje;
          aviso.style.display = 'block';
          document.getElementById('miFormulario').reset(); // Limpia los campos
        } else {
          throw new Error(resultado.error);
        }
      } catch (error) {
        aviso.className = 'aviso error';
        aviso.innerText = 'Error: ' + error.message;
        aviso.style.display = 'block';
      }
    });