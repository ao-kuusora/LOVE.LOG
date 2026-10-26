// md-stage.js — MDファイルの閲覧・追記・書き換えを物語上の選択として扱う。
(function () {
  "use strict";
  var active = false;
  function $(id) { return document.getElementById(id); }
  function sanitizeAi03File(route, path, content) {
    if (route !== "ai03" || !(path.indexOf("memory/ai03/") === 0 || path.indexOf("memory/yao/") === 0)) return content;
    // 旧セーブに残る、以前のネタバレ用ログも表示前に自然な記録へ移行する。
    return String(content)
      .replace(/- 診断：保存済み/g, "- 返事の記録：保存済み")
      .replace(/- 生成元：あなたの診断と選択/g, "- 最初に書かれたこと：短い記憶")
      .replace(/診断回答：\s*\d+件\n?/g, "")
      .replace(/人格生成：完了/g, "初期記録：保存済み")
      .replace(/MBTI：[^\n]*\n?/g, "")
      .replace(/信頼\s*[:：]\s*\d+[^\n]*\n?/g, "")
      .replace(/必要とされたい気持ち[^\n]*\n?/g, "")
      .replace(/支配\s*[:：]\s*\d+[^\n]*\n?/g, "");
  }
  function baseFile(route, scene) {
    var state = Save.state;
    var path = scene.path || ("memory/" + route + ".md");
    var seed = scene.seed || "# 記録\n\nこのファイルは、会話と選択によって更新されます。\n";
    var stored = state.mdDocuments[path];
    var content = sanitizeAi03File(route, path, stored || seed);
    if (!stored || content !== stored) {
      state.mdDocuments[path] = content;
      Save.commit();
    }
    return content;
  }
  function open(route, scene, done) {
    if (!scene || !scene.id || Save.state.mdScenesSeen.indexOf(scene.id) !== -1) { done(); return; }
    active = true;
    var overlay = $("md-overlay"), path = scene.path || ("memory/" + route + ".md");
    var options = scene.options || [];
    $("md-title").textContent = scene.title || "記録ファイル";
    $("md-path").textContent = path;
    $("md-prompt").textContent = scene.prompt || "この記録をどう扱いますか？";
    function render() {
      $("md-content").textContent = baseFile(route, scene);
      $("md-version").textContent = "REV " + (Save.state.mdScenesSeen.length + 1).toString().padStart(2, "0");
    }
    render();
    var operations = $("md-operations"); operations.innerHTML = "";
    options.forEach(function (opt) {
      var b = document.createElement("button"); b.type = "button"; b.className = "md-operation";
      var strong = document.createElement("strong"); strong.textContent = opt.label;
      b.appendChild(strong);
      if (opt.description) { var desc = document.createElement("span"); desc.textContent = opt.description; b.appendChild(desc); }
      b.addEventListener("click", function () {
        var current = baseFile(route, scene), next = current;
        if (opt.action === "append") next = current.replace(/\s*$/, "") + "\n\n" + (opt.content || "");
        else if (opt.action === "replace-last") {
          var lines = current.split("\n"); var target = opt.target || ""; var idx = -1;
          for (var i = lines.length - 1; i >= 0; i--) if (!target || lines[i].indexOf(target) !== -1) { idx = i; break; }
          if (idx >= 0) lines[idx] = opt.content || "<!-- この行は削除された -->";
          else lines.push(opt.content || "");
          next = lines.join("\n");
        } else if (opt.action === "delete-last") {
          var ls = current.split("\n");
          for (var j = ls.length - 1; j >= 0; j--) if (ls[j].trim()) { ls.splice(j, 1); break; }
          next = ls.join("\n");
        } else if (opt.action === "append-system") next = current.replace(/\s*$/, "") + "\n\n> [SYSTEM] " + (opt.content || "変更が記録されました。");
        Save.state.mdDocuments[path] = next.slice(0, 12000);
        Save.state.mdScenesSeen.push(scene.id);
        if (opt.tag) Save.state.choiceHistory.push({ route: route, eventId: scene.id, choiceId: "md_" + opt.id, tags: [opt.tag] });
        Save.commit();
        $("md-content").textContent = Save.state.mdDocuments[path];
        $("md-version").textContent = "SAVED ✓";
        b.disabled = true;
        window.setTimeout(function () { overlay.hidden = true; active = false; done(opt); }, 420);
      });
      operations.appendChild(b);
    });
    overlay.hidden = false;
    var first = operations.querySelector("button"); if (first) first.focus();
  }
  window.MDStage = { open: open, get active() { return active; } };
})();
