document.head.insertAdjacentHTML("beforeend", "<style>.ov-card{position:absolute;top:44%;width:40%;height:30%;border-radius:18px;display:none;align-items:flex-end;justify-content:center;padding-bottom:10px;font-weight:800;font-size:13px;touch-action:none;cursor:grab;z-index:2}</style>");
// Loaded only when "try the demo" is pressed: the main page stays light (Nov 11).
document.getElementById("app").insertAdjacentHTML("beforeend", "<div id=\"edit\">\n  <div class=\"evid\" id=\"evid\">\n    <video id=\"eVideo\" playsinline preload=\"auto\"></video>\n    <div class=\"ov-title\" id=\"ovTitle\"></div>\n    <div class=\"ov-chip glass\" id=\"ovChip\"></div>\n    <div class=\"ov-cap\" id=\"ovCap\"></div><div class=\"ov-card glass\" id=\"ovCard0\"></div><div class=\"ov-card glass\" id=\"ovCard1\"></div>\n    <div class=\"etime\"><div class=\"eplay glass\" id=\"ePlay\">▶</div><div class=\"bar\" id=\"eBar\"><i id=\"eFill\"></i><b id=\"eKnob\"></b></div><span id=\"eSec\">0:00</span></div>\n  </div>\n  <div class=\"eclose glass\" id=\"eClose\"></div>\n  <div class=\"epane glass\" id=\"epane\">\n    <div class=\"etabs\"><span class=\"on\" data-tab=\"subs\" id=\"tabSubs\"></span><span data-tab=\"effects\" id=\"tabFx\"></span></div>\n    <div class=\"elist\" id=\"elist\"></div>\n    <div class=\"tools\" id=\"tools\"></div>\n    <button class=\"cta\" id=\"eSend\" style=\"margin:0\"></button>\n  </div>\n  <div class=\"epane glass\" id=\"review\" style=\"display:none\">\n    <div class=\"h\" style=\"font-size:17px;text-align:center\" id=\"rvTitle\"></div>\n    <div class=\"hint\" style=\"text-align:center\" id=\"rvHint\"></div>\n    <div class=\"rv\" id=\"rvList\" style=\"flex:1;min-height:0\"></div>\n    <button class=\"cta\" id=\"rvYes\" style=\"margin:0\"></button><button class=\"ghost\" id=\"rvNo\"></button><button class=\"ghost\" id=\"rvWrite\" style=\"display:none;color:#ffe08a\"></button>\n  </div>\n  <div class=\"eclose glass\" id=\"rvBack\" style=\"display:none\"></div>\n  <div class=\"toast glass\" id=\"toast\"></div>\n</div>\n");
// ---------- "try the demo": the approved editor, live on the demo video, nothing is sent (Nov 11)
const ED = {plan: null, tab: "subs", tool: null, edits: {}, removed: {}, marks: {}, moves: {}, size: 100, place: 0, voice: 100, music: 30, auto: true,
  tune: 0, color: "gold", editing: null, mode: "list"};
const TOOLS = ["highlight", "place", "music", "color"];
// Nov 12 (user): the sliders really change the sound. The video's own voice goes through a gain
// (0-150%), the background tune plays beside it in step (0% silent, 100% loud); "Авто" = the bot's levels.
const AU = {ctx: null, voice: null, music: null, el: new Audio(), mine: null};
AU.el.loop = true; AU.el.preload = "auto"; AU.el.crossOrigin = "anonymous";
function audioInit() {
  if (AU.ctx) return;
  try {
    AU.ctx = new (window.AudioContext || window.webkitAudioContext)();
    AU.voice = AU.ctx.createGain(); AU.ctx.createMediaElementSource(ev()).connect(AU.voice).connect(AU.ctx.destination);
    AU.music = AU.ctx.createGain(); AU.ctx.createMediaElementSource(AU.el).connect(AU.music).connect(AU.ctx.destination);
  } catch (e) { AU.ctx = null; }
  applyLevels();
}
function applyLevels() {
  const v = ED.voice / 100, m = ED.music / 30;  // 30% = the level the bot mixes; 100% = loud
  if (AU.voice) AU.voice.gain.value = v; else ev().volume = Math.min(1, v);
  if (AU.music) AU.music.gain.value = m; else AU.el.volume = Math.min(1, ED.music / 100);
}
function tuneSrc() {
  if (ED.tune === 9 && AU.mine) return AU.mine;
  if (ED.order) return style.tunes ? ED.base + `music_${Math.min(ED.tune, style.tunes - 1) + 1}.m4a` : "";
  if (style.tunes) return demoUrl(style.id, `music_${Math.min(ED.tune, style.tunes - 1) + 1}.m4a`);
  return "";
}
function setTune() { const src = tuneSrc(); if (!src) { AU.el.removeAttribute("src"); return; }
  if (AU.el.src !== src && !AU.el.src.endsWith(src)) { AU.el.src = src; } syncMusic(true); }
function syncMusic(force) { const v = ev(); if (!AU.el.src) return;
  if (force || Math.abs(AU.el.currentTime - v.currentTime) > 0.3) { try { AU.el.currentTime = v.currentTime % (AU.el.duration || 1e9); } catch (e) {} }
  if (!v.paused && AU.el.paused) AU.el.play().catch(() => {}); if (v.paused && !AU.el.paused) AU.el.pause(); }
const mineInput = document.createElement("input"); mineInput.type = "file"; mineInput.accept = "audio/*,video/*"; mineInput.style.display = "none";
document.body.append(mineInput);
mineInput.onchange = () => { const f = mineInput.files[0]; if (!f) return; if (AU.mine) URL.revokeObjectURL(AU.mine);
  AU.mine = URL.createObjectURL(f); ED.tune = 9; ED.auto = false; setTune(); renderEd(); };
const FILL = {gold: ["linear-gradient(180deg,#FFF6C8,#FFD54F 38%,#F2A91C 68%,#FFE28A)", "#FFC93C", "#FFE14D"],
  mint: ["linear-gradient(180deg,#E6FFF7,#7EE0C3 45%,#2FB58E 75%,#B5F5E2)", "#5FD9B4", "#7EE0C3"],
  coral: ["linear-gradient(180deg,#FFE3DA,#FF9A7E 40%,#F0552F 72%,#FFC2B0)", "#FF7A59", "#FF7A59"],
  blue: ["linear-gradient(180deg,#EEF4FF,#A9C8FF 40%,#4F86F0 72%,#CFE0FF)", "#7FAEFF", "#8FB8FF"],
  pink: ["linear-gradient(180deg,#FFE9F6,#FFA6DA 40%,#EC4FA8 72%,#FFCDEB)", "#FF8FD0", "#FF8FD0"],
  white: ["linear-gradient(180deg,#FFFFFF,#F4F4F4 50%,#D9D9D9)", "#FFFFFF", "#FFFFFF"]};
const ev = () => $("eVideo");

async function openTry() {
  haptic("medium"); stop();
  ED.order = null; ED.base = "";
  ED.plan = await (await fetch(demoUrl(style.id, "plan.json"))).json().catch(() => null);
  if (!ED.plan) return;
  openEd(demoUrl(style.id, "before.mp4"), demoUrl(style.id, "before.jpg"));
}
// Nov 12: the client's own finished order: its captions and effects, its video and the mood's tunes
// come from the bot; "Иә, жіберу" sends the changes and the video is rendered again.
async function openOrder(id) {
  const r = await api("/api/order", {token: D.token, order: id});
  if (!r.ok) return r.error || T.app_failed;
  style = r.style; color = "gold";
  ED.order = r.order; ED.base = API + r.base; ED.plan = r.plan;
  openEd(ED.base + "video.mp4", ED.base + "video.jpg");
  return "";
}
function openEd(src, poster) {
  Object.assign(ED, {tab: "subs", tool: null, edits: {}, removed: {}, marks: {}, moves: {}, size: 100, place: 0, voice: 100, music: 30, auto: true, tune: 0, color, editing: null, mode: "list"});
  $("tabFx").style.display = style.editFx === false ? "none" : "";
  setTune(); applyLevels();
  VIEW.s = 1; VIEW.x = 0; VIEW.y = 0; applyView();
  const v = ev(); if (ED.order) v.crossOrigin = "anonymous"; v.src = src; v.poster = poster; v.currentTime = 0; v.volume = 1;
  $("tabSubs").textContent = T.ed_subs; $("tabFx").textContent = T.ed_effects; $("eClose").textContent = "✕ " + T.ed_close;
  $("edit").classList.add("show"); $("review").style.display = "none"; $("epane").style.display = "flex"; $("rvBack").style.display = "none";
  applyColor(); renderEd(); overlay();
}
function key(kind, i) { return kind + ":" + i; }
function capText(i) { return ED.edits[key("c", i)] ?? ED.plan.captions[i].text; }
function fxText(i) { return ED.edits[key("e", i)] ?? ED.plan.effects[i].text; }
function counts() {
  const subs = Object.keys(ED.edits).filter(k => k.startsWith("c:")).length;
  const fx = Object.keys(ED.edits).filter(k => k.startsWith("e:")).length + Object.keys(ED.removed).length
    + Object.keys(ED.moves).filter(k => k.startsWith("e:")).length;
  const hl = Object.keys(ED.marks).filter(k => ED.marks[k]).length;
  const place = (ED.size !== 100 ? 1 : 0) + (ED.place !== 0 ? 1 : 0) + (ED.moves.cap ? 1 : 0);
  const music = (ED.voice !== 100 ? 1 : 0) + (ED.music !== 30 ? 1 : 0) + (ED.tune !== 0 ? 1 : 0);
  const col = ED.color !== color ? 1 : 0;
  return {subs, fx, tools: [hl, place, music, col], total: subs + fx + hl + place + music + col};
}
function badge(n) { return n ? `<i class="bdg">${n}</i>` : ""; }
function curIndex(list) { const t = ev().currentTime; return list.findIndex(x => t >= x.start && t < x.end + 0.15); }

function renderEd() {
  const c = counts();
  $("tabSubs").innerHTML = T.ed_subs + badge(c.subs); $("tabSubs").className = (ED.tab === "subs" && !ED.tool ? "on " : "") + (c.subs ? "chg" : "");
  $("tabFx").innerHTML = T.ed_effects + badge(c.fx); $("tabFx").className = (ED.tab === "effects" && !ED.tool ? "on " : "") + (c.fx ? "chg" : "");
  $("edit").classList.toggle("fxmode", ED.tab === "effects" && ED.tool === null);  // Nov 12: 2 rows, a bigger video
  const names = [["A", T.ed_highlight], ["↕", T.ed_place], ["♪", T.ed_music], ["●", T.ed_color]];
  const allowed = (style.editTools || TOOLS).filter(x => x !== "color" || style.colorPick);
  $("tools").style.gridTemplateColumns = `repeat(${Math.max(1, allowed.length)},1fr)`;
  $("tools").innerHTML = names.map((n, i) => allowed.includes(TOOLS[i]) ? `<div class="tool${ED.tool === i ? " on" : ""}${c.tools[i] ? " chg" : ""}" data-tool="${i}"><b>${n[0]}</b>${n[1]}${badge(c.tools[i])}</div>` : "").join("");
  $("tools").querySelectorAll(".tool").forEach(el => el.onclick = () => { haptic(); const i = +el.dataset.tool; ED.tool = ED.tool === i ? null : i; ED.editing = null; renderEd(); });
  $("eSend").textContent = T.ed_send + (c.total ? " · " + c.total : "");
  $("eSend").style.opacity = c.total ? 1 : .5;
  const L = $("elist"); L.innerHTML = "";
  if (ED.tool === null) {
    const items = ED.tab === "subs" ? ED.plan.captions.map((x, i) => ({x, i, text: capText(i), k: "c"}))
      : ED.plan.effects.map((x, i) => ({x, i, text: (x.kind === "title" ? T.ed_title : x.kind === "card" ? "▣" : T.ed_chip) + " · «" + fxText(i) + "»", k: "e"}));
    const cur = curIndex(ED.tab === "subs" ? ED.plan.captions : ED.plan.effects);
    items.forEach(({x, i, text, k}) => {
      const row = document.createElement("div");
      if (ED.editing === key(k, i)) {
        row.className = "einput";
        row.innerHTML = `<input value=""><button class="mini ok">${T.ed_save}</button><button class="mini no">${T.ed_cancel}</button>`;
        row.querySelector("input").value = k === "c" ? capText(i) : fxText(i);
        row.querySelector(".ok").onclick = () => { const val = row.querySelector("input").value.trim(); const orig = k === "c" ? x.text : x.text;
          if (val && val !== orig) ED.edits[key(k, i)] = k === "e" ? val.toUpperCase() : val; else delete ED.edits[key(k, i)];
          ED.editing = null; renderEd(); overlay(); };
        row.querySelector(".no").onclick = () => { ED.editing = null; renderEd(); };
        L.append(row); setTimeout(() => row.querySelector("input").focus(), 50); return;
      }
      row.className = "it" + (i === cur ? " cur" : "") + (ED.removed[key("e", i)] && k === "e" ? " gone" : "");
      row.innerHTML = `<span class="tm">${fmt(x.start)}</span><span class="grow"></span><span class="ix" data-a="edit">✎</span>` + (k === "e" ? `<span class="ix" data-a="del">${ED.removed[key("e", i)] ? "↺" : "✕"}</span>` : "");
      row.querySelector(".grow").textContent = text;
      row.onclick = e => { const a = e.target.dataset.a;
        if (a === "edit") { ED.editing = key(k, i); renderEd(); return; }
        if (a === "del") { if (ED.removed[key("e", i)]) delete ED.removed[key("e", i)]; else ED.removed[key("e", i)] = true; renderEd(); overlay(); return; }
        ev().currentTime = x.start + 0.05; overlay(); renderEd(); };
      L.append(row);
    });
  } else if (ED.tool === 0) {
    const i = Math.max(0, curIndex(ED.plan.captions));
    L.innerHTML = `<div class="hint">${fmt(ED.plan.captions[i].start)} · ${T.ed_tap_word}</div><div class="words"></div>`;
    capText(i).split(/\s+/).forEach((w, j) => { const el = document.createElement("span"); const mk = `${i}:${j}`;
      el.className = "w" + (ED.marks[mk] ? " y" : ""); el.textContent = w;
      el.onclick = () => { haptic(); ED.marks[mk] = !ED.marks[mk]; if (!ED.marks[mk]) delete ED.marks[mk]; renderEd(); overlay(); };
      L.querySelector(".words").append(el); });
  } else if (ED.tool === 1) {
    L.innerHTML = `<div class="row2"><span>${T.ed_size}</span><span class="hint">${ED.size}%</span></div><input type="range" min="70" max="140" step="5" value="${ED.size}">
      <div class="opt"><span data-p="-1">${T.ed_up}</span><span data-p="0">${T.ed_stay}</span><span data-p="1">${T.ed_down}</span></div>`;
    L.querySelector("input").oninput = e => { ED.size = +e.target.value; overlay(); renderEdSoft(); };
    L.querySelectorAll("[data-p]").forEach(o => { o.classList.toggle("on", +o.dataset.p === Math.sign(ED.place)); o.onclick = () => { ED.place = +o.dataset.p * 8; renderEd(); overlay(); }; });
  } else if (ED.tool === 2) {
    const tunes = Math.max(1, style.tunes || 0);
    L.innerHTML = `<div class="row2"><span>${T.ed_music}</span><span class="autob${ED.auto ? " on" : ""}" id="mAuto">${T.ed_auto}</span></div>
      <div class="row2" style="font-weight:500;font-size:12px"><span>${T.ed_volume}</span><span class="hint" id="mPct">${ED.music}%</span></div><input type="range" id="mVol" min="0" max="100" step="5" value="${ED.music}">
      <div class="row2" style="font-weight:500;font-size:12px"><span>${T.ed_my_voice}</span><span class="hint" id="vPct">${ED.voice}%</span></div><input type="range" id="vVol" min="0" max="150" step="5" value="${ED.voice}">
      <div class="opt">${Array.from({length: tunes}, (_, n) => `<span data-t="${n}">${T.ed_tune} ${n + 1}</span>`).join("")}${ED.order ? "" : `<span data-t="9">${T.ed_mine}</span>`}</div>`;
    L.querySelector("#mAuto").onclick = () => { haptic(); Object.assign(ED, {auto: true, voice: 100, music: 30}); applyLevels(); renderEd(); };
    L.querySelector("#mVol").oninput = e => { audioInit(); ED.music = +e.target.value; ED.auto = false; applyLevels();
      L.querySelector("#mPct").textContent = ED.music + "%"; L.querySelector("#mAuto").classList.remove("on"); renderEdSoft(); };
    L.querySelector("#vVol").oninput = e => { audioInit(); ED.voice = +e.target.value; ED.auto = false; applyLevels();
      L.querySelector("#vPct").textContent = ED.voice + "%"; L.querySelector("#mAuto").classList.remove("on"); renderEdSoft(); };
    L.querySelectorAll("[data-t]").forEach(o => { o.classList.toggle("on", +o.dataset.t === ED.tune); o.onclick = () => { haptic(); audioInit();
      if (+o.dataset.t === 9) { mineInput.value = ""; mineInput.click(); return; }
      ED.tune = +o.dataset.t; setTune(); renderEd(); }; });
  } else {
    L.innerHTML = `<div class="hint" style="text-align:center">${T.ed_color_hint}</div><div class="dots" style="justify-content:center;gap:12px"></div>`;
    D.colors.forEach(cc => { const d = document.createElement("span"); d.className = "dot" + (cc.id === ED.color ? " on" : ""); d.style.cssText = `background:${cc.swatch};width:30px;height:30px`;
      d.onclick = () => { haptic(); ED.color = cc.id; applyColor(); renderEd(); }; L.querySelector(".dots").append(d); });
  }
}
let softTimer = null;
function renderEdSoft() { clearTimeout(softTimer); softTimer = setTimeout(() => { const c = counts();
  $("eSend").textContent = T.ed_send + (c.total ? " · " + c.total : ""); $("eSend").style.opacity = c.total ? 1 : .5;
  document.querySelectorAll("#tools .tool").forEach((el, i) => { el.classList.toggle("chg", !!c.tools[i]); const b = el.querySelector(".bdg"); if (b) b.remove(); if (c.tools[i]) el.insertAdjacentHTML("beforeend", badge(c.tools[i])); });
  document.querySelectorAll("#elist .hint").forEach(h => { if (h.textContent.endsWith("%")) {} }); }, 120); }
function applyColor() { const f = FILL[ED.color] || FILL.gold; const e = $("edit"); e.style.setProperty("--fill", f[0]); e.style.setProperty("--glow", f[1]); e.style.setProperty("--box", f[2]); }
function overlay() {
  if (!ED.plan) return;
  const t = ev().currentTime;
  const fx = ED.plan.effects.map((x, i) => ({x, i})).filter(({x, i}) => t >= x.start && t < x.end && !ED.removed[key("e", i)]);
  const title = fx.find(({x}) => x.kind === "title"), chip = fx.find(({x}) => x.kind === "chip");
  $("ovTitle").textContent = title ? fxText(title.i) : ""; $("ovTitle").style.opacity = title ? 1 : 0;
  $("ovTitle").dataset.k = title ? key("e", title.i) : ""; moveEl($("ovTitle"));
  const oc = $("ovChip"); oc.style.display = chip ? "block" : "none";
  if (chip) { oc.textContent = fxText(chip.i); oc.style.left = chip.x.side === "left" ? "6%" : "auto"; oc.style.right = chip.x.side === "left" ? "auto" : "6%"; }
  oc.dataset.k = chip ? key("e", chip.i) : ""; moveEl(oc);
  const cards = fx.filter(({x}) => x.kind === "card");
  [0, 1].forEach(n => { const el = $("ovCard" + n), c = cards[n]; el.style.display = c ? "flex" : "none";
    if (c) { el.textContent = fxText(c.i); el.style.left = c.x.side === "left" ? "5%" : "auto"; el.style.right = c.x.side === "left" ? "auto" : "5%"; }
    el.dataset.k = c ? key("e", c.i) : ""; moveEl(el); });
  const ci = ED.plan.captions.findIndex(x => t >= x.start && t < x.end + 0.15);
  const cap = $("ovCap"); cap.style.fontSize = (18 * ED.size / 100) + "px"; cap.style.top = (66 + ED.place) + "%";
  cap.dataset.k = "cap"; moveEl(cap);
  if (ci < 0) { cap.innerHTML = ""; return; }
  cap.innerHTML = capText(ci).split(/\s+/).map((w, j) => `<span class="${ED.marks[`${ci}:${j}`] ? "k" : ""}">${w.replace(/[<>&]/g, "")}</span>`).join(" ");
}
ev().ontimeupdate = () => { const v = ev(); overlay(); syncMusic(); const f = v.currentTime / (v.duration || 1);
  $("eFill").style.width = f * 100 + "%"; $("eKnob").style.left = f * 100 + "%"; $("eSec").textContent = fmt(v.currentTime);
  if (ED.tool === null && ED.mode === "list" && !ED.editing) { const cur = curIndex(ED.tab === "subs" ? ED.plan.captions : ED.plan.effects);
    document.querySelectorAll("#elist .it").forEach((r, i) => r.classList.toggle("cur", i === cur)); } };
ev().onplay = () => { audioInit(); if (AU.ctx && AU.ctx.state === "suspended") AU.ctx.resume(); $("ePlay").textContent = "❚❚"; syncMusic(true); };
ev().onpause = () => { $("ePlay").textContent = "▶"; syncMusic(); };
ev().onseeked = () => syncMusic(true);
$("ePlay").onclick = () => { const v = ev(); v.paused ? v.play() : v.pause(); };
// Nov 12: two fingers zoom the video, one finger moves it (to see the chest, where captions go);
// a short tap still plays / pauses.
const VIEW = {s: 1, x: 0, y: 0}, touches = new Map(); let gesture = null, moved = false;
function applyView() { ev().style.transform = `translate(${VIEW.x}px, ${VIEW.y}px) scale(${VIEW.s})`; }
function clampView() { const b = $("evid").getBoundingClientRect(); VIEW.s = Math.max(0.6, Math.min(3, VIEW.s));
  const lim = (k) => Math.max(0, (VIEW.s * k - k) / 2) + k * 0.35; VIEW.x = Math.max(-lim(b.width), Math.min(lim(b.width), VIEW.x));
  VIEW.y = Math.max(-lim(b.height), Math.min(lim(b.height), VIEW.y)); }
ev().style.touchAction = "none"; ev().style.transformOrigin = "50% 50%";
ev().addEventListener("pointerdown", e => { touches.set(e.pointerId, {x: e.clientX, y: e.clientY}); ev().setPointerCapture(e.pointerId); moved = false;
  const pts = [...touches.values()];
  gesture = pts.length >= 2 ? null : {kind: "pan", x: e.clientX, y: e.clientY, vx: VIEW.x, vy: VIEW.y}; });
ev().addEventListener("pointermove", e => { if (!touches.has(e.pointerId) || !gesture) return; touches.set(e.pointerId, {x: e.clientX, y: e.clientY});
  const pts = [...touches.values()];
  if (pts.length >= 2) return;
  if (gesture.kind === "pan") { const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y; if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
    VIEW.x = gesture.vx + dx; VIEW.y = gesture.vy + dy; }
  clampView(); applyView(); });
const endTouch = e => { touches.delete(e.pointerId); if (!touches.size) { if (!moved) { const v = ev(); v.paused ? v.play() : v.pause(); } gesture = null; }
  else { const p = [...touches.values()][0]; gesture = {kind: "pan", x: p.x, y: p.y, vx: VIEW.x, vy: VIEW.y}; } };
ev().addEventListener("pointerup", endTouch); ev().addEventListener("pointercancel", endTouch);
ev().addEventListener("dblclick", () => { VIEW.s = 1; VIEW.x = 0; VIEW.y = 0; applyView(); });
{ const b = $("eBar"); let drag = false; const go = e => { const r = b.getBoundingClientRect(), f = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); if (ev().duration) ev().currentTime = f * ev().duration; overlay(); };
  b.onpointerdown = e => { drag = true; b.setPointerCapture(e.pointerId); go(e); }; b.onpointermove = e => { if (drag) go(e); }; b.onpointerup = () => drag = false; }
document.querySelectorAll(".etabs span").forEach(s => s.onclick = () => { haptic(); ED.tab = s.dataset.tab; ED.tool = null; ED.editing = null; renderEd(); });
$("eClose").onclick = () => { ev().pause(); AU.el.pause();
  if (ED.order) { try { tg.close(); } catch (e) {} return; }
  $("edit").classList.remove("show"); };

// ---------- move a title, a glass chip or the captions with a finger (Nov 11)
function moveEl(el) { const m = ED.moves[el.dataset.k]; el.style.transform = m ? `translate(${m.x}px, ${m.y}px)` : ""; }
["ovTitle", "ovChip", "ovCap", "ovCard0", "ovCard1"].forEach(id => {
  const el = $(id); let start = null;
  let hold = null;  // Nov 12 (user): hold the detail, the video stops, then ONE finger moves it
  el.onpointerdown = e => { if (ED.order) return;  // a real order: details are not moved yet
    const k = el.dataset.k; if (!k || !el.textContent.trim()) return; e.preventDefault(); e.stopPropagation();
    el.setPointerCapture(e.pointerId); const px = e.clientX, py = e.clientY;
    clearTimeout(hold);
    hold = setTimeout(() => { hold = null; ev().pause(); const m = ED.moves[k] || {x: 0, y: 0};
      start = {k, px, py, x: m.x, y: m.y}; el.classList.add("dragging"); haptic("medium"); }, 350); };
  el.onpointermove = e => { if (!start) return; const box = $("evid").getBoundingClientRect();
    // Nov 12: anywhere on the video, edge to edge
    const x = Math.max(-box.width, Math.min(box.width, start.x + e.clientX - start.px));
    const y = Math.max(-box.height, Math.min(box.height, start.y + e.clientY - start.py));
    ED.moves[start.k] = {x: Math.round(x), y: Math.round(y)}; moveEl(el); };
  el.onpointerup = el.onpointercancel = () => { if (hold) { clearTimeout(hold); hold = null; const v = ev(); v.paused ? v.play() : v.pause(); return; }
    if (!start) return; const m = ED.moves[start.k];
    if (m && Math.abs(m.x) < 4 && Math.abs(m.y) < 4) delete ED.moves[start.k];
    start = null; el.classList.remove("dragging"); renderEd(); };
});

function changesList() {
  const out = [];
  Object.keys(ED.edits).filter(k => k.startsWith("c:")).forEach(k => { const i = +k.slice(2), x = ED.plan.captions[i]; out.push({t: x.start, name: T.ed_subs, html: `<s>${x.text}</s> → <em>${ED.edits[k]}</em>`}); });
  Object.keys(ED.edits).filter(k => k.startsWith("e:")).forEach(k => { const i = +k.slice(2), x = ED.plan.effects[i]; out.push({t: x.start, name: x.kind === "title" ? T.ed_title : T.ed_chip, html: `<s>${x.text}</s> → <em>${ED.edits[k]}</em>`}); });
  Object.keys(ED.removed).forEach(k => { const i = +k.slice(2), x = ED.plan.effects[i]; out.push({t: x.start, name: x.kind === "title" ? T.ed_title : T.ed_chip, html: `<s>${x.text}</s> ✕`}); });
  Object.keys(ED.marks).forEach(k => { const [i, j] = k.split(":").map(Number), x = ED.plan.captions[i]; out.push({t: x.start, name: T.ed_highlight, html: `«${capText(i).split(/\s+/)[j]}» → <em>■</em>`}); });
  Object.keys(ED.moves).filter(k => k.startsWith("e:")).forEach(k => { const i = +k.slice(2), x = ED.plan.effects[i];
    out.push({t: x.start, name: x.kind === "title" ? T.ed_title : T.ed_chip, html: `«${fxText(i)}» → <em>${T.ed_moved}</em>`}); });
  if (ED.moves.cap) out.push({t: null, name: T.ed_subs, html: `<em>${T.ed_moved}</em>`});
  if (ED.size !== 100 || ED.place !== 0) out.push({t: null, name: T.ed_place, html: `${T.ed_size} ${ED.size}%` + (ED.place ? (ED.place < 0 ? " · " + T.ed_up : " · " + T.ed_down) : "")});
  if (ED.voice !== 100 || ED.music !== 30 || ED.tune !== 0) out.push({t: null, name: T.ed_music, html: `${T.ed_my_voice} ${ED.voice}% · ${T.ed_volume} ${ED.music}%` + (ED.tune === 9 ? ` · ${T.ed_mine}` : ED.tune ? ` · ${T.ed_tune} ${ED.tune + 1}` : "")});
  if (ED.color !== color) out.push({t: null, name: T.ed_color, html: `<em>●</em> ${ED.color}`});
  return out;
}
$("eSend").onclick = () => {
  const list = changesList(); if (!list.length) return; haptic("medium"); ev().pause();
  $("rvTitle").textContent = T.ed_changes + " · " + list.length; $("rvHint").textContent = T.ed_watch;
  $("rvYes").textContent = T.ed_yes; $("rvNo").textContent = T.ed_keep; $("rvYes").disabled = false;
  $("rvWrite").textContent = T.ed_write; $("rvWrite").style.display = ED.order ? "block" : "none";
  $("rvList").innerHTML = ""; list.forEach(c => { const r = document.createElement("div"); r.className = "rvi";
    r.innerHTML = `<span class="tm">${c.t === null ? "•" : fmt(c.t)}</span><div><b>${c.name}</b><br>${c.html}</div><span class="go">▶</span>`;
    r.onclick = () => { if (c.t !== null) ev().currentTime = c.t + 0.05; overlay(); ev().play(); $("review").style.display = "none"; $("rvBack").style.display = "block"; $("rvBack").textContent = T.ed_back_list; };
    $("rvList").append(r); });
  $("epane").style.display = "none"; $("review").style.display = "flex"; ED.mode = "review";
};
$("rvBack").onclick = () => { ev().pause(); $("rvBack").style.display = "none"; $("review").style.display = "flex"; };
function toastClose(text) { $("toast").textContent = text; $("toast").style.display = "block";
  setTimeout(() => { try { tg.close(); } catch (e) {} }, 2600); }
$("rvWrite").onclick = async () => { haptic(); const r = await api("/api/order/text", {token: D.token, order: ED.order});
  if (r.ok) { try { tg.close(); } catch (e) {} } else toastClose(r.error || T.app_failed); };
$("rvYes").onclick = async () => { haptic("heavy");
  if (ED.order) {  // a real order: the changes go to the bot, the new video comes to the chat
    if ($("rvYes").disabled) return; $("rvYes").disabled = true;
    const changes = {edits: ED.edits, removed: ED.removed, marks: ED.marks, voice: ED.voice, music: ED.music, tune: ED.tune,
      color: ED.color !== color ? ED.color : ""};
    const r = await api("/api/order/apply", {token: D.token, order: ED.order, changes});
    ev().pause(); AU.el.pause(); toastClose(r.ok ? r.text : (r.error || T.app_failed)); return;
  }
  $("toast").textContent = T.ed_demo_done; $("toast").style.display = "block";
  setTimeout(() => { $("toast").style.display = "none"; openTry(); }, 3200); };
$("rvNo").onclick = () => {
  if (ED.order) { $("review").style.display = "none"; $("rvBack").style.display = "none"; $("epane").style.display = "flex"; ED.mode = "list"; return; }
  openTry(); };
// long press on a detail: the video stops (no stop sign shown), then one finger moves it (Nov 12)
