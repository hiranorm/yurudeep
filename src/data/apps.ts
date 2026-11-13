// Appsページとナビバーのドロップダウンで共有するアプリ一覧。
// アプリを追加するときはここだけ編集すればよい。

export type App = {
	name: string;
	href: string;
	icon: string;
	/** 透過アイコンの下に敷く背景色（不透明アイコンなら不要） */
	iconBg?: string;
	tagline: string;
	description: string;
};

export type AppSection = {
	title: string;
	note: string;
	apps: App[];
};

export const mobileApps: App[] = [
	{
		name: "tanzaku",
		href: "/tanzaku/",
		icon: "/blogimg/apps/tanzaku.webp",
		tagline: "日本語を、縦に読もう。",
		description:
			"青空文庫・なろう・カクヨム等を縦書きで読めるAndroidブラウザアプリ。横書きサイトを本のような縦組みに自動変換する。",
	},
	{
		name: "chigusa",
		href: "/chigusa/",
		icon: "/blogimg/apps/chigusa.webp",
		tagline: "アイデアの種を、0 秒で土に埋める。",
		description:
			"思いついた瞬間に保存先を考えなくていいメモアプリ。タイトル・フォルダ・タグ不要で、あとから全文検索で掘り起こせるAndroidアプリ。",
	},
	{
		name: "sekimori",
		href: "/sekimori/",
		icon: "/blogimg/apps/sekimori.webp",
		tagline: "「必要なこと」より先に、本当にやりたいことを通す。",
		description:
			"朝いちばんに必ず通る動線=目覚ましを、やりたいことの第一関門にするAndroidアプリ。止めた瞬間にカウントが始まり、時間ぶん向き合ってはじめて手形が押せる。",
	},
];

export const webApps: App[] = [
	{
		name: "tobari",
		href: "/tobari/",
		icon: "/blogimg/apps/tobari.svg",
		tagline: "視界に、帳を下ろす。",
		description:
			"作業中・GPU処理中・深夜作業中に視界と情報を遮断する超軽量Webアプリ群。",
	},
	{
		name: "souten",
		href: "/souten/",
		icon: "/blogimg/apps/souten.svg",
		iconBg: "#1f2433",
		tagline: "思考を、撃ち溜める。",
		description:
			"会議中・授業中に湧く「調べたい欲」を一時バッファし、検索エンジンやAIへ一斉発射するクライアント完結Webアプリ。",
	},
	{
		name: "ema",
		href: "/ema/",
		icon: "/blogimg/apps/ema.webp",
		tagline: "願いを、現実に、結ぶ。",
		description:
			"願いをQRコードにして机に貼り、行動するたびにスキャンする。参拝の回数が、行動の回数になるデジタル絵馬。",
	},
];

// href が http(s) で始まるものは外部リンク（新しいタブで開く）として扱う
export const skills: App[] = [
	{
		name: "okureyasu",
		href: "https://github.com/hiranorm/okureyasu",
		icon: "/blogimg/apps/okureyasu.svg",
		tagline: "中身ははっきり、物言いははんなり。",
		description:
			"AIの話し言葉を京ことば（京都弁）に仕立てる Agent Skill。コードや数値は標準語のまま、話しかける部分だけを京ことばにする。いけずは一滴。",
	},
];

export const appSections: AppSection[] = [
	{ title: "スマホアプリ", note: "Android", apps: mobileApps },
	{ title: "Webアプリ", note: "ブラウザで動く", apps: webApps },
	{ title: "スキル", note: "AIエージェント向け", apps: skills },
];

export const isExternalApp = (app: App) => /^https?:\/\//.test(app.href);
