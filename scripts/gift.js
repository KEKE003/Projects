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
let bottleHideTimeout;
let romanticAudioContext;
let romanticMusicTimer;
let romanticMusicStep = 0;
const phoneCatalog = {
    iphone17pro: {
        label: "iPhone 17 Pro",
        productUrl: "https://www.istore.co.za/shop-iphone-17-pro",
        optionId: "17-pro",
        artId: "17-pro"
    },
    iphone17promax: {
        label: "iPhone 17 Pro Max",
        productUrl: "https://www.istore.co.za/shop-iphone-17-pro-max",
        optionId: "17-pro-max",
        artId: "17-pro-max"
    }
};

function renderPhoneIllustrations() {
    const colors = { silver: "#c9cbd0", blue: "#426b95" };
    const color = colors[selectedColorName] || colors.silver;
    Object.entries(phoneCatalog).forEach(([model, phone]) => {
        document.getElementById(`phone-art-${phone.artId}`)
            .replaceChildren(createPhoneIllustration(model, color));
    });
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
        blue: { bg1: '#89f7fe', bg2: '#66a6ff', accent: '#3478c7' }
    };
    const palette = palettes[name];
    if (!palette) return;

    selectedColorName = name;
    document.documentElement.style.setProperty('--bg-1', palette.bg1);
    document.documentElement.style.setProperty('--bg-2', palette.bg2);
    document.documentElement.style.setProperty('--accent', palette.accent);

    const prettyNames = {
        silver: "Silver",
        blue: "Blue"
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
        const option = document.getElementById(`phone-option-${phoneCatalog[phoneKey].optionId}`);
        const isSelected = phoneKey === model;
        option.classList.toggle("selected", isSelected);
        option.setAttribute("aria-pressed", String(isSelected));
    });

    const buyLink = document.getElementById("istore-buy-link");
    buyLink.href = phone.productUrl;
    buyLink.hidden = false;
    document.getElementById("phone-selection-summary").textContent =
        `Selected ${phone.label} in ${selectedColorName}. iStore will show today's price and available finishes.`;
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

function playRomanticMusic() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        console.error("Web Audio is not supported in this browser.");
        return;
    }

    romanticAudioContext ??= new AudioContextClass();
    const context = romanticAudioContext;
    context.resume().then(() => {
        if (romanticMusicTimer) return;

        const notes = [
            261.63, 329.63, 392, 493.88,
            220, 261.63, 329.63, 392,
            174.61, 220, 261.63, 329.63,
            196, 246.94, 293.66, 329.63
        ];
        const playNote = () => {
            const oscillator = context.createOscillator();
            const volume = context.createGain();
            const start = context.currentTime;
            oscillator.type = "sine";
            oscillator.frequency.value = notes[romanticMusicStep % notes.length];
            volume.gain.setValueAtTime(0, start);
            volume.gain.linearRampToValueAtTime(0.055, start + 0.16);
            volume.gain.exponentialRampToValueAtTime(0.001, start + 1.7);
            oscillator.connect(volume);
            volume.connect(context.destination);
            oscillator.start(start);
            oscillator.stop(start + 1.75);
            romanticMusicStep++;
        };

        playNote();
        romanticMusicTimer = window.setInterval(playNote, 650);
    }).catch(error => {
        console.error("Could not start the thank-you music.", error);
    });
}

function stopRomanticMusic() {
    if (romanticMusicTimer) {
        window.clearInterval(romanticMusicTimer);
        romanticMusicTimer = undefined;
    }
    if (romanticAudioContext?.state === "running") {
        romanticAudioContext.suspend().catch(error => {
            console.error("Could not pause the thank-you music.", error);
        });
    }
}

function unwrapThankYouNote() {
    const bottle = document.getElementById("scroll-bottle");
    const scroll = document.getElementById("thank-you-scroll");
    if (bottle.getAttribute("aria-expanded") === "true") return;

    playRomanticMusic();

    bottle.setAttribute("aria-expanded", "true");
    scroll.setAttribute("aria-hidden", "false");
    scroll.hidden = false;
    document.getElementById("screen-5").classList.add("is-unwrapped");
    requestAnimationFrame(() => scroll.classList.add("is-visible"));
    bottleHideTimeout = setTimeout(() => { bottle.hidden = true; }, 650);
}

function notifyProgrammer() {
    const phone = phoneCatalog[selectedPhoneModel];
    if (!phone) return;

    const subject = encodeURIComponent("Phone gift selection 💌");
    const body = encodeURIComponent(
        "Hi Keke!\n\nHere is my phone selection:\n" +
        `Model: ${phone.label}\nColor choice: ${selectedColorName}\n\n` +
        "I will check the live listing and complete any billing and payment securely on iStore. " +
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
    clearTimeout(bottleHideTimeout);

    stopRomanticMusic();

    const scrollBottle = document.getElementById("scroll-bottle");
    scrollBottle.hidden = false;
    scrollBottle.setAttribute("aria-expanded", "false");
    document.getElementById("thank-you-scroll").hidden = true;
    document.getElementById("thank-you-scroll").setAttribute("aria-hidden", "true");
    document.getElementById("thank-you-scroll").classList.remove("is-visible");
    document.getElementById("screen-5").classList.remove("is-unwrapped");

    document.querySelectorAll(".phone-option").forEach(option => {
        option.classList.remove("selected");
        option.setAttribute("aria-pressed", "false");
    });
    document.getElementById("istore-buy-link").hidden = true;
    document.getElementById("istore-buy-link").href = "https://www.istore.co.za/iphone";
    document.getElementById("notify-button").disabled = true;
    document.getElementById("phone-selection-summary").textContent =
        "Choose a model to prepare your iStore link and selection email.";
    document.getElementById("phone-color-name").textContent = "not selected";
    renderPhoneIllustrations();

    const btn = document.getElementById('btn-no');
    btn.style.position = 'relative';
    btn.style.left = 'auto';
    btn.style.top = 'auto';
    btn.innerText = "No thanks";

    goToScreen(1);
}