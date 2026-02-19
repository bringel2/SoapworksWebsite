// Heartland Soapworks — fancy behavior, warm vibe.

const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

/* ---------------------------
   Theme (default: light)
---------------------------- */
(function initTheme(){
  const stored = localStorage.getItem("hs_theme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  // Midwest vibe default: light. If user has system dark and no stored pref, use dark.
  const theme = stored ?? (prefersDark ? "dark" : "light");
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
   Tilt cards (subtle)
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
   Hero preview thumbnails (index only)
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
   Toast utility
---------------------------- */
const toast = $("#toast");
let toastTimer = null;

function showToast(msg){
  if (!toast) return;
  toast.hidden = false;
  toast.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 1600);
}

$$("[data-toast]").forEach(btn => {
  btn.addEventListener("click", () => showToast(btn.dataset.toast));
});

/* ---------------------------
   Contact form demo (index only)
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
  showToast("Message queued (demo).");
});

fake?.addEventListener("click", () => {
  flashNote("Demo: pretend message sent.");
  showToast("Sent ✨ (demo)");
});

/* ---------------------------
   Cmd-K search modal (works on both pages)
---------------------------- */
const cmdk = $("#cmdk");
const cmdkBtn = $("#cmdkBtn");
const cmdkInput = $("#cmdkInput");
const cmdkList = $("#cmdkList");

function pageTargets(){
  // Detect what sections exist on the current page
  const t = [];
  const add = (id, label, hint, hrefOverride=null) => {
    const el = document.getElementById(id);
    if (el) t.push({ id, label, hint, href: hrefOverride ?? `#${id}` });
  };

  // common
  t.push({ id:"home", label:"Home", hint:"Return home", href:"index.html" });

  // index sections
  add("shop", "Shop", "Browse soaps ($10)", "#shop");
  add("story", "Our Story", "Midwest-made", "#story");
  add("markets", "Markets", "Find us in person", "#markets");
  add("contact", "Contact", "Ask a question", "#contact");

  // about page sections (no ids besides page structure; offer anchors via href)
  if (location.pathname.endsWith("about.html") || document.querySelector(".aboutPage")){
    t.push({ id:"about", label:"About", hint:"This page", href:"about.html" });
    t.push({ id:"shop", label:"Shop", hint:"Go to products", href:"index.html#shop" });
    t.push({ id:"contact", label:"Contact", hint:"Send a message", href:"index.html#contact" });
  } else {
    t.push({ id:"about", label:"About", hint:"Learn about Heartland", href:"about.html" });
  }

  return t;
}

let targets = pageTargets();
let selected = 0;
let filtered = targets;

function openCmdk(){
  if (!cmdk) return;
  cmdk.hidden = false;
  targets = pageTargets();
  filtered = targets;
  selected = 0;
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

  // Same-page anchor navigation if href starts with #
  if (t.href?.startsWith("#")){
    document.querySelector(t.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  // Otherwise navigate
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
  filtered = targets
    .map(t => ({ ...t, _score: Math.max(scoreMatch(q, t.label), scoreMatch(q, t.id), scoreMatch(q, t.hint)) }))
    .filter(t => q === "" ? true : t._score > -Infinity)
    .sort((a,b) => (b._score - a._score));
  selected = 0;
  renderCmdk();
});
