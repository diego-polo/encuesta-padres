 let respuestasGuardadas = [];
    async function iniciarSesion() {
      const clave = document.getElementById('inputClave').value;
      const errorMsg = document.getElementById('errorLogin');
      errorMsg.style.display = 'none';
      try {
        const respuestaServidor = await fetch('/api/ver-respuestas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: clave })
        });
        const resultado = await respuestaServidor.json();
        if (!respuestaServidor.ok) {
          throw new Error(resultado.error || 'Acceso denegado');
        }
        // Si la clave es correcta:
        respuestasGuardadas = resultado;
        document.getElementById('seccionLogin').style.display = 'none';
        document.getElementById('panelDatos').style.display = 'block';
        const tbody = document.getElementById('cuerpoTabla');
        tbody.innerHTML = '';
        if (resultado.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Aún no hay respuestas registradas.</td></tr>';
          return;
        }
        resultado.forEach(fila => {
          tbody.innerHTML += `
            <tr>
              <td>${fila.id}</td>
              <td>${fila.nombre_acudiente}</td>
              <td>${fila.telefono}</td>
              <td>${fila.nombre_estudiante}</td>
              <td>${fila.grado}</td>
              <td>${fila.mensaje || '-'}</td>
              <td>${fila.fecha}</td>
            </tr>
          `;
        });
      } catch (err) {
        errorMsg.innerText = err.message;
        errorMsg.style.display = 'block';
      }
    }
    function descargarExcel() {
      if (respuestasGuardadas.length === 0) return alert('No hay datos para exportar.');
      
      let csv = "\uFEFFID,Acudiente,Telefono,Estudiante,Grado,Mensaje,Fecha\n";
      respuestasGuardadas.forEach(fila => {
        csv += `"${fila.id}","${fila.nombre_acudiente}","${fila.telefono}","${fila.nombre_estudiante}","${fila.grado}","${fila.mensaje || ''}","${fila.fecha}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const enlace = document.createElement("a");
      enlace.href = URL.createObjectURL(blob);
      enlace.download = "respuestas_padres.csv";
      enlace.click();
    }