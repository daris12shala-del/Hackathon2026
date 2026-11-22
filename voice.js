
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  if (document.body.dataset.page !== "myhome") return;

  const $ = id => document.getElementById(id);
  const homeAPI = window.FindItHome;

  if (!homeAPI) {
    console.error("FindItHome API is missing.");
    return;
  }

  const Recognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  let recognition = null;
  let listening = false;
  let soundEnabled = true;
  let draft = null;

  function isAlbanian() {
    return $("voiceLanguage").value.startsWith("sq");
  }

  function tr(al, en) {
    return isAlbanian() ? al : en;
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function message(text, sender = "bot") {
    const element = document.createElement("div");

    element.className = "voice-message " + sender;
    element.textContent = text;

    $("voiceMessages").append(element);

    while ($("voiceMessages").children.length > 30) {
      $("voiceMessages").firstElementChild.remove();
    }

    $("voiceMessages").scrollTop =
      $("voiceMessages").scrollHeight;
  }

  function speak(text) {
    if (!soundEnabled || !window.speechSynthesis) return;

    speechSynthesis.cancel();

    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = $("voiceLanguage").value;
    voice.rate = .94;

    speechSynthesis.speak(voice);
  }

  function answer(text) {
    message(text);
    speak(text);
  }

  function setListening(active) {
    listening = active;

    $("voiceOrbArea").classList.toggle("listening", active);
    $("voiceIndicator").classList.toggle("listening", active);

    $("voiceIndicator").textContent =
      active ? "LISTENING" : "READY";

    $("voiceTalk").textContent =
      active ? "Stop" : "Talk";

    $("orbTitle").textContent =
      active ? "I'm Listening..." : "Your Voice Assistant";

    $("orbSubtitle").textContent =
      active
        ? "Speak now, FIND IT is listening"
        : "Tap the microphone to speak";
  }

  function getData() {
    return homeAPI.getData();
  }

  function getRoom(roomId) {
    for (const floor of getData().floors) {
      const room = floor.rooms.find(r => r.id === roomId);

      if (room) return {floor, room};
    }

    return null;
  }

  function floorAliases(floor, index) {
    const name = normalize(floor.name);
    const aliases = [name];

    if (/basement|podrum/.test(name)) {
      aliases.push("podrum", "podrumi", "basement");
    }

    if (/ground|perdhese/.test(name)) {
      aliases.push(
        "perdhese", "ne perdhese",
        "ground floor", "kati zero"
      );
    }

    if (/first|floor 1/.test(name)) {
      aliases.push(
        "first floor", "floor 1",
        "kati i pare", "katin e pare"
      );
    }

    if (/second|floor 2/.test(name)) {
      aliases.push(
        "second floor", "floor 2",
        "kati i dyte", "katin e dyte"
      );
    }

    if (/third|floor 3/.test(name)) {
      aliases.push("third floor", "kati i trete");
    }

    aliases.push("floor " + index);

    return [...new Set(aliases)];
  }

  function matchFloor(text) {
    const query = " " + normalize(text) + " ";
    const candidates = [];

    getData().floors.forEach((floor, index) => {
      floorAliases(floor, index).forEach(alias => {
        if (alias && query.includes(" " + alias + " ")) {
          candidates.push({floor, length: alias.length});
        }
      });
    });

    candidates.sort((a, b) => b.length - a.length);

    return candidates.length ? candidates[0].floor : null;
  }

  const ROOM_ALIASES = {
    bedroom: ["bedroom", "dhome gjumi"],
    living: ["living room", "sallon", "salloni"],
    kitchen: ["kitchen", "kuzhine", "kuzhina"],
    bathroom: ["bathroom", "banje", "banja"],
    garage: ["garage", "garazh", "garazhin"],
    storage: ["storage", "depo"],
    basement: ["basement", "podrum"],
    office: ["office", "zyre", "zyra"],
    game: ["game room", "dhoma e lojrave"],
    gym: ["gym", "palester"],
    laundry: ["laundry", "lavanderi"],
    dining: ["dining room"]
  };

  function matchRoom(text, floorId = null) {
    const query = " " + normalize(text) + " ";
    const candidates = [];

    getData().floors.forEach(floor => {
      if (floorId && floor.id !== floorId) return;

      floor.rooms.forEach(room => {
        const aliases = [
          normalize(room.name),
          ...(ROOM_ALIASES[room.type] || [])
        ];

        aliases.forEach(alias => {
          if (alias && query.includes(" " + alias + " ")) {
            candidates.push({
              floor,
              room,
              length: alias.length,
              exact: alias === normalize(room.name)
            });
          }
        });
      });
    });

    candidates.sort((a, b) =>
      Number(b.exact) - Number(a.exact) ||
      b.length - a.length
    );

    if (!candidates.length) return null;

    const best = candidates[0];

    const ambiguous = candidates.some(candidate =>
      candidate.room.id !== best.room.id &&
      candidate.exact === best.exact &&
      candidate.length === best.length
    );

    return ambiguous ? {ambiguous: true} : best;
  }

  function matchItem(text) {
    const query = normalize(text);
    const items = getData().items;

    const exact = items.filter(item =>
      query.includes(normalize(item.name))
    );

    exact.sort((a, b) => b.name.length - a.name.length);

    if (exact.length) return exact[0];

    const cleaned = query
      .replace(
        /\b(ku|i|e|kam|jane|eshte|where|is|are|my|the|find|gjej|me|te|mi|nje|send|item)\b/g,
        " "
      )
      .replace(/\s+/g, " ")
      .trim();

    if (!cleaned || cleaned.length < 3) return null;

    return items.find(item =>
      normalize(item.name).includes(cleaned)
    ) || null;
  }

  function extractPlace(text) {
    const match =
      /\b(mbi|brenda|nen|nën|poshte|poshtë|prane|pranë|afër|afer|under|inside|beside|behind|on the|next to)\b/i.exec(text);

    if (!match) return "";

    return text.slice(match.index)
      .replace(/[.!?]+$/, "")
      .trim()
      .slice(0, 100);
  }

  function extractName(text) {
    let name = String(text).trim();

    name = name.replace(
      /^(dua\s+(?:te|të|me)\s+)?(regjistro|regjistru|shto|ruaj|record|add|save)\s*/i,
      ""
    );

    name = name.replace(
      /^(nje\s+send|një\s+send|sendin|an?\s+item)\s*/i,
      ""
    );

    name = name.split(
      /\s+(?:ne\s+katin|në\s+katin|ne\s+perdhese|në\s+përdhesë|on\s+the\s+ground|on\s+the\s+first|mbi|brenda|under|inside)\b/i
    )[0];

    return name.trim().slice(0, 60);
  }

  function beginRegistration(raw, kind = "add") {
    const data = getData();

    if (!data.floors.some(f => f.rooms.length)) {
      answer(tr(
        "Së pari shto një dhomë te My Home.",
        "Please add a room to My Home first."
      ));
      return;
    }

    draft = {
      kind,
      name: "",
      itemId: null,
      floorId: "",
      roomId: "",
      place: "",
      step: ""
    };

    if (kind === "move") {
      const item = matchItem(raw);

      if (item) {
        draft.name = item.name;
        draft.itemId = item.id;
      }
    } else {
      const name = extractName(raw);
      const generic = [
        "", "send", "sendin", "nje send",
        "një send", "item", "a item", "an item"
      ];

      if (!generic.includes(normalize(name))) {
        draft.name = name;
      }
    }

    const floor = matchFloor(raw);
    if (floor) draft.floorId = floor.id;

    const room = matchRoom(raw, draft.floorId || null);

    if (room && !room.ambiguous) {
      draft.roomId = room.room.id;
      draft.floorId = room.floor.id;
    }

    draft.place = extractPlace(raw);
    askNext();
  }

  function askNext() {
    if (!draft) return;

    if (!draft.name) {
      draft.step = "name";

      answer(draft.kind === "move"
        ? tr(
          "Cilin send të regjistruar dëshiron ta zhvendosësh?",
          "Which saved item would you like to move?"
        )
        : tr(
          "Cilin send dëshiron ta regjistrosh?",
          "Which item would you like to record?"
        )
      );
      return;
    }

    if (!draft.floorId) {
      draft.step = "floor";

      answer(tr(
        "Në cilin kat? " +
          getData().floors.map(f => f.name).join(", "),
        "Which floor? " +
          getData().floors.map(f => f.name).join(", ")
      ));
      return;
    }

    if (!draft.roomId) {
      draft.step = "room";

      const floor = getData().floors.find(
        f => f.id === draft.floorId
      );

      answer(tr(
        "Në cilën dhomë? " +
          floor.rooms.map(r => r.name).join(", "),
        "Which room? " +
          floor.rooms.map(r => r.name).join(", ")
      ));
      return;
    }

    if (!draft.place) {
      draft.step = "place";

      answer(tr(
        "Ku saktësisht e ke lënë? Për shembull: mbi tavolinë.",
        "Where exactly did you put it? For example: on the table."
      ));
      return;
    }

    const found = getRoom(draft.roomId);

    if (!found) {
      draft.roomId = "";
      askNext();
      return;
    }

    draft.step = "confirm";

    answer(tr(
      `Ta ruaj ${draft.name} në ${found.floor.name}, ${found.room.name}, ${draft.place}? Thuaj po ose jo.`,
      `Save ${draft.name} in ${found.floor.name}, ${found.room.name}, ${draft.place}? Say yes or no.`
    ));
  }

  function confirmDraft() {
    if (!draft) return;

    const found = getRoom(draft.roomId);

    if (!found || found.floor.id !== draft.floorId) {
      answer(tr(
        "Dhoma nuk ekziston më.",
        "The selected room no longer exists."
      ));

      draft = null;
      return;
    }

    let result;

    if (draft.kind === "move") {
      result = homeAPI.updateItem(
        draft.itemId,
        draft.roomId,
        draft.place
      );
    } else {
      result = homeAPI.addItem({
        name: draft.name,
        roomId: draft.roomId,
        place: draft.place
      });
    }

    if (result.ok) {
      answer(tr(
        `${draft.name} u ruajt me sukses në ${found.room.name}.`,
        `${draft.name} was successfully saved in ${found.room.name}.`
      ));
    } else {
      answer(tr(
        "Ruajtja dështoi: " + result.error,
        "Saving failed: " + result.error
      ));
    }

    draft = null;
  }

  function handleDraft(raw) {
    const query = normalize(raw);

    if (/^(jo|no|anulo|cancel|ndalo|stop)$/.test(query)) {
      draft = null;

      answer(tr(
        "Regjistrimi u anulua.",
        "Registration cancelled."
      ));
      return;
    }

    if (draft.step === "confirm") {
      if (/^(po|yes|ok|okay|ruaje|save|confirm|konfirmo|po ruaje)$/.test(query)) {
        confirmDraft();
        return;
      }

      if (/ndrysho|change|edit/.test(query)) {
        if (/kat|floor/.test(query)) {
          draft.floorId = "";
          draft.roomId = "";
        } else if (/dhom|room/.test(query)) {
          draft.roomId = "";
        } else if (/emr|name/.test(query)) {
          draft.name = "";
        } else {
          draft.place = "";
        }

        askNext();
        return;
      }

      answer(tr(
        "Thuaj po, jo, ose ndrysho dhomën.",
        "Say yes, no, or change room."
      ));
      return;
    }

    if (draft.step === "name") {
      if (draft.kind === "move") {
        const item = matchItem(raw);

        if (!item) {
          answer(tr(
            "Nuk e gjeta sendin. Thuaje emrin e regjistruar.",
            "I couldn't find that item. Say its saved name."
          ));
          return;
        }

        draft.name = item.name;
        draft.itemId = item.id;
      } else {
        draft.name = raw.trim().slice(0, 60);
      }

    } else if (draft.step === "floor") {
      const floor = matchFloor(raw);

      if (!floor) {
        answer(tr(
          "Nuk e njoha katin. Thuaje emrin e plotë.",
          "I didn't recognize that floor. Say its full name."
        ));
        return;
      }

      draft.floorId = floor.id;
      draft.roomId = "";

      const room = matchRoom(raw, draft.floorId);

      if (room && !room.ambiguous) {
        draft.roomId = room.room.id;
      }

    } else if (draft.step === "room") {
      const room = matchRoom(raw, draft.floorId);

      if (!room || room.ambiguous) {
        answer(tr(
          "Nuk e njoha dhomën. Thuaje emrin e plotë.",
          "I didn't recognize that room. Say its full name."
        ));
        return;
      }

      draft.roomId = room.room.id;

      const place = extractPlace(raw);
      if (place) draft.place = place;

    } else if (draft.step === "place") {
      draft.place = raw.trim().slice(0, 100);
    }

    askNext();
  }

  function command(raw) {
    const text = normalize(raw);
    if (!text) return;

    message(raw, "user");

    if (draft) {
      handleDraft(raw);
      return;
    }

    if (
      /\b(zhvendos|zhvendosa|leviza|move|moved|update)\b/.test(text)
    ) {
      beginRegistration(raw, "move");
      return;
    }

    if (
      /\b(regjistro|regjistru|shto|ruaj|record|add|save)\b/.test(text) &&
      !/\b(room|dhome|dhoma|floor|kat)\b/.test(text)
    ) {
      beginRegistration(raw);
      return;
    }

    if (/\b(ku|where|find|gjej|kerko)\b/.test(text)) {
      const item = matchItem(raw);

      if (!item) {
        answer(tr(
          "Nuk e gjeta këtë send në listë.",
          "I couldn't find this item in your collection."
        ));
        return;
      }

      const location = getRoom(item.roomId);

      if (!location) {
        answer(tr(
          "Dhoma e regjistruar nuk ekziston më.",
          "The saved room no longer exists."
        ));
        return;
      }

      homeAPI.locateItem(item.id);

      answer(tr(
        `${item.name} është në ${location.floor.name}, në ${location.room.name}. Vendi: ${item.place}.`,
        `${item.name} is on ${location.floor.name}, in ${location.room.name}. Location: ${item.place}.`
      ));
      return;
    }

    if (
      /\b(shfaq|trego|show|open|hap)\b/.test(text) &&
      /\b(katet|kate|floors|levels)\b/.test(text)
    ) {
      homeAPI.setMode("exploded");

      answer(tr(
        "Po i shfaq të gjitha katet.",
        "Showing all floors."
      ));
      return;
    }

    if (
      /\b(exterior|outside|jashte|jashtme|fasade)\b/.test(text)
    ) {
      homeAPI.setMode("exterior");

      answer(tr(
        "Ja pamja e jashtme.",
        "Here is the exterior view."
      ));
      return;
    }

    const floor = matchFloor(raw);

    if (
      floor &&
      /\b(kat|floor|shfaq|show|hap|open)\b/.test(text)
    ) {
      homeAPI.selectFloor(floor.id);

      answer(tr(
        `Po e shfaq ${floor.name}.`,
        `Showing ${floor.name}.`
      ));
      return;
    }

    if (/\b(help|ndihme|cfare mund|what can)\b/.test(text)) {
      answer(tr(
        "Mund të regjistrosh, kërkosh dhe zhvendosësh sende, si edhe të kontrollosh katet.",
        "You can record, find and move items, and explore your home."
      ));
      return;
    }

    answer(tr(
      "Provo: Regjistro një send, Ku i kam çelësat, ose Shfaq katet.",
      "Try: Record an item, Where are my keys, or Show floors."
    ));
  }

  function toggleMicrophone() {
    if (!recognition) {
      answer(tr(
        "Mikrofoni nuk mbështetet. Mund të shkruash mesazhin.",
        "Speech recognition is unavailable. You can type instead."
      ));
      return;
    }

    if (listening) {
      recognition.stop();
      return;
    }

    if (window.speechSynthesis) {
      speechSynthesis.cancel();
    }

    recognition.lang = $("voiceLanguage").value;

    try {
      recognition.start();
    } catch {
      setListening(false);
      message("Could not start the microphone.");
    }
  }

  if (Recognition) {
    recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = event => {
      const result = event.results[0];

      if (result && result[0]) {
        command(result[0].transcript);
      }
    };

    recognition.onerror = event => {
      setListening(false);

      const errors = {
        "not-allowed": "Microphone permission denied.",
        "audio-capture": "Microphone not detected.",
        "no-speech": "No speech detected. Try again.",
        "network": "Speech recognition service unavailable.",
        "language-not-supported": "Language not supported."
      };

      message(
        errors[event.error] ||
        "Recognition error. Please type instead."
      );
    };

  } else {
    $("voiceTalk").disabled = true;
    $("voiceOrb").disabled = true;
    $("voiceIndicator").textContent = "TEXT MODE";
  }

  $("voiceTalk").onclick = toggleMicrophone;
  $("voiceOrb").onclick = toggleMicrophone;

  $("voiceSound").onclick = () => {
    soundEnabled = !soundEnabled;

    $("voiceSound").textContent =
      soundEnabled ? "Sound On" : "Sound Off";

    if (!soundEnabled && window.speechSynthesis) {
      speechSynthesis.cancel();
    }
  };

  $("voiceLanguage").onchange = () => {
    if (recognition && listening) recognition.stop();

    message(tr(
      "Gjuha u ndryshua në shqip.",
      "Language changed to English."
    ));
  };

  $("voiceForm").onsubmit = event => {
    event.preventDefault();

    const input = $("voiceInput");
    const text = input.value.trim();

    if (!text) return;

    input.value = "";
    command(text);
  };

  $("voiceAdd").onclick = () => {
    command("Regjistro një send");
  };

  $("voiceFind").onclick = () => {
    $("voiceInput").value = isAlbanian()
      ? "Ku i kam "
      : "Where are my ";

    $("voiceInput").focus();

    answer(tr(
      "Shkruaje emrin e sendit që po kërkon.",
      "Type the name of the item you want to find."
    ));
  };

  $("voiceHome").onclick = () => {
    homeAPI.setMode("exploded");

    answer(tr(
      "Po i shfaq katet e shtëpisë.",
      "Showing the floors of your home."
    ));
  };

  setListening(false);
});
