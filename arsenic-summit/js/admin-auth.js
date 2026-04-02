(function () {
  const PASSWORD_HASH = "a468c4a47626ff931cc77735e7683350633e59b151635080d9be70d9ea694c2c";
  const SESSION_KEY = "arsenic-admin-auth";

  function $(sel, root = document) {
    return root.querySelector(sel);
  }

  async function sha256(text) {
    const bytes = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hashBuffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  function authorized() {
    return sessionStorage.getItem(SESSION_KEY) === PASSWORD_HASH;
  }

  function showAdmin() {
    const gate = $("#adminGate");
    const app = $("#adminApp");
    if (gate) gate.hidden = true;
    if (app) app.hidden = false;
    document.body.classList.remove("admin-locked");

    if (!$("#adminLogoutFixed")) {
      const button = document.createElement("button");
      button.type = "button";
      button.id = "adminLogoutFixed";
      button.className = "btn btn-ghost admin-logout-fixed";
      button.textContent = "Log out";
      button.addEventListener("click", () => {
        sessionStorage.removeItem(SESSION_KEY);
        location.reload();
      });
      document.body.appendChild(button);
    }
  }

  function renderGate() {
    const gate = $("#adminGate");
    const app = $("#adminApp");
    if (!gate || !app) return;

    document.body.classList.add("admin-locked");
    gate.hidden = false;
    app.hidden = true;
    gate.innerHTML = `
      <section class="section surface-paper admin-auth-shell">
        <div class="container">
          <div class="card admin-auth-card reveal is-visible">
            <div class="card-inner stack-lg">
              <div>
                <div class="eyebrow"><span class="rule" aria-hidden="true"></span>Protected area</div>
                <h2>Admin Access</h2>
                <p class="lead">This page is reserved for the Arsenic Summit team. Enter the password to open the admin workspace.</p>
              </div>
              <form id="adminAccessForm" class="stack" autocomplete="off">
                <div class="field">
                  <label for="adminPassword">Team password</label>
                  <input id="adminPassword" name="password" type="password" required />
                </div>
                <div class="admin-auth-actions">
                  <button class="btn btn-primary" type="submit">Unlock Admin</button>
                  <div id="adminAccessMessage" class="admin-status">Access stays active for this browser tab until you log out or close it.</div>
                </div>
              </form>
              <p class="admin-copy">Security note: this is a front-end password gate for a static site. It helps keep casual visitors out, but real authorization requires hosting protection or a backend identity layer.</p>
            </div>
          </div>
        </div>
      </section>
    `;

    $("#adminAccessForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const password = $("#adminPassword")?.value || "";
      const hash = await sha256(password);
      if (hash === PASSWORD_HASH) {
        sessionStorage.setItem(SESSION_KEY, PASSWORD_HASH);
        showAdmin();
        return;
      }
      const message = $("#adminAccessMessage");
      if (message) message.textContent = "Incorrect password. Please try again.";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!document.body.hasAttribute("data-admin-protected")) return;
    if (authorized()) {
      showAdmin();
      return;
    }
    renderGate();
  });
})();
