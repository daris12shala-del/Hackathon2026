
document.addEventListener("DOMContentLoaded", function () {

  var nav = document.querySelector(".site-nav");

  function updateNav() {
    if (nav) {
      nav.classList.toggle("scrolled", window.scrollY > 25);
    }
  }

  window.addEventListener("scroll", updateNav);
  updateNav();

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var reveals = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    reveals.forEach(function (element, index) {
      element.style.setProperty(
        "--delay",
        (index % 3) * 100 + "ms"
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
    window.matchMedia("(hover:hover) and (pointer:fine)").matches
  ) {
    document.querySelectorAll(".tilt").forEach(function (element) {

      element.addEventListener("mousemove", function (event) {
        var box = element.getBoundingClientRect();
        var x = (event.clientX - box.left) / box.width - 0.5;
        var y = (event.clientY - box.top) / box.height - 0.5;

        element.style.animation = "none";

        element.style.transform =
          "perspective(900px) rotateX(" + (-y * 9) +
          "deg) rotateY(" + (x * 11) +
          "deg) scale(1.025)";
      });

      element.addEventListener("mouseleave", function () {
        element.style.transform = "";

        if (element.classList.contains("demo-panel")) {
          element.style.animation =
            "panelFloat 7s ease-in-out infinite";
        } else {
          element.style.animation = "";
        }
      });

    });
  }

  var walkNext = document.getElementById("walkNext");

  if (walkNext) {
    var walkBack = document.getElementById("walkBack");
    var walkStep = 0;

    var steps = [
      {
        icon: "📦",
        title: "Add your item",
        description: "Give your belonging a name."
      },
      {
        icon: "📍",
        title: "Save its location",
        description: "Write down where you last placed it."
      },
      {
        icon: "🔎",
        title: "Find it later",
        description: "Your saved location appears below."
      }
    ];

    function showWalkStep() {
      document.getElementById("walkStepLabel").textContent =
        "STEP " + (walkStep + 1) + " OF 3";

      document.getElementById("walkProgress").style.width =
        ((walkStep + 1) / 3 * 100) + "%";

      document.getElementById("walkIcon").textContent =
        steps[walkStep].icon;

      document.getElementById("walkTitle").textContent =
        steps[walkStep].title;

      document.getElementById("walkDescription").textContent =
        steps[walkStep].description;

      document.getElementById("locationGroup").classList.toggle(
        "d-none",
        walkStep === 0
      );

      document.getElementById("walkResult").classList.toggle(
        "d-none",
        walkStep !== 2
      );

      walkBack.disabled = walkStep === 0;

      walkNext.textContent =
        walkStep === 2 ? "Start Again ↺" : "Next Step →";

      document.getElementById("walkMessage").textContent = "";

      if (walkStep === 2) {
        var item = document.getElementById("demoItem").value.trim();
        var place = document.getElementById("demoLocation").value.trim();

        document.getElementById("walkResult").textContent =
          "✅ " + item + " — 📍 " + place;
      }
    }

    walkNext.addEventListener("click", function () {
      if (walkStep === 2) {
        walkStep = 0;
        showWalkStep();
        return;
      }

      var target = walkStep === 0
        ? document.getElementById("demoItem")
        : document.getElementById("demoLocation");

      if (!target.value.trim()) {
        document.getElementById("walkMessage").textContent =
          "Please fill in this field first.";
        target.focus();
        return;
      }

      walkStep++;
      showWalkStep();
    });

    walkBack.addEventListener("click", function () {
      if (walkStep > 0) {
        walkStep--;
        showWalkStep();
      }
    });

    showWalkStep();
  }

  if (!window.bootstrap || !bootstrap.Modal) {
    console.error(
      "Bootstrap JavaScript did not load. Check your internet connection."
    );
    return;
  }

  var modalMarkup = `
    <div class="modal fade" id="signupModal" tabindex="-1"
         aria-labelledby="signupTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content account-modal">
          <div class="modal-header border-0">
            <h2 class="modal-title fs-4" id="signupTitle">
              ✦ Join FIND IT.
            </h2>
            <button type="button" class="btn-close btn-close-white"
                    data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <p class="muted">Create a demo profile on this browser.</p>

            <form id="signupForm">
              <label for="signupName">Full name</label>
              <input class="form-control" id="signupName" type="text"
                     maxlength="60" required placeholder="Your name">

              <label for="signupEmail">Email address</label>
              <input class="form-control" id="signupEmail" type="email"
                     required placeholder="you@example.com">

              <label for="signupPhoto">Profile picture (optional)</label>

              <div class="d-flex gap-3 align-items-center">
                <div class="account-preview">
                  <span id="previewLetter">U</span>
                  <img id="previewImage" alt="Preview">
                </div>

                <input class="form-control" id="signupPhoto"
                       type="file"
                       accept="image/jpeg,image/png,image/webp">
              </div>

              <p id="signupError" class="auth-feedback" role="status"></p>

              <button type="submit" class="btn btn-violet w-100">
                Create Account →
              </button>
            </form>

            <p class="modal-note">
              Local demo only. No password or real authentication.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="loginModal" tabindex="-1"
         aria-labelledby="loginTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content account-modal">
          <div class="modal-header border-0">
            <h2 class="modal-title fs-4" id="loginTitle">
              Welcome Back!
            </h2>
            <button type="button" class="btn-close btn-close-white"
                    data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <p class="muted">Open your saved local demo profile.</p>

            <form id="loginForm">
              <label for="loginEmail">Email address</label>
              <input class="form-control" id="loginEmail"
                     type="email" required
                     placeholder="you@example.com">

              <p id="loginError" class="auth-feedback" role="status"></p>

              <button type="submit" class="btn btn-violet w-100">
                Log In →
              </button>
            </form>

            <p class="modal-note">
              This demonstration does not verify identity.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="settingsModal" tabindex="-1"
         aria-labelledby="settingsTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content account-modal">
          <div class="modal-header border-0">
            <h2 class="modal-title fs-4" id="settingsTitle">
              Account Settings
            </h2>
            <button type="button" class="btn-close btn-close-white"
                    data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <form id="settingsForm">
              <label for="settingsName">Edit name</label>
              <input class="form-control" id="settingsName"
                     type="text" maxlength="60" required>

              <label for="settingsEmail">Edit email</label>
              <input class="form-control" id="settingsEmail"
                     type="email" required>

              <label for="settingsPhoto">New picture (optional)</label>
              <input class="form-control" id="settingsPhoto"
                     type="file"
                     accept="image/jpeg,image/png,image/webp">

              <p id="settingsError" class="auth-feedback"
                 role="status"></p>

              <button type="submit" class="btn btn-violet w-100">
                Save Changes
              </button>
            </form>

            <div class="settings-actions">
              <button type="button" class="btn btn-ghost"
                      id="removePhoto">
                Remove Photo
              </button>

              <button type="button" class="btn btn-ghost"
                      id="exportProfile">
                Export Profile
              </button>

              <button type="button" class="btn btn-outline-danger"
                      id="deleteProfile">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalMarkup);

  var currentProfile = null;
  var signedIn = false;

  try {
    var raw = localStorage.getItem("findit-profile");
    currentProfile = raw ? JSON.parse(raw) : null;

    if (
      !currentProfile ||
      !currentProfile.name ||
      !currentProfile.email
    ) {
      currentProfile = null;
    }

    signedIn = !!currentProfile &&
      localStorage.getItem("findit-session") === "active";

  } catch (error) {
    currentProfile = null;
    signedIn = false;
  }

  function writeProfile(profile) {
    try {
      localStorage.setItem(
        "findit-profile",
        JSON.stringify(profile)
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  function setAvatar(image, letter, profile) {
    if (!image || !letter) {
      return;
    }

    letter.textContent =
      profile.name.trim().charAt(0).toUpperCase() || "U";

    if (profile.photo) {
      image.src = profile.photo;
      image.style.display = "block";
      letter.style.display = "none";

      image.onerror = function () {
        image.style.display = "none";
        letter.style.display = "block";
      };
    } else {
      image.removeAttribute("src");
      image.style.display = "none";
      letter.style.display = "block";
    }
  }

  function updateAccount() {
    document.querySelectorAll(".guest-actions").forEach(
      function (element) {
        element.classList.toggle("d-none", signedIn);
      }
    );

    document.querySelectorAll(".user-actions").forEach(
      function (element) {
        element.classList.toggle("d-none", !signedIn);
      }
    );

    if (!signedIn || !currentProfile) {
      return;
    }

    document.querySelectorAll(".profile-name").forEach(
      function (element) {
        element.textContent = currentProfile.name;
      }
    );

    document.querySelectorAll(".profile-email").forEach(
      function (element) {
        element.textContent = currentProfile.email;
      }
    );

    document.querySelectorAll(".avatar-btn").forEach(
      function (element) {
        setAvatar(
          element.querySelector(".avatar-img"),
          element.querySelector(".avatar-letter"),
          currentProfile
        );
      }
    );
  }

  function hideModal(id) {
    var element = document.getElementById(id);

    bootstrap.Modal.getOrCreateInstance(element).hide();
  }

  function photoToData(file, done, failed) {
    if (!file) {
      done("");
      return;
    }

    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp"
    ) {
      failed("Use JPG, PNG or WebP.");
      return;
    }

    if (file.size > 600000) {
      failed("The picture must be under 600 KB.");
      return;
    }

    var reader = new FileReader();

    reader.onload = function () {
      done(reader.result);
    };

    reader.onerror = function () {
      failed("Could not open this picture.");
    };

    reader.readAsDataURL(file);
  }

  function startSession() {
    try {
      localStorage.setItem("findit-session", "active");
      signedIn = true;
      return true;
    } catch (error) {
      return false;
    }
  }

  document.getElementById("signupForm").addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      var error = document.getElementById("signupError");
      error.textContent = "";

      if (currentProfile) {
        error.textContent =
          "A local profile already exists. Use Log In.";
        return;
      }

      var name = document.getElementById("signupName")
        .value.trim();

      var email = document.getElementById("signupEmail")
        .value.trim().toLowerCase();

      if (!name || !email) {
        error.textContent = "Enter your name and email.";
        return;
      }

      var submit = this.querySelector("button[type=submit]");
      submit.disabled = true;

      photoToData(
        document.getElementById("signupPhoto").files[0],

        function (photo) {
          var newProfile = {
            name: name,
            email: email,
            photo: photo
          };

          if (!writeProfile(newProfile)) {
            error.textContent =
              "Cannot save. Try a smaller photo or Live Server.";
            submit.disabled = false;
            return;
          }

          currentProfile = newProfile;

          if (!startSession()) {
            error.textContent =
              "Profile saved, but the session was blocked.";
            submit.disabled = false;
            return;
          }

          updateAccount();
          hideModal("signupModal");
          submit.disabled = false;
        },

        function (message) {
          error.textContent = message;
          submit.disabled = false;
        }
      );
    }
  );

  document.getElementById("signupName").addEventListener(
    "input",
    function () {
      document.getElementById("previewLetter").textContent =
        this.value.trim().charAt(0).toUpperCase() || "U";
    }
  );

  document.getElementById("signupPhoto").addEventListener(
    "change",
    function () {
      var file = this.files[0];

      if (!file) {
        return;
      }

      photoToData(
        file,

        function (photo) {
          document.getElementById("previewImage").src = photo;
          document.getElementById("previewImage").style.display =
            "block";

          document.getElementById("previewLetter").style.display =
            "none";

          document.getElementById("signupError").textContent = "";
        },

        function (message) {
          document.getElementById("signupError").textContent =
            message;
        }
      );
    }
  );

  document.getElementById("loginForm").addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      var error = document.getElementById("loginError");

      var email = document.getElementById("loginEmail")
        .value.trim().toLowerCase();

      if (
        !currentProfile ||
        currentProfile.email.toLowerCase() !== email
      ) {
        error.textContent =
          "No saved profile matches this email.";
        return;
      }

      if (!startSession()) {
        error.textContent = "Browser storage is blocked.";
        return;
      }

      error.textContent = "";

      updateAccount();
      hideModal("loginModal");
    }
  );

  document.querySelectorAll(".signout-btn").forEach(
    function (button) {
      button.addEventListener("click", function () {
        signedIn = false;

        try {
          localStorage.removeItem("findit-session");
        } catch (error) {}

        updateAccount();
      });
    }
  );

  document.getElementById("settingsModal").addEventListener(
    "show.bs.modal",
    function (event) {
      if (!signedIn || !currentProfile) {
        event.preventDefault();
        return;
      }

      document.getElementById("settingsName").value =
        currentProfile.name;

      document.getElementById("settingsEmail").value =
        currentProfile.email;

      document.getElementById("settingsPhoto").value = "";

      document.getElementById("settingsError").textContent = "";
    }
  );

  document.getElementById("settingsForm").addEventListener(
    "submit",
    function (event) {
      event.preventDefault();

      if (!signedIn || !currentProfile) {
        return;
      }

      var error = document.getElementById("settingsError");

      var name = document.getElementById("settingsName")
        .value.trim();

      var email = document.getElementById("settingsEmail")
        .value.trim().toLowerCase();

      if (!name || !email) {
        error.textContent = "Enter your name and email.";
        return;
      }

      var photoFile = document.getElementById("settingsPhoto")
        .files[0];

      var submit = this.querySelector("button[type=submit]");
      submit.disabled = true;

      var finish = function (photo) {
        var edited = {
          name: name,
          email: email,
          photo: photo
        };

        if (!writeProfile(edited)) {
          error.textContent = "Could not save your changes.";
          submit.disabled = false;
          return;
        }

        currentProfile = edited;
        updateAccount();
        hideModal("settingsModal");
        submit.disabled = false;
      };

      if (photoFile) {
        photoToData(
          photoFile,
          finish,
          function (message) {
            error.textContent = message;
            submit.disabled = false;
          }
        );
      } else {
        finish(currentProfile.photo || "");
      }
    }
  );

  document.getElementById("removePhoto").addEventListener(
    "click",
    function () {
      if (!currentProfile) {
        return;
      }

      var edited = {
        name: currentProfile.name,
        email: currentProfile.email,
        photo: ""
      };

      if (writeProfile(edited)) {
        currentProfile = edited;
        updateAccount();

        document.getElementById("settingsError").textContent =
          "Picture removed.";
      }
    }
  );

  document.getElementById("exportProfile").addEventListener(
    "click",
    function () {
      if (!currentProfile) {
        return;
      }

      var blob = new Blob(
        [JSON.stringify(currentProfile, null, 2)],
        { type: "application/json" }
      );

      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");

      link.href = url;
      link.download = "findit-profile.json";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
    }
  );

  document.getElementById("deleteProfile").addEventListener(
    "click",
    function () {
      if (!confirm("Delete your saved local demo account?")) {
        return;
      }

      try {
        localStorage.removeItem("findit-profile");
        localStorage.removeItem("findit-session");
      } catch (error) {}

      currentProfile = null;
      signedIn = false;

      updateAccount();
      hideModal("settingsModal");
    }
  );

  updateAccount();

});
