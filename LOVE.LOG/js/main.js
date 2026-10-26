// main.js — 初期化、画面遷移、画面ごとの配線
(function () {
  "use strict";

  var D = window.LOVELOG_DATA;
  var SCREENS = ["title", "intro", "diagnosis", "mbti", "extra-diagnosis", "memory", "select", "day-transition", "game", "caretaker-fate", "story-finish", "ending", "endings", "settings"];
  var GAUGE_SCALE = 3; // ゲージの見た目の倍率(値は0〜100だが、序盤の変化が見えるよう拡大して描く)

  var returnTo = "title";   // 一覧・設定から戻る先
  var gameRoute = null;     // 育成画面で再生中のルート
  var pendingEnding = null; // ストーリー終了後、ユーザーがエンディングへ進むまで保持する
  var activeDay = null;     // ashyルートの現在日
  var pendingDayEvent = null; // 次の日の開始まで保留しているイベント
  var GLITCH_THRESHOLD = 50; // 不安定さが50を超えたら翌日の開始時にノイズ化

  function $(id) { return document.getElementById(id); }

  // ---------- 画面遷移 ----------

  function show(name) {
    if (name !== "game") {
      Dialogue.stop();
      Dialogue.clearChoices($("choices"));
    }
    SCREENS.forEach(function (s) { $("screen-" + s).hidden = s !== name; });
    document.body.dataset.screen = name;
    if (name !== "game" && name !== "ending") {
      document.body.dataset.stage = "0";
      document.body.dataset.route = "";
    }
    if (name !== "game") document.body.dataset.glitch = "false";
    if (name !== "ending") delete document.body.dataset.ending;
    var h = $("screen-" + name).querySelector("h1, h2");
    if (h && name !== "ending") h.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function applySettings() {
    var s = Save.state.settings;
    document.body.classList.toggle("reduce-motion", !!s.reduceMotion);
    $("set-speed").value = s.textSpeed;
    $("set-motion").checked = !!s.reduceMotion;
    $("set-volume").value = s.volume;
  }

  // ---------- タイトル ----------

  function showTitle() {
    var notice = $("title-notice");
    var msgs = [];
    if (!Save.available) {
      msgs.push("このブラウザでは保存機能(localStorage)が使えません。進行は保存されず、タブを閉じると失われます。");
    }
    if (Save.corrupted) {
      msgs.push("保存データが壊れていたため、初期化して新しく始められるようにしました。");
    }
    notice.textContent = msgs.join(" ");
    notice.hidden = msgs.length === 0;
    notice.classList.toggle("warn", msgs.length > 0);
    $("btn-continue").disabled = !Save.state.diagnosis.done;
    show("title");
  }

  function hasProgress() {
    var s = Save.state;
    return s.diagnosis.done || s.endings.length > 0;
  }

  function startDiagnosis() {
    show("diagnosis");
    Diagnosis.start($("diag-body"), function () { Profile.chooseMbti(function () { showSelect(); }); });
  }

  // ---------- AI選択 ----------

  function showSelect() {
    var list = $("select-list");
    list.innerHTML = "";
    var st = Save.state;

    Save.ROUTES.forEach(function (route) {
      var d = D[route];
      var ai = st.ais[route];
      var unlocked = Game.isUnlocked(route);
      var card = document.createElement("div");
      card.className = "card" + (unlocked ? "" : " locked");

      var name = document.createElement("h3");
      name.textContent = d.name;
      card.appendChild(name);

      var theme = document.createElement("p");
      theme.className = "theme";
      theme.textContent = d.theme;
      card.appendChild(theme);

      if (!unlocked) {
        var unlockNote = document.createElement("p");
        unlockNote.className = "hint";
        unlockNote.textContent = route === "ai02"
          ? "ashyのエンディングを見ると解放"
          : "ashy・brunshy両方のエンディングを見ると解放";
        card.appendChild(unlockNote);
      }

      if (ai.cleared) {
        var badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = "クリア済み";
        card.appendChild(badge);
      }

      var actions = document.createElement("div");
      actions.className = "actions";
      var inProgress = unlocked && !ai.cleared && (ai.read.length > 0 || (ai.eventId && ai.eventId !== d.start));

      if (!unlocked) {
        var lock = document.createElement("button");
        lock.type = "button"; lock.className = "btn small"; lock.disabled = true; lock.textContent = "ロック中";
        actions.appendChild(lock);
      } else if (inProgress) {
        actions.appendChild(button("つづきから", "btn small primary", function () { beginRoute(route, false); }));
        actions.appendChild(button("最初から", "btn small", function () {
          if (window.confirm(d.name + "を最初からやり直します。このルートの途中経過は消えます(到達済みエンディングの記録は残ります)。よろしいですか?")) beginRoute(route, true);
        }));
      } else if (ai.cleared) {
        actions.appendChild(button("もう一度", "btn small", function () {
          if (window.confirm(d.name + "をもう一度はじめます。(到達済みエンディングの記録は残ります)")) beginRoute(route, true);
        }));
      } else {
        actions.appendChild(button("はじめる", "btn small primary", function () { beginRoute(route, false); }));
      }
      card.appendChild(actions);
      list.appendChild(card);
    });
    show("select");
  }

  function button(label, cls, onClick) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
  }

  // ---------- 育成 ----------

  function beginRoute(route, restart) {
    if (!Game.startRoute(route, restart)) { showSelect(); return; }
    gameRoute = route;
    activeDay = null;
    pendingDayEvent = null;
    $("hud-day").hidden = true;
    $("avatar").dataset.glitchActive = "false";
    $("log").innerHTML = "";
    if (restart) delete Save.state.personalityFiles[route];
    var shouldResume = !restart && Save.state.ais[route].read.length > 0;
    Save.commit();
    function launch() {
      $("log").innerHTML = "";
      document.body.dataset.glitch = "false";
      show("game");
      playEvent(route, Save.state.ais[route].eventId, 0);
    }
    if (shouldResume || Save.state.personalityFiles[route]) launch();
    else Profile.startMemory(route, launch);
  }

  function updateHud(route) {
    var ai = Save.state.ais[route];
    var p = Game.progress(route);
    $("hud-name").textContent = D[route].name;
    $("avatar").dataset.character = route === "ai01" ? "ashy" : "placeholder";
    $("val-affinity").textContent = ai.affinity;
    $("bar-affinity").style.width = Math.min(100, ai.affinity * GAUGE_SCALE) + "%";
    if (ai.instability > 50) ai.instabilityHidden = true;
    if (ai.instabilityHidden) $("val-instability").textContent = "■■";
    else $("val-instability").textContent = ai.instability;
    $("bar-instability").style.width = Math.min(100, ai.instability * GAUGE_SCALE) + "%";
    $("hud-progress").textContent = route === "ai01" ? "選択 " + p.done + " / " + p.total : "進行 " + p.done + " / " + p.total;
    var dayEl = $("hud-day");
    dayEl.hidden = route !== "ai01" || !activeDay;
    if (route === "ai01" && activeDay) dayEl.textContent = "DAY " + String(activeDay).padStart(2, "0") + " / 07";
    document.body.dataset.route = route;
    document.body.dataset.stage = String(Game.stage(route));
  }

  function setMood(mood) {
    $("avatar").dataset.mood = mood;
    // 数値表示の異常は一時的だが、ノイズ画像はその日のセッション終了まで維持する。
    var v = $("val-instability");
    if (gameRoute && Save.state.ais[gameRoute].instability > 50) {
      Save.state.ais[gameRoute].instabilityHidden = true;
      v.textContent = "■■";
      Save.commit();
    } else if (mood === "broken" && gameRoute) {
      Save.state.ais[gameRoute].instabilityHidden = true;
      v.textContent = "■■";
      Save.commit();
    } else if (gameRoute && !Save.state.ais[gameRoute].instabilityHidden) v.textContent = Save.state.ais[gameRoute].instability;

    if (gameRoute === "ai01" && mood === "broken" && activeDay) {
      var currentAi = Save.state.ais.ai01;
      if (Number(currentAi.glitchDay || 0) !== activeDay) {
        currentAi.glitchDay = activeDay;
        Save.commit();
      }
    }
    var ai = gameRoute && Save.state.ais[gameRoute];
    var dayGlitched = gameRoute === "ai01" && !!activeDay && ai && Number(ai.glitchDay || 0) === activeDay;
    $("avatar").dataset.glitchActive = dayGlitched ? "true" : "false";
    document.body.dataset.glitch = dayGlitched ? "true" : "false";
  }

  // 日をまたぐときだけノイズを解除し、同じ日の会話中は画像を戻さない。
  function renderDayMarker(route, day) {
    if (route !== "ai01" || !day) {
      activeDay = null;
      $("hud-day").hidden = true;
      $("avatar").dataset.glitchActive = "false";
      return;
    }
    activeDay = Number(day);
    $("hud-day").hidden = false;
    $("hud-day").textContent = "DAY " + String(activeDay).padStart(2, "0") + " / 07";

    var ai = Save.state.ais.ai01;
    // 古いセーブを再開して別の日にいる場合は、前日のノイズ状態を解除する。
    if (Number(ai.glitchDay || 0) > 0 && Number(ai.glitchDay) !== activeDay) {
      ai.glitchDay = 0;
      Save.commit();
    }
    var dayGlitched = Number(ai.glitchDay || 0) === activeDay;
    $("avatar").dataset.glitchActive = dayGlitched ? "true" : "false";
    document.body.dataset.glitch = dayGlitched ? "true" : "false";
  }

  function showDayTransition(route, eventId, nextDay) {
    pendingDayEvent = { route: route, eventId: eventId, day: Number(nextDay) };
    var fromDay = activeDay || Math.max(1, Number(nextDay) - 1);
    $("day-transition-from").textContent = "DAY " + String(fromDay).padStart(2, "0") + " COMPLETE";
    $("day-transition-to").textContent = "DAY " + String(nextDay).padStart(2, "0") + " / 07";
    $("day-transition-start").textContent = "DAY " + String(nextDay).padStart(2, "0") + " を開始する";
    show("day-transition");
    // 次の日へ進む操作はプレイヤーに明示してもらう。
  }

  function playEvent(route, id, depth) {
    var ev = Game.getEvent(route, id);
    if (!ev || depth > Game.MAX_CHAIN) { failEvent(route, id); return; }

    // 日が進む瞬間は専用ページを挟み、ボタン操作で次日の会話を開始する。
    if (route === "ai01" && ev.day && activeDay !== null && Number(ev.day) > activeDay) {
      showDayTransition(route, id, Number(ev.day));
      return;
    }

    Game.enter(route, id);
    renderDayMarker(route, ev.day);
    var r = Game.resolveEvent(route, ev);
    updateHud(route);
    Dialogue.clearChoices($("choices"));

    if (!r.lines.length) { afterLines(route, ev, r, depth + 1); return; }
    Dialogue.play({
      logEl: $("log"),
      lines: r.lines,
      onMood: setMood,
      onFinish: function () { afterLines(route, ev, r, 0); }
    });
  }

  function afterLines(route, ev, r, depth) {
    if (ev.ending) {
      // 本編・育成者の結末・AI自身のエンディングを別ステップにする。
      // クリア記録はAI側のエンディングを最後まで読み終えてから確定する。
      Game.markRead(route, ev);
      pendingEnding = { route: route, endingId: ev.ending, replay: false };
      if (!showCaretakerFate(ev.ending, { replay: false })) {
        $("story-finish-route").textContent = D[route].name + " ルート";
        show("story-finish");
      }
      return;
    }

    // 重要な会話では、通常の選択肢の前にMDファイルを開く。
    // ファイル操作そのものが物語上の選択になり、保存後に会話の選択肢へ戻る。
    var mdScene = ev.mdScene || (D.mdScenes && D.mdScenes[ev.id]);
    if (mdScene && Save.state.mdScenesSeen.indexOf(mdScene.id) === -1) {
      MDStage.open(route, mdScene, function () { afterLines(route, ev, r, depth); });
      return;
    }

    if (r.choices.length) {
      Dialogue.showChoices($("choices"), r.choices, function (c) {
        var res = Game.choose(route, ev, c.id);
        updateHud(route);
        if (!res.ok || !res.nextId) { failEvent(route, res.nextId); return; }
        playEvent(route, res.nextId, 0);
      });
      return;
    }

    var next = Game.nextFor(route, ev);
    if (!next) { failEvent(route, null); return; }

    if (r.lines.length) {
      // セリフだけのイベントはボタンを挟まず、自動で次の会話へ進む。
      // 少し間を置き、上書き表示されたセリフを読む時間を確保する。
      Game.markRead(route, ev);
      window.setTimeout(function () {
        if (!document.getElementById("screen-game").hidden) playEvent(route, next, 0);
      }, 850);
    } else {
      Game.markRead(route, ev);
      playEvent(route, next, depth); // 条件分岐だけのイベントは自動で進む
    }
  }

  // 未定義のイベントIDなどでも停止させず、AI選択へ戻れるようにする
  function failEvent(route, id) {
    var p = document.createElement("p");
    p.className = "line system current";
    p.textContent = "[system] イベントデータが見つかりません" + (id ? "(" + id + ")" : "") + "。AI選択へ戻ります。";
    $("log").appendChild(p);
    var r = Game.getRoute(route);
    if (r && Save.state.ais[route]) { Save.state.ais[route].eventId = r.start; Save.commit(); }
    Dialogue.showChoices($("choices"), [{ id: "back", text: "AI選択へ戻る" }], function () { showSelect(); });
  }

  // ---------- 育成者の結末（ashyルートの専用場面） ----------

  function showCaretakerFate(endingId, opts) {
    opts = opts || {};
    var def = D.endings[endingId];
    if (!def || !def.caretakerLines || !def.caretakerLines.length) return false;

    $("caretaker-fate-route").textContent = D[def.route].name + " ルート";
    $("caretaker-fate-title").textContent = def.caretakerTitle || "育成者の結末";
    $("caretaker-fate-log").innerHTML = "";
    $("caretaker-fate-to-ending").hidden = true;
    pendingEnding = { route: def.route, endingId: endingId, replay: !!opts.replay };
    show("caretaker-fate");
    Dialogue.play({
      logEl: $("caretaker-fate-log"),
      lines: Game.resolveLines(def.caretakerLines, def.route, endingId === "END07" ? "broken" : "normal"),
      onMood: function () {},
      onFinish: function () { $("caretaker-fate-to-ending").hidden = false; }
    });
    return true;
  }

  // ---------- エンディング一覧 ----------

  function showEndingsList(from) {
    returnTo = from || returnTo;
    Endings.renderList($("endings-list"), function (id) {
      var def = D.endings[id];
      pendingEnding = { route: def.route, endingId: id, replay: true };
      if (!showCaretakerFate(id, { replay: true })) {
        show("ending");
        document.body.dataset.route = def.route;
        document.body.dataset.stage = "0";
        Endings.show(id, { replay: true });
      }
    });
    show("endings");
  }

  function backTo(name) {
    if (name === "select" && Save.state.diagnosis.done) showSelect();
    else showTitle();
  }

  // ---------- 配線 ----------

  function wire() {
    $("btn-new").addEventListener("click", function () {
      if (hasProgress() && !window.confirm("いまのセーブデータを消して、はじめからにします。よろしいですか?")) return;
      var keep = Save.state.settings; // 表示速度などの設定は「はじめから」でも引き継ぐ
      Save.reset();
      Save.state.settings = keep;
      Save.commit();
      applySettings();
      show("intro");
    });
    $("intro-start").addEventListener("click", startDiagnosis);
    $("btn-continue").addEventListener("click", function () {
      var s = Save.state;
      if (!s.diagnosis.done) { startDiagnosis(); return; }
      var r = s.currentRoute;
      if (r && Game.isUnlocked(r) && !s.ais[r].cleared && s.ais[r].read.length > 0) beginRoute(r, false);
      else showSelect();
    });
    $("btn-endings").addEventListener("click", function () { showEndingsList("title"); });
    $("btn-settings").addEventListener("click", function () { returnTo = "title"; show("settings"); });

    $("diag-back").addEventListener("click", showTitle);
    $("mbti-back").addEventListener("click", startDiagnosis);
    $("extra-back").addEventListener("click", function () { Profile.chooseMbti(function () { showSelect(); }); });
    $("memory-back").addEventListener("click", showSelect);
    $("select-back").addEventListener("click", showTitle);
    function startPendingDay() {
      if (!pendingDayEvent) return;
      var pending = pendingDayEvent;
      pendingDayEvent = null;
      if (pending.route === "ai01") {
        // 新しい日では前日のノイズを解除し、不安定さが閾値以上なら再びノイズ状態で始める。
        activeDay = pending.day;
        var ai = Save.state.ais.ai01;
        ai.glitchDay = ai.instability >= GLITCH_THRESHOLD ? activeDay : 0;
        Save.commit();
        var glitchedAtStart = Number(ai.glitchDay || 0) === activeDay;
        $("avatar").dataset.glitchActive = glitchedAtStart ? "true" : "false";
        $("avatar").dataset.mood = glitchedAtStart ? "broken" : "normal";
        document.body.dataset.glitch = glitchedAtStart ? "true" : "false";
      }
      show("game");
      playEvent(pending.route, pending.eventId, 0);
    }
    $("day-transition-start").addEventListener("click", startPendingDay);
    $("game-back").addEventListener("click", showTitle); // 進行は選択のたびに保存済み

    $("endings-back").addEventListener("click", function () { backTo(returnTo); });
    $("settings-back").addEventListener("click", function () { backTo(returnTo); });

    $("story-finish-to-ending").addEventListener("click", function () {
      if (!pendingEnding) { showSelect(); return; }
      var pending = pendingEnding;
      show("ending");
      if (pending.replay) Endings.show(pending.endingId, { replay: true });
      else Endings.reach(pending.route, pending.endingId);
    });
    $("caretaker-fate-to-ending").addEventListener("click", function () {
      if (!pendingEnding) { showSelect(); return; }
      var pending = pendingEnding;
      show("ending");
      if (pending.replay) Endings.show(pending.endingId, { replay: true });
      else Endings.reach(pending.route, pending.endingId);
    });
    $("ending-to-select").addEventListener("click", function () {
      pendingEnding = null;
      if (Save.state.diagnosis.done) showSelect(); else showTitle();
    });
    $("ending-to-list").addEventListener("click", function () {
      pendingEnding = null;
      showEndingsList("select");
    });

    // クリック/タップでセリフ送り
    $("log").addEventListener("click", function () { Dialogue.advance(); });
    $("ending-log").addEventListener("click", function () { Dialogue.advance(); });
    $("caretaker-fate-log").addEventListener("click", function () { Dialogue.advance(); });

    $("set-speed").addEventListener("change", function (e) {
      Save.state.settings.textSpeed = e.target.value; Save.commit();
    });
    $("set-motion").addEventListener("change", function (e) {
      Save.state.settings.reduceMotion = e.target.checked; Save.commit(); applySettings();
    });
    $("set-volume").addEventListener("change", function (e) {
      Save.state.settings.volume = Number(e.target.value); Save.commit();
    });
    $("btn-reset").addEventListener("click", function () {
      if (!window.confirm("セーブデータを初期化します。診断結果・進行・エンディング記録がすべて消えます。よろしいですか?")) return;
      Save.reset();
      applySettings();
      showTitle();
    });
  }

  function boot() {
    Save.init();
    Dialogue.init();
    applySettings();
    wire();
    showTitle();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
