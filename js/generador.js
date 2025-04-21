// Mostrar el nombre del contrato YAML/JSON seleccionado
document.addEventListener("DOMContentLoaded", function() {
  const contractInput = document.getElementById('contractFile');
  if (contractInput) {
    contractInput.addEventListener('change', function() {
      const file = this.files[0];
      document.getElementById('contractFileName').innerText = file ? `Contrato seleccionado: ${file.name}` : "";
      document.getElementById('contractFileName').className = 'feedback-message';
    });
  }
});

function checkFormReady() {
  var arquetipo = document.getElementById('arquetipoType').value;
  var contract = document.getElementById('contractFile').files.length;
  var btn = document.querySelector('button[onclick="generarProyecto()"]');
  btn.disabled = !(arquetipo && contract);
}

async function generarProyecto() {
  const tipo = document.getElementById("arquetipoType").value;
  const contractInput = document.getElementById("contractFile");
  const contractFile = contractInput.files[0];

  if (!tipo) {
    alert("Debes seleccionar un tipo de arquetipo.");
    return;
  }
  if (!contractFile) {
    alert("Debes subir tu contrato OpenAPI.");
    return;
  }

  const formData = new FormData();
  formData.append("arquetipo", tipo);
  formData.append("contrato", contractFile);

  const btnGenerar = document.querySelector('button[onclick="generarProyecto()"]');
  if (btnGenerar) {
    btnGenerar.disabled = true;
    btnGenerar.innerText = "Generando...";
  }

  try {
    const response = await fetch("https://apiarquetipo.onrender.com/generar", {
      method: "POST",
      body: formData
    });
    if (!response.ok) {
      throw new Error("Error generando el proyecto: " + response.statusText);
    }
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${tipo}-personalizado.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (window.Swal) {
      Swal.fire({
        title: '¡Proyecto descargado correctamente!',
        text: 'Tu proyecto ha sido generado y descargado con éxito.',
        icon: 'success'
      });
    } else {
      alert('¡Proyecto generado y descargado con éxito!');
    }
  } catch (error) {
    alert("Error: " + error.message);
  } finally {
    document.getElementById('contractFile').value = '';
    var arquetipoCombo = document.getElementById('arquetipoType');
    if (arquetipoCombo) {
      arquetipoCombo.selectedIndex = 0;
    }
    if (btnGenerar) {
      btnGenerar.disabled = true;
      btnGenerar.innerText = "GENERAR PROYECTO";
    }
    document.getElementById('arquetipoTitulo').innerText = "";
    document.getElementById('contractFileName').innerText = "";
  }
}
