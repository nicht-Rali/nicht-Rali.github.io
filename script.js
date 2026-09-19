/* =========================================================
   RALI PORTFOLIO
   ========================================================= */

/* ---------- MOBILE MENU ---------- */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (menuButton && mobileMenu) {
    const setMenu = (open) => {
        mobileMenu.classList.toggle("open", open);
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    menuButton.addEventListener("click", () => {
        setMenu(!mobileMenu.classList.contains("open"));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) setMenu(false);
    });
}


/* ---------- GREETING (home only) ---------- */

const greeting = document.getElementById("greeting");

if (greeting && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const greetings = ["Hello", "Hallo", "Hola", "Bonjour", "Ciao", "Hej"];
    let index = 0;

    setInterval(() => {
        greeting.classList.add("swap-out");

        setTimeout(() => {
            index = (index + 1) % greetings.length;
            greeting.textContent = greetings[index];
            greeting.classList.remove("swap-out");
        }, 300);
    }, 2800);
}


/* ---------- COPY BUTTONS (Discord) ---------- */

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        // fallback for older browsers / file:// pages
        const area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();

        let ok = false;
        try {
            ok = document.execCommand("copy");
        } catch (err) {
            ok = false;
        }

        area.remove();
        return ok;
    }
}

document.querySelectorAll(".copy-button").forEach((button) => {
    const hint = button.querySelector(".copy-hint");

    button.addEventListener("click", async () => {
        const ok = await copyText(button.dataset.copy);

        button.classList.toggle("copied", ok);
        hint.textContent = ok ? "Copied" : "Copy failed";

        setTimeout(() => {
            button.classList.remove("copied");
            hint.textContent = "Copy";
        }, 1800);
    });
});


/* =========================================================
   PLANNER
   Change prices and days here. Everything else follows.
   price = Robux that gets added, days = build time that gets added
   ========================================================= */

const PLANNER = {

    type: {
        title: "Type",
        input: "radio",
        default: "gameplay",
        options: [
            { id: "mechanic",    name: "Single mechanic",   desc: "One feature, e.g. a dash or a pickup",         price: 400,  days: 1 },
            { id: "gameplay",    name: "Gameplay system",   desc: "Several mechanics working together",           price: 1200, days: 3 },
            { id: "progression", name: "Progression",      desc: "Levels, stats, saving data",                   price: 1800, days: 4 },
            { id: "inventory",   name: "Inventory / shop", desc: "Items, equipping, purchases",                  price: 2000, days: 5 },
            { id: "rounds",      name: "Round system",      desc: "Lobby, matches, teams, rewards",               price: 2500, days: 5 },
            { id: "other",       name: "Something else",    desc: "Tell me about it on Discord",                  price: 1000, days: 3 }
        ]
    },

    complexity: {
        title: "Complexity",
        input: "radio",
        default: "medium",
        options: [
            { id: "low",     name: "Low",       desc: "Straightforward, few edge cases", price: 0,    days: 0 },
            { id: "medium",  name: "Medium",    desc: "A few moving parts",              price: 800,  days: 2 },
            { id: "high",    name: "High",      desc: "Lots of interacting parts",       price: 2000, days: 5 },
            { id: "extreme", name: "Very high", desc: "Large and technically difficult", price: 4500, days: 10 }
        ]
    },

    scope: {
        title: "Scope",
        input: "radio",
        default: "oneoff",
        options: [
            { id: "oneoff",   name: "One-off",   desc: "Built once and handed over",           price: 0,    days: 0 },
            { id: "longterm", name: "Long-term", desc: "Ongoing updates and changes over time", price: 1500, days: 0 }
        ]
    },

    deadline: {
        title: "Deadline",
        input: "radio",
        default: "flexible",
        options: [
            { id: "flexible", name: "Flexible",       desc: "No rush",             price: 0,    days: 0, maxDays: null },
            { id: "twoweeks", name: "Within 2 weeks", desc: "",                    price: 500,  days: 0, maxDays: 14 },
            { id: "week",     name: "Within 1 week",  desc: "",                    price: 1200, days: 0, maxDays: 7 },
            { id: "asap",     name: "As soon as possible", desc: "3 days or less", price: 2500, days: 0, maxDays: 3 }
        ]
    },

    extras: {
        title: "Extras",
        input: "checkbox",
        default: [],
        options: [
            { id: "vfx", name: "Add VFX", desc: "Particles, beams and meshes for the system", price: 600, days: 1 }
        ]
    }
};

const RANGE = 0.1;   // estimate is shown as price ±10%
const ROUND_TO = 50; // rounded to the nearest 50 Robux

const plannerForm = document.getElementById("plannerForm");

if (plannerForm) {

    const fmt = (n) => n.toLocaleString("en-US");
    const roundTo = (n, step) => Math.round(n / step) * step;

    /* build the option buttons */
    Object.entries(PLANNER).forEach(([groupKey, group]) => {
        const container = plannerForm.querySelector(`[data-group="${groupKey}"]`);
        if (!container) return;

        group.options.forEach((opt) => {
            const id = `${groupKey}-${opt.id}`;
            const isChecked = group.input === "radio"
                ? group.default === opt.id
                : group.default.includes(opt.id);

            const priceText = opt.price === 0 ? "Included" : `+${fmt(opt.price)} R$`;

            const wrapper = document.createElement("div");
            wrapper.className = "option";
            wrapper.innerHTML = `
                <input type="${group.input}" id="${id}" name="${groupKey}" value="${opt.id}" ${isChecked ? "checked" : ""}>
                <label for="${id}">
                    <span class="option-name">${opt.name}</span>
                    ${opt.desc ? `<span class="option-desc">${opt.desc}</span>` : ""}
                    <span class="option-price">${priceText}</span>
                </label>
            `;
            container.appendChild(wrapper);
        });
    });

    const elPrice = document.getElementById("resultPrice");
    const elRange = document.getElementById("resultRange");
    const elTime = document.getElementById("resultTime");
    const elWarn = document.getElementById("resultWarning");
    const elBreakdown = document.getElementById("breakdown");
    const copyButton = document.getElementById("copySummary");

    let summaryText = "";

    function getSelection() {
        const chosen = [];

        Object.entries(PLANNER).forEach(([groupKey, group]) => {
            const checked = plannerForm.querySelectorAll(`input[name="${groupKey}"]:checked`);

            checked.forEach((input) => {
                const opt = group.options.find((o) => o.id === input.value);
                if (opt) chosen.push({ group: groupKey, groupTitle: group.title, ...opt });
            });
        });

        return chosen;
    }

    function timeText(days) {
        if (days <= 1) return "about 1 day";
        if (days < 10) return `about ${days} days`;

        const weeks = Math.round(days / 7);
        return `about ${days} days (around ${weeks} ${weeks === 1 ? "week" : "weeks"})`;
    }

    function update() {
        const chosen = getSelection();

        const total = chosen.reduce((sum, o) => sum + o.price, 0);
        const days = chosen.reduce((sum, o) => sum + o.days, 0);

        const low = roundTo(total * (1 - RANGE), ROUND_TO);
        const high = roundTo(total * (1 + RANGE), ROUND_TO);

        elPrice.textContent = `${fmt(roundTo(total, ROUND_TO))} R$`;
        elRange.textContent = `Roughly ${fmt(low)} to ${fmt(high)} R$`;
        elTime.textContent = timeText(days);

        /* warn if the deadline is tighter than the estimated time */
        const deadline = chosen.find((o) => o.group === "deadline");
        if (deadline && deadline.maxDays && days > deadline.maxDays) {
            elWarn.hidden = false;
            elWarn.textContent =
                "This may not fit the deadline you picked. Choose a later deadline or a simpler scope, or talk to me about it.";
        } else {
            elWarn.hidden = true;
        }

        /* breakdown, only lines that cost something */
        elBreakdown.innerHTML = "";
        chosen.forEach((o) => {
            const li = document.createElement("li");
            const label = document.createElement("span");
            const value = document.createElement("span");

            label.textContent = `${o.groupTitle}: ${o.name}`;
            value.textContent = o.price === 0 ? "-" : `+${fmt(o.price)} R$`;

            li.append(label, value);
            elBreakdown.appendChild(li);
        });

        /* text that gets copied */
        const lines = chosen.map((o) => `- ${o.groupTitle}: ${o.name}`);
        summaryText =
            "Project estimate from your planner\n" +
            lines.join("\n") + "\n" +
            `Estimated price: ~${fmt(roundTo(total, ROUND_TO))} R$ (${fmt(low)} to ${fmt(high)} R$)\n` +
            `Estimated time: ${timeText(days)}`;
    }

    plannerForm.addEventListener("change", update);
    plannerForm.addEventListener("submit", (e) => e.preventDefault());

    copyButton.addEventListener("click", async () => {
        const ok = await copyText(summaryText);
        const original = "Copy summary for Discord";

        copyButton.textContent = ok ? "Copied" : "Copy failed";
        setTimeout(() => { copyButton.textContent = original; }, 1800);
    });

    update();
}


/* =========================================================
   VFX PLAYGROUND
   A small canvas particle preview + the matching Luau code.
   Presets live in PG_PRESETS, change or add your own there.
   ========================================================= */

const PG_PRESETS = {
    magic:  { rate: 40, lifetime: 1.8, speed: 12, size: 1.2, spread: 60,  accel: 4,   color1: "#c4b5fd", color2: "#6a3fe0", glow: true  },
    fire:   { rate: 60, lifetime: 1.2, speed: 8,  size: 1.8, spread: 30,  accel: 6,   color1: "#ffb347", color2: "#ff2d55", glow: true  },
    sparks: { rate: 80, lifetime: 0.7, speed: 26, size: 0.3, spread: 120, accel: -22, color1: "#fff3b0", color2: "#ffb347", glow: true  },
    smoke:  { rate: 20, lifetime: 3.2, speed: 4,  size: 2.6, spread: 25,  accel: 3,   color1: "#8c8c99", color2: "#3a3a44", glow: false }
};

(function initPlayground() {
    const canvas = document.getElementById("pgCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const codeEl = document.getElementById("pgCode");
    const copyBtn = document.getElementById("pgCopy");
    const inputs = document.querySelectorAll("[data-pg]");
    const presetButtons = document.querySelectorAll("[data-preset]");

    const SPEED_PX = 7;   // pixels per stud per second
    const SIZE_PX = 14;   // pixels per stud of size
    const MAX_PARTICLES = 700;

    const state = { ...PG_PRESETS.magic };
    let particles = [];
    let emitAcc = 0;
    let width = 0;
    let height = 0;
    let originX = 0;
    let targetX = 0;
    let visible = true;
    let lastTime = performance.now();

    /* ---------- helpers ---------- */

    const hexToRgb = (hex) => {
        const n = parseInt(hex.slice(1), 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    /* ---------- read/write controls ---------- */

    function formatValue(key, value) {
        if (key === "spread") return `${value}°`;
        if (key === "lifetime") return `${Number(value).toFixed(1)} s`;
        if (key === "size") return Number(value).toFixed(1);
        return String(value);
    }

    function writeControls() {
        inputs.forEach((input) => {
            const key = input.dataset.pg;

            if (input.type === "checkbox") {
                input.checked = state[key];
            } else {
                input.value = state[key];
            }

            const out = input.closest(".pg-row")?.querySelector("output");
            if (out) out.textContent = formatValue(key, state[key]);
        });
    }

    function setActivePreset(name) {
        presetButtons.forEach((btn) => {
            btn.setAttribute("aria-pressed", String(btn.dataset.preset === name));
        });
    }

    /* ---------- code output ---------- */

    function num(n) {
        return String(Number(Number(n).toFixed(2)));
    }

    function buildCode() {
        const [r1, g1, b1] = hexToRgb(state.color1);
        const [r2, g2, b2] = hexToRgb(state.color2);

        return [
            'local emitter = Instance.new("ParticleEmitter")',
            `emitter.Rate = ${num(state.rate)}`,
            `emitter.Lifetime = NumberRange.new(${num(state.lifetime)})`,
            `emitter.Speed = NumberRange.new(${num(state.speed)})`,
            `emitter.SpreadAngle = Vector2.new(${num(state.spread / 2)}, ${num(state.spread / 2)})`,
            `emitter.Acceleration = Vector3.new(0, ${num(state.accel)}, 0)`,
            `emitter.Size = NumberSequence.new(${num(state.size)}, 0)`,
            `emitter.Color = ColorSequence.new(Color3.fromRGB(${r1}, ${g1}, ${b1}), Color3.fromRGB(${r2}, ${g2}, ${b2}))`,
            "emitter.Transparency = NumberSequence.new(0, 1)",
            `emitter.LightEmission = ${state.glow ? 1 : 0}`,
            "emitter.Parent = script.Parent"
        ].join("\n");
    }

    function refresh() {
        codeEl.textContent = buildCode();
        writeControls();
    }

    /* ---------- events ---------- */

    inputs.forEach((input) => {
        input.addEventListener("input", () => {
            const key = input.dataset.pg;

            if (input.type === "checkbox") {
                state[key] = input.checked;
            } else if (input.type === "range") {
                state[key] = Number(input.value);
            } else {
                state[key] = input.value;
            }

            setActivePreset(null);
            refresh();
        });
    });

    presetButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            Object.assign(state, PG_PRESETS[btn.dataset.preset]);
            particles = [];
            setActivePreset(btn.dataset.preset);
            refresh();
        });
    });

    copyBtn.addEventListener("click", async () => {
        const ok = await copyText(codeEl.textContent);
        copyBtn.textContent = ok ? "Copied" : "Copy failed";
        setTimeout(() => { copyBtn.textContent = "Copy code"; }, 1800);
    });

    canvas.addEventListener("pointermove", (e) => {
        const rect = canvas.getBoundingClientRect();
        targetX = Math.min(Math.max(e.clientX - rect.left, 40), rect.width - 40);
    });

    /* ---------- canvas sizing ---------- */

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();

        width = rect.width;
        height = rect.height;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (!originX) originX = width / 2;
        targetX = targetX || width / 2;
    }

    new ResizeObserver(resize).observe(canvas);

    new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        lastTime = performance.now();
    }).observe(canvas);

    /* ---------- simulation ---------- */

    function spawn() {
        const emitterY = height * 0.78;
        const half = (state.spread / 2) * (Math.PI / 180);
        const angle = -Math.PI / 2 + (Math.random() * 2 - 1) * half;
        const speed = state.speed * SPEED_PX;

        particles.push({
            x: originX + (Math.random() - 0.5) * 30,
            y: emitterY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            age: 0
        });
    }

    function step(dt) {
        originX += (targetX - originX) * Math.min(1, dt * 8);

        emitAcc += state.rate * dt;
        while (emitAcc >= 1) {
            if (particles.length < MAX_PARTICLES) spawn();
            emitAcc -= 1;
        }

        const ay = -state.accel * SPEED_PX;

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.age += dt;

            if (p.age >= state.lifetime) {
                particles.splice(i, 1);
                continue;
            }

            p.vy += ay * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
        }
    }

    function draw() {
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, width, height);

        /* the part the emitter sits on */
        const baseY = height * 0.78;
        ctx.fillStyle = "#1e1631";
        ctx.strokeStyle = "#2e2347";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(originX - 26, baseY + 2, 52, 9, 3);
        ctx.fill();
        ctx.stroke();

        ctx.globalCompositeOperation = state.glow ? "lighter" : "source-over";

        const c1 = hexToRgb(state.color1);
        const c2 = hexToRgb(state.color2);

        for (const p of particles) {
            const t = p.age / state.lifetime;
            const radius = (state.size * SIZE_PX * (1 - t)) / 2;
            if (radius < 0.3) continue;

            const r = Math.round(lerp(c1[0], c2[0], t));
            const g = Math.round(lerp(c1[1], c2[1], t));
            const b = Math.round(lerp(c1[2], c2[2], t));
            const alpha = 1 - t;

            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
            grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
            grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function frame(now) {
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        if (visible && width) {
            step(dt);
            draw();
        }

        requestAnimationFrame(frame);
    }

    resize();
    refresh();
    requestAnimationFrame(frame);
})();
