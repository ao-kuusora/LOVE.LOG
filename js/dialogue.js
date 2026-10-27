// dialogue.js — セリフ(タイプ表示)と選択肢の表示
(function () {
  "use strict";

  var SPEED_MS = { slow: 70, normal: 35, fast: 14, instant: 0 };

  var current = null;      // 再生中のセリフ制御
  var choiceState = null;  // 表示中の選択肢
  var streamLocked = false;
  var inputLocked = false;
  var streamOverlay = null;

  function settings() { return Save.state.settings; }

  // lines: [{text, mood}] を順に表示する。最終行の表示後に onFinish を呼ぶ。
  function play(opts) {
    stop();
    var logEl = opts.logEl;
    var lines = opts.lines || [];
    var i = 0;
    var timer = null;
    var typing = false;
    var waiting = false;
    var cur = null;
    var full = "";
    var stalled = false;
    var preserveLineStart = false;
    inputLocked = opts.lockInput === true;
    var streamTimer = null;

    var ctl = {
      cancelled: false,
      advance: advance
    };
    current = ctl;

    function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } if (streamTimer) { clearTimeout(streamTimer); streamTimer = null; } }

    function indicator(show) {
      var old = logEl.querySelector(".more");
      if (old) old.remove();
      if (show && cur) {
        var m = document.createElement("span");
        m.className = "more";
        m.setAttribute("aria-hidden", "true");
        m.textContent = "▼";
        cur.appendChild(m);
      }
    }

    function randomCipher(n) {
      var chars = "0123456789ABCDEF▓▒░#%&@$!?<>/\\|{}[]";
      var out = "";
      for (var j = 0; j < n; j++) out += chars.charAt(Math.floor(Math.random() * chars.length));
      return out;
    }

    function ensureStreamOverlay() {
      if (streamOverlay) return streamOverlay;
      streamOverlay = document.createElement("div");
      streamOverlay.className = "glitch-flash-overlay";
      streamOverlay.setAttribute("aria-hidden", "true");
      streamOverlay.innerHTML = '<div class="glitch-flash-code"></div><img src="assets/characters/ashy-corrupted.png" alt="">';
      document.body.appendChild(streamOverlay);
      return streamOverlay;
    }

    function runGlitchStream() {
      streamLocked = true;
      var choices = document.getElementById("choices");
      if (choices) choices.innerHTML = "";
      var lines = full.split("\n");
      var index = 0;
      var overlay = ensureStreamOverlay();
      var code = overlay.querySelector(".glitch-flash-code");
      cur.textContent = "";
      cur.classList.add("glitch-streaming");
      function tick() {
        if (ctl.cancelled) { streamLocked = false; overlay.classList.remove("show-code", "show-image"); return; }
        var end = Math.min(lines.length, index + 50);
        cur.textContent = lines.slice(index, end).join("\n");
        index = end;
        logEl.scrollTop = logEl.scrollHeight;
        // 数ブロックごとに暗号文字列、さらに時折ashyの破損画像を一瞬だけ挿入
        if (Math.random() < 0.34) {
          code.textContent = randomCipher(256);
          overlay.classList.remove("show-image");
          overlay.classList.add("show-code");
          streamTimer = setTimeout(function () { overlay.classList.remove("show-code"); }, 95);
        } else if (Math.random() < 0.16) {
          overlay.classList.remove("show-code");
          overlay.classList.add("show-image");
          streamTimer = setTimeout(function () { overlay.classList.remove("show-image"); }, 75);
        }
        if (index < lines.length) streamTimer = setTimeout(tick, 42);
        else {
          streamLocked = false;
          overlay.classList.remove("show-code", "show-image");
          waiting = false;
          indicator(false);
          opts.onFinish && opts.onFinish();
        }
      }
      tick();
    }

    function nextLine() {
      if (ctl.cancelled) return;
      if (i >= lines.length) { opts.onFinish && opts.onFinish(); return; }
      var line = lines[i++];
      full = line.text;
      preserveLineStart = line.preserveStart === true;
      stalled = false;

      // 会話は履歴を積み上げず、1発話ごとに表示欄を上書きする。
      // ただし巨大なホラーログ自体は1つの発話なので、その内容は保持する。
      logEl.innerHTML = "";
      cur = document.createElement("p");
      cur.className = "line mood-" + (line.mood || "normal");
      if (/^\[system\]/.test(full)) cur.classList.add("system");
      if (line.className) String(line.className).split(/\s+/).forEach(function (name) { if (name) cur.classList.add(name); });
      logEl.querySelectorAll(".line.current").forEach(function (p) { p.classList.remove("current"); });
      cur.classList.add("current");
      logEl.appendChild(cur);
      logEl.scrollTop = logEl.scrollHeight;
      opts.onMood && opts.onMood(line.mood || "normal");

      var speed = SPEED_MS[settings().textSpeed];
      if (speed === undefined) speed = SPEED_MS.normal;

      if (line.className && String(line.className).split(/\s+/).indexOf("glitch-dump") !== -1) { runGlitchStream(); return; }
      if (inputLocked) {
        cur.textContent = full;
        logEl.scrollTop = logEl.scrollHeight;
        typing = false;
        timer = setTimeout(function lockedLineAdvance() {
          if (ctl.cancelled) return;
          if (i < lines.length) nextLine();
          else { waiting = false; indicator(false); opts.onFinish && opts.onFinish(); }
        }, line.mood === "broken" ? 1150 : 850);
        return;
      }
      if (speed === 0 || line.instant) { cur.textContent = full; lineDone(); return; }

      typing = true;
      var pos = 0;
      // 不穏なセリフでは、途中で一瞬だけ表示が止まる(動きを抑える設定では行わない)
      var stallAt = (!settings().reduceMotion && (line.mood === "uneasy" || line.mood === "broken") && full.length > 8)
        ? 3 + Math.floor(Math.random() * (full.length - 6)) : -1;

      (function tick() {
        if (ctl.cancelled) return;
        pos += 1;
        cur.textContent = full.slice(0, pos);
        logEl.scrollTop = logEl.scrollHeight;
        if (pos >= full.length) { typing = false; lineDone(); return; }
        var d = speed;
        if (pos === stallAt && !stalled) { stalled = true; d = 520; }
        timer = setTimeout(tick, d);
      })();
    }

    function lineDone() {
      typing = false;
      if (preserveLineStart && cur) {
        // 巨大な破損ログは先頭から見せ、全文はログ欄内をスクロールして読めるようにする。
        cur.scrollIntoView({ block: "start", behavior: "auto" });
      } else {
        logEl.scrollTop = logEl.scrollHeight; // 最新行が切れないように末尾へ
      }
      if (i >= lines.length) {
        indicator(false);
        opts.onFinish && opts.onFinish();
      } else {
        waiting = true;
        indicator(true);
        logEl.scrollTop = logEl.scrollHeight;
      }
    }

    function advance() {
      if (ctl.cancelled || streamLocked || inputLocked) return;
      if (typing) { // タイプ中に押されたら全文を即表示
        clearTimer();
        cur.textContent = full;
        typing = false;
        lineDone();
        return;
      }
      if (waiting) {
        waiting = false;
        indicator(false);
        nextLine();
      }
    }

    nextLine();
    return ctl;
  }

  function stop() {
    streamLocked = false;
    inputLocked = false;
    if (streamOverlay) streamOverlay.classList.remove("show-code", "show-image");
    if (current) current.cancelled = true;
    current = null;
  }

  // 選択肢ボタンを表示する。1つ選ぶと残りは無効化され、二重処理を防ぐ。
  function showChoices(el, choices, onPick) {
    clearChoices(el);
    var locked = false;
    choiceState = { el: el };
    choices.forEach(function (c, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "choice";
      b.dataset.id = c.id;
      var k = document.createElement("span");
      k.className = "choice-key";
      k.textContent = String(i + 1);
      var t = document.createElement("span");
      t.textContent = c.text;
      b.appendChild(k);
      b.appendChild(t);
      b.addEventListener("click", function () {
        if (locked) return;
        locked = true;
        el.querySelectorAll(".choice").forEach(function (x) { x.disabled = true; });
        b.classList.add("picked");
        onPick(c);
      });
      el.appendChild(b);
    });
    var first = el.querySelector(".choice");
    if (first) first.focus({ preventScroll: false });
  }

  function clearChoices(el) {
    el.innerHTML = "";
    choiceState = null;
  }

  // キーボード操作: Enter/Space/→でセリフ送り、1〜9で選択肢
  function init() {
    document.addEventListener("keydown", function (e) {
      var tag = e.target && e.target.tagName;
      if (choiceState && /^[1-9]$/.test(e.key)) {
        var btn = choiceState.el.querySelectorAll(".choice:not([disabled])")[Number(e.key) - 1];
        if (btn) { e.preventDefault(); btn.click(); }
        return;
      }
      if (streamLocked || inputLocked) { e.preventDefault(); e.stopPropagation(); return; }
      if (current && (e.key === "Enter" || e.key === " " || e.key === "ArrowRight")) {
        if (tag === "BUTTON" && !(e.target.classList && e.target.classList.contains("log"))) return;
        e.preventDefault();
        current.advance();
      }
    });
  }

  // ログ欄のクリック・タップでセリフ送りするための入口
  function advance() { if (current) current.advance(); }
  function isLocked() { return streamLocked || inputLocked; }

  window.Dialogue = { play: play, stop: stop, advance: advance, isLocked: isLocked, showChoices: showChoices, clearChoices: clearChoices, init: init };
})();
