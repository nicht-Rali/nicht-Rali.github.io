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
