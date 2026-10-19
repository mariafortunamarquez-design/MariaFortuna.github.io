const themeButton = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

const contactButton = document.getElementById("contactButton");
const contactMenu = document.getElementById("contactMenu");
const copyStatus = document.getElementById("copyStatus");

const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

// Tema claro y oscuro
let theme = "dark";

try {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark" || savedTheme === "light") {
    theme = savedTheme;
  }
} catch {
  // Mantener el tema predeterminado si el almacenamiento no está disponible.
}

function applyTheme() {
  document.documentElement.dataset.theme = theme;

  const isDark = theme === "dark";

  themeIcon.textContent = isDark ? "🌙" : "☀️";
  themeText.textContent = isDark ? "Modo oscuro" : "Modo claro";

  themeButton.setAttribute(
    "aria-label",
    isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
  );

  try {
    localStorage.setItem("theme", theme);
  } catch {
    // El cambio de tema sigue funcionando sin guardar la preferencia.
  }
}

themeButton.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme();
});

applyTheme();

// Menú de contacto
function closeContactMenu() {
  contactMenu.classList.remove("open");
  contactButton.setAttribute("aria-expanded", "false");
}

contactButton.addEventListener("click", () => {
  const isOpen = contactMenu.classList.toggle("open");

  contactButton.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".contact-wrap")) {
    closeContactMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    contactMenu.classList.contains("open")
  ) {
    closeContactMenu();
    contactButton.focus();
  }
});

// Revelar correo y teléfono
document.querySelectorAll(".contact-option").forEach(button => {
  button.addEventListener("click", () => {
    const details = document.getElementById(
      button.getAttribute("aria-controls")
    );

    const shouldOpen = details.hidden;

    details.hidden = !shouldOpen;
    button.setAttribute("aria-expanded", String(shouldOpen));

    copyStatus.textContent = "";
  });
});

// Copiar datos de contacto
document.querySelectorAll(".copy-button").forEach(button => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(value);

      copyStatus.textContent = `Copiado: ${value}`;
    } catch {
      copyStatus.textContent =
        "No se pudo copiar automáticamente. Selecciona el dato y cópialo manualmente.";

      const valueElement = button
        .closest(".contact-details")
        .querySelector(".contact-value");

      const selection = window.getSelection();

      if (selection) {
        const range = document.createRange();

        range.selectNodeContents(valueElement);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  });
});

// Tamaño del fondo
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Estrellas
const stars = Array.from({ length: 130 }, () => ({
  x: Math.random(),
  y: Math.random(),
  size: Math.random() * 1.6 + .4,
  speed: Math.random() * .00035 + .00008,
  opacity: Math.random() * .6 + .25,
  phase: Math.random() * Math.PI * 2
}));

// Símbolos decorativos
const tarotSymbols = ["✦", "☾", "✧", "☉", "✶", "♆", "☿"];

const glyphs = Array.from({ length: 14 }, () => ({
  x: Math.random(),
  y: Math.random(),
  symbol: tarotSymbols[
    Math.floor(Math.random() * tarotSymbols.length)
  ],
  size: Math.random() * 12 + 14,
  speed: Math.random() * .00012 + .00004,
  opacity: Math.random() * .12 + .05
}));

// Animación del fondo
function drawStarfield(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isDark = theme === "dark";

  stars.forEach(star => {
    star.y += star.speed;

    if (star.y > 1) {
      star.y = 0;
    }

    const twinkle =
      .55 + Math.sin(time * .002 + star.phase) * .35;

    ctx.beginPath();

    ctx.arc(
      star.x * canvas.width,
      star.y * canvas.height,
      star.size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = isDark
      ? `rgba(226, 232, 240, ${star.opacity * twinkle})`
      : `rgba(30, 64, 175, ${
          Math.min(1, star.opacity * twinkle * 2.2)
        })`;

    ctx.fill();
  });

  glyphs.forEach(glyph => {
    glyph.y -= glyph.speed;

    if (glyph.y < -.08) {
      glyph.y = 1.08;
    }

    ctx.font = `${glyph.size}px serif`;

    ctx.fillStyle = isDark
      ? `rgba(196, 181, 253, ${glyph.opacity})`
      : `rgba(30, 64, 175, ${
          Math.min(.45, glyph.opacity * 3)
        })`;

    ctx.fillText(
      glyph.symbol,
      glyph.x * canvas.width,
      glyph.y * canvas.height
    );
  });

  requestAnimationFrame(drawStarfield);
}

requestAnimationFrame(drawStarfield);
