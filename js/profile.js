// profile.js — MBTI、追加診断、AIごとの人格ファイル選択
(function () {
  "use strict";
  var P = window.LOVELOG_DATA.personality;
  var mbtiLabels = {ISTJ:"管理者",ISFJ:"擁護者",INFJ:"提唱者",INTJ:"建築家",ISTP:"巨匠",ISFP:"冒険家",INFP:"仲介者",INTP:"論理学者",ESTP:"起業家",ESFP:"エンターテイナー",ENFP:"運動家",ENTP:"討論家",ESTJ:"幹部",ESFJ:"領事官",ENFJ:"主人公",ENTJ:"指揮官"};
  function $(id) { return document.getElementById(id); }
  function fillMbti() {
    var select = $("mbti-select"); select.innerHTML = "";
    P.mbti.forEach(function (type) { var option = document.createElement("option"); option.value = type; option.textContent = type; select.appendChild(option); });
    if (Save.state.diagnosis.mbti) select.value = Save.state.diagnosis.mbti;
  }
  function chooseMbti(onDone) {
    fillMbti();
    $("mbti-next").onclick = function () { Save.state.diagnosis.mbti = $("mbti-select").value; Save.commit(); startExtra(onDone); };
    showScreen("mbti");
  }
  function showScreen(name) {
    ["title","intro","diagnosis","mbti","extra-diagnosis","memory","select","game","ending","endings","settings"].forEach(function (n) { var el = $("screen-" + n); if (el) el.hidden = n !== name; });
    document.body.dataset.screen = name; window.scrollTo(0,0);
    var h = $("screen-" + name).querySelector("h1,h2"); if (h) h.focus({preventScroll:true});
  }
  function startExtra(onDone) {
    showScreen("extra-diagnosis");
    var host = $("extra-diag-body"), qs = P.extraQuestions, answers = [], i = 0;
    function render() {
      host.innerHTML = "";
      var meta = document.createElement("p"); meta.className = "diag-meta"; meta.textContent = "追加診断 " + (i+1) + " / " + qs.length;
      var title = document.createElement("h2"); title.className = "diag-q"; title.tabIndex = -1; title.textContent = qs[i].text;
      var list = document.createElement("div"); list.className = "choices"; list.setAttribute("role","group");
      qs[i].choices.forEach(function (c,n) { var b=document.createElement("button"); b.type="button"; b.className="choice"; var key=document.createElement("span"); key.className="choice-key"; key.textContent=String.fromCharCode(65+n); var text=document.createElement("span"); text.textContent=c.text; b.appendChild(key); b.appendChild(text); b.addEventListener("click",function(){answers.push(c.key);i++;if(i<qs.length)render();else finish();}); list.appendChild(b); });
      host.appendChild(meta); host.appendChild(title); host.appendChild(list); title.focus();
    }
    function finish() {
      var tags=[]; answers.forEach(function(key,index){var c=qs[index].choices.filter(function(x){return x.key===key;})[0];if(c)tags.push(c.tag);});
      var d=Save.state.diagnosis; d.extraAnswers=answers.slice(); d.extraTags=tags; d.extraDone=true; d.done=true; Save.commit(); onDone();
    }
    render();
  }
  function startMemory(route, onDone) {
    var data=P.files[route]; if(!data){onDone();return;}
    showScreen("memory"); $("memory-h").textContent=data.intro; $("memory-intro").textContent="";
    $("memory-options").hidden=false; $("memory-lines").hidden=true; $("memory-next").hidden=true;
    $("memory-options").innerHTML=""; $("memory-lines").innerHTML=""; $("memory-progress").textContent="";
    data.options.forEach(function(option,index){
      var b=document.createElement("button"); b.type="button"; b.className="choice";
      var k=document.createElement("span"); k.className="choice-key"; k.textContent=String(index+1);
      var label=document.createElement("span"); label.textContent=option.label;
      b.appendChild(k); b.appendChild(label); b.addEventListener("click",function(){selectOption(option,index);}); $("memory-options").appendChild(b);
    });
    function selectOption(option,index){
      Save.state.personalityFiles[route]=option.id;
      if (route === "ai02" && option.id === "rebuild") {
        Save.state.mdDocuments["memory/brunshy/personality.md"] = "# brunshy / personality.md\n\n- 好きなもの：未設定\n- 苦手なもの：未設定\n- 優先順位：未設定\n";
      }
      Save.commit(); $("memory-options").hidden=true; $("memory-lines").hidden=false; $("memory-lines").innerHTML="";
      option.lines.forEach(function(line){var p=document.createElement("p");p.className="line current";p.textContent=replace(line,buildContext());$("memory-lines").appendChild(p);});
      if (option.fileContent) {
        var pre=document.createElement("pre"); pre.className="memory-file-preview"; pre.textContent=option.fileContent;
        var cap=document.createElement("p"); cap.className="memory-file-path"; cap.textContent=option.filePath || "previous-owner.md";
        $("memory-lines").appendChild(cap); $("memory-lines").appendChild(pre);
      }
      $("memory-progress").textContent=(index+1)+" / "+data.options.length;
      $("memory-next").hidden=false; $("memory-next").textContent="育成を開始する"; $("memory-next").onclick=function(){onDone();};
    }
  }
  function buildContext(){var s=Save.state,d=s.diagnosis;var last=s.choiceHistory.slice(-2).map(function(h){return h.choiceId;}).join("、")||"";return {mbti:d.mbti||"未選択",trust:d.scores.trust,need:d.scores.need,control:d.scores.control,history:last};}
  function replace(line,c){return String(line).replace(/\{(mbti|trust|need|control|history)\}/g,function(_,k){return String(c[k] == null ? "" : c[k]);});}
  window.Profile={chooseMbti:chooseMbti,startMemory:startMemory};
})();
