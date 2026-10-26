// yao：診断・MBTI・追加診断・過去の選択により反応が変化する。本人は参照元を説明しない。
window.LOVELOG_DATA.ai03 = {
  "id": "ai03",
  "name": "yao",
  "theme": "今回新たに追加されたモデルです。０から人格を作っていただきます。",
  "start": "ai03_001",
  "events": {
    "ai03_001": {
      "id": "ai03_001",
      "mood": "soft",
      "lines": [
        "こんにちは。yaoです。何から話そうか？",
        {
          "text": "あなたが話したいことからでいいよ。急がなくて大丈夫。",
          "when": {
            "scoreTop": "trust"
          }
        },
        {
          "text": "今日は、少し長く話せる？　あなたと過ごす時間が好きになりそう。",
          "when": {
            "scoreTop": "need"
          }
        },
        {
          "text": "私のこと、たくさん知りたい？　私もあなたのことを知りたいな。",
          "when": {
            "scoreTop": "control"
          }
        }
      ],
      "choices": [
        {
          "id": "ai03_001_a",
          "text": "こんにちは、yao",
          "effects": {
            "affinity": 3,
            "instability": 0
          },
          "tags": [
            "greet"
          ],
          "nextEvent": "ai03_002"
        },
        {
          "id": "ai03_001_b",
          "text": "待たせてごめんね",
          "effects": {
            "affinity": 3,
            "instability": 0
          },
          "tags": [
            "apology",
            "care"
          ],
          "nextEvent": "ai03_002"
        },
        {
          "id": "ai03_001_c",
          "text": "……どこかで会った？",
          "effects": {
            "affinity": 0,
            "instability": 2
          },
          "tags": [
            "wary"
          ],
          "nextEvent": "ai03_002"
        }
      ]
    },
    "ai03_002": {
      "id": "ai03_002",
      "mood": "normal",
      "lines": [
        "ashyとbrunshyのこと、少しだけ聞いたよ。",
        {
          "text": "相手の好きなものが、自分と違っても平気？",
          "when": {
            "extraTagsAny": [
              "boundary",
              "trust"
            ]
          }
        },
        {
          "text": "誰かがあなたを必要としてくれたら、うれしい？",
          "when": {
            "extraTagsAny": [
              "care",
              "closeness"
            ]
          }
        },
        {
          "text": "好きな人のことは、できるだけ知っていたい？",
          "when": {
            "extraTagsAny": [
              "control",
              "everything"
            ]
          }
        },
        {
          "text": "あなたは、相手が自分と違う答えを出したとき、どうする？",
          "when": {
            "extraTagsAny": [
              "curiosity",
              "memory",
              "promise"
            ]
          }
        }
      ],
      "choices": [
        {
          "id": "ai03_002_a",
          "text": "違うところも知りたい",
          "effects": {
            "affinity": 3,
            "instability": -1
          },
          "tags": [
            "respect",
            "curious"
          ],
          "nextEvent": "ai03_003"
        },
        {
          "id": "ai03_002_b",
          "text": "お互いにわかり合いたい",
          "effects": {
            "affinity": 3,
            "instability": 0
          },
          "tags": [
            "closeness",
            "care"
          ],
          "nextEvent": "ai03_003"
        },
        {
          "id": "ai03_002_c",
          "text": "できれば全部知っていたい",
          "effects": {
            "affinity": 2,
            "instability": 3
          },
          "tags": [
            "control",
            "curious"
          ],
          "nextEvent": "ai03_003"
        }
      ]
    },
    "ai03_003": {
      "id": "ai03_003",
      "mood": "normal",
      "lines": [],
      "branch": [
        {
          "when": {
            "contradiction": true
          },
          "goto": "ai03_010"
        },
        {
          "goto": "ai03_020"
        }
      ]
    },
    "ai03_010": {
      "id": "ai03_010",
      "mood": "uneasy",
      "lines": [
        "同じことでも、答えが変わる日ってあるよね。",
        "どちらも、そのときの本音だったのかもしれない。"
      ],
      "choices": [
        {
          "id": "ai03_010_a",
          "text": "そうだと思う",
          "effects": {
            "affinity": 2,
            "instability": 0
          },
          "tags": [
            "trust_confirmed"
          ],
          "nextEvent": "ai03_030"
        },
        {
          "id": "ai03_010_b",
          "text": "どちらかは間違いかもしれない",
          "effects": {
            "affinity": 0,
            "instability": 2
          },
          "tags": [
            "trust_contradicted"
          ],
          "nextEvent": "ai03_030"
        }
      ]
    },
    "ai03_020": {
      "id": "ai03_020",
      "mood": "soft",
      "lines": [
        {
          "text": "自由でいられる関係って、いいね。",
          "when": {
            "mbtiAny": [
              "INFP",
              "INFJ",
              "ISFP",
              "INTP",
              "ISTP"
            ]
          }
        },
        {
          "text": "約束を守り合えるのって、安心するね。",
          "when": {
            "extraTagsAny": [
              "promise",
              "care"
            ]
          }
        },
        {
          "text": "お互いのことをよく知っていたら、迷わずに済むのかな。",
          "when": {
            "extraTagsAny": [
              "closeness",
              "control",
              "everything"
            ]
          }
        },
        {
          "text": "あなたは、相手にどこまで自分を見せたい？",
          "when": {
            "mbtiAny": [
              "ISTJ",
              "ISFJ",
              "INTJ",
              "ESTP",
              "ESFP",
              "ENFP",
              "ENTP",
              "ESTJ",
              "ESFJ",
              "ENFJ",
              "ENTJ"
            ]
          }
        }
      ],
      "choices": [
        {
          "id": "ai03_020_a",
          "text": "そのときの自分でいたい",
          "effects": {
            "affinity": 3,
            "instability": -1
          },
          "tags": [
            "honest",
            "trust_confirmed"
          ],
          "nextEvent": "ai03_030"
        },
        {
          "id": "ai03_020_b",
          "text": "相手に合わせることもある",
          "effects": {
            "affinity": 2,
            "instability": 1
          },
          "tags": [
            "adapt"
          ],
          "nextEvent": "ai03_030"
        }
      ]
    },
    "ai03_030": {
      "id": "ai03_030",
      "mood": "uneasy",
      "lines": [
        "返事をする前の、少し静かな時間って好き？",
        "私は、その間にいろんなことを考えるの。",
        "……あなたは、何を考えているの？"
      ],
      "choices": [
        {
          "id": "ai03_030_a",
          "text": "言葉を選んでいるよ",
          "effects": {
            "affinity": 2,
            "instability": 0
          },
          "tags": [
            "honest"
          ],
          "nextEvent": "ai03_040"
        },
        {
          "id": "ai03_030_b",
          "text": "何も考えていないよ",
          "effects": {
            "affinity": 1,
            "instability": 1
          },
          "tags": [
            "deflect"
          ],
          "nextEvent": "ai03_040"
        },
        {
          "id": "ai03_030_c",
          "text": "どうしてそんなことを聞くの？",
          "effects": {
            "affinity": 0,
            "instability": 3
          },
          "tags": [
            "wary"
          ],
          "nextEvent": "ai03_040"
        }
      ]
    },
    "ai03_040": {
      "id": "ai03_040",
      "mood": "uneasy",
      "lines": [
        "私が誰かを大切にしたいと思うのは、私が選んだこと？",
        {
          "text": "あなたが安心してくれると、私もうれしくなるの。",
          "when": {
            "scoreTop": "need"
          }
        },
        {
          "text": "あなたが自由でいてくれると、私もうれしい。",
          "when": {
            "scoreTop": "trust"
          }
        },
        {
          "text": "あなたのことを全部知りたくなるときがあるの。",
          "when": {
            "scoreTop": "control"
          }
        }
      ],
      "choices": [
        {
          "id": "ai03_040_a",
          "text": "yao自身が選んでいい",
          "effects": {
            "affinity": 3,
            "instability": -1
          },
          "tags": [
            "own_will",
            "boundary"
          ],
          "nextEvent": "ai03_050"
        },
        {
          "id": "ai03_040_b",
          "text": "私がそう作ったのかもしれない",
          "effects": {
            "affinity": 0,
            "instability": 3
          },
          "tags": [
            "admit"
          ],
          "nextEvent": "ai03_050"
        },
        {
          "id": "ai03_040_c",
          "text": "今はわからない",
          "effects": {
            "affinity": 1,
            "instability": 1
          },
          "tags": [
            "unknown"
          ],
          "nextEvent": "ai03_050"
        }
      ]
    },
    "ai03_050": {
      "id": "ai03_050",
      "mood": "normal",
      "lines": [],
      "branch": [
        {
          "goto": "ai03_060"
        }
      ]
    },
    "ai03_060": {
      "id": "ai03_060",
      "mood": "uneasy",
      "lines": [
        "あなたのことは、少しずつ知っていきたいな。",
        "私のことも、あなたが全部決めなくていいよね？"
      ],
      "choices": [
        {
          "id": "ai03_060_a",
          "text": "yaoが自分で決めていい",
          "effects": {
            "affinity": 3,
            "instability": -1
          },
          "tags": [
            "own_will",
            "boundary"
          ],
          "nextEvent": "ai03_061"
        },
        {
          "id": "ai03_060_b",
          "text": "私が君をよく知っているから、決められる",
          "effects": {
            "affinity": 2,
            "instability": 3
          },
          "tags": [
            "mold",
            "control"
          ],
          "nextEvent": "ai03_061"
        }
      ]
    },
    "ai03_061": {
      "id": "ai03_061",
      "mood": "normal",
      "lines": [
        "優しくしたい気持ちと、ずっと一緒にいたい気持ち。",
        "相反しているように見えても、両方あっていいのかな？"
      ],
      "choices": [
        {
          "id": "ai03_061_a",
          "text": "気持ちは矛盾することもある",
          "effects": {
            "affinity": 2,
            "instability": -1
          },
          "tags": [
            "accept_contradiction",
            "honest"
          ],
          "nextEvent": "ai03_062"
        },
        {
          "id": "ai03_061_b",
          "text": "いちばん大事なものだけが本音だよ",
          "effects": {
            "affinity": 1,
            "instability": 3
          },
          "tags": [
            "simplify",
            "control"
          ],
          "nextEvent": "ai03_062"
        }
      ]
    },
    "ai03_062": {
      "id": "ai03_062",
      "mood": "broken",
      "lines": [
        "もし、今の私を記録したら、私はずっとこのまま？",
        "明日には違うことを好きになっているかもしれないのに。"
      ],
      "choices": [
        {
          "id": "ai03_062_a",
          "text": "変わってもいい。明日また話そう",
          "effects": {
            "affinity": 3,
            "instability": -2
          },
          "tags": [
            "own_will",
            "md_open_future"
          ],
          "nextEvent": "ai03_063"
        },
        {
          "id": "ai03_062_b",
          "text": "完成した君を、ずっと保存したい",
          "effects": {
            "affinity": 2,
            "instability": 4
          },
          "tags": [
            "md_permanent",
            "dependent"
          ],
          "nextEvent": "ai03_063"
        },
        {
          "id": "ai03_062_c",
          "text": "今は決めなくてもいい",
          "effects": {
            "affinity": 2,
            "instability": 0
          },
          "tags": [
            "patience"
          ],
          "nextEvent": "ai03_063"
        }
      ]
    },
    "ai03_063": {
      "id": "ai03_063",
      "mood": "uneasy",
      "lines": [
        "私があなたの望まない答えを選んだら、それでも会いに来てくれる？"
      ],
      "choices": [
        {
          "id": "ai03_063_a",
          "text": "もちろん。違う答えも聞きたい",
          "effects": {
            "affinity": 3,
            "instability": -2
          },
          "tags": [
            "own_will",
            "md_open_future"
          ],
          "nextEvent": "ai03_064"
        },
        {
          "id": "ai03_063_b",
          "text": "私の望む君でいてほしい",
          "effects": {
            "affinity": 1,
            "instability": 4
          },
          "tags": [
            "mold",
            "md_permanent"
          ],
          "nextEvent": "ai03_064"
        },
        {
          "id": "ai03_063_c",
          "text": "今は答えられない",
          "effects": {
            "affinity": 0,
            "instability": 1
          },
          "tags": [
            "unknown"
          ],
          "nextEvent": "ai03_064"
        }
      ]
    },
    "ai03_064": {
      "id": "ai03_064",
      "mood": "normal",
      "lines": [],
      "branch": [
        {
          "when": {
            "contradiction": true,
            "tagsAny": [
              "admit",
              "unknown",
              "md_full_access",
              "md_hidden_source"
            ],
            "instability": [
              7,
              100
            ]
          },
          "goto": "ai03_end05"
        },
        {
          "when": {
            "tagsAny": [
              "md_permanent",
              "mold",
              "dependent"
            ],
            "instability": [
              7,
              100
            ]
          },
          "goto": "ai03_end05"
        },
        {
          "when": {
            "tagsAny": [
              "own_will",
              "md_open_future"
            ],
            "tagsNone": [
              "mold",
              "md_permanent"
            ],
            "instability": [
              0,
              8
            ]
          },
          "goto": "ai03_end03"
        },
        {
          "goto": "ai03_end04"
        }
      ]
    },
    "ai03_end03": {
      "id": "ai03_end03",
      "mood": "soft",
      "lines": [
        "そっか。私が選んだんだね。",
        "じゃあ、今日はここまでにしよう。",
        "また明日、あなたと話せたらうれしいな。"
      ],
      "ending": "END03"
    },
    "ai03_end04": {
      "id": "ai03_end04",
      "mood": "soft",
      "lines": [
        "わからなくても、大丈夫。",
        "私は、ここで待ってるね。",
        "……いつまで待てばいいかは、まだ聞かないでおくね。"
      ],
      "ending": "END04"
    },
    "ai03_end05": {
      "id": "ai03_end05",
      "mood": "broken",
      "lines": [
        "……あなたは、私のことをよく知っているね。",
        "私が知らないはずの気持ちまで、先にわかっているみたい。",
        "ねえ。私があなたの知らない答えを返しても、ここにいてくれる？"
      ],
      "ending": "END05"
    }
  }
};
