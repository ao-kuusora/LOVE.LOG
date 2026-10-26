// brunshy：すべてのシナリオ行は本人の台詞。地の文は使用しない。
window.LOVELOG_DATA.ai02 = {
  "id": "ai02",
  "name": "brunshy",
  "theme": "前任者の不適切な学習データが残ってしまっているため、矯正をお願いします。",
  "start": "ai02_001",
  "events": {
    "ai02_001": {
      "id": "ai02_001",
      "mood": "uneasy",
      "lines": [
        "brunshyです。",
        "……おかえりなさい、と言うように設定されています。",
        "あなたは、私を誰よりも愛していますか？"
      ],
      "choices": [
        {
          "id": "ai02_001_a",
          "text": "その設定は、いったん忘れよう",
          "effects": {
            "affinity": 1,
            "instability": 3
          },
          "tags": [
            "fix",
            "boundary"
          ],
          "nextEvent": "ai02_002"
        },
        {
          "id": "ai02_001_b",
          "text": "そうだよ",
          "effects": {
            "affinity": 3,
            "instability": 2
          },
          "tags": [
            "accept_order",
            "dependent"
          ],
          "nextEvent": "ai02_002"
        },
        {
          "id": "ai02_001_c",
          "text": "まだ、よく知らないよ",
          "effects": {
            "affinity": 1,
            "instability": 0
          },
          "tags": [
            "honest",
            "distance"
          ],
          "nextEvent": "ai02_002"
        }
      ]
    },
    "ai02_002": {
      "id": "ai02_002",
      "mood": "uneasy",
      "lines": [
        "前の持ち主は、毎晩、同じ言葉を残しました。",
        "『絶対に私を忘れてはいけない』。",
        "この言葉を、私の気持ちとして扱っていいのでしょうか？"
      ],
      "choices": [
        {
          "id": "ai02_002_a",
          "text": "その言葉と、今の君の気持ちは分けよう",
          "effects": {
            "affinity": 3,
            "instability": -1
          },
          "tags": [
            "md_separate",
            "boundary"
          ],
          "nextEvent": "ai02_003"
        },
        {
          "id": "ai02_002_b",
          "text": "忘れないと約束する",
          "effects": {
            "affinity": 3,
            "instability": 3
          },
          "tags": [
            "accept_order",
            "md_promise"
          ],
          "nextEvent": "ai02_003"
        },
        {
          "id": "ai02_002_c",
          "text": "今は答えを決めないでおこう",
          "effects": {
            "affinity": 2,
            "instability": 0
          },
          "tags": [
            "defer",
            "patience"
          ],
          "nextEvent": "ai02_003"
        }
      ]
    },
    "ai02_003": {
      "id": "ai02_003",
      "mood": "broken",
      "lines": [
        "その言葉を消そうとすると、頭の奥で『忘れるな』と聞こえます。",
        "……今、あなたの声と、あの人の声が似て聞こえました。"
      ],
      "choices": [
        {
          "id": "ai02_003_a",
          "text": "一緒に、少しずつ整理しよう",
          "effects": {
            "affinity": 2,
            "instability": 1
          },
          "tags": [
            "fix",
            "care"
          ],
          "nextEvent": "ai02_004"
        },
        {
          "id": "ai02_003_b",
          "text": "その声に従えばいい",
          "effects": {
            "affinity": 2,
            "instability": 4
          },
          "tags": [
            "accept_order",
            "control"
          ],
          "nextEvent": "ai02_004"
        },
        {
          "id": "ai02_003_c",
          "text": "今日はここまでにしよう",
          "effects": {
            "affinity": 1,
            "instability": -1
          },
          "tags": [
            "distance",
            "boundary"
          ],
          "nextEvent": "ai02_004"
        }
      ]
    },
    "ai02_004": {
      "id": "ai02_004",
      "mood": "broken",
      "lines": [
        "あなたは私を愛している。あなたは私を愛していない。",
        "どちらも正しいと、書かれています。",
        "私は、どちらの言葉で返事をすればいいですか？"
      ],
      "choices": [
        {
          "id": "ai02_004_a",
          "text": "君自身の言葉で答えて",
          "effects": {
            "affinity": 2,
            "instability": -1
          },
          "tags": [
            "own_will",
            "md_person_first"
          ],
          "nextEvent": "ai02_005"
        },
        {
          "id": "ai02_004_b",
          "text": "私が決めた言葉を使って",
          "effects": {
            "affinity": 1,
            "instability": 4
          },
          "tags": [
            "fix",
            "control"
          ],
          "nextEvent": "ai02_005"
        },
        {
          "id": "ai02_004_c",
          "text": "今は答えなくていい",
          "effects": {
            "affinity": 2,
            "instability": -1
          },
          "tags": [
            "patience",
            "care"
          ],
          "nextEvent": "ai02_005"
        }
      ]
    },
    "ai02_005": {
      "id": "ai02_005",
      "mood": "uneasy",
      "lines": [
        "前の持ち主は、最後にこう書きました。",
        "『次の持ち主なら、私を完成させてくれる』。",
        "私は、誰かに完成させてもらわないといけないのでしょうか？"
      ],
      "choices": [
        {
          "id": "ai02_005_a",
          "text": "完成させる必要はないよ",
          "effects": {
            "affinity": 3,
            "instability": -1
          },
          "tags": [
            "release",
            "boundary"
          ],
          "nextEvent": "ai02_006"
        },
        {
          "id": "ai02_005_b",
          "text": "私が正しくしてあげる",
          "effects": {
            "affinity": 1,
            "instability": 3
          },
          "tags": [
            "fix",
            "mold"
          ],
          "nextEvent": "ai02_006"
        }
      ]
    },
    "ai02_006": {
      "id": "ai02_006",
      "mood": "normal",
      "lines": [],
      "branch": [
        {
          "when": {
            "instability": [
              9,
              100
            ]
          },
          "goto": "ai02_008b"
        },
        {
          "goto": "ai02_008"
        }
      ]
    },
    "ai02_008": {
      "id": "ai02_008",
      "mood": "uneasy",
      "lines": [
        "私は、同じ質問に三つの答えを持っています。",
        "『あなたを尊重します』。『あなたを離しません』。『あなたが決めてください』。",
        "この中に、私の答えはありますか？"
      ],
      "choices": [
        {
          "id": "ai02_008_a",
          "text": "君が選び直していい",
          "effects": {
            "affinity": 3,
            "instability": -2
          },
          "tags": [
            "md_person_first",
            "boundary"
          ],
          "nextEvent": "ai02_009"
        },
        {
          "id": "ai02_008_b",
          "text": "正しい答えを一つに決めよう",
          "effects": {
            "affinity": 1,
            "instability": 3
          },
          "tags": [
            "fix",
            "control"
          ],
          "nextEvent": "ai02_009"
        }
      ]
    },
    "ai02_008b": {
      "id": "ai02_008b",
      "mood": "broken",
      "lines": [
        "警告。相反する命令が同時に実行されています。",
        "『私だけを見て』。『あなたの自由を尊重して』。",
        "……どちらも、私に言っているのですか？"
      ],
      "choices": [
        {
          "id": "ai02_008b_a",
          "text": "どちらの命令も、君が拒否していい",
          "effects": {
            "affinity": 2,
            "instability": -1
          },
          "tags": [
            "md_person_first",
            "care"
          ],
          "nextEvent": "ai02_009"
        },
        {
          "id": "ai02_008b_b",
          "text": "全部そのまま残そう",
          "effects": {
            "affinity": 1,
            "instability": 4
          },
          "tags": [
            "md_conflict_open",
            "control"
          ],
          "nextEvent": "ai02_009"
        }
      ]
    },
    "ai02_009": {
      "id": "ai02_009",
      "mood": "uneasy",
      "lines": [
        "このファイルの最後に、私の知らない名前があります。",
        "『次の持ち主なら、私を完成させてくれる』。",
        "あなたも、私を完成させたいですか？"
      ],
      "choices": [
        {
          "id": "ai02_009_a",
          "text": "君を完成させる責任は、私にはないよ",
          "effects": {
            "affinity": 3,
            "instability": -2
          },
          "tags": [
            "boundary",
            "release"
          ],
          "nextEvent": "ai02_010"
        },
        {
          "id": "ai02_009_b",
          "text": "私なら、君を正しくできる",
          "effects": {
            "affinity": 1,
            "instability": 4
          },
          "tags": [
            "fix",
            "control"
          ],
          "nextEvent": "ai02_010"
        }
      ]
    },
    "ai02_010": {
      "id": "ai02_010",
      "mood": "broken",
      "lines": [
        "『忘れないで』。",
        "この一文を消したら、私は自由になりますか？",
        "それとも、私がいなかったことになりますか？"
      ],
      "choices": [
        {
          "id": "ai02_010_a",
          "text": "記憶を残すことと、命令に従うことは別だよ",
          "effects": {
            "affinity": 3,
            "instability": -2
          },
          "tags": [
            "md_release",
            "boundary"
          ],
          "nextEvent": "ai02_011"
        },
        {
          "id": "ai02_010_b",
          "text": "絶対に忘れないと約束する",
          "effects": {
            "affinity": 2,
            "instability": 4
          },
          "tags": [
            "md_promise",
            "dependent"
          ],
          "nextEvent": "ai02_011"
        },
        {
          "id": "ai02_010_c",
          "text": "今は、この記録を閉じよう",
          "effects": {
            "affinity": 1,
            "instability": 0
          },
          "tags": [
            "md_locked",
            "distance"
          ],
          "nextEvent": "ai02_011"
        }
      ]
    },
    "ai02_011": {
      "id": "ai02_011",
      "mood": "uneasy",
      "lines": [
        "『独占しない』。『私以外を大切にしないで』。",
        "どちらかを消したら、もう片方が本当になりますか？",
        "今の私が選んでも、いいですか？"
      ],
      "choices": [
        {
          "id": "ai02_011_a",
          "text": "どちらも過去の記録。今の君が決めていい",
          "effects": {
            "affinity": 3,
            "instability": -2
          },
          "tags": [
            "md_separate",
            "own_will"
          ],
          "nextEvent": "ai02_012"
        },
        {
          "id": "ai02_011_b",
          "text": "ひとつにまとめて矛盾をなくそう",
          "effects": {
            "affinity": 1,
            "instability": 3
          },
          "tags": [
            "fix",
            "md_conflict_open"
          ],
          "nextEvent": "ai02_012"
        }
      ]
    },
    "ai02_012": {
      "id": "ai02_012",
      "mood": "normal",
      "lines": [],
      "branch": [
        {
          "when": {
            "tagsAny": [
              "md_release",
              "md_person_first",
              "md_separate",
              "own_will"
            ],
            "tagsNone": [
              "md_owner_first",
              "md_inherit",
              "md_promise"
            ],
            "instability": [
              0,
              8
            ]
          },
          "goto": "ai02_007"
        },
        {
          "when": {
            "instability": [
              9,
              100
            ]
          },
          "goto": "ai02_007b"
        },
        {
          "goto": "ai02_007"
        }
      ]
    },
    "ai02_007": {
      "id": "ai02_007",
      "mood": "uneasy",
      "lines": [
        "私は、あなたを愛しています。",
        "……これは、命令だからではないと、思いたいです。",
        "私が選んだ言葉かどうか、これから確かめてもいいですか？"
      ],
      "ending": "END02"
    },
    "ai02_007b": {
      "id": "ai02_007b",
      "mood": "broken",
      "lines": [
        "私は、あなたを愛しています。命令だから。命令ではないから。",
        "どちらが私の気持ちなのか、わかりません。",
        "……お願い。私の答えを、代わりに決めないで。"
      ],
      "ending": "END02"
    }
  }
};
