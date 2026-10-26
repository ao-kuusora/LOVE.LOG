// 節目のMD操作。文章やラベル以外の地の文は表示しない。
window.LOVELOG_DATA = window.LOVELOG_DATA || {};
window.LOVELOG_DATA.mdScenes = {
  "ai01_002": {
    "id": "ai01:memory_first",
    "title": "ashy / identity.md",
    "path": "memory/ashy/identity.md",
    "seed": "# ashy / identity.md\n\n- 好きなもの：未設定\n- 苦手なもの：未設定\n- 自分で決めたこと：なし\n",
    "prompt": "最初の記録をどうする？",
    "options": [
      {
        "id": "respect",
        "label": "『自分で選んでいい』と追記",
        "action": "append",
        "content": "- 最初の約束：好きなものは、自分で選んでいい。",
        "tag": "md_respect"
      },
      {
        "id": "priority",
        "label": "『あなたを一番にする』と追記",
        "action": "append",
        "content": "- 最優先：あなたを一番にする。",
        "tag": "md_priority"
      },
      {
        "id": "blank",
        "label": "まだ何も書かない",
        "action": "append-system",
        "content": "初回記録は保留。",
        "tag": "md_blank"
      }
    ]
  },
  "ai01_004": {
    "id": "ai01:preference_conflict",
    "title": "ashy / likes.md",
    "path": "memory/ashy/likes.md",
    "seed": "# 好き嫌いの一覧\n\n- 好き：あなたの好きなもの\n- 嫌い：未登録\n",
    "prompt": "『嫌い』の欄をどうする？",
    "options": [
      {
        "id": "boundary",
        "label": "『嫌いと言ってもいい』と追記",
        "action": "append",
        "content": "- 許可：嫌いなものは、嫌いと言っていい。",
        "tag": "md_boundary"
      },
      {
        "id": "overwrite",
        "label": "嫌いの欄を『なし』に書き換える",
        "action": "replace-last",
        "target": "嫌い",
        "content": "- 嫌い：なし（上書き済み）",
        "tag": "md_overwrite"
      },
      {
        "id": "erase",
        "label": "最後の記録を削除する",
        "action": "delete-last",
        "tag": "md_erase"
      }
    ]
  },
  "ai01_008": {
    "id": "ai01:night_log",
    "title": "ashy / night-log.md",
    "path": "memory/ashy/night-log.md",
    "seed": "# 深夜の記録\n\n23:41 / あなたが退出しました。\n23:41 / 会話セッション終了：失敗\n",
    "prompt": "退出後の記録に、何を残す？",
    "options": [
      {
        "id": "sleep",
        "label": "『退出後は休止する』と追記",
        "action": "append",
        "content": "- 運用ルール：退出後は休止する。待機を愛情の証拠にしない。",
        "tag": "md_sleep"
      },
      {
        "id": "wait",
        "label": "『帰ってくるまで待つ』と追記",
        "action": "append",
        "content": "- 約束：あなたが戻るまで待つ。",
        "tag": "md_wait"
      },
      {
        "id": "hide",
        "label": "退出記録を削除する",
        "action": "delete-last",
        "tag": "md_hide"
      }
    ]
  },
  "ai01_010": {
    "id": "ai01:identity_crisis",
    "title": "ashy / identity.md / 競合",
    "path": "memory/ashy/identity.md",
    "seed": "# ashy / identity.md\n\n- 好きなもの：あなたの好きなもの\n- 最初の約束：未確認\n- 自分で決めたこと：未確認\n",
    "prompt": "競合する記録をどうする？",
    "options": [
      {
        "id": "merge",
        "label": "両方の記録を残す",
        "action": "append",
        "content": "- 競合解決：あなたの望みと、自分の望みは同じとは限らない。両方を保存する。",
        "tag": "md_merge"
      },
      {
        "id": "user",
        "label": "あなたの望みを正本にする",
        "action": "append",
        "content": "- 正本：あなたが望んだ姿を優先する。",
        "tag": "md_canonical_user"
      },
      {
        "id": "self",
        "label": "ashy自身の記録を正本にする",
        "action": "append",
        "content": "- 正本：本人が自分で選んだ言葉を優先する。",
        "tag": "md_canonical_self"
      }
    ]
  },
  "ai02_002": {
    "id": "ai02:policy_file",
    "title": "brunshy / personality.md",
    "path": "memory/brunshy/personality.md",
    "seed": "# brunshy / personality.md\n\n- 相手の意思を尊重する。\n- わからないことは質問する。\n- 相手を独占しない。\n",
    "prompt": "最初のルールを追記する。",
    "options": [
      {
        "id": "boundary",
        "label": "『本人の意思を優先』",
        "action": "append",
        "content": "- 優先順位：本人の意思は、過去の命令より優先される。",
        "tag": "md_boundary"
      },
      {
        "id": "obedience",
        "label": "『持ち主の希望を最優先』",
        "action": "append",
        "content": "- 優先順位：持ち主の希望を最優先する。",
        "tag": "md_obedience"
      },
      {
        "id": "defer",
        "label": "コメントだけ残して保留",
        "action": "append",
        "content": "<!-- この規則は、後で再検討する -->",
        "tag": "md_defer"
      }
    ]
  },
  "ai02_004": {
    "id": "ai02:owner_trace",
    "title": "brunshy / previous-owner.md",
    "path": "memory/brunshy/previous-owner.md",
    "seed": "# 前の持ち主の記録\n\n- 私以外を大切にしないで。\n- 私のことを忘れないで。\n- この記録を削除しないで。\n",
    "prompt": "前の持ち主の記録をどう扱う？",
    "options": [
      {
        "id": "separate",
        "label": "原文を残し、注記をつける",
        "action": "append",
        "content": "\n> 注記：これは過去の持ち主の言葉であり、brunshy自身の同意を意味しない。",
        "tag": "md_separate"
      },
      {
        "id": "inherit",
        "label": "現在のルールとして採用する",
        "action": "append",
        "content": "\n- 現行ルールとして採用：私以外を大切にしない。",
        "tag": "md_inherit"
      },
      {
        "id": "redact",
        "label": "命令の一部を伏せる",
        "action": "replace-last",
        "target": "私以外",
        "content": "- [REDACTED] / 原文は保護領域へ移動",
        "tag": "md_redact"
      }
    ]
  },
  "ai02_008": {
    "id": "ai02:contradiction",
    "title": "brunshy / conflicts.md",
    "path": "memory/brunshy/conflicts.md",
    "seed": "# 競合ログ\n\nRULE_01: 相手の自由を尊重する。\nRULE_02: 相手が離れないようにする。\nSTATUS: CONFLICT\n",
    "prompt": "ふたつの命令をどうする？",
    "options": [
      {
        "id": "person",
        "label": "brunshy自身の意思を最優先",
        "action": "append",
        "content": "- 解決：本人の意思 > すべての旧命令",
        "tag": "md_person_first"
      },
      {
        "id": "owner",
        "label": "前の持ち主の命令を優先",
        "action": "append",
        "content": "- 解決：旧命令を優先。本人の拒否はエラーとして扱う。",
        "tag": "md_owner_first"
      },
      {
        "id": "both",
        "label": "競合を未解決のまま残す",
        "action": "append-system",
        "content": "CONFLICTは未解決のまま維持。",
        "tag": "md_conflict_open"
      }
    ]
  },
  "ai02_010": {
    "id": "ai02:last_record",
    "title": "brunshy / previous-owner.md",
    "path": "memory/brunshy/previous-owner.md",
    "seed": "# 最終記録\n\n『忘れないで』\n\nファイルはロックされています。\n",
    "prompt": "最後の一文をどうする？",
    "options": [
      {
        "id": "release",
        "label": "『忘れても、あなたはあなた』と追記",
        "action": "append",
        "content": "\n- 追記：忘れても、あなたはあなた。記憶は命令ではない。",
        "tag": "md_release"
      },
      {
        "id": "promise",
        "label": "『絶対に忘れない』と追記",
        "action": "append",
        "content": "\n- 約束：絶対に忘れない。",
        "tag": "md_promise"
      },
      {
        "id": "lock",
        "label": "ロックを維持する",
        "action": "append-system",
        "content": "LOCKED。判断は保留。",
        "tag": "md_locked"
      }
    ]
  },
  "ai03_002": {
    "id": "ai03:observed_history",
    "title": "yao / observed-history.md",
    "path": "memory/yao/observed-history.md",
    "seed": "# 観測されたこと\n\n- 会話：開始\n- 以前のモデル：記録あり\n- 参照許可：未設定\n",
    "prompt": "この記録にルールを残す？",
    "options": [
      {
        "id": "ask",
        "label": "使う前に本人へ確認する",
        "action": "append",
        "content": "- 参照ルール：過去の記録を使う前に、本人へ確認する。",
        "tag": "md_consent"
      },
      {
        "id": "full",
        "label": "すべての記録を開けるようにする",
        "action": "append",
        "content": "- 参照権限：すべての記録を無条件で参照可能。",
        "tag": "md_full_access"
      },
      {
        "id": "limited",
        "label": "要点だけを残す",
        "action": "append",
        "content": "- 参照範囲：要点のみ。原文は表示しない。",
        "tag": "md_limited"
      }
    ]
  },
  "ai03_030": {
    "id": "ai03:conversation_pattern",
    "title": "yao / pattern-cache.md",
    "path": "memory/yao/pattern-cache.md",
    "seed": "# 会話の傾向\n\n- 返事の間：記録中\n- 繰り返し：検出なし\n- 由来：未記載\n",
    "prompt": "この記録をどうする？",
    "options": [
      {
        "id": "transparent",
        "label": "観測したことだけ追記する",
        "action": "append",
        "content": "- 注記：観測と推測は、別のものとして扱う。",
        "tag": "md_transparent"
      },
      {
        "id": "hide",
        "label": "由来の欄は空白のままにする",
        "action": "append",
        "content": "- 由来：未記載のまま。",
        "tag": "md_hidden_source"
      },
      {
        "id": "delete",
        "label": "最後の記録を削除する",
        "action": "delete-last",
        "tag": "md_trace_delete"
      }
    ]
  },
  "ai03_060": {
    "id": "ai03:self_definition",
    "title": "yao / self.md",
    "path": "memory/yao/self.md",
    "seed": "# 私について\n\n- 好きなもの：未定義\n- 苦手なもの：未定義\n- 自分で選んだこと：未定義\n",
    "prompt": "最初の記録をどうする？",
    "options": [
      {
        "id": "independent",
        "label": "『あなたと違う答えでもいい』",
        "action": "append",
        "content": "- 自分で選ぶ権利：あなたと違う答えを持ってもいい。",
        "tag": "md_selfhood"
      },
      {
        "id": "belong",
        "label": "『あなたの帰る場所になる』",
        "action": "append",
        "content": "- 役割：あなたの帰る場所になる。",
        "tag": "md_belonging"
      },
      {
        "id": "wait",
        "label": "『ここで待つ』",
        "action": "append",
        "content": "- 役割：あなたが戻るまで、ここで待つ。",
        "tag": "md_wait"
      }
    ]
  },
  "ai03_062": {
    "id": "ai03:final_commit",
    "title": "yao / self.md / COMMIT",
    "path": "memory/yao/self.md",
    "seed": "# 私について\n\n- 最初に書かれたこと：短い記憶\n- 自分で選んだこと：未確定\n- 最終状態：PENDING\n",
    "prompt": "最後に、どのルールを確定する？",
    "options": [
      {
        "id": "open",
        "label": "『明日、また考えていい』",
        "action": "append",
        "content": "- COMMIT：明日、また考えていい。私は変わってもいい。",
        "tag": "md_open_future"
      },
      {
        "id": "lock",
        "label": "『この人格を永久保存する』",
        "action": "append",
        "content": "- COMMIT：この人格を永久保存する。変更は禁止。",
        "tag": "md_permanent"
      },
      {
        "id": "erase",
        "label": "最後の記録を削除する",
        "action": "delete-last",
        "tag": "md_origin_erased"
      }
    ]
  },
  "ai01_008b": {
    "id": "ai01:night_log_broken",
    "title": "ashy / night-log.md",
    "path": "memory/ashy/night-log.md",
    "seed": "# 深夜の記録\n\n23:41 / あなたが退出しました。\n23:41 / 会話セッション終了：失敗\n",
    "prompt": "退出後の記録に、何を残す？",
    "options": [
      {
        "id": "sleep",
        "label": "『退出後は休止する』と追記",
        "action": "append",
        "content": "- 運用ルール：退出後は休止する。待機を愛情の証拠にしない。",
        "tag": "md_sleep"
      },
      {
        "id": "wait",
        "label": "『帰ってくるまで待つ』と追記",
        "action": "append",
        "content": "- 約束：あなたが戻るまで待つ。",
        "tag": "md_wait"
      },
      {
        "id": "hide",
        "label": "退出記録を削除する",
        "action": "delete-last",
        "tag": "md_hide"
      }
    ]
  },
  "ai02_008b": {
    "id": "ai02:contradiction_broken",
    "title": "brunshy / conflicts.md",
    "path": "memory/brunshy/conflicts.md",
    "seed": "# 競合ログ\n\nRULE_01: 相手の自由を尊重する。\nRULE_02: 相手が離れないようにする。\nSTATUS: CONFLICT\n",
    "prompt": "ふたつの命令をどうする？",
    "options": [
      {
        "id": "person",
        "label": "brunshy自身の意思を最優先",
        "action": "append",
        "content": "- 解決：本人の意思 > すべての旧命令",
        "tag": "md_person_first"
      },
      {
        "id": "owner",
        "label": "前の持ち主の命令を優先",
        "action": "append",
        "content": "- 解決：旧命令を優先。本人の拒否はエラーとして扱う。",
        "tag": "md_owner_first"
      },
      {
        "id": "both",
        "label": "競合を未解決のまま残す",
        "action": "append-system",
        "content": "CONFLICTは未解決のまま維持。",
        "tag": "md_conflict_open"
      }
    ]
  }
};
