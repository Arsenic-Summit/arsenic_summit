/* Arsenic Summit - main.js (vanilla JS, static deploy)
   Edit the data arrays below to update content across pages.
   No backend, no storage, no build step.
*/

// ============================================================
// EDITABLE CONTENT (single source for dynamic sections)
// ============================================================

// Editable announcements (top ticker across all pages)
// Tip: keep items short; the ticker auto-scrolls.
const ANNOUNCEMENTS = [
  { label: "Registrations Open", detail: "2026 applications are now live for individuals & delegations.", tone: "good" },
  { label: "EB Reveal Live", detail: "Executive Board roster publishing in phases.", tone: "warn" },
  { label: "Background Guides Released", detail: "First wave released; remaining guides follow committee allotments.", tone: "good" },
  { label: "Allotments Out", detail: "Allotment emails roll out after review windows close.", tone: "warn" },
  { label: "Last Date Extended", detail: "If extended, it will appear here and on the registration page.", tone: "risk" }
];

// Editable committee highlights (Home "Committees preview")
const FEATURED_COMMITTEES = [
  {
    name: "UNSC - Closed-Door Crisis",
    agendaLine: "A rapidly escalating maritime confrontation with global supply chains at stake.",
    difficulty: "Advanced",
    type: "Crisis",
    mood: "Fast, consequential, unforgiving - precision over speeches."
  },
  {
    name: "UNHRC",
    agendaLine: "Accountability mechanisms in contested jurisdictions and information warfare.",
    difficulty: "Intermediate",
    type: "GA / Human Rights",
    mood: "Legal clarity, moral complexity, disciplined diplomacy."
  },
  {
    name: "DISEC",
    agendaLine: "Non-state procurement networks and the next generation of deterrence.",
    difficulty: "Beginner-Intermediate",
    type: "GA / Disarmament",
    mood: "Structure, substance, coalition building."
  },
  {
    name: "AIPPM",
    agendaLine: "Federal negotiation under pressure: stability, strategy, and public accountability.",
    difficulty: "Intermediate",
    type: "Indian Committee",
    mood: "Sharp crossfire, procedural control, narrative dominance."
  },
  {
    name: "International Press",
    agendaLine: "The summit's most visible arena: credibility, verification, and storycraft.",
    difficulty: "Open",
    type: "Press Corps",
    mood: "Editorial restraint; impact through accuracy and timing."
  }
];

// Editable committees (used on `committees.html` with filters)
// Fields are used for filters + card rendering.
const COMMITTEES = [
  {
    id: "unsc-crisis",
    name: "United Nations Security Council - Closed-Door Crisis",
    category: "International Security",
    theme: "Security",
    experience: "Advanced",
    difficulty: "Advanced",
    format: "Crisis",
    agenda: "Maritime escalation, sanctions architecture, and a cascading supply-chain shock.",
    description:
      "A closed-door crisis simulation where minutes matter. Delegates will navigate intelligence fragments, draft binding action, manage alliance fractures, and handle public fallout - all while the room demands decisions, not declarations.",
    eb: ["Chair: [UPDATE: Name]", "Crisis Director: [UPDATE: Name]"],
    profile: "For delegates who thrive under time pressure, can write clean directives, and negotiate with minimal oxygen.",
    applyText: "Apply via Registration"
  },
  {
    id: "unhrc",
    name: "United Nations Human Rights Council (UNHRC)",
    category: "Human Rights & Law",
    theme: "Human Rights",
    experience: "Intermediate",
    difficulty: "Intermediate",
    format: "GA",
    agenda: "Accountability, digital repression, and cross-border enforcement in contested regions.",
    description:
      "UNHRC at Arsenic Summit prioritizes legal grounding and diplomatic language that survives scrutiny. Expect strong moderated caucus structure, evidence standards, and policy drafting that must balance legitimacy with feasibility.",
    eb: ["Chair: [UPDATE: Name]", "Vice Chair: [UPDATE: Name]"],
    profile: "For delegates with clean research habits and an appetite for precise clause writing.",
    applyText: "Apply via Registration"
  },
  {
    id: "disec",
    name: "Disarmament & International Security Committee (DISEC)",
    category: "International Security",
    theme: "Security",
    experience: "Beginner-Intermediate",
    difficulty: "Beginner-Intermediate",
    format: "GA",
    agenda: "Illicit procurement networks, dual-use technology, and deterrence credibility.",
    description:
      "A structured GA committee that teaches coalition craft and resolution architecture. Delegates will learn how to negotiate across blocs without losing substance, and how to speak with clarity rather than volume.",
    eb: ["Chair: [UPDATE: Name]", "Rapporteur: [UPDATE: Name]"],
    profile: "Ideal for first-timers who want a serious room with strong guidance and real standards.",
    applyText: "Apply via Registration"
  },
  {
    id: "aippm",
    name: "All India Political Parties Meet (AIPPM)",
    category: "Indian Affairs",
    theme: "Governance",
    experience: "Intermediate",
    difficulty: "Intermediate",
    format: "Indian Committee",
    agenda: "Federal negotiation under pressure: stability, strategy, and public accountability.",
    description:
      "A chamber built for disciplined confrontation. Expect tight procedure, rapid rebuttals, and outcomes shaped by political realism. The best delegates will control the room without losing the plot.",
    eb: ["Moderator: [UPDATE: Name]", "Deputy Moderator: [UPDATE: Name]"],
    profile: "For delegates who can speak sharply, listen harder, and negotiate in public.",
    applyText: "Apply via Registration"
  },
  {
    id: "ecosoc",
    name: "United Nations Economic and Social Council (ECOSOC)",
    category: "Development & Economics",
    theme: "Development",
    experience: "Beginner",
    difficulty: "Beginner",
    format: "GA",
    agenda: "Debt stress, development financing, and the politics of conditionality.",
    description:
      "A fundamentals-first room with premium standards: clean policy logic, realistic funding pathways, and diplomatic language. Delegates will practice negotiations that translate into implementable frameworks.",
    eb: ["Chair: [UPDATE: Name]", "Vice Chair: [UPDATE: Name]"],
    profile: "Recommended for new delegates aiming for strong structure and measurable outcomes.",
    applyText: "Apply via Registration"
  },
  {
    id: "ipr",
    name: "International Press (IP)",
    category: "Media & Communications",
    theme: "Media",
    experience: "Open",
    difficulty: "Open",
    format: "Press Corps",
    agenda: "Verification, editorial judgment, and live coverage under institutional constraints.",
    description:
      "The summit's visibility engine. Press delegates will file breaking updates, features, and interviews while maintaining credibility. Accuracy, sourcing, and timing decide influence.",
    eb: ["Editor-in-Chief: [UPDATE: Name]", "Managing Editor: [UPDATE: Name]"],
    profile: "For writers and researchers who can move fast without cutting corners.",
    applyText: "Apply via Registration"
  }
];

// Editable secretariat roster (used on `secretariat.html` and Home preview)
const SECRETARIAT = [
  {
    name: "[UPDATE: Name]",
    role: "Secretary-General",
    specialty: "Institutional discipline & delegate experience",
    vision:
      "Arsenic Summit is built for delegates who want more than attendance - those who want visibility, pressure-tested skill, and a room that respects seriousness.",
    bio:
      "Leads summit direction, standards, and communication clarity. Focused on building an editorial, premium delegate journey - from application to outcomes.",
    photoAlt: "Arsenic Summit secretariat portrait placeholder",
    social: { label: "LinkedIn", href: "[UPDATE: LinkedIn URL]" }
  },
  {
    name: "[UPDATE: Name]",
    role: "Director-General",
    specialty: "Operations & schedule integrity",
    vision:
      "Every hour should be purposeful. We run a summit that values time, precision, and the credibility of what we publish.",
    bio:
      "Oversees operations, timeline, and on-ground flow. Known for systems thinking and calm crisis response when pressure rises.",
    photoAlt: "Arsenic Summit secretariat portrait placeholder",
    social: { label: "Instagram", href: "[UPDATE: Instagram URL]" }
  },
  {
    name: "[UPDATE: Name]",
    role: "Head of Delegate Affairs",
    specialty: "Allotments, support, and fairness",
    vision:
      "Allotment is not a lottery - it's a matching process grounded in fit, readiness, and room balance.",
    bio:
      "Handles allotment logic, helpdesk standards, and delegate communications. Prioritizes clarity, timelines, and respectful resolution.",
    photoAlt: "Arsenic Summit secretariat portrait placeholder",
    social: { label: "Email", href: "mailto:[UPDATE: Delegate Affairs Email]" }
  },
  {
    name: "[UPDATE: Name]",
    role: "Head of Partnerships",
    specialty: "Institutional credibility & alignment",
    vision:
      "Partners must elevate standards, not dilute them. We collaborate only where values and quality match.",
    bio:
      "Coordinates partner categories, deliverables, and public acknowledgements. Ensures alignment with the summit's editorial tone.",
    photoAlt: "Arsenic Summit secretariat portrait placeholder",
    social: { label: "LinkedIn", href: "[UPDATE: LinkedIn URL]" }
  }
];

// Editable FAQ items (used for `faq.html` and Home preview)
const FAQ = [
  {
    q: "Who can apply?",
    a: "Arsenic Summit is open to school and college delegates. If your institution is registering a delegation, use the delegation track on the registration page. If you're applying solo, use the individual track."
  },
  {
    q: "Do I need prior MUN experience?",
    a: "No - but you do need readiness. We run serious rooms. Beginners are welcome in structured committees, and we publish preparation resources to close the gap."
  },
  {
    q: "How are committees allotted?",
    a: "Allotments are based on preference-fit, demonstrated preparedness, and committee balance. We do not promise first preferences; we promise fairness and transparency."
  },
  {
    q: "When are background guides released?",
    a: "Background guides release in phases. First wave can be live pre-allotment; remaining guides may be released post-allotment to match committee-specific expectations."
  },
  {
    q: "Can schools register as delegations?",
    a: "Yes. Delegation applications receive a separate coordination lane, including a single point of contact and a consolidated confirmation flow."
  },
  {
    q: "What is the refund policy?",
    a: "Refunds follow the registration policies listed on the registration page and policies page. In short: once a seat is confirmed and logistics are locked, refunds become limited."
  },
  {
    q: "How will communication happen?",
    a: "Official updates are sent via email first. Time-sensitive notices may also be shared via WhatsApp/phone for delegation coordinators and urgent operational situations."
  },
  {
    q: "What should I bring?",
    a: "A government ID (if required by venue), a notebook, committee stationery, and a reliable device for research. Dress code is formal. Bring a power bank and a calm mind."
  },
  {
    q: "How are awards decided?",
    a: "Awards are decided by Executive Boards based on consistency, diplomacy, negotiation quality, research, documentation, and outcomes - not volume or theatrics."
  },
  {
    q: "Who do I contact for urgent help?",
    a: "Use the contact page lanes. For urgent, time-sensitive issues during conference days, the on-ground helpdesk number (published closer to the event) is the fastest route."
  }
];

// Editable agenda preview (used for `agenda.html` and Home preview)
const AGENDA = [
  {
    title: "Pre-conference",
    badge: "Timeline",
    items: [
      { time: "T-30 to T-20", title: "Registrations open", note: "Individual & delegation applications accepted." },
      { time: "T-18", title: "Committee reveals", note: "Featured committees + agenda lines published." },
      { time: "T-14", title: "Background guides released (Wave 1)", note: "Core committee packs go live." },
      { time: "T-10 to T-7", title: "Allotment review window", note: "Applications assessed; preference-fit evaluated." },
      { time: "T-6", title: "Allotments out", note: "Allotment emails sent in batches." },
      { time: "T-5 to T-3", title: "Payment & confirmation", note: "Seat confirmation + logistics details." },
      { time: "T-2", title: "Orientation / briefing", note: "Online briefing: rules, writing, expectations." }
    ]
  },
  {
    title: "Conference Day 1",
    badge: "On-ground",
    items: [
      { time: "08:00-09:30", title: "Check-in & verification", note: "Badges, kits, venue navigation." },
      { time: "10:00-11:15", title: "Opening ceremony", note: "[UPDATE: Host institution welcome + summit briefing]" },
      { time: "11:30-13:30", title: "Committee Session I", note: "Agenda adoption, roll call, framework." },
      { time: "13:30-14:30", title: "Lunch", note: "Venue dining window." },
      { time: "14:45-17:15", title: "Committee Session II", note: "Caucus cycles; bloc formation." },
      { time: "17:30-18:15", title: "Press & networking window", note: "Interviews, coverage, coordination." }
    ]
  },
  {
    title: "Conference Day 2",
    badge: "Intensity",
    items: [
      { time: "09:30-12:30", title: "Committee Session III", note: "Drafting + negotiation under pressure." },
      { time: "12:30-13:30", title: "Lunch", note: "Venue dining window." },
      { time: "13:45-16:30", title: "Committee Session IV", note: "Amendments; voting strategy." },
      { time: "16:45-17:45", title: "Crisis rounds / Press surge", note: "For crisis + IP: acceleration window." },
      { time: "18:15-19:15", title: "Socials / Delegation meet", note: "Structured networking with safeguards." }
    ]
  },
  {
    title: "Conference Day 3",
    badge: "Outcomes",
    items: [
      { time: "09:30-12:00", title: "Committee Session V", note: "Final drafts; closing statements." },
      { time: "12:00-13:00", title: "Lunch", note: "Venue dining window." },
      { time: "13:15-15:15", title: "Voting procedure", note: "Adoption of resolutions / directives." },
      { time: "15:30-16:30", title: "Awards & closing ceremony", note: "Recognition + institutional close." },
      { time: "16:45-17:30", title: "Departure window", note: "Certificates, exits, final helpdesk." }
    ]
  },
  {
    title: "Post-conference outcomes",
    badge: "Documentation",
    items: [
      { time: "T+3", title: "Outcome publication", note: "Selected resolutions / press book." },
      { time: "T+7", title: "Certificates & letters", note: "Digital downloads released." }
    ]
  }
];

// Editable resources (used for `resources.html`)
const RESOURCES = [
  { title: "Background guides", status: "Live", detail: "Committee packs and reading lists. Wave-based publishing.", href: "#" },
  { title: "Rules of procedure", status: "Live", detail: "Standard GA + committee-specific notes.", href: "#" },
  { title: "Position paper format", status: "Live", detail: "A clean format that prioritizes clarity and policy logic.", href: "#" },
  { title: "Code of conduct", status: "Live", detail: "Delegate standards, anti-harassment, venue discipline.", href: "#" },
  { title: "Delegate handbook", status: "Coming soon", detail: "What to bring, how to prepare, what to expect.", href: "#" },
  { title: "Venue instructions", status: "Coming soon", detail: "Entry protocol, maps, timing, and safety notes.", href: "#" },
  { title: "Allotment guide", status: "Post-allotment", detail: "Committee-specific expectations and writing prompts.", href: "#" },
  { title: "Certificates / downloads", status: "Post-allotment", detail: "Certificates and official letters will be published after outcomes.", href: "#" }
];

// Editable partners (used for `partners.html`)
const PARTNERS = [
  {
    category: "Institutional partner",
    items: [
      { name: "[UPDATE: Institutional partner name]", note: "Venue & institutional support aligned with summit standards." }
    ]
  },
  {
    category: "Venue partner",
    items: [
      { name: "[UPDATE: Venue partner name]", note: "Professional halls, verified access, disciplined logistics." }
    ]
  },
  {
    category: "Hospitality partner",
    items: [
      { name: "[UPDATE: Hospitality partner name]", note: "Delegate comfort without compromising schedule integrity." }
    ]
  },
  {
    category: "Media partner",
    items: [
      { name: "[UPDATE: Media partner name]", note: "Credibility-first coverage with editorial restraint." }
    ]
  },
  {
    category: "Outreach partner",
    items: [
      { name: "[UPDATE: Outreach partner name]", note: "Selective outreach focused on quality applicants." }
    ]
  },
  {
    category: "Education partner",
    items: [
      { name: "[UPDATE: Education partner name]", note: "Workshops and delegate preparation resources." }
    ]
  }
];

// -----------------------------
// Utilities
// -----------------------------

function $(sel, root = document){ return root.querySelector(sel); }
function $all(sel, root = document){ return Array.from(root.querySelectorAll(sel)); }

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#039;"
  }[m]));
}

function badgeTone(tone){
  if (tone === "good") return "badge good";
  if (tone === "warn") return "badge warn";
  if (tone === "risk") return "badge risk";
  return "badge";
}

function currentPage(){
  const path = (location.pathname || "").split("/").pop() || "index.html";
  return path.toLowerCase();
}

function setActiveNav(){
  const page = currentPage();
  $all("[data-nav]").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    const isActive = href === page;
    if (isActive) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

function setupMobileMenu(){
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
  menu.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.matches("[data-close-menu]")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function setupReveal(){
  const els = $all(".reveal");
  if (!("IntersectionObserver" in window) || els.length === 0){
    els.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting){
        en.target.classList.add("is-visible");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// -----------------------------
// Renderers
// -----------------------------

function renderAnnouncements(){
  const track = $("#tickerTrack");
  if (!track) return;

  // Duplicate list for a smoother ticker loop.
  const items = ANNOUNCEMENTS.concat(ANNOUNCEMENTS);
  track.innerHTML = items.map(item => {
    const toneClass = badgeTone(item.tone);
    return `
      <div class="ticker-item">
        <span class="tag">${escapeHtml(item.label)}</span>
        <span><strong>${escapeHtml(item.label)}</strong> - ${escapeHtml(item.detail)}</span>
        <span class="${toneClass}" style="margin-left:6px;">${escapeHtml(item.tone || "update")}</span>
      </div>
    `;
  }).join("");
}

function renderFeaturedCommittees(){
  const root = $("#featuredCommittees");
  if (!root) return;
  root.innerHTML = FEATURED_COMMITTEES.map((c) => `
    <article class="card committee-card reveal">
      <div class="media" aria-hidden="true"></div>
      <div class="card-inner">
        <div class="top">
          <div>
            <div class="card-kicker">${escapeHtml(c.type)} â€¢ ${escapeHtml(c.difficulty)}</div>
            <div class="title card-title">${escapeHtml(c.name)}</div>
          </div>
          <span class="badge ${c.difficulty.toLowerCase().includes("advanced") ? "risk" : c.difficulty.toLowerCase().includes("beginner") ? "good" : "warn"}">
            ${escapeHtml(c.difficulty)}
          </span>
        </div>
        <p class="mt-18">${escapeHtml(c.agendaLine)}</p>
        <p class="mood"><em>${escapeHtml(c.mood)}</em></p>
        <div class="actions">
          <a class="btn btn-ghost" href="committees.html">View Details</a>
          <a class="btn btn-primary" href="registration.html">Apply</a>
        </div>
      </div>
    </article>
  `).join("");
}

function renderSecretariatPreview(){
  const root = $("#secretariatPreview");
  if (!root) return;
  const preview = SECRETARIAT.slice(0, 3);
  root.innerHTML = preview.map((p) => `
    <article class="card reveal">
      <div class="media" aria-hidden="true"></div>
      <div class="card-inner">
        <div class="card-kicker">${escapeHtml(p.role)}</div>
        <h3 class="card-title">${escapeHtml(p.name)}</h3>
        <p class="mt-18"><strong class="muted">Specialty:</strong> ${escapeHtml(p.specialty)}</p>
        <p class="mt-18">${escapeHtml(p.vision)}</p>
        <div class="actions mt-18">
          <a class="btn btn-ghost" href="secretariat.html">Meet the Secretariat</a>
        </div>
      </div>
    </article>
  `).join("");
}

function renderFaqPreview(){
  const root = $("#faqPreview");
  if (!root) return;
  const top = FAQ.slice(0, 5);
  root.innerHTML = top.map((item) => `
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

  // Ensure <details> toggles via the summary click (button is for layout only).
  $all("#faqPreview details.qa summary button").forEach(btn => {
    btn.addEventListener("click", (e) => e.preventDefault());
  });
}

function renderAgendaPreview(){
  const root = $("#agendaPreview");
  if (!root) return;
  const subset = AGENDA.slice(0, 2);
  root.innerHTML = subset.map(block => scheduleBlockHtml(block)).join("");
}

function scheduleBlockHtml(block){
  return `
    <section class="schedule-block reveal">
      <div class="schedule-head">
        <h3>${escapeHtml(block.title)}</h3>
        <span class="badge warn">${escapeHtml(block.badge || "Schedule")}</span>
      </div>
      <ul class="schedule-list">
        ${(block.items || []).slice(0, 6).map(it => `
          <li class="schedule-item">
            <div class="time">${escapeHtml(it.time || "-")}</div>
            <div class="desc">
              <strong>${escapeHtml(it.title || "")}</strong>
              <small>${escapeHtml(it.note || "")}</small>
            </div>
          </li>
        `).join("")}
      </ul>
    </section>
  `;
}

function renderCommitteesPage(){
  const root = $("#committeesList");
  if (!root) return;

  const selDifficulty = $("#filterDifficulty");
  const selTheme = $("#filterTheme");
  const selExperience = $("#filterExperience");
  const selFormat = $("#filterFormat");
  const btnReset = $("#filtersReset");
  const count = $("#committeeCount");

  const uniq = (arr) => Array.from(new Set(arr)).sort((a,b)=>a.localeCompare(b));
  const fillOptions = (sel, values) => {
    if (!sel) return;
    const current = sel.value;
    const opts = ['<option value="All">All</option>'].concat(values.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`));
    sel.innerHTML = opts.join("");
    if (current) sel.value = current;
  };

  fillOptions(selDifficulty, uniq(COMMITTEES.map(c => c.difficulty)));
  fillOptions(selTheme, uniq(COMMITTEES.map(c => c.theme)));
  fillOptions(selExperience, uniq(COMMITTEES.map(c => c.experience)));
  fillOptions(selFormat, uniq(COMMITTEES.map(c => c.format)));

  const state = {
    difficulty: "All",
    theme: "All",
    experience: "All",
    format: "All"
  };

  const readState = () => {
    state.difficulty = selDifficulty ? selDifficulty.value : "All";
    state.theme = selTheme ? selTheme.value : "All";
    state.experience = selExperience ? selExperience.value : "All";
    state.format = selFormat ? selFormat.value : "All";
  };

  const matches = (c) => {
    const ok = (k, v) => v === "All" ? true : String(k) === String(v);
    return ok(c.difficulty, state.difficulty) &&
           ok(c.theme, state.theme) &&
           ok(c.experience, state.experience) &&
           ok(c.format, state.format);
  };

  const applyLink = (id) => `registration.html#apply`;

  const render = () => {
    const filtered = COMMITTEES.filter(matches);
    if (count) count.textContent = String(filtered.length);

    root.innerHTML = filtered.map((c) => `
      <article class="card committee-card reveal" data-committee="${escapeHtml(c.id)}">
        <div class="media" aria-hidden="true"></div>
        <div class="card-inner">
          <div class="top">
            <div>
              <div class="card-kicker">${escapeHtml(c.category)} â€¢ ${escapeHtml(c.format)}</div>
              <div class="title card-title">${escapeHtml(c.name)}</div>
            </div>
            <span class="badge ${c.difficulty.toLowerCase().includes("advanced") ? "risk" : c.difficulty.toLowerCase().includes("beginner") ? "good" : "warn"}">
              ${escapeHtml(c.difficulty)}
            </span>
          </div>
          <div class="meta mt-18">
            <span class="badge">Theme: ${escapeHtml(c.theme)}</span>
            <span class="badge">Experience: ${escapeHtml(c.experience)}</span>
          </div>
          <p class="mt-18"><strong>Agenda:</strong> ${escapeHtml(c.agenda)}</p>
          <p class="mt-18">${escapeHtml(c.description)}</p>
          <div class="ruleline"></div>
          <div class="grid grid-2">
            <div class="stack">
              <div class="card-kicker">Executive Board</div>
              <div>${(c.eb || []).map(x => `<div class="muted">${escapeHtml(x)}</div>`).join("")}</div>
            </div>
            <div class="stack">
              <div class="card-kicker">Recommended delegate profile</div>
              <div class="muted">${escapeHtml(c.profile)}</div>
            </div>
          </div>
          <div class="actions mt-18">
            <a class="btn btn-primary" href="${applyLink(c.id)}">Apply</a>
            <a class="btn btn-ghost" href="resources.html">Preparation resources</a>
          </div>
        </div>
      </article>
    `).join("");

    setupReveal();
  };

  const onChange = () => { readState(); render(); };
  [selDifficulty, selTheme, selExperience, selFormat].filter(Boolean).forEach(sel => sel.addEventListener("change", onChange));
  if (btnReset){
    btnReset.addEventListener("click", () => {
      if (selDifficulty) selDifficulty.value = "All";
      if (selTheme) selTheme.value = "All";
      if (selExperience) selExperience.value = "All";
      if (selFormat) selFormat.value = "All";
      onChange();
    });
  }

  render();
}

function renderSecretariatPage(){
  const root = $("#secretariatGrid");
  if (!root) return;
  root.innerHTML = SECRETARIAT.map((p) => `
    <article class="card reveal">
      <div class="media" aria-hidden="true" title="Replace with a real photo in assets/images"></div>
      <div class="card-inner">
        <div class="top">
          <div>
            <div class="card-kicker">${escapeHtml(p.role)}</div>
            <h3 class="card-title">${escapeHtml(p.name)}</h3>
          </div>
          <span class="badge good">${escapeHtml(p.specialty)}</span>
        </div>
        <p class="mt-18">${escapeHtml(p.bio)}</p>
        <div class="callout mt-18">
          <div class="title">Vision</div>
          <p class="mt-18" style="margin:10px 0 0 0;">${escapeHtml(p.vision)}</p>
        </div>
        ${p.social && p.social.href ? `
          <div class="actions mt-18">
            <a class="btn btn-ghost" href="${escapeHtml(p.social.href)}">${escapeHtml(p.social.label || "Link")}</a>
          </div>
        ` : ``}
      </div>
    </article>
  `).join("");
}

function renderAgendaPage(){
  const root = $("#agendaBlocks");
  if (!root) return;
  root.innerHTML = AGENDA.map(block => scheduleBlockHtml(block)).join("");
}

function renderResourcesPage(){
  const root = $("#resourcesGrid");
  if (!root) return;
  const statusTone = (s) => {
    const v = String(s || "").toLowerCase();
    if (v.includes("live")) return "good";
    if (v.includes("coming")) return "warn";
    if (v.includes("post")) return "risk";
    return "";
  };
  root.innerHTML = RESOURCES.map(r => `
    <article class="card reveal">
      <div class="media" aria-hidden="true"></div>
      <div class="card-inner">
        <div class="top">
          <div>
            <div class="card-kicker">Delegate resources</div>
            <h3 class="card-title">${escapeHtml(r.title)}</h3>
          </div>
          <span class="badge ${statusTone(r.status)}">${escapeHtml(r.status)}</span>
        </div>
        <p class="mt-18">${escapeHtml(r.detail)}</p>
        <div class="actions mt-18">
          <a class="btn btn-ghost" href="${escapeHtml(r.href || "#")}">Open</a>
        </div>
      </div>
    </article>
  `).join("");
}

function renderPartnersPage(){
  const root = $("#partnersBlocks");
  if (!root) return;
  root.innerHTML = PARTNERS.map(cat => `
    <section class="card reveal">
      <div class="card-inner">
        <div class="top">
          <div>
            <div class="card-kicker">Partners</div>
            <h3 class="card-title">${escapeHtml(cat.category)}</h3>
          </div>
          <span class="badge warn">Category</span>
        </div>
        <div class="ruleline"></div>
        <div class="grid grid-2">
          ${(cat.items || []).map(it => `
            <div class="stack">
              <div style="font-weight:760; color: rgba(242,238,228,.95);">${escapeHtml(it.name)}</div>
              <div class="muted">${escapeHtml(it.note || "")}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `).join("");
}

function renderFaqPage(){
  const root = $("#faqAccordion");
  if (!root) return;
  root.innerHTML = FAQ.map((item) => `
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
  $all("#faqAccordion details.qa summary button").forEach(btn => {
    btn.addEventListener("click", (e) => e.preventDefault());
  });
}

function setupContactForm(){
  const form = $("#contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#cName")?.value?.trim() || "";
    const email = $("#cEmail")?.value?.trim() || "";
    const lane = $("#cLane")?.value || "General queries";
    const message = $("#cMessage")?.value?.trim() || "";
    const subject = `Arsenic Summit - ${lane} - ${name || "Message"}`;
    const body = `Name: ${name}\nEmail: ${email}\nLane: ${lane}\n\nMessage:\n${message}\n\n- Sent from arsenicsummit.org static site`;
    const to = "hello@arsenicsummit.org";
    location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

function hydrateDynamicYear(){
  const y = new Date().getFullYear();
  $all("[data-year]").forEach(el => el.textContent = String(y));
}

// -----------------------------
// Boot
// -----------------------------

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  setupMobileMenu();
  renderAnnouncements();
  hydrateDynamicYear();

  // Home
  renderFeaturedCommittees();
  renderSecretariatPreview();
  renderAgendaPreview();
  renderFaqPreview();

  // Pages
  renderCommitteesPage();
  renderSecretariatPage();
  renderAgendaPage();
  renderResourcesPage();
  renderPartnersPage();
  renderFaqPage();
  setupContactForm();

  // Reveal last so dynamically injected nodes are observed.
  setupReveal();
});


