const applicationForm = document.querySelector("#application-form");
const applicantName = document.querySelector("#applicant-name");
const accessWarning = document.querySelector("#access-warning");
const screens = document.querySelectorAll(".screen");
const byeMessage = document.querySelector("#bye-message");
const skeletonFace = document.querySelector("#skeleton-face");
const apologyDialog = document.querySelector("#apology-dialog");
const apologyButton = document.querySelector("#apology-button");
const birdNote = document.querySelector("#bird-note");
const giftButton = document.querySelector("#gift-button");
const farewellStamp = document.querySelector("#farewell-stamp");
let apologyTimeout;
let reviewTimeout;
let birdLandingTimeout;

function normalizeName(value) {
    return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

for (const field of applicationForm.querySelectorAll("input")) {
    field.addEventListener("input", () => {
        accessWarning.hidden = true;
    });
}

function showScreen(screenId) {
    for (const screen of screens) {
        const isActive = screen.id === screenId;
        screen.hidden = !isActive;
        screen.classList.toggle("active", isActive);
    }
}

applicationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!applicationForm.reportValidity()) {
        return;
    }

    const formData = new FormData(applicationForm);
    const firstName = String(formData.get("firstName")).trim();
    const lastName = String(formData.get("lastName")).trim();
    const allowedFirstName = ["giovanni", "gio"].includes(normalizeName(firstName));

    if (!allowedFirstName || normalizeName(lastName) !== "frugone") {
        accessWarning.hidden = false;
        document.querySelector("#first-name").focus();
        return;
    }

    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    applicantName.textContent = fullName ? `, ${fullName}` : "";
    showScreen("committee-screen");
    const reviewDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 2000;
    reviewTimeout = window.setTimeout(() => {
        showScreen("elimination-screen");
        document.querySelector("#appeal-button").focus();
    }, reviewDuration);
});

document.querySelector("#appeal-button").addEventListener("click", () => {
    showScreen("appeal-screen");
    document.querySelector("#forget-button").focus();
});

document.querySelector("#evacuation-button").addEventListener("click", () => {
    farewellStamp.textContent = "EVACUATION ACCEPTED";
    showFarewell(false);
});

document.querySelector("#forget-button").addEventListener("click", () => {
    farewellStamp.textContent = "CASE CLOSED";
    showFarewell(true);
});

function showFarewell(skipBye) {
    showScreen("farewell-screen");
    byeMessage.hidden = skipBye;
    skeletonFace.hidden = !skipBye;

    if (!skipBye) {
        const farewellDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 50 : 1450;
        window.setTimeout(() => {
            byeMessage.hidden = true;
            skeletonFace.hidden = false;
            document.querySelector("#farewell-title").focus();
        }, farewellDelay);
    }
}

apologyDialog.addEventListener("close", () => {
    window.clearTimeout(apologyTimeout);
    birdNote.hidden = false;
    birdNote.classList.remove("landed");
    window.clearTimeout(birdLandingTimeout);
    const landingDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 3500;
    birdLandingTimeout = window.setTimeout(() => {
        birdNote.classList.add("landed");
    }, landingDelay);
    giftButton.focus();
});

apologyDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
});

apologyButton.addEventListener("click", () => {
    birdNote.hidden = true;
    apologyDialog.showModal();
    apologyTimeout = window.setTimeout(() => apologyDialog.close(), 5000);
});