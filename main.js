
document.addEventListener("DOMContentLoaded", function () {

  function byId(id) {
    return document.getElementById(id);
  }

  function showMessage(id, message) {
    var element = byId(id);
    if (element) {
      element.textContent = message;
    }
  }

  var page = document.body.dataset.page || "home";

  var pages = [
    { id: "home", name: "Home", url: "index.html" },
    { id: "how", name: "How It Works", url: "how.html" },
    { id: "dashboard", name: "Dashboard", url: "dashboard.html" },
    { id: "features", name: "Features", url: "features.html" },
    { id: "about", name: "About", url: "about.html" }
  ];

  var navLinks = "";

  pages.forEach(function (item) {
    navLinks += `
      <li class="nav-item">
        <a href="${item.url}"
           class="nav-link ${page === item.id ? "active" : ""}">
          ${item.name}
        </a>
      </li>
    `;
  });

  byId("site-header").innerHTML = `
    <nav class="navbar navbar-expand-lg fixed-top site-nav"
         data-bs-theme="dark">

      <div class="container">

        <a href="index.html" class="navbar-brand brand">
          <img src="logo.png" alt="FIND IT Logo">
          FIND <span>IT.</span>
        </a>

        <button class="navbar-toggler" type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navMenu"
                aria-controls="navMenu"
                aria-expanded="false"
                aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navMenu">

          <ul class="navbar-nav mx-auto gap-lg-2">
            ${navLinks}
          </ul>

          <div class="guest-actions d-flex gap-2">
            <button type="button" class="btn btn-outline-custom"
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal">
              Log In
            </button>

            <button type="button" class="btn btn-glow"
                    data-bs-toggle="modal"
                    data-bs-target="#signupModal">
              Sign Up
            </button>
          </div>

          <div class="user-actions dropdown d-none">
            <button class="avatar-button dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="My Account">
              <span class="avatar-letter">U</span>
              <img class="avatar-photo" alt="Profile">
            </button>

            <div class="dropdown-menu dropdown-menu-end user-menu">

              <div class="px-3 py-2">
                <strong class="account-name d-block"></strong>
                <small class="account-email d-block"></small>
              </div>

              <div class="dropdown-divider"></div>

              <a href="dashboard.html" class="dropdown-item">
                📦 My Dashboard
              </a>

              <button class="dropdown-item" type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#settingsModal">
                ⚙️ Account Settings
              </button>

              <button class="dropdown-item logout-button" type="button">
                ↪ Sign Out
              </button>

            </div>
          </div>

        </div>
      </div>
    </nav>
  `;

  byId("site-footer").innerHTML = `
    <footer class="site-footer">
      <div class="container">

        <div class="row g-4">
          <div class="col-md-5">
            <h3>🔎 FIND <span>IT.</span></h3>
            <p>Less searching. More living.</p>
          </div>

          <div class="col-md-7 footer-links">
            <a href="index.html">Home</a>
            <a href="how.html">How It Works</a>
            <a href="dashboard.html">Dashboard</a>
            <a href="features.html">Features</a>
            <a href="about.html">About</a>
          </div>
        </div>

        <div class="footer-line"></div>

        <div class="d-flex flex-wrap justify-content-between gap-3">
          <small>© 2026 FIND IT. All rights reserved.</small>
          <small>Made with 💜 and creativity.</small>
        </div>

      </div>
    </footer>
  `;

  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal fade" id="signupModal" tabindex="-1"
         aria-labelledby="signupTitle" aria-hidden="true">

      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">

          <div class="modal-header border-0">
            <h2 id="signupTitle" class="modal-title">
              ✦ Join FIND IT.
            </h2>

            <button class="btn-close btn-close-white"
                    type="button"
                    data-bs-dismiss="modal"
                    aria-label="Close">
            </button>
          </div>

          <div class="modal-body">
            <p class="muted">
              Create your personal demo profile.
            </p>

            <form id="signupForm">

              <label for="signupName">Full Name</label>
              <input id="signupName" class="form-control"
                     type="text" maxlength="60" required
                     placeholder="Your name">

              <label for="signupEmail">Email Address</label>
              <input id="signupEmail" class="form-control"
                     type="email" required
                     placeholder="you@example.com">

              <label for="signupPhoto">Profile Picture (Optional)</label>
              <div class="d-flex align-items-center gap-3">

                <div class="photo-preview">
                  <span id="previewLetter">U</span>
                  <img id="previewImage" alt="Profile Preview">
                </div>

                <input id="signupPhoto" class="form-control"
                       type="file"
                       accept="image/jpeg,image/png,image/webp">
              </div>

              <p id="signupError" class="form-error" role="status"></p>

              <button class="btn btn-glow w-100 mt-3" type="submit">
                Create Account →
              </button>
            </form>

            <p class="small muted mt-3">
              Local demo. No password or secure authentication.
            </p>
          </div>

        </div>
      </div>
    </div>

    <div class="modal fade" id="loginModal" tabindex="-1"
         aria-labelledby="loginTitle" aria-hidden="true">

      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">

          <div class="modal-header border-0">
            <h2 id="loginTitle" class="modal-title">
              Welcome Back!
            </h2>

            <button class="btn-close btn-close-white"
                    type="button"
                    data-bs-dismiss="modal"
                    aria-label="Close">
            </button>
          </div>

          <div class="modal-body">
            <form id="loginForm">

              <label for="loginEmail">Email Address</label>
              <input id="loginEmail" class="form-control"
                     type="email" required
                     placeholder="you@example.com">

              <p id="loginError" class="form-error" role="status"></p>

              <button class="btn btn-glow w-100 mt-3" type="submit">
                Log In →
              </button>
            </form>

            <p class="small muted mt-3">
              Opens the saved demo profile in this browser.
            </p>
          </div>

        </div>
      </div>
    </div>

    <div class="modal fade" id="settingsModal" tabindex="-1"
         aria-labelledby="settingsTitle" aria-hidden="true">

      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content custom-modal">

          <div class="modal-header border-0">
            <h2 id="settingsTitle" class="modal-title">
              Account Settings
            </h2>

            <button class="btn-close btn-close-white"
                    type="button"
                    data-bs-dismiss="modal"
                    aria-label="Close">
            </button>
          </div>

          <div class="modal-body">
            <form id="settingsForm">

              <label for="settingsName">Edit Name</label>
              <input id="settingsName" class="form-control"
                     maxlength="60" required>

              <label for="settingsEmail">Edit Email</label>
              <input id="settingsEmail" class="form-control"
                     type="email" required>

              <label for="settingsPhoto">Change Profile Picture</label>
              <input id="settingsPhoto" class="form-control"
                     type="file"
                     accept="image/jpeg,image/png,image/webp">

              <p id="settingsError" class="form-error" role="status"></p>

              <button class="btn btn-glow w-100 mt-3" type="submit">
                Save Changes
              </button>
            </form>

            <div class="settings-buttons">
              <button id="removePhoto" class="btn btn-outline-custom"
                      type="button">
                Remove Photo
              </button>

              <button id="exportProfile" class="btn btn-outline-custom"
                      type="button">
                Export Data
              </button>

              <button id="deleteProfile" class="btn btn-outline-danger"
                      type="button">
                Delete Profile
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `);

  if (!window.bootstrap || !bootstrap.Modal) {
    console.error("Bootstrap JS is missing.");
    alert(
      "Bootstrap could not load. Check your internet connection."
    );
    return;
  }

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var nav = document.querySelector(".site-nav");
  var progressBar = byId("scrollProgress");

  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 30);

    var scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    var percentage = scrollable > 0
      ? window.scrollY / scrollable * 100
      : 0;

    if (progressBar) {
      progressBar.style.width = percentage + "%";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var reveals = document.querySelectorAll(
    ".reveal-left, .reveal-right, .reveal-up, .reveal-zoom"
  );

  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -25px 0px"
    });

    reveals.forEach(function (element, index) {
      element.style.setProperty(
        "--delay",
        (index % 3) * 110 + "ms"
      );

      observer.observe(element);
    });
  } else {
    reveals.forEach(function (element) {
      element.classList.add("visible");
    });
  }

  if (
    !reduceMotion &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    document.querySelectorAll(".tilt-card").forEach(function (card) {
      card.addEventListener("mousemove", function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width;
        var y = (event.clientY - rect.top) / rect.height;

        card.style.animation = "none";

        card.style.transform =
          "perspective(1000px) rotateX(" +
          ((0.5 - y) * 12) +
          "deg) rotateY(" +
          ((x - 0.5) * 15) +
          "deg) scale(1.025)";

        card.style.setProperty("--mouse-x", x * 100 + "%");
        card.style.setProperty("--mouse-y", y * 100 + "%");
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";

        if (card.classList.contains("dashboard-preview")) {
          card.style.animation =
            "dashboardFloat 7s ease-in-out infinite";
        } else {
          card.style.animation = "";
        }
      });
    });
  }

  var profile = null;
  var loggedIn = false;
  var items = [];
  var editingId = null;

  try {
    var saved = localStorage.getItem("findit-profile");

    profile = saved ? JSON.parse(saved) : null;

    if (
      !profile ||
      typeof profile.name !== "string" ||
      typeof profile.email !== "string" ||
      !profile.name.trim() ||
      !profile.email.trim()
    ) {
      profile = null;
    }

    loggedIn = !!profile &&
      localStorage.getItem("findit-session") === "active";
  } catch (error) {
    profile = null;
    loggedIn = false;
  }

  function itemsKey(data) {
    var p = data || profile;

    if (!p) {
      return "";
    }

    return "findit-items-" + p.email.trim().toLowerCase();
  }

  function readItems() {
    if (!loggedIn || !profile) {
      items = [];
      return;
    }

    try {
      var saved = JSON.parse(localStorage.getItem(itemsKey()));
      items = Array.isArray(saved) ? saved : [];
    } catch (error) {
      items = [];
    }
  }

  function saveItems() {
    try {
      localStorage.setItem(itemsKey(), JSON.stringify(items));
      return true;
    } catch (error) {
      return false;
    }
  }

  function saveProfile(data) {
    try {
      localStorage.setItem("findit-profile", JSON.stringify(data));
      return true;
    } catch (error) {
      return false;
    }
  }

  function hideModal(id) {
    var element = byId(id);

    if (element) {
      bootstrap.Modal.getOrCreateInstance(element).hide();
    }
  }

  function showModal(id) {
    var element = byId(id);

    if (element) {
      bootstrap.Modal.getOrCreateInstance(element).show();
    }
  }

  function updateAvatar(image, initial, data) {
    if (!image || !initial || !data) {
      return;
    }

    initial.textContent =
      data.name.trim().charAt(0).toUpperCase() || "U";

    if (data.photo) {
      image.src = data.photo;
      image.style.display = "block";
      initial.style.display = "none";

      image.onerror = function () {
        image.style.display = "none";
        initial.style.display = "block";
      };
    } else {
      image.removeAttribute("src");
      image.style.display = "none";
      initial.style.display = "block";
    }
  }

  function updateAccount() {
    document.querySelectorAll(".guest-actions").forEach(
      function (element) {
        element.classList.toggle("d-none", loggedIn);
      }
    );

    document.querySelectorAll(".user-actions").forEach(
      function (element) {
        element.classList.toggle("d-none", !loggedIn);
      }
    );

    if (loggedIn && profile) {
      document.querySelectorAll(".account-name").forEach(
        function (element) {
          element.textContent = profile.name;
        }
      );

      document.querySelectorAll(".account-email").forEach(
        function (element) {
          element.textContent = profile.email;
        }
      );

      document.querySelectorAll(".avatar-button").forEach(
        function (button) {
          updateAvatar(
            button.querySelector(".avatar-photo"),
            button.querySelector(".avatar-letter"),
            profile
          );
        }
      );
    }

    if (byId("itemsGrid")) {
      readItems();
      renderItems();
    }
  }

  function readPhoto(file, success, failure) {
    if (!file) {
      success("");
      return;
    }

    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp"
    ) {
      failure("Choose a JPG, PNG or WebP picture.");
      return;
    }

    if (file.size > 600000) {
      failure("Please use a picture smaller than 600 KB.");
      return;
    }

    var reader = new FileReader();

    reader.onload = function () {
      success(reader.result);
    };

    reader.onerror = function () {
      failure("Could not read the picture.");
    };

    reader.readAsDataURL(file);
  }

  function startSession() {
    try {
      localStorage.setItem("findit-session", "active");
      loggedIn = true;
      return true;
    } catch (error) {
      return false;
    }
  }

  byId("signupForm").addEventListener("submit", function (event) {
    event.preventDefault();

    showMessage("signupError", "");

    if (profile) {
      showMessage(
        "signupError",
        "A local profile already exists. Please use Log In."
      );
      return;
    }

    var name = byId("signupName").value.trim();
    var emailField = byId("signupEmail");
    var email = emailField.value.trim().toLowerCase();

    if (!name || !emailField.validity.valid) {
      showMessage("signupError", "Enter a valid name and email.");
      return;
    }

    var button = this.querySelector("[type=submit]");
    button.disabled = true;

    readPhoto(
      byId("signupPhoto").files[0],

      function (photo) {
        var newProfile = {
          name: name,
          email: email,
          photo: photo
        };

        if (!saveProfile(newProfile)) {
          showMessage(
            "signupError",
            "Could not save profile. Try a smaller picture."
          );
          button.disabled = false;
          return;
        }

        profile = newProfile;

        if (!startSession()) {
          showMessage(
            "signupError",
            "Profile saved, but session could not start."
          );
          button.disabled = false;
          return;
        }

        updateAccount();
        hideModal("signupModal");
        button.disabled = false;
        byId("signupForm").reset();

        byId("previewImage").style.display = "none";
        byId("previewLetter").style.display = "block";
        byId("previewLetter").textContent = "U";
      },

      function (message) {
        showMessage("signupError", message);
        button.disabled = false;
      }
    );
  });

  byId("signupName").addEventListener("input", function () {
    byId("previewLetter").textContent =
      this.value.trim().charAt(0).toUpperCase() || "U";
  });

  byId("signupPhoto").addEventListener("change", function () {
    var file = this.files[0];

    if (!file) {
      byId("previewImage").style.display = "none";
      byId("previewLetter").style.display = "block";
      return;
    }

    readPhoto(
      file,

      function (photo) {
        byId("previewImage").src = photo;
        byId("previewImage").style.display = "block";
        byId("previewLetter").style.display = "none";
        showMessage("signupError", "");
      },

      function (message) {
        showMessage("signupError", message);
      }
    );
  });

  byId("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    var email = byId("loginEmail").value.trim().toLowerCase();

    if (!profile || profile.email.toLowerCase() !== email) {
      showMessage(
        "loginError",
        "No saved local profile matches this email."
      );
      return;
    }

    if (!startSession()) {
      showMessage("loginError", "Browser storage is unavailable.");
      return;
    }

    showMessage("loginError", "");

    updateAccount();
    hideModal("loginModal");
  });

  document.querySelectorAll(".logout-button").forEach(
    function (button) {
      button.addEventListener("click", function () {
        loggedIn = false;

        try {
          localStorage.removeItem("findit-session");
        } catch (error) {}

        updateAccount();
      });
    }
  );

  byId("settingsModal").addEventListener(
    "show.bs.modal",
    function (event) {
      if (!loggedIn || !profile) {
        event.preventDefault();
        return;
      }

      byId("settingsName").value = profile.name;
      byId("settingsEmail").value = profile.email;
      byId("settingsPhoto").value = "";

      showMessage("settingsError", "");
    }
  );

  byId("settingsForm").addEventListener("submit", function (event) {
    event.preventDefault();

    if (!profile || !loggedIn) {
      return;
    }

    var name = byId("settingsName").value.trim();
    var emailField = byId("settingsEmail");
    var email = emailField.value.trim().toLowerCase();

    if (!name || !emailField.validity.valid) {
      showMessage(
        "settingsError",
        "Please enter a valid name and email."
      );
      return;
    }

    var button = this.querySelector("[type=submit]");
    button.disabled = true;

    function finish(photo) {
      var previous = profile;
      var oldKey = itemsKey(previous);
      var next = {
        name: name,
        email: email,
        photo: photo
      };
      var newKey = itemsKey(next);

      try {
        if (oldKey !== newKey) {
          var oldItems = localStorage.getItem(oldKey);

          if (oldItems !== null) {
            localStorage.setItem(newKey, oldItems);
          }
        }

        localStorage.setItem(
          "findit-profile",
          JSON.stringify(next)
        );

        if (oldKey !== newKey) {
          localStorage.removeItem(oldKey);
        }
      } catch (error) {
        showMessage(
          "settingsError",
          "Could not save changes. Check browser storage."
        );
        button.disabled = false;
        return;
      }

      profile = next;

      updateAccount();
      hideModal("settingsModal");
      button.disabled = false;
    }

    var file = byId("settingsPhoto").files[0];

    if (file) {
      readPhoto(
        file,
        finish,
        function (message) {
          showMessage("settingsError", message);
          button.disabled = false;
        }
      );
    } else {
      finish(profile.photo || "");
    }
  });

  byId("removePhoto").addEventListener("click", function () {
    if (!profile || !loggedIn) {
      return;
    }

    var changed = {
      name: profile.name,
      email: profile.email,
      photo: ""
    };

    if (saveProfile(changed)) {
      profile = changed;
      updateAccount();
      showMessage("settingsError", "Profile picture removed.");
    } else {
      showMessage("settingsError", "Could not remove picture.");
    }
  });

  byId("exportProfile").addEventListener("click", function () {
    if (!profile || !loggedIn) {
      return;
    }

    readItems();

    var data = {
      profile: profile,
      items: items
    };

    var blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");

    link.href = url;
    link.download = "findit-backup.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  });

  byId("deleteProfile").addEventListener("click", function () {
    if (!profile || !loggedIn) {
      return;
    }

    if (!confirm("Delete your local profile and all saved items?")) {
      return;
    }

    try {
      localStorage.removeItem(itemsKey());
      localStorage.removeItem("findit-profile");
      localStorage.removeItem("findit-session");
    } catch (error) {
      alert("Could not delete browser data.");
      return;
    }

    profile = null;
    loggedIn = false;
    items = [];

    updateAccount();
    hideModal("settingsModal");
  });

  var walkNext = byId("walkNext");

  if (walkNext) {
    var walkStep = 0;

    var steps = [
      {
        icon: "📦",
        title: "Add Your Item",
        description: "Give your belonging a name."
      },
      {
        icon: "📍",
        title: "Save Its Location",
        description: "Enter the last known location."
      },
      {
        icon: "🔎",
        title: "Find It Again",
        description: "See the location you recorded."
      }
    ];

    function updateWalkthrough() {
      var data = steps[walkStep];

      byId("walkStepLabel").textContent =
        "STEP " + (walkStep + 1) + " OF 3";

      byId("walkProgressBar").style.width =
        ((walkStep + 1) / 3 * 100) + "%";

      byId("walkIcon").textContent = data.icon;
      byId("walkTitle").textContent = data.title;
      byId("walkDescription").textContent = data.description;

      byId("demoLocationGroup").classList.toggle(
        "d-none",
        walkStep === 0
      );

      byId("walkResult").classList.toggle(
        "d-none",
        walkStep !== 2
      );

      byId("walkBack").disabled = walkStep === 0;

      walkNext.textContent =
        walkStep === 2 ? "Start Again ↺" : "Next Step →";

      showMessage("walkError", "");

      if (walkStep === 2) {
        byId("walkResult").textContent =
          "✅ " + byId("demoName").value.trim() +
          " — 📍 " + byId("demoLocation").value.trim();
      }
    }

    walkNext.addEventListener("click", function () {
      if (walkStep === 2) {
        walkStep = 0;
        updateWalkthrough();
        return;
      }

      var field = walkStep === 0
        ? byId("demoName")
        : byId("demoLocation");

      if (!field.value.trim()) {
        showMessage("walkError", "Please fill in this field.");
        field.focus();
        return;
      }

      walkStep++;
      updateWalkthrough();
    });

    byId("walkBack").addEventListener("click", function () {
      if (walkStep > 0) {
        walkStep--;
        updateWalkthrough();
      }
    });

    updateWalkthrough();
  }

  var featureButtons = document.querySelectorAll(".feature-tab");

  if (featureButtons.length) {
    var featureData = {
      save: {
        icon: "📦",
        title: "Save Your Items",
        text: "Add your belongings to a personal collection.",
        example: "🔑 House Keys — Added!"
      },
      search: {
        icon: "🔎",
        title: "Instant Search",
        text: "Search item names, locations and notes.",
        example: "🔍 House Keys — 1 match"
      },
      location: {
        icon: "📍",
        title: "Remember Locations",
        text: "Record the last place where you left an item.",
        example: "📍 Living Room · Drawer"
      },
      organize: {
        icon: "🗂️",
        title: "Smart Categories",
        text: "Organize saved items by category.",
        example: "📁 Electronics · School · Accessories"
      }
    };

    featureButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var data = featureData[button.dataset.feature];

        if (!data) {
          return;
        }

        featureButtons.forEach(function (item) {
          item.classList.remove("active");
        });

        button.classList.add("active");

        byId("featureDemoIcon").textContent = data.icon;
        byId("featureDemoTitle").textContent = data.title;
        byId("featureDemoText").textContent = data.text;
        byId("featureDemoExample").textContent = data.example;

        var icon = byId("featureDemoIcon");

        icon.style.animation = "none";
        void icon.offsetWidth;
        icon.style.animation = "";
      });
    });
  }

  var feedbackForm = byId("feedbackForm");

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = byId("feedbackName").value.trim();
      var message = byId("feedbackMessage").value.trim();

      if (!name || !message) {
        showMessage(
          "feedbackStatus",
          "Please enter your name and suggestion."
        );
        return;
      }

      try {
        var suggestions = JSON.parse(
          localStorage.getItem("findit-suggestions") || "[]"
        );

        if (!Array.isArray(suggestions)) {
          suggestions = [];
        }

        suggestions.push({
          name: name,
          message: message,
          created: Date.now()
        });

        localStorage.setItem(
          "findit-suggestions",
          JSON.stringify(suggestions)
        );

        showMessage(
          "feedbackStatus",
          "✓ Suggestion saved in this browser. Thank you!"
        );

        feedbackForm.reset();
      } catch (error) {
        showMessage(
          "feedbackStatus",
          "Could not save your suggestion."
        );
      }
    });
  }

  function itemEmoji(category) {
    if (category === "Electronics") return "📱";
    if (category === "Accessories") return "🔑";
    if (category === "School") return "🎒";
    if (category === "Documents") return "📄";
    return "📦";
  }

  function createText(tag, className, value) {
    var element = document.createElement(tag);
    element.className = className;
    element.textContent = String(value);
    return element;
  }

  function renderItems() {
    var grid = byId("itemsGrid");

    if (!grid) {
      return;
    }

    grid.innerHTML = "";

    byId("dashboardWelcome").style.display =
      loggedIn ? "none" : "block";

    var allItems = loggedIn ? items.slice() : [];
    var search = byId("searchItems").value.trim().toLowerCase();
    var category = byId("filterCategory").value;
    var sort = byId("sortItems").value;

    byId("totalItems").textContent = allItems.length;

    byId("totalLocations").textContent = new Set(
      allItems.map(function (item) {
        return item.location.trim().toLowerCase();
      })
    ).size;

    byId("totalCategories").textContent = new Set(
      allItems.map(function (item) {
        return item.category;
      })
    ).size;

    var results = allItems.filter(function (item) {
      var searchable = (
        item.name + " " +
        item.location + " " +
        (item.notes || "")
      ).toLowerCase();

      return searchable.includes(search) &&
        (!category || item.category === category);
    });

    if (sort === "newest") {
      results.sort(function (a, b) {
        return b.created - a.created;
      });
    } else if (sort === "oldest") {
      results.sort(function (a, b) {
        return a.created - b.created;
      });
    } else if (sort === "az") {
      results.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    } else if (sort === "za") {
      results.sort(function (a, b) {
        return b.name.localeCompare(a.name);
      });
    }

    byId("resultCount").textContent =
      results.length + (results.length === 1 ? " item" : " items");

    byId("emptyState").style.display =
      results.length ? "none" : "block";

    if (!loggedIn) {
      byId("emptyTitle").textContent = "Create a profile first";
      byId("emptyDescription").textContent =
        "Sign up or log in to start organizing.";
      byId("emptyAddButton").textContent = "Create Profile";
    } else if (allItems.length && !results.length) {
      byId("emptyTitle").textContent = "No matching items";
      byId("emptyDescription").textContent =
        "Try another search or category.";
      byId("emptyAddButton").textContent = "+ Add Item";
    } else {
      byId("emptyTitle").textContent = "No items yet";
      byId("emptyDescription").textContent =
        "Add your first item to start your collection.";
      byId("emptyAddButton").textContent = "+ Add First Item";
    }

    results.forEach(function (item) {
      var col = document.createElement("div");
      col.className = "col-lg-4 col-md-6";

      var card = document.createElement("article");
      card.className = "item-card";

      card.appendChild(
        createText(
          "div",
          "item-card-icon",
          itemEmoji(item.category)
        )
      );

      card.appendChild(
        createText(
          "div",
          "item-category",
          item.category.toUpperCase()
        )
      );

      card.appendChild(
        createText("h3", "", item.name)
      );

      card.appendChild(
        createText("p", "item-location", "📍 " + item.location)
      );

      if (item.notes) {
        card.appendChild(
          createText("p", "item-notes", item.notes)
        );
      }

      var date = new Date(item.updated || item.created);

      card.appendChild(
        createText(
          "small",
          "item-date",
          "Saved: " + date.toLocaleDateString()
        )
      );

      var actions = document.createElement("div");
      actions.className = "item-actions";

      var edit = document.createElement("button");
      edit.type = "button";
      edit.className = "edit-item";
      edit.textContent = "✏️ Edit";
      edit.dataset.action = "edit";
      edit.dataset.id = item.id;

      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "delete-item";
      remove.textContent = "🗑️ Delete";
      remove.dataset.action = "delete";
      remove.dataset.id = item.id;

      actions.appendChild(edit);
      actions.appendChild(remove);

      card.appendChild(actions);
      col.appendChild(card);
      grid.appendChild(col);
    });
  }

  var itemForm = byId("itemForm");

  if (itemForm) {
    function openItemModal(id) {
      if (!loggedIn || !profile) {
        showModal("signupModal");
        return;
      }

      editingId = id || null;

      itemForm.reset();
      showMessage("itemError", "");

      if (editingId) {
        var found = items.find(function (item) {
          return item.id === editingId;
        });

        if (!found) {
          return;
        }

        byId("itemModalTitle").textContent = "Edit Item";
        byId("itemName").value = found.name;
        byId("itemCategory").value = found.category;
        byId("itemLocation").value = found.location;
        byId("itemNotes").value = found.notes || "";
      } else {
        byId("itemModalTitle").textContent = "Add New Item";
      }

      showModal("itemModal");
    }

    byId("openAddItem").addEventListener("click", function () {
      openItemModal(null);
    });

    byId("emptyAddButton").addEventListener("click", function () {
      openItemModal(null);
    });

    itemForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!loggedIn || !profile) {
        return;
      }

      var name = byId("itemName").value.trim();
      var category = byId("itemCategory").value;
      var location = byId("itemLocation").value.trim();
      var notes = byId("itemNotes").value.trim();

      if (!name || !location) {
        showMessage(
          "itemError",
          "Enter an item name and location."
        );
        return;
      }

      var backup = JSON.stringify(items);

      if (editingId) {
        var item = items.find(function (entry) {
          return entry.id === editingId;
        });

        if (item) {
          item.name = name;
          item.category = category;
          item.location = location;
          item.notes = notes;
          item.updated = Date.now();
        }
      } else {
        items.push({
          id: Date.now().toString() + "-" +
            Math.random().toString(36).slice(2),
          name: name,
          category: category,
          location: location,
          notes: notes,
          created: Date.now(),
          updated: Date.now()
        });
      }

      if (!saveItems()) {
        items = JSON.parse(backup);

        showMessage(
          "itemError",
          "Could not save. Browser storage may be full."
        );
        return;
      }

      hideModal("itemModal");
      editingId = null;
      itemForm.reset();

      renderItems();
    });

    byId("searchItems").addEventListener("input", renderItems);
    byId("filterCategory").addEventListener("change", renderItems);
    byId("sortItems").addEventListener("change", renderItems);

    byId("itemsGrid").addEventListener("click", function (event) {
      var button = event.target.closest("button[data-action]");

      if (!button) {
        return;
      }

      var id = button.dataset.id;

      if (button.dataset.action === "edit") {
        openItemModal(id);
      }

      if (button.dataset.action === "delete") {
        if (!confirm("Delete this item?")) {
          return;
        }

        var backup = JSON.stringify(items);

        items = items.filter(function (item) {
          return item.id !== id;
        });

        if (!saveItems()) {
          items = JSON.parse(backup);
          alert("Could not delete this item.");
          return;
        }

        renderItems();
      }
    });
  }

  updateAccount();

});
