const currentYearSpan = document.getElementById("year");
    if(currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
        
    }
    
    const lastModifiedSpan = document.getElementById("lastModified");
    if(lastModifiedSpan) {
        lastModifiedSpan.textContent = `${document.lastModified}`;
    }

let selectedColorName = "";
let selectedPhoneModel = "";
let noButtonDodgeCount = 0;
const phoneCatalog = {
    iphone17pro: { label: "iPhone 17 Pro", searchTerm: "Apple iPhone 17 Pro" },
    iphone18pro: { label: "iPhone 18 Pro", searchTerm: "Apple iPhone 18 Pro" }
};

function renderPhoneIllustrations() {
    const colors = { silver: "#c9cbd0", blue: "#426b95", burgundy: "#74263e" };
    const color = colors[selectedColorName] || colors.silver;
    document.getElementById("phone-art-17").replaceChildren(createPhoneIllustration("iphone17pro", color));
    document.getElementById("phone-art-18").replaceChildren(createPhoneIllustration("iphone18pro", color));
}

function createPhoneIllustration(model, color) {
    const svgNamespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNamespace, "svg");
    svg.setAttribute("viewBox", "0 0 160 190");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", `${phoneCatalog[model].label} preview in ${selectedColorName || "silver"}`);

    const phone = document.createElementNS(svgNamespace, "rect");
    phone.setAttribute("x", "30");
    phone.setAttribute("y", "5");
    phone.setAttribute("width", "100");
    phone.setAttribute("height", "180");
    phone.setAttribute("rx", "20");
    phone.setAttribute("fill", color);
    phone.setAttribute("stroke", "#25272a");
    phone.setAttribute("stroke-width", "3");
    svg.appendChild(phone);

    const cameraPlate = document.createElementNS(svgNamespace, "rect");
    cameraPlate.setAttribute("x", model === "iphone17pro" ? "39" : "43");
    cameraPlate.setAttribute("y", "15");
    cameraPlate.setAttribute("width", model === "iphone17pro" ? "66" : "58");
    cameraPlate.setAttribute("height", "67");
    cameraPlate.setAttribute("rx", "14");
    cameraPlate.setAttribute("fill", "#292b30");
    svg.appendChild(cameraPlate);

    [[54, 32], [84, 32], [54, 61]].forEach(([x, y]) => {
        const lens = document.createElementNS(svgNamespace, "circle");
        lens.setAttribute("cx", String(x));
        lens.setAttribute("cy", String(y));
        lens.setAttribute("r", "10");
        lens.setAttribute("fill", "#13161a");
        lens.setAttribute("stroke", "#98a3ae");
        lens.setAttribute("stroke-width", "2");
        svg.appendChild(lens);
    });
    return svg;
}

renderPhoneIllustrations();

function goToScreen(num) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(`screen-${num}`)?.classList.add('active');
    if(num === 4) {
        launchConfetti();
    }
}

function pickColor(name) {
    const palettes = {
        silver: { bg1: '#cfd9df', bg2: '#e2ebf0', accent: '#778899' },
        blue: { bg1: '#89f7fe', bg2: '#66a6ff', accent: '#3478c7' },
        burgundy: { bg1: '#6d263b', bg2: '#c06c84', accent: '#8f2945' }
    };
    const palette = palettes[name];
    if (!palette) return;

    selectedColorName = name;
    document.documentElement.style.setProperty('--bg-1', palette.bg1);
    document.documentElement.style.setProperty('--bg-2', palette.bg2);
    document.documentElement.style.setProperty('--accent', palette.accent);

    const prettyNames = {
        silver: "Silver",
        blue: "Blue",
        burgundy: "Burgundy"
    };
    document.getElementById('color-compliment').innerText = `${prettyNames[name]} is an amazing choice!`;
    document.getElementById('chosen-color-text').innerText = prettyNames[name];
    document.getElementById('phone-color-name').innerText = prettyNames[name];
    renderPhoneIllustrations();

    goToScreen(3);
}

function choosePhone(model) {
    const phone = phoneCatalog[model];
    if (!phone || !selectedColorName) return;

    selectedPhoneModel = model;
    Object.keys(phoneCatalog).forEach(phoneKey => {
        const option = document.getElementById(`phone-option-${phoneKey === "iphone17pro" ? "17" : "18"}`);
        const isSelected = phoneKey === model;
        option.classList.toggle("selected", isSelected);
        option.setAttribute("aria-pressed", String(isSelected));
    });

    const productUrl = new URL("https://www.takealot.com/all");
    productUrl.searchParams.set("query", phone.searchTerm);
    const buyLink = document.getElementById("takealot-buy-link");
    buyLink.href = productUrl.toString();
    buyLink.hidden = false;
    document.getElementById("phone-selection-summary").textContent =
        `Selected ${phone.label} in ${selectedColorName}. Takealot will show today's price and available finishes.`;
    document.getElementById("notify-button").disabled = false;
}

function runAway() {
    if (noButtonDodgeCount >= 10) return;
    noButtonDodgeCount++;

    const btn = document.getElementById('btn-no');
    const maxX = Math.max(0, window.innerWidth - btn.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - btn.offsetHeight);
    const randomX = Math.floor(Math.random()*maxX);
    const randomY = Math.floor(Math.random()*maxY);

    btn.style.position = 'fixed';
    btn.style.left = `${randomX}px`;
    btn.style.top = `${randomY}px`;
    btn.innerText = noButtonDodgeCount === 10 ? "You caught me! No thanks" : "Oops... wrong button! 🙈";

    setTimeout(() => { btn.innerText = "No thanks"; }, 800);
}

function runAwayOnTouch(event) {
    if (noButtonDodgeCount >= 10) return;
    event.preventDefault();
    runAway();
}

function launchConfetti() {
    const colors = ['#f02d2d', '#d9f524', '#08b311', '#dc19c2', '#7eb1ef', '#5f27cd'];

    for (let index = 0; index < 100; index++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
        confetti.style.left = Math.random()* 100 + 'vw';
        confetti.style.animation = `fall ${Math.random() * 2 + 2}s linear forwards`;
        confetti.style.animationDelay = Math.random()* 1.5 + 's';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }
}

function openThankYouNote() {
    goToScreen(5);
    launchHeartEmojis();
}

function notifyProgrammer() {
    const phone = phoneCatalog[selectedPhoneModel];
    if (!phone) return;

    const subject = encodeURIComponent("Phone gift selection 💌");
    const body = encodeURIComponent(
        "Hi Keke!\n\nHere is my phone selection:\n" +
        `Model: ${phone.label}\nColor choice: ${selectedColorName}\n\n` +
        "I will check the live listing and complete any billing and payment securely on Takealot. " +
        "This message records my selection and is not an order or payment receipt."
    );
    window.location.href = `mailto:kekeletsobt@gmail.com?subject=${subject}&body=${body}`;
}

function launchHeartEmojis() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const heartShower = document.getElementById('heart-shower');
    heartShower.replaceChildren();
    const heartEmojis = ['💖', '💗', '💕', '💛', '💘'];
    for (let index = 0; index < 24; index++) {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.setAttribute('aria-hidden', 'true');
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = `${Math.random() * 94 + 3}%`;
        heart.style.fontSize = `${Math.random() * 1.5 + 1.5}rem`;
        heart.style.animationDuration = `${Math.random() * 2 + 3}s`;
        heart.style.animationDelay = `${Math.random()}s`;
        heartShower.appendChild(heart);
        setTimeout(() => heart.remove(), 6500);
    }
}

function declineGift() {
    goToScreen(6);
}

function resetApp() {
    document.documentElement.style.setProperty('--bg-1', '#ff9a9e');
    document.documentElement.style.setProperty('--bg-2', '#fecfef');
    document.documentElement.style.setProperty('--accent', '#ff6b6b');
    selectedColorName = "";
    selectedPhoneModel = "";
    noButtonDodgeCount = 0;

    document.querySelectorAll(".phone-option").forEach(option => {
        option.classList.remove("selected");
        option.setAttribute("aria-pressed", "false");
    });
    document.getElementById("takealot-buy-link").hidden = true;
    document.getElementById("takealot-buy-link").href = "https://www.takealot.com/";
    document.getElementById("notify-button").disabled = true;
    document.getElementById("phone-selection-summary").textContent =
        "Choose a model to prepare your Takealot link and selection email.";
    document.getElementById("phone-color-name").textContent = "not selected";
    renderPhoneIllustrations();

    const btn = document.getElementById('btn-no');
    btn.style.position = 'relative';
    btn.style.left = 'auto';
    btn.style.top = 'auto';
    btn.innerText = "No thanks";

    goToScreen(1);
}