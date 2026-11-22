
document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  const page = document.body.dataset.page || "home";

  const ACCOUNTS = "findit-accounts-v3";
  const SESSION = "findit-session-v3";
  const ITEMS = "findit-shared-items-v1:";
  const HOMES = "findit-shared-homes-v1:";
  const OLD_HOME = "findit-multifloor-studio-v1";
  const OLD_DASH = "findit-items-v2:";

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  function id() {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) +
      Math.random().toString(36).slice(2);
  }

  const clean = value => String(value || "").trim();

  let accounts = read(ACCOUNTS, []);
  if (!Array.isArray(accounts)) accounts = [];

  const session = read(SESSION, null);
  let user = session
    ? accounts.find(account => account.id === session.id) || null
    : null;

  const owner = () => user ? user.id : "guest";
  const keyItems = () => ITEMS + owner();
  const keyHome = () => HOMES + owner();

  const rooms = {
    living: "Living Room",
    bedroom: "Bedroom",
    kitchen: "Kitchen",
    bathroom: "Bathroom",
    garage: "Garage",
    storage: "Storage",
    office: "Office",
    game: "Game Room",
    gym: "Gym",
    laundry: "Laundry",
    dining: "Dining Room",
    custom: "Custom Room"
  };

  function makeRoom(type, name) {
    return {
      id: id(),
      type,
      name: name || rooms[type] || "Room"
    };
  }

  function makeFloor(level, name, types) {
    return {
      id: id(),
      level,
      name,
      rooms: types.map(type => makeRoom(type))
    };
  }

  function defaultHome() {
    const floors = [
      makeFloor(0, "Ground Floor", [
        "living",
        "kitchen",
        "bathroom"
      ]),
      makeFloor(1, "First Floor", [
        "bedroom",
        "bedroom",
        "office"
      ])
    ];

    return {
      floors,
      activeFloor: floors[0].id
    };
  }

  function currentHome() {
    const home = read(keyHome(), null);

    return home &&
      Array.isArray(home.floors) &&
      home.floors.length
      ? home
      : defaultHome();
  }

  function currentItems() {
    const items = read(keyItems(), []);
    return Array.isArray(items) ? items : [];
  }

  function roomFor(home, roomId) {
    for (const floor of home.floors) {
      const room = floor.rooms.find(entry => entry.id === roomId);
      if (room) return { floor, room };
    }

    return null;
  }

  function displayLocation(item, home) {
    const found = roomFor(home, item.roomId);

    return found
      ? found.floor.name + " · " +
        found.room.name + " · " +
        (item.place || "")
      : item.location || item.place || "Unassigned";
  }

  function broadcast() {
    window.dispatchEvent(new Event("findit:items-changed"));
  }

  function saveItems(items) {
    if (!write(keyItems(), items)) return false;
    broadcast();
    return true;
  }

  function saveHome(home) {
    if (!write(keyHome(), home)) return false;
    broadcast();
    return true;
  }

  function migrate() {
    if (read(keyItems(), null) !== null) return;

    const oldItems = read(
      OLD_DASH + (user ? user.email.toLowerCase() : "guest"),
      []
    );

    const oldHome = read(OLD_HOME, null);
    let home = currentHome();
    const combined = [];

    if (Array.isArray(oldItems)) {
      for (const item of oldItems) {
        if (!item || !item.name) continue;

        combined.push({
          id: item.id || id(),
          name: item.name,
          category: item.category || "Other",
          roomId: item.roomId || "",
          place: item.place || item.location || "",
          location: item.location || "",
          notes: item.notes || ""
        });
      }
    }

    if (
      oldHome &&
      Array.isArray(oldHome.floors) &&
      oldHome.floors.length &&
      Array.isArray(oldHome.items)
    ) {
      home = {
        floors: oldHome.floors,
        activeFloor: oldHome.activeFloor || oldHome.floors[0].id
      };

      for (const item of oldHome.items) {
        if (!item || !item.name) continue;

        const found = combined.find(entry => entry.id === item.id);

        const updated = {
          id: item.id || id(),
          name: item.name,
          category: item.category || "Other",
          roomId: item.roomId || "",
          place: item.place || "",
          notes: item.notes || ""
        };

        if (found) Object.assign(found, updated);
        else combined.push(updated);
      }
    }

    write(keyHome(), home);
    write(keyItems(), combined);
  }

  migrate();

  const navigation = [
    ["home", "Home", "index.html"],
    ["how", "How It Works", "how.html"],
    ["dashboard", "Dashboard", "dashboard.html"],
    ["myhome", "My Home", "myhome.html"],
    ["features", "Features", "features.html"],
    ["about", "About", "about.html"]
  ];

  function createNavbar() {
    if (!$("site-header")) return;

    $("site-header").innerHTML = `
      <nav class="navbar navbar-expand-lg fixed-top site-nav" data-bs-theme="dark">
        <div class="container">
          <a href="index.html" class="navbar-brand">
            🔍 FIND <span>IT.</span>
          </a>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#siteMenu"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="siteMenu">
            <ul class="navbar-nav mx-auto gap-lg-2">
              ${navigation.map(([name, label, link]) => `
                <li class="nav-item">
                  <a
                    class="nav-link ${page === name ? "active" : ""}"
                    href="${link}"
                  >
                    ${label}
                  </a>
                </li>
              `).join("")}
            </ul>

            <div
              id="guestActions"
              class="guest-actions d-flex gap-2 my-3 my-lg-0"
            >
              <button
                class="btn btn-outline-soft"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
              >
                Log In
              </button>

              <button
                class="btn btn-glow"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#signupModal"
              >
                Sign Up
              </button>
            </div>

            <div
              id="userActions"
              class="user-actions dropdown my-3 my-lg-0"
              hidden
            >
              <button
                class="avatar-button dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-label="Account"
              >
                <span id="avatarLetter">U</span>
                <img id="avatarImage" alt="Profile photo" hidden>
              </button>

              <div class="dropdown-menu dropdown-menu-end account-menu">
                <div class="account-profile-header">
                  <strong id="accountName"></strong>
                  <span id="accountUsername"></span>
                  <small id="accountEmail"></small>
                </div>

                <div class="dropdown-divider"></div>

                <a class="dropdown-item" href="dashboard.html">
                  📦 Dashboard
                </a>

                <a class="dropdown-item" href="myhome.html">
                  🏡 My Home
                </a>

                <button
                  id="logoutBtn"
                  type="button"
                  class="dropdown-item"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  function createFooter() {
    if (!$("site-footer")) return;

    $("site-footer").innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <strong>🔍 FIND <span>IT.</span></strong>
          <p>Less searching. More living.</p>

          <div class="footer-links">
            ${navigation.map(([, name, link]) => `
              <a href="${link}">${name}</a>
            `).join("")}
          </div>

          <hr>
          <small>© 2026 FIND IT</small>
        </div>
      </footer>
    `;
  }

  function createAuth() {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="modal fade" id="signupModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content findit-modal">
            <div class="modal-header">
              <h2 class="modal-title h4">✨ Create Account</h2>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <form id="signupForm" class="form-stack">
                <label for="signupPhoto">📷 Profile Photo</label>
                <input
                  id="signupPhoto"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                >
                <img
                  id="signupPhotoPreview"
                  class="fi-account-preview"
                  alt="Preview"
                  hidden
                >

                <label for="signupName">Full Name</label>
                <input id="signupName" required maxlength="60">

                <label for="signupUsername">Username</label>
                <input
                  id="signupUsername"
                  required
                  minlength="3"
                  maxlength="20"
                  pattern="[A-Za-z0-9_]+"
                >

                <label for="signupEmail">Email</label>
                <input id="signupEmail" type="email" required>

                <label for="signupPassword">Password</label>
                <input
                  id="signupPassword"
                  type="password"
                  minlength="8"
                  required
                >

                <label for="signupConfirm">Confirm Password</label>
                <input
                  id="signupConfirm"
                  type="password"
                  minlength="8"
                  required
                >

                <label>
                  <input id="signupShow" type="checkbox">
                  Show Password
                </label>

                <p id="signupError" class="error-text"></p>

                <button class="btn btn-glow full" type="submit">
                  Create Account
                </button>
              </form>

              <p class="auth-switch">
                Already registered?
                <button id="switchToLogin" type="button">
                  Log In
                </button>
              </p>

              <small class="muted">
                Local demo accounts only.
              </small>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="loginModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content findit-modal">
            <div class="modal-header">
              <h2 class="modal-title h4">🔐 Log In</h2>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <form id="loginForm" class="form-stack">
                <label for="loginIdentifier">
                  Username or Email
                </label>
                <input id="loginIdentifier" required>

                <label for="loginPassword">
                  Password
                </label>
                <input
                  id="loginPassword"
                  type="password"
                  required
                >

                <label>
                  <input id="loginShow" type="checkbox">
                  Show Password
                </label>

                <p id="loginError" class="error-text"></p>

                <button class="btn btn-glow full" type="submit">
                  Log In
                </button>
              </form>

              <p class="auth-switch">
                New user?
                <button id="switchToSignup" type="button">
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  createNavbar();
  createFooter();
  createAuth();

  function getModal(name) {
    if (!window.bootstrap) return null;
    return bootstrap.Modal.getOrCreateInstance($(name));
  }

  function switchModal(first, second) {
    if (!getModal(first)) return;

    const element = $(first);

    function openNext() {
      element.removeEventListener("hidden.bs.modal", openNext);
      getModal(second).show();
    }

    element.addEventListener("hidden.bs.modal", openNext);
    getModal(first).hide();
  }

  $("switchToLogin").onclick = () =>
    switchModal("signupModal", "loginModal");

  $("switchToSignup").onclick = () =>
    switchModal("loginModal", "signupModal");

  $("signupShow").onchange = () => {
    const type = $("signupShow").checked ? "text" : "password";
    $("signupPassword").type = type;
    $("signupConfirm").type = type;
  };

  $("loginShow").onchange = () => {
    $("loginPassword").type =
      $("loginShow").checked ? "text" : "password";
  };

  function updateAccountUI() {
    $("guestActions").hidden = Boolean(user);
    $("userActions").hidden = !user;

    if (!user) return;

    $("accountName").textContent = user.name;
    $("accountUsername").textContent = "@" + user.username;
    $("accountEmail").textContent = user.email;

    $("avatarLetter").textContent =
      user.name.charAt(0).toUpperCase() || "U";

    $("avatarImage").hidden = !user.photo;
    $("avatarLetter").hidden = Boolean(user.photo);

    if (user.photo) {
      $("avatarImage").src = user.photo;
    }
  }

  async function hashPassword(password, salt) {
    if (!window.crypto || !crypto.subtle) {
      throw Error("Please open FIND IT using Live Server.");
    }

    const encoded = new TextEncoder().encode(
      salt + ":" + password
    );

    const result = await crypto.subtle.digest(
      "SHA-256",
      encoded
    );

    return Array.from(new Uint8Array(result))
      .map(value => value.toString(16).padStart(2, "0"))
      .join("");
  }

  function createSalt() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    return Array.from(bytes)
      .map(value => value.toString(16).padStart(2, "0"))
      .join("");
  }

  function processPhoto(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve("");
        return;
      }

      if (
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 2000000
      ) {
        reject(Error("Choose an image smaller than 2 MB."));
        return;
      }

      const reader = new FileReader();

      reader.onerror = () => reject(Error("Photo error"));

      reader.onload = () => {
        const image = new Image();

        image.onerror = () =>
          reject(Error("Invalid image"));

        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 160;
          canvas.height = 160;

          const context = canvas.getContext("2d");
          const size = Math.min(image.width, image.height);

          context.drawImage(
            image,
            (image.width - size) / 2,
            (image.height - size) / 2,
            size,
            size,
            0,
            0,
            160,
            160
          );

          resolve(canvas.toDataURL("image/jpeg", 0.75));
        };

        image.src = reader.result;
      };

      reader.readAsDataURL(file);
    });
  }

  $("signupPhoto").onchange = async () => {
    try {
      const photo = await processPhoto(
        $("signupPhoto").files[0]
      );

      $("signupPhotoPreview").hidden = !photo;

      if (photo) {
        $("signupPhotoPreview").src = photo;
      }

      $("signupError").textContent = "";
    } catch (error) {
      $("signupError").textContent = error.message;
      $("signupPhoto").value = "";
    }
  };

  $("signupForm").onsubmit = async event => {
    event.preventDefault();

    const name = clean($("signupName").value);
    const username = clean(
      $("signupUsername").value
    ).toLowerCase();

    const email = clean(
      $("signupEmail").value
    ).toLowerCase();

    const password = $("signupPassword").value;

    if (password !== $("signupConfirm").value) {
      $("signupError").textContent =
        "Passwords do not match.";
      return;
    }

    accounts = read(ACCOUNTS, []);

    if (accounts.some(account =>
      account.username === username ||
      account.email === email
    )) {
      $("signupError").textContent =
        "Username or email already used.";
      return;
    }

    try {
      const salt = createSalt();

      const passwordHash = await hashPassword(
        password,
        salt
      );

      const photo = await processPhoto(
        $("signupPhoto").files[0]
      );

      const newUser = {
        id: id(),
        name,
        username,
        email,
        photo,
        salt,
        passwordHash
      };

      if (!write(ACCOUNTS, [...accounts, newUser])) {
        throw Error("Cannot save account.");
      }

      accounts.push(newUser);
      user = newUser;

      write(SESSION, { id: user.id });

      updateAccountUI();
      migrate();
      refresh();

      getModal("signupModal")?.hide();
      $("signupForm").reset();
    } catch (error) {
      $("signupError").textContent = error.message;
    }
  };

  $("loginForm").onsubmit = async event => {
    event.preventDefault();

    const identifier = clean(
      $("loginIdentifier").value
    ).toLowerCase();

    const password = $("loginPassword").value;

    accounts = read(ACCOUNTS, []);

    const account = accounts.find(entry =>
      entry.email === identifier ||
      entry.username === identifier
    );

    try {
      if (!account) {
        throw Error("Incorrect username or password.");
      }

      const hash = await hashPassword(
        password,
        account.salt
      );

      if (hash !== account.passwordHash) {
        throw Error("Incorrect username or password.");
      }

      user = account;
      write(SESSION, { id: user.id });

      updateAccountUI();
      migrate();
      refresh();

      getModal("loginModal")?.hide();
      $("loginForm").reset();
    } catch (error) {
      $("loginError").textContent = error.message;
    }
  };

  $("logoutBtn").onclick = () => {
    user = null;
    localStorage.removeItem(SESSION);
    updateAccountUI();
    migrate();
    refresh();
  };

  updateAccountUI();

  function refresh() {
    renderDashboard();
    renderHome();
  }

  window.FindIt = {
    getItems: currentItems,
    getHome: currentHome,
    findRoom: roomFor,
    roomFor,
    displayLocation,
    saveItems,
    saveHome,
    refresh,

    addItem(item) {
      const items = currentItems();

      items.push({
        id: id(),
        ...item
      });

      return saveItems(items);
    },

    findItem(query) {
      const text = clean(query).toLowerCase();

      return currentItems().find(item =>
        item.name.toLowerCase().includes(text)
      ) || null;
    }
  };

  function fillOptions(select, entries, placeholder = "") {
    if (!select) return;

    const previous = select.value;

    select.replaceChildren();

    if (placeholder) {
      select.add(new Option(placeholder, ""));
    }

    entries.forEach(([value, label]) => {
      select.add(new Option(label, value));
    });

    if ([...select.options].some(
      option => option.value === previous
    )) {
      select.value = previous;
    }
  }

  function dashboardRooms() {
    if (!$("dashRoom")) return;

    const floor = currentHome().floors.find(
      entry => entry.id === $("dashFloor").value
    );

    fillOptions(
      $("dashRoom"),
      (floor?.rooms || []).map(room => [
        room.id,
        room.name
      ]),
      "Choose Room"
    );
  }

  function dashboardSelectors() {
    if (!$("dashFloor")) return;

    fillOptions(
      $("dashFloor"),
      currentHome().floors.map(floor => [
        floor.id,
        floor.name
      ]),
      "Choose Floor"
    );

    dashboardRooms();
  }

  if ($("dashFloor")) {
    $("dashFloor").onchange = dashboardRooms;
  }

  function resetDashboard() {
    if (!$("dashboardForm")) return;

    $("dashboardForm").reset();
    $("editItemId").value = "";
    $("itemFormTitle").textContent = "➕ Add an Item";
    $("dashSave").textContent = "💾 Save Item";
    $("dashCancel").hidden = true;

    dashboardSelectors();
  }

  function renderDashboard() {
    if (!$("dashboardItems")) return;

    dashboardSelectors();

    const items = currentItems();
    const home = currentHome();

    $("totalItems").textContent = items.length;
    $("totalCategories").textContent =
      new Set(items.map(item => item.category)).size;

    $("totalLocations").textContent =
      new Set(
        items.map(item => displayLocation(item, home))
      ).size;

    const search = clean(
      $("dashboardSearch").value
    ).toLowerCase();

    const category = $("dashboardFilter").value;

    const filtered = items.filter(item => {
      const categoryMatches =
        category === "all" ||
        item.category === category;

      const searchMatches = [
        item.name,
        item.category,
        displayLocation(item, home),
        item.notes
      ].some(value =>
        String(value || "")
          .toLowerCase()
          .includes(search)
      );

      return categoryMatches && searchMatches;
    });

    const container = $("dashboardItems");
    container.replaceChildren();

    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No items found.";
      container.append(empty);
    }

    filtered.forEach(item => {
      const card = document.createElement("article");
      card.className = "saved-item";

      const information = document.createElement("div");
      information.className = "saved-item-info";

      const title = document.createElement("strong");
      title.textContent = "📦 " + item.name;

      const categoryElement = document.createElement("small");
      categoryElement.textContent = "🗂️ " + item.category;

      const place = document.createElement("small");
      place.textContent =
        "📍 " + displayLocation(item, home);

      const notes = document.createElement("small");
      notes.textContent = item.notes || "";

      information.append(
        title,
        categoryElement,
        place,
        notes
      );

      const actions = document.createElement("div");
      actions.className = "item-actions";

      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "✏️ Edit";

      edit.onclick = () => {
        const found = roomFor(home, item.roomId);

        $("editItemId").value = item.id;
        $("dashName").value = item.name;
        $("dashCategory").value = item.category;
        $("dashLocation").value =
          item.place || item.location || "";
        $("dashNotes").value = item.notes || "";

        $("dashFloor").value = found?.floor.id || "";

        dashboardRooms();

        $("dashRoom").value = item.roomId || "";

        $("itemFormTitle").textContent = "✏️ Edit Item";
        $("dashSave").textContent = "💾 Save Changes";
        $("dashCancel").hidden = false;

        $("dashboardForm").scrollIntoView({
          behavior: "smooth"
        });
      };

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "🗑️";

      remove.onclick = () => {
        if (!confirm("Delete this item?")) return;

        saveItems(
          currentItems().filter(entry => entry.id !== item.id)
        );
      };

      actions.append(edit, remove);
      card.append(information, actions);
      container.append(card);
    });
  }

  if ($("dashboardForm")) {
    $("dashboardForm").onsubmit = event => {
      event.preventDefault();

      const name = clean($("dashName").value);
      const place = clean($("dashLocation").value);
      const roomId = $("dashRoom").value;

      if (!name || !place || !roomId) {
        $("dashboardStatus").textContent =
          "Please fill in the name, floor, room and exact location.";
        return;
      }

      const items = currentItems();

      const item = {
        id: $("editItemId").value || id(),
        name,
        category: $("dashCategory").value,
        roomId,
        place,
        notes: clean($("dashNotes").value)
      };

      const index = items.findIndex(
        entry => entry.id === item.id
      );

      if (index < 0) items.push(item);
      else items[index] = item;

      if (saveItems(items)) {
        $("dashboardStatus").textContent =
          "✅ Saved in Dashboard and My Home!";

        resetDashboard();
        renderDashboard();
      } else {
        $("dashboardStatus").textContent =
          "Browser storage error.";
      }
    };

    $("dashCancel").onclick = resetDashboard;
    $("dashboardSearch").oninput = renderDashboard;
    $("dashboardFilter").onchange = renderDashboard;

    renderDashboard();
  }

  if ($("howDemo")) {
    $("howDemo").onsubmit = event => {
      event.preventDefault();

      $("demoResult").textContent =
        "✅ " + clean($("demoName").value) +
        " was last saved at " +
        clean($("demoPlace").value);
    };
  }

  let selectedRoom = null;
  let view = "exterior";
  let draw3D = () => {};
  let moveCamera = () => {};

  function homeRoomOptions() {
    if (!$("itemRoom")) return;

    const floor = currentHome().floors.find(
      entry => entry.id === $("itemFloor").value
    );

    fillOptions(
      $("itemRoom"),
      (floor?.rooms || []).map(room => [
        room.id,
        room.name
      ])
    );
  }

  function renderHome() {
    if (!$("floorSelect")) return;

    const home = currentHome();

    fillOptions(
      $("floorSelect"),
      home.floors.map(floor => [
        floor.id,
        floor.name
      ])
    );

    const active = home.floors.some(
      floor => floor.id === home.activeFloor
    )
      ? home.activeFloor
      : home.floors[0].id;

    $("floorSelect").value = active;

    const selected = home.floors.find(
      floor => floor.id === active
    );

    $("floorName").value = selected.name;

    $("floorCount").textContent = home.floors.length;

    $("roomCount").textContent =
      home.floors.reduce(
        (total, floor) => total + floor.rooms.length,
        0
      );

    $("itemCount").textContent = currentItems().length;

    $("roomList").replaceChildren();

    selected.rooms.forEach(room => {
      const button = document.createElement("button");
      button.className = "room-row";
      button.type = "button";
      button.textContent = "🛋️ " + room.name;

      button.onclick = () => {
        selectedRoom = room.id;

        $("roomEditor").hidden = false;
        $("editRoomName").value = room.name;
        $("editRoomType").value = room.type;
      };

      $("roomList").append(button);
    });

    fillOptions(
      $("itemFloor"),
      home.floors.map(floor => [
        floor.id,
        floor.name
      ])
    );

    if (!$("itemFloor").value) {
      $("itemFloor").value = selected.id;
    }

    homeRoomOptions();

    const list = $("savedItems");
    list.replaceChildren();

    const search = clean(
      $("findInput").value
    ).toLowerCase();

    const shown = currentItems().filter(item =>
      item.name.toLowerCase().includes(search)
    );

    shown.forEach(item => {
      const card = document.createElement("div");
      card.className = "saved-item";

      const information = document.createElement("div");
      information.className = "saved-item-info";

      const title = document.createElement("strong");
      title.textContent = "📦 " + item.name;

      const description = document.createElement("small");
      description.textContent =
        "🗂️ " + item.category +
        " · 📍 " + displayLocation(item, home);

      information.append(title, description);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn outline";
      remove.textContent = "×";

      remove.onclick = () => {
        if (!confirm("Delete item?")) return;

        saveItems(
          currentItems().filter(entry => entry.id !== item.id)
        );
      };

      card.append(information, remove);
      list.append(card);
    });

    if (!shown.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No items found.";
      list.append(empty);
    }

    draw3D();
  }

  function changeHome(callback) {
    const home = currentHome();
    callback(home);
    saveHome(home);
    renderHome();
  }

  if ($("floorSelect")) {
    $("floorSelect").onchange = () => {
      changeHome(home => {
        home.activeFloor = $("floorSelect").value;
      });
    };

    $("addFloor").onclick = () => {
      const home = currentHome();

      if (home.floors.length >= 6) {
        alert("Maximum 6 floors.");
        return;
      }

      const level = Math.max(
        ...home.floors.map(floor => Number(floor.level) || 0)
      ) + 1;

      const floor = makeFloor(
        level,
        "Floor " + level,
        ["bedroom"]
      );

      home.floors.push(floor);
      home.activeFloor = floor.id;

      saveHome(home);
      renderHome();
    };

    $("deleteFloor").onclick = () => {
      const home = currentHome();

      if (home.floors.length <= 1) {
        alert("Keep at least one floor.");
        return;
      }

      if (!confirm("Delete this floor and its rooms?")) {
        return;
      }

      const floor = home.floors.find(
        entry => entry.id === $("floorSelect").value
      );

      if (!floor) return;

      const roomIds = floor.rooms.map(room => room.id);

      home.floors = home.floors.filter(
        entry => entry.id !== floor.id
      );

      home.activeFloor = home.floors[0].id;

      saveHome(home);

      saveItems(
        currentItems().filter(item =>
          !roomIds.includes(item.roomId)
        )
      );

      selectedRoom = null;
      $("roomEditor").hidden = true;

      renderHome();
    };

    $("renameFloor").onclick = () => {
      changeHome(home => {
        const floor = home.floors.find(
          entry => entry.id === $("floorSelect").value
        );

        const name = clean($("floorName").value);

        if (floor && name) {
          floor.name = name;
        }
      });
    };

    $("addRoom").onclick = () => {
      const home = currentHome();

      const floor = home.floors.find(
        entry => entry.id === $("floorSelect").value
      );

      if (!floor) return;

      if (floor.rooms.length >= 12) {
        alert("Maximum 12 rooms.");
        return;
      }

      floor.rooms.push(
        makeRoom(
          $("roomType").value,
          clean($("newRoomName").value)
        )
      );

      $("newRoomName").value = "";

      saveHome(home);
      renderHome();
    };

    $("applyRoom").onclick = () => {
      changeHome(home => {
        const floor = home.floors.find(
          entry => entry.id === $("floorSelect").value
        );

        const room = floor?.rooms.find(
          entry => entry.id === selectedRoom
        );

        if (room) {
          room.name =
            clean($("editRoomName").value) || room.name;

          room.type = $("editRoomType").value;
        }
      });

      $("roomEditor").hidden = true;
    };

    $("removeRoom").onclick = () => {
      if (
        !selectedRoom ||
        !confirm("Delete this room and its items?")
      ) {
        return;
      }

      const removedId = selectedRoom;

      const home = currentHome();

      const floor = home.floors.find(
        entry => entry.id === $("floorSelect").value
      );

      if (!floor) return;

      floor.rooms = floor.rooms.filter(
        room => room.id !== removedId
      );

      saveHome(home);

      saveItems(
        currentItems().filter(item =>
          item.roomId !== removedId
        )
      );

      selectedRoom = null;
      $("roomEditor").hidden = true;

      renderHome();
    };

    $("closeRoomEditor").onclick = () => {
      $("roomEditor").hidden = true;
      selectedRoom = null;
    };

    $("generateHome").onclick = () => {
      const description = clean($("homePrompt").value);

      if (!description) {
        alert("Describe your home first.");
        return;
      }

      const lines = description
        .split("\n")
        .filter(line => line.includes(":"));

      const match = description.match(/(\d+)\s+floors?/i);

      const count = Math.min(
        6,
        Math.max(
          1,
          Number(match?.[1] || lines.length || 2)
        )
      );

      const floors = [];

      for (let index = 0; index < count; index++) {
        const line = lines[index] || "";
        const parts = line.split(":");

        const name = clean(parts[0]) ||
          (index === 0 ? "Ground Floor" : "Floor " + index);

        const details = parts.slice(1).join(":");
        const types = [];

        Object.entries(rooms).forEach(([type, label]) => {
          const escaped = label.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );

          const expression = new RegExp(
            "(\\d+)?\\s*" + escaped + "s?",
            "gi"
          );

          let result;

          while ((result = expression.exec(details)) !== null) {
            const amount = Math.min(
              8,
              Math.max(1, Number(result[1] || 1))
            );

            for (let i = 0; i < amount; i++) {
              types.push(type);
            }
          }
        });

        floors.push(
          makeFloor(
            index,
            name,
            types.length
              ? types.slice(0, 12)
              : ["bedroom"]
          )
        );
      }

      if (!confirm(
        "Replace your current home? Existing items will become unassigned."
      )) {
        return;
      }

      const previousHome = currentHome();

      const oldItems = currentItems().map(item => ({
        ...item,
        roomId: "",
        location: displayLocation(item, previousHome)
      }));

      saveHome({
        floors,
        activeFloor: floors[0].id
      });

      saveItems(oldItems);
      renderHome();
    };

    $("openItemModal").onclick = () => {
      $("itemModal").hidden = false;
      renderHome();
      $("itemName").focus();
    };

    $("closeItemModal").onclick = () => {
      $("itemModal").hidden = true;
    };

    $("itemModal").onclick = event => {
      if (event.target === $("itemModal")) {
        $("itemModal").hidden = true;
      }
    };

    $("itemFloor").onchange = homeRoomOptions;

    $("itemForm").onsubmit = event => {
      event.preventDefault();

      const name = clean($("itemName").value);
      const place = clean($("itemPlace").value);
      const roomId = $("itemRoom").value;

      if (!name || !place || !roomId) {
        alert("Fill all fields and choose a room.");
        return;
      }

      const item = {
        id: id(),
        name,
        category: $("itemCategory").value,
        roomId,
        place,
        notes: ""
      };

      if (saveItems([...currentItems(), item])) {
        $("itemForm").reset();
        $("itemModal").hidden = true;

        $("homeStatus").textContent =
          "✅ Saved in My Home and Dashboard!";
      }
    };

    $("findButton").onclick = () => {
      const query = clean(
        $("findInput").value
      ).toLowerCase();

      const item = query
        ? currentItems().find(entry =>
            entry.name.toLowerCase().includes(query)
          )
        : null;

      if (!item) {
        $("homeStatus").textContent =
          "No matching item found.";
        return;
      }

      const home = currentHome();
      const found = roomFor(home, item.roomId);

      if (found) {
        home.activeFloor = found.floor.id;
        saveHome(home);

        view = "selected";
        updateViewButtons();
        renderHome();
      }

      $("homeStatus").textContent =
        "📍 " + item.name +
        ": " + displayLocation(item, home);

      if (window.FindIt.focusItem3D) {
        window.FindIt.focusItem3D(item.id);
      }
    };

    $("findInput").oninput = renderHome;

    const modes = {
      exterior: "viewExterior",
      exploded: "viewExploded",
      selected: "viewSelected",
      top: "viewTop"
    };

    function updateViewButtons() {
      Object.entries(modes).forEach(([mode, elementId]) => {
        $(elementId).classList.toggle(
          "active",
          mode === view
        );
      });
    }

    Object.entries(modes).forEach(([mode, elementId]) => {
      $(elementId).onclick = () => {
        view = mode;
        updateViewButtons();
        draw3D();
        moveCamera();
      };
    });

    window.addEventListener(
      "findit:items-changed",
      () => {
        renderHome();
        renderDashboard();
      }
    );

    initializeThree();
    renderHome();
    updateViewButtons();
  } else {
    window.addEventListener(
      "findit:items-changed",
      renderDashboard
    );
  }

  function initializeThree() {
    const mount = $("threeCanvas");

    if (!mount) return;

    if (!window.THREE) {
      $("homeStatus").textContent =
        "Three.js unavailable. Check your internet connection.";
      return;
    }

    const T = THREE;

    let renderer;

    try {
      renderer = new T.WebGLRenderer({
        antialias: true
      });
    } catch {
      $("homeStatus").textContent =
        "WebGL is not supported on this computer.";
      return;
    }

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;

    if ("outputColorSpace" in renderer) {
      renderer.outputColorSpace = T.SRGBColorSpace;
    }

    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    mount.replaceChildren(renderer.domElement);
    renderer.domElement.style.touchAction = "none";

    const scene = new T.Scene();

    scene.background = new T.Color(0x83c9fa);
    scene.fog = new T.Fog(0x9ed7f5, 70, 185);

    const camera = new T.PerspectiveCamera(
      47,
      1,
      0.1,
      300
    );

    const hemisphere = new T.HemisphereLight(
      0xf4faff,
      0x6f8756,
      2
    );

    scene.add(hemisphere);

    const sunlight = new T.DirectionalLight(
      0xfff5d6,
      3
    );

    sunlight.position.set(-32, 52, -22);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.set(2048, 2048);

    sunlight.shadow.camera.left = -80;
    sunlight.shadow.camera.right = 80;
    sunlight.shadow.camera.top = 80;
    sunlight.shadow.camera.bottom = -80;
    sunlight.shadow.bias = -0.0004;

    scene.add(sunlight);

    const world = new T.Group();
    const garden = new T.Group();
    const building = new T.Group();
    const sky = new T.Group();

    world.add(garden, building);
    scene.add(world, sky);

    function material(color, options = {}) {
      return new T.MeshStandardMaterial({
        color,
        roughness: 0.83,
        ...options
      });
    }

    const m = {
      grass: material(0x76ad53),
      lawn: material(0x83b75d),
      paving: material(0xc7b6a0),
      stone: material(0xe0d5c4),
      slab: material(0xcab79c),
      plaster: material(0xf4f0e9),
      wood: material(0xa77b52),
      darkWood: material(0x725039),
      roof: material(0x444c53),

      glass: material(0x89d0ed, {
        transparent: true,
        opacity: 0.6,
        metalness: 0.2,
        roughness: 0.13
      }),

      frame: material(0x42474c),
      tree: material(0x6b4b32),
      leaves: material(0x438a42),
      olive: material(0x679d55),
      cream: material(0xf9f7ef),
      grey: material(0x9b9b9b),
      fabric: material(0xb2aaa1),
      blue: material(0x537ba3),
      black: material(0x33383d),

      water: material(0x47b5db, {
        metalness: 0.15,
        roughness: 0.12
      }),

      marker: material(0xffb640, {
        emissive: 0x8c3d00,
        emissiveIntensity: 0.65
      })
    };

    function mesh(parent, geometry, selectedMaterial, x = 0, y = 0, z = 0) {
      const object = new T.Mesh(
        geometry,
        selectedMaterial
      );

      object.position.set(x, y, z);
      object.castShadow = true;
      object.receiveShadow = true;

      parent.add(object);
      return object;
    }

    function box(parent, x, y, z, width, height, depth, selectedMaterial) {
      return mesh(
        parent,
        new T.BoxGeometry(width, height, depth),
        selectedMaterial,
        x,
        y,
        z
      );
    }

    function cylinder(
      parent,
      x,
      y,
      z,
      top,
      bottom,
      height,
      selectedMaterial,
      segments = 12
    ) {
      return mesh(
        parent,
        new T.CylinderGeometry(
          top,
          bottom,
          height,
          segments
        ),
        selectedMaterial,
        x,
        y,
        z
      );
    }

    function sphere(
      parent,
      x,
      y,
      z,
      radius,
      selectedMaterial,
      segments = 14
    ) {
      return mesh(
        parent,
        new T.SphereGeometry(
          radius,
          segments,
          10
        ),
        selectedMaterial,
        x,
        y,
        z
      );
    }

    function label(
      text,
      foreground = "#192131",
      background = "rgba(255,255,255,.92)"
    ) {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 128;

      const context = canvas.getContext("2d");

      context.fillStyle = background;
      context.beginPath();

      if (context.roundRect) {
        context.roundRect(7, 10, 498, 108, 22);
      } else {
        context.rect(7, 10, 498, 108);
      }

      context.fill();

      context.fillStyle = foreground;
      context.font = "bold 34px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";

      let value = String(text || "").slice(0, 42);

      while (
        context.measureText(value).width > 460 &&
        value.length > 5
      ) {
        value = value.slice(0, -2) + "…";
      }

      context.fillText(value, 256, 65);

      const texture = new T.CanvasTexture(canvas);

      const sprite = new T.Sprite(
        new T.SpriteMaterial({
          map: texture,
          depthTest: false,
          transparent: true
        })
      );

      sprite.scale.set(3.6, 0.9, 1);
      sprite.userData.baseScale = 3.6;

      return sprite;
    }

    const sun = new T.Mesh(
      new T.SphereGeometry(3.6, 24, 16),
      new T.MeshBasicMaterial({
        color: 0xffed9b,
        fog: false
      })
    );

    sun.position.set(-48, 57, -80);
    sky.add(sun);

    const clouds = [];

    const cloudPositions = [
      [-30, 36, -55, 1.4],
      [4, 42, -68, 1.8],
      [38, 31, -70, 1.3],
      [-5, 29, -100, 1.6]
    ];

    cloudPositions.forEach(([x, y, z, size]) => {
      const group = new T.Group();

      const parts = [
        [0, 0, 0, 1.5],
        [-1.5, 0, 0, 1.1],
        [1.5, 0, 0, 1.3],
        [0.5, 0.8, 0, 1.1]
      ];

      const whiteCloud = new T.MeshBasicMaterial({
        color: 0xffffff,
        fog: false
      });

      parts.forEach(([a, b, c, radius]) => {
        sphere(
          group,
          a * size,
          b * size,
          c * size,
          radius * size,
          whiteCloud
        );
      });

      group.position.set(x, y, z);
      sky.add(group);
      clouds.push({ group, x });
    });

    const grass = mesh(
      garden,
      new T.PlaneGeometry(130, 130),
      m.grass
    );

    grass.rotation.x = -Math.PI / 2;
    grass.castShadow = false;

    const lawn = mesh(
      garden,
      new T.PlaneGeometry(49, 40),
      m.lawn,
      0,
      0.015,
      0
    );

    lawn.rotation.x = -Math.PI / 2;
    lawn.castShadow = false;

    const path = mesh(
      garden,
      new T.PlaneGeometry(3.2, 17),
      m.paving,
      0,
      0.035,
      16
    );

    path.rotation.x = -Math.PI / 2;
    path.castShadow = false;

    const driveway = mesh(
      garden,
      new T.PlaneGeometry(8, 8),
      m.grey,
      -14,
      0.032,
      22
    );

    driveway.rotation.x = -Math.PI / 2;
    driveway.castShadow = false;

    for (let x = -23; x <= 23; x += 2.5) {
      for (const z of [-19, 19]) {
        if (z === 19 && Math.abs(x) < 3.3) {
          continue;
        }

        box(
          garden,
          x,
          1,
          z,
          0.16,
          2,
          0.16,
          m.wood
        );
      }
    }

    for (let z = -19; z <= 19; z += 2.5) {
      for (const x of [-23, 23]) {
        box(
          garden,
          x,
          1,
          z,
          0.16,
          2,
          0.16,
          m.wood
        );
      }
    }

    for (const z of [-19, 19]) {
      box(
        garden,
        0,
        1.7,
        z,
        46,
        0.14,
        0.15,
        m.wood
      );

      box(
        garden,
        0,
        0.9,
        z,
        46,
        0.12,
        0.15,
        m.wood
      );
    }

    for (const x of [-23, 23]) {
      box(
        garden,
        x,
        1.7,
        0,
        0.15,
        0.14,
        38,
        m.wood
      );

      box(
        garden,
        x,
        0.9,
        0,
        0.15,
        0.12,
        38,
        m.wood
      );
    }

    const treePositions = [
      [-18, -12, 1],
      [18, -12, 1.12],
      [-18, 6, 0.88],
      [17, 5, 1.05],
      [0, -16, 0.72]
    ];

    treePositions.forEach(([x, z, size], index) => {
      const tree = new T.Group();

      cylinder(
        tree,
        0,
        1.55 * size,
        0,
        0.28 * size,
        0.41 * size,
        3.1 * size,
        m.tree
      );

      const leaves = index % 2 ? m.olive : m.leaves;

      const clusters = [
        [0, 3.8, 0, 1.7],
        [-0.9, 3.6, 0.3, 1.3],
        [0.9, 4, 0.1, 1.35],
        [0, 4.8, -0.3, 1.1]
      ];

      clusters.forEach(([a, b, c, radius]) => {
        sphere(
          tree,
          a * size,
          b * size,
          c * size,
          radius * size,
          leaves
        );
      });

      tree.position.set(x, 0, z);
      garden.add(tree);
    });

    const flowerMaterials = [
      0xef79a5,
      0xffe36e,
      0xfff3e7,
      0xbb8bea,
      0xfe946a
    ].map(color => material(color));

    for (let i = 0; i < 52; i++) {
      const side = i % 2 === 0 ? -1 : 1;

      const x =
        side * (5 + ((i * 13) % 140) / 20);

      const z =
        10 + ((i * 17) % 120) / 20;

      cylinder(
        garden,
        x,
        0.17,
        z,
        0.028,
        0.028,
        0.34,
        m.leaves,
        6
      );

      sphere(
        garden,
        x,
        0.37,
        z,
        0.1,
        flowerMaterials[i % flowerMaterials.length],
        8
      );
    }

    const pool = new T.Group();

    box(
      pool,
      0,
      0.15,
      0,
      7.3,
      0.27,
      4.6,
      m.stone
    );

    box(
      pool,
      0,
      0.31,
      0,
      6.65,
      0.07,
      4,
      m.water
    );

    for (const z of [-2.12, 2.12]) {
      box(
        pool,
        0,
        0.37,
        z,
        7.4,
        0.13,
        0.17,
        m.cream
      );
    }

    for (const x of [-3.55, 3.55]) {
      box(
        pool,
        x,
        0.37,
        0,
        0.17,
        0.13,
        4.5,
        m.cream
      );
    }

    pool.position.set(14, 0, 13);
    garden.add(pool);

    const trampoline = new T.Group();

    cylinder(
      trampoline,
      0,
      1.27,
      0,
      2.35,
      2.35,
      0.15,
      m.black,
      40
    );

    const trampolinePadding = mesh(
      trampoline,
      new T.TorusGeometry(2.36, 0.19, 8, 48),
      m.blue,
      0,
      1.37,
      0
    );

    trampolinePadding.rotation.x = Math.PI / 2;

    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;

      cylinder(
        trampoline,
        Math.cos(angle) * 2,
        0.64,
        Math.sin(angle) * 2,
        0.06,
        0.06,
        1.25,
        m.frame,
        8
      );

      cylinder(
        trampoline,
        Math.cos(angle) * 2.4,
        2.25,
        Math.sin(angle) * 2.4,
        0.035,
        0.035,
        2.9,
        m.frame,
        7
      );
    }

    const trampolineRing = mesh(
      trampoline,
      new T.TorusGeometry(2.4, 0.035, 6, 48),
      m.frame,
      0,
      3.7,
      0
    );

    trampolineRing.rotation.x = Math.PI / 2;

    trampoline.position.set(-15, 0, 12);
    garden.add(trampoline);

    for (const x of [-9, 9]) {
      const planter = new T.Group();

      cylinder(
        planter,
        0,
        0.3,
        0,
        0.45,
        0.32,
        0.6,
        m.stone
      );

      sphere(
        planter,
        0,
        0.95,
        0,
        0.68,
        m.olive
      );

      planter.position.set(x, 0, 9.2);
      garden.add(planter);
    }

    let floorGroups = [];
    let itemObjects = new Map();
    let interactables = [];
    let selectedItem = null;

    const FLOOR_HEIGHT = 3.2;
    const HOUSE_WIDTH = 17.5;
    const HOUSE_DEPTH = 12.5;

    function furniture(parent, type, width, depth) {
      const w = width;
      const d = depth;
      const short = Math.min(w, d);

      if (type === "bedroom") {
        box(
          parent,
          0,
          0.4,
          0,
          w * 0.44,
          0.45,
          d * 0.39,
          m.darkWood
        );

        box(
          parent,
          0,
          0.72,
          0,
          w * 0.41,
          0.18,
          d * 0.36,
          m.cream
        );

        box(
          parent,
          0,
          0.84,
          -d * 0.09,
          w * 0.28,
          0.1,
          d * 0.1,
          m.fabric
        );

        box(
          parent,
          w * 0.31,
          0.82,
          d * 0.25,
          w * 0.17,
          1.45,
          d * 0.25,
          m.wood
        );
      }

      else if (type === "living") {
        box(
          parent,
          -w * 0.16,
          0.52,
          -d * 0.06,
          w * 0.45,
          0.65,
          d * 0.23,
          m.fabric
        );

        box(
          parent,
          -w * 0.16,
          0.98,
          -d * 0.16,
          w * 0.45,
          0.46,
          d * 0.08,
          m.fabric
        );

        box(
          parent,
          w * 0.16,
          0.39,
          d * 0.09,
          w * 0.25,
          0.32,
          d * 0.21,
          m.wood
        );

        box(
          parent,
          w * 0.33,
          0.9,
          -d * 0.24,
          0.09,
          1.4,
          d * 0.42,
          m.frame
        );
      }

      else if (type === "kitchen") {
        box(
          parent,
          0,
          0.48,
          -d * 0.34,
          w * 0.74,
          0.95,
          d * 0.18,
          m.cream
        );

        box(
          parent,
          -w * 0.34,
          0.47,
          0,
          w * 0.16,
          0.94,
          d * 0.7,
          m.wood
        );

        box(
          parent,
          w * 0.14,
          0.5,
          d * 0.13,
          w * 0.27,
          0.94,
          d * 0.21,
          m.cream
        );
      }

      else if (type === "bathroom") {
        box(
          parent,
          -w * 0.17,
          0.4,
          -d * 0.23,
          w * 0.35,
          0.76,
          d * 0.25,
          m.cream
        );

        box(
          parent,
          w * 0.27,
          0.42,
          d * 0.08,
          w * 0.19,
          0.82,
          d * 0.22,
          m.cream
        );

        cylinder(
          parent,
          w * 0.1,
          0.39,
          -d * 0.25,
          0.2,
          0.23,
          0.75,
          m.cream
        );
      }

      else if (type === "office") {
        box(
          parent,
          -w * 0.12,
          0.75,
          -d * 0.2,
          w * 0.52,
          0.12,
          d * 0.22,
          m.wood
        );

        for (const x of [-w * 0.35, w * 0.11]) {
          box(
            parent,
            x,
            0.35,
            -d * 0.2,
            0.09,
            0.65,
            0.09,
            m.frame
          );
        }

        box(
          parent,
          0,
          0.48,
          d * 0.17,
          w * 0.22,
          0.22,
          d * 0.19,
          m.black
        );
      }

      else if (type === "garage") {
        box(
          parent,
          0,
          0.55,
          0,
          w * 0.52,
          0.72,
          d * 0.4,
          m.blue
        );

        for (const x of [-w * 0.18, w * 0.18]) {
          for (const z of [-d * 0.18, d * 0.18]) {
            cylinder(
              parent,
              x,
              0.18,
              z,
              0.25,
              0.25,
              0.32,
              m.black
            );
          }
        }
      }

      else if (type === "dining") {
        box(
          parent,
          0,
          0.75,
          0,
          w * 0.49,
          0.13,
          d * 0.37,
          m.wood
        );

        for (const x of [-w * 0.33, w * 0.33]) {
          for (const z of [-d * 0.19, d * 0.19]) {
            box(
              parent,
              x,
              0.43,
              z,
              0.44,
              0.65,
              0.44,
              m.fabric
            );
          }
        }
      }

      else if (type === "gym") {
        box(
          parent,
          0,
          0.22,
          0,
          w * 0.35,
          0.22,
          d * 0.55,
          m.black
        );

        box(
          parent,
          w * 0.2,
          0.62,
          -d * 0.25,
          0.12,
          1,
          0.12,
          m.frame
        );
      }

      else if (type === "laundry") {
        for (const x of [-w * 0.18, w * 0.18]) {
          box(
            parent,
            x,
            0.52,
            -d * 0.2,
            w * 0.25,
            1,
            d * 0.31,
            m.cream
          );

          mesh(
            parent,
            new T.TorusGeometry(0.25, 0.05, 8, 20),
            m.frame,
            x,
            0.55,
            -d * 0.2 + d * 0.16
          );
        }
      }

      else {
        box(
          parent,
          0,
          0.6,
          0,
          short * 0.48,
          1.05,
          short * 0.28,
          m.wood
        );

        box(
          parent,
          w * 0.31,
          0.9,
          -d * 0.27,
          w * 0.16,
          1.65,
          d * 0.25,
          m.darkWood
        );
      }
    }

    function rebuildBuilding() {
      const previousTransforms = floorGroups.map(group => ({
        id: group.userData.floorId,
        x: group.position.x,
        y: group.position.y,
        z: group.position.z
      }));

      building.clear();
      floorGroups = [];
      itemObjects = new Map();
      interactables = [];

      const home = currentHome();
      const items = currentItems();

      home.floors.forEach((floor, floorIndex) => {
        const floorGroup = new T.Group();

        const previous = previousTransforms.find(
          item => item.id === floor.id
        );

        floorGroup.position.set(
          previous?.x ?? 0,
          previous?.y ?? floorIndex * FLOOR_HEIGHT,
          previous?.z ?? 0
        );

        floorGroup.userData.floorId = floor.id;

        building.add(floorGroup);
        floorGroups.push(floorGroup);

        box(
          floorGroup,
          0,
          0,
          0,
          HOUSE_WIDTH,
          0.3,
          HOUSE_DEPTH,
          m.slab
        );

        const count = Math.max(
          1,
          Math.min(12, floor.rooms.length)
        );

        const columns = Math.ceil(
          Math.sqrt(
            count * HOUSE_WIDTH / HOUSE_DEPTH
          )
        );

        const rows = Math.ceil(count / columns);

        const cellWidth =
          (HOUSE_WIDTH - 0.5) / columns;

        const cellDepth =
          (HOUSE_DEPTH - 0.5) / rows;

        floor.rooms.forEach((room, index) => {
          const col = index % columns;
          const row = Math.floor(index / columns);

          const x =
            -HOUSE_WIDTH / 2 +
            0.25 +
            col * cellWidth +
            cellWidth / 2;

          const z =
            -HOUSE_DEPTH / 2 +
            0.25 +
            row * cellDepth +
            cellDepth / 2;

          const roomGroup = new T.Group();

          roomGroup.position.set(x, 0.17, z);
          floorGroup.add(roomGroup);

          const floorMaterial =
            room.type === "bathroom"
              ? m.glass
              : room.type === "garage"
                ? m.grey
                : m.wood;

          const base = box(
            roomGroup,
            0,
            0.07,
            0,
            cellWidth - 0.18,
            0.12,
            cellDepth - 0.18,
            floorMaterial
          );

          base.userData.kind = "room";
          base.userData.id = room.id;
          base.userData.floorId = floor.id;

          interactables.push(base);

          box(
            roomGroup,
            -cellWidth / 2 + 0.05,
            1.2,
            0,
            0.12,
            2.35,
            cellDepth - 0.1,
            m.plaster
          );

          box(
            roomGroup,
            0,
            1.2,
            -cellDepth / 2 + 0.05,
            cellWidth - 0.1,
            2.35,
            0.12,
            m.plaster
          );

          furniture(
            roomGroup,
            room.type,
            cellWidth - 0.25,
            cellDepth - 0.25
          );

          const roomLabel = label(room.name);

          roomLabel.position.set(0, 2.68, 0);
          roomGroup.add(roomLabel);

          const roomItems = items.filter(
            item => item.roomId === room.id
          );

          roomItems.forEach((item, itemIndex) => {
            const angle = itemIndex * 2.399963;
            const radius = Math.min(
              1.2,
              0.4 + itemIndex * 0.13
            );

            const px = Math.max(
              -cellWidth * 0.32,
              Math.min(
                cellWidth * 0.32,
                Math.cos(angle) * radius
              )
            );

            const pz = Math.max(
              -cellDepth * 0.32,
              Math.min(
                cellDepth * 0.32,
                Math.sin(angle) * radius
              )
            );

            const marker = new T.Group();

            marker.position.set(
              px,
              1.13,
              pz
            );

            const glow = sphere(
              marker,
              0,
              0,
              0,
              0.19,
              m.marker,
              12
            );

            glow.userData.kind = "item";
            glow.userData.id = item.id;

            interactables.push(glow);

            const itemLabel = label(
              item.name,
              "#ffffff",
              "rgba(92,58,171,.95)"
            );

            itemLabel.position.set(0, 0.7, 0);
            itemLabel.scale.set(3, 0.78, 1);
            itemLabel.userData.baseScale = 3;

            itemLabel.userData.kind = "item";
            itemLabel.userData.id = item.id;

            marker.add(itemLabel);
            interactables.push(itemLabel);

            roomGroup.add(marker);

            itemObjects.set(item.id, {
              marker,
              label: itemLabel,
              floorId: floor.id
            });
          });
        });

        if (view === "exterior") {
          box(
            floorGroup,
            0,
            1.32,
            HOUSE_DEPTH / 2 - 0.05,
            HOUSE_WIDTH,
            2.45,
            0.12,
            m.plaster
          );

          box(
            floorGroup,
            HOUSE_WIDTH / 2 - 0.05,
            1.32,
            0,
            0.12,
            2.45,
            HOUSE_DEPTH,
            m.plaster
          );

          box(
            floorGroup,
            0,
            1.32,
            -HOUSE_DEPTH / 2 + 0.05,
            HOUSE_WIDTH,
            2.45,
            0.12,
            m.plaster
          );

          for (const x of [-5.7, 0, 5.7]) {
            box(
              floorGroup,
              x,
              1.58,
              HOUSE_DEPTH / 2 + 0.025,
              2.25,
              1.3,
              0.04,
              m.frame
            );

            box(
              floorGroup,
              x,
              1.58,
              HOUSE_DEPTH / 2 + 0.06,
              2.03,
              1.08,
              0.045,
              m.glass
            );
          }

          box(
            floorGroup,
            HOUSE_WIDTH / 2 + 0.015,
            1.58,
            -2,
            0.06,
            1.4,
            2.2,
            m.glass
          );

          if (floorIndex === 0) {
            box(
              floorGroup,
              0,
              1.15,
              HOUSE_DEPTH / 2 + 0.1,
              1.45,
              2.3,
              0.1,
              m.darkWood
            );

            sphere(
              floorGroup,
              0.48,
              1.1,
              HOUSE_DEPTH / 2 + 0.18,
              0.07,
              m.cream,
              8
            );
          }
        }

        const floorLabel = label(
          floor.name,
          "#ffffff",
          "rgba(25,33,47,.9)"
        );

        floorLabel.position.set(
          -HOUSE_WIDTH / 2 + 2.7,
          3.25,
          -HOUSE_DEPTH / 2 + 1
        );

        floorGroup.add(floorLabel);
      });

      if (
        view === "exterior" &&
        floorGroups.length
      ) {
        const highest =
          floorGroups[floorGroups.length - 1];

        box(
          highest,
          0,
          3.02,
          0,
          HOUSE_WIDTH + 0.75,
          0.24,
          HOUSE_DEPTH + 0.75,
          m.roof
        );
      }

      changeFloorTargets();
    }

    function changeFloorTargets() {
      const home = currentHome();

      floorGroups.forEach((group, index) => {
        const exploded = view === "exploded";
        const selected = view === "selected";

        const direction =
          index % 2 === 0 ? -1 : 1;

        const horizontalDistance =
          12 + index * 3;

        group.userData.targetX = exploded
          ? direction * horizontalDistance
          : 0;

        group.userData.targetY = exploded
          ? index * (FLOOR_HEIGHT + 2.5)
          : index * FLOOR_HEIGHT;

        group.userData.targetZ = exploded
          ? -index * 0.5
          : 0;

        group.visible =
          !selected ||
          group.userData.floorId === home.activeFloor;

        if (selected && group.visible) {
          group.userData.targetX = 0;
          group.userData.targetY = 0;
          group.userData.targetZ = 0;
        }
      });
    }

    let theta = 0.85;
    let phi = 0.94;
    let radius = 36;

    let targetTheta = theta;
    let targetPhi = phi;
    let targetRadius = radius;

    const target = new T.Vector3(0, 4, 0);
    const lookAt = new T.Vector3(0, 4, 0);

    function setViewCamera() {
      const floors = currentHome().floors.length;

      if (view === "exploded") {
        targetTheta = 0.85;
        targetPhi = 0.72;

        targetRadius = Math.min(
          115,
          48 + floors * 7
        );

        lookAt.set(
          0,
          Math.max(
            3,
            (floors - 1) * 2.7
          ),
          0
        );
      }

      else if (view === "selected") {
        targetTheta = 0.85;
        targetPhi = 0.52;
        targetRadius = 21;

        lookAt.set(0, 1.3, 0);
      }

      else if (view === "top") {
        targetTheta = 0.01;
        targetPhi = 0.055;
        targetRadius = 39;

        lookAt.set(0, 3, 0);
      }

      else {
        targetTheta = 0.85;
        targetPhi = 0.92;
        targetRadius = 35 + floors * 1.3;

        lookAt.set(
          0,
          Math.max(2, floors * 1.5),
          0
        );
      }
    }

    function updateCamera() {
      theta += (targetTheta - theta) * 0.085;
      phi += (targetPhi - phi) * 0.085;
      radius += (targetRadius - radius) * 0.085;

      target.lerp(lookAt, 0.085);

      camera.position.set(
        target.x +
          radius * Math.sin(phi) * Math.sin(theta),

        target.y +
          radius * Math.cos(phi),

        target.z +
          radius * Math.sin(phi) * Math.cos(theta)
      );

      camera.lookAt(target);
    }

    let previousView = "";

    draw3D = () => {
      const before = previousView;
      previousView = view;

      rebuildBuilding();

      if (before !== view) {
        setViewCamera();
      }
    };

    moveCamera = setViewCamera;

    const previousFindHandler = $("findButton").onclick;

    $("findButton").onclick = () => {
      previousFindHandler();

      const query = clean(
        $("findInput").value
      ).toLowerCase();

      const found = query
        ? currentItems().find(item =>
            item.name.toLowerCase().includes(query)
          )
        : null;

      if (found) {
        focusItem(found.id);
      }
    };

    function focusItem(itemId) {
      selectedItem = itemId;

      let item = itemObjects.get(itemId);
      if (!item) return;

      const home = currentHome();

      if (home.activeFloor !== item.floorId) {
        home.activeFloor = item.floorId;
        saveHome(home);
      }

      view = "selected";

      for (const mode of [
        "exterior",
        "exploded",
        "selected",
        "top"
      ]) {
        const element = $(
          "view" +
          mode.charAt(0).toUpperCase() +
          mode.slice(1)
        );

        if (element) {
          element.classList.toggle(
            "active",
            mode === view
          );
        }
      }

      draw3D();
      setViewCamera();

      $("homeStatus").textContent =
        "✨ Item selected: " +
        (
          currentItems().find(
            entry => entry.id === itemId
          )?.name || ""
        );
    }

    window.FindIt.focusItem3D = focusItem;

    const pointer = new T.Vector2();
    const raycaster = new T.Raycaster();

    let dragging = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;

    const canvas = renderer.domElement;

    canvas.addEventListener("pointerdown", event => {
      dragging = true;
      moved = false;

      lastX = event.clientX;
      lastY = event.clientY;

      canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", event => {
      if (!dragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;

      if (Math.abs(dx) + Math.abs(dy) > 2) {
        moved = true;
      }

      targetTheta -= dx * 0.007;

      targetPhi = Math.max(
        0.055,
        Math.min(
          1.45,
          targetPhi + dy * 0.006
        )
      );

      lastX = event.clientX;
      lastY = event.clientY;
    });

    canvas.addEventListener("pointerup", event => {
      if (!dragging) return;

      dragging = false;

      if (moved) return;

      const rect = canvas.getBoundingClientRect();

      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(pointer, camera);

      const intersection = raycaster.intersectObjects(
        interactables,
        false
      )[0];

      if (!intersection) return;

      const object = intersection.object;

      if (object.userData.kind === "item") {
        focusItem(object.userData.id);
      }

      else if (object.userData.kind === "room") {
        const home = currentHome();

        home.activeFloor =
          object.userData.floorId;

        saveHome(home);

        view = "selected";
        draw3D();
        setViewCamera();

        $("homeStatus").textContent =
          "Room selected.";
      }
    });

    canvas.addEventListener("pointercancel", () => {
      dragging = false;
    });

    canvas.addEventListener(
      "wheel",
      event => {
        event.preventDefault();

        targetRadius = Math.max(
          12,
          Math.min(
            115,
            targetRadius + event.deltaY * 0.026
          )
        );
      },
      { passive: false }
    );

    $("viewReset").onclick = () => {
      targetTheta = 0.85;
      setViewCamera();
    };

    function resize() {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(
        width,
        height,
        false
      );
    }

    if ("ResizeObserver" in window) {
      new ResizeObserver(resize).observe(mount);
    } else {
      window.addEventListener("resize", resize);
    }

    draw3D();
    resize();

    let running = true;

    window.addEventListener(
      "pagehide",
      () => {
        running = false;
      },
      { once: true }
    );

    function animate(time = 0) {
      if (!running) return;

      requestAnimationFrame(animate);

      floorGroups.forEach(group => {
        const speed = 0.065;

        const targetX =
          group.userData.targetX ?? 0;

        const targetY =
          group.userData.targetY ?? 0;

        const targetZ =
          group.userData.targetZ ?? 0;

        group.position.x +=
          (targetX - group.position.x) * speed;

        group.position.y +=
          (targetY - group.position.y) * speed;

        group.position.z +=
          (targetZ - group.position.z) * speed;
      });

      clouds.forEach(({ group, x }, index) => {
        group.position.x =
          x +
          Math.sin(time * 0.00016 + index) * 1.6;
      });

      itemObjects.forEach((entry, itemId) => {
        const active = itemId === selectedItem;

        const pulse = 1 + (
          active
            ? Math.sin(time * 0.009) * 0.14
            : Math.sin(time * 0.004) * 0.018
        );

        entry.label.scale.set(
          entry.label.userData.baseScale * pulse,
          0.78 * pulse,
          1
        );

        entry.marker.position.y =
          1.13 + (
            active
              ? Math.sin(time * 0.006) * 0.14
              : 0
          );
      });

      updateCamera();
      renderer.render(scene, camera);
    }

    animate();
  }

  window.addEventListener("storage", event => {
    if (
      event.key &&
      (
        event.key.startsWith(ITEMS) ||
        event.key.startsWith(HOMES)
      )
    ) {
      renderDashboard();
      renderHome();
    }
  });

  const reveals = document.querySelectorAll(".fi-reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(
            "fi-entered",
            "fi-in-view"
          );

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.07 }
    );

    reveals.forEach(element => {
      observer.observe(element);
    });
  } else {
    reveals.forEach(element => {
      element.classList.add(
        "fi-entered",
        "fi-in-view"
      );
    });
  }
});
