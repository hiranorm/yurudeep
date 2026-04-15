/**
 * convert-images-to-webp.js
 *
 * public/blogimg/ 以下の PNG/JPG を WebP に一括変換し、
 * src/content/posts/ 以下の記事内パス参照も書き換える。
 *
 * Usage:
 *   node scripts/convert-images-to-webp.js            # 実行
 *   node scripts/convert-images-to-webp.js --dry-run  # 確認のみ
 */

import fs from "fs/promises"
import path from "path"
import sharp from "sharp"

const BLOGIMG_DIR = "./public/blogimg"
const POSTS_DIR = "./src/content/posts"
const WEBP_QUALITY = 80
const DRY_RUN = process.argv.includes("--dry-run")

if (DRY_RUN) {
  console.log("[dry-run] 実ファイルへの変更は行いません\n")
}

// ディレクトリを再帰的に走査して条件に合うファイルを列挙
async function findFiles(dir, predicate) {
  const results = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...(await findFiles(fullPath, predicate)))
    } else if (predicate(entry.name)) {
      results.push(fullPath)
    }
  }
  return results
}

// --- Phase 1: 画像変換 ---
async function convertImages() {
  const imageFiles = await findFiles(
    BLOGIMG_DIR,
    (name) => /\.(png|jpe?g)$/i.test(name),
  )

  console.log(`=== 画像変換 (${imageFiles.length}件) ===`)

  let totalBefore = 0
  let totalAfter = 0

  for (const src of imageFiles) {
    const dest = src.replace(/\.(png|jpe?g)$/i, ".webp")
    const statBefore = await fs.stat(src)
    totalBefore += statBefore.size

    if (DRY_RUN) {
      console.log(`  [変換予定] ${src} → ${path.basename(dest)}`)
      continue
    }

    await sharp(src).webp({ quality: WEBP_QUALITY }).toFile(dest)
    const statAfter = await fs.stat(dest)
    totalAfter += statAfter.size

    const ratio = (((statBefore.size - statAfter.size) / statBefore.size) * 100).toFixed(1)
    console.log(
      `  ${path.relative(".", src)} → ${path.basename(dest)}  ${kb(statBefore.size)} → ${kb(statAfter.size)} (-${ratio}%)`,
    )

    await fs.unlink(src)
  }

  if (!DRY_RUN && imageFiles.length > 0) {
    const totalRatio = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)
    console.log(
      `\n合計: ${kb(totalBefore)} → ${kb(totalAfter)} (-${totalRatio}%)\n`,
    )
  } else if (DRY_RUN) {
    console.log("")
  }

  return imageFiles.length
}

// --- Phase 2: 記事内パス書き換え ---
async function rewritePosts() {
  const mdFiles = await findFiles(POSTS_DIR, (name) => name.endsWith(".md"))

  console.log(`=== 記事パス書き換え (対象 ${mdFiles.length}件を走査) ===`)

  // /blogimg/ 配下の .png/.jpg/.jpeg を .webp に置換する正規表現
  const pattern = /(\/blogimg\/[^\s)"'<>]+)\.(png|jpe?g)/gi

  let changedFiles = 0
  let totalReplacements = 0

  for (const filePath of mdFiles) {
    const original = await fs.readFile(filePath, "utf-8")
    const updated = original.replace(pattern, "$1.webp")

    if (original === updated) continue

    const count = (original.match(pattern) || []).length
    totalReplacements += count
    changedFiles++

    console.log(`  ${path.relative(".", filePath)}  (${count}箇所)`)

    if (!DRY_RUN) {
      await fs.writeFile(filePath, updated, "utf-8")
    } else {
      // dry-run: 書き換え箇所をプレビュー表示
      const lines = original.split("\n")
      lines.forEach((line, i) => {
        if (pattern.test(line)) {
          pattern.lastIndex = 0 // reset stateful regex
          console.log(`    L${i + 1}: ${line.trim()}`)
        }
        pattern.lastIndex = 0
      })
    }
  }

  console.log(
    `\n書き換え: ${changedFiles}ファイル / ${totalReplacements}箇所${DRY_RUN ? " (dry-run)" : ""}\n`,
  )
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`
}

// --- main ---
try {
  const imageCount = await convertImages()
  await rewritePosts()

  if (DRY_RUN) {
    console.log("--- dry-run 完了。実行するには --dry-run を外して再実行してください ---")
  } else {
    console.log(`--- 完了: ${imageCount}枚をWebPに変換し、記事パスを書き換えました ---`)
  }
} catch (err) {
  console.error("エラー:", err)
  process.exit(1)
}
