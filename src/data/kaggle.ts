// Kaggleページに載せるコンペ実績（メダルを取ったものだけ）。
// 順位・チーム数は https://www.kaggle.com/hiranorm/competitions の表示に合わせる。
// 振り返り記事があれば retroSlug に記事のslug（posts/ 以下のパス、拡張子なし）を入れる。

export type Medal = "gold" | "silver" | "bronze";

/** ソロ参加かチーム参加か */
export type Entry = "solo" | "team";

export type KaggleCompetition = {
	slug: string;
	title: string;
	/** コンペの中身を一行で */
	summary: string;
	medal: Medal;
	entry: Entry;
	rank: number;
	teams: number;
	/** コンペの締切日（YYYY-MM-DD） */
	deadline: string;
	retroSlug?: string;
};

export const kaggleProfileUrl = "https://www.kaggle.com/hiranorm";

export const kaggleTier = "Competitions Expert";

export const kaggleCompetitions: KaggleCompetition[] = [
	{
		slug: "ai-agent-security-multi-step-tool-attacks",
		title: "AI Agent Security - Multi-Step Tool Attacks",
		summary:
			"ツールを使うAIエージェントに対して、再現できる多段階の攻撃パターンを見つけるコンペ。",
		medal: "silver",
		entry: "solo",
		rank: 111,
		teams: 4186,
		deadline: "2026-09-01",
		retroSlug: "deeplearning/2026/20260904",
	},
	{
		slug: "rogii-wellbore-geology-prediction",
		title: "ROGII - Wellbore Geology Prediction",
		summary:
			"掘削中の坑井データから地層を予測し、掘削の自動化につなげるコンペ。",
		medal: "silver",
		entry: "solo",
		rank: 230,
		teams: 6125,
		deadline: "2026-08-05",
		retroSlug: "deeplearning/2026/20260806",
	},
	{
		slug: "nvidia-nemotron-model-reasoning-challenge",
		title: "NVIDIA Nemotron Model Reasoning Challenge",
		summary:
			"NVIDIA Nemotron のオープンモデルで、新しいベンチマークの推論性能を競うコンペ。",
		medal: "bronze",
		entry: "solo",
		rank: 402,
		teams: 4185,
		deadline: "2026-06-15",
	},
	{
		slug: "arc-prize-2025",
		title: "ARC Prize 2025",
		summary:
			"見たことのないパズルを、少数の例から規則を見抜いて解くAIを作るコンペ。",
		medal: "silver",
		entry: "solo",
		rank: 14,
		teams: 1455,
		deadline: "2025-11-03",
	},
	{
		slug: "jigsaw-agile-community-rules",
		title: "Jigsaw - Agile Community Rules Classification",
		summary:
			"コミュニティごとのルールに照らして、投稿が違反かどうかを判定するコンペ。",
		medal: "bronze",
		entry: "solo",
		rank: 233,
		teams: 2445,
		deadline: "2025-10-23",
	},
	{
		slug: "stanford-rna-3d-folding",
		title: "Stanford RNA 3D Folding",
		summary: "RNAの塩基配列から、その3次元構造を予測するコンペ。",
		medal: "silver",
		entry: "solo",
		rank: 26,
		teams: 1516,
		deadline: "2025-09-24",
	},
	{
		slug: "make-data-count-finding-data-references",
		title: "Make Data Count - Finding Data References",
		summary:
			"論文中でデータセットが参照されている箇所を見つけ、その使われ方を分類するコンペ。",
		medal: "bronze",
		entry: "solo",
		rank: 67,
		teams: 1282,
		deadline: "2025-09-09",
	},
	{
		slug: "byu-locating-bacterial-flagellar-motors-2025",
		title: "BYU - Locating Bacterial Flagellar Motors 2025",
		summary:
			"細菌の3次元再構成画像から、べん毛モーターの位置を特定するコンペ。",
		medal: "bronze",
		entry: "solo",
		rank: 84,
		teams: 1136,
		deadline: "2025-06-04",
	},
	{
		slug: "drawing-with-llms",
		title: "Drawing with LLMs",
		summary: "お題の言葉から、LLMでSVG画像を描くパッケージを作るコンペ。",
		medal: "bronze",
		entry: "solo",
		rank: 90,
		teams: 1309,
		deadline: "2025-05-27",
		retroSlug: "deeplearning/2025/20250603",
	},
];
