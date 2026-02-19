// Atlas demo — tiny JS, big vibes.

const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

/* ---------------------------
   Theme
---------------------------- */
(function initTheme(){
  const stored = localStorage.getItem("atlas_theme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const theme = stored ?? (prefersDark ? "dark" : "light");
  setTheme(theme);
})();

function setTheme(theme){
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("atlas_theme", theme);
  const icon = $("#themeIcon");
  if (icon) icon.textContent = theme === "dark" ? "◐" : "◑";
}

$("#themeBtn")?.addEventListener("click", () => {
  const cur = document.documentElement.dataset.theme || "dark";
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
  el.style.transitionDelay = `${Math.min(i * 60, 240)}ms`;
  io.observe(el);
});

/* ---------------------------
   Active nav highlight
---------------------------- */
const sections = ["features","work","about","pricing","contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const navLinks = $$(".links a").filter(a => a.getAttribute("href")?.startsWith("#"));

const sectionIO = new IntersectionObserver((entries) => {
  // pick most visible intersecting section
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  const id = visible.target.id;

  navLinks.forEach(a => {
    const active = a.getAttribute("href") === `#${id}`;
    a.classList.toggle("active", active);
  });
}, { rootMargin: "-20% 0px -65% 0px", threshold: [0.12, 0.25, 0.4, 0.6] });

sections.forEach(s => sectionIO.observe(s));

/* ---------------------------
   Tilt + shine on hover
---------------------------- */
function tiltHandler(el){
  const rect = () => el.getBoundingClientRect();

  function move(e){
    const r = rect();
    const x = (e.clientX - r.left) / r.width;   // 0..1
    const y = (e.clientY - r.top) / r.height;   // 0..1
    const rx = (y - 0.5) * -10;
    const ry = (x - 0.5) * 12;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    el.style.setProperty("--mx", `${x*100}%`);
    el.style.setProperty("--my", `${y*100}%`);
  }

  function leave(){
    el.style.transform = "";
  }

  el.addEventListener("mousemove", move);
  el.addEventListener("mouseleave", leave);
}

$$(".tilt").forEach(tiltHandler);

/* ---------------------------
   Cmd-K search modal
---------------------------- */
const cmdk = $("#cmdk");
const cmdkBtn = $("#cmdkBtn");
const cmdkInput = $("#cmdkInput");
const cmdkList = $("#cmdkList");

const targets = [
  { id: "top", label: "Top", hint: "Hero / intro" },
  { id: "features", label: "Features", hint: "What you get" },
  { id: "work", label: "Work", hint: "Projects" },
  { id: "about", label: "About", hint: "Timeline + quotes" },
  { id: "pricing", label: "Pricing", hint: "The aesthetic section" },
  { id: "contact", label: "Contact", hint: "Form UI" },
];

let selected = 0;
let filtered = targets;

function openCmdk(){
  if (!cmdk) return;
  cmdk.hidden = false;
  selected = 0;
  filtered = targets;
  renderCmdk();
  setTimeout(() => cmdkInput?.focus(), 0);
}

function closeCmdk(){
  if (!cmdk) return;
  cmdk.hidden = true;
  cmdkInput && (cmdkInput.value = "");
}

function scoreMatch(q, text){
  // tiny fuzzy-ish score: sequential char match + substring boost
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
    item.innerHTML = `<div><strong>${t.label}</strong><div class="muted" style="font-size:12px">${t.hint}</div></div><small>#${t.id}</small>`;
    item.addEventListener("click", () => jumpTo(i));
    cmdkList.appendChild(item);
  });
}

function jumpTo(i){
  const t = filtered[i];
  if (!t) return;
  closeCmdk();
  document.getElementById(t.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
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

/* ---------------------------
   Copy deploy URL (best-effort)
---------------------------- */
const copyBtn = $("#copyBtn");
const copyHint = $("#copyHint");

copyBtn?.addEventListener("click", async () => {
  const url = location.href;
  try{
    await navigator.clipboard.writeText(url);
    if (copyHint) copyHint.textContent = "Copied!";
  } catch {
    if (copyHint) copyHint.textContent = "Couldn’t copy (permissions).";
  }
  setTimeout(() => { if (copyHint) copyHint.textContent = ""; }, 1200);
});

/* ---------------------------
   Contact form demo
---------------------------- */
const form = $("#contactForm");
const fake = $("#fakeSubmit");
const formNote = $("#formNote");

function flashNote(msg){
  if (!formNote) return;
  formNote.textContent = msg;
  setTimeout(() => (formNote.textContent = ""), 1600);
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  flashNote("This is UI-only. Wire to a backend/service if you want real submissions.");
});

fake?.addEventListener("click", () => {
  flashNote("Demo: pretend message sent ✨");
});
