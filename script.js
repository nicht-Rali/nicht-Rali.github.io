// ===============================
// SETTINGS
// ===============================

const DISCORD_USERNAME = "nicht_rali";


// ===============================
// MOBILE MENU
// ===============================

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");
    });

    document.querySelectorAll(".mobile-menu a").forEach(link => {

        link.addEventListener("click", () => {
            mobileMenu.classList.remove("open");
        });

    });

}


// ===============================
// DISCORD COPY
// ===============================

function setupDiscordButton(buttonId, iconId, copiedId) {

    const button = document.getElementById(buttonId);

    if (!button) return;

    button.addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(
                DISCORD_USERNAME
            );

            const icon = document.getElementById(iconId);
            const copied = document.getElementById(copiedId);

            if (icon) icon.style.display = "none";
            if (copied) copied.style.display = "inline";

            setTimeout(() => {

                if (icon) icon.style.display = "inline";
                if (copied) copied.style.display = "none";

            }, 1000);

        } catch (error) {

            console.error(
                "Failed to copy Discord username:",
                error
            );

        }

    });

}


setupDiscordButton(
    "discordButton",
    "discordIcon",
    "discordCopied"
);

setupDiscordButton(
    "discordButton2",
    "discordIcon2",
    "discordCopied2"
);


// ===============================
// MULTI-LANGUAGE GREETING
// ===============================

const greetings = [
    "Hello",
    "Hallo",
    "Bonjour",
    "Hola",
    "Ciao",
    "Olá",
    "こんにちは",
    "안녕하세요",
    "你好",
    "Привет"
];

const greetingElement =
    document.getElementById("greeting");

if (greetingElement) {

    let greetingIndex = 0;

    function changeGreeting() {

        greetingElement.classList.add(
            "greeting-out"
        );

        setTimeout(() => {

            greetingIndex++;

            if (greetingIndex >= greetings.length) {
                greetingIndex = 0;
            }

            greetingElement.textContent =
                greetings[greetingIndex];

            greetingElement.classList.remove(
                "greeting-out"
            );

            greetingElement.classList.add(
                "greeting-in"
            );

            setTimeout(() => {

                greetingElement.classList.remove(
                    "greeting-in"
                );

            }, 500);

        }, 350);
    }

    setInterval(changeGreeting, 2200);
}
