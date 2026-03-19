# Rarity note

`data/cards.json` には実装をすぐ始められるように、暫定の rarity を入れています。
この rarity は Excel に明記されていなかったため、以下の方針で自動割り当てしています。

- ハイライト行を優先して UR / SSR / 一部SR に使用
- 残りの SR / R はクラスが偏りすぎないように分散
- lore はすべて `ログ断片未設定` を仮投入

確定レアリティやログ文がある場合は、
`data/cards.json` と `data/cards_source.json` を編集してから Codex に渡してください。

今回の自動割り当て件数:
- UR: 1
- SSR: 4
- SR: 14
- R: 28
- N: 47
