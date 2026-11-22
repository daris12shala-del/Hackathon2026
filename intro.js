
(function () {
  "use strict";

  try {
  sessionStorage.setItem(STORAGE_KEY, "1");
} catch {}

  function initializeIntro() {
    if (document.getElementById("fi-intro")) return;

    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}

    const intro = document.createElement("div");
    intro.id = "fi-intro";
    intro.className = "fi-intro-active";
    intro.setAttribute("role", "dialog");
    intro.setAttribute("aria-label", "FIND IT cinematic introduction");
    intro.setAttribute("aria-modal", "true");

    intro.innerHTML = `
      <div class="fi-space"></div>
      <div class="fi-grid"></div>
      <div class="fi-nebula"></div>
      <div class="fi-nebula two"></div>
      <div class="fi-stars" id="fiStars"></div>

      <div class="fi-stage">
        <div class="fi-orbit"></div>
        <div class="fi-orbit"></div>
        <div class="fi-orbit"></div>
        <div class="fi-orbit"></div>

        <div class="fi-energy-ring"></div>
        <div class="fi-energy-ring second"></div>
        <div class="fi-energy-ring third"></div>

        <div class="fi-core">
          <div class="fi-key">
            <svg
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="fiKeyGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#FFFFFF"/>
                  <stop offset="40%" stop-color="#E3CAFF"/>
                  <stop offset="100%" stop-color="#A16AFF"/>
                </linearGradient>
                <filter id="fiKeyGlow">
                  <feGaussianBlur stdDeviation="2" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <g
                stroke="url(#fiKeyGradient)"
                stroke-width="10"
                stroke-linecap="round"
                stroke-linejoin="round"
                filter="url(#fiKeyGlow)"
              >
                <circle cx="45" cy="43" r="26"/>
                <path d="M64 62L109 107"/>
                <path d="M91 89L103 77"/>
                <path d="M101 99L112 88"/>
              </g>
              <circle cx="45" cy="43" r="8" fill="#EACFFF"/>
            </svg>
          </div>
        </div>

        <div class="fi-burst"></div>

        <div class="fi-title">
          <h1 class="fi-brand">FIND <span>IT.</span></h1>
          <div class="fi-tagline">Never lose track.</div>
        </div>
      </div>

      <div class="fi-scan"></div>

      <div class="fi-intro-subtitle">
        YOUR SMART LOST & FOUND ASSISTANT
      </div>

      <button class="fi-skip" id="fiSkip" type="button">
        SKIP INTRO →
      </button>
    `;

    document.body.appendChild(intro);

    const stars = intro.querySelector("#fiStars");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const starCount = reducedMotion ? 15 : 100;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("span");
      star.className = "fi-star";

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 1 + Math.random() * 3;
      const delay = Math.random() * 1.5;
      const duration = 1 + Math.random() * 2;

      star.style.setProperty("--x", x + "%");
      star.style.setProperty("--y", y + "%");
      star.style.setProperty("--size", size + "px");
      star.style.setProperty("--delay", delay + "s");
      star.style.setProperty("--duration", duration + "s");

      stars.appendChild(star);
    }

    const timers = new Set();
    let finished = false;

    function schedule(callback, delay) {
      const timer = window.setTimeout(() => {
        timers.delete(timer);

        if (!finished) {
          callback();
        }
      }, delay);

      timers.add(timer);
    }

    function finish() {
      if (finished) return;

      finished = true;

      timers.forEach(timer => clearTimeout(timer));
      timers.clear();

      intro.remove();

      document.dispatchEvent(
        new CustomEvent("findit:intro-complete")
      );
    }

    function exitIntro() {
      if (
        finished ||
        intro.classList.contains("fi-intro-exit")
      ) {
        return;
      }

      intro.classList.add("fi-intro-exit");

      schedule(finish, reducedMotion ? 50 : 950);
    }

    intro.querySelector("#fiSkip")
      .addEventListener("click", finish);

    document.addEventListener(
      "keydown",
      function onKeyDown(event) {
        if (event.key === "Escape" && !finished) {
          finish();
        }

        if (finished) {
          document.removeEventListener(
            "keydown",
            onKeyDown
          );
        }
      }
    );

    if (reducedMotion) {
      intro.classList.add("fi-intro-reveal");
      schedule(exitIntro, 700);
    } else {
      schedule(() => {
        intro.classList.add("fi-intro-reveal");
      }, 2600);

      schedule(exitIntro, 5000);
    }

    window.addEventListener(
      "pagehide",
      finish,
      { once: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeIntro,
      { once: true }
    );
  } else {
    initializeIntro();
  }
})();
