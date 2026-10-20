const currentYearSpan = document.getElementById("year");
    if(currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
        
    }
    
    const lastModifiedSpan = document.getElementById("lastModified");
    if(lastModifiedSpan) {
        lastModifiedSpan.textContent = `${document.lastModified}`;
    }

let currentIdx = 0;
const totalCards = 5;

document.querySelectorAll('.progress-dots').forEach((container) => {
    for (let i=0; i<totalCards; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if(i === currentIdx) dot.classList.add('active');
        container.appendChild(dot);
    }
});

function updateCardClasses() {
    for (let i=0; 1<totalCards; i++) {
        const card = document.getElementById(`card-${i}`);
        card.className = 'card'; 

        if (i === currentIdx) {
            card.classList.add('active');
            const video = card.querySelector('video');
            if (video) video.play().catch(() => {});
        }
        else
            if (i < currentIdx) {
                card.classList.add('prev');
                const video = card.querySelector('video');
                if (video) video.pause();
            }
    }

document.querySelectorAll('.progress-dots').forEach((container) => {
    const dots = container.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
        dot.className = idx === currentIdx?'dot active': 'dot';
    });
});
}

function nextCard() {
    if (currentIdx < totalCards - 1) {
        currentIdx++;
        updateCardClasses();
    }
}

function prevCard() {
    if (currentIdx > 0) {
        currentIdx--;
        updateCardClasses();
    }
}

function resetDeck() {
    currentIdx = 0;
    updateCardClasses();
}
