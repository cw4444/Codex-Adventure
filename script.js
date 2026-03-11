const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

const modeInput = document.getElementById("mode");
const themeInput = document.getElementById("theme");
const spawnRateInput = document.getElementById("spawnRate");
const driftInput = document.getElementById("drift");
const trailInput = document.getElementById("trail");
const spawnRateValue = document.getElementById("spawnRateValue");
const driftValue = document.getElementById("driftValue");
const trailValue = document.getElementById("trailValue");
const resetButton = document.getElementById("reset");

const THEMES = {
  neon: ["#7dd3fc", "#a78bfa", "#f9a8d4", "#67e8f9", "#fde68a"],
  sunset: ["#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff"],
  cyber: ["#00f5d4", "#00bbf9", "#9b5de5", "#f15bb5", "#fee440"],
  mono: ["#f8fafc", "#cbd5e1", "#94a3b8", "#64748b", "#334155"]
};

Object.keys(THEMES).forEach((name) => {
  const opt = document.createElement("option");
  opt.value = name;
  opt.textContent = name;
  if (name === "neon") opt.selected = true;
  themeInput.appendChild(opt);
});

const particles = [];
const pointer = { x: canvas.width / 2, y: canvas.height / 2, down: false };
let gravityOn = false;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function currentPalette() {
  return THEMES[themeInput.value] || THEMES.neon;
}

function modeSettings() {
  switch (modeInput.value) {
    case "calm":
      return { speed: 1.3, jitter: 0.02, gravity: 0.03, lifeMin: 70, lifeMax: 180 };
    case "storm":
      return { speed: 3.1, jitter: 0.08, gravity: 0.11, lifeMin: 30, lifeMax: 100 };
    case "galaxy":
    default:
      return { speed: 2.2, jitter: 0.05, gravity: 0.08, lifeMin: 45, lifeMax: 130 };
  }
}

function spawnBurst(x, y, count) {
  const { speed, lifeMin, lifeMax } = modeSettings();
  const palette = currentPalette();

  for (let i = 0; i < count; i++) {
    const angle = random(0, Math.PI * 2);
    const magnitude = random(0.2, speed);
    const maxLife = random(lifeMin, lifeMax);

    particles.push({
      x,
      y,
      vx: Math.cos(angle) * magnitude,
      vy: Math.sin(angle) * magnitude,
      life: maxLife,
      maxLife,
      size: random(1.5, 5.2),
      hue: palette[Math.floor(Math.random() * palette.length)]
    });
  }
}

function update() {
  const drift = Number(driftInput.value) / 100;
  const { jitter, gravity } = modeSettings();

  if (pointer.down) {
    spawnBurst(pointer.x, pointer.y, Number(spawnRateInput.value));
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    if (gravityOn) p.vy += gravity;
    p.vx += random(-jitter, jitter) * drift;
    p.vy += random(-jitter, jitter) * drift;

    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -0.9;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -0.9;

    if (p.life <= 0) particles.splice(i, 1);
  }
}

function drawBackground() {
  const trail = Number(trailInput.value) / 100;
  ctx.fillStyle = `rgba(3, 5, 14, ${trail})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawParticles() {
  ctx.globalCompositeOperation = "lighter";
  for (const p of particles) {
    const alpha = Math.max(p.life / p.maxLife, 0);
    const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, "0");
    ctx.beginPath();
    ctx.fillStyle = `${p.hue}${alphaHex}`;
    ctx.shadowBlur = 25;
    ctx.shadowColor = p.hue;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = "source-over";
}

function frame() {
  drawBackground();
  update();
  drawParticles();
  requestAnimationFrame(frame);
}

function setPointerFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  pointer.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
}

canvas.addEventListener("pointerdown", (event) => {
  pointer.down = true;
  canvas.setPointerCapture(event.pointerId);
  setPointerFromEvent(event);
  spawnBurst(pointer.x, pointer.y, Number(spawnRateInput.value) * 2);
});

canvas.addEventListener("pointermove", setPointerFromEvent);

canvas.addEventListener("pointerup", () => {
  pointer.down = false;
});

canvas.addEventListener("pointercancel", () => {
  pointer.down = false;
});

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    gravityOn = !gravityOn;
    event.preventDefault();
  }
});

function syncLabels() {
  spawnRateValue.textContent = spawnRateInput.value;
  driftValue.textContent = driftInput.value;
  trailValue.textContent = trailInput.value;
}

spawnRateInput.addEventListener("input", syncLabels);
driftInput.addEventListener("input", syncLabels);
trailInput.addEventListener("input", syncLabels);

modeInput.addEventListener("change", () => {
  const presets = {
    calm: { spawn: 8, drift: 25, trail: 22 },
    storm: { spawn: 24, drift: 55, trail: 10 },
    galaxy: { spawn: 14, drift: 35, trail: 18 }
  };
  const preset = presets[modeInput.value];
  spawnRateInput.value = preset.spawn;
  driftInput.value = preset.drift;
  trailInput.value = preset.trail;
  syncLabels();
});

resetButton.addEventListener("click", () => {
  particles.length = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

syncLabels();
spawnBurst(canvas.width / 2, canvas.height / 2, 220);
frame();
