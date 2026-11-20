// Nov 21, 2026 (owner): «⚙️ Әкімші панелі» — the whole business from Telegram with buttons.
// Loaded by miniapp.html only when the admin opens the admin page; every button calls /api/admin/do
// (bot/admin_actions.py). The server asks «Растайсыз ба?» itself for money, prices, broadcasts and blocking.
(function () {
  const css = `
.pnTiles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.pnTile{border-radius:18px;padding:12px;min-height:78px;cursor:pointer;position:relative}.pnTile:active{transform:scale(.97)}
.pnTile i{font-style:normal;font-size:22px}.pnTile b{display:block;font-size:14px;margin-top:3px}.pnTile span{font-size:11px;color:var(--muted)}
.pnTile em{position:absolute;top:8px;right:10px;font-style:normal;background:#ff6b6b;color:#fff;border-radius:99px;font-size:11px;font-weight:700;padding:1px 7px}
.pnCard{border-radius:18px;padding:12px;margin-top:10px}
.pnRow{display:flex;justify-content:space-between;gap:8px;font-size:13px;padding:6px 0;border-top:1px solid rgba(255,255,255,.12)}.pnRow:first-child{border-top:0}
.pnRow span{color:var(--muted)}.pnRow b{text-align:right}
.pnSm{font-size:12px;color:var(--muted)}.pnErr{font-size:12px;color:#ffb3b3;background:rgba(255,107,107,.1);border-radius:10px;padding:7px 9px;margin-top:6px;word-break:break-word}
.pnBtns{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px}
.pnB{border:0;border-radius:12px;padding:11px 6px;font:inherit;font-weight:700;font-size:13px;color:#fff;background:rgba(255,255,255,.1);cursor:pointer}
.pnB.gold{background:linear-gradient(135deg,#FFD15C,#f0a02a);color:#111}.pnB.red{background:rgba(255,107,107,.2);color:#ffc2c2}.pnB.full{grid-column:1/-1}
.pnTabs{display:flex;gap:6px}.pnTab{flex:1;text-align:center;padding:9px 0;border-radius:12px;font-size:13px;font-weight:600;background:rgba(255,255,255,.08);cursor:pointer}
.pnTab.on{background:var(--gold);color:#111}
.pnSty{display:flex;align-items:center;gap:8px}.pnSty b{flex:1;font-size:14px}
.pnSw{width:44px;height:26px;border-radius:99px;background:rgba(255,255,255,.22);position:relative;flex:none;cursor:pointer}
.pnSw::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .15s}
.pnSw.on{background:#5fd38d}.pnSw.on::after{left:21px}
.pnSeg{display:flex;margin-top:8px;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,.14);font-size:12.5px}
.pnSeg span{flex:1;text-align:center;padding:7px 0;color:var(--muted);cursor:pointer}.pnSeg span.on{background:rgba(255,209,92,.18);color:var(--gold);font-weight:700}
.pnDemo{font-size:12.5px;color:var(--gold);cursor:pointer}
.pnIn{width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;font:inherit;font-size:14px;outline:none}
textarea.pnIn{min-height:110px;resize:vertical}
.pnLbl{font-size:12px;color:var(--muted);margin:8px 0 4px}
.pnBig{font-size:28px;font-weight:800;color:var(--gold)}
.pnDim{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.6);display:flex;align-items:flex-end}
.pnSheet{width:100%;max-height:88vh;overflow-y:auto;background:#1b1b20;border-radius:22px 22px 0 0;padding:18px 16px calc(var(--bottom) + 22px);border-top:1px solid rgba(255,255,255,.14)}
.pnSheet h3{font-size:17px;margin-bottom:8px}.pnSheet p{font-size:13.5px;color:rgba(255,255,255,.8);margin-bottom:10px;white-space:pre-wrap}
.pnStep{display:flex;align-items:center;justify-content:center;gap:18px;margin:6px 0 12px}.pnStep span{width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;font-size:22px;cursor:pointer}
.pnToast{position:fixed;left:16px;right:16px;bottom:calc(var(--bottom) + 18px);z-index:70;background:#2a2a30;border:1px solid rgba(255,255,255,.18);border-radius:14px;padding:12px 14px;font-size:13.5px;text-align:center}
.pnBubble{background:#182533;border-radius:14px 14px 14px 4px;padding:10px 12px;font-size:13.5px;white-space:pre-wrap;margin-top:8px}
.pnChips{display:flex;flex-wrap:wrap;gap:6px}.pnChip{border-radius:99px;padding:8px 12px;font-size:13px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);cursor:pointer}
.pnChip.on{background:rgba(255,209,92,.18);border-color:var(--gold);color:var(--gold);font-weight:700}
.pnKey{font-size:10.5px;color:var(--muted);font-family:monospace}.pnTxt{font-size:13px;white-space:pre-wrap;max-height:3.9em;overflow:hidden}`;
  const st = document.createElement("style"); st.textContent = css; document.head.append(st);
  const page = document.createElement("div");
  page.className = "pg"; page.id = "pgPanel"; page.style.zIndex = 31;
  page.innerHTML = `<div class="pgtop"><b id="pnTitle"></b><span class="pgx glass" id="pnClose">✕</span></div><div id="pnBody"></div>`;
  document.body.append(page);
  $("pnClose").onclick = () => { haptic(); pgClose("pgPanel"); if (window.openAdmin && $("pgAdmin").classList.contains("show")) openAdmin(); };

  const call = (action, args, confirm) => api("/api/admin/do", {token: D.token, action, args: args || {}, confirm: !!confirm});
  function toast(text) {
    if (!text) return; const t = document.createElement("div"); t.className = "pnToast"; t.textContent = text;
    document.body.append(t); setTimeout(() => t.remove(), 3200);
  }
  function sheet(html) {
    const dim = document.createElement("div"); dim.className = "pnDim";
    dim.innerHTML = `<div class="pnSheet">${html}</div>`;
    dim.onclick = e => { if (e.target === dim) dim.remove(); };
    document.body.append(dim); return dim;
  }
  function ask(question) {
    return new Promise(done => {
      const s = sheet(`<h3>Растайсыз ба?</h3><p>${esc(question)}</p><div class="pnBtns"><button class="pnB" data-no>Жоқ</button><button class="pnB gold" data-yes>✅ Иә, растаймын</button></div>`);
      s.querySelector("[data-no]").onclick = () => { s.remove(); done(false); };
      s.querySelector("[data-yes]").onclick = () => { haptic("medium"); s.remove(); done(true); };
    });
  }
  // One button press: the server may answer with a question first («Растайсыз ба?»), then it is sent again.
  async function act(action, args) {
    let r = await call(action, args);
    if (r && r.confirm) { if (!(await ask(r.confirm))) return null; r = await call(action, args, true); }
    if (!r || r.offline) { toast("Байланыс жоқ, қайта көріңіз"); return null; }
    if (!r.ok) { toast("⚠️ " + (r.error || "Болмады")); return null; }
    if (r.done) toast("✅ " + r.done);
    return r;
  }
  function open(title, html) { $("pnTitle").textContent = title; $("pnBody").innerHTML = html; pgOpen("pgPanel"); return $("pnBody"); }

  // ---------- the tiles on the admin page
  window.panelTiles = async function (box) {
    const q = await call("order_list", {kind: "failed"});
    const failed = q && q.ok ? q.counts.failed : 0, queue = q && q.ok ? q.counts.queue : 0;
    const tiles = [
      ["👥", "Клиенттер", "іздеу, видео қосу, жазу", () => openAll()],
      ["🎬", "Тапсырыстар", `кезекте ${queue}`, () => orders(failed ? "failed" : "queue"), failed],
      ["🎨", "Стильдер", "қосу/өшіру, кімге", styles],
      ["💰", "Тарифтер", "баға, видео саны", tariffs],
      ["📢", "Хабарлама тарату", "барлығына не топқа", broadcast],
      ["📊", "Шығындар", "күн, апта, ай", costs],
      ["🖥", "Сервер", "бот, кезек, диск", server],
      ["✍️", "Мәтіндер", "бот сөздерін өзгерту", texts],
    ];
    const grid = document.createElement("div"); grid.className = "pnTiles";
    grid.innerHTML = tiles.map((t, i) => `<div class="pnTile glass" data-tile="${i}">${t[4] ? `<em>${t[4]}</em>` : ""}<i>${t[0]}</i><b>${t[1]}</b><span>${esc(t[2])}</span></div>`).join("");
    grid.querySelectorAll("[data-tile]").forEach(x => x.onclick = () => { haptic(); tiles[Number(x.dataset.tile)][3](); });
    const first = box.querySelector(".stats4"); first ? first.after(grid) : box.prepend(grid);
  };

  // ---------- 👥 a client (added under the profile the admin opens)
  window.panelClient = async function (box, id) {
    const r = await call("client_card", {client_id: id});
    if (!r || !r.ok) return;
    const card = document.createElement("div"); card.className = "glass card2";
    card.innerHTML = `<h4>Әкімші әрекеттері${r.blocked ? " · 🚫 бұғатталған" : ""}</h4>`
      + `<div class="pnBtns"><button class="pnB gold" data-add>➕ Видео қосу</button><button class="pnB" data-write>✉️ Клиентке жазу</button>`
      + `<button class="pnB ${r.blocked ? "" : "red"} full" data-block>${r.blocked ? "✅ Бұғаттан шығару" : "🚫 Бұғаттау"}</button></div>`
      + (r.orders.length ? `<h4 style="margin-top:14px">Тапсырыстар</h4>` + r.orders.map(o => `<div class="pnRow"><span>№${o.id} · ${esc(o.style)} · ${esc(o.when)}</span>`
        + `<b style="color:${o.status === "failed" ? "#ff8f8f" : "#9fe0b5"}">${esc(o.statusText)}</b></div>${o.error ? `<div class="pnErr">${esc(o.error)}</div>` : ""}`).join("") : "");
    box.append(card);
    card.querySelector("[data-add]").onclick = () => addVideos(r, () => openProfile(id));
    card.querySelector("[data-write]").onclick = () => writeTo(r.id, r.name);
    card.querySelector("[data-block]").onclick = async () => { if (await act("set_blocked", {client_id: id, blocked: !r.blocked})) openProfile(id); };
  };
  function addVideos(client, after) {
    let n = 1;
    const s = sheet(`<h3>➕ ${esc(client.name)}: видео қосу</h3><p>Қазір: ${client.left} видео. Неше видео қосамыз?</p>`
      + `<div class="pnStep"><span data-m>−</span><b class="pnBig" data-n>1</b><span data-p>+</span></div>`
      + `<div class="pnBtns"><button class="pnB" data-no>Бас тарту</button><button class="pnB gold" data-go>Әрі қарай</button></div>`);
    const show = () => s.querySelector("[data-n]").textContent = n;
    s.querySelector("[data-m]").onclick = () => { n = Math.max(1, n - 1); show(); };
    s.querySelector("[data-p]").onclick = () => { n = Math.min(1000, n + 1); show(); };
    s.querySelector("[data-no]").onclick = () => s.remove();
    s.querySelector("[data-go]").onclick = async () => { s.remove(); if (await act("add_videos", {client_id: client.id, videos: n})) after(); };
  }
  function writeTo(id, name) {
    const s = sheet(`<h3>✉️ ${esc(name)}</h3><textarea class="pnIn" data-t placeholder="Хабарлама…"></textarea>`
      + `<div class="pnSm" style="margin-top:6px">Клиент жауап жазса, ол сізге чатқа келеді (48 сағат).</div>`
      + `<div class="pnBtns"><button class="pnB" data-no>Бас тарту</button><button class="pnB gold" data-go>Жіберу</button></div>`);
    s.querySelector("[data-no]").onclick = () => s.remove();
    s.querySelector("[data-go]").onclick = async () => { if (await act("write_client", {client_id: id, text: s.querySelector("[data-t]").value})) s.remove(); };
  }

  // ---------- 🎬 orders
  async function orders(kind) {
    const r = await call("order_list", {kind});
    if (!r || !r.ok) return toast("Болмады");
    const tab = (k, label) => `<span class="pnTab${k === kind ? " on" : ""}" data-k="${k}">${label}</span>`;
    let h = `<div class="pnTabs">${tab("queue", `Кезекте ${r.counts.queue}`)}${tab("failed", `Қате ${r.counts.failed}`)}${tab("recent", "Соңғы")}</div>`;
    h += r.orders.length ? r.orders.map(o => `<div class="glass pnCard"><div class="pnRow"><b style="text-align:left">№${o.id} · ${esc(o.style)}</b><span>${esc(o.when)}</span></div>`
      + `<div class="pnSm">${esc(o.client)} · ${esc(o.statusText)}${o.seconds ? ` · ${o.seconds} с` : ""}</div>`
      + (o.error ? `<div class="pnErr">Себебі: ${esc(o.error)}</div>` : "")
      + `<div class="pnBtns">${o.canRetry ? `<button class="pnB gold" data-retry="${o.id}">🔁 Қайта жасау</button>` : ""}`
      + `<button class="pnB" data-write="${o.clientId}" data-name="${esc(o.client)}">✉️ Клиентке жазу</button>`
      + `<button class="pnB${o.canRetry ? " full" : ""}" data-who="${o.clientId}">👤 Клиент</button></div></div>`).join("")
      : `<div class="glass pnCard pnSm">Бұл жерде тапсырыс жоқ</div>`;
    const box = open("🎬 Тапсырыстар", h);
    box.querySelectorAll("[data-k]").forEach(x => x.onclick = () => { haptic(); orders(x.dataset.k); });
    box.querySelectorAll("[data-retry]").forEach(x => x.onclick = async () => { if (await act("retry_order", {order_id: Number(x.dataset.retry)})) orders("queue"); });
    box.querySelectorAll("[data-write]").forEach(x => x.onclick = () => writeTo(Number(x.dataset.write), x.dataset.name));
    box.querySelectorAll("[data-who]").forEach(x => x.onclick = () => { haptic(); openProfile(Number(x.dataset.who)); });
  }

  // ---------- 🎨 styles
  function drawStyles(list) {
    const known = new Set((D.styles || []).filter(s => s.after).map(s => s.id));
    const h = list.map(s => `<div class="glass pnCard"><div class="pnSty"><b>${esc(s.name)}</b>`
      + (known.has(s.id) ? `<span class="pnDemo" data-demo="${esc(s.id)}">▶ демо</span>` : "")
      + `<span class="pnSw${s.enabled ? " on" : ""}" data-sw="${esc(s.id)}"></span></div>`
      + `<div class="pnSeg"><span class="${s.adminOnly ? "on" : ""}" data-only="${esc(s.id)}" data-v="1">Тек маған</span>`
      + `<span class="${s.adminOnly ? "" : "on"}" data-only="${esc(s.id)}" data-v="0">Барлығына</span></div>`
      + (s.enabled ? "" : `<div class="pnSm" style="margin-top:6px">Өшірулі — ешкімге көрінбейді</div>`) + `</div>`).join("")
      + `<div class="hint2" style="margin-top:12px">ℹ️ Өзгеріс бірден күшіне енеді, сервер жаңарғанда да сақталады.</div>`;
    const box = open("🎨 Стильдер", h);
    box.querySelectorAll("[data-sw]").forEach(x => x.onclick = async () => {
      haptic(); const s = list.find(y => y.id === x.dataset.sw); const r = await act("set_style", {style_id: s.id, enabled: !s.enabled}); if (r) drawStyles(r.styles);
    });
    box.querySelectorAll("[data-only]").forEach(x => x.onclick = async () => {
      haptic(); const r = await act("set_style", {style_id: x.dataset.only, admin_only: x.dataset.v === "1"}); if (r) drawStyles(r.styles);
    });
    box.querySelectorAll("[data-demo]").forEach(x => x.onclick = () => {
      const s = sheet(`<video src="${esc(demoUrl(x.dataset.demo, "after.mp4"))}" style="width:100%;border-radius:14px;max-height:70vh;background:#000" controls autoplay playsinline></video>`
        + `<div class="pnBtns"><button class="pnB full" data-no>Жабу</button></div>`);
      s.querySelector("[data-no]").onclick = () => s.remove();
    });
  }
  async function styles() { const r = await call("style_list"); if (r && r.ok) drawStyles(r.styles); }

  // ---------- 💰 tariffs
  async function tariffs() {
    const r = await call("tariff_list");
    if (!r || !r.ok) return;
    const h = r.tariffs.map(t => `<div class="glass pnCard"><b>${esc(t.name)}</b>${t.trial ? ` <span class="pnSm">· бір рет қана</span>` : ""}`
      + `<div class="pnBtns" style="margin-top:6px"><div><div class="pnLbl">Баға, ₸</div><input class="pnIn" inputmode="numeric" data-price="${esc(t.id)}" value="${t.price}"></div>`
      + `<div><div class="pnLbl">Видео саны</div><input class="pnIn" inputmode="numeric" data-videos="${esc(t.id)}" value="${t.videos}"></div>`
      + `<button class="pnB gold full" data-save="${esc(t.id)}">Сақтау</button></div></div>`).join("")
      + `<div class="hint2" style="margin-top:12px">ℹ️ Жаңа баға жаңа төлемдерге ғана әсер етеді. Бұрын сатып алғандардың видеосы өзгермейді.</div>`;
    const box = open("💰 Тарифтер", h);
    box.querySelectorAll("[data-save]").forEach(x => x.onclick = async () => {
      const id = x.dataset.save;
      const r2 = await act("set_tariff", {tariff_id: id, price: box.querySelector(`[data-price="${id}"]`).value.replace(/\s/g, ""),
        videos: box.querySelector(`[data-videos="${id}"]`).value.replace(/\s/g, "")});
      if (r2 && D.tariffs) { D.tariffs = D.tariffs.map(t => { const n = r2.tariffs.find(y => y.id === t.id); return n ? {...t, price: n.price, videos: n.videos} : t; }); }
    });
  }

  // ---------- 📢 broadcast
  async function broadcast() {
    let group = "all";
    const groups = {all: "Барлық клиентке", with_videos: "Видеосы барларға", no_videos: "Видеосы жоқтарға"};
    const box = open("📢 Хабарлама тарату", `<div class="glass pnCard"><div class="pnLbl" style="margin-top:0">Кімге</div><div class="pnChips">`
      + Object.entries(groups).map(([k, v]) => `<span class="pnChip${k === group ? " on" : ""}" data-g="${k}">${v}</span>`).join("")
      + `</div><div class="pnLbl">Хабарлама</div><textarea class="pnIn" id="pnText" placeholder="Мысалы: Жаңа стиль қосылды!…"></textarea>`
      + `<div class="pnBtns"><button class="pnB full" id="pnPrev">👁 Алдын ала қарау</button></div></div><div id="pnPreview"></div>`);
    box.querySelectorAll("[data-g]").forEach(x => x.onclick = () => { haptic(); group = x.dataset.g; box.querySelectorAll("[data-g]").forEach(y => y.classList.toggle("on", y === x)); $("pnPreview").innerHTML = ""; });
    $("pnPrev").onclick = async () => {
      const text = $("pnText").value.trim();
      if (!text) return toast("Алдымен хабарлама жазыңыз");
      const r = await call("broadcast_preview", {group, text});
      if (!r || !r.ok) return toast("⚠️ " + ((r && r.error) || "Болмады"));
      const run = r.running && !r.running.done ? `<div class="pnErr">Алдыңғы тарату жүріп жатыр: ${r.running.sent}/${r.running.total}</div>` : "";
      $("pnPreview").innerHTML = `<div class="glass pnCard"><h4 class="pnSm">Клиент осылай көреді</h4><div class="pnBubble">${esc(r.text)}</div>`
        + `<div class="pnRow" style="margin-top:8px"><span>${esc(r.group)}</span><b>${r.count} адам · ~${r.minutes} мин</b></div>${run}`
        + `<div class="pnBtns"><button class="pnB gold full" id="pnSend">📢 Жіберу</button></div></div>`;
      $("pnSend").onclick = async () => { if (await act("broadcast_send", {group, text})) { $("pnText").value = ""; $("pnPreview").innerHTML = ""; } };
    };
  }

  // ---------- 📊 costs
  async function costs() {
    const r = await call("costs");
    if (!r || !r.ok) return;
    const usd = v => v === null || v === undefined ? "—" : `$${v}`;
    let h = r.warnings.map(w => `<div class="pnErr" style="margin-top:10px">⚠️ ${esc(w)}</div>`).join("");
    h += `<div class="glass pnCard">${r.periods.map(p => `<div class="pnRow"><span>${esc(p.label)} · ${p.videos} видео</span><b>${p.kzt.toLocaleString("ru")} ₸ <span class="pnSm">($${p.usd})</span></b></div>`).join("")}`
      + `<div class="pnSm" style="margin-top:6px">Бір видео орта есеппен (30 күн): ${r.periods[2].perVideo} ₸</div></div>`;
    h += `<div class="glass pnCard"><h4 class="pnSm">Қалған баланс</h4><div class="pnRow"><span>Claude</span><b>${usd(r.balances.anthropic)}</b></div>`
      + `<div class="pnRow"><span>DigitalOcean</span><b>${usd(r.balances.digitalocean)}</b></div><div class="pnRow"><span>Modal (тегін $30)</span><b>${usd(r.balances.modal)}</b></div>`
      + `<div class="pnSm" style="margin-top:6px">Баланс — шамамен; «шығындарды жаңарт» деп Claude-қа айтқанда дәлденеді.</div></div>`;
    if (r.styles.length) h += `<div class="glass pnCard"><h4 class="pnSm">Стиль бойынша (бір видео)</h4>${r.styles.map(s => `<div class="pnRow"><span>${esc(s.style)} · ${s.videos}</span><b>${s.avg} ₸</b></div>`).join("")}</div>`;
    open("📊 Шығындар", h);
  }

  // ---------- 🖥 server
  async function server() {
    const r = await call("server");
    if (!r || !r.ok) return toast("Сервер жауап бермеді");
    const low = r.freeGb < r.minGb;
    const h = `<div class="glass pnCard"><div class="pnRow"><span>Бот</span><b style="color:#9fe0b5">✅ жұмыс істеп тұр</b></div>`
      + `<div class="pnRow"><span>Қосылғанына</span><b>${esc(r.uptime)}</b></div>`
      + `<div class="pnRow"><span>Кезекте / жасалып жатыр</span><b>${r.queued} / ${r.processing}</b></div>`
      + `<div class="pnRow"><span>Соңғы тәулікте қате</span><b>${r.failedToday}</b></div>`
      + `<div class="pnRow"><span>Бос диск</span><b style="color:${low ? "#ff8f8f" : "inherit"}">${r.freeGb} ГБ${low ? " ⚠️" : ""}</b></div>`
      + `<div class="pnRow"><span>Монтаж</span><b>${r.modal ? "Modal (бұлтта)" : "осы компьютерде"}</b></div>`
      + (r.testMode ? `<div class="pnRow"><span>Сынақ режимі</span><b>қосулы</b></div>` : "")
      + `<div class="pnRow"><span>Соңғы жаңарту</span><b>${esc(r.last.when || "—")}</b></div>`
      + (r.last.subject ? `<div class="pnSm" style="margin-top:4px">${esc(r.last.subject)}</div>` : "")
      + `</div><div class="pnBtns"><button class="pnB full" id="pnRe">↻ Жаңарту</button></div>`;
    open("🖥 Сервер", h);
    $("pnRe").onclick = () => { haptic(); server(); };
  }

  // ---------- ✍️ texts
  let TL = "kk";
  async function texts(q) {
    const r = await call("text_list", {lang: TL, q: q || ""});
    if (!r || !r.ok) return;
    if (!$("pnFind") || $("pnTitle").textContent !== "✍️ Мәтіндер") {
      open("✍️ Мәтіндер", `<div class="pnChips">${r.langs.map(l => `<span class="pnChip${l === TL ? " on" : ""}" data-l="${l}">${l === "kk" ? "Қазақша" : l === "ru" ? "Орысша" : l}</span>`).join("")}</div>`
        + `<input class="find glass" id="pnFind" type="search" placeholder="🔎 Сөз не кілт бойынша іздеу"><div id="pnTexts"></div>`);
      $("pnFind").value = q || "";
      let wait = 0; $("pnFind").oninput = () => { clearTimeout(wait); wait = setTimeout(() => texts($("pnFind").value), 300); };
      $("pnBody").querySelectorAll("[data-l]").forEach(x => x.onclick = () => { haptic(); TL = x.dataset.l; $("pnTitle").textContent = ""; texts($("pnFind").value); });
    }
    $("pnTexts").innerHTML = r.texts.length ? r.texts.map((t, i) => `<div class="glass pnCard" data-i="${i}" style="cursor:pointer"><div class="pnKey">${esc(t.key)}${t.changed ? " · ✏️ өзгертілген" : ""}</div>`
      + `<div class="pnTxt">${esc(t.value)}</div></div>`).join("") : `<div class="glass pnCard pnSm">Табылмады</div>`;
    $("pnTexts").querySelectorAll("[data-i]").forEach(x => x.onclick = () => editText(r.texts[Number(x.dataset.i)]));
  }
  function editText(t) {
    const s = sheet(`<h3>✍️ Мәтінді өзгерту</h3><div class="pnKey">${esc(t.key)}</div>`
      + `<textarea class="pnIn" data-t style="min-height:180px;margin-top:8px">${esc(t.value)}</textarea>`
      + (t.fields.length ? `<div class="pnSm" style="margin-top:6px">Мына жақшадағы сөздерге тимеңіз, бот оларды өзі толтырады: ${esc(t.fields.map(f => "{" + f + "}").join(", "))}</div>` : "")
      + `<div class="pnBtns"><button class="pnB" data-no>Бас тарту</button><button class="pnB gold" data-go>Сақтау</button>`
      + (t.changed ? `<button class="pnB full" data-reset>↩️ Бастапқы мәтінге қайтару</button>` : "") + `</div>`);
    s.querySelector("[data-no]").onclick = () => s.remove();
    s.querySelector("[data-go]").onclick = async () => { if (await act("set_text", {lang: TL, key: t.key, value: s.querySelector("[data-t]").value})) { s.remove(); texts($("pnFind").value); } };
    const reset = s.querySelector("[data-reset]");
    if (reset) reset.onclick = async () => { if (await act("set_text", {lang: TL, key: t.key, value: null})) { s.remove(); texts($("pnFind").value); } };
  }
})();
