function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// Manejo asíncrono del formulario de contacto (Formspree)
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const messageBox = document.getElementById('contactMessage');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const url = form.action;
    const formData = new FormData(form);

    // Mostrar estado de envío
    messageBox.innerHTML = '<div class="text-muted">Enviando...</div>';

    fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    }).then(function (response) {
      if (response.ok) {
        messageBox.innerHTML = '<div class="text-success">Gracias — tu mensaje fue enviado.</div>';
        form.reset();
      } else {
        response.json().then(function (data) {
          messageBox.innerHTML = '<div class="text-danger">Error al enviar. Intenta nuevamente.</div>';
        }).catch(function () {
          messageBox.innerHTML = '<div class="text-danger">Error de red. Intenta nuevamente.</div>';
        });
      }
    }).catch(function (err) {
      messageBox.innerHTML = '<div class="text-danger">Error de red. Intenta nuevamente.</div>';
    });
  });
});