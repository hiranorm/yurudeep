import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://yurudeep.com";

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
	const draft = getField("draft") === "true";

	return { title, description, draft, body };
}

// 本文＋URLの1投稿にまとめる。本文とリプライに分ける方式も試したが、
// リーチ面で見合う効果がなかったので戻した。ハッシュタグは付けない（もう流行っていない）
function buildPostText(summary, url) {
	return `${summary}\n${url}`;
}

const X_LIMIT = 280;
const BS_LIMIT = 300;
const X_URL_WEIGHT = 23;

// X の重み付き文字数。日本語などの全角は2、ASCII等は1で数える
// （Twitter の weighted length 定義: 0x0000-0x10FF, 0x2000-0x200D,
//   0x2010-0x201F, 0x2032-0x2037 が重み1、それ以外は重み2）
function xWeightedLength(text) {
	// URL は t.co 短縮で一律23幅になるので、23文字分の半角に置き換えて数える
	const normalized = text.replace(
		/https?:\/\/\S+/g,
		"x".repeat(X_URL_WEIGHT),
	);
	let weight = 0;
	for (const ch of normalized) {
		const c = ch.codePointAt(0);
		const isNarrow =
			c <= 0x10ff ||
			(c >= 0x2000 && c <= 0x200d) ||
			(c >= 0x2010 && c <= 0x201f) ||
			(c >= 0x2032 && c <= 0x2037);
		weight += isNarrow ? 1 : 2;
	}
	return weight;
}

// Bluesky は CJK も等幅で1文字扱い。URL は短縮されず実長のまま数えられる
function bsLength(text) {
	return [...text].length;
}

function warnIfOver(label, actual, limit) {
	if (actual > limit) {
		console.warn(`⚠ ${label}が ${actual}/${limit} で超過しています。短縮してください。`);
	}
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

const { title, description, draft } = parsed;

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

const postText = buildPostText(description, url);

// URL込みで1投稿ぶんの長さを見る（X は t.co の23幅、Bluesky は実長で計算される）
const xLen = xWeightedLength(postText);
const bsLen = bsLength(postText);

warnIfOver("X 本文", xLen, X_LIMIT);
warnIfOver("Bluesky 本文", bsLen, BS_LIMIT);

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

本文の末尾にURLを置いた1投稿の形。ハッシュタグは付けない。
記事を読まなくても何か持ち帰れる内容にしてから投稿すること。

## X

${postText}

## Bluesky

${postText}
`;

fs.writeFileSync(outPath, outputContent);

console.log(`✓ 生成完了: ${outPath}`);
console.log("");
console.log(`--- X（${xLen}/${X_LIMIT}）---`);
console.log(postText);
console.log("");
console.log(`--- Bluesky（${bsLen}/${BS_LIMIT}）---`);
console.log(postText);
