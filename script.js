```javascript
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


    document
        .querySelectorAll(".mobile-menu a")
        .forEach(link => {

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


            const icon =
                document.getElementById(iconId);

            const copied =
                document.getElementById(copiedId);


            if (icon) {
                icon.style.display = "none";
            }


            if (copied) {
                copied.style.display = "inline";
            }


            setTimeout(() => {

                if (icon) {
                    icon.style.display = "inline";
                }

                if (copied) {
                    copied.style.display = "none";
                }

            }, 1500);


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


            if (
                greetingIndex >= greetings.length
            ) {

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


    setInterval(
        changeGreeting,
        2200
    );

}


// ===============================
// SCROLL REVEAL
// ===============================

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "visible"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12,

            rootMargin:
                "0px 0px -50px 0px"
        }

    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


// ===============================
// CURSOR GLOW
// ===============================

const cursorGlow = document.querySelector(".cursor-glow");

if (cursorGlow) {

    let mouseX = 0;
    let mouseY = 0;

    let glowX = 0;
    let glowY = 0;

    document.addEventListener("mousemove", function(event) {

        mouseX = event.clientX;
        mouseY = event.clientY;

    });

    function animateCursor() {

        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;

        cursorGlow.style.left = glowX + "px";
        cursorGlow.style.top = glowY + "px";

        requestAnimationFrame(animateCursor);

    }

    animateCursor();

}


// ===============================
// CURSOR INTERACTION
// ===============================

const interactiveElements =
    document.querySelectorAll(
        "a, button, .service-card, .project-card"
    );


interactiveElements.forEach(element => {

    element.addEventListener(
        "mouseenter",
        () => {

            document.body.classList.add(
                "cursor-active"
            );

        }
    );


    element.addEventListener(
        "mouseleave",
        () => {

            document.body.classList.remove(
                "cursor-active"
            );

        }
    );

});


// ===============================
// ACTIVE NAVIGATION
// ===============================

const sections =
    document.querySelectorAll(
        "main section[id]"
    );


const navLinks =
    document.querySelectorAll(
        ".navbar nav a"
    );


const sectionObserver =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    navLinks.forEach(link => {

                        link.classList.remove(
                            "active"
                        );


                        if (
                            link.getAttribute("href")
                            === `#${entry.target.id}`
                        ) {

                            link.classList.add(
                                "active"
                            );

                        }

                    });

                }

            });

        },

        {
            threshold: 0.45
        }

    );


sections.forEach(section => {

    sectionObserver.observe(
        section
    );

});
```
