// Nov 28 (owner, docs/mockups/upload-guide-maket.html, variant 1): «Видео жүктеу» — one screen that shows what to send.
// Each step: a small frame changing once a second (5 example frames), short marks under it and its own
// «0/1 Видео жүктеу» button that turns into «✓ Видео қабылданды»; the last row shows the finished result.
// Everything fits ONE screen (no scrolling). The page's globals (style, D, T, upload, haptic, HOSTED) are used.
(function () {
  // the page's top-level let/const (D, T, HOSTED, style) are shared globals, not window properties
  const app = () => (typeof D !== "undefined" && D) || {};
  const ru = () => app().lang === "ru";
  const L = (o) => (o && typeof o === "object") ? (o[ru() ? "ru" : "kk"] || o.kk) : (o || "");
  // a few marks every talking-head style shares
  const TALL = {kk: "📱 Тік 9:16", ru: "📱 Вертикально 9:16"};
  const VOICE = {kk: "🎙 Дауыс анық", ru: "🎙 Чёткий голос"};
  const ANY = {kk: "🎬 Кез келген кадр", ru: "🎬 Любой кадр"};
  const LIM = {kk: "⏱ {lim} дейін", ru: "⏱ до {lim}"};
  const NOPHOTO = {kk: "🚫 Фото емес", ru: "🚫 Не фото"};
  const NOMUTE = {kk: "🔇 Дауыссыз емес", ru: "🔇 Не без звука"};
  const OWN = {kk: "Өзіңіз сөйлеген видео", ru: "Видео, где вы говорите"};
  const talk = (extra = [], title = OWN) => ({t: title, chips: [TALL, LIM, VOICE, ANY, ...extra], no: [NOPHOTO, NOMUTE], lim: "max", f: "s1"});

  window.GUIDES = {
    motion_pro: {steps: [talk()], result: {kk: "Сөзіңіз әдемі жазумен, шыны терезелер дыбыспен шығады", ru: "Красивые надписи и стеклянные окна под ваш голос"}},
    explainer: {steps: [talk([{kk: "🗣 Түсіндіріп сөйлеңіз", ru: "🗣 Объясняйте"}])],
                result: {kk: "Сіз кішкентай терезеде, қасында тірі инфографика", ru: "Вы в окошке, рядом живая инфографика"}},
    inform: {steps: [talk([{kk: "📚 Білім, кеңес", ru: "📚 Знания, советы"}])],
             result: {kk: "Сіз төменде, үстінде карточкалар, жоғарыда таймер", ru: "Вы внизу, сверху карточки и таймер"}},
    expert: {steps: [talk([{kk: "🧍 Белге дейін, сәл алыстан", ru: "🧍 По пояс, чуть дальше"}])],
             result: {kk: "Сіз қиылып, жылы сахнада шыны карта алдында тұрасыз", ru: "Вы вырезаны и стоите в тёплой сцене"}},
    zerkalo: {steps: [talk([{kk: "🧍 Белге дейін", ru: "🧍 По пояс"}])],
              result: {kk: "Бөлме қараңғыланады, артта түсті жарық, шыны панельдер", ru: "Комната темнеет, цветной свет, стеклянные панели"}},
    kreativ: {steps: [talk([{kk: "📣 Бот туралы айтыңыз", ru: "📣 Расскажите о боте"}], {kk: "Шикі видеоңыз", ru: "Ваше сырое видео"})],
              result: {kk: "Шикі мен дайын видео бір кадрда, астында бот жолағы", ru: "Сырое и готовое видео в одном кадре"}},
    animation: {steps: [{t: {kk: "Видео не дауыс", ru: "Видео или голос"}, lim: "max", f: "s1",
                         chips: [{kk: "🎙 Дауыс міндетті", ru: "🎙 Голос обязателен"}, {kk: "🙈 Бет керек емес", ru: "🙈 Лицо не нужно"},
                                 {kk: "📲 Дайын видео да болады", ru: "📲 Можно готовое видео"}, {kk: "📐 Кез келген формат", ru: "📐 Любой формат"}, LIM],
                         no: [NOPHOTO, NOMUTE]}],
                result: {kk: "Сөзіңізге сай кейіпкерлер, суреттер мен жазулар", ru: "Персонажи, картинки и надписи под ваши слова"}},
    duel: {steps: [
             {t: {kk: "Өзіңіз сөйлейсіз", ru: "Вы говорите"}, lim: "max", f: "s1",
              chips: [{kk: "🤫 Ортада 20–30 с үндемейсіз", ru: "🤫 В середине молчите 20–30 с"}, TALL, LIM, VOICE]},  // the key mark first
             {t: {kk: "Монтаждалмаған видео", ru: "Видео без монтажа"}, lim: "other", f: "s2",
              chips: [{kk: "🎞 Бастапқы нұсқасы", ru: "🎞 Исходная версия"}, LIM]},
             {t: {kk: "Монтаждалған видео", ru: "Смонтированное видео"}, lim: "other", f: "s3",
              chips: [{kk: "✨ Дайын нұсқасы", ru: "✨ Готовая версия"}, LIM], no: [NOPHOTO]}],
           result: {kk: "Сіз сөйлейсіз, төменде екі видео қатар салыстырылады", ru: "Вы говорите, внизу два видео сравниваются"}},
    kreativ2: {steps: [
                 {t: OWN, lim: "max", f: "s1", chips: [{kk: "🧍 Белге дейін, таза фон", ru: "🧍 По пояс, чистый фон"}, TALL, LIM, VOICE],
                  no: [NOPHOTO]},
                 {t: {kk: "Карусель видеолары", ru: "Видео для карусели"}, lim: "other", f: "s2", multi: [3, 8],
                  chips: [{kk: "🎠 3–8 видео", ru: "🎠 3–8 видео"}, {kk: "⏱ әрқайсысы 4 с бастап", ru: "⏱ каждое от 4 с"}, LIM]}],
               result: {kk: "Видеолар кеудеңізді айнала карусель болып айналады", ru: "Видео крутятся каруселью вокруг вас"}},
    kontent: {steps: [
                {t: {kk: "Өз кіріспеңіз", ru: "Ваше вступление"}, lim: "other", f: "s1",
                 chips: [{kk: "📱 Тік не көлденең", ru: "📱 Верт. или гориз."}, {kk: "⏱ 5–10 секунд", ru: "⏱ 5–10 секунд"}, VOICE,
                         {kk: "🙂 Бас пен иық", ru: "🙂 Голова и плечи"}]},
                {t: {kk: "Шетел видеосы", ru: "Зарубежное видео"}, lim: "max", f: "s2",
                 chips: [{kk: "🌍 Кез келген тіл", ru: "🌍 Любой язык"}, LIM], no: [NOPHOTO]}],
              result: {kk: "Басында сіз, сосын видео толық экранда қазақша сөйлейді", ru: "Сначала вы, потом видео на весь экран по-казахски"}},
  };
  GUIDES.animation2 = {steps: GUIDES.animation.steps,
                       result: {kk: "Код салған стикер-кейіпкерлер, тез кесу", ru: "Стикер-персонажи, быстрый монтаж"}};

  const CSS = `
#pgGuide{position:absolute;inset:0;z-index:33;display:none;flex-direction:column;background:radial-gradient(120% 60% at 50% 0%,#3a2b10 0%,#0b0b0d 55%) #0b0b0d;
  padding:calc(var(--top, 0px) + 12px) 14px calc(var(--bottom, 0px) + 14px);color:#f3f3f6}
#pgGuide.show{display:flex}
#pgGuide .gtop{display:flex;align-items:center;gap:10px;flex:none;margin-bottom:10px}
#pgGuide .gtop .gx{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.1);cursor:pointer;flex:none}
#pgGuide .gtop b{font-size:15px;font-weight:800;display:block}
#pgGuide .gtop small{font-size:11px;opacity:.65;font-weight:600}
#pgGuide .grows{flex:1;min-height:0;display:flex;flex-direction:column;gap:9px}
#pgGuide .grow{flex:1;min-height:0;display:flex;gap:10px;padding:8px;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12)}
#pgGuide .grow.res{border-color:rgba(255,209,92,.45);background:linear-gradient(160deg,rgba(255,209,92,.13),rgba(255,209,92,.02))}
#pgGuide .greel{position:relative;height:100%;aspect-ratio:9/16;max-width:34%;border-radius:11px;overflow:hidden;background:#000;flex:none}
#pgGuide .greel img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .3s}
#pgGuide .greel img.on{opacity:1}
#pgGuide .greel .gtag{position:absolute;left:4px;top:4px;z-index:2;font-size:8.5px;font-weight:800;background:rgba(0,0,0,.6);border-radius:999px;padding:2px 6px}
#pgGuide .greel .gdots{position:absolute;left:0;right:0;bottom:4px;z-index:2;display:flex;gap:2px;justify-content:center}
#pgGuide .greel .gdots i{width:8px;height:2px;border-radius:2px;background:rgba(255,255,255,.35)}
#pgGuide .greel .gdots i.on{background:#fff}
#pgGuide .gside{flex:1;min-width:0;display:flex;flex-direction:column;gap:5px;justify-content:space-between;overflow:hidden}
#pgGuide .gttl{display:flex;align-items:center;gap:6px;font-weight:800;font-size:13px}
#pgGuide .gnum{width:20px;height:20px;border-radius:50%;background:#FFD15C;color:#1a1200;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex:none}
#pgGuide .gchips{display:flex;flex-wrap:wrap;gap:4px;overflow:hidden}
#pgGuide .gchip{font-size:10px;font-weight:700;padding:3px 7px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);white-space:nowrap}
#pgGuide .gchip.no{color:#ff9a9a;border-color:rgba(229,72,77,.4);background:rgba(229,72,77,.1)}
#pgGuide .gres{font-size:11px;opacity:.75;line-height:1.35}
#pgGuide .gup{width:100%;min-height:34px;border-radius:11px;border:1.5px dashed rgba(255,209,92,.75);background:rgba(255,209,92,.08);color:#FFD15C;
  font-family:inherit;font-weight:800;font-size:12px;cursor:pointer;flex:none}
#pgGuide .gup.done{border:1.5px solid #2fb457;background:rgba(47,180,87,.15);color:#7fe39c}
#pgGuide .gerr{font-size:10.5px;color:#ff8a8a;font-weight:700}
#pgGuide .gerr:empty{display:none}
#pgGuide .gsend{flex:none;margin-top:10px;width:100%;height:48px;border-radius:15px;border:0;font-family:inherit;font-weight:900;font-size:15px;color:#1a1200;
  background:linear-gradient(180deg,#ffe08a,#f5b400);opacity:.35;transition:opacity .3s}
#pgGuide .gsend.ready{opacity:1;box-shadow:0 8px 24px rgba(245,180,0,.35)}
#pgGuide .grow.compact .gchip{font-size:9px;padding:2px 6px}
#pgGuide .grow.compact .gttl{font-size:12px}
#pgGuide .grow.compact .gup{min-height:30px;font-size:11px}
#pgGuide .grow.compact .gside{gap:4px}`;

  const W = {
    kk: {need: "видео керек", up: "⬆ 0/1 Видео жүктеу", ok: "✓ 1/1 Видео қабылданды", upMany: "⬆ 0/{n} Видео жүктеу",
         okMany: "✓ {k} видео қабылданды", result: "Қорытынды нәтиже", send: "Жіберу", ex: "Мысал", made: "Нәтиже",
         few: "Кемінде {n} видео керек", long: "Видео ұзын: {len}. Ең көбі {max}"},
    ru: {need: "видео нужно", up: "⬆ 0/1 Загрузить видео", ok: "✓ 1/1 Видео принято", upMany: "⬆ 0/{n} Загрузить видео",
         okMany: "✓ Принято видео: {k}", result: "Итоговый результат", send: "Отправить", ex: "Пример", made: "Итог",
         few: "Нужно минимум {n} видео", long: "Видео длинное: {len}. Максимум {max}"},
  };
  const w = () => W[ru() ? "ru" : "kk"];
  const base = () => ((typeof HOSTED !== "undefined" && HOSTED) ? "guide/" : "/app/guide/");
  function seconds(s) {   // 150 -> «2,5 минутқа» / «2,5 минут»
    if (s >= 60 && s % 30 === 0) { const m = String(s / 60).replace(".", ","); return ru() ? `${m} мин` : `${m} минутқа`; }
    return ru() ? `${s} секунд` : `${s} секундқа`;
  }
  const limitOf = (step) => step.lim === "other" ? (style.maxOther || style.max || 0) : (style.max || 0);

  let picked = [], timer = null, tick = 0;
  function ensure() {
    if (document.getElementById("pgGuide")) return;
    const st = document.createElement("style"); st.textContent = CSS; document.head.append(st);
    const pg = document.createElement("div"); pg.id = "pgGuide"; document.body.append(pg);
    const input = document.createElement("input"); input.type = "file"; input.id = "gfile"; input.style.display = "none"; document.body.append(input);
    input.onchange = onFiles;
  }
  function reel(styleId, prefix, tag) {
    const imgs = [0, 1, 2, 3, 4].map(k => `<img src="${base()}${styleId}/${prefix}_${k}.jpg" alt=""${k ? "" : ' class="on"'}>`).join("");
    return `<div class="greel">${imgs}<span class="gtag">${tag}</span><div class="gdots">${"<i></i>".repeat(5)}</div></div>`;
  }
  const chip = (c, no) => `<span class="gchip${no ? " no" : ""}">${L(c).replace("{lim}", "%LIM%")}</span>`;

  window.openGuide = function () {
    ensure();
    const g = GUIDES[style.id]; picked = g.steps.map(() => []);
    const n = g.steps.length, compact = n >= 3 ? " compact" : "";
    const rows = g.steps.map((s, i) => {
      const lim = seconds(limitOf(s));
      const chips = (s.chips || []).map(c => chip(c)).join("") + (s.no || []).map(c => chip(c, true)).join("");
      const label = s.multi ? w().upMany.replace("{n}", s.multi[0] + "–" + s.multi[1]) : w().up;
      return `<div class="grow${compact}">${reel(style.id, s.f, w().ex)}<div class="gside">
        <div class="gttl"><span class="gnum">${i + 1}</span>${L(s.t)}</div>
        <div class="gchips">${chips.replaceAll("%LIM%", lim)}</div>
        <div class="gerr" id="gerr${i}"></div>
        <button class="gup" data-i="${i}">${label}</button></div></div>`;
    }).join("");
    const count = g.steps.reduce((a, s) => a + (s.multi ? s.multi[0] : 1), 0);
    document.getElementById("pgGuide").innerHTML = `
      <div class="gtop"><span class="gx" id="gclose">‹</span><div><b>${(typeof icon === "function" ? icon(style) + " " : "") + label(style)}</b>
        <small>${count}${g.steps.some(s => s.multi) ? "+" : ""} ${w().need}</small></div></div>
      <div class="grows">${rows}
        <div class="grow res${compact}">${reel(style.id, "r", w().made)}<div class="gside" style="justify-content:center;gap:8px">
          <div class="gttl"><span class="gnum">✨</span>${w().result}</div><div class="gres">${L(g.result)}</div></div></div></div>
      <button class="gsend" id="gsend">${w().send}</button>`;
    const pg = document.getElementById("pgGuide");
    pg.querySelectorAll(".gup").forEach(b => b.onclick = () => {
      const s = g.steps[+b.dataset.i], input = document.getElementById("gfile");
      input.accept = style.accept; input.multiple = !!s.multi; input.value = ""; input.dataset.i = b.dataset.i; input.click();
    });
    document.getElementById("gclose").onclick = () => closeGuide();
    document.getElementById("gsend").onclick = send;
    pg.classList.add("show");
    clearInterval(timer); tick = 0;
    timer = setInterval(() => {   // every example changes its frame once a second (5 frames x 1 s)
      tick++;
      pg.querySelectorAll(".greel").forEach(r => {
        const ims = r.querySelectorAll("img"), ds = r.querySelectorAll(".gdots i"), k = tick % ims.length;
        ims.forEach((im, i) => im.classList.toggle("on", i === k)); ds.forEach((d, i) => d.classList.toggle("on", i === k));
      });
    }, 1000);
    pg.querySelectorAll(".greel").forEach(r => { const d = r.querySelectorAll(".gdots i"); if (d[0]) d[0].classList.add("on"); });
  };
  function closeGuide() { clearInterval(timer); const pg = document.getElementById("pgGuide"); if (pg) pg.classList.remove("show"); }
  window.closeGuide = closeGuide;

  async function onFiles() {
    const input = document.getElementById("gfile"), i = +input.dataset.i, g = GUIDES[style.id], s = g.steps[i];
    let files = Array.from(input.files || []); if (!files.length) return;
    const err = document.getElementById("gerr" + i), max = limitOf(s);
    for (const f of files) {
      const len = typeof duration === "function" ? await duration(f) : 0;
      if (max && len && len > max + 1) {
        err.textContent = w().long.replace("{len}", typeof fmt === "function" ? fmt(len) : Math.round(len) + " с").replace("{max}", seconds(max));
        return;
      }
      if (app().maxBytes && f.size > app().maxBytes) { err.textContent = (typeof T !== "undefined" && T && T.app_too_big) || "Too big"; return; }
    }
    if (s.multi) {
      files = picked[i].concat(files).slice(0, s.multi[1]);
      if (files.length < s.multi[0]) { picked[i] = files; err.textContent = w().few.replace("{n}", s.multi[0]); mark(i); return; }
    } else files = files.slice(0, 1);
    err.textContent = ""; picked[i] = files; mark(i);
    if (typeof haptic === "function") haptic("light");
  }
  function mark(i) {
    const g = GUIDES[style.id], s = g.steps[i], b = document.querySelector(`#pgGuide .gup[data-i="${i}"]`), k = picked[i].length;
    const ok = s.multi ? k >= s.multi[0] : k >= 1;
    b.classList.toggle("done", ok);
    b.textContent = ok ? (s.multi ? w().okMany.replace("{k}", k) : w().ok)
                       : (s.multi && k ? `⬆ ${k}/${s.multi[0]}–${s.multi[1]}` : (s.multi ? w().upMany.replace("{n}", s.multi[0] + "–" + s.multi[1]) : w().up));
    document.getElementById("gsend").classList.toggle("ready", ready());
  }
  function ready() {
    const g = GUIDES[style.id];
    return g.steps.every((s, i) => s.multi ? picked[i].length >= s.multi[0] : picked[i].length >= 1);
  }
  function send() {
    if (!ready()) { if (typeof haptic === "function") haptic("light"); return; }
    const files = picked.flat();   // in the steps' order: the first step's video is 1.mp4
    closeGuide(); upload(files);
  }
})();
