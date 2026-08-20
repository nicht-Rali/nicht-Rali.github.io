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
