// 풍경 그림 원본(landscapes-src/<풍경>/{far,mid,near}.png)을 블로그용으로 다듬는다.
//   1) 하늘 자리의 초록(#00FF00) 배경을 투명하게 따내고 가장자리의 초록 번짐을 지운다
//   2) 위쪽의 빈 영역을 잘라낸다
//   3) 가로 2560px WebP로 줄여 public/img/landscapes/<풍경>/에 저장한다
//   4) 어떤 풍경에 어떤 레이어가 있는지 src/components/layout/landscape-assets.json에 적는다
//
// 사용법: pnpm landscapes

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SOURCE_DIR = path.join(ROOT, 'landscapes-src')
const OUTPUT_DIR = path.join(ROOT, 'public/img/landscapes')
const MANIFEST = path.join(ROOT, 'src/components/layout/landscape-assets.json')
const LAYERS = ['far', 'mid', 'near']
const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp']
const MAX_WIDTH = 2560

// 형광 초록(#00FF00)에 가까운 픽셀만 배경으로 본다. 그림 속 풀밭 같은 자연스러운 초록은 건드리지 않는다
//   - 초록이 아주 밝고(G ≥ 180) 빨강·파랑보다 140 이상 강하면 완전히 투명
//   - 70~140 사이는 가장자리로 보고 부드럽게 반투명 + 묻은 초록빛(스필)을 걷어낸다
const KEY_MIN_GREEN = 180
const KEY_HARD = 140
const KEY_SOFT = 70

function chromaKey(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const greenness = g - Math.max(r, b)
    if (g < KEY_MIN_GREEN || greenness <= KEY_SOFT) continue
    if (greenness >= KEY_HARD) {
      data[i + 3] = 0
      continue
    }
    const keep = 1 - (greenness - KEY_SOFT) / (KEY_HARD - KEY_SOFT)
    data[i + 3] = Math.round(data[i + 3] * keep)
    data[i + 1] = Math.max(r, b) + Math.round(greenness * 0.2)
  }
}

// 위에서부터 내려오며 처음으로 보이는 픽셀이 있는 행
function firstVisibleRow(data, width, height) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) return y
    }
  }
  return height
}

async function processLayer(input, output) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  chromaKey(data)
  const top = Math.max(0, firstVisibleRow(data, info.width, info.height) - 4)
  const height = info.height - top
  if (height <= 0) throw new Error('초록을 따내고 나니 남은 그림이 없어요')

  const image = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left: 0, top, width: info.width, height })
    .resize({ width: Math.min(MAX_WIDTH, info.width), withoutEnlargement: true })
  const out = await image.webp({ quality: 82, alphaQuality: 90, effort: 5 }).toFile(output)
  return { width: out.width, height: out.height }
}

async function main() {
  if (!existsSync(SOURCE_DIR)) {
    console.log('landscapes-src 폴더가 없어요. landscapes-src/<풍경>/far.png 처럼 원본을 넣어 주세요.')
    return
  }

  // 원본이 없는 풍경(다른 컴퓨터에서 만든 것 등)은 지우지 않고 기존 목록에 이어 붙인다
  const manifest = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : {}
  const scenes = (await readdir(SOURCE_DIR, { withFileTypes: true })).filter((entry) => entry.isDirectory())

  for (const scene of scenes) {
    const files = await readdir(path.join(SOURCE_DIR, scene.name))
    for (const layer of LAYERS) {
      const file = files.find((name) => EXTENSIONS.some((ext) => name.toLowerCase() === `${layer}${ext}`))
      if (!file) continue
      await mkdir(path.join(OUTPUT_DIR, scene.name), { recursive: true })
      const size = await processLayer(
        path.join(SOURCE_DIR, scene.name, file),
        path.join(OUTPUT_DIR, scene.name, `${layer}.webp`),
      )
      manifest[scene.name] = { ...manifest[scene.name], [layer]: size }
      console.log(`✓ ${scene.name}/${layer}.webp  ${size.width}×${size.height}`)
    }
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`\n${Object.keys(manifest).length}개 풍경을 ${path.relative(ROOT, MANIFEST)}에 적었어요.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
