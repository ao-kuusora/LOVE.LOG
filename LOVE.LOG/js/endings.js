// endings.js — エンディングの表示と一覧
(function () {
  "use strict";

  var D = window.LOVELOG_DATA;
  var ORDER = ["END01", "END06", "END07", "END02", "END03", "END04", "END05"];

  // エンディングを再生する。replay=true の場合はクリア記録を変更しない。
  function show(endingId, opts) {
    opts = opts || {};
    var def = D.endings[endingId];
    var titleEl = document.getElementById("ending-title");
    var noEl = document.getElementById("ending-no");
    var logEl = document.getElementById("ending-log");
    var actions = document.getElementById("ending-actions");
    var notice = document.getElementById("ending-notice");
    var complete = document.getElementById("ending-complete");
    var endingScreen = document.getElementById("screen-ending");
    var corruptedArt = document.getElementById("ending-corrupted-art");
    var isCorruptedEnding = endingId === "END07";
    if (endingScreen) endingScreen.classList.toggle("ending-corrupted", isCorruptedEnding);
    if (corruptedArt) corruptedArt.hidden = !isCorruptedEnding;

    actions.hidden = true;
    notice.hidden = true;
    notice.textContent = "";
    complete.hidden = true;
    complete.textContent = "";
    logEl.innerHTML = "";
    if (!def) {
      noEl.textContent = "";
      titleEl.textContent = "データがありません";
      actions.hidden = false;
      return;
    }
    noEl.textContent = "END " + String(def.no).padStart(2, "0");
    titleEl.textContent = "「" + def.title + "」";
    document.body.dataset.ending = endingId;
    document.body.dataset.route = def.route;
    document.body.dataset.stage = "0";

    var lines = Game.resolveLines(def.lines, def.route, endingId === "END05" ? "broken" : "soft");
    Dialogue.play({
      logEl: logEl,
      lines: lines,
      onMood: function () {},
      onFinish: function () {
        var newlyUnlocked = opts.newlyUnlocked || [];
        // 初回プレイではエンディング本文を最後まで読んだ時点で初めてクリアを記録する。
        // 一覧からの読み返し(opts.replay)は記録や解放条件を変更しない。
        if (!opts.replay && opts.route) {
          var result = Game.reachEnding(opts.route, endingId);
          newlyUnlocked = result.newlyUnlocked || [];
          complete.textContent = "END " + String(def.no).padStart(2, "0") + " COMPLETE  /  このルートは終了しました。";
        } else {
          complete.textContent = "END " + String(def.no).padStart(2, "0") + "  /  読み返し完了";
        }
        complete.hidden = false;
        if (newlyUnlocked.length) {
          var names = newlyUnlocked.map(function (r) { return D[r].name; }).join("、");
          notice.textContent = "新しいAI「" + names + "」が解放されました。";
          notice.hidden = false;
        }
        actions.hidden = false;
        var first = actions.querySelector("button");
        if (first) first.focus();
      }
    });
  }

  // エンディング画面を再生する。クリア記録・解放・保存は本文の再生完了後に行う。
  function reach(route, endingId) {
    show(endingId, { route: route });
  }

  function renderList(container, onView) {
    container.innerHTML = "";
    var reached = Save.state.endings;
    ORDER.forEach(function (id) {
      var def = D.endings[id];
      var ok = reached.indexOf(id) !== -1;
      var card = document.createElement("div");
      card.className = "ending-card" + (ok ? " reached" : " locked");

      var no = document.createElement("p");
      no.className = "ending-card-no";
      no.textContent = "END " + String(def.no).padStart(2, "0");

      var title = document.createElement("h3");
      title.textContent = ok ? def.title : "？？？？";

      var who = document.createElement("p");
      who.className = "ending-card-who";
      who.textContent = ok ? D[def.route].name : "未到達";

      card.appendChild(no);
      card.appendChild(title);
      card.appendChild(who);
      if (ok) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "btn small";
        b.textContent = "読み返す";
        b.addEventListener("click", function () { onView(id); });
        card.appendChild(b);
      }
      container.appendChild(card);
    });
    var count = document.getElementById("endings-count");
    if (count) count.textContent = reached.length + " / " + ORDER.length + " 到達";
  }

  window.Endings = { show: show, reach: reach, renderList: renderList };
})();
