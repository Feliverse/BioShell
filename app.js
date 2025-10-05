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
  // Ensure navbar collapse is closed on load: remove any lingering 'show' and reset toggler state
  try {
    const initialNavCollapse = document.getElementById('navbarSupportedContent');
    const initialToggler = document.querySelector('.navbar-toggler');
    if (initialNavCollapse) {
      // defensive: remove any 'show' class and inline height
      if (initialNavCollapse.classList.contains('show')) initialNavCollapse.classList.remove('show');
      if (initialNavCollapse.style) initialNavCollapse.style.height = '';
      // use Bootstrap API to ensure it's hidden (if available)
      try {
        const bs = bootstrap.Collapse.getOrCreateInstance(initialNavCollapse);
        bs.hide();
      } catch (er) {
        // ignore if bootstrap isn't available
      }
    }
    if (initialToggler) {
      initialToggler.setAttribute('aria-expanded', 'false');
      const ic = initialToggler.querySelector('.fa');
      if (ic) {
        ic.classList.remove('fa-times');
        ic.classList.add('fa-bars');
      }
      // also remove any open class
      initialToggler.classList.remove('open');
    }
  } catch (err) {
    // ignore
  }
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

  // Cerrar el menu collapse del navbar cuando se hace click en un enlace (útil en móvil)
  try {
    const navCollapse = document.getElementById('navbarSupportedContent');
    const togglerBtn = document.querySelector('.navbar-toggler');
    const togglerIcon = togglerBtn ? togglerBtn.querySelector('.fa') : null;
    if (navCollapse) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
      // Ensure collapse starts closed on small screens (navbar-expand-lg -> breakpoint 992px)
      try {
        if (window.innerWidth < 992) {
          // hide to guarantee closed state on mobile/tablet
          bsCollapse.hide();
        }
      } catch (er) {
        // ignore
      }

      // toggle icon on show/hide using Bootstrap events
      navCollapse.addEventListener('shown.bs.collapse', function () {
        if (togglerIcon) {
          togglerIcon.classList.remove('fa-bars');
          togglerIcon.classList.add('fa-times');
        }
        if (togglerBtn) togglerBtn.classList.add('open');
      });
      navCollapse.addEventListener('hidden.bs.collapse', function () {
        if (togglerIcon) {
          togglerIcon.classList.remove('fa-times');
          togglerIcon.classList.add('fa-bars');
        }
        if (togglerBtn) togglerBtn.classList.remove('open');
      });

      // manejar clicks en enlaces: smooth scroll y cerrar collapse después
      navCollapse.querySelectorAll('a.nav-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
              e.preventDefault();
              // realizar smooth scroll
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // cerrar el collapse después de una pequeña espera (tiempo para la animación de scroll)
              const delay = 420; // ms — ajustable
              setTimeout(function () { if (navCollapse.classList.contains('show')) bsCollapse.hide(); }, delay);
              return;
            }
          }
          // si no es anchor interno, cerrar inmediatamente en móvil
          if (navCollapse.classList.contains('show')) {
            bsCollapse.hide();
          }
        });
      });
    }
  } catch (e) {
    // Si bootstrap no está presente o la API falla, no interrumpir
    console.warn('Navbar auto-close: bootstrap API not available', e);
  }
});

// Extra defensive attempts after full load to handle race conditions
window.addEventListener('load', function () {
  try {
    const navCollapse = document.getElementById('navbarSupportedContent');
    const toggler = document.querySelector('.navbar-toggler');
    const togglerIcon = toggler ? toggler.querySelector('.fa') : null;
    // multiple staggered attempts in case Bootstrap or other scripts run slightly later
    [100, 300, 700].forEach(function (delay) {
      setTimeout(function () {
        try {
          if (navCollapse) {
            navCollapse.classList.remove('show');
            if (navCollapse.style) navCollapse.style.height = '';
            try {
              const bs = bootstrap.Collapse.getOrCreateInstance(navCollapse);
              bs.hide();
            } catch (er) {
              // ignore if bootstrap not available yet
            }
          }
          if (toggler) {
            toggler.setAttribute('aria-expanded', 'false');
            toggler.classList.remove('open');
            if (togglerIcon) {
              togglerIcon.classList.remove('fa-times');
              togglerIcon.classList.add('fa-bars');
            }
          }
        } catch (err) {
          // ignore per-attempt errors
        }
      }, delay);
    });
  } catch (e) {
    // ignore top-level
  }
});