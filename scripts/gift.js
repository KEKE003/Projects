const currentYearSpan = document.getElementById("year");
    if(currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
        
    }
    
    const lastModifiedSpan = document.getElementById("lastModified");
    if(lastModifiedSpan) {
        lastModifiedSpan.textContent = `${document.lastModified}`;
    }

let selectedColorName = "";
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

    goToScreen(3);
}

function runAway() {
    const btn = document.getElementById('btn-no');
    const maxX = Math.max(0, window.innerWidth - btn.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - btn.offsetHeight);
    const randomX = Math.floor(Math.random()*maxX);
    const randomY = Math.floor(Math.random()*maxY);

    btn.style.position = 'fixed';
    btn.style.left = `${randomX}px`;
    btn.style.top = `${randomY}px`;
    btn.innerText = "Oops... wrong button! 🙈";

    setTimeout(() => {btn.innerText = "No";}, 800);
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
    const subject = encodeURIComponent("They said yes to the phone! 📱");
    const body = encodeURIComponent(
        "Hi Keke!\n\nI said yes, and I’d love to buy you a new phone! 💛\n" +
        "My color pick was " + selectedColorName + ".\n\n" +
        "Sent from your gift app."
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

    const btn = document.getElementById('btn-no');
    btn.style.position = 'relative';
    btn.style.left = 'auto';
    btn.style.top = 'auto';
    btn.innerText = "No thanks";

    goToScreen(1);
}