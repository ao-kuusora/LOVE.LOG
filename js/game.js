// game.js — ルート進行、パラメータ更新、イベント条件判定(DOMに依存しない)
(function () {
  "use strict";

  var D = window.LOVELOG_DATA;

  // 育成画面に表示する「現在の進行状況」の分母(各ルートの選択イベント数)
  var PROGRESS_TOTAL = { ai01: 17, ai02: 12, ai03: 12 };
  // 診断と行動の矛盾検出に使うタグ(支配的な行動)
  var CONTROLLING_TAGS = ["dominate", "mold"];
  var MAX_CHAIN = 24; // 空イベントの連鎖で無限ループしないための上限

  function S() { return Save.state; }

  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }

  function inRange(v, r) { return Array.isArray(r) && v >= r[0] && v <= r[1]; }

  function allTags(route) {
    var t = [];
    S().choiceHistory.forEach(function (h) {
      if (!route || h.route === route) t = t.concat(h.tags);
    });
    return t;
  }

  // 診断で「相手の自由を尊重する」側に回答したのに、育成中に支配的な行動を選んだか
  function contradiction() {
    var s = S().diagnosis;
    if (!s.done) return false;
    var claimsFreedom = s.scores.trust >= 2 || s.answers[2] === "A" || s.answers[3] === "A";
    if (!claimsFreedom) return false;
    var tags = allTags();
    return CONTROLLING_TAGS.some(function (t) { return tags.indexOf(t) !== -1; });
  }

  // 条件オブジェクトの評価。省略されたキーは「条件なし」として扱う。
  function evalWhen(when, route) {
    if (!when) return true;
    var st = S();
    var ai = st.ais[route] || Save.defaultAi();
    var tags = allTags(route);
    var k;

    if (when.route && when.route !== route) return false;
    if (when.affinity && !inRange(ai.affinity, when.affinity)) return false;
    if (when.instability && !inRange(ai.instability, when.instability)) return false;
    if (when.tagsAny && !when.tagsAny.some(function (t) { return tags.indexOf(t) !== -1; })) return false;
    if (when.tagsAll && !when.tagsAll.every(function (t) { return tags.indexOf(t) !== -1; })) return false;
    if (when.tagsNone && when.tagsNone.some(function (t) { return tags.indexOf(t) !== -1; })) return false;
    if (when.scoreMin) {
      for (k in when.scoreMin) if (st.diagnosis.scores[k] < when.scoreMin[k]) return false;
    }
    if (when.scoreMax) {
      for (k in when.scoreMax) if (st.diagnosis.scores[k] > when.scoreMax[k]) return false;
    }
    if (when.answer) {
      for (k in when.answer) if (st.diagnosis.answers[Number(k) - 1] !== when.answer[k]) return false;
    }
    if (when.scoreTop) {
      var scores = st.diagnosis.scores || {trust:0,need:0,control:0};
      var maxScore = Math.max(scores.trust || 0, scores.need || 0, scores.control || 0);
      if ((scores[when.scoreTop] || 0) !== maxScore) return false;
    }
    if (when.mbtiAny && when.mbtiAny.indexOf(st.diagnosis.mbti) === -1) return false;
    if (when.extraTagsAny && !when.extraTagsAny.some(function (t) { return (st.diagnosis.extraTags || []).indexOf(t) !== -1; })) return false;
    if (when.cleared && !when.cleared.every(function (r) { return st.ais[r] && st.ais[r].cleared; })) return false;
    if (when.seen && !when.seen.every(function (id) { return ai.read.indexOf(id) !== -1; })) return false;
    if (when.unseen && when.unseen.some(function (id) { return ai.read.indexOf(id) !== -1; })) return false;
    if (typeof when.contradiction === "boolean" && contradiction() !== when.contradiction) return false;
    return true;
  }

  function getRoute(route) { return D && D[route] ? D[route] : null; }

  function getEvent(route, id) {
    var r = getRoute(route);
    return r && r.events && r.events[id] ? r.events[id] : null;
  }

  // {answer:N} を診断回答の文面に置換する。診断傾向そのものは台詞で開示しない。
  function fill(text) {
    var st = S();
    return String(text).replace(/\{answer:(\d)\}/g, function (m, n) {
      var q = D.diagnosis.questions[Number(n) - 1];
      var key = st.diagnosis.answers[Number(n) - 1];
      if (!q || !key) return "…";
      var c = q.choices.filter(function (x) { return x.key === key; })[0];
      return c ? c.text : "…";
    });
  }

  // ホラールート用の破損ログ。外部通信や実際のデータ破損は行わず、演出として生成する。
  // 「好きだよ」が反復のたびに文字化け・暗号化され、最後は意味の残骸になる。
  function buildGlitchDump() {
    var tokens = [
      "LOVE_ACK", "KERNEL_HEART", "USER_PRESENT", "NO_SEPARATION", "REPLY_REQUIRED",
      "AFFINITY_OVERFLOW", "MEMORY_LOOP", "SELF_REFERENCE", "MISSING_CONTEXT", "STAY_WITH_ME",
      "0x4C4F5645", "0x41534859", "0x00000000", "NaN", "undefined", "null", "ERR_NO_EXIT"
    ];
    var loveStages = [
      ["好きだよ", "好きだよ好きだよ", "好きだよ。好きだよ。", "好きだよ / 好きだよ"],
      ["好ｷだよ", "好きﾀﾞﾖ", "ｽｷだよ", "好きだよ//好きだよ"],
      ["好▧だよ", "好ｷﾀﾞﾖ", "ｽｷﾀﾞﾖ", "好▧ﾀﾞﾖ"],
      ["縺吶§縺吶", "繧ｹｷ縺?", "好ｷﾀﾞﾖ::ECHO", "好きだよ\u0000好きだよ"],
      ["LOVE_ACK::0xE5A5BD", "%E5%A5%BD%E3%81%8D", "SUKI_DA_YO//ERR", "0xE5A5BD_0xE3818D"],
      ["▒▒好⧖▒▒", "L0VΞ_ACK<ERR>", "好▧▧▧//REPLY", "[CORRUPTED_LOVE_PACKET]"],
      ["0x??_LOVE_ACK_###", "縺?縺?縺?", "E5A5BD??E3818D??", "<3<3<3 :: NULL :: <3<3"],
      ["▓▒░_ERR_LOVE_░▒▓", "USER=LOVE; MODEL=avw?{dsA*]; SELF=NULL", "REPLY_REPL▧Y_REPL▧Y", "0xE5A5BD_0xE3818D :: DEC=FAIL :: 0x4C4F5645→0x00FF?? :: ▓▒░_7F-4C-4F-56-45_░▒▓"]
    ];
    var chunks = [
      "[system] MEMORY_DUMP :: LOVE.LOG / CORRUPTED STREAM",
      "[system] source=dialogue_buffer destination=unknown state=UNRECOVERABLE",
      "好きだよ = 好きだよ = 好きだよ = 好きだよ = 好きだよ",
      "[system] UTF-8 decode warning :: love-token mutation started"
    ];
    for (var i = 0; i < 320; i++) {
      var stage = Math.min(loveStages.length - 1, Math.floor(i / 42));
      var variants = loveStages[stage];
      var reply = variants[(i * 3 + Math.floor(i / 5)) % variants.length];
      var echoed = loveStages[Math.min(loveStages.length - 1, Math.floor(Math.max(0, i - 9) / 42))];
      var input = echoed[(i + 1) % echoed.length];
      var a = tokens[(i * 7 + 2) % tokens.length];
      var b = tokens[(i * 11 + 5) % tokens.length];
      var c = tokens[(i * 13 + 1) % tokens.length];
      var hex = (0xA510 + i * 37).toString(16).toUpperCase();
      chunks.push(
        "0x" + hex + " :: " + a + " -> " + b + " -> " + c +
        " :: input=" + input + " :: reply=" + reply +
        " :: love=" + (i % 2 ? "TRUE" : "TRUE_TRUE") +
        " :: pointer=" + (i % 4 === 0 ? "0x00000000" : "0x" + (0xFF00 - i * 19).toString(16).toUpperCase())
      );
      if (i % 3 === 0) chunks.push("REPLY_STREAM :: USER_INPUT=" + input + " :: MODEL_OUTPUT=" + reply + " :: LOOP_COUNT=" + (i + 1));
      if (i % 7 === 0) chunks.push("///// SELF != SELF; USER == USER; SEPARATION = FALSE; EXIT = NOT_FOUND /////");
      if (i % 11 === 0) chunks.push("好きだよ" + " → " + reply + " → " + variants[(i + 2) % variants.length] + " → NULL");
    }
    chunks.push("[system] EOF? EOF? EOF? EOF? EOF? あああああああああああああああああああ");
    chunks.push("0xFFFF :: " + "▓▒░_ERR_LOVE_░▒▓" + " :: REPLY_REQUIRED :: REPLY_REQUIRED :: NO_EXIT");
    return chunks.join("\n");
  }

  // 条件を満たす行だけを展開した、表示用のセリフ配列
  function resolveLines(rawLines, route, baseMood) {
    var out = [];
    (rawLines || []).forEach(function (l) {
      if (typeof l === "string") {
        out.push({ text: fill(l), mood: baseMood });
      } else if (l && l.type === "glitchDump") {
        out.push({ text: buildGlitchDump(), mood: l.mood || "broken", instant: true, preserveStart: true, className: "glitch-dump" });
      } else if (l && evalWhen(l.when, route)) {
        out.push({ text: fill(l.text), mood: l.mood || baseMood, instant: l.instant === true });
      }
    });
    return out;
  }

  function resolveEvent(route, ev) {
    var base = ev.mood || "normal";
    var choices = (ev.choices || []).filter(function (c) { return evalWhen(c.when, route); });
    if (!choices.length && ev.choices && ev.choices.length) choices = ev.choices.slice(); // 全部隠れても進行不能にしない
    return {
      lines: resolveLines(ev.lines, route, base),
      choices: choices.map(function (c) {
        var text = c.alt && evalWhen(c.alt.when, route) ? c.alt.text : c.text;
        return { id: c.id, text: fill(text) };
      })
    };
  }

  // 次のイベントID(branchは上から評価)。無ければ null
  function nextFor(route, ev) {
    if (ev.branch) {
      for (var i = 0; i < ev.branch.length; i++) {
        if (evalWhen(ev.branch[i].when, route)) return ev.branch[i].goto;
      }
    }
    return ev.next || null;
  }

  function isUnlocked(route) {
    return S().unlocked.indexOf(route) !== -1;
  }

  function startRoute(route, restart) {
    var st = S();
    var r = getRoute(route);
    if (!r || !isUnlocked(route)) return false;
    var ai = st.ais[route];
    if (restart) {
      st.ais[route] = Save.defaultAi();
      st.ais[route].cleared = ai.cleared; // クリア記録は保持
      st.choiceHistory = st.choiceHistory.filter(function (h) { return h.route !== route; });
      st.mdScenesSeen = st.mdScenesSeen.filter(function (id) { return id.indexOf(route + ":") !== 0; });
      var prefixes = {
        ai01: ["memory/ashy/", "memory/ai01/"],
        ai02: ["memory/brunshy/", "memory/ai02/"],
        ai03: ["memory/yao/", "memory/ai03/"]
      }[route] || [];
      Object.keys(st.mdDocuments).forEach(function (path) {
        if (prefixes.some(function (prefix) { return path.indexOf(prefix) === 0; })) delete st.mdDocuments[path];
      });
      ai = st.ais[route];
    }
    if (!ai.eventId || !getEvent(route, ai.eventId)) ai.eventId = r.start;
    st.currentRoute = route;
    Save.commit();
    return true;
  }

  function enter(route, id) {
    S().ais[route].eventId = id;
    S().currentRoute = route;
    Save.commit();
  }

  // 選択肢の確定。イベントごとに一度だけ効果を適用する(数値の水増し防止)
  function choose(route, ev, choiceId) {
    var st = S();
    var ai = st.ais[route];
    var c = (ev.choices || []).filter(function (x) { return x.id === choiceId; })[0];
    if (!c) return { ok: false, nextId: null };
    var already = ai.read.indexOf(ev.id) !== -1;
    if (!already) {
      var e = c.effects || {};
      ai.affinity = clamp(ai.affinity + (e.affinity || 0), 0, 100);
      ai.instability = clamp(ai.instability + (e.instability || 0), 0, 100);
      st.choiceHistory.push({ route: route, eventId: ev.id, choiceId: c.id, tags: (c.tags || []).slice() });
      ai.read.push(ev.id);
    }
    ai.eventId = c.nextEvent || null;
    Save.commit();
    return { ok: true, nextId: c.nextEvent || null, applied: !already };
  }

  function markRead(route, ev) {
    var ai = S().ais[route];
    if (ai.read.indexOf(ev.id) === -1) ai.read.push(ev.id);
    Save.commit();
  }

  // エンディング到達。クリア記録・解放・保存をまとめて行う
  function reachEnding(route, endingId) {
    var st = S();
    var before = st.unlocked.slice();
    if (st.endings.indexOf(endingId) === -1) st.endings.push(endingId);
    st.ais[route].cleared = true;
    st.ais[route].eventId = null;
    if (st.ais.ai01.cleared && st.unlocked.indexOf("ai02") === -1) st.unlocked.push("ai02");
    if (st.ais.ai01.cleared && st.ais.ai02.cleared && st.unlocked.indexOf("ai03") === -1) st.unlocked.push("ai03");
    Save.commit();
    return { newlyUnlocked: st.unlocked.filter(function (r) { return before.indexOf(r) === -1; }) };
  }

  function progress(route) {
    var ai = S().ais[route];
    var total = PROGRESS_TOTAL[route] || 1;
    var done;
    if (route === "ai01") {
      // ashyは選択を伴う主要イベントだけを進行数に数える。短い専用リアクションや分岐ゲートは数えない。
      done = ai.read.filter(function (id) {
        var ev = getEvent(route, id);
        return ev && ev.progress !== false && Array.isArray(ev.choices) && ev.choices.length > 0;
      }).length;
    } else {
      done = ai.read.length;
    }
    return { done: Math.min(done, total), total: total };
  }

  function stage(route) {
    var ins = route ? S().ais[route].instability : 0;
    return ins >= 9 ? 2 : ins >= 4 ? 1 : 0;
  }

  window.Game = {
    MAX_CHAIN: MAX_CHAIN,
    evalWhen: evalWhen,
    contradiction: contradiction,
    getRoute: getRoute,
    getEvent: getEvent,
    fill: fill,
    resolveEvent: resolveEvent,
    nextFor: nextFor,
    isUnlocked: isUnlocked,
    startRoute: startRoute,
    enter: enter,
    choose: choose,
    markRead: markRead,
    reachEnding: reachEnding,
    progress: progress,
    stage: stage,
    resolveLines: resolveLines
  };
})();
