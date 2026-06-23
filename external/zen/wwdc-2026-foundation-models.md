---
title: "WWDC 2026 Foundation Models — モデルが差し替え可能な部品になった"
emoji: "🧠"
type: "tech"
topics: ["wwdc", "ios", "swift", "foundationmodels", "ai"]
published: false
---

WWDC 2026で発表された Foundation Models フレームワークは、名前こそ2025と同じだが、中身は別物に近い形に作り替えられていた。

2025は「Appleのオンデバイス3Bモデルか、なし」の二択だった。2026では `LanguageModel` プロトコルを軸とした抽象化レイヤに変わり、その下に System（オンデバイス）／ Private Cloud Compute ／ Claude ／ Gemini ／ Core AI ／ MLX が差し替え可能な状態でぶら下がる構図になった。一言でいうと、モデルがアプリの依存ではなく、差し替え可能な部品になった。

![Foundation Models — Apple's in-app AI strategy just changed](https://yurudeep.com/blogimg/foundation-models-ja/slide-01.webp)

## `LanguageModel` プロトコルが幹

`LanguageModel` というSwiftプロトコルが新設され、これに準拠するモデルなら何でも `LanguageModelSession` のバックに置ける。セッション側のロジックは1度書けば、その下に差し込むモデル（バッキング）を後から差し替えできる。

```swift
import FoundationModels

// On-device — 無料、ネットワーク不要
let model = SystemLanguageModel()
// Private Cloud Compute
// let model = PrivateCloudComputeLanguageModel()
// Claude / Gemini / Core AI / MLX も同じ並びで差し替え

let session = LanguageModelSession(model: model)
let response = try await session.respond(to: "...")
```

オンデバイスで作り、重いクエリだけクラウドに回す——書き換えではなく依存差し替えで実現できる、というのがこの一連のAPIの眼目。

![主役はLanguageModelプロトコル — System / PCC は準拠済み、サードパーティはLanguageModelExecutorを実装してSwift Packageで配布](https://yurudeep.com/blogimg/foundation-models-ja/slide-03.webp)

## Claude / Gemini が一級市民

サードパーティモデルは公式Swiftパッケージとしてプロトコル実装が配布される。GeminiはFirebase Apple SDK経由。Appleが明示的にガイドラインを出していて、認証はOAuth + Keychain、APIキーをバイナリに焼かない、というルールが添えられている。Swift Package Manager経由で組み込むので、ダウンストリームのコードは触らずに済む。

## Dynamic Profiles と Core AI

エージェント的なワークフロー向けのプリミティブとしてDynamic Profilesが追加された。1つのセッション履歴を保ったまま、`.light` ／ `.moderate` ／ `.deep` のreasoning levelを切り替えながらモデルとツールを宣言的に差し替えできる。軽いtriageはSystemで `.light`、深いreasoningはPCCで `.deep`、という使い分けが `session.history` を共有したまま成立する。

Foundation ModelsがHigh-level層なら、Core AIはLow-levelの脱出ハッチで、任意のオープンモデル（Qwen, Mistral, SAM3 ...）をApple Silicon上で動かせる。AOTコンパイル ＋ PyTorch → Apple Siliconの変換ツーリングが付いてくる。

## 詳細はゆるディープに整理した

コスト構造（オンデバイス \$0、Small Business Program で月間アクティブ200万未満ならPCC無償）、Python SDK ／ `fm chat` CLI ／ Linux対応、画像入力・`OCRTool`・`BarcodeReaderTool`・Spotlight RAG、そしてスライド11枚をClaude Designで作った制作記録まで、踏み込んだ整理は本家ブログにまとめた。

https://yurudeep.com/posts/aicoding/2026/20260613/

ベータ時点の情報なのでAPIシンボルはGAまでに変わる可能性がある。実装前には公式ドキュメントで最終確認を。

---

著者は機械学習・AIコーディングについて書く個人ブログ「ゆるディープ」を運営しています。Claude CodeのカスタマイズやローカルLLM活用なども記事にしています。

https://yurudeep.com
