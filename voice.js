
document.addEventListener("DOMContentLoaded", function () {
  if (document.body.dataset.page !== "myhome") return;

  const $ = id => document.getElementById(id);
  const app = window.FindIt;

  if (!app || !$("voiceForm")) return;

  const Recognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  const VOICE_KEY = "findit-selected-persona-v4";

  let recognition = null;
  let listening = false;
  let sound = true;
  let currentUtterance = null;
  let speechToken = 0;
  let availableVoices = [];

  const synthesis = window.speechSynthesis || null;

  const voiceNames = {
    sophie: [
      "sophie",
      "aria",
      "jenny",
      "samantha",
      "zira",
      "ava",
      "victoria",
      "karen",
      "moira",
      "female"
    ],
    daniel: [
      "daniel",
      "guy",
      "david",
      "mark",
      "ryan",
      "george",
      "alex",
      "male"
    ]
  };

  let selectedPersona = "sophie";

  try {
    const saved = localStorage.getItem(VOICE_KEY);

    if (saved === "sophie" || saved === "daniel") {
      selectedPersona = saved;
    }
  } catch {}

  const sq = () =>
    $("voiceLanguage").value.startsWith("sq");

  const normal = text =>
    String(text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ç/g, "c")
      .replace(/ë/g, "e")
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  function bubble(text, role) {
    const el = document.createElement("div");

    el.className = "voice-message " + role;
    el.textContent = text;

    $("voiceMessages").append(el);

    $("voiceMessages").scrollTop =
      $("voiceMessages").scrollHeight;
  }

  function loadVoices() {
    if (!synthesis) return [];

    availableVoices = synthesis.getVoices();

    return availableVoices;
  }

  function englishVoices() {
    return availableVoices.filter(voice =>
      /^en([-_]|$)/i.test(voice.lang)
    );
  }

  function findPersonaVoice(persona) {
    const voices = englishVoices();

    if (!voices.length) return null;

    const preferred = voiceNames[persona];

    for (const name of preferred) {
      const exact = voices.find(voice =>
        voice.name.toLowerCase() === name
      );

      if (exact) return exact;

      const matching = voices.find(voice =>
        voice.name.toLowerCase().includes(name)
      );

      if (matching) return matching;
    }

    return null;
  }

  function voiceStatus(text) {
    const indicator = $("voiceIndicator");

    if (!indicator || listening) return;

    indicator.textContent = text;
  }

  function updatePersonaUI() {
    const select = $("finditPersonaSelect");

    if (!select) return;

    select.value = selectedPersona;

    loadVoices();

    const voice = findPersonaVoice(selectedPersona);

    select.title = voice
      ? selectedPersona === "sophie"
        ? "Sophie · " + voice.name
        : "Daniel · " + voice.name
      : "No matching voice is installed";
  }

  function stopSpeaking() {
    speechToken++;

    if (!synthesis) return;

    synthesis.cancel();
    currentUtterance = null;
  }

  function speak(text) {
    if (!sound || !synthesis) return;

    stopSpeaking();

    loadVoices();

    const token = speechToken;

    const selectedVoice = findPersonaVoice(
      selectedPersona
    );

    if (!selectedVoice) {
      voiceStatus("VOICE UNAVAILABLE");

      bubble(
        selectedPersona === "sophie"
          ? "Sophie needs an English female voice installed in your browser."
          : "Daniel needs an English male voice installed in your browser.",
        "bot"
      );

      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(String(text));

    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
    utterance.volume = 1;
    utterance.rate = selectedPersona === "daniel"
      ? 0.94
      : 1.02;
    utterance.pitch = selectedPersona === "daniel"
      ? 0.96
      : 1.06;

    currentUtterance = utterance;

    utterance.onstart = () => {
      if (token !== speechToken) return;
      voiceStatus("SPEAKING");
    };

    utterance.onend = () => {
      if (token !== speechToken) return;

      currentUtterance = null;
      voiceStatus("READY");
    };

    utterance.onerror = event => {
      if (token !== speechToken) return;

      currentUtterance = null;

      if (
        event.error !== "canceled" &&
        event.error !== "interrupted"
      ) {
        voiceStatus("VOICE ERROR");

        console.warn(
          "Speech synthesis error:",
          event.error
        );
      }
    };

    try {
      synthesis.speak(utterance);
    } catch (error) {
      currentUtterance = null;
      voiceStatus("VOICE ERROR");

      console.error(error);
    }
  }

  function answer(text) {
    bubble(text, "bot");
    speak(text);
  }

  function createPersonaSelector() {
    if ($("finditPersonaSelect")) return;

    const language = $("voiceLanguage");

    if (!language) return;

    const wrapper = document.createElement("div");

    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.gap = "9px";
    wrapper.style.flexWrap = "wrap";
    wrapper.style.minWidth = "0";

    const label = document.createElement("label");
    label.htmlFor = "finditPersonaSelect";
    label.textContent = "🎭 Voice";

    const select = document.createElement("select");
    select.id = "finditPersonaSelect";

    select.style.minWidth = "125px";
    select.style.maxWidth = "100%";
    select.style.padding = "9px 12px";
    select.style.borderRadius = "10px";
    select.style.border = "1px solid #9672d3";
    select.style.background = "#302344";
    select.style.color = "#ffffff";
    select.style.cursor = "pointer";

    select.innerHTML = `
      <option value="sophie">👩 Sophie</option>
      <option value="daniel">👨 Daniel</option>
    `;

    wrapper.append(label, select);

    const parent = language.parentElement;

    parent.appendChild(wrapper);

    select.value = selectedPersona;

    select.addEventListener("change", () => {
      selectedPersona = select.value;

      try {
        localStorage.setItem(
          VOICE_KEY,
          selectedPersona
        );
      } catch {}

      stopSpeaking();
      updatePersonaUI();

      const voice = findPersonaVoice(
        selectedPersona
      );

      if (!voice) {
        bubble(
          selectedPersona === "sophie"
            ? "No matching female English voice is available. Install one in Windows to enable Sophie."
            : "No matching male English voice is available. Install one in Windows to enable Daniel.",
          "bot"
        );

        voiceStatus("VOICE UNAVAILABLE");
        return;
      }

      const welcome = selectedPersona === "sophie"
        ? "Hello! I'm Sophie, your FIND IT assistant."
        : "Hello! I'm Daniel, your FIND IT assistant.";

      speak(welcome);
    });
  }

  function initializeVoiceSystem() {
    createPersonaSelector();
    loadVoices();
    updatePersonaUI();

    if (!synthesis) {
      voiceStatus("VOICE UNSUPPORTED");
      return;
    }

    if (typeof synthesis.addEventListener === "function") {
      synthesis.addEventListener(
        "voiceschanged",
        () => {
          loadVoices();
          updatePersonaUI();
        }
      );
    }
  }

  function matchedItem(query) {
    let q = normal(query);

    q = q
      .replace(/celesat|celesi|celes|keys/g, "keys")
      .replace(
        /kufjet|degjueset|headphones/g,
        "headphones"
      )
      .replace(/telefoni|phone/g, "phone");

    let words = q.split(" ").filter(w =>
      ![
        "gjej",
        "ku",
        "eshte",
        "jane",
        "im",
        "ime",
        "i",
        "e",
        "te",
        "ne",
        "tek",
        "my",
        "find",
        "where",
        "is",
        "are",
        "the",
        "me",
        "please",
        "item",
        "send",
        "sendin",
        "mi",
        "kam"
      ].includes(w)
    );

    let items = app.getItems();

    return items.find(item => {
      let name = normal(item.name);

      return q.includes(name) ||
        words.some(w =>
          w.length > 2 &&
          name.split(" ").some(n =>
            n.startsWith(w) || w.startsWith(n)
          )
        );
    });
  }

  function locate(query) {
    let item = matchedItem(query);

    if (!item) {
      answer(
        sq()
          ? "Nuk e gjeta këtë send në listën tënde."
          : "I could not find that item in your collection."
      );

      return;
    }

    let place = app.displayLocation(
      item,
      app.getHome()
    );

    answer(
      (sq()
        ? "📍 " + item.name + " është regjistruar te "
        : "📍 " + item.name + " was last saved at "
      ) + place
    );

    $("findInput").value = item.name;
    $("findButton").click();
  }

  function openAdd() {
    $("openItemModal").click();

    answer(
      sq()
        ? "Po e hap formularin. Zgjedh kategorinë, katin, dhomën dhe vendin."
        : "Opening the form. Select category, floor, room and exact location."
    );
  }

  function showHome() {
    document
      .getElementById("myhome-studio")
      .scrollIntoView({
        behavior: "smooth"
      });

    answer(
      sq()
        ? "Po ta shfaq shtëpinë."
        : "Here is your home."
    );
  }

  function parseQuickAdd(text) {
    let s = normal(text);

    let m = s.match(
      /^(?:regjistro|shto|ruaj|add|save|record)\s+(.+?)\s+(?:ne|te|tek|in|at)\s+(.+)$/
    );

    return m
      ? {
          name: m[1],
          place: m[2]
        }
      : null;
  }

  function process(input) {
    let text = String(input || "").trim();

    if (!text) return;

    bubble(text, "user");

    let value = normal(text);

    if (
      /^(shfaq shtepine|trego shtepine|show my home|show home)/
        .test(value)
    ) {
      showHome();
      return;
    }

    if (
      /^(gjej|ku eshte|ku jane|ku i kam|find|where is|locate)/
        .test(value)
    ) {
      locate(text);
      return;
    }

    if (
      /^(regjistro|shto|ruaj|add|save|record)/
        .test(value)
    ) {
      let quick = parseQuickAdd(text);

      if (quick) {
        let home = app.getHome();

        let room = home.floors
          .flatMap(f => f.rooms)
          .find(r =>
            normal(quick.place).includes(
              normal(r.name)
            )
          );

        if (room) {
          const ok = app.addItem({
            name: quick.name,
            category: "Other",
            roomId: room.id,
            place: quick.place,
            notes: "Saved using voice assistant"
          });

          answer(
            ok
              ? sq()
                ? "✅ Sendi u ruajt në të dyja faqet."
                : "✅ Item saved in Dashboard and My Home."
              : sq()
                ? "Ruajtja dështoi."
                : "Saving failed."
          );

          return;
        }
      }

      openAdd();
      return;
    }

    if (matchedItem(text)) {
      locate(text);
      return;
    }

    answer(
      sq()
        ? "Mund të thuash: Gjej çelësat, Regjistro një send, ose Shfaq shtëpinë."
        : "Try: Find my keys, Add item, or Show my home."
    );
  }

  $("voiceForm").onsubmit = e => {
    e.preventDefault();

    let text = $("voiceInput").value;

    $("voiceInput").value = "";

    process(text);
  };

  $("voiceAdd").onclick = openAdd;
  $("voiceHome").onclick = showHome;

  $("voiceFind").onclick = () => {
    let query = $("voiceInput").value.trim();

    if (query) {
      $("voiceInput").value = "";
      locate(query);
    } else {
      $("voiceInput").focus();

      answer(
        sq()
          ? "Shkruaj emrin e sendit në kutinë e mesazhit."
          : "Type an item name in the message field."
      );
    }
  };

  $("voiceSound").onclick = () => {
    sound = !sound;

    $("voiceSound").textContent = sound
      ? "🔊 Sound On"
      : "🔇 Sound Off";

    if (!sound) {
      stopSpeaking();
    }
  };

  function setListening(on) {
    listening = on;

    $("voiceIndicator").textContent = on
      ? "LISTENING"
      : "READY";

    $("orbTitle").textContent = on
      ? "Listening..."
      : "Your Voice Assistant";

    $("orbSubtitle").textContent = on
      ? "Speak now"
      : "Tap the microphone to speak";
  }

  function toggleMic() {
    if (!Recognition) {
      answer(
        sq()
          ? "Mikrofoni nuk mbështetet në këtë shfletues. Shkruaj mesazhin."
          : "Speech recognition is not supported. Type your message."
      );

      return;
    }

    if (listening && recognition) {
      recognition.stop();
      return;
    }

    recognition = new Recognition();

    recognition.lang = $("voiceLanguage").value;
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = e => {
      setListening(false);

      answer(
        (sq()
          ? "Gabim me mikrofonin: "
          : "Microphone error: "
        ) + e.error
      );
    };

    recognition.onresult = e => {
      process(e.results[0][0].transcript);
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
    }
  }

  $("voiceOrb").onclick = toggleMic;
  $("voiceTalk").onclick = toggleMic;

  initializeVoiceSystem();
});
