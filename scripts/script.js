document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const mobileList = document.getElementById('mobile-nav-list');
  const desktopList = document.querySelector('nav ul.desktop-nav');
  const backHome = document.querySelector('.back-home');

  // Clonar items (si aún no están)
  if (desktopList && mobileList && mobileList.children.length === 0) {
    mobileList.innerHTML = desktopList.innerHTML;
  }

  const openDrawer = () => {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden','false');
    btn.setAttribute('aria-expanded','true');
  };
  const closeDrawer = () => {
    drawer.classList.remove('is-open','is-closing');
    drawer.setAttribute('aria-hidden','true');
    btn.setAttribute('aria-expanded','false');
  };

  btn?.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('is-open');
    isOpen ? closeDrawer() : openDrawer();
  });

  drawer?.querySelector('[data-close]')?.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
  });

  // 🔹 Animación de salida al presionar "Volver"
  if (backHome) {
    backHome.addEventListener('click', (e) => {
      e.preventDefault(); // detener navegación inmediata
      drawer.classList.remove('is-open');
      drawer.classList.add('is-closing');

      const onAnimEnd = () => {
        drawer.removeEventListener('animationend', onAnimEnd);
        window.location.href = backHome.href; // ahora sí navega al home
      };
      drawer.addEventListener('animationend', onAnimEnd);
    });
  }
});

// === Bloquear clic derecho y arrastre en imágenes ===
document.addEventListener("contextmenu", (e) => {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});

document.addEventListener("dragstart", (e) => {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});
