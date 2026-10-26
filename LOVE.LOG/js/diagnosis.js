// diagnosis.js — 性格診断の表示とスコア計算(仕様書 4章)
(function () {
  "use strict";

  var D = window.LOVELOG_DATA;

  // 回答配列(["A","C",...])から trust / need / control を計算する
  function compute(answers) {
    var scores = { trust: 0, need: 0, control: 0 };
    (answers || []).forEach(function (key) {
      var target = D.diagnosis.scoreMap[key];
      if (target) scores[target] += 1;
    });
    return scores;
  }

  // container 内に診断を描画する。完了時に onDone を呼ぶ。
  function start(container, onDone) {
    var qs = D.diagnosis.questions;
    var answers = [];
    var index = 0;
    var locked = false;

    function render() {
      var q = qs[index];
      locked = false;
      container.innerHTML = "";

      var meta = document.createElement("p");
      meta.className = "diag-meta";
      meta.textContent = "Q" + (index + 1) + " / " + qs.length;

      var title = document.createElement("h2");
      title.className = "diag-q";
      title.textContent = q.text;
      title.tabIndex = -1;

      var list = document.createElement("div");
      list.className = "choices";
      list.setAttribute("role", "group");
      list.setAttribute("aria-label", "回答の選択肢");

      q.choices.forEach(function (c, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "choice";
        b.innerHTML = '<span class="choice-key">' + c.key + "</span>";
        var span = document.createElement("span");
        span.textContent = c.text;
        b.appendChild(span);
        b.addEventListener("click", function () { pick(c.key); });
        list.appendChild(b);
      });

      container.appendChild(meta);
      container.appendChild(title);
      container.appendChild(list);
      title.focus();
    }

    function pick(key) {
      if (locked) return; // 連続クリックの二重処理を防ぐ
      locked = true;
      answers.push(key);
      index += 1;
      if (index < qs.length) {
        render();
      } else {
        finish();
      }
    }

    function finish() {
      var st = Save.state;
      st.diagnosis.answers = answers.slice();
      st.diagnosis.scores = compute(answers);
      st.diagnosis.initialDone = true;
      st.diagnosis.done = false;
      Save.commit();
      onDone();
    }

    // 数字キーでも回答できる(診断画面が表示中のときだけ)
    function onKey(e) {
      if (!container.offsetParent) return;
      var n = Number(e.key);
      if (n >= 1 && n <= 3) {
        var btns = container.querySelectorAll(".choice");
        if (btns[n - 1]) btns[n - 1].click();
      }
    }
    document.removeEventListener("keydown", start._keyHandler || function () {});
    start._keyHandler = onKey;
    document.addEventListener("keydown", onKey);

    render();
  }

  window.Diagnosis = { compute: compute, start: start };
})();
