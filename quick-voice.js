
(function () {
  "use strict";

  function initialize() {
    if (document.getElementById("quickVoiceWidget")) return;

    const html = `
      <button id="qvFloat" type="button"
        aria-label="Open FIND IT Chatbot"
        aria-expanded="false">
        <span class="qv-float-icon">💬</span>
        <span class="qv-float-label">Chatbot</span>
        <span class="qv-notification"></span>
      </button>

      <section id="qvPanel" hidden>
        <header class="qv-top">
          <div class="qv-top-left">
            <div class="qv-avatar">✦</div>
            <div>
              <h3>FIND IT Smart Assistant</h3>
              <span id="qvStatus">ONLINE · READY</span>
            </div>
          </div>
          <button id="qvClose" type="button">×</button>
        </header>

        <div class="qv-intro">
          <h4>Your personal assistant</h4>
          <p>Ask naturally. I'll help you find things.</p>
        </div>

        <div id="qvMessages" role="log"
          aria-live="polite"></div>

        <div class="qv-actions">
          <button id="qvFind" type="button">🔍 Find</button>
          <button id="qvAdd" type="button">➕ Add</button>
          <button id="qvStats" type="button">📦 Items</button>
        </div>

        <form id="qvForm">
          <input id="qvInput" type="text"
            maxlength="500"
            autocomplete="off"
            placeholder="Ask me anything about your items...">

          <button id="qvMic" type="button"
            title="Speak">🎙️</button>

          <button id="qvSend" type="submit"
            title="Send">➤</button>
        </form>

        <footer class="qv-bottom">
          <a href="myhome.html#voice-assistant">
            Open Full Voice Assistant
          </a>
        </footer>
      </section>
    `;

    const widget = document.createElement("div");
    widget.id = "quickVoiceWidget";
    widget.innerHTML = html;
    document.body.appendChild(widget);

    const $ = id => document.getElementById(id);

    const panel = $("qvPanel");
    const floatButton = $("qvFloat");
    const input = $("qvInput");
    const messages = $("qvMessages");
    const status = $("qvStatus");
    const micButton = $("qvMic");

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    const memory = {
      lastItem: null,
      lastRoom: null,
      lastFloor: null,
      pending: null,
      matches: [],
      lastIntent: null,
      history: []
    };

    let recognition = null;
    let speakingMode = false;
    let initialized = false;

    function app() {
      const value = window.FindIt;
      return value &&
        typeof value.getItems === "function" &&
        typeof value.getHome === "function"
          ? value
          : null;
    }

    function clean(value) {
      return String(value ?? "").trim();
    }

    function normalize(value) {
      return clean(value)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    function singular(word) {
      if (word.endsWith("ies") && word.length > 4) {
        return word.slice(0, -3) + "y";
      }

      if (
        word.endsWith("s") &&
        !word.endsWith("ss") &&
        word.length > 3
      ) {
        return word.slice(0, -1);
      }

      return word;
    }

    const stopWords = new Set([
      "i", "me", "my", "mine", "the", "a", "an",
      "it", "its", "is", "are", "was", "were",
      "do", "does", "did", "can", "could",
      "would", "should", "please", "you",
      "your", "to", "for", "of", "about",
      "with", "that", "this", "those", "these",
      "something", "somewhere", "thing",
      "things", "stuff", "item", "items",
      "belonging", "belongings"
    ]);

    const aliases = {
      phone: [
        "phone", "mobile", "cellphone",
        "smartphone", "iphone", "telephone"
      ],
      keys: [
        "keys", "key", "house keys", "car keys"
      ],
      headphones: [
        "headphones", "headset", "earphones",
        "earbuds", "airpods"
      ],
      computer: [
        "computer", "pc", "laptop", "notebook pc"
      ],
      wallet: [
        "wallet", "purse", "billfold"
      ],
      charger: [
        "charger", "charging cable", "phone charger"
      ],
      glasses: [
        "glasses", "spectacles", "sunglasses"
      ],
      remote: [
        "remote", "remote control", "tv remote"
      ],
      bag: [
        "bag", "backpack", "schoolbag", "handbag"
      ],
      watch: [
        "watch", "wristwatch", "smartwatch"
      ]
    };

    const roomAliases = {
      bedroom: ["bedroom", "sleeping room"],
      living: ["living room", "lounge", "sitting room"],
      kitchen: ["kitchen"],
      bathroom: ["bathroom", "restroom", "toilet"],
      garage: ["garage"],
      storage: ["storage", "storeroom"],
      office: ["office", "study", "home office"],
      game: ["game room", "gaming room"],
      gym: ["gym", "fitness room"],
      laundry: ["laundry", "laundry room"],
      dining: ["dining room", "dining area"],
      custom: []
    };

    function words(value) {
      return normalize(value)
        .split(" ")
        .filter(Boolean)
        .map(singular);
    }

    function importantWords(value) {
      return words(value).filter(word =>
        !stopWords.has(word)
      );
    }

    function canonical(value) {
      const text = normalize(value);

      for (const [key, variations] of Object.entries(aliases)) {
        if (variations.some(v => normalize(v) === text)) {
          return key;
        }
      }

      return singular(text);
    }

    function distance(a, b) {
      if (Math.abs(a.length - b.length) > 3) return 10;

      let previous = Array.from(
        { length: b.length + 1 },
        (_, i) => i
      );

      for (let i = 1; i <= a.length; i++) {
        const current = [i];

        for (let j = 1; j <= b.length; j++) {
          current[j] = Math.min(
            current[j - 1] + 1,
            previous[j] + 1,
            previous[j - 1] +
              (a[i - 1] === b[j - 1] ? 0 : 1)
          );
        }

        previous = current;
      }

      return previous[b.length];
    }

    function similarity(a, b) {
      const first = normalize(a);
      const second = normalize(b);

      if (!first || !second) return 0;
      if (first === second) return 100;

      if (canonical(first) === canonical(second)) {
        return 96;
      }

      if (
        first.includes(second) ||
        second.includes(first)
      ) {
        return 82;
      }

      const aa = importantWords(first);
      const bb = importantWords(second);

      if (!aa.length || !bb.length) return 0;

      let score = 0;

      for (const token of aa) {
        if (bb.some(word =>
          canonical(token) === canonical(word)
        )) {
          score += 1;
        } else if (bb.some(word =>
          word.length >= 4 &&
          token.length >= 4 &&
          distance(word, token) <= 2
        )) {
          score += .65;
        }
      }

      return Math.round(
        75 * score / Math.max(aa.length, bb.length)
      );
    }

    function getItems() {
      return app()?.getItems() || [];
    }

    function getHome() {
      return app()?.getHome() || null;
    }

    function allRooms() {
      const home = getHome();
      if (!home) return [];

      return home.floors.flatMap(floor =>
        floor.rooms.map(room => ({
          floor,
          room
        }))
      );
    }

    function roomOf(item) {
      return allRooms().find(
        entry => entry.room.id === item.roomId
      ) || null;
    }

    function findItems(query) {
      const text = clean(query);
      if (!text) return [];

      return getItems()
        .map(item => ({
          item,
          score: similarity(text, item.name)
        }))
        .filter(result => result.score >= 35)
        .sort((a, b) => b.score - a.score);
    }

    function findRooms(query) {
      const text = normalize(query);
      const home = getHome();

      if (!home || !text) return [];

      const floorMention = home.floors.find(floor =>
        text.includes(normalize(floor.name))
      );

      const matches = [];

      for (const { floor, room } of allRooms()) {
        if (
          floorMention &&
          floor.id !== floorMention.id
        ) {
          continue;
        }

        const possible = [
          room.name,
          ...(roomAliases[room.type] || [])
        ];

        let score = 0;

        for (const name of possible) {
          const target = normalize(name);

          if (
            text === target ||
            (" " + text + " ").includes(
              " " + target + " "
            )
          ) {
            score = Math.max(score, 100);
          } else if (
            text.length <= 35 &&
            similarity(text, target) >= 70
          ) {
            score = Math.max(score, 70);
          }
        }

        if (score > 0) {
          matches.push({ floor, room, score });
        }
      }

      return matches.sort((a, b) => b.score - a.score);
    }

    function location(item) {
      const currentApp = app();

      if (!currentApp) return "an unknown location";

      if (typeof currentApp.displayLocation === "function") {
        return currentApp.displayLocation(
          item,
          currentApp.getHome()
        );
      }

      const found = roomOf(item);

      return found
        ? found.floor.name + ", " +
          found.room.name + ", " +
          (item.place || "unspecified spot")
        : item.location || item.place || "unassigned";
    }

    function message(text, sender = "bot") {
      const element = document.createElement("div");
      element.className =
        "qv-message " +
        (sender === "user" ? "qv-user" : "qv-bot");

      element.textContent = String(text);
      messages.appendChild(element);
      messages.scrollTop = messages.scrollHeight;

      memory.history.push({
        sender,
        text: String(text)
      });

      if (memory.history.length > 40) {
        memory.history.shift();
      }
    }

    function say(text) {
      message(text);

      if (!speakingMode) return;
      if (!("speechSynthesis" in window)) return;

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;

      speechSynthesis.speak(utterance);
    }

    function setPending(data) {
      memory.pending = data;
    }

    function rememberItem(item) {
      memory.lastItem = item.id;

      const found = roomOf(item);

      if (found) {
        memory.lastRoom = found.room.id;
        memory.lastFloor = found.floor.id;
      }
    }

    function getRememberedItem() {
      return getItems().find(
        item => item.id === memory.lastItem
      ) || null;
    }

    function yes(text) {
      return /^(yes|yeah|yep|sure|ok|okay|correct|confirm|do it|save it|absolutely|of course)$/i
        .test(normalize(text));
    }

    function no(text) {
      return /^(no|nope|cancel|stop|nevermind|never mind|dont|do not)$/i
        .test(normalize(text));
    }

    function categoryFor(name) {
      const text = normalize(name);

      if (/key/.test(text)) return "Keys";

      if (
        /phone|laptop|computer|tablet|charger|headphone|airpod|camera/.test(text)
      ) {
        return "Electronics";
      }

      if (/book|notebook/.test(text)) return "Books";

      if (
        /shoe|shirt|coat|jacket|dress|pant|hoodie/.test(text)
      ) {
        return "Clothing";
      }

      if (
        /bag|wallet|watch|glasse|purse/.test(text)
      ) {
        return "Accessories";
      }

      return "Other";
    }

    function resolveItem(query, next) {
      let matches = findItems(query);

      if (!matches.length) {
        if (
          /^(it|that|this|the same one|that one)$/i
            .test(normalize(query))
        ) {
          const remembered = getRememberedItem();

          if (remembered) {
            next(remembered);
            return;
          }
        }

        say(
          "I couldn't identify that item in your collection. " +
          "Could you tell me its name?"
        );

        return;
      }

      const top = matches[0];

      const close = matches.filter(result =>
        result.score >= top.score - 8
      );

      if (close.length > 1) {
        memory.matches = close.slice(0, 6).map(x => x.item);

        setPending({
          type: "choose-item",
          next
        });

        say(
          "I found several possible matches: " +
          memory.matches.map(
            (item, index) =>
              (index + 1) + ". " +
              item.name + " (" + location(item) + ")"
          ).join("; ") +
          ". Which one do you mean?"
        );

        return;
      }

      rememberItem(top.item);
      next(top.item);
    }

    function resolveRoom(text, next) {
      const matches = findRooms(text);

      if (!matches.length) {
        say(
          "I couldn't identify that room. " +
          "Please use a room name from My Home."
        );
        return;
      }

      if (matches.length > 1) {
        const best = matches[0].score;

        const close = matches.filter(
          entry => entry.score >= best - 5
        );

        if (close.length > 1) {
          memory.matches = close.slice(0, 8);

          setPending({
            type: "choose-room",
            next
          });

          say(
            "There is more than one matching room: " +
            memory.matches.map(
              (entry, index) =>
                (index + 1) + ". " +
                entry.floor.name + " — " +
                entry.room.name
            ).join("; ") +
            ". Which one?"
          );

          return;
        }
      }

      memory.lastRoom = matches[0].room.id;
      memory.lastFloor = matches[0].floor.id;

      next(matches[0]);
    }

    function chooseMatch(text, choices, label) {
      const number = parseInt(normalize(text), 10);

      if (
        Number.isInteger(number) &&
        number >= 1 &&
        number <= choices.length
      ) {
        return choices[number - 1];
      }

      const scored = choices.map(choice => ({
        choice,
        score: similarity(text, label(choice))
      })).sort((a, b) => b.score - a.score);

      if (scored[0]?.score >= 70) {
        return scored[0].choice;
      }

      return null;
    }

    function addItem() {
      setPending({
        type: "add-name"
      });

      say("Sure! What would you like to save?");
    }

    function addWithName(name) {
      const itemName = clean(name);

      if (!itemName) {
        addItem();
        return;
      }

      setPending({
        type: "add-room",
        name: itemName
      });

      say(
        "Got it. Where did you put your " +
        itemName + "? Tell me the room."
      );
    }

    function moveItem(item) {
      rememberItem(item);

      setPending({
        type: "move-room",
        item
      });

      say(
        "Where would you like to move " +
        item.name + "? Tell me the room."
      );
    }

    function deleteItem(item) {
      rememberItem(item);

      setPending({
        type: "delete-confirm",
        item
      });

      say(
        "Are you sure you want to delete " +
        item.name +
        " from your saved collection? " +
        "Please say yes or no."
      );
    }

    function saveNewItem(data) {
      const currentApp = app();

      if (
        !currentApp ||
        typeof currentApp.addItem !== "function"
      ) {
        say("The item database is not available.");
        return;
      }

      const success = currentApp.addItem({
        name: data.name,
        category: categoryFor(data.name),
        roomId: data.roomId,
        place: data.place,
        notes: "Saved with FIND IT Smart Assistant"
      });

      say(
        success
          ? "Saved successfully! " +
            data.name +
            " is now available in Dashboard and My Home."
          : "Sorry, I couldn't save the item."
      );
    }

    function saveMovedItem(data) {
      const currentApp = app();

      if (
        !currentApp ||
        typeof currentApp.saveItems !== "function"
      ) {
        say("I couldn't access your saved items.");
        return;
      }

      const items = getItems().map(item =>
        item.id === data.item.id
          ? {
              ...item,
              roomId: data.roomId,
              place: data.place,
              location: ""
            }
          : item
      );

      const success = currentApp.saveItems(items);

      if (success) {
        memory.lastItem = data.item.id;
      }

      say(
        success
          ? "Done! I've updated the saved location of " +
            data.item.name + "."
          : "I couldn't update the location."
      );
    }

    function processPending(text) {
      const pending = memory.pending;

      if (!pending) return false;

      if (no(text)) {
        memory.pending = null;
        memory.matches = [];
        say("Okay, cancelled. What else can I help with?");
        return true;
      }

      if (pending.type === "choose-item") {
        const chosen = chooseMatch(
          text,
          memory.matches,
          item => item.name
        );

        if (!chosen) {
          say("Please choose the item number or name.");
          return true;
        }

        const next = pending.next;

        memory.pending = null;
        memory.matches = [];

        rememberItem(chosen);
        next(chosen);

        return true;
      }

      if (pending.type === "choose-room") {
        const chosen = chooseMatch(
          text,
          memory.matches,
          entry =>
            entry.floor.name + " " + entry.room.name
        );

        if (!chosen) {
          say("Please choose the room number or name.");
          return true;
        }

        const next = pending.next;

        memory.pending = null;
        memory.matches = [];

        memory.lastRoom = chosen.room.id;
        memory.lastFloor = chosen.floor.id;

        next(chosen);
        return true;
      }

      if (pending.type === "add-name") {
        memory.pending = null;
        addWithName(text);
        return true;
      }

      if (
        pending.type === "add-room" ||
        pending.type === "move-room"
      ) {
        const old = pending;

        memory.pending = null;

        resolveRoom(text, selected => {
          setPending({
            ...old,
            type:
              old.type === "add-room"
                ? "add-place"
                : "move-place",
            roomId: selected.room.id
          });

          say(
            "Where exactly in " +
            selected.room.name +
            " is it? For example, inside the top drawer."
          );
        });

        if (!memory.pending) {
          memory.pending = old;
        }

        return true;
      }

      if (
        pending.type === "add-place" ||
        pending.type === "move-place"
      ) {
        const exactPlace = clean(text);

        if (!exactPlace) {
          say("Please tell me the exact location.");
          return true;
        }

        const isAdding = pending.type === "add-place";

        setPending({
          ...pending,
          type: isAdding
            ? "add-confirm"
            : "move-confirm",
          place: exactPlace
        });

        say(
          "Just to confirm: " +
          (isAdding ? pending.name : pending.item.name) +
          " is at " + exactPlace +
          ". Should I save this location?"
        );

        return true;
      }

      if (
        pending.type === "add-confirm" ||
        pending.type === "move-confirm"
      ) {
        if (!yes(text)) {
          say("Please answer yes or no.");
          return true;
        }

        memory.pending = null;

        if (pending.type === "add-confirm") {
          saveNewItem(pending);
        } else {
          saveMovedItem(pending);
        }

        return true;
      }

      if (pending.type === "delete-confirm") {
        if (!yes(text)) {
          say("Please answer yes or no.");
          return true;
        }

        memory.pending = null;

        const currentApp = app();

        if (
          !currentApp ||
          typeof currentApp.saveItems !== "function"
        ) {
          say("The item database is unavailable.");
          return true;
        }

        const success = currentApp.saveItems(
          getItems().filter(
            item => item.id !== pending.item.id
          )
        );

        if (success && memory.lastItem === pending.item.id) {
          memory.lastItem = null;
        }

        say(
          success
            ? pending.item.name + " has been deleted."
            : "I couldn't delete that item."
        );

        return true;
      }

      return false;
    }

    function showItem(item) {
      rememberItem(item);
      memory.lastIntent = "find";

      say(
        "I found it! " +
        item.name +
        " was last saved at " +
        location(item) +
        "."
      );
    }

    function listItems(query = "") {
      const items = getItems();
      const home = getHome();

      if (!home) {
        say("I can't access your home data right now.");
        return;
      }

      let selected = items;
      let description = "your collection";

      const floor = home.floors.find(entry =>
        normalize(query).includes(normalize(entry.name))
      );

      const roomMatches = findRooms(query);

      if (roomMatches.length && !floor) {
        const roomIds = new Set(
          roomMatches.map(entry => entry.room.id)
        );

        selected = items.filter(item =>
          roomIds.has(item.roomId)
        );

        description = roomMatches.length === 1
          ? roomMatches[0].room.name
          : "matching rooms";
      } else if (floor) {
        const ids = new Set(
          floor.rooms.map(room => room.id)
        );

        selected = items.filter(item =>
          ids.has(item.roomId)
        );

        description = floor.name;
      }

      if (!selected.length) {
        say("There are no saved items in " + description + ".");
        return;
      }

      const limit = 12;

      const names = selected.slice(0, limit).map(
        item => item.name
      );

      say(
        "I found " +
        selected.length +
        " saved item" +
        (selected.length === 1 ? "" : "s") +
        " in " + description +
        ": " + names.join(", ") +
        (selected.length > limit
          ? ", and " + (selected.length - limit) + " more."
          : ".")
      );
    }

    function statistics() {
      const home = getHome();

      if (!home) {
        say("Your home data is unavailable.");
        return;
      }

      const items = getItems();

      const rooms = home.floors.reduce(
        (sum, floor) => sum + floor.rooms.length,
        0
      );

      const categories = new Set(
        items.map(item => item.category)
      ).size;

      say(
        "Here's your FIND IT summary: " +
        items.length + " saved items, " +
        categories + " categories, " +
        rooms + " rooms and " +
        home.floors.length + " floors."
      );
    }

    function describeHome() {
      const home = getHome();

      if (!home) {
        say("Your 3D home is not available.");
        return;
      }

      const summary = home.floors.map(floor =>
        floor.name + " has " +
        floor.rooms.length + " rooms: " +
        floor.rooms.map(room => room.name).join(", ")
      );

      say("Your home is organized as follows: " +
        summary.join(". ") + ".");
    }

    function explainCapabilities() {
      say(
        "I can search your belongings, recognize similar item names, " +
        "list items by room or floor, add new items, update saved " +
        "locations, delete items with confirmation, describe " +
        "your home, and answer follow-up questions about " +
        "items we've discussed. You can speak naturally in English."
      );
    }

    function extractItemName(text) {
      return clean(text)
        .replace(/^(please\s+)?/i, "")
        .replace(/^(can you|could you|would you)\s+/i, "")
        .replace(/^(help me|i want to|i need to)\s+/i, "")
        .replace(/^(find|locate|search for|look for|look up|track down)\s+/i, "")
        .replace(/^(where is|where are|wheres|where did i put)\s+/i, "")
        .replace(/^(i lost|i misplaced|i cant find|i cannot find)\s+/i, "")
        .replace(/^(my|the|a|an)\s+/i, "")
        .replace(/[?.!]+$/g, "")
        .trim();
    }

    function extractAddName(text) {
      return clean(text)
        .replace(/^(please\s+)?/i, "")
        .replace(/^(can you|could you|would you)\s+/i, "")
        .replace(/^(help me|i want to|i need to)\s+/i, "")
        .replace(/^(add|save|store|register|record|remember)\s+/i, "")
        .replace(/^(my|the|a|an)\s+/i, "")
        .replace(/\s+(to|in|at|inside|on)\s+.*$/i, "")
        .replace(/[?.!]+$/g, "")
        .trim();
    }

    function intent(text) {
      const value = normalize(text);

      if (
        /^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(value)
      ) {
        return "greeting";
      }

      if (
        /^(thank you|thanks|thx)\b/.test(value)
      ) {
        return "thanks";
      }

      if (
        /\b(help|what can you do|how do you work|who are you)\b/.test(value)
      ) {
        return "help";
      }

      if (
        /\b(how many|statistics|summary|total|count)\b/.test(value)
      ) {
        return "statistics";
      }

      if (
        /\b(delete|remove|erase|forget)\b/.test(value) &&
        /\b(item|items|my|the|from|saved|collection)\b/.test(value)
      ) {
        return "delete";
      }

      if (
        /\b(move|moved|relocate|relocated|change the location|update the location|new location|different place)\b/.test(value)
      ) {
        return "move";
      }

      if (
        /\b(add|save|store|register|record|remember)\b/.test(value) &&
        !/\b(where|location of|whereabouts)\b/.test(value)
      ) {
        return "add";
      }

      if (
        /\b(list|show|display|which|what items|what things|everything)\b/.test(value) &&
        /\b(items|things|belongings|saved|room|floor|bedroom|kitchen|garage|office)\b/.test(value)
      ) {
        return "list";
      }

      if (
        /\b(describe my home|how is my home|how many floors|what rooms|house layout)\b/.test(value)
      ) {
        return "home";
      }

      if (
        /\b(where|find|locate|search|lost|misplaced|look for|remember where|last saw|last put|left my|left the|keep my|kept my|put my|put the)\b/.test(value)
      ) {
        return "find";
      }

      if (
        /^(and|what about|how about|where about)\b/.test(value)
      ) {
        return "followup";
      }

      if (
        /\b(it|that one|this one|the same item)\b/.test(value) &&
        memory.lastItem
      ) {
        return "followup";
      }

      return "unknown";
    }

    function answerFind(text) {
      let query = extractItemName(text);

      query = query
        .replace(/^(do you know|can you tell me|could you tell me)\s+/i, "")
        .replace(/^(where|what|which)\s+/i, "")
        .replace(/^(i think|i believe)\s+/i, "")
        .replace(/\b(might be|could be|is located|are located|is kept|are kept)\b/gi, "")
        .replace(/\b(somewhere|probably|please|anywhere|around here)\b/gi, "")
        .replace(/\b(where i left|where i put|where i kept|last location|location)\b/gi, "")
        .trim();

      const results = findItems(query);

      if (
        /^(it|that|this|there|that one|the same one)$/i.test(normalize(query))
      ) {
        const previous = getRememberedItem();

        if (previous) {
          showItem(previous);
          return;
        }
      }

      if (results.length) {
        resolveItem(query, showItem);
        return;
      }

      const all = getItems();

      if (!all.length) {
        say(
          "You haven't saved any belongings yet. " +
          "Would you like to add your first item?"
        );

        setPending({ type: "add-name" });
        return;
      }

      say(
        "I couldn't find a saved item matching that description. " +
        "Could you tell me its exact name or describe it differently?"
      );

      setPending({
        type: "find-clarify"
      });
    }

    function handleUnknown(text) {
      const matches = findItems(text);

      if (matches.length && matches[0].score >= 75) {
        resolveItem(text, showItem);
        return;
      }

      if (
        /\b(lost|missing|cant find|cannot find)\b/i.test(text)
      ) {
        say(
          "I can help you look through your saved belongings. " +
          "What are you trying to find?"
        );

        setPending({ type: "find-clarify" });
        return;
      }

      if (
        /\b(dashboard|open dashboard)\b/i.test(text)
      ) {
        window.location.href = "dashboard.html";
        return;
      }

      if (
        /\b(open my home|show my home|open house)\b/i.test(text)
      ) {
        window.location.href = "myhome.html";
        return;
      }

      say(
        "I understand questions about your belongings and your home. " +
        "Could you rephrase that or tell me which item you're referring to? " +
        "For example, you can ask where something is, what is in a room, " +
        "or tell me that you moved an item."
      );
    }

    function process(text) {
      const raw = clean(text);

      if (!raw) return;

      message(raw, "user");

      if (memory.pending?.type === "find-clarify") {
        memory.pending = null;
        resolveItem(raw, showItem);
        return;
      }

      if (memory.pending && processPending(raw)) {
        return;
      }

      const type = intent(raw);
      memory.lastIntent = type;

      if (type === "greeting") {
        say(
          "Hey! Great to see you. What are we looking for today?"
        );
        return;
      }

      if (type === "thanks") {
        say(
          "You're welcome! Happy to help you stay organized."
        );
        return;
      }

      if (type === "help") {
        explainCapabilities();
        return;
      }

      if (type === "statistics") {
        statistics();
        return;
      }

      if (type === "home") {
        describeHome();
        return;
      }

      if (type === "list") {
        listItems(raw);
        return;
      }

      if (type === "add") {
        const name = extractAddName(raw);

        if (
          !name ||
          /^(item|something|thing|new item)$/i.test(name)
        ) {
          addItem();
        } else {
          addWithName(name);
        }

        return;
      }

      if (type === "move") {
        const name = raw
          .replace(/^(please|can you|could you|i|ive|i have|i just)\s+/i, "")
          .replace(/^(move|moved|relocate|relocated|change|update)\s+/i, "")
          .replace(/^(the location of|the location for)\s+/i, "")
          .replace(/^(my|the)\s+/i, "")
          .replace(/\s+(to|into|in|from)\s+.*$/i, "")
          .trim();

        if (
          /^(it|that|this|that one)$/i.test(name)
        ) {
          const previous = getRememberedItem();

          if (previous) {
            moveItem(previous);
            return;
          }
        }

        resolveItem(name, moveItem);
        return;
      }

      if (type === "delete") {
        const name = raw
          .replace(/^(please\s+)?/i, "")
          .replace(/^(delete|remove|erase|forget)\s+/i, "")
          .replace(/^(my|the|saved)\s+/i, "")
          .replace(/\s+from\s+.*$/i, "")
          .trim();

        if (
          /^(it|that|this|that one)$/i.test(name)
        ) {
          const previous = getRememberedItem();

          if (previous) {
            deleteItem(previous);
            return;
          }
        }

        resolveItem(name, deleteItem);
        return;
      }

      if (type === "find") {
        answerFind(raw);
        return;
      }

      if (type === "followup") {
        const name = raw
          .replace(/^(and|what about|how about|where about)\s+/i, "")
          .replace(/[?.!]+$/g, "")
          .trim();

        if (
          /^(it|that|this|there|that one|the same one)$/i.test(name)
        ) {
          const previous = getRememberedItem();

          if (previous) {
            showItem(previous);
            return;
          }
        }

        resolveItem(name, showItem);
        return;
      }

      handleUnknown(raw);
    }

    $("qvForm").addEventListener("submit", event => {
      event.preventDefault();

      const text = input.value.trim();

      if (!text) return;

      input.value = "";
      process(text);
    });

    $("qvFind").addEventListener("click", () => {
      input.value = "Where did I put my ";
      input.focus();
    });

    $("qvAdd").addEventListener("click", () => {
      addItem();
      input.focus();
    });

    $("qvStats").addEventListener("click", statistics);

    function openPanel() {
      panel.hidden = false;
      floatButton.setAttribute("aria-expanded", "true");

      if (!initialized) {
        initialized = true;

        message(
          "Hey there! I'm FIND IT Smart Assistant. " +
          "Tell me what you're looking for, ask about a room, " +
          "or let me help you organize your belongings."
        );
      }

      input.focus();
    }

    function closePanel() {
      panel.hidden = true;
      floatButton.setAttribute("aria-expanded", "false");

      if (recognition) {
        try {
          recognition.abort();
        } catch {}
      }

      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
      }

      status.textContent = "ONLINE · READY";
      micButton.classList.remove("qv-listening");
      speakingMode = false;
    }

    floatButton.addEventListener("click", () => {
      if (panel.hidden) openPanel();
      else closePanel();
    });

    $("qvClose").addEventListener("click", closePanel);

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !panel.hidden) {
        closePanel();
      }
    });

    const homeButton =
      document.getElementById("openChatbotFromHome");

    if (homeButton) {
      homeButton.addEventListener("click", openPanel);
    }

    micButton.addEventListener("click", () => {
      if (!SpeechRecognition) {
        say(
          "Voice recognition isn't supported in this browser. " +
          "You can still talk to me by typing."
        );
        return;
      }

      if (recognition) {
        recognition.abort();
        recognition = null;
        speakingMode = false;
        micButton.classList.remove("qv-listening");
        status.textContent = "ONLINE · READY";
        return;
      }

      const current = new SpeechRecognition();

      recognition = current;
      speakingMode = true;

      current.lang = "en-US";
      current.continuous = false;
      current.interimResults = false;

      current.onstart = () => {
        if (recognition !== current) return;

        status.textContent = "LISTENING...";
        micButton.classList.add("qv-listening");
      };

      current.onresult = event => {
        if (recognition !== current) return;

        const result = event.results[0]?.[0];

        if (result?.transcript) {
          process(result.transcript);
        }
      };

      current.onerror = event => {
        if (recognition !== current) return;

        if (event.error === "network") {
          message(
            "Voice recognition couldn't connect to the speech service. " +
            "You can continue chatting by typing."
          );
        } else if (event.error === "not-allowed") {
          message(
            "Please allow microphone access in your browser."
          );
        } else if (event.error !== "no-speech" &&
                   event.error !== "aborted") {
          message(
            "Voice recognition is unavailable right now."
          );
        }
      };

      current.onend = () => {
        if (recognition !== current) return;

        recognition = null;
        speakingMode = false;

        micButton.classList.remove("qv-listening");
        status.textContent = "ONLINE · READY";
      };

      try {
        current.start();
      } catch {
        recognition = null;
        speakingMode = false;
        message("Couldn't start the microphone.");
      }
    });

    console.log("FIND IT Smart Assistant 2.0 loaded");
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );
  } else {
    initialize();
  }
})();
