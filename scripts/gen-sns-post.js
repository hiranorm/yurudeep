import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://yurudeep.com";

const CATEGORY_HASHTAGS = {
	deeplearning: ["#機械学習", "#deeplearning"],
	aicoding: ["#AI駆動開発", "#ClaudeCode"],
	automation: ["#自動化"],
	devenv: ["#開発環境"],
	web: ["#Web開発"],
	review: ["#レビュー"],
	essay: ["#エッセイ"],
};

function parseFrontmatter(content) {
	const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
	if (!fmMatch) {
		throw new Error("frontmatter が見つかりません");
	}
	const fm = fmMatch[1];
	const body = fmMatch[2];

	const getField = (key) => {
		const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
		return m ? m[1].trim() : "";
	};

	const title = getField("title");
	const rawDesc = getField("description");
	const description = rawDesc.replace(/^['"]|['"]$/g, "");
	const category = getField("category");
	const draft = getField("draft") === "true";

	const tagsMatch = fm.match(/^tags:\s*\[([^\]]*)\]/m);
	const tags = tagsMatch
		? tagsMatch[1]
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
		: [];

	return { title, description, category, draft, tags, body };
}

function buildHashtags(category, tags) {
	const categoryTags = CATEGORY_HASHTAGS[category] ?? [];
	const postTags = tags.map((t) => `#${t.replace(/\s+/g, "")}`);
	return [...new Set([...categoryTags, ...postTags])].join(" ");
}

function buildPostText(summary, url, hashtags) {
	return `${summary}\n${url}\n${hashtags}`;
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const filePath = args.find((a) => !a.startsWith("--"));

if (!filePath) {
	console.error(
		"使い方: node scripts/gen-sns-post.js <記事ファイルパス> [--force]",
	);
	process.exit(1);
}

if (!fs.existsSync(filePath)) {
	console.error(`Error: ファイルが見つかりません: ${filePath}`);
	process.exit(1);
}

const content = fs.readFileSync(filePath, "utf-8");

let parsed;
try {
	parsed = parseFrontmatter(content);
} catch (err) {
	console.error(`Error: frontmatter のパースに失敗しました: ${err.message}`);
	process.exit(1);
}

const { title, description, category, draft, tags } = parsed;

if (draft) {
	console.warn(
		"⚠ draft: true の記事です。内容を確認してから投稿してください。",
	);
}

const slugMatch = filePath.match(/posts\/(\w+\/\d{4}\/\d{8})\.md$/);
if (!slugMatch) {
	console.error(`Error: パスから slug を取り出せませんでした: ${filePath}`);
	console.error("期待するパス形式: .../posts/{category}/{year}/{YYYYMMDD}.md");
	process.exit(1);
}

const slug = slugMatch[1];
const url = `${SITE_URL}/posts/${slug}/`;
const hashtags = buildHashtags(category, tags);

const xText = buildPostText(description, url, hashtags);
const bsText = buildPostText(description, url, hashtags);

// X / Bluesky とも URL とハッシュタグは文字数カウントから除外（URLは t.co 短縮で固定長、
// ハッシュタグは frontmatter から自動生成されるので、要約本文の長さだけが調整対象になる）
const xBodyLen = [...description].length;
const bsBodyLen = [...description].length;

if (xBodyLen > 280) {
	console.warn(
		`⚠ X 本文が ${xBodyLen} 文字です（目安280字、URL・ハッシュタグ除く）。要約の短縮を検討してください。`,
	);
}
if (bsBodyLen > 300) {
	console.warn(
		`⚠ Bluesky 本文が ${bsBodyLen} 文字です（上限300字、URL・ハッシュタグ除く）。要約の短縮を検討してください。`,
	);
}

const outPath = path.join("sns-posts", `${slug}.md`);
const outDir = path.dirname(outPath);

if (fs.existsSync(outPath) && !force) {
	console.error(`Error: 出力先が既に存在します: ${outPath}`);
	console.error("上書きするには --force を付けて実行してください。");
	process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const outputContent = `---
post: ${filePath}
url: ${url}
generated: ${today}
---

# ${title}

## X

${xText}

## Bluesky

${bsText}
`;

fs.writeFileSync(outPath, outputContent);

console.log(`✓ 生成完了: ${outPath}`);
console.log("");
console.log("--- X ---");
console.log(xText);
console.log("");
console.log("--- Bluesky ---");
console.log(bsText);
