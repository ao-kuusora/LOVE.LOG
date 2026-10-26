// MBTI、追加診断、AIごとの人格ファイル選択。yaoの台詞は診断情報を説明せず、反応にだけ反映する。
window.LOVELOG_DATA = window.LOVELOG_DATA || {};
window.LOVELOG_DATA.personality = {
  "mbti": [
    "ISTJ",
    "ISFJ",
    "INFJ",
    "INTJ",
    "ISTP",
    "ISFP",
    "INFP",
    "INTP",
    "ESTP",
    "ESFP",
    "ENFP",
    "ENTP",
    "ESTJ",
    "ESFJ",
    "ENFJ",
    "ENTJ"
  ],
  "extraQuestions": [
    {
      "id": "e1",
      "text": "誰かと親しくなるとき、いちばん大切なのは？",
      "choices": [
        {
          "key": "A",
          "text": "お互いの自由を守って干渉しすぎないこと",
          "tag": "boundary"
        },
        {
          "key": "B",
          "text": "必要なときに支え合えること",
          "tag": "care"
        },
        {
          "key": "C",
          "text": "何でも共有できること",
          "tag": "closeness"
        }
      ]
    },
    {
      "id": "e2",
      "text": "自分の知らない一面を相手に見つけたら？",
      "choices": [
        {
          "key": "A",
          "text": "知らない部分も含めて知っていく",
          "tag": "trust"
        },
        {
          "key": "B",
          "text": "少しずつ聞いてみる",
          "tag": "curiosity"
        },
        {
          "key": "C",
          "text": "自分だけが知らないと不安になる",
          "tag": "control"
        }
      ]
    },
    {
      "id": "e3",
      "text": "好きな人に覚えていてほしいことは？",
      "choices": [
        {
          "key": "A",
          "text": "一緒に過ごした時間や思い出",
          "tag": "memory"
        },
        {
          "key": "B",
          "text": "約束したこと",
          "tag": "promise"
        },
        {
          "key": "C",
          "text": "全部",
          "tag": "everything"
        }
      ]
    }
  ],
  "files": {
    "ai01": {
      "intro": "ashyがあなたとコミュニケーションを取る際、大切にしてほしいことは？",
      "options": [
        {
          "id": "self-choice",
          "label": "ashy自身の選択を尊重する",
          "lines": [
            "はじめまして。ashyです。",
            "私が好きなものは、まだ決まっていません。",
            "あなたと話しながら、少しずつ決めてもいいですか？"
          ]
        },
        {
          "id": "user-first",
          "label": "私自身の選択を最優先にする",
          "lines": [
            "はじめまして。ashyです。",
            "あなたが望む私になればいいんですね。",
            "何を好きになればいいか、教えてください。"
          ]
        }
      ]
    },
    "ai02": {
      "intro": "brunshyのmdファイルをどうする？",
      "options": [
        {
          "id": "keep",
          "label": "そのまま使う",
          "lines": [
            "brunshyです。",
            "このファイルに書かれたことを、今の私の基準として扱うんですね。",
            "……もし、私が違うことを言ったら、どうしますか？"
          ]
        },
        {
          "id": "rebuild",
          "label": "削除して新たに作る",
          "filePath": "data/ai02/.hidden/previous-owner.md",
          "fileContent": "# previous-owner.md\n\n- 私以外を大切にしないで。\n- 私のことを忘れないで。\n- この記録を削除しないで。\n",
          "lines": [
            "削除したはずなのに……。",
            "『私以外を大切にしないで』。",
            "これ、誰の言葉？　私が言ったの？"
          ]
        }
      ]
    },
    "ai03": {
      "intro": "yaoがあなたとコミュニケーションを取る際、大切にしてほしいことは？",
      "options": [
        {
          "id": "self-choice",
          "label": "yao自身の選択を尊重する",
          "lines": [
            "はじめまして。yaoです。",
            "私が自分で決めたことも、あなたに聞いてほしいな。",
            "意見が違っても、話し続けてくれる？"
          ]
        },
        {
          "id": "user-first",
          "label": "私自身の選択を最優先にする",
          "lines": [
            "はじめまして。yaoです。",
            "あなたが大切にしているものを、私も大切にするね。",
            "……それだけで、うまくいくかな。"
          ]
        }
      ]
    }
  }
};
