
/* Arsenic Summit app.js
   Static site renderer + browser-side admin preview tools.
*/

const STORAGE_KEYS = {
  previewData: "arsenic-preview-data",
  previewApiUrl: "arsenic-preview-api-url",
  introSeen: "arsenic-intro-seen"
};

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function clone(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function deepMerge(target, source) {
  const output = Array.isArray(target) ? target.slice() : { ...target };
  if (!source || typeof source !== "object") return output;

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = output[key];

    if (Array.isArray(sourceValue)) {
      output[key] = sourceValue.slice();
      return;
    }

    if (sourceValue && typeof sourceValue === "object") {
      output[key] = deepMerge(
        targetValue && typeof targetValue === "object" && !Array.isArray(targetValue) ? targetValue : {},
        sourceValue
      );
      return;
    }

    output[key] = sourceValue;
  });

  return output;
}

function getByPath(obj, path) {
  return String(path || "")
    .split(".")
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[m]));
}

function badgeTone(tone) {
  if (tone === "good") return "badge good";
  if (tone === "warn") return "badge warn";
  if (tone === "risk") return "badge risk";
  return "badge";
}

function currentPage() {
  const path = (location.pathname || "").split("/").pop() || "index.html";
  return path.toLowerCase();
}

function setActiveNav() {
  const page = currentPage();
  $all("[data-nav]").forEach((anchor) => {
    const href = (anchor.getAttribute("href") || "").toLowerCase();
    const isActive = href === page;
    if (isActive) anchor.setAttribute("aria-current", "page");
    else anchor.removeAttribute("aria-current");
  });
}

function setupMobileMenu() {
  const menu = $("#mobileMenu");
  const openBtn = $("#menuBtn");
  const closeBtn = $("#closeMenuBtn");
  if (!menu || !openBtn || !closeBtn) return;

  const open = () => {
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  };

  const close = () => {
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  };

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  menu.addEventListener("click", (event) => {
    if (event.target && event.target.matches("[data-close-menu]")) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function setupReveal() {
  const els = $all(".reveal");
  if (!("IntersectionObserver" in window) || els.length === 0) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  els.forEach((el) => observer.observe(el));
}

function toEmbedUrl(url) {
  const raw = String(url || "").trim();
  if (!raw) return "";
  if (raw.includes("embedded=true")) return raw;
  if (raw.includes("?")) return `${raw}&embedded=true`;
  return `${raw}?embedded=true`;
}

function applyDerivedData(data) {
  const next = clone(data);
  const committeeCount = Array.isArray(next.committees) ? next.committees.length : 0;

  next.summit = next.summit || {};
  next.contact = next.contact || {};
  next.registration = next.registration || {};
  next.brand = next.brand || {};

  next.summit.committeeCount = String(committeeCount);
  if (!next.summit.committeeCountLabel) next.summit.committeeCountLabel = `${committeeCount} rooms`;

  next.contact.officialEmailHref = `mailto:${next.contact.officialEmail || ""}`;
  next.contact.registrationsEmailHref = `mailto:${next.contact.registrationsEmail || ""}`;
  next.contact.partnershipsEmailHref = `mailto:${next.contact.partnershipsEmail || ""}`;
  next.registration.paymentsEmailHref = `mailto:${next.registration.paymentsEmail || ""}`;

  if (Array.isArray(next.registration.tracks)) {
    next.registration.tracks = next.registration.tracks.map((track) => ({
      ...track,
      embedUrl: track.embedUrl || toEmbedUrl(track.formUrl)
    }));
  }

  return next;
}

async function loadSiteData() {
  let data = clone(window.ARSENIC_DEFAULT_DATA || {});

  const previewApiUrl = localStorage.getItem(STORAGE_KEYS.previewApiUrl);
  const contentApiUrl =
    previewApiUrl ||
    getByPath(data, "admin.contentApiUrl") ||
    $('meta[name="arsenic-content-api"]')?.getAttribute("content") ||
    "";

  if (contentApiUrl) {
    try {
      const response = await fetch(contentApiUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const remoteData = await response.json();
      data = deepMerge(data, remoteData);
    } catch (error) {
      console.warn("Could not load remote content feed:", error);
    }
  }

  const previewRaw = localStorage.getItem(STORAGE_KEYS.previewData);
  if (previewRaw) {
    try {
      data = deepMerge(data, JSON.parse(previewRaw));
    } catch (error) {
      console.warn("Could not parse preview data:", error);
    }
  }

  return applyDerivedData(data);
}

function bindContent(data) {
  $all("[data-bind-text]").forEach((node) => {
    const value = getByPath(data, node.dataset.bindText);
    if (value == null) return;
    node.textContent = String(value);
  });

  $all("[data-bind-html]").forEach((node) => {
    const value = getByPath(data, node.dataset.bindHtml);
    if (value == null) return;
    node.innerHTML = String(value);
  });

  $all("[data-bind-href]").forEach((node) => {
    const value = getByPath(data, node.dataset.bindHref);
    if (value == null || !node.setAttribute) return;
    node.setAttribute("href", String(value));
  });

  $all("[data-bind-src]").forEach((node) => {
    const value = getByPath(data, node.dataset.bindSrc);
    if (value == null || !node.setAttribute) return;
    node.setAttribute("src", String(value));
  });
}

function hydrateDynamicYear() {
  const year = new Date().getFullYear();
  $all("[data-year]").forEach((el) => {
    el.textContent = String(year);
  });
}

function renderAnnouncements(data) {
  const track = $("#tickerTrack");
  if (!track) return;

  const source = Array.isArray(data.announcements) ? data.announcements : [];
  const items = source.concat(source);

  track.innerHTML = items.map((item) => `
    <div class="ticker-item">
      <span class="tag">${escapeHtml(item.label)}</span>
      <span><strong>${escapeHtml(item.label)}</strong> - ${escapeHtml(item.detail)}</span>
      <span class="${badgeTone(item.tone)}">${escapeHtml(item.tone || "update")}</span>
    </div>
  `).join("");
}

function difficultyTone(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("advanced")) return "risk";
  if (text.includes("beginner")) return "good";
  return "warn";
}
function renderFeaturedCommittees(data) {
  const root = $("#featuredCommittees");
  if (!root) return;
  const items = Array.isArray(data.featuredCommittees) ? data.featuredCommittees : [];

  root.innerHTML = items.map((committee) => `
    <article class="card committee-card reveal">
      <div class="media media-committee" aria-hidden="true"></div>
      <div class="card-inner">
        <div class="top">
          <div>
            <div class="card-kicker">${escapeHtml(committee.type)} • ${escapeHtml(committee.difficulty)}</div>
            <div class="title card-title">${escapeHtml(committee.name)}</div>
          </div>
          <span class="badge ${difficultyTone(committee.difficulty)}">${escapeHtml(committee.difficulty)}</span>
        </div>
        <p class="mt-18">${escapeHtml(committee.agendaLine)}</p>
        <p class="mood"><em>${escapeHtml(committee.mood)}</em></p>
        <div class="actions">
          <a class="btn btn-ghost" href="committees.html">View details</a>
          <a class="btn btn-primary" href="registration.html#apply">Apply</a>
        </div>
      </div>
    </article>
  `).join("");
}

function renderSecretariatPreview(data) {
  const root = $("#secretariatPreview");
  if (!root) return;
  const preview = (Array.isArray(data.secretariat) ? data.secretariat : []).slice(0, 3);
  root.innerHTML = preview.map((person) => `
    <article class="card reveal">
      <div class="media media-portrait" aria-hidden="true"></div>
      <div class="card-inner">
        <div class="card-kicker">${escapeHtml(person.role)}</div>
        <h3 class="card-title">${escapeHtml(person.name)}</h3>
        <p class="mt-18"><strong class="muted">Specialty:</strong> ${escapeHtml(person.specialty)}</p>
        <p class="mt-18">${escapeHtml(person.vision)}</p>
        <div class="actions mt-18">
          <a class="btn btn-ghost" href="secretariat.html">Meet the secretariat</a>
        </div>
      </div>
    </article>
  `).join("");
}

function renderFaqPreview(data) {
  const root = $("#faqPreview");
  if (!root) return;

  const items = (Array.isArray(data.faq) ? data.faq : []).slice(0, 5);
  root.innerHTML = items.map((item) => `
    <details class="qa reveal">
      <summary>
        <button type="button" aria-label="Toggle answer">
          <span class="q">${escapeHtml(item.q)}</span>
          <span class="chev" aria-hidden="true">+</span>
        </button>
      </summary>
      <div class="a">${escapeHtml(item.a)}</div>
    </details>
  `).join("");

  $all("#faqPreview details.qa summary button").forEach((button) => {
    button.addEventListener("click", (event) => event.preventDefault());
  });
}

function scheduleBlockHtml(block) {
  return `
    <section class="schedule-block reveal">
      <div class="schedule-head">
        <h3>${escapeHtml(block.title)}</h3>
        <span class="badge warn">${escapeHtml(block.badge || "Schedule")}</span>
      </div>
      <ul class="schedule-list">
        ${(block.items || []).map((item) => `
          <li class="schedule-item">
            <div class="time">${escapeHtml(item.time || "-")}</div>
            <div class="desc">
              <strong>${escapeHtml(item.title || "")}</strong>
              <small>${escapeHtml(item.note || "")}</small>
            </div>
          </li>
        `).join("")}
      </ul>
    </section>
  `;
}

function renderAgendaPreview(data) {
  const root = $("#agendaPreview");
  if (!root) return;
  const items = (Array.isArray(data.agenda) ? data.agenda : []).slice(0, 2);
  root.innerHTML = items.map(scheduleBlockHtml).join("");
}

function renderCommitteesPage(data) {
  const root = $("#committeesList");
  if (!root) return;

  const committees = Array.isArray(data.committees) ? data.committees : [];
  const difficulty = $("#filterDifficulty");
  const theme = $("#filterTheme");
  const experience = $("#filterExperience");
  const format = $("#filterFormat");
  const reset = $("#filtersReset");
  const count = $("#committeeCount");

  const unique = (items) => Array.from(new Set(items)).sort((a, b) => a.localeCompare(b));

  function fillOptions(select, values) {
    if (!select) return;
    const current = select.value;
    select.innerHTML = ['<option value="All">All</option>']
      .concat(values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`))
      .join("");
    select.value = current || "All";
  }

  fillOptions(difficulty, unique(committees.map((committee) => committee.difficulty)));
  fillOptions(theme, unique(committees.map((committee) => committee.theme)));
  fillOptions(experience, unique(committees.map((committee) => committee.experience)));
  fillOptions(format, unique(committees.map((committee) => committee.format)));

  const state = { difficulty: "All", theme: "All", experience: "All", format: "All" };

  const readState = () => {
    state.difficulty = difficulty ? difficulty.value : "All";
    state.theme = theme ? theme.value : "All";
    state.experience = experience ? experience.value : "All";
    state.format = format ? format.value : "All";
  };

  const matches = (committee) => {
    const test = (actual, selected) => selected === "All" || String(actual) === String(selected);
    return test(committee.difficulty, state.difficulty) &&
      test(committee.theme, state.theme) &&
      test(committee.experience, state.experience) &&
      test(committee.format, state.format);
  };

  const render = () => {
    const filtered = committees.filter(matches);
    if (count) count.textContent = String(filtered.length);

    root.innerHTML = filtered.map((committee) => `
      <article class="card committee-card reveal" data-committee="${escapeHtml(committee.id)}">
        <div class="media media-committee" aria-hidden="true"></div>
        <div class="card-inner">
          <div class="top">
            <div>
              <div class="card-kicker">${escapeHtml(committee.category)} • ${escapeHtml(committee.format)}</div>
              <div class="title card-title">${escapeHtml(committee.name)}</div>
            </div>
            <span class="badge ${difficultyTone(committee.difficulty)}">${escapeHtml(committee.difficulty)}</span>
          </div>
          <div class="meta mt-18">
            <span class="badge">Theme: ${escapeHtml(committee.theme)}</span>
            <span class="badge">Experience: ${escapeHtml(committee.experience)}</span>
          </div>
          <p class="mt-18"><strong>Agenda:</strong> ${escapeHtml(committee.agenda)}</p>
          <p class="mt-18">${escapeHtml(committee.description)}</p>
          <div class="ruleline"></div>
          <div class="grid grid-2">
            <div class="stack">
              <div class="card-kicker">Executive board</div>
              <div>${(committee.eb || []).map((line) => `<div class="muted">${escapeHtml(line)}</div>`).join("")}</div>
            </div>
            <div class="stack">
              <div class="card-kicker">Recommended delegate profile</div>
              <div class="muted">${escapeHtml(committee.profile)}</div>
            </div>
          </div>
          <div class="actions mt-18">
            <a class="btn btn-primary" href="registration.html#apply">Apply</a>
            <a class="btn btn-ghost" href="resources.html">Preparation resources</a>
          </div>
        </div>
      </article>
    `).join("");

    setupReveal();
  };

  const onChange = () => {
    readState();
    render();
  };

  [difficulty, theme, experience, format].filter(Boolean).forEach((select) => {
    select.addEventListener("change", onChange);
  });

  if (reset) {
    reset.addEventListener("click", () => {
      [difficulty, theme, experience, format].filter(Boolean).forEach((select) => {
        select.value = "All";
      });
      onChange();
    });
  }

  render();
}

function renderSecretariatPage(data) {
  const root = $("#secretariatGrid");
  if (!root) return;
  const people = Array.isArray(data.secretariat) ? data.secretariat : [];

  root.innerHTML = people.map((person) => `
    <article class="card reveal">
      <div class="media media-portrait" aria-hidden="true"></div>
      <div class="card-inner">
        <div class="top">
          <div>
            <div class="card-kicker">${escapeHtml(person.role)}</div>
            <h3 class="card-title">${escapeHtml(person.name)}</h3>
          </div>
          <span class="badge good">${escapeHtml(person.specialty)}</span>
        </div>
        <p class="mt-18">${escapeHtml(person.bio)}</p>
        <div class="callout mt-18">
          <div class="title">Vision</div>
          <p class="mt-18 admin-copy">${escapeHtml(person.vision)}</p>
        </div>
        ${person.social && person.social.href ? `
          <div class="actions mt-18">
            <a class="btn btn-ghost" href="${escapeHtml(person.social.href)}">${escapeHtml(person.social.label || "Link")}</a>
          </div>
        ` : ""}
      </div>
    </article>
  `).join("");
}

function renderAgendaPage(data) {
  const root = $("#agendaBlocks");
  if (!root) return;
  root.innerHTML = (Array.isArray(data.agenda) ? data.agenda : []).map(scheduleBlockHtml).join("");
}

function renderResourcesPage(data) {
  const root = $("#resourcesGrid");
  if (!root) return;
  const items = Array.isArray(data.resources) ? data.resources : [];

  const statusTone = (status) => {
    const value = String(status || "").toLowerCase();
    if (value.includes("live")) return "good";
    if (value.includes("coming")) return "warn";
    if (value.includes("post")) return "risk";
    return "";
  };

  root.innerHTML = items.map((item) => `
    <article class="card reveal">
      <div class="media media-resource" aria-hidden="true"></div>
      <div class="card-inner">
        <div class="top">
          <div>
            <div class="card-kicker">Delegate resource</div>
            <h3 class="card-title">${escapeHtml(item.title)}</h3>
          </div>
          <span class="badge ${statusTone(item.status)}">${escapeHtml(item.status)}</span>
        </div>
        <p class="mt-18">${escapeHtml(item.detail)}</p>
        <div class="actions mt-18">
          <a class="btn btn-ghost" href="${escapeHtml(item.href || "#")}">Open</a>
        </div>
      </div>
    </article>
  `).join("");
}
function renderPartnersPage(data) {
  const root = $("#partnersBlocks");
  if (!root) return;
  const blocks = Array.isArray(data.partners) ? data.partners : [];

  root.innerHTML = blocks.map((category) => `
    <section class="card reveal">
      <div class="card-inner">
        <div class="top">
          <div>
            <div class="card-kicker">Partners</div>
            <h3 class="card-title">${escapeHtml(category.category)}</h3>
          </div>
          <span class="badge warn">Category</span>
        </div>
        <div class="ruleline"></div>
        <div class="grid grid-2">
          ${(category.items || []).map((item) => `
            <div class="stack">
              <div class="partner-name">${escapeHtml(item.name)}</div>
              <div class="muted">${escapeHtml(item.note || "")}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `).join("");
}

function renderFaqPage(data) {
  const root = $("#faqAccordion");
  if (!root) return;
  const items = Array.isArray(data.faq) ? data.faq : [];

  root.innerHTML = items.map((item) => `
    <details class="qa reveal">
      <summary>
        <button type="button" aria-label="Toggle answer">
          <span class="q">${escapeHtml(item.q)}</span>
          <span class="chev" aria-hidden="true">+</span>
        </button>
      </summary>
      <div class="a">${escapeHtml(item.a)}</div>
    </details>
  `).join("");

  $all("#faqAccordion details.qa summary button").forEach((button) => {
    button.addEventListener("click", (event) => event.preventDefault());
  });
}

function renderRegistrationForms(data) {
  const root = $("#registrationForms");
  if (!root) return;

  const tracks = Array.isArray(data.registration?.tracks) ? data.registration.tracks : [];
  if (tracks.length === 0) return;

  root.innerHTML = `
    <div class="form-tabs" role="tablist" aria-label="Registration forms">
      ${tracks.map((track, index) => `
        <button class="form-tab ${index === 0 ? "is-active" : ""}" type="button" role="tab"
          aria-selected="${index === 0 ? "true" : "false"}"
          data-track-tab="${escapeHtml(track.id)}">
          ${escapeHtml(track.label)}
        </button>
      `).join("")}
    </div>
    <div class="form-panels">
      ${tracks.map((track, index) => {
        const hasForm = Boolean(track.formUrl || track.embedUrl);
        return `
          <section class="form-panel ${index === 0 ? "is-active" : ""}" role="tabpanel" data-track-panel="${escapeHtml(track.id)}">
            <div class="form-panel-head">
              <div>
                <div class="card-kicker">Google form</div>
                <h3 class="card-title">${escapeHtml(track.label)}</h3>
              </div>
              ${hasForm ? `<a class="btn btn-primary" href="${escapeHtml(track.formUrl || track.embedUrl)}" target="_blank" rel="noreferrer">Open in new tab</a>` : ""}
            </div>
            <p>${escapeHtml(track.description || "")}</p>
            ${hasForm ? `
              <div class="embed-shell">
                <iframe class="form-embed" src="${escapeHtml(track.embedUrl || track.formUrl)}" title="${escapeHtml(track.label)} form" loading="lazy"></iframe>
              </div>
            ` : `
              <div class="empty-state">
                <strong>Form link not added yet.</strong>
                <span>Add your Google Form URL from the admin page or your JSON feed and it will appear here automatically.</span>
              </div>
            `}
          </section>
        `;
      }).join("")}
    </div>
  `;

  $all("[data-track-tab]", root).forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.trackTab;
      $all("[data-track-tab]", root).forEach((tab) => {
        const active = tab.dataset.trackTab === id;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      $all("[data-track-panel]", root).forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.trackPanel === id);
      });
    });
  });
}

function setupContactForm(data) {
  const form = $("#contactForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#cName")?.value?.trim() || "";
    const email = $("#cEmail")?.value?.trim() || "";
    const lane = $("#cLane")?.value || "General queries";
    const message = $("#cMessage")?.value?.trim() || "";
    const subject = `Arsenic Summit - ${lane} - ${name || "Message"}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Lane: ${lane}`,
      "",
      "Message:",
      message,
      "",
      "- Sent from arsenicsummit.org"
    ].join("\n");

    const to = data.contact?.officialEmail || "hello@arsenicsummit.org";
    location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

function setupSiteIntro(data) {
  if (!$('[data-enable-intro]')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (sessionStorage.getItem(STORAGE_KEYS.introSeen)) return;

  const intro = document.createElement('div');
  intro.className = 'site-intro';
  intro.setAttribute('aria-hidden', 'true');
  intro.innerHTML = `
    <div class="site-intro-mark">
      <span class="orbit orbit-one"></span>
      <span class="orbit orbit-two"></span>
      <span class="orbit orbit-three"></span>
      <img src="assets/images/arsenic-logo.jpg" alt="" />
    </div>
    <div class="site-intro-copy">
      <div class="eyebrow">${escapeHtml(data.brand?.introLabel || 'Arsenic Summit')}</div>
      <strong>${escapeHtml(data.brand?.slogan || '')}</strong>
    </div>
  `;
  document.body.appendChild(intro);
  document.body.classList.add('intro-lock');

  window.requestAnimationFrame(() => {
    intro.classList.add('is-active');
  });

  window.setTimeout(() => {
    intro.classList.add('is-exit');
    document.body.classList.remove('intro-lock');
    sessionStorage.setItem(STORAGE_KEYS.introSeen, '1');
    window.setTimeout(() => intro.remove(), 700);
  }, 1850);
}

function buildTextareaRows(items, mapper) {
  return (items || []).map(mapper).join("\n");
}

function parseLines(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function renderAdminPage(data) {
  const root = $("#adminApp");
  if (!root) return;

  root.innerHTML = `
    <section class="section surface-paper">
      <div class="container">
        <div class="split admin-hero">
          <div class="reveal">
            <div class="eyebrow"><span class="rule" aria-hidden="true"></span>Admin</div>
            <h1>Manage the site without touching code.</h1>
            <p class="lead">${escapeHtml(data.admin?.guideBody || '')}</p>
          </div>
          <div class="card reveal">
            <div class="card-inner admin-actions">
              <button class="btn btn-primary" type="button" id="adminSavePreview">Save browser preview</button>
              <button class="btn btn-ghost" type="button" id="adminDownloadJson">Download JSON</button>
              <button class="btn btn-ghost" type="button" id="adminResetPreview">Reset preview</button>
              <div class="admin-status" id="adminStatus">Editing current live defaults.</div>
            </div>
          </div>
        </div>

        <div class="admin-grid mt-26">
          <section class="card reveal">
            <div class="card-inner stack">
              <div class="card-kicker">Summit basics</div>
              <label class="field"><span>Edition label</span><input id="adminEditionLabel" value="${escapeHtml(data.brand?.editionLabel || '')}"></label>
              <label class="field"><span>Hero title</span><input id="adminHeroTitle" value="${escapeHtml(data.home?.heroTitle || '')}"></label>
              <label class="field"><span>Hero lead</span><textarea id="adminHeroLead">${escapeHtml(data.home?.heroLead || '')}</textarea></label>
              <label class="field"><span>Dates</span><input id="adminDates" value="${escapeHtml(data.summit?.dates || '')}"></label>
              <label class="field"><span>City</span><input id="adminCity" value="${escapeHtml(data.summit?.city || '')}"></label>
              <label class="field"><span>Venue</span><input id="adminVenue" value="${escapeHtml(data.summit?.venue || '')}"></label>
              <label class="field"><span>Host institution</span><input id="adminHost" value="${escapeHtml(data.summit?.hostInstitution || '')}"></label>
              <label class="field"><span>Registration status</span><input id="adminRegStatus" value="${escapeHtml(data.summit?.registrationStatus || '')}"></label>
            </div>
          </section>

          <section class="card reveal">
            <div class="card-inner stack">
              <div class="card-kicker">Registration and contact</div>
              <label class="field"><span>Registration deadline</span><input id="adminDeadline" value="${escapeHtml(data.registration?.deadline || '')}"></label>
              <label class="field"><span>Allotment line</span><input id="adminAllotments" value="${escapeHtml(data.registration?.allotments || '')}"></label>
              <label class="field"><span>Fee line</span><input id="adminFee" value="${escapeHtml(data.registration?.fee || '')}"></label>
              <label class="field"><span>Official email</span><input id="adminOfficialEmail" value="${escapeHtml(data.contact?.officialEmail || '')}"></label>
              <label class="field"><span>Registrations email</span><input id="adminRegistrationsEmail" value="${escapeHtml(data.contact?.registrationsEmail || '')}"></label>
              <label class="field"><span>Partnerships email</span><input id="adminPartnershipsEmail" value="${escapeHtml(data.contact?.partnershipsEmail || '')}"></label>
              <label class="field"><span>Individual form URL</span><input id="adminIndividualForm" value="${escapeHtml(data.registration?.tracks?.[0]?.formUrl || '')}"></label>
              <label class="field"><span>Delegation form URL</span><input id="adminDelegationForm" value="${escapeHtml(data.registration?.tracks?.[1]?.formUrl || '')}"></label>
            </div>
          </section>

          <section class="card reveal admin-span-2">
            <div class="card-inner stack">
              <div class="card-kicker">Announcements</div>
              <p class="admin-copy">One announcement per line. Format: <code>label | detail | tone</code>. Tone can be <code>good</code>, <code>warn</code>, or <code>risk</code>.</p>
              <textarea id="adminAnnouncements" class="admin-code">${escapeHtml(buildTextareaRows(data.announcements, (item) => `${item.label} | ${item.detail} | ${item.tone}`))}</textarea>
            </div>
          </section>

          <section class="card reveal admin-span-2">
            <div class="card-inner stack">
              <div class="card-kicker">Committees</div>
              <p class="admin-copy">One committee per paragraph. Use this format on each line: <code>name | category | theme | difficulty | format | agenda</code>.</p>
              <textarea id="adminCommittees" class="admin-code large">${escapeHtml(buildTextareaRows(data.committees, (item) => `${item.name} | ${item.category} | ${item.theme} | ${item.difficulty} | ${item.format} | ${item.agenda}`))}</textarea>
            </div>
          </section>

          <section class="card reveal admin-span-2">
            <div class="card-inner stack">
              <div class="card-kicker">Agenda</div>
              <p class="admin-copy">One schedule item per line. Format: <code>block title | badge | time | session title | note</code>.</p>
              <textarea id="adminAgenda" class="admin-code large">${escapeHtml(buildTextareaRows(data.agenda.flatMap((block) => (block.items || []).map((item) => `${block.title} | ${block.badge} | ${item.time} | ${item.title} | ${item.note}`)), (line) => line))}</textarea>
            </div>
          </section>

          <section class="card reveal admin-span-2">
            <div class="card-inner stack">
              <div class="card-kicker">Google setup</div>
              <label class="field"><span>Optional content API URL</span><input id="adminApiUrl" value="${escapeHtml(localStorage.getItem(STORAGE_KEYS.previewApiUrl) || data.admin?.contentApiUrl || '')}"></label>
              <p class="admin-copy">If you connect the site to a Google Apps Script JSON endpoint, your team can manage committees, agenda blocks, and summit info from Google Sheets instead of editing files.</p>
              <p class="admin-copy">For form submission emails, use the Apps Script template in <code>docs/google-setup.md</code>. That email automation runs on the Google side, which is the right place for it in a static website setup.</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  `;

  const status = $("#adminStatus");

  function collectData() {
    const next = clone(window.ARSENIC_DEFAULT_DATA || {});
    next.brand.editionLabel = $("#adminEditionLabel").value.trim();
    next.home.heroTitle = $("#adminHeroTitle").value.trim();
    next.home.heroLead = $("#adminHeroLead").value.trim();
    next.summit.dates = $("#adminDates").value.trim();
    next.summit.city = $("#adminCity").value.trim();
    next.summit.venue = $("#adminVenue").value.trim();
    next.summit.hostInstitution = $("#adminHost").value.trim();
    next.summit.registrationStatus = $("#adminRegStatus").value.trim();
    next.registration.deadline = $("#adminDeadline").value.trim();
    next.registration.allotments = $("#adminAllotments").value.trim();
    next.registration.fee = $("#adminFee").value.trim();
    next.contact.officialEmail = $("#adminOfficialEmail").value.trim();
    next.contact.registrationsEmail = $("#adminRegistrationsEmail").value.trim();
    next.contact.partnershipsEmail = $("#adminPartnershipsEmail").value.trim();
    next.registration.tracks[0].formUrl = $("#adminIndividualForm").value.trim();
    next.registration.tracks[1].formUrl = $("#adminDelegationForm").value.trim();

    next.announcements = parseLines($("#adminAnnouncements").value).map((line) => {
      const [label = '', detail = '', tone = 'warn'] = line.split('|').map((part) => part.trim());
      return { label, detail, tone: tone || 'warn' };
    });

    next.committees = parseLines($("#adminCommittees").value).map((line, index) => {
      const [name = '', category = '', theme = '', difficulty = '', format = '', agenda = ''] = line.split('|').map((part) => part.trim());
      return {
        id: `committee-${index + 1}`,
        name,
        category,
        theme,
        difficulty,
        experience: difficulty,
        format,
        agenda,
        description: 'Update the detailed committee description from your Google content feed if you want a richer public card.',
        eb: ['Executive board announcement soon'],
        profile: 'Profile details can be expanded through your content feed or exported JSON.',
        applyText: 'Apply through registration'
      };
    });

    const groupedAgenda = {};
    parseLines($("#adminAgenda").value).forEach((line) => {
      const [blockTitle = '', badge = '', time = '', title = '', note = ''] = line.split('|').map((part) => part.trim());
      if (!groupedAgenda[blockTitle]) groupedAgenda[blockTitle] = { title: blockTitle, badge, items: [] };
      groupedAgenda[blockTitle].items.push({ time, title, note });
    });
    next.agenda = Object.values(groupedAgenda);

    return applyDerivedData(next);
  }

  $("#adminSavePreview").addEventListener("click", () => {
    const next = collectData();
    const apiUrl = $("#adminApiUrl").value.trim();
    localStorage.setItem(STORAGE_KEYS.previewData, JSON.stringify(next));
    if (apiUrl) localStorage.setItem(STORAGE_KEYS.previewApiUrl, apiUrl);
    else localStorage.removeItem(STORAGE_KEYS.previewApiUrl);
    status.textContent = 'Preview saved. Open the public pages in this browser to review the updated content.';
  });
  $("#adminDownloadJson").addEventListener("click", () => {
    const next = collectData();
    const blob = new Blob([JSON.stringify(next, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "arsenic-site-content.json";
    anchor.click();
    URL.revokeObjectURL(url);
    status.textContent = 'JSON exported. You can upload it to your host or serve it through Apps Script.';
  });

  $("#adminResetPreview").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.previewData);
    localStorage.removeItem(STORAGE_KEYS.previewApiUrl);
    status.textContent = 'Preview reset. Reload the page to return to the built in defaults.';
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const siteData = await loadSiteData();

  bindContent(siteData);
  setActiveNav();
  setupMobileMenu();
  renderAnnouncements(siteData);
  hydrateDynamicYear();
  renderFeaturedCommittees(siteData);
  renderSecretariatPreview(siteData);
  renderAgendaPreview(siteData);
  renderFaqPreview(siteData);
  renderCommitteesPage(siteData);
  renderSecretariatPage(siteData);
  renderAgendaPage(siteData);
  renderResourcesPage(siteData);
  renderPartnersPage(siteData);
  renderFaqPage(siteData);
  renderRegistrationForms(siteData);
  setupContactForm(siteData);
  renderAdminPage(siteData);
  setupSiteIntro(siteData);
  setupReveal();
});
