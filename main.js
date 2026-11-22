
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const $ = id => document.getElementById(id);
  const page = document.body.dataset.page;
  const DASH_KEY = "findit-dashboard-items-v2";
  const HOME_KEY = "findit-home-v2";

  function uid() {
    return Date.now().toString(36) +
      Math.random().toString(36).slice(2, 9);
  }

  function read(key, fallback) {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      return saved === null ? fallback : saved;
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

  function makeElement(tag, text, className = "") {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function nav() {
    const header = $("site-header");
    const footer = $("site-footer");

    const pages = [
      ["home", "Home", "index.html"],
      ["how", "How It Works", "how.html"],
      ["dashboard", "Dashboard", "dashboard.html"],
      ["myhome", "My Home", "myhome.html"],
      ["features", "Features", "features.html"],
      ["about", "About", "about.html"]
    ];

    if (header) {
      const bar = makeElement("header", undefined, "site-navbar");
      const brand = makeElement("a", undefined, "site-brand");
      brand.href = "index.html";
      brand.append("FIND ");
      brand.append(makeElement("span", "IT."));

      const links = makeElement("nav", undefined, "site-links");

      pages.forEach(([id, title, url]) => {
        const a = makeElement("a", title);
        a.href = url;
        if (id === page) a.classList.add("active");
        links.append(a);
      });

      bar.append(brand, links);
      header.replaceChildren(bar);
    }

    if (footer) {
      const outer = makeElement("footer", undefined, "site-footer");
      const inner = makeElement("div", undefined, "container");
      inner.append(
        makeElement("strong", "FIND IT."),
        makeElement(
          "p",
          "Remember the last location you saved. © 2026 FIND IT."
        )
      );
      outer.append(inner);
      footer.replaceChildren(outer);
    }
  }

  nav();

  if (page === "how") {
    const form = $("howDemo");

    if (form) {
      form.addEventListener("submit", event => {
        event.preventDefault();

        const name = $("demoName").value.trim();
        const place = $("demoPlace").value.trim();

        $("demoResult").textContent =
          name && place
            ? `${name} → ${place}. That's how FIND IT works!`
            : "Complete both fields.";
      });
    }
  }

  if (page === "dashboard") initDashboard();
  if (page === "myhome") initHome();

  function initDashboard() {
    let items = read(DASH_KEY, []);
    if (!Array.isArray(items)) items = [];

    function saveItems() {
      return write(DASH_KEY, items);
    }

    function clearForm() {
      $("dashboardForm").reset();
      $("editItemId").value = "";
      $("itemFormTitle").textContent = "Add an Item";
      $("dashSave").textContent = "Save Item";
      $("dashCancel").hidden = true;
    }

    function render() {
      $("totalItems").textContent = items.length;

      $("totalCategories").textContent = new Set(
        items.map(item => item.category)
      ).size;

      $("totalLocations").textContent = new Set(
        items.map(item => item.location)
      ).size;

      const query = $("dashboardSearch").value.trim().toLowerCase();
      const category = $("dashboardFilter").value;
      const list = $("dashboardItems");
      list.replaceChildren();

      const visible = items.filter(item => {
        const matchesQuery =
          item.name.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.notes.toLowerCase().includes(query);

        const matchesCategory =
          category === "all" || item.category === category;

        return matchesQuery && matchesCategory;
      });

      if (!visible.length) {
        list.append(
          makeElement("p", "No matching items found.", "muted")
        );
      }

      visible.forEach(item => {
        const row = makeElement("div", undefined, "saved-item");
        const details = makeElement("div");

        details.append(makeElement("strong", item.name));
        details.append(
          makeElement(
            "small",
            `${item.category} · ${item.location}`
          )
        );

        if (item.notes) {
          details.append(makeElement("small", item.notes));
        }

        const actions = makeElement(
          "div", undefined, "item-actions"
        );

        const edit = makeElement("button", "Edit");
        edit.type = "button";

        edit.onclick = () => {
          $("editItemId").value = item.id;
          $("dashName").value = item.name;
          $("dashCategory").value = item.category;
          $("dashLocation").value = item.location;
          $("dashNotes").value = item.notes;

          $("itemFormTitle").textContent = "Edit Item";
          $("dashSave").textContent = "Update Item";
          $("dashCancel").hidden = false;
          $("dashName").focus();
        };

        const remove = makeElement("button", "Delete", "delete");
        remove.type = "button";

        remove.onclick = () => {
          if (!confirm("Delete " + item.name + "?")) return;
          items = items.filter(entry => entry.id !== item.id);
          saveItems();
          clearForm();
          render();
        };

        actions.append(edit, remove);
        row.append(details, actions);
        list.append(row);
      });
    }

    $("dashboardForm").onsubmit = event => {
      event.preventDefault();

      const name = $("dashName").value.trim();
      const location = $("dashLocation").value.trim();
      const category = $("dashCategory").value;
      const notes = $("dashNotes").value.trim();
      const editId = $("editItemId").value;

      if (!name || !location) return;

      const existing = items.find(item => item.id === editId);

      if (existing) {
        Object.assign(existing, {
          name, category, location, notes
        });
      } else {
        items.push({
          id: uid(),
          name, category, location, notes
        });
      }

      if (saveItems()) {
        $("dashboardStatus").textContent = "Item saved successfully.";
        clearForm();
        render();
      } else {
        $("dashboardStatus").textContent =
          "Unable to save in this browser.";
      }
    };

    $("dashCancel").onclick = clearForm;
    $("dashboardSearch").oninput = render;
    $("dashboardFilter").onchange = render;

    render();
  }

  function initHome() {
    const TYPES = {
      bedroom: "Bedroom",
      living: "Living Room",
      kitchen: "Kitchen",
      bathroom: "Bathroom",
      garage: "Garage",
      storage: "Storage",
      basement: "Basement",
      office: "Office",
      game: "Game Room",
      gym: "Gym",
      laundry: "Laundry",
      dining: "Dining Room",
      custom: "Custom Room"
    };

    const makeRoom = (type, name) => ({
      id: uid(),
      type,
      name: name || TYPES[type] || "Room"
    });

    function initial() {
      return {
        floors: [
          {
            id: "basement",
            name: "Basement",
            rooms: [
              makeRoom("storage", "Storage"),
              makeRoom("garage", "Garage")
            ]
          },
          {
            id: "ground",
            name: "Ground Floor",
            rooms: [
              makeRoom("living", "Living Room"),
              makeRoom("kitchen", "Kitchen"),
              makeRoom("bathroom", "Bathroom")
            ]
          },
          {
            id: "first",
            name: "First Floor",
            rooms: [
              makeRoom("bedroom", "Master Bedroom"),
              makeRoom("bedroom", "Ela's Bedroom"),
              makeRoom("bathroom", "Bathroom")
            ]
          }
        ],
        items: []
      };
    }

    let home = read(HOME_KEY, null);

    if (
      !home ||
      !Array.isArray(home.floors) ||
      !Array.isArray(home.items) ||
      !home.floors.length ||
      home.floors.length > 6 ||
      !home.floors.every(f =>
        f &&
        typeof f.id === "string" &&
        typeof f.name === "string" &&
        Array.isArray(f.rooms) &&
        f.rooms.length <= 12 &&
        f.rooms.every(r =>
          r &&
          typeof r.id === "string" &&
          typeof r.name === "string" &&
          Object.prototype.hasOwnProperty.call(TYPES, r.type)
        )
      )
    ) {
      home = initial();
    }

    let floorId = home.floors[0].id;
    let editRoomId = null;
    let selectedItemId = null;
    let mode = "exterior";

    let scene = null;
    let camera = null;
    let renderer = null;
    let house = null;
    let garden = null;
    let facade = null;
    let roof = null;
    let floorGroups = [];

    let angle = .72;
    let tilt = .85;
    let distance = 40;
    let desiredDistance = 40;
    let target = null;
    let desiredTarget = null;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    function status(text) {
      $("homeStatus").textContent = text;
    }

    function saveHome() {
      return write(HOME_KEY, home);
    }

    function selectedFloor() {
      return home.floors.find(f => f.id === floorId);
    }

    function roomById(id) {
      for (const floor of home.floors) {
        const room = floor.rooms.find(r => r.id === id);
        if (room) return {floor, room};
      }
      return null;
    }

    function addOption(select, value, label) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.append(option);
    }

    function render() {
      if (!selectedFloor()) floorId = home.floors[0].id;

      $("floorSelect").replaceChildren();

      home.floors.forEach(f => {
        addOption($("floorSelect"), f.id, f.name);
      });

      $("floorSelect").value = floorId;
      $("floorName").value = selectedFloor().name;

      const rooms = $("roomList");
      rooms.replaceChildren();

      selectedFloor().rooms.forEach(room => {
        const row = makeElement(
          "div", undefined, "room-entry"
        );

        const name = makeElement("strong", room.name);
        const edit = makeElement("button", "Edit");

        edit.type = "button";
        edit.onclick = () => {
          editRoomId = room.id;
          $("editRoomName").value = room.name;
          $("editRoomType").value = room.type;
          $("roomEditor").hidden = false;
        };

        row.append(name, edit);
        rooms.append(row);
      });

      const list = $("savedItems");
      list.replaceChildren();

      home.items.forEach(item => {
        const found = roomById(item.roomId);
        if (!found) return;

        const row = makeElement(
          "div", undefined, "saved-item"
        );

        const details = makeElement("div");
        details.append(makeElement("strong", item.name));
        details.append(makeElement(
          "small",
          `${found.floor.name} · ${found.room.name} · ${item.place}`
        ));

        const find = makeElement("button", "Show");
        find.type = "button";
        find.className = "btn outline";
        find.onclick = () => locateItem(item.id);

        row.append(details, find);
        list.append(row);
      });

      if (!home.items.length) {
        list.append(makeElement(
          "p", "No recorded items yet.", "muted"
        ));
      }

      $("floorCount").textContent = home.floors.length;

      $("roomCount").textContent = home.floors.reduce(
        (sum, f) => sum + f.rooms.length, 0
      );

      $("itemCount").textContent = home.items.length;
    }

    function update() {
      render();
      saveHome();
      if (house) buildHouse();
    }

    $("floorSelect").onchange = event => {
      floorId = event.target.value;
      $("roomEditor").hidden = true;
      editRoomId = null;
      render();
      if (mode === "selected") setMode("selected");
    };

    $("addFloor").onclick = () => {
      if (home.floors.length >= 6) {
        status("Maximum 6 floors.");
        return;
      }

      const floor = {
        id: uid(),
        name: "Floor " + home.floors.length,
        rooms: [makeRoom("bedroom", "Bedroom 1")]
      };

      home.floors.push(floor);
      floorId = floor.id;
      update();
      setMode("exploded");
    };

    $("deleteFloor").onclick = () => {
      if (home.floors.length <= 1) {
        status("At least one floor must remain.");
        return;
      }

      if (!confirm("Delete this floor and its recorded items?")) {
        return;
      }

      const removed = selectedFloor();
      const ids = new Set(removed.rooms.map(r => r.id));

      home.items = home.items.filter(
        item => !ids.has(item.roomId)
      );

      home.floors = home.floors.filter(
        f => f.id !== removed.id
      );

      floorId = home.floors[0].id;
      update();
      setMode("exterior");
    };

    $("renameFloor").onclick = () => {
      const name = $("floorName").value.trim();
      if (!name) return;

      selectedFloor().name = name;
      update();
    };

    $("addRoom").onclick = () => {
      const floor = selectedFloor();

      if (floor.rooms.length >= 12) {
        status("Maximum 12 rooms per floor.");
        return;
      }

      const type = $("roomType").value;
      const number = floor.rooms.filter(
        r => r.type === type
      ).length + 1;

      floor.rooms.push(makeRoom(
        type,
        $("newRoomName").value.trim() ||
        `${TYPES[type]} ${number}`
      ));

      $("newRoomName").value = "";
      update();
      setMode("selected");
    };

    $("applyRoom").onclick = () => {
      const found = roomById(editRoomId);
      if (!found) return;

      const name = $("editRoomName").value.trim();
      if (!name) return;

      found.room.name = name;
      found.room.type = $("editRoomType").value;
      update();
    };

    $("removeRoom").onclick = () => {
      const found = roomById(editRoomId);
      if (!found) return;

      if (!confirm("Delete this room and its items?")) return;

      found.floor.rooms = found.floor.rooms.filter(
        r => r.id !== editRoomId
      );

      home.items = home.items.filter(
        item => item.roomId !== editRoomId
      );

      editRoomId = null;
      $("roomEditor").hidden = true;
      update();
    };

    $("closeRoomEditor").onclick = () => {
      editRoomId = null;
      $("roomEditor").hidden = true;
    };

    const roomPatterns = {
      bedroom: "bedrooms?",
      living: "living rooms?",
      kitchen: "kitchens?",
      bathroom: "bathrooms?",
      garage: "garages?",
      storage: "storage rooms?|storage",
      office: "offices?",
      game: "game rooms?",
      gym: "gyms?",
      laundry: "laundry rooms?",
      dining: "dining rooms?",
      basement: "basement rooms?"
    };

    function parseRooms(text) {
      const found = [];

      for (const [type, pattern] of Object.entries(roomPatterns)) {
        const re = new RegExp(
          "(\\d+)\\s*(?:" + pattern + ")",
          "gi"
        );

        let match;

        while ((match = re.exec(text)) !== null) {
          const count = Math.min(8, Number(match[1]));

          for (let n = 0; n < count; n++) {
            const number =
              found.filter(r => r.type === type).length + 1;

            found.push(makeRoom(
              type, `${TYPES[type]} ${number}`
            ));
          }
        }
      }

      return found;
    }

    $("generateHome").onclick = () => {
      const raw = $("homePrompt").value.trim();

      if (!raw) {
        status("Describe your house first.");
        return;
      }

      const countMatch = raw.match(/(\d+)\s*floors?\b/i);
      const labels = [
        "Basement", "Ground Floor",
        "First Floor", "Second Floor",
        "Third Floor", "Fourth Floor",
        "Fifth Floor"
      ];

      const segments = [];

      labels.forEach(name => {
        const re = new RegExp(
          name.replace(" ", "\\s+") + "\\s*:",
          "i"
        );

        const match = re.exec(raw);

        if (match) {
          segments.push({
            name,
            start: match.index,
            end: match.index + match[0].length
          });
        }
      });

      segments.sort((a, b) => a.start - b.start);

      let floors = [];

      if (segments.length) {
        floors = segments.map((section, index) => {
          const next = segments[index + 1];
          const content = raw.slice(
            section.end,
            next ? next.start : raw.length
          );

          const rooms = parseRooms(content);

          return {
            id: uid(),
            name: section.name,
            rooms: rooms.length
              ? rooms
              : [makeRoom("custom", "Extra Room")]
          };
        });
      } else {
        const count = countMatch ? Number(countMatch[1]) : 2;

        if (count < 1 || count > 6) {
          status("Choose between 1 and 6 floors.");
          return;
        }

        floors = Array.from({length: count}, (_, index) => ({
          id: uid(),
          name: index === 0
            ? "Ground Floor"
            : `Floor ${index}`,
          rooms: index === 0
            ? (parseRooms(raw).slice(0, 12))
            : [makeRoom("bedroom", "Bedroom 1")]
        }));
      }

      if (
        floors.length > 6 ||
        floors.some(f => f.rooms.length > 12) ||
        (countMatch && Number(countMatch[1]) !== floors.length)
      ) {
        status("Check the floor count and room quantities.");
        return;
      }

      if (!confirm(
        "Generate a new home? Existing rooms and items will be replaced."
      )) return;

      home = {floors, items: []};
      floorId = floors[0].id;
      editRoomId = null;
      selectedItemId = null;

      update();
      setMode("exploded");
      status("Your home has been generated!");
    };

    function addItem({name, roomId, place}) {
      const found = roomById(roomId);

      name = String(name || "").trim();
      place = String(place || "").trim();

      if (
        !name || !place || !found ||
        name.length > 60 || place.length > 100
      ) {
        return {ok: false, error: "Invalid item details."};
      }

      const item = {id: uid(), name, roomId, place};

      home.items.push(item);
      selectedItemId = item.id;
      floorId = found.floor.id;

      if (!saveHome()) {
        home.items.pop();
        return {ok: false, error: "Saving failed."};
      }

      update();
      setMode("selected");
      status(`${name} saved in ${found.room.name}.`);

      return {ok: true, item};
    }

    function updateItem(itemId, roomId, place) {
      const item = home.items.find(i => i.id === itemId);
      const found = roomById(roomId);

      if (!item || !found || !String(place).trim()) {
        return {ok: false, error: "Item or room not found."};
      }

      const oldRoom = item.roomId;
      const oldPlace = item.place;

      item.roomId = roomId;
      item.place = String(place).trim().slice(0, 100);
      floorId = found.floor.id;
      selectedItemId = item.id;

      if (!saveHome()) {
        item.roomId = oldRoom;
        item.place = oldPlace;
        return {ok: false, error: "Saving failed."};
      }

      update();
      setMode("selected");

      return {ok: true, item};
    }

    function locateItem(id) {
      const item = home.items.find(i => i.id === id);
      if (!item) return;

      const found = roomById(item.roomId);
      if (!found) return;

      floorId = found.floor.id;
      selectedItemId = item.id;

      render();
      setMode("selected");

      status(
        `${item.name}: ${found.floor.name} / ` +
        `${found.room.name} / ${item.place}`
      );
    }

    function findItems(query) {
      const value = String(query || "").toLowerCase().trim();

      if (!value) return [];

      return home.items.filter(item =>
        item.name.toLowerCase().includes(value)
      );
    }

    $("findButton").onclick = () => {
      const matches = findItems($("findInput").value);

      if (matches.length) locateItem(matches[0].id);
      else status("Item not found.");
    };

    $("findInput").onkeydown = event => {
      if (event.key === "Enter") $("findButton").click();
    };

    function fillItemFloors() {
      const select = $("itemFloor");
      select.replaceChildren();

      home.floors.forEach(f => {
        addOption(select, f.id, f.name);
      });

      select.value = floorId;
      fillItemRooms();
    }

    function fillItemRooms() {
      const select = $("itemRoom");
      select.replaceChildren();

      const floor = home.floors.find(
        f => f.id === $("itemFloor").value
      );

      if (!floor) return;

      floor.rooms.forEach(room => {
        addOption(select, room.id, room.name);
      });
    }

    $("itemFloor").onchange = fillItemRooms;

    $("openItemModal").onclick = () => {
      fillItemFloors();
      $("itemModal").hidden = false;
    };

    $("closeItemModal").onclick = () => {
      $("itemModal").hidden = true;
    };

    $("itemModal").onclick = event => {
      if (event.target === $("itemModal")) {
        $("itemModal").hidden = true;
      }
    };

    $("itemForm").onsubmit = event => {
      event.preventDefault();

      const result = addItem({
        name: $("itemName").value,
        roomId: $("itemRoom").value,
        place: $("itemPlace").value
      });

      if (result.ok) {
        $("itemForm").reset();
        $("itemModal").hidden = true;
      } else {
        status(result.error);
      }
    };

    window.FindItHome = {
      getData() {
        return JSON.parse(JSON.stringify(home));
      },
      addItem,
      updateItem,
      findItems,
      locateItem,
      selectFloor(id) {
        if (!home.floors.some(f => f.id === id)) return false;
        floorId = id;
        render();
        setMode("selected");
        return true;
      },
      setMode
    };

    render();

    if (!window.THREE) {
      $("threeCanvas").textContent =
        "Three.js unavailable. Check your internet connection.";
      return;
    }

    // 3D HOME

    function mat(color, options = {}) {
      return new THREE.MeshStandardMaterial({
        color,
        roughness: .83,
        ...options
      });
    }

    function box(parent, w, h, d, x, y, z, color) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        mat(color)
      );

      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);

      return mesh;
    }

    function cylinder(parent, r, h, x, y, z, color) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r, h, 20),
        mat(color)
      );

      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      parent.add(mesh);

      return mesh;
    }

    function sphere(parent, r, x, y, z, color) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(r, 16, 12),
        mat(color)
      );

      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      parent.add(mesh);

      return mesh;
    }

    function textLabel(text) {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 100;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#273340";
      ctx.fillRect(0, 0, 512, 100);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "bold 30px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(text, 256, 50, 470);

      const texture = new THREE.CanvasTexture(canvas);

      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: false
        })
      );

      sprite.scale.set(2.5, .5, 1);
      return sprite;
    }

    function plant(parent, x, z) {
      cylinder(parent, .2, .4, x, .2, z, "#ab8766");
      cylinder(parent, .04, .7, x, .7, z, "#60804f");
      sphere(parent, .4, x, 1.1, z, "#61885e");
      sphere(parent, .3, x + .2, .9, z, "#80a475");
    }

    function furniture(group, type) {
      const wood = "#a17a57";
      const dark = "#70513a";
      const beige = "#d7c5b2";

      if (type === "bedroom") {
        box(group, 2.2, .35, 2.2, -.4, .3, -.2, dark);
        box(group, 2, .24, 2, -.4, .58, -.2, "#f4efe6");
        box(group, 2.2, .8, .15, -.4, .7, -1.4, beige);
        box(group, .75, .15, .45, -1, .8, -.95, "#ffffff");
        box(group, .75, .15, .45, .2, .8, -.95, "#ffffff");
        box(group, .9, 1.8, .7, 1.6, .9, -1.2, wood);
      } else if (type === "living") {
        box(group, 2.3, .4, 1, -.7, .35, -1, beige);
        box(group, 2.3, .7, .2, -.7, .7, -1.5, "#bda994");
        box(group, 1.4, .14, .8, -.2, .45, .5, wood);
        box(group, 1.4, .4, .4, 1.3, .22, 1.5, dark);
        box(group, 1.2, .8, .06, 1.3, .9, 1.5, "#303438");
        plant(group, 1.5, -.8);
      } else if (type === "kitchen") {
        box(group, 3.5, .85, .65, 0, .45, -1.6, "#eee9e1");
        box(group, 3.6, .12, .75, 0, .93, -1.6, "#aab1ae");
        box(group, 1.8, .8, 1, .1, .4, .6, wood);
        box(group, .8, 1.8, .7, 1.6, .9, -.4, "#d5dcdf");
      } else if (type === "bathroom") {
        box(group, 1.5, .5, 1.2, -1, .3, -1, "#f8f8f6");
        box(group, 1.3, .08, 1, -1, .6, -1, "#b9dfe6");
        box(group, 1.2, .7, .5, .9, .4, -1.5, wood);
        cylinder(group, .3, .5, 1.1, .4, .7, "#ffffff");
      } else if (type === "garage") {
        box(group, 2.6, .3, 1.3, -.2, .4, .2, "#687780");
        box(group, 1.3, .5, 1.1, -.4, .7, .2, "#aab8c4");

        [-1.1, .8].forEach(x => {
          [-.3, .7].forEach(z => {
            cylinder(group, .2, .15, x, .25, z, "#262a30");
          });
        });
      } else if (type === "storage" || type === "basement") {
        [-1.3, 1.3].forEach(x => {
          box(group, .9, 1.7, .6, x, .85, -1.2, dark);

          [.35, .85, 1.35].forEach(y => {
            box(group, .8, .34, .5, x, y, -1.2, "#c9a47c");
          });
        });
      } else if (type === "office" || type === "game") {
        box(group, 2.2, .15, .9, 0, .8, -1.2, wood);
        box(group, 1.1, .7, .08, 0, 1.25, -1.4, "#30343a");
        box(group, .7, .6, .6, 0, .35, .3, "#6e6b70");
      } else if (type === "gym") {
        box(group, 2, .15, .7, 0, .45, 0, "#4b4d50");
        cylinder(group, .12, 1.6, 0, .2, -1.2, "#555b60");
      } else if (type === "laundry") {
        [-.8, .3].forEach(x => {
          box(group, .9, .9, .85, x, .5, -1.2, "#e6e8e7");
          cylinder(group, .28, .09, x, .5, -.7, "#829da9");
        });
      } else if (type === "dining") {
        box(group, 2.3, .15, 1.3, 0, .75, 0, wood);
        [-1.1, 1.1].forEach(z => {
          [-.7, .7].forEach(x => {
            box(group, .5, .4, .45, x, .4, z, beige);
          });
        });
      } else {
        box(group, 1.7, .5, .8, 0, .3, -.8, wood);
        plant(group, 1.4, .9);
      }
    }

    function roomModel(parent, room, x, z) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      parent.add(group);

      const floorColor = ["garage", "bathroom"].includes(room.type)
        ? "#dfddd8"
        : "#d9b494";

      box(group, 4.6, .15, 4.3, 0, -.13, 0, floorColor);
      box(group, 4.8, 2.3, .14, 0, 1.15, -2.25, "#f2eee7");
      box(group, .14, 2.3, 4.5, -2.4, 1.15, 0, "#f2eee7");

      box(group, 1.4, .9, .05, 0, 1.5, -2.15, "#a9d2dc");

      furniture(group, room.type);

      const tag = textLabel(room.name);
      tag.position.y = 2.65;
      group.add(tag);

      home.items
        .filter(item => item.roomId === room.id)
        .forEach((item, index) => {
          const x = -.7 + (index % 3) * .65;
          const z = .8 + Math.floor(index / 3) * .5;

          cylinder(group, .18, .06, x, .1, z, "#8863c0");
          sphere(group, .12, x, .26, z, "#f4d76d");

          const itemTag = textLabel(item.name);
          itemTag.position.set(x, 1.65, z);
          group.add(itemTag);
        });
    }

    function tree(parent, x, z) {
      cylinder(parent, .17, 1.5, x, .75, z, "#76563b");
      sphere(parent, .8, x, 1.9, z, "#69905e");
      sphere(parent, .62, x + .35, 1.7, z, "#81a875");
      sphere(parent, .6, x - .35, 1.7, z, "#709b68");
    }

    function makeGarden(width, depth) {
      clearGroup(garden);

      box(
        garden, width + 20, .14, depth + 20,
        0, -.32, 0, "#82aa70"
      );

      const left = -width / 2;
      const right = width / 2;
      const front = depth / 2;
      const back = -depth / 2;

      tree(garden, left - 5, back - 4);
      tree(garden, right + 6, back - 4);
      tree(garden, left - 5, front + 4);
      tree(garden, right + 6, front + 4);

      for (let i = 0; i < 9; i++) {
        const x = -3.2 + i * .8;

        cylinder(garden, .02, .22, x, .11, front + 3, "#4b8247");

        sphere(
          garden, .11, x, .25, front + 3,
          i % 2 ? "#f5a5ba" : "#ffdc6d"
        );
      }

      const poolX = right + 4;
      const poolZ = back + 1.5;

      box(garden, 5.3, .2, 3.4, poolX, -.18, poolZ, "#e5ddd0");
      box(garden, 4.7, .07, 2.85, poolX, -.03, poolZ, "#58bed4");

      const tx = left - 4.2;
      const tz = front + 2;

      cylinder(garden, 1.3, .12, tx, .65, tz, "#3e4247");
      cylinder(garden, 1.15, .04, tx, .73, tz, "#202329");

      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4;

        cylinder(
          garden, .035, 1.6,
          tx + Math.cos(a) * 1.2,
          1.45,
          tz + Math.sin(a) * 1.2,
          "#5d6065"
        );
      }

      sphere(garden, .23, left - 2.2, .23, front + 4, "#ed963a");
      plant(garden, right + 1.5, front + 2);
    }

    function clearGroup(group) {
      if (!group) return;

      const materials = new Set();
      const textures = new Set();

      group.traverse(object => {
        if (object.geometry) object.geometry.dispose();

        if (object.material) {
          const materialsArray = Array.isArray(object.material)
            ? object.material
            : [object.material];

          materialsArray.forEach(m => {
            materials.add(m);
            if (m.map) textures.add(m.map);
          });
        }
      });

      materials.forEach(m => m.dispose());
      textures.forEach(t => t.dispose());

      group.clear();
    }

    function buildHouse() {
      clearGroup(house);
      floorGroups = [];

      const maxRooms = Math.max(
        1,
        ...home.floors.map(f => f.rooms.length)
      );

      const columns = Math.ceil(Math.sqrt(maxRooms));
      const rows = Math.ceil(maxRooms / columns);

      const width = columns * 4.8;
      const depth = rows * 4.5;
      const height = home.floors.length * 3.15;

      home.floors.forEach((floor, index) => {
        const group = new THREE.Group();
        group.position.y = index * 3.15;
        group.userData.target = new THREE.Vector3(
          0, index * 3.15, 0
        );

        house.add(group);
        floorGroups.push(group);

        box(
          group, width + .15, .28, depth + .15,
          0, -.23, 0, "#e6e3dc"
        );

        floor.rooms.forEach((room, i) => {
          const col = i % columns;
          const row = Math.floor(i / columns);

          const x = (col - (columns - 1) / 2) * 4.8;
          const z = (row - (rows - 1) / 2) * 4.5;

          roomModel(group, room, x, z);
        });

        const name = textLabel(floor.name);
        name.position.set(width / 2 + 1.8, 1.5, 0);
        group.add(name);
      });

      facade = new THREE.Group();
      house.add(facade);

      box(
        facade, width + .4, height, .18,
        0, height / 2 - .1,
        depth / 2 + .12, "#eee9e0"
      );

      box(
        facade, .18, height, depth + .4,
        width / 2 + .12, height / 2 - .1,
        0, "#eee9e0"
      );

      for (let f = 0; f < home.floors.length; f++) {
        for (let c = 0; c < columns; c++) {
          const x = (c - (columns - 1) / 2) * 4.8;

          box(
            facade, 1.4, 1.1, .04,
            x, f * 3.15 + 1.5,
            depth / 2 + .22, "#9dcbd5"
          );
        }
      }

      box(
        facade, 1.3, 2.2, .12,
        -width / 2 + 1.3, 1.05,
        depth / 2 + .25, "#98714e"
      );

      roof = new THREE.Group();
      roof.position.y = height;
      house.add(roof);

      box(
        roof, width + 1, .35, depth + 1,
        0, .06, 0, "#725b4b"
      );

      makeGarden(width, depth);
      applyTargets();
    }

    function applyTargets() {
      const selected = home.floors.findIndex(
        f => f.id === floorId
      );

      floorGroups.forEach((group, index) => {
        const destination = group.userData.target;

        if (mode === "exterior") {
          destination.set(0, index * 3.15, 0);
          group.visible = true;
        } else if (mode === "exploded") {
          destination.set(
            (index % 2 ? 1 : -1) * (5.5 + index),
            index * 4.5 + 1,
            -index * .8
          );

          group.visible = true;
        } else {
          destination.set(0, 0, 0);
          group.visible = index === selected;
        }
      });

      if (facade) facade.visible = mode === "exterior";
      if (roof) roof.visible = mode === "exterior";
      if (garden) garden.visible = mode !== "selected";

      $("viewExterior").classList.toggle(
        "active", mode === "exterior"
      );

      $("viewExploded").classList.toggle(
        "active", mode === "exploded"
      );

      $("viewSelected").classList.toggle(
        "active", mode === "selected"
      );
    }

    function setMode(next) {
      mode = next;
      applyTargets();

      if (!desiredTarget) return;

      if (mode === "selected") {
        desiredDistance = 17;
        desiredTarget.set(0, 0, 0);
      } else if (mode === "exploded") {
        desiredDistance = Math.max(
          40, home.floors.length * 14
        );

        desiredTarget.set(
          0, home.floors.length * 2, 0
        );
      } else {
        desiredDistance = Math.max(
          35, home.floors.length * 12
        );

        desiredTarget.set(
          0, home.floors.length * 1.5, 0
        );
      }
    }

    $("viewExterior").onclick = () => setMode("exterior");
    $("viewExploded").onclick = () => setMode("exploded");
    $("viewSelected").onclick = () => setMode("selected");

    $("viewTop").onclick = () => {
      angle = 0;
      tilt = .035;
    };

    $("viewReset").onclick = () => {
      angle = .72;
      tilt = .85;
      setMode(mode);
    };

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#a8c29b");

      target = new THREE.Vector3();
      desiredTarget = new THREE.Vector3();

      camera = new THREE.PerspectiveCamera(43, 1, .1, 500);

      renderer = new THREE.WebGLRenderer({
        antialias: true
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
      );

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      $("threeCanvas").append(renderer.domElement);

      scene.add(new THREE.HemisphereLight(
        "#ffffff", "#a3a28c", 2.1
      ));

      const sunlight = new THREE.DirectionalLight(
        "#fff4e0", 2.1
      );

      sunlight.position.set(15, 24, 12);
      sunlight.castShadow = true;
      sunlight.shadow.mapSize.set(2048, 2048);
      sunlight.shadow.camera.left = -60;
      sunlight.shadow.camera.right = 60;
      sunlight.shadow.camera.top = 60;
      sunlight.shadow.camera.bottom = -60;
      scene.add(sunlight);

      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(300, 300),
        mat("#80a96f")
      );

      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -.43;
      ground.receiveShadow = true;
      scene.add(ground);

      house = new THREE.Group();
      garden = new THREE.Group();

      scene.add(house);
      scene.add(garden);

      const canvas = renderer.domElement;

      canvas.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;

        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        canvas.setPointerCapture(event.pointerId);
      });

      canvas.addEventListener("pointermove", event => {
        if (!dragging) return;

        angle -= (event.clientX - lastX) * .008;

        tilt = THREE.MathUtils.clamp(
          tilt + (event.clientY - lastY) * .008,
          .04, 1.48
        );

        lastX = event.clientX;
        lastY = event.clientY;
      });

      canvas.addEventListener("pointerup", () => {
        dragging = false;
      });

      canvas.addEventListener("pointercancel", () => {
        dragging = false;
      });

      canvas.addEventListener("wheel", event => {
        event.preventDefault();

        const next = THREE.MathUtils.clamp(
          distance + event.deltaY * .025,
          7, 110
        );

        distance = next;
        desiredDistance = next;

        if (mode === "exterior" && next < 27) {
          setMode("exploded");
          distance = 27;
          desiredDistance = 27;
        } else if (mode === "exploded" && next > 60) {
          setMode("exterior");
          distance = 60;
          desiredDistance = 60;
        }
      }, {passive: false});

      function resize() {
        const element = $("threeCanvas");
        const w = element.clientWidth;
        const h = element.clientHeight;

        if (!w || !h) return;

        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }

      if ("ResizeObserver" in window) {
        new ResizeObserver(resize).observe($("threeCanvas"));
      } else {
        window.addEventListener("resize", resize);
      }

      buildHouse();
      setMode("exterior");
      resize();

      function animate() {
        requestAnimationFrame(animate);

        distance += (desiredDistance - distance) * .06;
        target.lerp(desiredTarget, .06);

        floorGroups.forEach(group => {
          group.position.lerp(group.userData.target, .07);
        });

        const s = Math.sin(tilt);

        camera.position.set(
          target.x + distance * s * Math.sin(angle),
          target.y + distance * Math.cos(tilt),
          target.z + distance * s * Math.cos(angle)
        );

        camera.lookAt(target);
        renderer.render(scene, camera);
      }

      animate();

    } catch (error) {
      console.error(error);
      status("3D viewer could not start.");
    }
  }
});
