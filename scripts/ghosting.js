(() => {
        const meterCopy = [
          { title: "I care… impressively little.", detail: "Like, “forgot this tab was open” little." },
          { title: "My interest is on airplane mode.", detail: "No signal. No follow-up. We have the data." },
          { title: "This is not a puzzle to solve.", detail: "A quiet exit is still an answer." },
          { title: "Changing my mind isn’t your assignment.", detail: "You can put the detective board away." },
          { title: "Plot twist: you get your time back.", detail: "Return your attention to its rightful owner." },
          { title: "My loss. Start your next chapter.", detail: "The door is closed. The horizon is not." }
        ];
        const stepPrompts = [
          "First, the honest message.",
          "Take a guess. Pick any reason that feels possible.",
          "Move the scale to see where my feelings land.",
          "A sincere wish for what comes next.",
          "One last question before you move on."
        ];
        const noMessages = [
          "Give it up already.",
          "The answer is still no.",
          "Please respect my boundary.",
          "Put the phone down. You’ve got this.",
          "No more texts. Time to move on.",
          "Let it go — your future is elsewhere.",
          "Don't do this to yourself."
        ];
        const flowPages = [...document.querySelectorAll(".flow-page")];
        const stepNumber = document.getElementById("stepNumber");
        const stepPrompt = document.getElementById("stepPrompt");
        const flowProgress = document.getElementById("flowProgress");
        const flowProgressFill = document.getElementById("flowProgressFill");
        const reasons = [...document.querySelectorAll(".reason-chip")];
        const selectedReasons = new Set();
        const allReasonsOption = "All of the above";
        const reasonSummary = document.getElementById("reasonSummary");
        const meter = document.getElementById("emotionalMeter");
        const meterMessage = document.getElementById("meterMessage");
        const meterDetail = document.getElementById("meterDetail");
        const meterPercent = document.getElementById("meterPercent");
        const meterControl = document.querySelector(".meter-control");
        const meterFill = document.getElementById("meterFill");
        const meterGhost = document.getElementById("meterGhost");
        const choiceZone = document.getElementById("choiceZone");
        const noButton = document.getElementById("noButton");
        const fineButton = document.getElementById("fineButton");
        const noMessage = document.getElementById("noMessage");
        const experience = document.getElementById("experience");
        const celebration = document.getElementById("celebration");
        const celebrationTitle = document.getElementById("celebrationTitle");
        const soundtrackToggle = document.getElementById("soundtrackToggle");
        const soundtrackStatus = document.getElementById("soundtrackStatus");
        const confettiField = document.getElementById("confettiField");
        const restartButton = document.getElementById("restartButton");
        const colors = ["#c5415e", "#efc94e", "#6e9d83", "#554365", "#ed986e"];
        const celebrationEmojis = ["🕺", "😭", "💃", "🥲", "🪩", "😭", "🕺", "💃", "😭", "🪩", "🥲", "🕺"];
        let noAttempts = 0;
        let currentPage = 0;

        function showPage(pageIndex) {
          currentPage = Math.max(0, Math.min(flowPages.length - 1, pageIndex));
          flowPages.forEach((page, index) => {
            page.hidden = index !== currentPage;
          });
          stepNumber.innerText = String(currentPage + 1).padStart(2, "0");
          stepPrompt.innerText = stepPrompts[currentPage];
          flowProgressFill.style.width = `${((currentPage + 1) / flowPages.length) * 100}%`;
          flowProgress.setAttribute("aria-valuenow", String(currentPage + 1));
          const heading = flowPages[currentPage].querySelector("h1, h2");
          if (heading) heading.focus({ preventScroll: true });
          window.scrollTo({ top: 0, behavior: "auto" });
        }

        document.querySelectorAll("[data-next-page]").forEach((button) => {
          button.addEventListener("click", () => showPage(Number(button.dataset.nextPage)));
        });
        document.querySelectorAll("[data-previous-page]").forEach((button) => {
          button.addEventListener("click", () => showPage(Number(button.dataset.previousPage)));
        });

        reasons.forEach((button) => {
          button.addEventListener("click", () => {
            const reason = button.dataset.reason;
            if (button.dataset.allReasons === "true") {
              if (selectedReasons.has(allReasonsOption)) {
                selectedReasons.clear();
              } else {
                selectedReasons.clear();
                reasons
                  .filter((reasonButton) => reasonButton.dataset.allReasons !== "true")
                  .forEach((reasonButton) => selectedReasons.add(reasonButton.dataset.reason));
                selectedReasons.add(allReasonsOption);
              }
            } else {
              selectedReasons.delete(allReasonsOption);
              if (selectedReasons.has(reason)) {
                selectedReasons.delete(reason);
              } else {
                selectedReasons.add(reason);
              }
            }
            reasons.forEach((reasonButton) => {
              reasonButton.setAttribute("aria-pressed", String(selectedReasons.has(reasonButton.dataset.reason)));
            });

            reasonSummary.innerText = selectedReasons.has(allReasonsOption)
              ? "All of the above — noted. My decision is still the same."
              : selectedReasons.size
                ? `${selectedReasons.size} ${selectedReasons.size === 1 ? "guess" : "guesses"} noted. My decision is still the same.`
                : "No explanation makes being ignored feel great. Still, it is not a measure of you.";
          });
        });

        meter.addEventListener("input", () => {
          const value = Number(meter.value);
          const copy = meterCopy[Math.min(meterCopy.length - 1, Math.floor(value / 20))];
          meterFill.style.height = `${value}%`;
          meterGhost.style.bottom = `${value}%`;
          meterPercent.innerText = `${value}% on the emotional scale`;
          meterMessage.innerText = copy.title;
          meterDetail.innerText = copy.detail;
          meter.setAttribute("aria-valuetext", value === 0 ? "I don't really care at all" : value === 100 ? "My loss" : `${value} percent`);
          meterControl.classList.remove("meter-pop");
          void meterControl.offsetWidth;
          meterControl.classList.add("meter-pop");
          window.setTimeout(() => meterControl.classList.remove("meter-pop"), 450);
        });

        function dodgeNo() {
          if (noAttempts >= 1000) return;
          const zoneRect = choiceZone.getBoundingClientRect();
          const stackedButtons = window.matchMedia("(max-width: 900px)").matches;
          const maxLeft = Math.max(12, zoneRect.width - noButton.offsetWidth - (stackedButtons ? 24 : fineButton.offsetWidth + 48));
          const minTop = stackedButtons ? fineButton.offsetHeight + 24 : 10;
          const protectedBottom = stackedButtons ? 64 : 38;
          const maxTop = Math.max(minTop, zoneRect.height - noButton.offsetHeight - protectedBottom);
          noAttempts += 1;
          const x = 12 + ((noAttempts * 97) % Math.max(1, maxLeft - 11));
          const y = minTop + ((noAttempts * 53) % Math.max(1, maxTop - minTop + 1));
          noButton.style.left = `${Math.min(x, maxLeft)}px`;
          noButton.style.top = `${Math.min(y, maxTop)}px`;
          noButton.style.transform = "none";
          noMessage.hidden = false;
          noMessage.innerText = noMessages[(noAttempts - 1) % noMessages.length];
          noMessage.classList.remove("message-pop");
          void noMessage.offsetWidth;
          noMessage.classList.add("message-pop");
        }

        noButton.addEventListener("pointerenter", (event) => {
          if (event.pointerType !== "touch") dodgeNo();
        });
        noButton.addEventListener("pointerdown", (event) => {
          if (event.pointerType === "touch") {
            event.preventDefault();
            dodgeNo();
          }
        });
        noButton.addEventListener("click", (event) => {
          if (event.detail === 0) {
            event.preventDefault();
            dodgeNo();
          }
        });

        function fillConfetti() {
          confettiField.replaceChildren();
          for (let index = 0; index < 56; index += 1) {
            const piece = document.createElement("i");
            piece.className = "confetti";
            piece.style.setProperty("--x", `${(index * 37 + 4) % 100}%`);
            piece.style.setProperty("--delay", `${-((index * 13) % 53) / 10}s`);
            piece.style.setProperty("--fall", `${3.2 + ((index * 17) % 29) / 10}s`);
            piece.style.setProperty("--drift", `${((index * 23) % 130) - 65}px`);
            piece.style.setProperty("--c", colors[index % colors.length]);
            piece.style.setProperty("--rot", `${(index * 41) % 90}deg`);
            piece.style.setProperty("--resting", `${(index * 11) % 82}%`);
            confettiField.append(piece);
          }
          celebrationEmojis.forEach((emoji, index) => {
            const piece = document.createElement("span");
            piece.className = "falling-emoji";
            piece.innerText = emoji;
            piece.dataset.testid = `falling-emoji-${index}`;
            piece.style.setProperty("--x", `${(index * 43 + 8) % 100}%`);
            piece.style.setProperty("--delay", `${-((index * 7) % 31) / 10}s`);
            piece.style.setProperty("--fall", `${4 + ((index * 11) % 19) / 10}s`);
            piece.style.setProperty("--drift", `${((index * 31) % 150) - 75}px`);
            piece.style.setProperty("--resting", `${(index * 17 + 5) % 82}%`);
            confettiField.append(piece);
          });
        }

        let soundtrackPaused = false;
        let soundtrackAudio = null;
        const soundtrackPath = "assets/celebration.mp3";

        function playSoundtrack() {
          soundtrackAudio.play().then(() => {
            soundtrackPaused = false;
            soundtrackToggle.innerText = "Pause soundtrack";
            soundtrackStatus.innerText = "Now playing: your chosen soundtrack.";
          }).catch(() => {
            soundtrackPaused = true;
            soundtrackToggle.innerText = "Play soundtrack";
            soundtrackStatus.innerText = "The soundtrack couldn’t play. Check the audio file and try again.";
          });
        }

        function startSoundtrack() {
          if (!soundtrackAudio) {
            soundtrackAudio = new Audio(soundtrackPath);
            soundtrackAudio.loop = true;
            soundtrackAudio.preload = "auto";
            soundtrackAudio.volume = 0.8;
          }

          playSoundtrack();
        }

        function stopSoundtrack() {
          if (soundtrackAudio) {
            soundtrackAudio.pause();
            soundtrackAudio.currentTime = 0;
          }
          soundtrackPaused = false;
          if (!soundtrackToggle.disabled) soundtrackToggle.innerText = "Pause soundtrack";
          soundtrackStatus.innerText = "The soundtrack starts with the celebration.";
        }

        soundtrackToggle.addEventListener("click", () => {
          if (!soundtrackAudio) {
            startSoundtrack();
            return;
          }

          soundtrackPaused = !soundtrackPaused;
          if (soundtrackPaused) {
            soundtrackAudio.pause();
            soundtrackToggle.innerText = "Play soundtrack";
            soundtrackStatus.innerText = "Soundtrack paused.";
          } else {
            playSoundtrack();
          }
        });

        fineButton.addEventListener("click", () => {
          fillConfetti();
          startSoundtrack();
          experience.hidden = true;
          celebration.hidden = false;
          celebrationTitle.focus({ preventScroll: true });
        });

        restartButton.addEventListener("click", () => {
          selectedReasons.clear();
          reasons.forEach((button) => button.setAttribute("aria-pressed", "false"));
          reasonSummary.innerText = "No explanation makes being ignored feel great. Still, it is not a measure of you.";
          meter.value = "0";
          meter.dispatchEvent(new Event("input", { bubbles: true }));
          noAttempts = 0;
          noButton.removeAttribute("style");
          noMessage.innerText = "";
          noMessage.hidden = true;
          confettiField.replaceChildren();
          stopSoundtrack();
          celebration.hidden = true;
          experience.hidden = false;
          showPage(0);
        });

        showPage(0);
      })();