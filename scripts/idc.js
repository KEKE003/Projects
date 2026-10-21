const currentYearSpan = document.getElementById("year");
    if(currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
        
    }
    
    const lastModifiedSpan = document.getElementById("lastModified");
    if(lastModifiedSpan) {
        lastModifiedSpan.textContent = `${document.lastModified}`;
    }

const sections = [...document.querySelectorAll("main > section")];
        const startButton = document.getElementById("start-button");
        const yesButton = document.getElementById("yes-button");
        const noButton = document.getElementById("no-button");
        const runawayArea = document.getElementById("runaway-area");
        const runawayProgress = document.getElementById("runaway-progress");
        const careMeter = document.getElementById("care-meter");
        const meterMessage = document.getElementById("meter-message");
        const runawayLimit = 100;
        let runawayCount = 0;

        function showSection(id) {
            sections.forEach(section => {
                section.hidden = section.id !== id;
            });
            document.getElementById(id).querySelector("button, input")?.focus();
        }

        function moveYesButton() {
            if (runawayCount >= runawayLimit) return;

            runawayCount += 1;
            const area = runawayArea.getBoundingClientRect();
            const button = yesButton.getBoundingClientRect();
            const no = noButton.getBoundingClientRect();
            const maxLeft = Math.max(0, area.width - button.width);
            const maxTop = Math.max(0, area.height - button.height);
            let left = 0;
            let top = 0;

            for (let attempt = 0; attempt < 20; attempt += 1) {
                left = Math.random() * maxLeft;
                top = Math.random() * maxTop;
                const overlapsNo = left < no.right - area.left &&
                    left + button.width > no.left - area.left &&
                    top < no.bottom - area.top &&
                    top + button.height > no.top - area.top;
                if (!overlapsNo) break;
            }

            yesButton.style.left = `${left}px`;
            yesButton.style.top = `${top}px`;
            yesButton.style.transform = "none";
            runawayProgress.textContent = runawayCount < runawayLimit
                ? `Nice try! ${runawayCount}/${runawayLimit} escapes 😄`
                : "You caught me! One hundred escapes complete 😄";
        }

        startButton.addEventListener("click", () => showSection("message"));
        yesButton.addEventListener("pointerenter", moveYesButton);
        yesButton.addEventListener("click", () => showSection("ending"));
        noButton.addEventListener("click", () => showSection("meter"));

        careMeter.addEventListener("input", () => {
            careMeter.value = "50";
            meterMessage.textContent = "This meter is stuck—but I do care, even when communication gets tricky. 🙄";
        });

        document.getElementById("talk-button").addEventListener("click", () => showSection("ending"));
        document.getElementById("restart-button").addEventListener("click", () => {
            runawayCount = 0;
            runawayProgress.textContent = "";
            yesButton.removeAttribute("style");
            careMeter.value = "50";
            meterMessage.textContent = "Pick a spot on the meter 👀";
            showSection("intro");
        });