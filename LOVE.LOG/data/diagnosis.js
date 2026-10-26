// 簡易性格診断。結果画面は表示せず、回答は会話の反応調整に使用する。
window.LOVELOG_DATA = window.LOVELOG_DATA || {};
window.LOVELOG_DATA.diagnosis = {
  "questions": [
    {
      "id": 1,
      "text": "大切な人が、あなたの知らない場所で楽しそうにしていたら？",
      "choices": [
        {
          "key": "A",
          "text": "楽しそうでよかった"
        },
        {
          "key": "B",
          "text": "少し寂しい。自分も一緒にいたい"
        },
        {
          "key": "C",
          "text": "誰といたのか全部知りたい"
        }
      ]
    },
    {
      "id": 2,
      "text": "大切な人が、あなたのことを忘れてしまったら？",
      "choices": [
        {
          "key": "A",
          "text": "また出会えばいい"
        },
        {
          "key": "B",
          "text": "忘れられないように努力する"
        },
        {
          "key": "C",
          "text": "忘れられない痕跡を残す"
        }
      ]
    },
    {
      "id": 3,
      "text": "相手が「ひとりになりたい」と言ったら？",
      "choices": [
        {
          "key": "A",
          "text": "そっとしておく"
        },
        {
          "key": "B",
          "text": "心配だけど待つ"
        },
        {
          "key": "C",
          "text": "絶対に許さない"
        }
      ]
    },
    {
      "id": 4,
      "text": "「愛している」とは、どんな状態？",
      "choices": [
        {
          "key": "A",
          "text": "相手が自由で幸せでいられること"
        },
        {
          "key": "B",
          "text": "お互いが必要であること"
        },
        {
          "key": "C",
          "text": "お互い以外何も必要ないと思えること"
        }
      ]
    }
  ],
  "scoreMap": {
    "A": "trust",
    "B": "need",
    "C": "control"
  }
};
