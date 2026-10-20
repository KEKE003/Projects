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
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-{num}`).classList.add('active');
    if(num === 4) {
        launchConfetti();
    }
}

function pickColor(name, bg1, bg2, accent) {
    selectedColorName = name;
    document.documentElement.style.setProperty('--bg-1', bg1);
    document.documentElement.style.setProperty('--bg-2', bg2);
    document.documentElement.style.setProperty('--accent', accent);

    const prettyNames = {
        silver: "Silver",
        blue: "Blue",
        orange: "Orange"
    };
    document.getElementById('color-compliment').innerText = `${prettyNames[name]} is an amazing choice!`;
    document.getElementById('chosen-color-text').innerText = prettyNames[name];

    goToScreen(3);
}

function runAway() {
    const btn = document.getElementById('btn-no');
    const maxX = window.innerWidth-btn.offsetWidth-50;
    const maxY = window.innerHeight-btn.offsetHeight-50;
    const randomX = Math.floor(Math.random()*maxX);
    const randomY = Math.floor(Math.random()*maxY);

    btn.style.position = 'fixed';
    btn.style.left = `${randomX}px`;
    btn.style.top = `${randomY}px`;
    btn.innerText = "Oops... wrong button!"

    setTimeout(() => {btn.innerText = "No";}, 800);
}

function launchConfetti() {
    const colors = ['#f02d2d', '#d9f524', '#08b311', '#dc19c2', '#7eb1ef', '#5f27cd'];

    for (let index = 0; index < 100; index++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
        confetti.style.left = Math.random()* 100 + 'vw';
        confetti.style.animation = `fall${Math.random()* 2 + 2}s linear forwards`;
        confetti.style.animationDelay = Math.random()* 1.5 + 's';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 4000);
    }
}

function submitData() {
    const subject = encodeURIComponent("Phone Gift Receipt-URGENT");
    const body = encodeURIComponent(
        "PROGRAMMER OVERRIDE INITIATED.\n\n"+
        "User Data Collected:\n"+
        "-Color Choice: "+selectedColorName+"\n"+
        "-Phone Purchase Agreement: YES(Trapped)\n"+
        "-Escape Attempt: FAILED(No button ran away)\n\n"+
        "Awaiting physical delivery of the device.\n\n"+
        "Sent via the totally-not-a prank web app."
    );
    window.location.href = `malito:kekeletsobt@gmail.com?Subject=${subject}&body=${body}`;
}

function resetApp() {
    document.documentElement.style.setProperty('--bg-1', '#ff9a9e');
    document.documentElement.style.setProperty('--bg-2', '#fecfef');
    document.documentElement.style.setProperty('--accent', '#ff6b6b');

    const btn = document.getElementById('btn-no');
    btn.style.position = 'relative';
    btn.style.left = 'auto';
    btn.style.top = 'auto';
    btn.innerText = "No";

    goToScreen(1);
}