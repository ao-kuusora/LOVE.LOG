// save.js — localStorage への保存・復元・初期化(仕様書 9章)
// 本作が使うキーは KEY のみ。初期化でもこのキーだけを削除する。
(function () {
  "use strict";

  var KEY = "lovelog.save.v1";
  var ROUTES = ["ai01", "ai02", "ai03"];
  var SPEEDS = ["slow", "normal", "fast", "instant"];

  var available = true;
  var corrupted = false;
  var state = null;

  function checkStorage() {
    try {
      var k = "lovelog.__probe";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  function defaultAi() {
    return { affinity: 0, instability: 0, eventId: null, read: [], cleared: false, glitchDay: 0, instabilityHidden: false };
  }

  function defaultState() {
    return {
      version: 1,
      diagnosis: { done: false, initialDone: false, answers: [null, null, null, null], scores: { trust: 0, need: 0, control: 0 }, mbti: null, extraAnswers: [], extraTags: [], extraDone: false },
      ais: { ai01: defaultAi(), ai02: defaultAi(), ai03: defaultAi() },
      unlocked: ["ai01"],
      currentRoute: null,
      choiceHistory: [],
      personalityFiles: {},
      mdDocuments: {},
      mdScenesSeen: [],
      endings: [],
      settings: { textSpeed: "normal", reduceMotion: false, volume: 50 }
    };
  }

  function clamp(n, lo, hi) {
    n = Number(n);
    if (!isFinite(n)) return lo;
    return Math.min(hi, Math.max(lo, n));
  }

  function strArray(a) {
    if (!Array.isArray(a)) return [];
    return a.filter(function (x) { return typeof x === "string"; });
  }

  // 保存データを検証しつつ既定値へ合流させる。不正な値は既定値に戻す。
  function sanitize(raw) {
    var d = defaultState();
    if (!raw || typeof raw !== "object") throw new Error("invalid");

    if (raw.diagnosis && typeof raw.diagnosis === "object") {
      var rd = raw.diagnosis;
      d.diagnosis.done = rd.done === true;
      d.diagnosis.initialDone = rd.initialDone === true || rd.done === true;
      if (Array.isArray(rd.answers)) {
        d.diagnosis.answers = [0, 1, 2, 3].map(function (i) {
          var v = rd.answers[i];
          return v === "A" || v === "B" || v === "C" ? v : null;
        });
      }
      if (rd.scores && typeof rd.scores === "object") {
        ["trust", "need", "control"].forEach(function (k) {
          d.diagnosis.scores[k] = clamp(rd.scores[k], 0, 4);
        });
      }
      if (typeof rd.mbti === "string" && /^[IE][NS][FT][JP]$/.test(rd.mbti)) d.diagnosis.mbti = rd.mbti;
      if (Array.isArray(rd.extraAnswers)) d.diagnosis.extraAnswers = rd.extraAnswers.filter(function (v) { return v === "A" || v === "B" || v === "C"; }).slice(0, 3);
      d.diagnosis.extraTags = strArray(rd.extraTags);
      d.diagnosis.extraDone = rd.extraDone === true && d.diagnosis.extraAnswers.length === 3;
      // 回答が揃っていないのに完了扱いのデータは未完了へ戻す
      if (d.diagnosis.done && d.diagnosis.answers.indexOf(null) !== -1) d.diagnosis.done = false;
      if (d.diagnosis.done && (!d.diagnosis.mbti || !d.diagnosis.extraDone)) d.diagnosis.done = false;
    }

    if (raw.ais && typeof raw.ais === "object") {
      ROUTES.forEach(function (r) {
        var a = raw.ais[r];
        if (!a || typeof a !== "object") return;
        d.ais[r].affinity = clamp(a.affinity, 0, 100);
        d.ais[r].instability = clamp(a.instability, 0, 100);
        d.ais[r].eventId = typeof a.eventId === "string" ? a.eventId : null;
        d.ais[r].read = strArray(a.read);
        d.ais[r].cleared = a.cleared === true;
        d.ais[r].glitchDay = clamp(a.glitchDay, 0, 7);
        d.ais[r].instabilityHidden = a.instabilityHidden === true;
      });
    }

    d.unlocked = strArray(raw.unlocked).filter(function (r) { return ROUTES.indexOf(r) !== -1; });
    if (d.unlocked.indexOf("ai01") === -1) d.unlocked.unshift("ai01");

    d.currentRoute = ROUTES.indexOf(raw.currentRoute) !== -1 ? raw.currentRoute : null;

    if (Array.isArray(raw.choiceHistory)) {
      d.choiceHistory = raw.choiceHistory.filter(function (h) {
        return h && typeof h === "object" && ROUTES.indexOf(h.route) !== -1 && typeof h.choiceId === "string";
      }).map(function (h) {
        return { route: h.route, eventId: String(h.eventId || ""), choiceId: h.choiceId, tags: strArray(h.tags) };
      });
    }

    if (raw.personalityFiles && typeof raw.personalityFiles === "object") {
      ROUTES.forEach(function (r) {
        var selected = raw.personalityFiles[r];
        if (typeof selected === "string") d.personalityFiles[r] = selected;
      });
    }
    if (raw.mdDocuments && typeof raw.mdDocuments === "object") {
      Object.keys(raw.mdDocuments).slice(0, 12).forEach(function (k) {
        if (/^[a-z0-9_./-]+\.md$/i.test(k) && typeof raw.mdDocuments[k] === "string") d.mdDocuments[k] = raw.mdDocuments[k].slice(0, 12000);
      });
    }
    d.mdScenesSeen = strArray(raw.mdScenesSeen).slice(0, 100);
    d.endings = strArray(raw.endings);

    if (raw.settings && typeof raw.settings === "object") {
      if (SPEEDS.indexOf(raw.settings.textSpeed) !== -1) d.settings.textSpeed = raw.settings.textSpeed;
      d.settings.reduceMotion = raw.settings.reduceMotion === true;
      d.settings.volume = clamp(raw.settings.volume, 0, 100);
    }
    return d;
  }

  function init() {
    available = checkStorage();
    corrupted = false;
    state = defaultState();
    if (!available) return state;
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) state = sanitize(JSON.parse(raw));
    } catch (e) {
      // 破損データ: 本作のキーだけを消して新規状態で開始する
      corrupted = true;
      state = defaultState();
      try { window.localStorage.removeItem(KEY); } catch (e2) { /* ignore */ }
    }
    return state;
  }

  function commit() {
    if (!available) return false;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      available = false; // 容量超過など。以降は保存できないことをUIに伝える
      return false;
    }
  }

  function reset() {
    if (available) {
      try { window.localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    }
    state = defaultState();
    return state;
  }

  window.Save = {
    ROUTES: ROUTES,
    init: init,
    commit: commit,
    reset: reset,
    get state() { return state; },
    get available() { return available; },
    get corrupted() { return corrupted; },
    defaultAi: defaultAi,
    _sanitize: sanitize // テスト用
  };
})();
