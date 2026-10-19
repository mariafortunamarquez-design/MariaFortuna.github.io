const themeButton = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");
const contactButton = document.getElementById("contactButton");
const contactMenu = document.getElementById("contactMenu");
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

let theme = localStorage.getItem("theme") || "dark";

function applyTheme() {
  document.documentElement.dataset.theme = theme;

  if (theme === "dark") {
    themeIcon.textContent = "🌙";
    themeText.textContent = "Modo oscuro";
  } else {
    themeIcon.textContent = "☀️";
    themeText.textContent = "Modo claro";
  }

  localStorage.setItem("theme", theme);
}

themeButton.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme();
});

contactButton.addEventListener("click", () => {
  contactMenu.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".contact-wrap")) {
    contactMenu.classList.remove("open");
  }
});

applyTheme();

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const stars = Array.from({ length: 130 }, () => ({
  x: Math.random(),
  y: Math.random(),
  size: Math.random() * 1.6 + .4,
  speed: Math.random() * .00035 + .00008,
  opacity: Math.random() * .6 + .25,
  phase: Math.random() * Math.PI * 2
}));

const tarotSymbols = ["✦", "☾", "✧", "☉", "✶", "♆", "☿"];

const glyphs = Array.from({ length: 14 }, () => ({
  x: Math.random(),
  y: Math.random(),
  symbol: tarotSymbols[Math.floor(Math.random() * tarotSymbols.length)],
  size: Math.random() * 12 + 14,
  speed: Math.random() * .00012 + .00004,
  opacity: Math.random() * .12 + .05
}));

function drawStarfield(time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isDark = document.documentElement.dataset.theme === "dark";

  stars.forEach(star => {
    star.y += star.speed;
    if (star.y > 1) star.y = 0;

    const twinkle = .55 + Math.sin(time * .002 + star.phase) * .35;

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
      : `rgba(30, 64, 175, ${Math.min(1, star.opacity * twinkle * 2.2)})`;

    ctx.fill();
  });

  glyphs.forEach(glyph => {
    glyph.y -= glyph.speed;
    if (glyph.y < -.08) glyph.y = 1.08;

    ctx.font = `${glyph.size}px serif`;
    ctx.fillStyle = isDark
      ? `rgba(196, 181, 253, ${glyph.opacity})`
      : `rgba(30, 64, 175, ${Math.min(.45, glyph.opacity * 3)})`;

    ctx.fillText(
      glyph.symbol,
      glyph.x * canvas.width,
      glyph.y * canvas.height
    );
  });

  requestAnimationFrame(drawStarfield);
}

requestAnimationFrame(drawStarfield);
