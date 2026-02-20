// Heartland Soapworks — multi-page JS (default LIGHT mode)

const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

/* ---------------------------
   Theme (DEFAULT LIGHT)
   - If user has never chosen, force "light"
---------------------------- */
(function initTheme(){
  const stored = localStorage.getItem("hs_theme");
  const theme = stored ?? "light";
  setTheme(theme);
})();

function setTheme(theme){
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("hs_theme", theme);
  const icon = $("#themeIcon");
  if (icon) icon.textContent = theme === "dark" ? "☾" : "☼";
}

$("#themeBtn")?.addEventListener("click", () => {
  const cur = document.documentElement.dataset.theme || "light";
  setTheme(cur === "dark" ? "light" : "dark");
});

/* ---------------------------
   Sticky nav appearance
---------------------------- */
const topbar = $("#topbar");
function onScroll(){
  if (!topbar) return;
  topbar.classList.toggle("scrolled", window.scrollY > 10);
}
window.addEventListener("scroll", onScroll, { passive:true });
onScroll();

/* ---------------------------
   Mobile menu
---------------------------- */
const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");

menuBtn?.addEventListener("click", () => {
  const open = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-expanded", String(!open));
  if (mobileMenu) mobileMenu.hidden = open;
});

$$(".mobile a").forEach(a => {
  a.addEventListener("click", () => {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  });
});

/* ---------------------------
   Scroll reveal
---------------------------- */
const reveals = $$(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("show");
    io.unobserve(e.target);
  });
}, { threshold: 0.12 });

reveals.forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 55, 220)}ms`;
  io.observe(el);
});

/* ---------------------------
   Tilt (subtle)
---------------------------- */
function tiltHandler(el){
  const rect = () => el.getBoundingClientRect();
  function move(e){
    const r = rect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (y - 0.5) * -7;
    const ry = (x - 0.5) * 8;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  }
  function leave(){ el.style.transform = ""; }
  el.addEventListener("mousemove", move);
  el.addEventListener("mouseleave", leave);
}
$$(".tilt").forEach(tiltHandler);

/* ---------------------------
   Home hero preview thumbnails
---------------------------- */
const thumbs = $("#thumbs");
const previewImg = $("#previewImg");
const previewName = $("#previewName");
const previewNote = $("#previewNote");

thumbs?.addEventListener("click", (e) => {
  const btn = e.target.closest(".thumb");
  if (!btn) return;

  $$(".thumb", thumbs).forEach(t => t.classList.remove("active"));
  btn.classList.add("active");

  const src = btn.dataset.src;
  const name = btn.dataset.name;
  const note = btn.dataset.note;

  if (src && previewImg) previewImg.src = src;
  if (name && previewName) previewName.innerHTML = name;
  if (note && previewNote) previewNote.textContent = note;
});

/* ---------------------------
   Product page routing
---------------------------- */
const PRODUCTS = {
  "oatmilk-honey": {
    name: "Oat Milk & Honey",
    img: "assets/soap-oatmilk-honey.jpg",
    desc: "Soft and comforting — warm, clean, and cozy.",
    mood: "Warm • Cozy • Clean",
    notes: "A familiar, comforting bar you’ll reach for daily.",
    goodFor: ["Gifting", "Everyday", "Guest bath"],
  },
  "fresh-falls": {
    name: "Fresh Falls",
    img: "assets/soap-fresh-falls.jpg",
    desc: "Bright and crisp — everyday clean.",
    mood: "Crisp • Bright • Everyday",
    notes: "Clean and uplifting. Like river air after rain.",
    goodFor: ["Everyday", "Morning", "Fresh scent lovers"],
  },
  "bourbon-wood": {
    name: "Bourbon Wood",
    img: "assets/soap-bourbon-wood.jpg",
    desc: "Warm woods with a smooth finish — cabin vibes.",
    mood: "Smoky • Smooth • Cabin",
    notes: "Warm woods with a steady, comforting finish.",
    goodFor: ["Gifting", "Bold scents", "Hands-on jobs"],
  },
  "alpine-rapids": {
    name: "Alpine Rapids",
    img: "assets/soap-alpine-rapids.jpg",
    desc: "Cool and clean with a bright finish.",
    mood: "Cool • Clean • River air",
    notes: "Crisp and clean—fresh without being sharp.",
    goodFor: ["Post-workout", "Everyday", "Clean scent lovers"],
  },
  "citrus-grove": {
    name: "Citrus Grove",
    img: "assets/soap-citrus-grove.jpg",
    desc: "Sunny citrus — bright, not sharp.",
    mood: "Sunny • Bright • Smooth",
    notes: "A bright bar that stays smooth and easy.",
    goodFor: ["Morning", "Gifting", "Fresh scent lovers"],
  },
  "lavender-field": {
    name: "Lavender Field",
    img: "assets/soap-lavender-field.jpg",
    desc: "Calm and gentle — perfect before bed.",
    mood: "Calm • Gentle • Classic",
    notes: "A calming bar that feels like the end of a long day.",
    goodFor: ["Night routine", "Relaxation", "Classic scents"],
  },
};

(function hydrateProductPage(){
  const nameEl = $("#pName");
  if (!nameEl) return; // not on product page

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "oatmilk-honey";
  const p = PRODUCTS[id] ?? PRODUCTS["oatmilk-honey"];

  $("#pName").textContent = p.name;
  $("#pDesc").textContent = p.desc;
  const img = $("#pImg");
  if (img) { img.src = p.img; img.alt = `${p.name} soap photo`; }
  $("#pMood") && ($("#pMood").textContent = p.mood);
  $("#pNotes") && ($("#pNotes").textContent = p.notes);

  const goodFor = $("#pGoodFor");
  if (goodFor){
    goodFor.innerHTML = p.goodFor.map(x => `<span class="chip">${x}</span>`).join("");
  }

  document.title = `${p.name} — Heartland Soapworks`;
})();

/* ---------------------------
   Contact form demo (if present)
---------------------------- */
const form = $("#contactForm");
const fake = $("#fakeSubmit");
const formNote = $("#formNote");

function flashNote(msg){
  if (!formNote) return;
  formNote.textContent = msg;
  setTimeout(() => (formNote.textContent = ""), 1800);
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  flashNote("This is UI-only on GitHub Pages. Hook it to a form service when ready.");
});
fake?.addEventListener("click", () => flashNote("Demo: pretend message sent."));

/* ---------------------------
   Cmd-K search (multi-page)
---------------------------- */
const cmdk = $("#cmdk");
const cmdkBtn = $("#cmdkBtn");
const cmdkInput = $("#cmdkInput");
const cmdkList = $("#cmdkList");

const NAV = [
  { label:"Home", href:"index.html", hint:"Landing page" },
  { label:"Shop", href:"shop.html", hint:"All $10 bars" },
  { label:"Gallery", href:"gallery.html", hint:"Photos" },
  { label:"About", href:"about.html", hint:"Our story" },
  { label:"Ingredients", href:"ingredients.html", hint:"Ingredient philosophy" },
  { label:"Markets", href:"markets.html", hint:"Find us in person" },
  { label:"Wholesale", href:"wholesale.html", hint:"Shops & events" },
  { label:"FAQ", href:"faq.html", hint:"Common questions" },
  { label:"Contact", href:"contact.html", hint:"Send a message" },
];

let selected = 0;
let filtered = NAV;

function openCmdk(){
  if (!cmdk) return;
  cmdk.hidden = false;
  selected = 0;
  filtered = NAV;
  renderCmdk();
  setTimeout(() => cmdkInput?.focus(), 0);
}

function closeCmdk(){
  if (!cmdk) return;
  cmdk.hidden = true;
  if (cmdkInput) cmdkInput.value = "";
}

function scoreMatch(q, text){
  q = q.toLowerCase().trim();
  text = text.toLowerCase();
  if (!q) return 0;
  if (text.includes(q)) return 100 - text.indexOf(q);

  let ti = 0;
  let score = 0;
  for (const ch of q){
    const idx = text.indexOf(ch, ti);
    if (idx === -1) return -Infinity;
    score += 5;
    if (idx === ti) score += 2;
    ti = idx + 1;
  }
  return score;
}

function renderCmdk(){
  if (!cmdkList) return;
  cmdkList.innerHTML = "";
  filtered.forEach((t, i) => {
    const item = document.createElement("div");
    item.className = "cmdkItem";
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", String(i === selected));
    item.innerHTML = `<div><strong>${t.label}</strong><div class="muted" style="font-size:12px">${t.hint}</div></div><small>${t.href}</small>`;
    item.addEventListener("click", () => jumpTo(i));
    cmdkList.appendChild(item);
  });
}

function jumpTo(i){
  const t = filtered[i];
  if (!t) return;
  closeCmdk();
  window.location.href = t.href;
}

cmdkBtn?.addEventListener("click", openCmdk);

window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  const meta = e.metaKey || e.ctrlKey;
  if (meta && k === "k"){
    e.preventDefault();
    if (cmdk?.hidden) openCmdk();
    else closeCmdk();
  }
  if (!cmdk || cmdk.hidden) return;

  if (e.key === "Escape") closeCmdk();
  if (e.key === "ArrowDown"){
    e.preventDefault();
    selected = Math.min(selected + 1, filtered.length - 1);
    renderCmdk();
  }
  if (e.key === "ArrowUp"){
    e.preventDefault();
    selected = Math.max(selected - 1, 0);
    renderCmdk();
  }
  if (e.key === "Enter"){
    e.preventDefault();
    jumpTo(selected);
  }
});

cmdk?.addEventListener("click", (e) => {
  const t = e.target;
  if (t?.dataset?.close) closeCmdk();
});

cmdkInput?.addEventListener("input", () => {
  const q = cmdkInput.value.trim();
  filtered = NAV
    .map(t => ({ ...t, _score: Math.max(scoreMatch(q, t.label), scoreMatch(q, t.href), scoreMatch(q, t.hint)) }))
    .filter(t => q === "" ? true : t._score > -Infinity)
    .sort((a,b) => (b._score - a._score));
  selected = 0;
  renderCmdk();
});