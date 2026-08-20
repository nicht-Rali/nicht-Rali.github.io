// ===============================
// CHANGE THIS TO YOUR DISCORD
// ===============================

const DISCORD_USERNAME = "yourusername";


// ===============================
// MOBILE MENU
// ===============================

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

menuButton.addEventListener("click", () => {

    mobileMenu.classList.toggle("open");

});


// Close mobile menu after clicking a link

document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("open");

    });

});


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

            document.getElementById(iconId).style.display =
                "none";

            document.getElementById(copiedId).style.display =
                "inline";

            setTimeout(() => {

                document.getElementById(iconId).style.display =
                    "inline";

                document.getElementById(copiedId).style.display =
                    "none";

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

const greetings = [
    "Hallo",
    "Hello",
    "Bonjour",
    "Hola",
    "Ciao",
    "Olá",
    "こんにちは",
    "안녕하세요",
    "你好",
    "Привет",
]

const greetingElement = document.getElementById("greeting")

let greetingIndex = 0

function changeGreeting() {

    greetingElement.classList.add("greeting-out")

    setTimeout(() => {

        greetingIndex++

        if (greetingIndex >= greetings.length) {
            greetingIndex = 0
        }

        greetingElement.textContent =
            greetings[greetingIndex]

        greetingElement.classList.remove("greeting-out")

        greetingElement.classList.add("greeting-in")

        setTimeout(() => {
            greetingElement.classList.remove("greeting-in")
        }, 500)

    }, 350)
}

setInterval(changeGreeting, 2200)
