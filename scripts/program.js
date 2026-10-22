const applicationForm = document.querySelector("#application-form");
const applicantName = document.querySelector("#applicant-name");
const accessWarning = document.querySelector("#access-warning");
const receiptLinks = document.querySelectorAll(".receipt-link");
const screens = document.querySelectorAll(".screen");
const byeMessage = document.querySelector("#bye-message");
const skeletonFace = document.querySelector("#skeleton-face");
const apologyDialog = document.querySelector("#apology-dialog");
const apologyButton = document.querySelector("#apology-button");
const birdNote = document.querySelector("#bird-note");
const giftButton = document.querySelector("#gift-button");
const appealReceiptPrompt = document.querySelector("#appeal-receipt-prompt");

function normalizeName(value) {
    return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function makeReceiptHref(firstName, lastName, age) {
    const subject = encodeURIComponent("Dating program receipt");
    const body = encodeURIComponent(
        "Hi Kekeletso,\n\nHere are my answers:\n" +
        `Name: ${firstName}\nLast name: ${lastName}\nAge: ${age}\n`
    );
    return `mailto:kekeletsobt@gmail.com?subject=${subject}&body=${body}`;
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
    const age = String(formData.get("age")).trim();
    const allowedFirstName = ["giovanni", "gio"].includes(normalizeName(firstName));

    if (!allowedFirstName || normalizeName(lastName) !== "frugone") {
        accessWarning.hidden = false;
        document.querySelector("#first-name").focus();
        return;
    }

    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    applicantName.textContent = fullName ? `, ${fullName}` : "";
    const receiptHref = makeReceiptHref(firstName, lastName, age);
    for (const receiptLink of receiptLinks) {
        receiptLink.href = receiptHref;
    }
    showScreen("elimination-screen");
    document.querySelector("#appeal-button").focus();
});

document.querySelector("#appeal-button").addEventListener("click", () => {
    showScreen("appeal-screen");
    document.querySelector("#forget-button").focus();
});

document.querySelector("#evacuation-button").addEventListener("click", () => {
    showFarewell(false);
});

document.querySelector("#forget-button").addEventListener("click", () => {
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

apologyDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
});

apologyButton.addEventListener("click", () => {
    birdNote.hidden = true;
    apologyDialog.showModal();
    window.setTimeout(() => {
        apologyDialog.close();
        birdNote.hidden = false;
        appealReceiptPrompt.hidden = false;
        giftButton.focus();
    }, 10000);
});