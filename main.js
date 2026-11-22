
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


document.addEventListener("DOMContentLoaded", function () {
  if (document.body.dataset.page !== "myhome") return;

  const el = id => document.getElementById(id);
  const KEY = "findit-3d-home-v2";

  const defaults = [
    "Living Room 1",
    "Kitchen 1",
    "Bedroom 1",
    "Bathroom 1"
  ];

  let rooms = defaults.slice();
  let items = [];
  let selectedItem = null;
  let placing = false;
  let scene;
  let camera;
  let renderer;
  let house;
  let markers = [];
  let floorMeshes = [];
  let roomCenters = {};
  let raycaster;
  let pointer;
  let azimuth = 0.7;
  let polar = 0.85;
  let distance = 21;
  let dragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;
  let savedScroll = "";
  let highlightTimer = null;

  function status(message) {
    el("fhStatus").textContent = message;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({rooms, items}));
      return true;
    } catch (error) {
      status("Could not save. Browser storage might be full.");
      return false;
    }
  }

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY));

      if (data && Array.isArray(data.rooms)) {
        const valid = data.rooms.filter(name =>
          typeof name === "string" && name.trim()
        );
        if (valid.length && valid.length <= 16) rooms = valid;
      }

      if (data && Array.isArray(data.items)) {
        items = data.items.filter(item =>
          item &&
          typeof item.name === "string" &&
          typeof item.room === "string" &&
          typeof item.id === "string" &&
          rooms.includes(item.room)
        );
      }
    } catch (error) {
      rooms = defaults.slice();
      items = [];
    }
  }

  function category(name) {
    const text = name.toLowerCase();
    if (text.includes("living")) return "living";
    if (text.includes("kitchen")) return "kitchen";
    if (text.includes("bedroom")) return "bedroom";
    if (text.includes("bathroom")) return "bathroom";
    if (text.includes("hallway")) return "hallway";
    if (text.includes("office")) return "office";
    return "other";
  }

  function emoji(name) {
    const type = category(name);
    if (type === "living") return "🛋️";
    if (type === "kitchen") return "🍳";
    if (type === "bedroom") return "🛏️";
    if (type === "bathroom") return "🚿";
    if (type === "hallway") return "🚪";
    return "🏠";
  }

  function updateList() {
    const roomList = el("fhRoomList");
    const itemList = el("fhItemList");
    const select = el("fhItemRoom");

    roomList.replaceChildren();
    itemList.replaceChildren();
    select.replaceChildren();

    rooms.forEach(room => {
      const button = document.createElement("button");
      button.className = "fh-room-entry";
      button.type = "button";
      button.textContent = emoji(room) + " " + room;
      button.onclick = () => focusRoom(room);
      roomList.appendChild(button);

      const option = document.createElement("option");
      option.value = room;
      option.textContent = room;
      select.appendChild(option);
    });

    items.forEach(item => {
      const button = document.createElement("button");
      button.className = "fh-item-entry";
      button.type = "button";

      if (selectedItem === item.id) {
        button.classList.add("fh-active");
      }

      const title = document.createElement("strong");
      title.textContent = "📍 " + item.name;

      const detail = document.createElement("small");
      detail.textContent = item.room + " · " + item.place;

      button.append(title, detail);
      button.onclick = () => highlightItem(item.id);
      itemList.appendChild(button);
    });

    if (!items.length) {
      const p = document.createElement("p");
      p.className = "fh-small";
      p.textContent = "No items recorded yet.";
      itemList.appendChild(p);
    }

    el("fhRoomCount").textContent = rooms.length;
    el("fhItemCount").textContent = items.length;
    el("fhStatsRooms").textContent = rooms.length;
    el("fhStatsItems").textContent = items.length;
    el("fhStatsPlaces").textContent =
      new Set(items.map(item => item.room + "|" + item.place)).size;
  }

  function normalize(text) {
    return text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ë/g, "e")
      .replace(/ç/g, "c");
  }

  const roomTypes = [
    {name: "Bedroom", pattern: "dhom[ae]?\\s+gjumi|bedrooms?"},
    {name: "Living Room", pattern: "sallone?|living\\s+rooms?"},
    {name: "Kitchen", pattern: "kuzhin[ae]?|kitchens?"},
    {name: "Bathroom", pattern: "banj[ae]?|bathrooms?"},
    {name: "Hallway", pattern: "korridore?|hallways?"},
    {name: "Office", pattern: "zyr[ae]?|offices?|study"}
  ];

  function parseHome(description) {
    const text = normalize(description);
    const adding = /\b(shto|add)\b/.test(text);
    const found = [];

    roomTypes.forEach(type => {
      const numberPattern = new RegExp(
        "(\\d+)\\s*(?:" + type.pattern + ")",
        "i"
      );
      const match = text.match(numberPattern);

      if (match) {
        found.push({
          name: type.name,
          count: Math.max(1, Math.min(8, Number(match[1])))
        });
      }
    });

    if (!found.length) return null;

    let next = adding ? rooms.slice() : [];

    found.forEach(entry => {
      const current = next.filter(room =>
        category(room) === category(entry.name)
      ).length;

      const count = adding ? current + entry.count : entry.count;

      next = next.filter(room =>
        category(room) !== category(entry.name)
      );

      for (let i = 1; i <= count; i++) {
        next.push(entry.name + " " + i);
      }
    });

    if (next.length > 16) return "limit";

    return next;
  }

  function openModal() {
    el("fhRecordModal").hidden = false;
    el("fhItemName").focus();
  }

  function closeModal() {
    el("fhRecordModal").hidden = true;
  }

  el("fhToggleEditor").onclick = function () {
    const editor = el("fhTextEditor");
    editor.hidden = !editor.hidden;
    this.textContent = editor.hidden
      ? "✨ Edit Home With Text"
      : "✕ Close Text Editor";
  };

  document.querySelectorAll("[data-fh-prompt]").forEach(button => {
    button.onclick = () => {
      el("fhPrompt").value = button.dataset.fhPrompt;
    };
  });

  el("fhGenerate").onclick = function () {
    const result = parseHome(el("fhPrompt").value);

    if (result === "limit") {
      status("Maximum 16 rooms are supported.");
      return;
    }

    if (!result) {
      status("Try: 2 bedrooms, 1 kitchen and 1 bathroom.");
      return;
    }

    const missing = items.filter(item => !result.includes(item.room));

    if (missing.length) {
      if (!confirm(
        missing.length +
        " item(s) belong to removed rooms. Delete these records?"
      )) return;
    }

    const oldRooms = rooms;
    const oldItems = items;
    rooms = result;
    items = items.filter(item => rooms.includes(item.room));
    selectedItem = null;

    if (!save()) {
      rooms = oldRooms;
      items = oldItems;
      return;
    }

    buildHouse();
    updateList();
    resetCamera();
    status("Home updated! " + rooms.length + " rooms generated.");
  };

  el("fhOpenRecord").onclick = openModal;
  el("fhCloseRecord").onclick = closeModal;
  el("fhCancelRecord").onclick = closeModal;

  el("fhRecordModal").onclick = function (event) {
    if (event.target === this) closeModal();
  };

  el("fhRecordForm").onsubmit = function (event) {
    event.preventDefault();

    const name = el("fhItemName").value.trim();
    const room = el("fhItemRoom").value;
    const place = el("fhItemPlace").value.trim();

    if (!name || !room || !place || !rooms.includes(room)) return;

    const item = {
      id: Date.now().toString(36) +
        Math.random().toString(36).slice(2),
      name,
      room,
      place,
      dx: 0,
      dz: 0,
      created: Date.now()
    };

    items.push(item);

    if (!save()) {
      items.pop();
      return;
    }

    selectedItem = item.id;
    this.reset();
    closeModal();
    buildHouse();
    updateList();
    highlightItem(item.id);
    status("Item saved! Use Place Item to adjust its position.");
  };

  el("fhFind").onclick = function () {
    const query = normalize(el("fhSearch").value.trim());

    if (!query) {
      status("Enter an item name.");
      return;
    }

    const item = items.find(entry =>
      normalize(entry.name).includes(query)
    );

    if (!item) {
      status("No saved item matches your search.");
      return;
    }

    highlightItem(item.id);
  };

  el("fhSearch").addEventListener("keydown", event => {
    if (event.key === "Enter") el("fhFind").click();
  });

  el("fhSave").onclick = function () {
    if (save()) status("Home saved successfully.");
  };

  el("fhResetHome").onclick = function () {
    if (!confirm("Reset your 3D home and remove its recorded items?")) {
      return;
    }

    rooms = defaults.slice();
    items = [];
    selectedItem = null;
    placing = false;

    if (!save()) return;

    buildHouse();
    updateList();
    resetCamera();
    status("Home reset.");
  };

  function box(parent, w, h, d, x, y, z, color) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.85
      })
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
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.8
      })
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function makeLabel(text) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 100;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#17202be9";
    ctx.fillRect(0, 0, 512, 100);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 256, 52, 465);

    const texture = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false
      })
    );
    sprite.scale.set(2.6, 0.51, 1);
    return sprite;
  }

  function furniture(group, type) {
    if (type === "living") {
      box(group, 2.3, .4, .85, -.6, .42, -.7, "#d3c1ac");
      box(group, 2.3, .7, .2, -.6, .66, -1.14, "#b19d89");
      box(group, .2, .54, .85, -1.8, .5, -.7, "#cbb8a3");
      box(group, .2, .54, .85, .6, .5, -.7, "#cbb8a3");
      box(group, 1.15, .12, .75, -.5, .45, .75, "#856249");
      box(group, .12, .38, .12, -1, .22, .5, "#70523d");
      box(group, .12, .38, .12, 0, .22, 1, "#70523d");
      box(group, 1.5, .45, .4, 1.3, .26, 1.7, "#a88a6c");
      box(group, 1.25, .8, .06, 1.3, .95, 1.65, "#292d32");
    }

    if (type === "bedroom") {
      box(group, 2, .4, 2.2, -.5, .38, 0, "#8c6e56");
      box(group, 1.8, .3, 1.95, -.5, .72, .05, "#e8e3da");
      box(group, 1.9, .7, .15, -.5, .73, -1.15, "#a88a72");
      box(group, .7, .13, .4, -1, .96, -.6, "#ffffff");
      box(group, .7, .13, .4, .08, .96, -.6, "#ffffff");
      box(group, .85, 1.85, .65, 1.45, .93, -1.35, "#b39a7f");
    }

    if (type === "kitchen") {
      box(group, 3.4, .77, .65, 0, .4, -1.65, "#eeeae4");
      box(group, 3.4, .1, .7, 0, .83, -1.65, "#aaaaa8");
      box(group, 1.4, .15, .85, 0, .8, .65, "#9c7b5d");
      box(group, .14, .67, .14, -.55, .4, .45, "#765741");
      box(group, .14, .67, .14, .55, .4, .45, "#765741");
      box(group, .75, 1.8, .7, 1.7, .9, -.35, "#d6d8d9");
    }

    if (type === "bathroom") {
      box(group, 1.35, .45, 1.1, -1.15, .34, -1.1, "#f7f7f4");
      box(group, 1.7, .4, .8, .7, .4, 1.35, "#f4f1ed");
      cylinder(group, .34, .5, 1, .45, -.6, "#ffffff");
      box(group, 1.15, 1.9, .08, -1.65, 1, .75, "#b6d2dc");
    }

    if (type === "office") {
      box(group, 2, .12, .85, 0, .82, -1, "#967556");
      box(group, .1, .7, .1, -.85, .42, -.65, "#70533d");
      box(group, .1, .7, .1, .85, .42, -.65, "#70533d");
      box(group, .75, .55, .12, 0, 1.18, -1, "#25292e");
      box(group, .7, .45, .7, 0, .35, .6, "#74716e");
    }

    if (type === "hallway") {
      box(group, 1.5, .45, .48, 0, .25, -1.25, "#a48465");
      box(group, .9, .8, .1, 0, 1.45, -1.95, "#d0d5d8");
    }

    if (type === "other") {
      box(group, 1.4, .42, .65, 0, .25, 0, "#aa8e71");
    }
  }

  function makeMarker(item) {
    const center = roomCenters[item.room];
    if (!center) return;

    const group = new THREE.Group();
    const x = center.x + Number(item.dx || 0);
    const z = center.z + Number(item.dz || 0);

    group.position.set(x, 0, z);

    cylinder(group, .25, .07, 0, .12, 0, "#8c60e7");
    cylinder(group, .12, .15, 0, .23, 0, "#f4df73");

    const label = makeLabel(item.name);
    label.position.set(0, 1.85, 0);
    group.add(label);

    group.userData.itemId = item.id;
    house.add(group);
    markers.push(group);
  }

  function disposeGroup(group) {
    group.traverse(object => {
      if (object.geometry) object.geometry.dispose();

      if (object.material) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach(mat => {
          if (mat.map) mat.map.dispose();
          mat.dispose();
        });
      }
    });
  }

  function buildHouse() {
    if (!house) return;

    disposeGroup(house);
    house.clear();
    markers = [];
    floorMeshes = [];
    roomCenters = {};

    const columns = Math.ceil(Math.sqrt(rooms.length));
    const rows = Math.ceil(rooms.length / columns);
    const w = 4.8;
    const d = 4.5;

    rooms.forEach((room, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = (col - (columns - 1) / 2) * w;
      const z = (row - (rows - 1) / 2) * d;

      roomCenters[room] = {x, z};

      const group = new THREE.Group();
      group.position.set(x, 0, z);
      house.add(group);

      const type = category(room);

      const floorColor = type === "bathroom"
        ? "#e4e2dd"
        : "#d6b48d";

      const floor = box(
        group, w - .08, .18, d - .08,
        0, -.12, 0, floorColor
      );

      floor.userData.room = room;
      floorMeshes.push(floor);

      for (let j = -2; j <= 2; j++) {
        if (type !== "bathroom") {
          box(
            group, w - .25, .018, .018,
            0, -.01, j * .83,
            "#b99a76"
          );
        }
      }

      box(group, w, 2.0, .16, 0, 1, -d / 2, "#f2f0ea");
      box(group, .16, 2.0, d, -w / 2, 1, 0, "#efede8");

      box(group, w * .35, .34, .14,
        w * .325, .17, d / 2, "#f2f0ea");

      box(group, .14, .34, d * .25,
        w / 2, .17, -d * .375, "#f2f0ea");

      const tag = makeLabel(room);
      tag.position.set(0, 2.55, 0);
      group.add(tag);

      furniture(group, type);
    });

    items.forEach(makeMarker);
  }

  function updateCamera() {
    if (!camera) return;

    const sin = Math.sin(polar);
    camera.position.set(
      distance * sin * Math.sin(azimuth),
      distance * Math.cos(polar),
      distance * sin * Math.cos(azimuth)
    );

    camera.lookAt(0, 0, 0);
  }

  function resetCamera() {
    distance = Math.max(17, Math.ceil(Math.sqrt(rooms.length)) * 8);
    azimuth = .72;
    polar = .9;
    updateCamera();
  }

  function focusRoom(room) {
    const center = roomCenters[room];
    if (!center || !camera) return;

    status("Selected room: " + room);

    const position = camera.position.clone();
    camera.position.set(
      center.x + position.x * .55,
      Math.max(9, position.y * .55),
      center.z + position.z * .55
    );
    camera.lookAt(center.x, 0, center.z);
  }

  function highlightItem(id) {
    const item = items.find(entry => entry.id === id);
    if (!item) return;

    selectedItem = id;
    updateList();

    status(item.name + " — " + item.room + " — " + item.place);

    focusRoom(item.room);

    if (highlightTimer) clearInterval(highlightTimer);

    const marker = markers.find(entry =>
      entry.userData.itemId === id
    );

    if (marker) {
      let tick = 0;
      highlightTimer = setInterval(() => {
        if (!marker.parent) {
          clearInterval(highlightTimer);
          highlightTimer = null;
          return;
        }

        tick++;
        const scale = 1 + Math.sin(tick * .35) * .22;
        marker.scale.setScalar(scale);

        if (tick >= 26) {
          marker.scale.setScalar(1);
          clearInterval(highlightTimer);
          highlightTimer = null;
        }
      }, 45);
    }
  }

  function pickRoom(event) {
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();

    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(floorMeshes, false);
    if (!hits.length) return null;

    const hit = hits[0];
    const room = hit.object.userData.room;
    const center = roomCenters[room];

    return {
      room,
      x: hit.point.x - center.x,
      z: hit.point.z - center.z
    };
  }

  function startPlaceMode() {
    if (!items.length) {
      status("Record an item first.");
      return;
    }

    if (!selectedItem) {
      selectedItem = items[items.length - 1].id;
    }

    placing = !placing;

    el("fhPlaceMode").classList.toggle("fh-selected", placing);
    el("fhSceneMode").textContent =
      placing ? "PLACE ITEM MODE" : "VIEW MODE";

    status(placing
      ? "Click a floor to position the selected item."
      : "Place Item mode disabled."
    );
  }

  function initialize3D() {
    const target = el("fhScene");

    if (!window.THREE) {
      status("Three.js could not load. Internet is required.");
      target.textContent = "3D viewer is unavailable.";
      return;
    }

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#c5c8c8");

      camera = new THREE.PerspectiveCamera(
        45, 1, .1, 1000
      );

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      target.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(
        "#ffffff", "#c4b49c", 2.25
      ));

      const sunlight = new THREE.DirectionalLight(
        "#ffffff", 2
      );
      sunlight.position.set(10, 20, 8);
      sunlight.castShadow = true;
      sunlight.shadow.mapSize.set(1024, 1024);
      sunlight.shadow.camera.left = -30;
      sunlight.shadow.camera.right = 30;
      sunlight.shadow.camera.top = 30;
      sunlight.shadow.camera.bottom = -30;
      scene.add(sunlight);

      house = new THREE.Group();
      scene.add(house);

      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshStandardMaterial({
          color: "#babebc",
          roughness: 1
        })
      );

      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -.27;
      ground.receiveShadow = true;
      scene.add(ground);

      raycaster = new THREE.Raycaster();
      pointer = new THREE.Vector2();

      const resize = () => {
        const width = target.clientWidth;
        const height = target.clientHeight;

        if (!width || !height) return;

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(resize);
        observer.observe(target);
      } else {
        window.addEventListener("resize", resize);
      }

      const canvas = renderer.domElement;

      canvas.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;

        dragging = true;
        moved = false;
        lastX = event.clientX;
        lastY = event.clientY;
        canvas.setPointerCapture(event.pointerId);
      });

      canvas.addEventListener("pointermove", event => {
        if (!dragging || placing) return;

        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;

        if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;

        azimuth -= dx * .008;
        polar = Math.max(
          .15,
          Math.min(1.48, polar + dy * .008)
        );

        lastX = event.clientX;
        lastY = event.clientY;
        updateCamera();
      });

      canvas.addEventListener("pointerup", event => {
        if (placing && !moved && selectedItem) {
          const picked = pickRoom(event);

          if (picked) {
            const item = items.find(entry =>
              entry.id === selectedItem
            );

            if (item) {
              const before = {...item};

              item.room = picked.room;
              item.dx = picked.x;
              item.dz = picked.z;

              if (save()) {
                buildHouse();
                updateList();
                status(item.name + " placed in " + item.room);
                placing = false;
                el("fhPlaceMode").classList.remove("fh-selected");
                el("fhSceneMode").textContent = "VIEW MODE";
              } else {
                Object.assign(item, before);
              }
            }
          }
        }

        dragging = false;
      });

      canvas.addEventListener("pointercancel", () => {
        dragging = false;
      });

      canvas.addEventListener("wheel", event => {
        event.preventDefault();

        distance = Math.max(
          8,
          Math.min(65, distance + event.deltaY * .017)
        );

        updateCamera();
      }, {passive: false});

      buildHouse();
      resetCamera();
      resize();

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
    } catch (error) {
      console.error(error);
      status("Could not start the 3D viewer.");
    }
  }

  el("fhPlaceMode").onclick = startPlaceMode;

  el("fhTopView").onclick = () => {
    azimuth = 0;
    polar = .08;
    distance = Math.max(17, Math.ceil(Math.sqrt(rooms.length)) * 8);
    updateCamera();
    status("Top view activated.");
  };

  el("fhResetCamera").onclick = () => {
    resetCamera();
    status("Camera reset.");
  };

  load();
  updateList();
  initialize3D();
});


document.addEventListener("DOMContentLoaded", function () {
  if (document.body.dataset.page !== "myhome") return;
  const $ = id => document.getElementById(id);
  const STORE = "findit-myhome-detail-v1";
  const originals = ["Living Room 1", "Kitchen 1", "Bedroom 1", "Bathroom 1"];
  let rooms = originals.slice();
  let items = [];
  let selected = null;
  let placing = false;
  let scene, camera, renderer, home, raycaster;
  let floorMeshes = [], markers = [], centers = {};
  let angle = .66, tilt = .83, zoom = 20;
  let dragging = false, moved = false, startX = 0, startY = 0, lastX = 0, lastY = 0;
  let pulseStart = 0;
  const host = $("fhCanvasHost");

  function message(text) { $("fhStatus").textContent = text; }
  function typeOf(name) {
    const n = name.toLowerCase();
    if (n.includes("living")) return "Living Room";
    if (n.includes("kitchen")) return "Kitchen";
    if (n.includes("bedroom")) return "Bedroom";
    if (n.includes("bathroom")) return "Bathroom";
    if (n.includes("office")) return "Office";
    if (n.includes("hallway")) return "Hallway";
    return "Other";
  }
  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({rooms,items}));
      return true;
    } catch (error) { message("Browser storage is unavailable."); return false; }
  }
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE));
      if (saved && Array.isArray(saved.rooms)) {
        const r = saved.rooms.filter(x => typeof x === "string" && x.length < 80);
        if (r.length && r.length <= 16) rooms = r;
      }
      if (saved && Array.isArray(saved.items)) {
        items = saved.items.filter(x => x && typeof x.id === "string" &&
          typeof x.name === "string" && typeof x.room === "string" &&
          rooms.includes(x.room));
      }
    } catch (error) { message("Saved data could not be read."); }
  }
  function renderLists() {
    $("fhRooms").replaceChildren();
    $("fhItems").replaceChildren();
    $("fhRoomSelect").replaceChildren();
    const icons = {"Living Room":"🛋️",Kitchen:"🍳",Bedroom:"🛏️",Bathroom:"🚿",Office:"💻",Hallway:"🚪",Other:"🏠"};
    rooms.forEach(room => {
      const b = document.createElement("button");
      b.className = "fh-entry";
      b.textContent = (icons[typeOf(room)] || "🏠") + " " + room;
      b.onclick = () => focusRoom(room);
      $("fhRooms").append(b);
      const option = document.createElement("option");
      option.value = room;
      option.textContent = room;
      $("fhRoomSelect").append(option);
    });
    items.forEach(item => {
      const b = document.createElement("button");
      b.className = "fh-entry" + (item.id === selected ? " fh-active" : "");
      const title = document.createElement("strong");
      title.textContent = "📍 " + item.name;
      const detail = document.createElement("small");
      detail.textContent = item.room + " · " + item.location;
      b.append(title,detail);
      b.onclick = () => highlight(item.id);
      $("fhItems").append(b);
    });
    if (!items.length) {
      const p = document.createElement("p");
      p.className = "fh-muted";
      p.textContent = "No recorded items yet.";
      $("fhItems").append(p);
    }
    $("fhRoomCount").textContent = rooms.length;
    $("fhItemCount").textContent = items.length;
    $("fhStatRooms").textContent = rooms.length;
    $("fhStatItems").textContent = items.length;
    $("fhStatPlaces").textContent = new Set(items.map(x => x.room + "|" + x.location)).size;
  }
  function normalize(s) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  }
  const kinds = [
    ["Living Room", "living\\s+rooms?|sallone?"],
    ["Kitchen", "kitchens?|kuzhin[ae]?"],
    ["Bedroom", "bedrooms?|dhom[ae]?\\s+(?:e\\s+)?gjumit?|dhoma\\s+gjumi"],
    ["Bathroom", "bathrooms?|banj[ae]?"],
    ["Office", "offices?|zyr[ae]?"],
    ["Hallway", "hallways?|korridore?"]
  ];
  function parsePrompt(raw) {
    const text = normalize(raw);
    const add = /\b(shto|add)\b/.test(text);
    const remove = /\b(hiq|remove|delete)\b/.test(text);
    const found = [];
    for (const [name, pattern] of kinds) {
      const re = new RegExp("(\\d+)\\s*(?:" + pattern + ")", "i");
      const match = text.match(re);
      if (match) found.push({name,count:Math.min(8,Number(match[1]))});
    }
    if (!found.length) return null;
    let next = (add || remove) ? rooms.slice() : [];
    for (const {name,count} of found) {
      const other = next.filter(x => typeOf(x) !== name);
      const current = next.length - other.length;
      const nextCount = add ? current + count : remove ? Math.max(0,current-count) : count;
      for (let i=1;i<=nextCount;i++) other.push(name + " " + i);
      next = other;
    }
    if (!next.length) return "empty";
    if (next.length > 16) return "limit";
    return next;
  }
  $("fhEditorToggle").onclick = () => {
    $("fhEditor").hidden = !$("fhEditor").hidden;
    $("fhEditorToggle").textContent = $("fhEditor").hidden ?
      "✦ Edit Home With Text" : "✕ Close Text Editor";
  };
  document.querySelectorAll("[data-example]").forEach(b => {
    b.onclick = () => { $("fhPrompt").value = b.dataset.example; };
  });
  $("fhGenerate").onclick = () => {
    const next = parsePrompt($("fhPrompt").value.trim());
    if (!next || typeof next === "string") {
      message(next === "limit" ? "Maximum 16 rooms." : next === "empty" ?
        "A home needs at least one room." : "Try: 2 bedrooms, 1 kitchen, 1 bathroom.");
      return;
    }
    const deleted = items.filter(x => !next.includes(x.room));
    if (deleted.length && !confirm("This removes " + deleted.length + " saved item(s) in deleted rooms. Continue?")) return;
    const previousRooms = rooms, previousItems = items;
    rooms = next;
    items = items.filter(x => rooms.includes(x.room));
    selected = null;
    if (!save()) { rooms=previousRooms; items=previousItems; return; }
    buildHome(); renderLists(); resetCamera();
    message("Your 3D home now has " + rooms.length + " room(s).");
  };
  function modal(open) {
    $("fhModal").hidden = !open;
    if (open) $("fhName").focus();
  }
  $("fhRecordOpen").onclick = () => modal(true);
  $("fhModalX").onclick = () => modal(false);
  $("fhCancel").onclick = () => modal(false);
  $("fhModal").onclick = e => { if (e.target === $("fhModal")) modal(false); };
  $("fhForm").onsubmit = e => {
    e.preventDefault();
    const name = $("fhName").value.trim();
    const room = $("fhRoomSelect").value;
    const location = $("fhLocation").value.trim();
    if (!name || !location || !rooms.includes(room)) return;
    const item = {id:Date.now().toString(36)+Math.random().toString(36).slice(2),name,room,location,dx:0,dz:0};
    items.push(item);
    if (!save()) {items.pop();return;}
    selected = item.id;
    $("fhForm").reset();modal(false);
    buildHome(); renderLists(); highlight(item.id);
    message("Item recorded! Click Place Item to set its exact position.");
  };
  function search() {
    const query = normalize($("fhSearch").value.trim());
    if (!query) {message("Type an item name first.");return;}
    const item = items.find(x => normalize(x.name).includes(query));
    if (!item) {message("No item found with that name.");return;}
    highlight(item.id);
  }
  $("fhFind").onclick = search;
  $("fhSearch").onkeydown = e => {if(e.key === "Enter") search();};
  $("fhSave").onclick = () => {if(save()) message("Home and items saved.");};
  $("fhReset").onclick = () => {
    if (!confirm("Reset the home and delete its saved items?")) return;
    const beforeRooms=rooms,beforeItems=items;
    rooms=originals.slice();items=[];selected=null;placing=false;
    if (!save()) {rooms=beforeRooms;items=beforeItems;return;}
    $("fhPlace").classList.remove("fh-on");$("fhMode").textContent="VIEW MODE";
    buildHome();renderLists();resetCamera();message("Home reset.");
  };
  function mat(color, rough=.83, metal=0) {
    return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});
  }
  function box(group,w,h,d,x,y,z,color) {
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));
    mesh.position.set(x,y,z); mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
    return mesh;
  }
  function cylinder(group,rt,rb,h,x,y,z,color) {
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,24),mat(color));
    mesh.position.set(x,y,z);mesh.castShadow=true;group.add(mesh);return mesh;
  }
  function soft(group,w,h,d,x,y,z,color) {
    const mesh=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),mat(color,.98));
    mesh.scale.set(w/2,h/2,d/2);mesh.position.set(x,y,z);mesh.castShadow=true;group.add(mesh);
    return mesh;
  }
  function legs(g,x,z,w,d,h,color) {
    for(const a of [-1,1]) for(const b of [-1,1])
      box(g,.085,h,.085,x+a*(w/2-.12),h/2,z+b*(d/2-.12),color);
  }
  function rug(g,x,z,w,d,color) {
    box(g,w,.035,d,x,.038,z,color);
    box(g,w-.15,.01,.028,x,.063,z-d/2+.13,"#e8dfd1");
    box(g,w-.15,.01,.028,x,.063,z+d/2-.13,"#e8dfd1");
  }
  function plant(g,x,z,s=1) {
    const plant=new THREE.Group();plant.position.set(x,0,z);plant.scale.setScalar(s);g.add(plant);
    cylinder(plant,.19,.24,.38,0,.21,0,"#a98a73");
    cylinder(plant,.14,.14,.03,0,.41,0,"#4c4237");
    cylinder(plant,.035,.035,.7,0,.78,0,"#667e53");
    [[-.18,.8,0],[.13,.95,0],[.03,1.13,.15],[-.17,1.12,-.06],[.2,.78,.13]].forEach((p,i)=>{
      const leaf=soft(plant,.2,.45,.14,p[0],p[1],p[2],i%2?"#698869":"#819b78");
      leaf.rotation.z=-p[0]*1.9;
    });
  }
  function wallArt(g) {
    box(g,.9,.65,.045,1.18,1.42,-2.12,"#c6ac91");
    box(g,.72,.48,.052,1.18,1.42,-2.085,"#e1ded1");
    box(g,.32,.22,.06,1.06,1.36,-2.049,"#8c9b85");
  }
  function furnishings(g,t) {
    const wood="#9c7856",dark="#76563e",beige="#c8b8a4";
    if(t==="Living Room") {
      rug(g,-.45,.35,2.85,2.05,"#d4c8b9");
      box(g,2.35,.38,.95,-.66,.39,-.91,beige);
      box(g,2.39,.72,.23,-.66,.68,-1.39,"#b2a291");
      box(g,.24,.54,.94,-1.86,.53,-.91,"#bba998");
      box(g,.24,.54,.94,.54,.53,-.91,"#bba998");
      [-1.40,-.67,.08].forEach(x=>soft(g,.65,.18,.67,x,.64,-.88,"#e1d6c9"));
      soft(g,.42,.38,.18,-1.43,.87,-1.22,"#8e9f8a");
      soft(g,.36,.36,.18,.08,.88,-1.23,"#b68f7e");
      legs(g,-.45,.58,1.35,.8,.40,dark);
      box(g,1.35,.12,.8,-.45,.47,.58,wood);
      cylinder(g,.15,.15,.07,-.46,.57,.58,"#ede5d8");
      box(g,1.48,.45,.43,1.43,.25,1.75,dark);
      box(g,1.15,.72,.06,1.43,.91,1.69,"#303338");
      plant(g,1.77,-.55,.72);wallArt(g);
    } else if(t==="Bedroom") {
      rug(g,-.5,.35,2.7,2.75,"#e1d6ca");
      box(g,2.05,.38,2.28,-.55,.32,-.25,dark);
      box(g,1.88,.23,2.05,-.55,.63,-.22,"#f2eee5");
      box(g,2.12,.85,.18,-.55,.7,-1.47,"#a78d79");
      soft(g,.73,.2,.43,-1.07,.83,-1.04,"#ffffff");
      soft(g,.73,.2,.43,-.04,.83,-1.04,"#ffffff");
      soft(g,1.72,.13,1.05,-.55,.75,.35,"#bbc6c4");
      for(const x of [-1.91,.82]){
        box(g,.51,.58,.49,x,.36,-1.08,wood);
        box(g,.54,.09,.51,x,.7,-1.08,"#d3b18f");
        cylinder(g,.12,.12,.035,x,.77,-1.08,"#eee0c8");
      }
      box(g,.9,1.85,.72,1.60,.92,-1.28,"#b29b80");
      box(g,.03,1.69,.03,1.60,.94,-.91,"#86715c");
      plant(g,1.75,1.42,.55);
    } else if(t==="Kitchen") {
      box(g,3.57,.78,.63,0,.42,-1.66,"#efede9");
      box(g,3.64,.10,.72,0,.86,-1.66,"#aeb0ae");
      for(const x of [-1.27,-.43,.41,1.25]){
        box(g,.027,.72,.025,x,.42,-1.335,"#beb9b1");
        box(g,.24,.024,.035,x+.27,.54,-1.32,"#98938d");
      }
      box(g,.83,.018,.46,-.78,.925,-1.64,"#aebdbb");
      for(const x of [.43,.83]) for(const z of [-1.85,-1.51])
        cylinder(g,.09,.09,.016,x,.93,z,"#3b4041");
      box(g,1.76,.13,.94,.12,.75,.56,wood);
      legs(g,.12,.56,1.76,.94,.68,dark);
      [-.42,.64].forEach(x=>{
        box(g,.44,.11,.44,x,.40,1.41,beige);
        legs(g,x,1.41,.44,.44,.34,dark);
      });
      box(g,.68,1.84,.72,1.79,.92,-.3,"#d7dcdd");
      box(g,.49,.025,.025,1.79,.94,.08,"#989e9f");
      plant(g,-1.81,1.48,.48);
    } else if(t==="Bathroom") {
      box(g,1.42,.5,1.28,-1.22,.30,-1.04,"#faf9f7");
      box(g,1.22,.07,1.05,-1.22,.58,-1.04,"#d9e6ea");
      box(g,1.36,1.08,.065,-1.22,1.24,-1.72,"#c7dfe5");
      box(g,1.30,.72,.50,.62,.43,-1.6,wood);
      box(g,1.35,.09,.55,.62,.84,-1.6,"#eeeae4");
      cylinder(g,.28,.28,.08,.62,.93,-1.6,"#ffffff");
      box(g,.87,.71,.065,.62,1.52,-2.08,"#bfced3");
      cylinder(g,.32,.26,.51,1.2,.35,.62,"#f6f5f2");
      cylinder(g,.21,.21,.16,1.2,.68,.62,"#f6f5f2");
      rug(g,-.25,.92,1.25,.66,"#c4c8c5");
    } else if(t==="Office") {
      rug(g,0,.25,2.85,2.55,"#d2d1cb");
      box(g,2.30,.13,.86,0,.79,-1.18,wood);
      legs(g,0,-1.18,2.30,.86,.73,dark);
      box(g,.82,.53,.09,0,1.18,-1.25,"#35393c");
      box(g,.66,.13,.56,0,.49,-.19,"#b2a79d");
      box(g,.63,.62,.12,0,.68,-.43,"#716e69");
      plant(g,1.63,.98,.73);
    } else {
      rug(g,0,0,2.5,2.15,"#e0d9ca");
      box(g,1.55,.44,.72,0,.29,-1.0,wood);
      plant(g,1.5,1.15,.7);
    }
  }
  function floorTexture(bathroom) {
    const canvas=document.createElement("canvas");canvas.width=512;canvas.height=512;
    const c=canvas.getContext("2d");
    c.fillStyle=bathroom?"#e5e4df":"#d0ab87";c.fillRect(0,0,512,512);
    if(bathroom) {
      for(let x=0;x<512;x+=64)for(let y=0;y<512;y+=64){
        c.fillStyle=((x+y)/64)%2?"#dddcd6":"#ebe9e3";c.fillRect(x+2,y+2,60,60);
      }
    } else {
      for(let j=0;j<13;j++)for(let i=-1;i<6;i++){
        const x=i*128+(j%2?64:0),y=j*40;
        c.fillStyle=["#d3ae8b","#c39871","#dfb895","#c9a17b"][(i+j+40)%4];
        c.fillRect(x+1,y+1,126,38);
        c.strokeStyle="#8d644438";c.lineWidth=1;c.beginPath();
        c.moveTo(x+12,y+11);c.bezierCurveTo(x+45,y+6,x+70,y+20,x+112,y+15);c.stroke();
      }
    }
    const texture=new THREE.CanvasTexture(canvas);
    texture.colorSpace=THREE.SRGBColorSpace;
    texture.wrapS=THREE.RepeatWrapping;texture.wrapT=THREE.RepeatWrapping;
    texture.repeat.set(1.5,1.5);
    return texture;
  }
  function label(text, light=false) {
    const canvas=document.createElement("canvas");canvas.width=512;canvas.height=128;
    const c=canvas.getContext("2d");c.fillStyle=light?"#7050aee9":"#1b2231e3";
    c.fillRect(0,0,512,128);c.fillStyle="white";c.textAlign="center";
    c.textBaseline="middle";c.font="bold 35px Arial";c.fillText(text,256,65,470);
    const map=new THREE.CanvasTexture(canvas);
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map,transparent:true,depthTest:false}));
    sprite.scale.set(2.4,.6,1);return sprite;
  }
  function windowFrame(g,d) {
    const z=-d/2+.115;
    box(g,1.46,.9,.035,0,1.36,z,"#b6d7df");
    box(g,1.6,.075,.15,0,1.85,z+.06,"#faf8f3");
    box(g,1.6,.075,.15,0,.87,z+.06,"#faf8f3");
    for(const x of [-.79,0,.79]) box(g,.07,.98,.13,x,1.36,z+.07,"#f6f4ef");
    box(g,1.71,.09,.28,0,.83,z+.17,"#e4ded4");
  }
  function createRoom(g,room,w,d) {
    const bathroom=typeOf(room)==="Bathroom";
    const floor=new THREE.Mesh(new THREE.BoxGeometry(w-.07,.17,d-.07),
      new THREE.MeshStandardMaterial({map:floorTexture(bathroom),roughness:.9}));
    floor.position.y=-.12;floor.receiveShadow=true;floor.userData.room=room;
    g.add(floor);floorMeshes.push(floor);
    const wall="#f4f1eb";
    box(g,1.58,2.25,.16,-1.61,1.125,-d/2,wall);
    box(g,1.58,2.25,.16,1.61,1.125,-d/2,wall);
    box(g,1.66,.80,.16,0,.4,-d/2,wall);
    box(g,1.66,.39,.16,0,2.055,-d/2,wall);
    box(g,.16,2.25,d,-w/2,1.125,0,wall);
    box(g,w,.15,.10,0,.075,-d/2+.12,"#ded8cf");
    box(g,.10,.15,d,-w/2+.13,.075,0,"#ded8cf");
    windowFrame(g,d);
    furnishings(g,typeOf(room));
    const title=label(room);title.position.set(0,2.70,0);g.add(title);
  }
  function marker(item) {
    const p=centers[item.room];if(!p)return;
    const group=new THREE.Group();
    group.position.set(p.x+Number(item.dx||0),0,p.z+Number(item.dz||0));
    cylinder(group,.23,.23,.06,0,.1,0,"#7f60bb");
    cylinder(group,.11,.11,.18,0,.23,0,"#f6dc75");
    const tag=label(item.name,true);tag.position.y=1.72;group.add(tag);
    group.userData.itemId=item.id;home.add(group);markers.push(group);
  }
  function cleanThree(group) {
    const textures=new Set();
    group.traverse(node=>{
      if(node.geometry)node.geometry.dispose();
      const ms=node.material?(Array.isArray(node.material)?node.material:[node.material]):[];
      ms.forEach(m=>{if(m.map)textures.add(m.map);m.dispose();});
    });
    textures.forEach(t=>t.dispose());
  }
  function buildHome() {
    if(!home)return;
    cleanThree(home);home.clear();floorMeshes=[];markers=[];centers={};
    const columns=Math.ceil(Math.sqrt(rooms.length)), rows=Math.ceil(rooms.length/columns);
    const w=4.8,d=4.5;
    rooms.forEach((room,i)=>{
      const x=((i%columns)-(columns-1)/2)*w;
      const z=(Math.floor(i/columns)-(rows-1)/2)*d;
      centers[room]={x,z};
      const g=new THREE.Group();g.position.set(x,0,z);home.add(g);
      createRoom(g,room,w,d);
    });
    items.forEach(marker);
  }
  function cameraUpdate(){
    if(!camera)return;
    camera.position.set(zoom*Math.sin(tilt)*Math.sin(angle),zoom*Math.cos(tilt),zoom*Math.sin(tilt)*Math.cos(angle));
    camera.lookAt(0,0,0);
  }
  function resetCamera(){zoom=Math.max(17,Math.ceil(Math.sqrt(rooms.length))*8);angle=.68;tilt=.8;cameraUpdate();}
  function focusRoom(room){
    const p=centers[room];if(!p||!camera)return;
    camera.position.set(p.x+7,11,p.z+9);
    camera.lookAt(p.x,0,p.z);
    message("Showing " + room);
  }
  function highlight(id) {
    const item=items.find(x=>x.id===id);if(!item)return;
    selected=id;pulseStart=performance.now();renderLists();focusRoom(item.room);
    message(item.name + " — " + item.room + " — " + item.location);
  }
  function placeToggle() {
    if(!items.length){message("Record an item first.");return;}
    if(!selected)selected=items[items.length-1].id;
    placing=!placing;
    $("fhPlace").classList.toggle("fh-on",placing);
    $("fhMode").textContent=placing?"PLACE ITEM MODE":"VIEW MODE";
    message(placing?"Click a room floor to place the selected item.":"View mode activated.");
  }
  $("fhPlace").onclick=placeToggle;
  $("fhTopView").onclick=()=>{angle=0;tilt=.045;zoom=Math.max(17,Math.ceil(Math.sqrt(rooms.length))*8);cameraUpdate();};
  $("fhResetView").onclick=resetCamera;
  function placeAt(event) {
    const bounds=renderer.domElement.getBoundingClientRect();
    const pointer=new THREE.Vector2(
      ((event.clientX-bounds.left)/bounds.width)*2-1,
      -((event.clientY-bounds.top)/bounds.height)*2+1
    );
    raycaster.setFromCamera(pointer,camera);
    const hits=raycaster.intersectObjects(floorMeshes,false);
    if(!hits.length)return;
    const room=hits[0].object.userData.room;
    const center=centers[room];
    const item=items.find(x=>x.id===selected);if(!item)return;
    const previous={...item};
    item.room=room;
    item.dx=THREE.MathUtils.clamp(hits[0].point.x-center.x,-2.05,2.05);
    item.dz=THREE.MathUtils.clamp(hits[0].point.z-center.z,-1.90,1.90);
    if(!save()){Object.assign(item,previous);return;}
    placing=false;$("fhPlace").classList.remove("fh-on");$("fhMode").textContent="VIEW MODE";
    buildHome();renderLists();message(item.name + " placed in " + room);
  }
  function init() {
    if(!window.THREE){host.textContent="Three.js did not load. Connect to the internet and refresh.";message("3D library unavailable.");return;}
    try {
      scene=new THREE.Scene();scene.background=new THREE.Color("#c7c9c6");
      camera=new THREE.PerspectiveCamera(43,1,.1,250);
      renderer=new THREE.WebGLRenderer({antialias:true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure=1.2;
      renderer.shadowMap.enabled=true;
      renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      host.append(renderer.domElement);
      scene.add(new THREE.HemisphereLight("#ffffff","#b1a390",2));
      const sun=new THREE.DirectionalLight("#fff6e9",2.2);
      sun.position.set(11,20,9);sun.castShadow=true;
      sun.shadow.mapSize.set(2048,2048);
      sun.shadow.camera.left=-35;sun.shadow.camera.right=35;
      sun.shadow.camera.top=35;sun.shadow.camera.bottom=-35;
      scene.add(sun);
      const ground=new THREE.Mesh(new THREE.PlaneGeometry(140,140),mat("#bdbfbb",1));
      ground.rotation.x=-Math.PI/2;ground.position.y=-.26;ground.receiveShadow=true;scene.add(ground);
      home=new THREE.Group();scene.add(home);
      raycaster=new THREE.Raycaster();
      const resize=()=>{
        const w=host.clientWidth,h=host.clientHeight;
        if(!w||!h)return;
        renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
      };
      if(window.ResizeObserver)new ResizeObserver(resize).observe(host);
      else window.addEventListener("resize",resize);
      const canvas=renderer.domElement;
      canvas.addEventListener("pointerdown",e=>{
        if(e.button!==0)return;
        dragging=true;moved=false;startX=lastX=e.clientX;startY=lastY=e.clientY;
        canvas.setPointerCapture(e.pointerId);
      });
      canvas.addEventListener("pointermove",e=>{
        if(!dragging)return;
        if(Math.abs(e.clientX-startX)+Math.abs(e.clientY-startY)>5)moved=true;
        if(!placing){
          angle-=(e.clientX-lastX)*.007;
          tilt=THREE.MathUtils.clamp(tilt+(e.clientY-lastY)*.007,.08,1.48);
          cameraUpdate();
        }
        lastX=e.clientX;lastY=e.clientY;
      });
      canvas.addEventListener("pointerup",e=>{
        if(placing&&!moved)placeAt(e);
        dragging=false;
      });
      canvas.addEventListener("pointercancel",()=>dragging=false);
      canvas.addEventListener("wheel",e=>{
        e.preventDefault();zoom=THREE.MathUtils.clamp(zoom+e.deltaY*.018,7,70);cameraUpdate();
      },{passive:false});
      buildHome();resetCamera();resize();
      const frame=()=>{
        requestAnimationFrame(frame);
        markers.forEach(m=>{
          if(m.userData.itemId===selected&&pulseStart){
            const age=(performance.now()-pulseStart)/1000;
            m.scale.setScalar(age<3?1+Math.sin(age*12)*.17:1);
          } else m.scale.setScalar(1);
        });
        renderer.render(scene,camera);
      };
      frame();
    } catch(error){console.error(error);message("Could not initialize 3D viewer.");}
  }
  load();renderLists();init();
});


document.addEventListener("DOMContentLoaded", function () {
  const page = document.body.dataset.page;
  const nav = document.querySelector("#site-header .navbar-nav");

  if (nav && !nav.querySelector('a[href="myhome.html"]')) {
    const li = document.createElement("li");
    li.className = "nav-item";
    const a = document.createElement("a");
    a.className = "nav-link" + (page === "myhome" ? " active" : "");
    a.href = "myhome.html";
    a.textContent = "My Home";
    li.appendChild(a);
    const dashboard = nav.querySelector('a[href="dashboard.html"]');
    if (dashboard && dashboard.parentElement) {
      dashboard.parentElement.after(li);
    } else {
      nav.appendChild(li);
    }
  }

  const footer = document.querySelector("#site-footer .footer-links");
  if (footer && !footer.querySelector('a[href="myhome.html"]')) {
    const a = document.createElement("a");
    a.href = "myhome.html";
    a.textContent = "My Home";
    footer.appendChild(a);
  }

  if (page !== "myhome") return;

  const $ = id => document.getElementById(id);
  const STORAGE = "findit-natural-3d-garden-v1";
  const defaults = [
    "Living Room 1",
    "Kitchen 1",
    "Bedroom 1",
    "Bathroom 1"
  ];

  let rooms = defaults.slice();
  let items = [];
  let chosen = null;
  let placing = false;
  let scene;
  let camera;
  let renderer;
  let home;
  let garden;
  let raycaster;
  let floors = [];
  let markers = [];
  let roomCenters = {};
  let angle = 0.7;
  let tilt = 0.7;
  let distance = 30;
  let target = new THREE.Vector3();
  let dragging = false;
  let moved = false;
  let lastX = 0;
  let lastY = 0;
  let downX = 0;
  let downY = 0;
  let pulseStart = 0;

  const canvasHost = $("mhCanvas");

  function setStatus(text) {
    $("mhStatus").textContent = text;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE, JSON.stringify({rooms, items}));
      return true;
    } catch (error) {
      setStatus("Browser storage is unavailable.");
      return false;
    }
  }

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE));
      if (data && Array.isArray(data.rooms)) {
        const valid = data.rooms.filter(
          x => typeof x === "string" && x.length < 80
        );
        if (valid.length && valid.length <= 16) {
          rooms = valid;
        }
      }

      if (data && Array.isArray(data.items)) {
        items = data.items.filter(
          x => x &&
          typeof x.id === "string" &&
          typeof x.name === "string" &&
          typeof x.room === "string" &&
          rooms.includes(x.room)
        );
      }
    } catch (error) {
      rooms = defaults.slice();
      items = [];
    }
  }

  function roomType(name) {
    const n = name.toLowerCase();
    if (n.includes("living room")) return "Living Room";
    if (n.includes("kitchen")) return "Kitchen";
    if (n.includes("bedroom")) return "Bedroom";
    if (n.includes("bathroom")) return "Bathroom";
    if (n.includes("office")) return "Office";
    if (n.includes("hallway")) return "Hallway";
    return "Other";
  }

  function roomIcon(name) {
    const type = roomType(name);
    const icons = {
      "Living Room": "🛋️",
      "Kitchen": "🍳",
      "Bedroom": "🛏️",
      "Bathroom": "🚿",
      "Office": "💻",
      "Hallway": "🚪",
      "Other": "🏠"
    };
    return icons[type];
  }

  function updateUI() {
    $("mhRooms").replaceChildren();
    $("mhItems").replaceChildren();
    $("mhRoom").replaceChildren();

    rooms.forEach(room => {
      const button = document.createElement("button");
      button.className = "mh-entry";
      button.textContent = roomIcon(room) + " " + room;
      button.onclick = () => focusRoom(room);
      $("mhRooms").appendChild(button);

      const option = document.createElement("option");
      option.value = room;
      option.textContent = room;
      $("mhRoom").appendChild(option);
    });

    items.forEach(item => {
      const button = document.createElement("button");
      button.className = "mh-entry";
      if (chosen === item.id) button.classList.add("mh-active");

      const title = document.createElement("strong");
      title.textContent = "📍 " + item.name;

      const detail = document.createElement("small");
      detail.textContent = item.room + " · " + item.location;

      button.append(title, detail);
      button.onclick = () => highlightItem(item.id);
      $("mhItems").appendChild(button);
    });

    if (!items.length) {
      const p = document.createElement("p");
      p.className = "mh-note";
      p.textContent = "No recorded items yet.";
      $("mhItems").appendChild(p);
    }

    $("mhRoomCount").textContent = rooms.length;
    $("mhItemCount").textContent = items.length;
    $("mhStatRooms").textContent = rooms.length;
    $("mhStatItems").textContent = items.length;
  }

  function normalize(text) {
    return text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const types = [
    ["Living Room", "living\\s+rooms?|sallone?"],
    ["Kitchen", "kitchens?|kuzhin[ae]?"],
    ["Bedroom", "bedrooms?|dhom[ae]?\\s+(?:e\\s+)?gjumit?|dhoma\\s+gjumi"],
    ["Bathroom", "bathrooms?|banj[ae]?"],
    ["Office", "offices?|zyr[ae]?"],
    ["Hallway", "hallways?|korridore?"]
  ];

  function parseHome(text) {
    const input = normalize(text);
    const add = /\b(add|shto)\b/.test(input);
    const remove = /\b(remove|delete|hiq)\b/.test(input);
    const matches = [];

    types.forEach(([name, pattern]) => {
      const re = new RegExp("(\\d+)\\s*(?:" + pattern + ")", "i");
      const match = input.match(re);

      if (match) {
        matches.push({
          name,
          count: Math.min(8, Number(match[1]))
        });
      }
    });

    if (!matches.length) return null;

    let next = add || remove ? rooms.slice() : [];

    matches.forEach(entry => {
      const current = next.filter(
        r => roomType(r) === entry.name
      ).length;

      const rest = next.filter(
        r => roomType(r) !== entry.name
      );

      const count = add
        ? current + entry.count
        : remove
          ? Math.max(0, current - entry.count)
          : entry.count;

      for (let i = 1; i <= count; i++) {
        rest.push(entry.name + " " + i);
      }

      next = rest;
    });

    if (!next.length) return "empty";
    if (next.length > 16) return "limit";

    return next;
  }

  $("mhEditToggle").onclick = () => {
    const editor = $("mhEditor");
    editor.hidden = !editor.hidden;
    $("mhEditToggle").textContent = editor.hidden
      ? "✨ Edit Home With Text"
      : "✕ Close Text Editor";
  };

  document.querySelectorAll("[data-mh-example]").forEach(button => {
    button.onclick = () => {
      $("mhPrompt").value = button.dataset.mhExample;
    };
  });

  $("mhGenerate").onclick = () => {
    const result = parseHome($("mhPrompt").value.trim());

    if (!result || typeof result === "string") {
      setStatus(
        result === "limit"
          ? "Maximum 16 rooms."
          : result === "empty"
            ? "A home needs at least one room."
            : "Try: 2 bedrooms, 1 kitchen, 1 bathroom."
      );
      return;
    }

    const missing = items.filter(item => !result.includes(item.room));

    if (missing.length && !confirm(
      "This removes " + missing.length +
      " saved item(s) from deleted rooms. Continue?"
    )) return;

    const oldRooms = rooms;
    const oldItems = items;

    rooms = result;
    items = items.filter(item => rooms.includes(item.room));
    chosen = null;

    if (!save()) {
      rooms = oldRooms;
      items = oldItems;
      return;
    }

    buildHome();
    updateUI();
    resetCamera();
    setStatus("Home updated: " + rooms.length + " rooms.");
  };

  function modal(open) {
    $("mhModal").hidden = !open;
    if (open) $("mhName").focus();
  }

  $("mhRecordOpen").onclick = () => modal(true);
  $("mhModalClose").onclick = () => modal(false);
  $("mhCancel").onclick = () => modal(false);

  $("mhModal").onclick = event => {
    if (event.target === $("mhModal")) modal(false);
  };

  $("mhForm").onsubmit = event => {
    event.preventDefault();

    const name = $("mhName").value.trim();
    const room = $("mhRoom").value;
    const location = $("mhLocation").value.trim();

    if (!name || !room || !location || !rooms.includes(room)) return;

    const item = {
      id: Date.now().toString(36) +
        Math.random().toString(36).slice(2),
      name,
      room,
      location,
      dx: 0,
      dz: 0
    };

    items.push(item);

    if (!save()) {
      items.pop();
      return;
    }

    chosen = item.id;
    $("mhForm").reset();
    modal(false);
    buildHome();
    updateUI();
    highlightItem(item.id);
    setStatus("Item saved! Use Place Item to choose its position.");
  };

  function search() {
    const query = normalize($("mhSearch").value.trim());

    if (!query) {
      setStatus("Enter an item name.");
      return;
    }

    const item = items.find(x =>
      normalize(x.name).includes(query)
    );

    if (!item) {
      setStatus("Item not found.");
      return;
    }

    highlightItem(item.id);
  }

  $("mhFind").onclick = search;

  $("mhSearch").onkeydown = event => {
    if (event.key === "Enter") search();
  };

  $("mhSave").onclick = () => {
    if (save()) setStatus("Home saved successfully.");
  };

  $("mhReset").onclick = () => {
    if (!confirm("Reset your home and remove its saved items?")) return;

    const oldRooms = rooms;
    const oldItems = items;

    rooms = defaults.slice();
    items = [];
    chosen = null;
    placing = false;

    if (!save()) {
      rooms = oldRooms;
      items = oldItems;
      return;
    }

    $("mhPlace").classList.remove("mh-selected");
    $("mhMode").textContent = "VIEW MODE";

    buildHome();
    updateUI();
    resetCamera();
    setStatus("Home reset.");
  };

  function material(color, roughness = .84, metalness = 0) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness
    });
  }

  function box(parent, w, h, d, x, y, z, color) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      material(color)
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function cylinder(parent, top, bottom, height, x, y, z, color) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(top, bottom, height, 24),
      material(color)
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function soft(parent, w, h, d, x, y, z, color) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 16),
      material(color, .98)
    );

    mesh.scale.set(w / 2, h / 2, d / 2);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function legs(parent, x, z, w, d, h, color) {
    for (const a of [-1, 1]) {
      for (const b of [-1, 1]) {
        box(
          parent, .085, h, .085,
          x + a * (w / 2 - .12),
          h / 2,
          z + b * (d / 2 - .12),
          color
        );
      }
    }
  }

  function rug(parent, x, z, w, d, color) {
    box(parent, w, .035, d, x, .038, z, color);
    box(parent, w - .15, .01, .03,
      x, .06, z - d / 2 + .13, "#eee4d5");
    box(parent, w - .15, .01, .03,
      x, .06, z + d / 2 - .13, "#eee4d5");
  }

  function plant(parent, x, z, size = 1) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.scale.setScalar(size);
    parent.add(group);

    cylinder(group, .20, .25, .42, 0, .22, 0, "#ab8b74");
    cylinder(group, .15, .15, .04, 0, .44, 0, "#493e35");
    cylinder(group, .035, .035, .68, 0, .78, 0, "#668252");

    [
      [-.18, .82, 0],
      [.16, .96, .04],
      [.02, 1.14, .14],
      [-.17, 1.1, -.08],
      [.22, .78, .10]
    ].forEach((p, i) => {
      const leaf = soft(
        group, .2, .43, .15,
        p[0], p[1], p[2],
        i % 2 ? "#6b8d68" : "#809f77"
      );

      leaf.rotation.z = -p[0] * 1.8;
    });
  }

  function floorTexture(bathroom) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;

    const c = canvas.getContext("2d");
    c.fillStyle = bathroom ? "#e5e3dc" : "#d1aa84";
    c.fillRect(0, 0, 512, 512);

    if (bathroom) {
      for (let x = 0; x < 512; x += 64) {
        for (let y = 0; y < 512; y += 64) {
          c.fillStyle = ((x + y) / 64) % 2
            ? "#dad8d2"
            : "#eeece6";

          c.fillRect(x + 2, y + 2, 60, 60);
        }
      }
    } else {
      const colors = [
        "#d4af8b",
        "#c49a75",
        "#ddb895",
        "#c9a17e"
      ];

      for (let row = 0; row < 13; row++) {
        for (let col = -1; col < 6; col++) {
          const x = col * 128 + (row % 2 ? 64 : 0);
          const y = row * 40;

          c.fillStyle = colors[(row + col + 40) % colors.length];
          c.fillRect(x + 1, y + 1, 126, 38);

          c.strokeStyle = "#8d604435";
          c.beginPath();
          c.moveTo(x + 10, y + 10);
          c.bezierCurveTo(
            x + 45, y + 5,
            x + 75, y + 22,
            x + 115, y + 14
          );
          c.stroke();
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.5, 1.5);
    return texture;
  }

  function label(text, purple = false) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;

    const c = canvas.getContext("2d");
    c.fillStyle = purple ? "#7050abe9" : "#1a2230e3";
    c.fillRect(0, 0, 512, 128);

    c.fillStyle = "#ffffff";
    c.font = "bold 34px Arial";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text, 256, 65, 475);

    const texture = new THREE.CanvasTexture(canvas);

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false
      })
    );

    sprite.scale.set(2.4, .6, 1);
    return sprite;
  }

  function roomWindow(group, depth) {
    const z = -depth / 2 + .12;

    box(group, 1.46, .90, .035,
      0, 1.36, z, "#b8d8e0");

    box(group, 1.6, .075, .15,
      0, 1.85, z + .06, "#faf9f4");

    box(group, 1.6, .075, .15,
      0, .87, z + .06, "#faf9f4");

    [-.79, 0, .79].forEach(x => {
      box(group, .07, .98, .13,
        x, 1.36, z + .07, "#f4f3ef");
    });

    box(group, 1.7, .09, .28,
      0, .83, z + .17, "#e4ded4");
  }

  function furniture(group, type) {
    const wood = "#9e7c5c";
    const dark = "#78583f";
    const beige = "#c7b8a5";

    if (type === "Living Room") {
      rug(group, -.45, .35, 2.8, 2.0, "#d5cabd");

      box(group, 2.35, .38, .94,
        -.66, .39, -.91, beige);

      box(group, 2.39, .72, .23,
        -.66, .68, -1.39, "#b1a290");

      box(group, .24, .54, .94,
        -1.86, .53, -.91, "#bbaa99");

      box(group, .24, .54, .94,
        .54, .53, -.91, "#bbaa99");

      [-1.4, -.67, .08].forEach(x => {
        soft(group, .64, .18, .66,
          x, .64, -.88, "#e3d9cb");
      });

      soft(group, .42, .38, .18,
        -1.42, .87, -1.22, "#8da08c");

      soft(group, .36, .35, .18,
        .08, .87, -1.22, "#b98e7d");

      legs(group, -.45, .58, 1.35, .8, .40, dark);

      box(group, 1.35, .12, .8,
        -.45, .47, .58, wood);

      cylinder(group, .15, .15, .07,
        -.46, .57, .58, "#eee5d8");

      box(group, 1.48, .45, .43,
        1.43, .25, 1.75, dark);

      box(group, 1.16, .74, .07,
        1.43, .92, 1.69, "#30373a");

      plant(group, 1.8, -.55, .72);
    }

    else if (type === "Bedroom") {
      rug(group, -.5, .35, 2.7, 2.7, "#e2d7cb");

      box(group, 2.05, .38, 2.28,
        -.55, .32, -.25, dark);

      box(group, 1.88, .23, 2.05,
        -.55, .63, -.22, "#f3eee6");

      box(group, 2.12, .85, .18,
        -.55, .70, -1.47, "#a78d79");

      soft(group, .72, .2, .43,
        -1.07, .83, -1.04, "#ffffff");

      soft(group, .72, .2, .43,
        -.04, .83, -1.04, "#ffffff");

      soft(group, 1.72, .13, 1.05,
        -.55, .75, .35, "#bdc6c4");

      [-1.91, .82].forEach(x => {
        box(group, .51, .58, .49,
          x, .36, -1.08, wood);

        box(group, .54, .09, .51,
          x, .70, -1.08, "#d4b28f");

        cylinder(group, .12, .12, .035,
          x, .77, -1.08, "#eee2cf");
      });

      box(group, .9, 1.85, .72,
        1.60, .92, -1.28, "#b29b80");

      plant(group, 1.75, 1.42, .55);
    }

    else if (type === "Kitchen") {
      box(group, 3.57, .78, .63,
        0, .42, -1.66, "#eeeae5");

      box(group, 3.64, .10, .72,
        0, .86, -1.66, "#adb0ae");

      [-1.27, -.43, .41, 1.25].forEach(x => {
        box(group, .027, .72, .025,
          x, .42, -1.335, "#b8b4af");
      });

      box(group, .83, .018, .46,
        -.78, .925, -1.64, "#aebcbb");

      [.43, .83].forEach(x => {
        [-1.85, -1.51].forEach(z => {
          cylinder(group, .09, .09, .016,
            x, .93, z, "#3b4142");
        });
      });

      box(group, 1.76, .13, .94,
        .12, .75, .56, wood);

      legs(group, .12, .56, 1.76, .94, .68, dark);

      [-.42, .64].forEach(x => {
        box(group, .44, .11, .44,
          x, .40, 1.41, beige);

        legs(group, x, 1.41, .44, .44, .34, dark);
      });

      box(group, .68, 1.84, .72,
        1.79, .92, -.3, "#d7dcdd");
    }

    else if (type === "Bathroom") {
      box(group, 1.42, .50, 1.28,
        -1.22, .30, -1.04, "#faf9f7");

      box(group, 1.22, .07, 1.05,
        -1.22, .58, -1.04, "#d8e5e9");

      box(group, 1.36, 1.08, .065,
        -1.22, 1.24, -1.72, "#c6dee5");

      box(group, 1.30, .72, .5,
        .62, .43, -1.60, wood);

      box(group, 1.35, .09, .55,
        .62, .84, -1.60, "#eeeae4");

      cylinder(group, .28, .28, .08,
        .62, .93, -1.60, "#ffffff");

      box(group, .87, .71, .065,
        .62, 1.52, -2.08, "#bfced3");

      cylinder(group, .32, .26, .51,
        1.2, .35, .62, "#f6f5f2");

      cylinder(group, .21, .21, .16,
        1.2, .68, .62, "#f6f5f2");

      rug(group, -.25, .92, 1.25, .66, "#c4c8c5");
    }

    else if (type === "Office") {
      rug(group, 0, .25, 2.8, 2.5, "#d2d1cb");

      box(group, 2.30, .13, .86,
        0, .79, -1.18, wood);

      legs(group, 0, -1.18, 2.30, .86, .73, dark);

      box(group, .82, .53, .09,
        0, 1.18, -1.25, "#35393c");

      box(group, .66, .13, .56,
        0, .49, -.19, "#b2a79d");

      box(group, .63, .62, .12,
        0, .68, -.43, "#716e69");

      plant(group, 1.63, .98, .73);
    }

    else {
      rug(group, 0, 0, 2.5, 2.15, "#e0d9ca");

      box(group, 1.55, .44, .72,
        0, .29, -1, wood);

      plant(group, 1.5, 1.15, .70);
    }
  }

  function createRoom(group, room, w, d) {
    const bathroom = roomType(room) === "Bathroom";

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(w - .08, .17, d - .08),
      new THREE.MeshStandardMaterial({
        map: floorTexture(bathroom),
        roughness: .9
      })
    );

    floor.position.y = -.12;
    floor.receiveShadow = true;
    floor.userData.room = room;

    group.add(floor);
    floors.push(floor);

    const wall = "#f4f1eb";

    box(group, 1.58, 2.25, .16,
      -1.61, 1.125, -d / 2, wall);

    box(group, 1.58, 2.25, .16,
      1.61, 1.125, -d / 2, wall);

    box(group, 1.66, .80, .16,
      0, .4, -d / 2, wall);

    box(group, 1.66, .39, .16,
      0, 2.055, -d / 2, wall);

    box(group, .16, 2.25, d,
      -w / 2, 1.125, 0, wall);

    box(group, w, .15, .10,
      0, .075, -d / 2 + .12, "#ded8cf");

    roomWindow(group, d);
    furniture(group, roomType(room));

    const title = label(room);
    title.position.set(0, 2.70, 0);
    group.add(title);
  }

  function tree(parent, x, z, scale = 1) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.scale.setScalar(scale);
    parent.add(g);

    cylinder(g, .15, .24, 1.6,
      0, .72, 0, "#816347");

    soft(g, 1.22, 1.0, 1.20,
      0, 1.72, 0, "#729c69");

    soft(g, .93, .80, .93,
      -.34, 1.55, .17, "#86aa76");

    soft(g, 1.0, .85, 1.0,
      .33, 1.65, -.12, "#6a9460");

    soft(g, .85, .72, .85,
      0, 2.10, 0, "#81a875");
  }

  function bush(parent, x, z, size = 1) {
    soft(parent, .8 * size, .48 * size, .8 * size,
      x, .12, z, "#6b925f");

    soft(parent, .55 * size, .38 * size, .60 * size,
      x - .19 * size, .23, z + .09 * size, "#83a774");

    soft(parent, .58 * size, .36 * size, .58 * size,
      x + .20 * size, .22, z - .10 * size, "#719b68");
  }

  function flowers(parent, x, z, w, d) {
    box(parent, w, .18, d, x, -.15, z, "#8b704f");
    box(parent, w - .13, .08, d - .13,
      x, -.04, z, "#665238");

    const colors = [
      "#f28f91",
      "#ffd778",
      "#f7b3da",
      "#fff5c4",
      "#a9c9ef"
    ];

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 6; col++) {
        const px = x - w / 2 + .35 +
          col * ((w - .7) / 5);

        const pz = z - d / 2 + .25 +
          row * ((d - .5) / 2);

        cylinder(parent, .014, .014, .16,
          px, .08, pz, "#57794e");

        soft(parent, .13, .13, .13,
          px, .19, pz, colors[(row + col) % colors.length]);
      }
    }
  }

  function swimmingPool(parent, x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    parent.add(g);

    box(g, 4.7, .20, 3.0,
      0, -.10, 0, "#e4e0d8");

    box(g, 4.15, .12, 2.45,
      0, -.025, 0, "#5fb7ca");

    const water = new THREE.Mesh(
      new THREE.BoxGeometry(4.08, .045, 2.38),
      new THREE.MeshPhysicalMaterial({
        color: "#60c8df",
        transparent: true,
        opacity: .83,
        roughness: .15,
        metalness: .05
      })
    );

    water.position.y = .055;
    g.add(water);

    for (let i = 0; i < 5; i++) {
      box(g, .035, .015, .40,
        -1.75 + i * .85,
        .085,
        -.45 + (i % 2) * .3,
        "#b9f4fb");
    }

    [-1.65, -.50].forEach(px => {
      box(g, .85, .09, .50,
        px, .08, 1.86, "#ddcfb8");

      box(g, .82, .05, .45,
        px, .14, 1.86, "#f2eee7");

      box(g, .06, .18, .50,
        px - .36, .06, 1.86, "#997a59");
    });
  }

  function trampoline(parent, x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    parent.add(g);

    cylinder(g, 1.22, 1.22, .09,
      0, .65, 0, "#45494a");

    cylinder(g, 1.12, 1.12, .035,
      0, .71, 0, "#202529");

    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      const px = Math.cos(a) * 1.05;
      const pz = Math.sin(a) * 1.05;

      cylinder(g, .04, .04, .63,
        px, .34, pz, "#72787b");
    }

    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      const px = Math.cos(a) * 1.20;
      const pz = Math.sin(a) * 1.20;

      cylinder(g, .025, .025, 1.55,
        px, 1.45, pz, "#565b5e");
    }

    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      const b = (i + 1) * Math.PI / 4;

      const p1 = new THREE.Vector3(
        Math.cos(a) * 1.2, 2.20, Math.sin(a) * 1.2
      );

      const p2 = new THREE.Vector3(
        Math.cos(b) * 1.2, 2.20, Math.sin(b) * 1.2
      );

      const direction = p2.clone().sub(p1);

      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(.018, .018, direction.length(), 8),
        material("#454a4d")
      );

      mesh.position.copy(p1).add(p2).multiplyScalar(.5);
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
      );
      g.add(mesh);
    }
  }

  function basketball(parent, x, z) {
    const ball = soft(parent, .42, .42, .42,
      x, .21, z, "#ef913d");

    const stripeMat = material("#292827");

    const hoop = new THREE.Mesh(
      new THREE.TorusGeometry(.205, .009, 5, 28),
      stripeMat
    );

    hoop.position.set(x, .21, z);
    hoop.rotation.x = Math.PI / 2;
    parent.add(hoop);

    return ball;
  }

  function bench(parent, x, z) {
    box(parent, 1.8, .12, .58,
      x, .48, z, "#9f7958");

    box(parent, 1.8, .58, .11,
      x, .87, z - .27, "#886548");

    legs(parent, x, z, 1.6, .45, .42, "#75573d");
  }

  function stonePath(parent, x, z, count) {
    for (let i = 0; i < count; i++) {
      box(
        parent, 1.1, .035, .67,
        x + i * 1.16,
        -.155,
        z + (i % 2) * .12,
        i % 2 ? "#d6cbbb" : "#e0d6c6"
      );
    }
  }

  function buildGarden(columns, rows, w, d) {
    clearGroup(garden);

    const width = columns * w;
    const depth = rows * d;
    const left = -width / 2;
    const right = width / 2;
    const back = -depth / 2;
    const front = depth / 2;

    box(
      garden, width + 20, .12, depth + 20,
      0, -.25, 0, "#7eaa6b"
    );

    box(
      garden, width + 5, .025, depth + 5,
      0, -.17, 0, "#90b67d"
    );

    flowers(
      garden, 0, front + 3.5, 4.7, 1.3
    );

    flowers(
      garden, left - 3.7, -1.1, 1.2, 3.5
    );

    stonePath(
      garden, left - 1.8, front + 1.1,
      Math.min(columns + 3, 8)
    );

    tree(garden, left - 6, back - 5, 1.1);
    tree(garden, right + 7, back - 5, .95);
    tree(garden, left - 6, front + 5, .9);
    tree(garden, right + 7, front + 5, 1.05);

    tree(garden, left - 6, 0, .85);
    tree(garden, right + 7, 0, .85);

    bush(garden, left - 3, back - 3, 1.0);
    bush(garden, left - 3.6, front + 1.5, 1.0);
    bush(garden, right + 3, front + 5.4, 1.0);
    bush(garden, right + 6, back + 2.0, .95);

    swimmingPool(
      garden,
      right + 4.6,
      back + 1.8
    );

    trampoline(
      garden,
      left - 4.8,
      front + 2.0
    );

    basketball(
      garden,
      left - 2.9,
      front + 4.4
    );

    bench(
      garden,
      right + 3.8,
      front + 5.0
    );

    plant(garden, right + 1.6, front + 2.1, .75);
    plant(garden, right + 6.5, front + 3.5, .8);
  }

  function clearGroup(group) {
    const textures = new Set();
    const materials = new Set();

    group.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();

      if (obj.material) {
        const mats = Array.isArray(obj.material)
          ? obj.material
          : [obj.material];

        mats.forEach(m => {
          if (m.map) textures.add(m.map);
          materials.add(m);
        });
      }
    });

    materials.forEach(m => m.dispose());
    textures.forEach(t => t.dispose());
    group.clear();
  }

  function makeMarker(item) {
    const center = roomCenters[item.room];
    if (!center) return;

    const g = new THREE.Group();
    g.position.set(
      center.x + Number(item.dx || 0),
      0,
      center.z + Number(item.dz || 0)
    );

    cylinder(g, .23, .23, .06,
      0, .10, 0, "#805cb9");

    cylinder(g, .11, .11, .18,
      0, .23, 0, "#f4dc7b");

    const title = label(item.name, true);
    title.position.y = 1.7;
    g.add(title);

    g.userData.itemId = item.id;
    home.add(g);
    markers.push(g);
  }

  function buildHome() {
    if (!home || !garden) return;

    clearGroup(home);

    floors = [];
    markers = [];
    roomCenters = {};

    const columns = Math.ceil(Math.sqrt(rooms.length));
    const rows = Math.ceil(rooms.length / columns);
    const w = 4.8;
    const d = 4.5;

    rooms.forEach((room, i) => {
      const col = i % columns;
      const row = Math.floor(i / columns);

      const x = (col - (columns - 1) / 2) * w;
      const z = (row - (rows - 1) / 2) * d;

      roomCenters[room] = {x, z};

      const g = new THREE.Group();
      g.position.set(x, 0, z);
      home.add(g);

      createRoom(g, room, w, d);

      const tag = label(room);
      tag.position.y = 2.7;
      g.add(tag);
    });

    buildGarden(columns, rows, w, d);
    items.forEach(makeMarker);
  }

  function updateCamera() {
    if (!camera) return;

    camera.position.set(
      target.x + distance * Math.sin(tilt) * Math.sin(angle),
      target.y + distance * Math.cos(tilt),
      target.z + distance * Math.sin(tilt) * Math.cos(angle)
    );

    camera.lookAt(target);
  }

  function resetCamera() {
    angle = .70;
    tilt = .70;
    distance = Math.max(
      29,
      Math.ceil(Math.sqrt(rooms.length)) * 10
    );

    target.set(0, 0, 0);
    updateCamera();
  }

  function focusRoom(room) {
    const center = roomCenters[room];
    if (!center) return;

    target.set(center.x, 0, center.z);
    angle = .65;
    tilt = .75;
    distance = 12;
    updateCamera();

    setStatus("Showing " + room);
  }

  function highlightItem(id) {
    const item = items.find(x => x.id === id);
    if (!item) return;

    chosen = id;
    pulseStart = performance.now();

    updateUI();
    focusRoom(item.room);

    setStatus(
      item.name + " — " +
      item.room + " — " +
      item.location
    );
  }

  function placeMode() {
    if (!items.length) {
      setStatus("Record an item first.");
      return;
    }

    if (!chosen) chosen = items[items.length - 1].id;

    placing = !placing;

    $("mhPlace").classList.toggle("mh-selected", placing);
    $("mhMode").textContent = placing
      ? "PLACE ITEM MODE"
      : "VIEW MODE";

    setStatus(
      placing
        ? "Click a floor to place the selected item."
        : "View mode activated."
    );
  }

  $("mhPlace").onclick = placeMode;

  $("mhTop").onclick = () => {
    angle = 0;
    tilt = .045;
    distance = Math.max(
      30,
      Math.ceil(Math.sqrt(rooms.length)) * 11
    );
    target.set(0, 0, 0);
    updateCamera();
  };

  $("mhCameraReset").onclick = resetCamera;

  function placeAt(event) {
    const rect = renderer.domElement.getBoundingClientRect();

    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycaster.setFromCamera(pointer, camera);

    const hits = raycaster.intersectObjects(floors, false);
    if (!hits.length) return;

    const room = hits[0].object.userData.room;
    const center = roomCenters[room];
    const item = items.find(x => x.id === chosen);

    if (!item) return;

    const previous = {...item};

    item.room = room;
    item.dx = THREE.MathUtils.clamp(
      hits[0].point.x - center.x,
      -2.05,
      2.05
    );
    item.dz = THREE.MathUtils.clamp(
      hits[0].point.z - center.z,
      -1.95,
      1.95
    );

    if (!save()) {
      Object.assign(item, previous);
      return;
    }

    placing = false;
    $("mhPlace").classList.remove("mh-selected");
    $("mhMode").textContent = "VIEW MODE";

    buildHome();
    updateUI();

    setStatus(item.name + " placed in " + room);
  }

  function init3D() {
    if (!window.THREE) {
      canvasHost.textContent =
        "Three.js could not load. Check your internet connection.";
      setStatus("3D library unavailable.");
      return;
    }

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#b3c9aa");

      camera = new THREE.PerspectiveCamera(
        45, 1, .1, 300
      );

      renderer = new THREE.WebGLRenderer({
        antialias: true
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
      );

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.22;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      canvasHost.appendChild(renderer.domElement);

      const ambient = new THREE.HemisphereLight(
        "#ffffff",
        "#9c9a7e",
        2.15
      );
      scene.add(ambient);

      const sun = new THREE.DirectionalLight(
        "#fff9ed",
        2.2
      );

      sun.position.set(14, 24, 10);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.left = -55;
      sun.shadow.camera.right = 55;
      sun.shadow.camera.top = 55;
      sun.shadow.camera.bottom = -55;

      scene.add(sun);

      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(300, 300),
        material("#739d66", 1)
      );

      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -.34;
      ground.receiveShadow = true;
      scene.add(ground);

      home = new THREE.Group();
      garden = new THREE.Group();

      scene.add(garden);
      scene.add(home);

      raycaster = new THREE.Raycaster();

      function resize() {
        const width = canvasHost.clientWidth;
        const height = canvasHost.clientHeight;

        if (!width || !height) return;

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }

      if (window.ResizeObserver) {
        new ResizeObserver(resize).observe(canvasHost);
      } else {
        window.addEventListener("resize", resize);
      }

      const canvas = renderer.domElement;

      canvas.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;

        dragging = true;
        moved = false;
        lastX = event.clientX;
        lastY = event.clientY;
        downX = event.clientX;
        downY = event.clientY;

        canvas.setPointerCapture(event.pointerId);
      });

      canvas.addEventListener("pointermove", event => {
        if (!dragging) return;

        if (
          Math.abs(event.clientX - downX) +
          Math.abs(event.clientY - downY) > 5
        ) {
          moved = true;
        }

        if (!placing) {
          angle -= (event.clientX - lastX) * .007;

          tilt = THREE.MathUtils.clamp(
            tilt + (event.clientY - lastY) * .007,
            .06,
            1.48
          );

          updateCamera();
        }

        lastX = event.clientX;
        lastY = event.clientY;
      });

      canvas.addEventListener("pointerup", event => {
        if (placing && !moved) placeAt(event);
        dragging = false;
      });

      canvas.addEventListener("pointercancel", () => {
        dragging = false;
      });

      canvas.addEventListener("wheel", event => {
        event.preventDefault();

        distance = THREE.MathUtils.clamp(
          distance + event.deltaY * .025,
          7,
          95
        );

        updateCamera();
      }, {passive: false});

      buildHome();
      resetCamera();
      resize();

      function animate() {
        requestAnimationFrame(animate);

        markers.forEach(marker => {
          if (
            marker.userData.itemId === chosen &&
            pulseStart
          ) {
            const age = (performance.now() - pulseStart) / 1000;

            marker.scale.setScalar(
              age < 4
                ? 1 + Math.sin(age * 12) * .16
                : 1
            );
          } else {
            marker.scale.setScalar(1);
          }
        });

        renderer.render(scene, camera);
      }

      animate();
    } catch (error) {
      console.error(error);
      setStatus("Could not start the 3D viewer.");
    }
  }

  load();
  updateUI();
  init3D();
});


document.addEventListener("DOMContentLoaded", function () {
  const page = document.body.dataset.page;

  const navigation = [
    ["Home", "index.html"],
    ["How It Works", "how.html"],
    ["Dashboard", "dashboard.html"],
    ["My Home", "myhome.html"],
    ["Features", "features.html"],
    ["About", "about.html"]
  ];

  function updateNavigation() {
    const header = document.getElementById("site-header");
    if (!header) return;

    let nav = header.querySelector(".navbar-nav");

    if (!nav && page === "myhome") {
      header.innerHTML = "";

      const navbar = document.createElement("nav");
      navbar.className = "navbar navbar-expand-lg navbar-dark";
      navbar.style.background = "#17172a";
      navbar.style.padding = "16px 4%";

      const container = document.createElement("div");
      container.className = "container-fluid";

      const brand = document.createElement("a");
      brand.className = "navbar-brand fw-bold";
      brand.href = "index.html";
      brand.textContent = "FIND IT.";

      const toggle = document.createElement("button");
      toggle.className = "navbar-toggler";
      toggle.type = "button";
      toggle.dataset.bsToggle = "collapse";
      toggle.dataset.bsTarget = "#mhNavigation";
      toggle.setAttribute("aria-controls", "mhNavigation");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Toggle navigation");

      const toggleIcon = document.createElement("span");
      toggleIcon.className = "navbar-toggler-icon";
      toggle.append(toggleIcon);

      const collapse = document.createElement("div");
      collapse.className = "collapse navbar-collapse";
      collapse.id = "mhNavigation";

      nav = document.createElement("ul");
      nav.className = "navbar-nav ms-auto gap-lg-3";

      navigation.forEach(([name, url]) => {
        const li = document.createElement("li");
        li.className = "nav-item";

        const link = document.createElement("a");
        link.className = "nav-link";
        link.href = url;
        link.textContent = name;

        if (url === "myhome.html") link.classList.add("active");

        li.append(link);
        nav.append(li);
      });

      collapse.append(nav);
      container.append(brand, toggle, collapse);
      navbar.append(container);
      header.append(navbar);
    }

    if (nav && !nav.querySelector('a[href="myhome.html"]')) {
      const li = document.createElement("li");
      li.className = "nav-item";

      const link = document.createElement("a");
      link.className = "nav-link";
      link.href = "myhome.html";
      link.textContent = "My Home";

      if (page === "myhome") link.classList.add("active");

      li.append(link);

      const dashboardLink = nav.querySelector(
        'a[href="dashboard.html"]'
      );

      if (dashboardLink && dashboardLink.parentElement) {
        dashboardLink.parentElement.after(li);
      } else {
        nav.append(li);
      }
    }
  }

  updateNavigation();

  if (page !== "myhome") return;

  const $ = id => document.getElementById(id);
  const STORAGE = "findit-multifloor-home-v3";

  const roomNames = {
    bedroom: "Bedroom",
    living: "Living Room",
    kitchen: "Kitchen",
    bathroom: "Bathroom",
    garage: "Garage",
    storage: "Storage",
    basement: "Basement Room",
    laundry: "Laundry Room",
    office: "Office",
    gym: "Gym",
    game: "Game Room",
    dining: "Dining Room",
    hallway: "Hallway",
    custom: "Custom Room"
  };

  const roomIcons = {
    bedroom: "🛏️",
    living: "🛋️",
    kitchen: "🍳",
    bathroom: "🚿",
    garage: "🚗",
    storage: "📦",
    basement: "🏚️",
    laundry: "🧺",
    office: "💻",
    gym: "🏋️",
    game: "🎮",
    dining: "🍽️",
    hallway: "🚪",
    custom: "🏠"
  };

  function createDefaults() {
    return {
      floors: [
        {
          id: "floor-basement",
          name: "Basement",
          rooms: [
            {
              id: "room-storage",
              type: "storage",
              name: "Storage Room"
            },
            {
              id: "room-basement",
              type: "basement",
              name: "Basement Room"
            }
          ]
        },
        {
          id: "floor-ground",
          name: "Ground Floor",
          rooms: [
            {
              id: "room-living",
              type: "living",
              name: "Living Room"
            },
            {
              id: "room-kitchen",
              type: "kitchen",
              name: "Kitchen"
            },
            {
              id: "room-garage",
              type: "garage",
              name: "Garage"
            }
          ]
        },
        {
          id: "floor-first",
          name: "First Floor",
          rooms: [
            {
              id: "room-master",
              type: "bedroom",
              name: "Master Bedroom"
            },
            {
              id: "room-ela",
              type: "bedroom",
              name: "Ela's Bedroom"
            },
            {
              id: "room-bathroom",
              type: "bathroom",
              name: "Bathroom"
            }
          ]
        }
      ],
      items: []
    };
  }

  let data = createDefaults();
  let activeFloorId = "floor-ground";
  let editingRoomId = null;
  let selectedItemId = null;
  let viewMode = "exterior";

  let scene = null;
  let camera = null;
  let renderer = null;
  let house = null;
  let garden = null;
  let facade = null;
  let roof = null;
  let raycaster = null;

  let floorGroups = [];
  let itemMarkers = [];
  let roomLocations = new Map();

  let cameraAngle = 0.7;
  let cameraTilt = 0.85;
  let cameraDistance = 38;

  let desiredDistance = 38;
  let desiredTarget = null;
  let cameraTarget = null;

  let cameraMoving = false;
  let pointerDown = false;
  let pointerMoved = false;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let startPointerX = 0;
  let startPointerY = 0;
  let pulseTime = 0;

  const host = $("mhCanvas");

  function newId() {
    return Date.now().toString(36) +
      Math.random().toString(36).slice(2, 10);
  }

  function status(message) {
    $("mhStatus").textContent = message;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(data));
      return true;
    } catch (error) {
      status("Unable to save your home in this browser.");
      return false;
    }
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE));

      if (
        saved &&
        Array.isArray(saved.floors) &&
        Array.isArray(saved.items) &&
        saved.floors.length >= 1 &&
        saved.floors.length <= 6 &&
        saved.floors.every(floor =>
          floor &&
          typeof floor.id === "string" &&
          typeof floor.name === "string" &&
          Array.isArray(floor.rooms) &&
          floor.rooms.length <= 12 &&
          floor.rooms.every(room =>
            room &&
            typeof room.id === "string" &&
            typeof room.name === "string" &&
            typeof room.type === "string" &&
            Object.hasOwn(roomNames, room.type)
          )
        )
      ) {
        data = saved;
        const ids = new Set(
          data.floors.flatMap(f => f.rooms.map(r => r.id))
        );
        data.items = data.items.filter(item =>
          item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.place === "string" &&
          ids.has(item.roomId)
        );
      }
    } catch (error) {
      data = createDefaults();
    }
  }

  function getFloor(id) {
    return data.floors.find(f => f.id === id);
  }

  function currentFloor() {
    return getFloor(activeFloorId);
  }

  function findRoom(id) {
    for (const floor of data.floors) {
      const room = floor.rooms.find(r => r.id === id);

      if (room) {
        return {floor, room};
      }
    }

    return null;
  }

  function addOption(select, value, name) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = name;
    select.append(option);
  }

  function updateInterface() {
    if (!currentFloor()) {
      activeFloorId = data.floors[0].id;
    }

    const floorSelect = $("mhFloorChoice");
    floorSelect.replaceChildren();

    data.floors.forEach(floor => {
      addOption(floorSelect, floor.id, floor.name);
    });

    floorSelect.value = activeFloorId;
    $("mhFloorName").value = currentFloor().name;
    $("mhFloorCount").textContent =
      data.floors.length + " floors";

    const roomList = $("mhRoomList");
    roomList.replaceChildren();

    currentFloor().rooms.forEach(room => {
      const row = document.createElement("div");
      row.className = "mh-room-entry";

      if (editingRoomId === room.id) {
        row.classList.add("selected");
      }

      const title = document.createElement("span");
      title.textContent =
        (roomIcons[room.type] || "🏠") + " " + room.name;

      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "Edit";
      edit.onclick = () => openRoomEditor(room.id);

      row.append(title, edit);
      roomList.append(row);
    });

    const selectedRoom = currentFloor().rooms.find(
      room => room.id === editingRoomId
    );

    if (!selectedRoom) {
      editingRoomId = null;
      $("mhRoomEditor").hidden = true;
    }

    $("mhRoomCount").textContent =
      currentFloor().rooms.length + " rooms";

    const itemList = $("mhItemList");
    itemList.replaceChildren();

    data.items.forEach(item => {
      const found = findRoom(item.roomId);
      if (!found) return;

      const button = document.createElement("button");
      button.type = "button";

      button.className = "mh-item-entry" +
        (selectedItemId === item.id ? " selected" : "");

      const title = document.createElement("strong");
      title.textContent = "📍 " + item.name;

      const detail = document.createElement("small");
      detail.textContent =
        found.floor.name + " · " +
        found.room.name + " · " +
        item.place;

      button.append(title, detail);
      button.onclick = () => findItem(item.id);

      itemList.append(button);
    });

    if (!data.items.length) {
      const p = document.createElement("p");
      p.className = "mh-muted";
      p.textContent = "No items recorded yet.";
      itemList.append(p);
    }

    $("mhItemCount").textContent = data.items.length;
    $("mhTotalFloors").textContent = data.floors.length;

    $("mhTotalRooms").textContent =
      data.floors.reduce(
        (sum, floor) => sum + floor.rooms.length,
        0
      );

    $("mhTotalItems").textContent = data.items.length;
  }

  function openRoomEditor(id) {
    const found = findRoom(id);
    if (!found) return;

    activeFloorId = found.floor.id;
    editingRoomId = id;

    $("mhRoomEditor").hidden = false;
    $("mhRenameInput").value = found.room.name;
    $("mhReType").value = found.room.type;

    updateInterface();
  }

  function rebuild() {
    if (house) buildHouse();
    updateInterface();
  }

  $("mhFloorChoice").onchange = event => {
    activeFloorId = event.target.value;
    editingRoomId = null;
    updateInterface();

    if (viewMode === "selected") {
      setMode("selected");
    }
  };

  $("mhAddFloor").onclick = () => {
    if (data.floors.length >= 6) {
      status("Maximum 6 floors in this demo.");
      return;
    }

    const number = data.floors.length;

    const floor = {
      id: newId(),
      name: "Floor " + number,
      rooms: [
        {
          id: newId(),
          name: "Bedroom 1",
          type: "bedroom"
        }
      ]
    };

    data.floors.push(floor);
    activeFloorId = floor.id;
    editingRoomId = null;

    save();
    rebuild();
    setMode("exploded");

    status(floor.name + " created successfully.");
  };

  $("mhRemoveFloor").onclick = () => {
    if (data.floors.length <= 1) {
      status("At least one floor must remain.");
      return;
    }

    const floor = currentFloor();

    if (!confirm(
      "Delete " + floor.name +
      " and all its rooms and recorded belongings?"
    )) return;

    const roomIds = new Set(
      floor.rooms.map(room => room.id)
    );

    data.items = data.items.filter(
      item => !roomIds.has(item.roomId)
    );

    data.floors = data.floors.filter(
      entry => entry.id !== floor.id
    );

    activeFloorId = data.floors[0].id;
    editingRoomId = null;

    save();
    rebuild();
    resetCamera();

    status("Floor removed.");
  };

  $("mhRenameFloor").onclick = () => {
    const name = $("mhFloorName").value.trim();

    if (!name) {
      status("Enter a floor name.");
      return;
    }

    currentFloor().name = name;
    save();
    rebuild();
    status("Floor renamed to " + name);
  };

  $("mhAddRoom").onclick = () => {
    const floor = currentFloor();

    if (floor.rooms.length >= 12) {
      status("Maximum 12 rooms per floor.");
      return;
    }

    const type = $("mhRoomType").value;
    const custom = $("mhNewRoomName").value.trim();

    const count = floor.rooms.filter(
      room => room.type === type
    ).length + 1;

    const room = {
      id: newId(),
      type,
      name: custom || roomNames[type] + " " + count
    };

    floor.rooms.push(room);
    $("mhNewRoomName").value = "";

    save();
    rebuild();
    setMode("selected");

    status(room.name + " added to " + floor.name);
  };

  $("mhApplyRoom").onclick = () => {
    const found = findRoom(editingRoomId);
    if (!found) return;

    const name = $("mhRenameInput").value.trim();

    if (!name) {
      status("Enter a room name.");
      return;
    }

    found.room.name = name;
    found.room.type = $("mhReType").value;

    save();
    rebuild();

    status(name + " updated successfully.");
  };

  $("mhDeleteRoom").onclick = () => {
    const found = findRoom(editingRoomId);
    if (!found) return;

    if (!confirm(
      "Delete " + found.room.name +
      " and its recorded items?"
    )) return;

    found.floor.rooms = found.floor.rooms.filter(
      room => room.id !== editingRoomId
    );

    data.items = data.items.filter(
      item => item.roomId !== editingRoomId
    );

    editingRoomId = null;

    save();
    rebuild();

    status("Room deleted.");
  };

  $("mhCloseEditor").onclick = () => {
    editingRoomId = null;
    $("mhRoomEditor").hidden = true;
    updateInterface();
  };

  $("mhPromptToggle").onclick = () => {
    $("mhPromptSection").hidden =
      !$("mhPromptSection").hidden;
  };

  function normalizeText(text) {
    return text.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const patterns = [
    ["bedroom", "bedrooms?|dhom[ae]?\\s+(?:e\\s+)?gjumit?|dhoma\\s+gjumi"],
    ["living", "living\\s+rooms?|sallone?"],
    ["kitchen", "kitchens?|kuzhin[ae]?"],
    ["bathroom", "bathrooms?|banj[ae]?"],
    ["garage", "garages?|garazh[ae]?"],
    ["storage", "storage|depo"],
    ["basement", "basement|podrum[ei]?"],
    ["office", "offices?|zyr[ae]?"],
    ["gym", "gyms?|palest[ea]r"],
    ["game", "game\\s+rooms?"],
    ["laundry", "laundry"],
    ["dining", "dining\\s+rooms?"],
    ["hallway", "hallways?|korridore?"]
  ];

  $("mhApplyPrompt").onclick = () => {
    const text = normalizeText($("mhPrompt").value);
    const removing = /\b(hiq|remove|delete)\b/.test(text);
    const operations = [];

    patterns.forEach(([type, pattern]) => {
      const expression = new RegExp(
        "(\\d+)\\s*(?:" + pattern + ")",
        "i"
      );

      const match = text.match(expression);

      if (match) {
        operations.push({
          type,
          count: Math.min(8, Math.max(1, Number(match[1])))
        });
      }
    });

    if (!operations.length) {
      status(
        "Try: Add 2 bedrooms, Shto 1 garazh, Hiq 1 banje."
      );
      return;
    }

    const floor = currentFloor();
    const totalAdds = removing
      ? 0
      : operations.reduce((sum, op) => sum + op.count, 0);

    if (floor.rooms.length + totalAdds > 12) {
      status("Maximum 12 rooms per floor.");
      return;
    }

    const removedIds = new Set();

    if (removing) {
      operations.forEach(op => {
        for (let i = 0; i < op.count; i++) {
          const index = floor.rooms.findIndex(
            room => room.type === op.type
          );

          if (index === -1) break;

          removedIds.add(floor.rooms[index].id);
          floor.rooms.splice(index, 1);
        }
      });

      const affected = data.items.filter(
        item => removedIds.has(item.roomId)
      );

      if (affected.length && !confirm(
        "This will also delete " +
        affected.length + " saved item(s). Continue?"
      )) {
        load();
        updateInterface();
        return;
      }

      data.items = data.items.filter(
        item => !removedIds.has(item.roomId)
      );
    } else {
      operations.forEach(op => {
        for (let i = 0; i < op.count; i++) {
          const number = floor.rooms.filter(
            room => room.type === op.type
          ).length + 1;

          floor.rooms.push({
            id: newId(),
            type: op.type,
            name: roomNames[op.type] + " " + number
          });
        }
      });
    }

    save();
    rebuild();
    setMode("selected");

    status("Home updated from your description.");
  };

  function fillItemFloors() {
    const select = $("mhItemFloor");
    select.replaceChildren();

    data.floors.forEach(floor => {
      addOption(select, floor.id, floor.name);
    });

    select.value = activeFloorId;
    fillItemRooms();
  }

  function fillItemRooms() {
    const floor = getFloor($("mhItemFloor").value);
    const select = $("mhItemRoom");

    select.replaceChildren();

    if (!floor) return;

    floor.rooms.forEach(room => {
      addOption(select, room.id, room.name);
    });
  }

  $("mhItemFloor").onchange = fillItemRooms;

  function openItemModal(open) {
    $("mhItemModal").hidden = !open;

    if (open) {
      fillItemFloors();
      $("mhItemName").focus();
    }
  }

  $("mhAddItem").onclick = () => openItemModal(true);
  $("mhCloseModal").onclick = () => openItemModal(false);
  $("mhCancelModal").onclick = () => openItemModal(false);

  $("mhItemModal").onclick = event => {
    if (event.target === $("mhItemModal")) {
      openItemModal(false);
    }
  };

  $("mhItemForm").onsubmit = event => {
    event.preventDefault();

    const name = $("mhItemName").value.trim();
    const roomId = $("mhItemRoom").value;
    const place = $("mhItemPlace").value.trim();

    if (!name || !place || !findRoom(roomId)) {
      status("Complete all fields.");
      return;
    }

    const item = {
      id: newId(),
      name,
      roomId,
      place
    };

    data.items.push(item);

    if (!save()) {
      data.items.pop();
      return;
    }

    selectedItemId = item.id;
    $("mhItemForm").reset();

    openItemModal(false);
    rebuild();
    findItem(item.id);
  };

  function findItem(id) {
    const item = data.items.find(entry => entry.id === id);
    if (!item) return;

    const found = findRoom(item.roomId);
    if (!found) return;

    selectedItemId = id;
    activeFloorId = found.floor.id;
    pulseTime = performance.now();

    updateInterface();
    setMode("selected");

    status(
      item.name + " is in " +
      found.room.name + ", " +
      found.floor.name + " — " +
      item.place
    );
  }

  $("mhFind").onclick = () => {
    const query = normalizeText($("mhSearch").value.trim());

    if (!query) {
      status("Enter an item name.");
      return;
    }

    const item = data.items.find(entry =>
      normalizeText(entry.name).includes(query)
    );

    if (item) findItem(item.id);
    else status("Item not found.");
  };

  $("mhSearch").onkeydown = event => {
    if (event.key === "Enter") {
      $("mhFind").click();
    }
  };

  $("mhSave").onclick = () => {
    if (save()) {
      status("Your home has been saved successfully.");
    }
  };

  $("mhReset").onclick = () => {
    if (!confirm(
      "Reset all floors, rooms and saved belongings?"
    )) return;

    data = createDefaults();
    activeFloorId = "floor-ground";
    editingRoomId = null;
    selectedItemId = null;

    if (!save()) return;

    rebuild();
    setMode("exterior");
    status("Demo reset.");
  };

  load();

  if (!getFloor(activeFloorId)) {
    activeFloorId = data.floors[0].id;
  }

  updateInterface();

  if (!window.THREE) {
    host.textContent =
      "Three.js could not load. Check your internet connection.";
    status("3D library unavailable.");
    return;
  }

  function material(color, roughness = .82, metalness = 0) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness
    });
  }

  function box(parent, w, h, d, x, y, z, color) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      material(color)
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);

    return mesh;
  }

  function cylinder(parent, radius, height, x, y, z, color) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        radius, radius, height, 24
      ),
      material(color)
    );

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    parent.add(mesh);

    return mesh;
  }

  function sphere(parent, w, h, d, x, y, z, color) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 16),
      material(color, .96)
    );

    mesh.scale.set(w / 2, h / 2, d / 2);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;

    parent.add(mesh);
    return mesh;
  }

  function makeLabel(text, background = "#25323b") {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 100;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, 512, 100);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 32px Arial";
    ctx.fillText(text, 256, 52, 470);

    const texture = new THREE.CanvasTexture(canvas);

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false
      })
    );

    sprite.scale.set(2.45, .48, 1);
    return sprite;
  }

  function floorTexture(type) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext("2d");
    const tile = ["bathroom", "garage", "basement"].includes(type);

    ctx.fillStyle = tile ? "#e2e0da" : "#d2ae8b";
    ctx.fillRect(0, 0, 512, 512);

    if (tile) {
      for (let y = 0; y < 512; y += 64) {
        for (let x = 0; x < 512; x += 64) {
          ctx.fillStyle = (x + y) % 128
            ? "#e8e6e1"
            : "#d9d8d3";

          ctx.fillRect(x + 2, y + 2, 60, 60);
        }
      }
    } else {
      const colors = [
        "#d8b491",
        "#c89d77",
        "#dfba98",
        "#c8a07e"
      ];

      for (let row = 0; row < 13; row++) {
        for (let col = -1; col < 6; col++) {
          const x = col * 128 + (row % 2 ? 64 : 0);
          const y = row * 40;

          ctx.fillStyle = colors[
            (row + col + 40) % colors.length
          ];

          ctx.fillRect(x + 1, y + 1, 126, 38);

          ctx.strokeStyle = "#89614344";
          ctx.beginPath();
          ctx.moveTo(x + 12, y + 11);
          ctx.bezierCurveTo(
            x + 40, y + 7,
            x + 79, y + 20,
            x + 116, y + 13
          );
          ctx.stroke();
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    return texture;
  }

  function makeLegs(parent, x, z, w, d, h, color) {
    for (const sideX of [-1, 1]) {
      for (const sideZ of [-1, 1]) {
        box(
          parent, .09, h, .09,
          x + sideX * (w / 2 - .12),
          h / 2,
          z + sideZ * (d / 2 - .12),
          color
        );
      }
    }
  }

  function rug(parent, x, z, w, d, color) {
    box(parent, w, .032, d, x, .028, z, color);

    box(
      parent, w - .15, .009, .035,
      x, .05, z - d / 2 + .14,
      "#e8dfd1"
    );

    box(
      parent, w - .15, .009, .035,
      x, .05, z + d / 2 - .14,
      "#e8dfd1"
    );
  }

  function plant(parent, x, z, size = 1) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.scale.setScalar(size);
    parent.add(group);

    cylinder(group, .22, .4, 0, .22, 0, "#a88b70");
    cylinder(group, .17, .045, 0, .44, 0, "#493e34");
    cylinder(group, .033, .72, 0, .77, 0, "#637d50");

    const leaves = [
      [-.17, .83, .06],
      [.16, .96, -.08],
      [.02, 1.16, .10],
      [-.20, 1.08, -.12],
      [.21, .78, .12]
    ];

    leaves.forEach((p, index) => {
      sphere(
        group,
        .22, .44, .17,
        p[0], p[1], p[2],
        index % 2 ? "#77986e" : "#5f865b"
      );
    });
  }

  function furniture(parent, type) {
    const wood = "#a27e5d";
    const walnut = "#77583e";
    const beige = "#d3c4b2";
    const ivory = "#eee8dd";

    if (type === "living") {
      rug(parent, -.4, .28, 2.95, 2.1, "#d9cbbb");

      box(parent, 2.25, .39, .94,
        -.65, .39, -.90, beige);

      box(parent, 2.30, .75, .23,
        -.65, .7, -1.36, "#b5a592");

      box(parent, .24, .52, .94,
        -1.78, .52, -.9, "#c1b1a0");

      box(parent, .24, .52, .94,
        .48, .52, -.9, "#c1b1a0");

      [-1.3, -.62, .05].forEach(x => {
        sphere(parent, .62, .18, .65,
          x, .65, -.87, "#e7dacb");
      });

      sphere(parent, .36, .36, .18,
        -1.35, .88, -1.23, "#8ba18f");

      sphere(parent, .34, .36, .18,
        .07, .88, -1.23, "#ba8c7b");

      makeLegs(parent, -.42, .52, 1.35, .82, .4, walnut);

      box(parent, 1.35, .13, .82,
        -.42, .48, .52, wood);

      cylinder(parent, .14, .06,
        -.42, .57, .52, "#f1e9db");

      box(parent, 1.48, .45, .40,
        1.42, .26, 1.7, walnut);

      box(parent, 1.2, .75, .065,
        1.42, .92, 1.66, "#303538");

      plant(parent, 1.75, -.57, .73);
    }

    else if (type === "bedroom") {
      rug(parent, -.55, .3, 2.75, 2.8, "#e0d6ca");

      box(parent, 2.1, .38, 2.3,
        -.5, .33, -.25, walnut);

      box(parent, 1.89, .26, 2.05,
        -.5, .65, -.25, "#f2eee6");

      box(parent, 2.15, .88, .17,
        -.5, .72, -1.48, "#a88d76");

      sphere(parent, .74, .2, .45,
        -1.04, .85, -1.06, "#ffffff");

      sphere(parent, .74, .2, .45,
        .02, .85, -1.06, "#ffffff");

      sphere(parent, 1.75, .12, 1.05,
        -.5, .78, .34, "#bdc7c3");

      [-1.9, .9].forEach(x => {
        box(parent, .51, .6, .48,
          x, .36, -1.05, wood);

        box(parent, .54, .08, .5,
          x, .71, -1.05, "#cfac86");
      });

      box(parent, .9, 1.85, .73,
        1.65, .93, -1.27, "#b7a088");

      plant(parent, 1.78, 1.46, .55);
    }

    else if (type === "kitchen") {
      box(parent, 3.5, .8, .63,
        0, .42, -1.7, "#eeeae5");

      box(parent, 3.58, .11, .72,
        0, .88, -1.7, "#aeb1ae");

      for (const x of [-1.25, -.43, .43, 1.25]) {
        box(parent, .028, .72, .03,
          x, .41, -1.36, "#bcb7b0");
      }

      for (const x of [.4, .82]) {
        for (const z of [-1.88, -1.52]) {
          cylinder(parent, .09, .018,
            x, .95, z, "#363b3e");
        }
      }

      box(parent, 1.8, .13, .95,
        .1, .78, .55, wood);

      makeLegs(parent, .1, .55, 1.8, .95, .69, walnut);

      [-.48, .62].forEach(x => {
        box(parent, .46, .12, .45,
          x, .42, 1.38, beige);

        makeLegs(parent, x, 1.38, .46, .45, .35, walnut);
      });

      box(parent, .69, 1.84, .72,
        1.8, .94, -.25, "#d7dcdd");
    }

    else if (type === "bathroom") {
      box(parent, 1.4, .52, 1.28,
        -1.25, .3, -1.08, "#faf9f6");

      box(parent, 1.21, .08, 1.05,
        -1.25, .59, -1.08, "#d5e5e9");

      box(parent, 1.33, 1.02, .06,
        -1.25, 1.2, -1.73, "#b8d9e0");

      box(parent, 1.3, .72, .5,
        .62, .4, -1.6, wood);

      box(parent, 1.35, .1, .55,
        .62, .83, -1.6, ivory);

      cylinder(parent, .27, .09,
        .62, .93, -1.6, "#ffffff");

      cylinder(parent, .3, .52,
        1.2, .37, .65, "#f7f7f5");

      cylinder(parent, .2, .16,
        1.2, .7, .65, "#ffffff");

      rug(parent, -.2, 1.0, 1.2, .7, "#c5cbc7");
    }

    else if (type === "garage") {
      box(parent, 2.7, .3, 1.4,
        -.3, .45, .1, "#747e87");

      box(parent, 1.38, .45, 1.15,
        -.5, .74, .1, "#afbac3");

      box(parent, 1.0, .06, 1.1,
        -.5, 1.0, .1, "#8799a5");

      [-1.3, .7].forEach(x => {
        [-.43, .63].forEach(z => {
          cylinder(parent, .25, .16,
            x, .29, z, "#252a2d");
        });
      });

      box(parent, 1, 1.75, .5,
        1.65, .87, -1.45, "#a79b89");

      [.35, .92, 1.49].forEach(y => {
        box(parent, .98, .06, .53,
          1.65, y, -1.45, "#7c6651");
      });
    }

    else if (
      type === "storage" ||
      type === "basement"
    ) {
      [-1.35, 1.32].forEach(x => {
        box(parent, .85, 1.7, .63,
          x, .85, -1.33, "#8e795b");

        [.30, .79, 1.3].forEach(y => {
          box(parent, .77, .36, .51,
            x, y, -1.33, "#be9d76");
        });
      });

      box(parent, 1.6, .75, 1.12,
        0, .4, .62, "#947755");

      box(parent, .84, .54, .65,
        -.64, .52, 1.42, "#c2a37b");
    }

    else if (type === "office" || type === "game") {
      rug(parent, 0, .3, 2.75, 2.55, "#d5d3cc");

      box(parent, 2.22, .13, .88,
        0, .8, -1.2, wood);

      makeLegs(parent, 0, -1.2, 2.22, .88, .73, walnut);

      box(parent, 1.14, .7, .09,
        0, 1.25, -1.39, "#2b3035");

      box(parent, .65, .15, .61,
        0, .49, .17, "#827b76");

      box(parent, .63, .62, .12,
        0, .73, -.2, "#6e6a67");

      if (type === "game") {
        box(parent, .33, .65, .55,
          1.26, .48, -1.35, "#37333f");
      }
    }

    else if (type === "laundry") {
      [-.9, .16].forEach(x => {
        box(parent, .87, .9, .82,
          x, .47, -1.12, "#e7e9e8");

        cylinder(parent, .29, .065,
          x, .5, -.65, "#a4b6bf");

        cylinder(parent, .21, .07,
          x, .5, -.58, "#596e79");
      });

      box(parent, 1.8, 1.7, .5,
        1.1, .85, 1.5, "#b9a48b");
    }

    else if (type === "gym") {
      rug(parent, 0, .2, 2.9, 2.7, "#9c9c99");

      box(parent, 1.8, .14, .65,
        0, .47, 0, "#45484d");

      makeLegs(parent, 0, 0, 1.8, .65, .41, "#383c40");

      cylinder(parent, .11, 1.65,
        0, .14, -1.4, "#575b60");

      [-.75, .75].forEach(x => {
        cylinder(parent, .32, .14,
          x, .14, -1.4, "#25292d");
      });
    }

    else if (type === "dining") {
      box(parent, 2.2, .15, 1.25,
        0, .75, 0, wood);

      makeLegs(parent, 0, 0, 2.2, 1.25, .68, walnut);

      [-1.12, 1.12].forEach(z => {
        [-.65, .65].forEach(x => {
          box(parent, .48, .12, .47,
            x, .43, z, beige);

          box(parent, .48, .52, .1,
            x, .66, z + Math.sign(z) * .23, walnut);
        });
      });
    }

    else {
      rug(parent, 0, 0, 2.6, 2.2, "#dfd6c8");

      box(parent, 1.55, .5, .6,
        0, .3, -1.25, wood);

      plant(parent, 1.55, 1.15, .7);
    }
  }

  function tree(parent, x, z, scale = 1) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.scale.setScalar(scale);
    parent.add(g);

    cylinder(g, .19, 1.55,
      0, .78, 0, "#816045");

    sphere(g, 1.3, 1.1, 1.3,
      0, 1.75, 0, "#729767");

    sphere(g, 1.0, .88, 1.0,
      -.36, 1.63, .15, "#86ab76");

    sphere(g, 1.0, .86, 1.0,
      .36, 1.68, -.14, "#668e5c");

    sphere(g, .88, .8, .88,
      0, 2.12, 0, "#8caf7a");
  }

  function bush(parent, x, z) {
    sphere(parent, .87, .52, .76,
      x, .16, z, "#6b925f");

    sphere(parent, .6, .42, .6,
      x - .2, .25, z + .12, "#82a673");

    sphere(parent, .6, .4, .6,
      x + .2, .24, z - .1, "#6d9864");
  }

  function flowerBed(parent, x, z) {
    box(parent, 4.4, .18, 1.25,
      x, -.16, z, "#795b40");

    box(parent, 4.18, .07, 1.07,
      x, -.05, z, "#5d4b37");

    const colors = [
      "#f58da4",
      "#ffd772",
      "#e9a7e9",
      "#ffffff",
      "#a7caed"
    ];

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        const px = x - 1.7 + i * .65;
        const pz = z - .4 + j * .38;

        cylinder(parent, .014, .16,
          px, .08, pz, "#57834d");

        sphere(parent, .13, .13, .13,
          px, .2, pz,
          colors[(i + j) % colors.length]);
      }
    }
  }

  function swimmingPool(parent, x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    parent.add(g);

    box(g, 5.1, .22, 3.3,
      0, -.17, 0, "#e7e0d5");

    box(g, 4.55, .085, 2.7,
      0, -.05, 0, "#4eb9ce");

    const water = new THREE.Mesh(
      new THREE.BoxGeometry(4.47, .045, 2.63),
      new THREE.MeshPhysicalMaterial({
        color: "#6bd0e5",
        transparent: true,
        opacity: .85,
        roughness: .15,
        metalness: .05
      })
    );

    water.position.y = .025;
    g.add(water);

    for (let i = 0; i < 5; i++) {
      box(
        g, .045, .014, .43,
        -1.7 + i * .82,
        .057,
        -.46 + (i % 2) * .2,
        "#b9f4fa"
      );
    }

    [-1.55, -.35].forEach(px => {
      box(g, .92, .09, .55,
        px, .09, 1.92, "#d9cfbd");

      box(g, .9, .04, .51,
        px, .16, 1.92, "#f3efe8");
    });
  }

  function trampoline(parent, x, z) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    parent.add(g);

    cylinder(g, 1.3, .12,
      0, .65, 0, "#45494e");

    cylinder(g, 1.17, .045,
      0, .74, 0, "#22272b");

    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      const px = Math.cos(a) * 1.2;
      const pz = Math.sin(a) * 1.2;

      cylinder(g, .04, .61,
        px, .32, pz, "#72777a");

      cylinder(g, .025, 1.55,
        px, 1.47, pz, "#4e5458");
    }

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, .025, 8, 40),
      material("#42484b")
    );

    ring.rotation.x = Math.PI / 2;
    ring.position.y = 2.24;
    g.add(ring);
  }

  function basketball(parent, x, z) {
    sphere(parent, .46, .46, .46,
      x, .23, z, "#ef983c");

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(.228, .01, 7, 32),
      material("#272628")
    );

    ring.position.set(x, .23, z);
    ring.rotation.x = Math.PI / 2;

    parent.add(ring);
  }

  function clearGroup(group) {
    if (!group) return;

    const textures = new Set();
    const materials = new Set();

    group.traverse(object => {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        const list = Array.isArray(object.material)
          ? object.material
          : [object.material];

        list.forEach(m => {
          if (m.map) textures.add(m.map);
          materials.add(m);
        });
      }
    });

    materials.forEach(m => m.dispose());
    textures.forEach(texture => texture.dispose());

    group.clear();
  }

  function buildGarden(width, depth) {
    clearGroup(garden);

    box(
      garden, width + 19, .13, depth + 19,
      0, -.31, 0, "#79a76a"
    );

    box(
      garden, width + 6, .025, depth + 6,
      0, -.23, 0, "#93b87e"
    );

    const left = -width / 2;
    const right = width / 2;
    const front = depth / 2;
    const back = -depth / 2;

    flowerBed(garden, 0, front + 3);

    for (let i = 0; i < 6; i++) {
      box(
        garden, 1.05, .035, .68,
        left - 1 + i * 1.12,
        -.20,
        front + 1.25,
        i % 2 ? "#d9cbbb" : "#e8ddcb"
      );
    }

    tree(garden, left - 6, back - 5, 1.05);
    tree(garden, right + 6.5, back - 5, 1.1);
    tree(garden, left - 6, front + 5, .95);
    tree(garden, right + 7, front + 5, 1.0);
    tree(garden, left - 6, 0, .9);
    tree(garden, right + 7, 0, .9);

    bush(garden, left - 2.9, front + 3.6);
    bush(garden, left - 3.8, back + 1.1);
    bush(garden, right + 2.7, front + 5.2);
    bush(garden, right + 6, back + 2.7);

    swimmingPool(garden, right + 4, back + 1.8);
    trampoline(garden, left - 4.5, front + 2.5);
    basketball(garden, left - 2.6, front + 4.5);

    plant(garden, right + 1.5, front + 2, .8);
  }

  function addRoomModel(parent, room, x, z, width, depth) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    parent.add(group);

    const tile = ["bathroom", "garage", "basement"].includes(
      room.type
    );

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(
        width - .08, .18, depth - .08
      ),
      new THREE.MeshStandardMaterial({
        map: floorTexture(room.type),
        roughness: tile ? .92 : .83
      })
    );

    floor.position.y = -.12;
    floor.receiveShadow = true;
    group.add(floor);

    const wall = "#f3f0e9";

    box(group, width, 2.3, .15,
      0, 1.15, -depth / 2, wall);

    box(group, .15, 2.3, depth,
      -width / 2, 1.15, 0, wall);

    box(group, width * .3, .3, .15,
      width * .35, .15, depth / 2, wall);

    box(group, 1.43, .92, .04,
      0, 1.4, -depth / 2 + .1, "#b6d9e1");

    box(group, 1.57, .075, .12,
      0, 1.9, -depth / 2 + .16, "#fffdf8");

    box(group, 1.57, .075, .12,
      0, .9, -depth / 2 + .16, "#fffdf8");

    [-.79, 0, .79].forEach(wx => {
      box(group, .07, 1.0, .10,
        wx, 1.4, -depth / 2 + .16, "#fffdf8");
    });

    furniture(group, room.type);

    const title = makeLabel(room.name);
    title.position.set(0, 2.65, 0);
    group.add(title);

    roomLocations.set(room.id, {
      group,
      x,
      z
    });

    const recordedItems = data.items.filter(
      item => item.roomId === room.id
    );

    recordedItems.forEach((item, index) => {
      const marker = new THREE.Group();

      marker.position.set(
        -.75 + (index % 3) * .75,
        .10,
        .65 + Math.floor(index / 3) * .55
      );

      cylinder(marker, .22, .07,
        0, .08, 0, "#8063b3");

      cylinder(marker, .11, .16,
        0, .22, 0, "#f6dc77");

      const itemLabel = makeLabel(
        item.name,
        "#7255a5"
      );

      itemLabel.position.y = 1.65;
      marker.add(itemLabel);

      marker.userData.itemId = item.id;

      group.add(marker);
      itemMarkers.push(marker);
    });
  }

  function buildHouse() {
    if (!house) return;

    clearGroup(house);

    facade = null;
    roof = null;
    floorGroups = [];
    itemMarkers = [];
    roomLocations.clear();

    const largest = Math.max(
      1,
      ...data.floors.map(f => f.rooms.length)
    );

    const columns = Math.ceil(Math.sqrt(largest));
    const rows = Math.ceil(largest / columns);

    const roomWidth = 4.8;
    const roomDepth = 4.5;

    const houseWidth = columns * roomWidth;
    const houseDepth = rows * roomDepth;

    data.floors.forEach((floor, index) => {
      const floorGroup = new THREE.Group();

      floorGroup.userData.id = floor.id;
      floorGroup.userData.index = index;
      floorGroup.userData.target = new THREE.Vector3(
        0, index * 3.15, 0
      );

      floorGroup.position.y = index * 3.15;
      house.add(floorGroup);
      floorGroups.push(floorGroup);

      box(
        floorGroup,
        houseWidth + .15,
        .28,
        houseDepth + .15,
        0,
        -.23,
        0,
        "#e9e5dd"
      );

      floor.rooms.forEach((room, i) => {
        const col = i % columns;
        const row = Math.floor(i / columns);

        const x = (col - (columns - 1) / 2) * roomWidth;
        const z = (row - (rows - 1) / 2) * roomDepth;

        addRoomModel(
          floorGroup,
          room,
          x,
          z,
          roomWidth,
          roomDepth
        );
      });

      const label = makeLabel(
        floor.name,
        "#3f4b53"
      );

      label.position.set(
        houseWidth / 2 + 1.7,
        1.45,
        0
      );

      floorGroup.add(label);
    });

    facade = new THREE.Group();
    house.add(facade);

    const height = data.floors.length * 3.15;
    const exteriorColor = "#eee9df";

    box(
      facade,
      houseWidth + .42,
      height,
      .18,
      0,
      height / 2 - .1,
      houseDepth / 2 + .12,
      exteriorColor
    );

    box(
      facade,
      .18,
      height,
      houseDepth + .42,
      houseWidth / 2 + .12,
      height / 2 - .1,
      0,
      exteriorColor
    );

    for (let level = 0; level < data.floors.length; level++) {
      for (let col = 0; col < columns; col++) {
        const x = (col - (columns - 1) / 2) * roomWidth;

        box(
          facade, 1.43, 1.12, .04,
          x,
          level * 3.15 + 1.58,
          houseDepth / 2 + .23,
          "#9cc9d4"
        );

        box(
          facade, 1.55, .07, .10,
          x,
          level * 3.15 + 2.18,
          houseDepth / 2 + .27,
          "#ffffff"
        );

        box(
          facade, 1.55, .07, .10,
          x,
          level * 3.15 + 1.00,
          houseDepth / 2 + .27,
          "#ffffff"
        );

        box(
          facade, .065, 1.17, .09,
          x,
          level * 3.15 + 1.58,
          houseDepth / 2 + .28,
          "#ffffff"
        );
      }
    }

    box(
      facade, 1.25, 2.25, .12,
      -houseWidth / 2 + 1.25,
      1.03,
      houseDepth / 2 + .28,
      "#96714f"
    );

    box(
      facade, .07, .08, .10,
      -houseWidth / 2 + 1.67,
      1.0,
      houseDepth / 2 + .39,
      "#e1c88e"
    );

    roof = new THREE.Group();
    roof.position.y = height;

    house.add(roof);

    box(
      roof,
      houseWidth + 1.08,
      .36,
      houseDepth + 1.08,
      0,
      .06,
      0,
      "#715a49"
    );

    box(
      roof,
      houseWidth + .8,
      .075,
      houseDepth + .8,
      0,
      .27,
      0,
      "#937761"
    );

    buildGarden(houseWidth, houseDepth);
    applyViewTargets();
  }

  function applyViewTargets() {
    floorGroups.forEach((group, index) => {
      const target = group.userData.target;

      if (viewMode === "exterior") {
        target.set(0, index * 3.15, 0);
        group.visible = true;
      }

      if (viewMode === "exploded") {
        const side = index % 2 === 0 ? -1 : 1;

        target.set(
          side * (5.6 + index * 1.2),
          index * 4.4 + 1.1,
          -index * .85
        );

        group.visible = true;
      }

      if (viewMode === "selected") {
        const currentIndex = data.floors.findIndex(
          floor => floor.id === activeFloorId
        );

        target.set(
          0,
          index === currentIndex ? 0 : index * 3.15,
          0
        );

        group.visible = index === currentIndex;
      }
    });

    facade.visible = viewMode === "exterior";
    roof.visible = viewMode === "exterior";
    garden.visible = viewMode !== "selected";

    $("mhModeText").textContent = {
      exterior: "EXTERIOR VIEW",
      exploded: "EXPLODED FLOORS",
      selected: "SELECTED FLOOR"
    }[viewMode];

    $("mhOverlayText").textContent =
      viewMode === "exterior"
        ? "🏡 Complete House"
        : viewMode === "exploded"
          ? data.floors.map(f => f.name).join(" · ")
          : currentFloor().name;

    $("mhExterior").classList.toggle(
      "active",
      viewMode === "exterior"
    );

    $("mhExplode").classList.toggle(
      "active",
      viewMode === "exploded"
    );

    $("mhOneFloor").classList.toggle(
      "active",
      viewMode === "selected"
    );
  }

  function setMode(next) {
    viewMode = next;
    applyViewTargets();

    if (!cameraTarget || !desiredTarget) return;

    if (next === "exterior") {
      desiredDistance = Math.max(
        34,
        data.floors.length * 12
      );

      desiredTarget.set(
        0,
        data.floors.length * 1.5,
        0
      );
    }

    if (next === "exploded") {
      desiredDistance = Math.max(
        40,
        data.floors.length * 14
      );

      desiredTarget.set(
        0,
        data.floors.length * 2.0,
        0
      );
    }

    if (next === "selected") {
      desiredDistance = 17;
      desiredTarget.set(0, 0, 0);
    }

    cameraMoving = true;
  }

  function updateCamera() {
    if (!camera || !cameraTarget) return;

    const s = Math.sin(cameraTilt);

    camera.position.set(
      cameraTarget.x +
        cameraDistance * s * Math.sin(cameraAngle),

      cameraTarget.y +
        cameraDistance * Math.cos(cameraTilt),

      cameraTarget.z +
        cameraDistance * s * Math.cos(cameraAngle)
    );

    camera.lookAt(cameraTarget);
  }

  function resetCamera() {
    cameraAngle = .68;
    cameraTilt = .84;

    setMode(viewMode);
  }

  $("mhExterior").onclick = () => {
    setMode("exterior");
  };

  $("mhExplode").onclick = () => {
    setMode("exploded");
  };

  $("mhOneFloor").onclick = () => {
    setMode("selected");
  };

  $("mhResetCamera").onclick = resetCamera;

  $("mhTopView").onclick = () => {
    cameraAngle = 0;
    cameraTilt = .035;
    updateCamera();
  };

  function animate() {
    requestAnimationFrame(animate);

    if (cameraMoving) {
      cameraDistance += (
        desiredDistance - cameraDistance
      ) * .055;

      cameraTarget.lerp(desiredTarget, .055);

      if (
        Math.abs(desiredDistance - cameraDistance) < .03 &&
        cameraTarget.distanceTo(desiredTarget) < .03
      ) {
        cameraDistance = desiredDistance;
        cameraTarget.copy(desiredTarget);
        cameraMoving = false;
      }
    }

    floorGroups.forEach(group => {
      group.position.lerp(
        group.userData.target,
        .065
      );
    });

    itemMarkers.forEach(marker => {
      if (marker.userData.itemId === selectedItemId) {
        const elapsed = (
          performance.now() - pulseTime
        ) / 1000;

        const scale = elapsed < 4
          ? 1 + Math.sin(elapsed * 12) * .18
          : 1;

        marker.scale.setScalar(scale);
      } else {
        marker.scale.setScalar(1);
      }
    });

    updateCamera();
    renderer.render(scene, camera);
  }

  function initialize3D() {
    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#a9c39e");

      camera = new THREE.PerspectiveCamera(
        43,
        1,
        .1,
        500
      );

      cameraTarget = new THREE.Vector3(0, 0, 0);
      desiredTarget = new THREE.Vector3(0, 0, 0);

      renderer = new THREE.WebGLRenderer({
        antialias: true
      });

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
      );

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      host.append(renderer.domElement);

      const ambient = new THREE.HemisphereLight(
        "#ffffff",
        "#a4a38e",
        2.15
      );

      scene.add(ambient);

      const sun = new THREE.DirectionalLight(
        "#fff6e7",
        2.2
      );

      sun.position.set(15, 24, 11);
      sun.castShadow = true;

      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.left = -65;
      sun.shadow.camera.right = 65;
      sun.shadow.camera.top = 65;
      sun.shadow.camera.bottom = -65;

      scene.add(sun);

      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(300, 300),
        material("#7ca66e", 1)
      );

      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -.39;
      ground.receiveShadow = true;

      scene.add(ground);

      house = new THREE.Group();
      garden = new THREE.Group();

      scene.add(house);
      scene.add(garden);

      raycaster = new THREE.Raycaster();

      function resize() {
        const width = host.clientWidth;
        const height = host.clientHeight;

        if (!width || !height) return;

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }

      if ("ResizeObserver" in window) {
        new ResizeObserver(resize).observe(host);
      } else {
        window.addEventListener("resize", resize);
      }

      const canvas = renderer.domElement;

      canvas.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;

        pointerDown = true;
        pointerMoved = false;

        lastPointerX = event.clientX;
        lastPointerY = event.clientY;
        startPointerX = event.clientX;
        startPointerY = event.clientY;

        canvas.setPointerCapture(event.pointerId);
      });

      canvas.addEventListener("pointermove", event => {
        if (!pointerDown) return;

        const dx = event.clientX - lastPointerX;
        const dy = event.clientY - lastPointerY;

        if (
          Math.abs(event.clientX - startPointerX) +
          Math.abs(event.clientY - startPointerY) > 5
        ) {
          pointerMoved = true;
        }

        cameraAngle -= dx * .008;

        cameraTilt = THREE.MathUtils.clamp(
          cameraTilt + dy * .008,
          .04,
          1.48
        );

        lastPointerX = event.clientX;
        lastPointerY = event.clientY;

        cameraMoving = false;
        updateCamera();
      });

      canvas.addEventListener("pointerup", () => {
        pointerDown = false;
      });

      canvas.addEventListener("pointercancel", () => {
        pointerDown = false;
      });

      canvas.addEventListener("wheel", event => {
        event.preventDefault();

        cameraMoving = false;

        const proposed = THREE.MathUtils.clamp(
          cameraDistance + event.deltaY * .025,
          7,
          115
        );

        if (
          event.deltaY < 0 &&
          viewMode === "exterior" &&
          proposed < 27
        ) {
          setMode("exploded");
        } else if (
          event.deltaY > 0 &&
          viewMode === "exploded" &&
          proposed > 59
        ) {
          setMode("exterior");
        } else {
          cameraDistance = proposed;
          desiredDistance = proposed;
        }

        updateCamera();
      }, {
        passive: false
      });

      buildHouse();
      resetCamera();
      resize();
      animate();

      status(
        "Your 3D home is ready. Explore the floors and garden!"
      );

    } catch (error) {
      console.error(error);
      status("Could not initialize the 3D viewer.");
      host.textContent =
        "The 3D viewer could not start on this device.";
    }
  }

  initialize3D();
});
