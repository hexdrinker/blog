import type { CSSProperties, ReactNode } from 'react'
import { LANDSCAPES, type Landscape as LandscapeId } from '@/lib/sky'
import LANDSCAPE_ASSETS from './landscape-assets.json'

// 방문자 위치에 따라 바뀌는 하늘 아래 풍경 (<html data-landscape>).
// 모든 풍경을 미리 그려두고 CSS로 하나만 보여준다.
//
// 색은 대기 원근법으로 정한다: 각 층은 "가까운 색(--ls-ink)"과 "지평선 하늘색(--ls-haze)"을
// 거리만큼 섞은 색이라, 멀수록 하늘에 녹아든다. 시간대·날씨는 이 두 색만 바꾼다

const W = 1440

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const n1 = (value: number) => Number(value.toFixed(1))
const rect = (x: number, y: number, w: number, h: number) => `M${n1(x)} ${n1(y)}h${n1(w)}v${n1(h)}h${n1(-w)}Z`

/** 중점 변위로 만든 자연스러운 산 능선. roughness가 클수록 가까운 산처럼 거칠다 */
function fractalRidge(seed: number, base: number, amplitude: number, roughness: number, height: number) {
  const rand = mulberry32(seed)
  const size = 256
  const values = new Array<number>(size + 1).fill(0)
  values[0] = rand()
  values[size] = rand()
  for (let step = size, scale = 1; step > 1; step /= 2, scale *= roughness) {
    for (let i = step / 2; i < size; i += step) {
      values[i] = (values[i - step / 2] + values[i + step / 2]) / 2 + (rand() - 0.5) * scale
    }
  }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const ys = values.map((v) => n1(base - ((v - min) / (max - min)) * amplitude))
  const points = ys.map((y, i) => `${n1((i / size) * W)} ${y}`)
  // 붓 번짐 필터가 가장자리를 안쪽으로 밀어도 틈이 생기지 않게 화면 밖까지 늘린다
  return `M-40 ${height + 40} L-40 ${ys[0]} L${points.join(' L')} L${W + 40} ${ys[size]} L${W + 40} ${height + 40} Z`
}

/** 완만한 모래 언덕 */
function dunePath(seed: number, base: number, amplitude: number, height: number) {
  const rand = mulberry32(seed)
  const waves = Array.from({ length: 3 }, (_, i) => ({
    frequency: (0.0025 + rand() * 0.002) * 1.8 ** i,
    phase: rand() * Math.PI * 2,
    weight: 0.5 ** i,
  }))
  const points: string[] = []
  for (let x = 0; x <= W; x += 16) {
    const h = waves.reduce((sum, wave) => sum + Math.sin(x * wave.frequency + wave.phase) * wave.weight, 0)
    points.push(`${x} ${n1(base - h * amplitude)}`)
  }
  return {
    fill: `M-40 ${height + 40} L-40 ${points[0].split(' ')[1]} L${points.join(' L')} L${W + 40} ${points[points.length - 1].split(' ')[1]} L${W + 40} ${height + 40} Z`,
    crest: `M${points.join(' L')}`,
  }
}

/**
 * 스카이라인. 가운데(center)로 갈수록 높아지고, 큰 건물은 층층이 좁아지거나 안테나가 있다.
 * 밤 불빛은 격자 대신 건물 안에 흩뿌린 작은 점이다
 */
function skyline(
  seed: number,
  x0: number,
  x1: number,
  base: number,
  maxHeight: number,
  { center = (x0 + x1) / 2, spread = (x1 - x0) / 2.5, minWidth = 9, maxWidth = 30 } = {},
) {
  const rand = mulberry32(seed)
  let d = ''
  let lights = ''
  let x = x0
  while (x < x1) {
    const w = minWidth + rand() * (maxWidth - minWidth)
    const falloff = Math.exp(-(((x - center) / spread) ** 2))
    const h = maxHeight * (0.18 + 0.82 * falloff) * (0.45 + rand() * 0.55)
    const top = base - h
    d += rect(x, top, w, h)
    if (h > maxHeight * 0.45 && rand() < 0.5) {
      const inset = w * (0.15 + rand() * 0.15)
      const extra = h * (0.08 + rand() * 0.12)
      d += rect(x + inset, top - extra, w - inset * 2, extra)
      if (rand() < 0.35) d += rect(x + w / 2 - 0.5, top - extra - h * 0.12, 1, h * 0.12)
    }
    const count = Math.floor(((w * h) / 320) * (0.4 + rand() * 0.6))
    for (let i = 0; i < count; i++) {
      const lx = x + 2 + Math.floor((rand() * (w - 4)) / 3) * 3
      const ly = top + 3 + Math.floor((rand() * (h - 6)) / 4) * 4
      lights += rect(lx, ly, 1.3, 1.7)
    }
    x += w + 0.5 + rand() * 1.5
  }
  return { d, lights }
}

// 거리(0: 가까움 ~ 100: 지평선)만큼 하늘색을 섞은 색
const tone = (haze: number, lift = 0) =>
  `color-mix(in oklab, var(--ls-ink), var(--ls-haze) ${Math.min(100, haze + lift)}%)`

// 층마다 쓰는 거리 값. 아래쪽을 조금 더 밝게 해서 골짜기에 안개가 낀 듯한 깊이감을 준다
const DEPTHS = [80, 66, 52, 38, 24, 12, 4] as const
type Depth = (typeof DEPTHS)[number]

// 그라데이션 색은 정의된 위치의 CSS 변수를 따르므로, 장면마다 자기 그라데이션을 둔다
function fillsFor(id: LandscapeId) {
  return {
    depth: (depth: Depth) => `url(#ls-${id}-depth-${depth})`,
    snowcap: `url(#ls-${id}-snowcap)`,
    water: `url(#ls-${id}-water)`,
    mist: `url(#ls-${id}-mist)`,
  }
}

function SceneDefs({ id }: { id: LandscapeId }) {
  return (
    <defs>
      {DEPTHS.map((depth) => (
        <linearGradient key={depth} id={`ls-${id}-depth-${depth}`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' style={{ stopColor: tone(depth) }} />
          <stop offset='1' style={{ stopColor: tone(depth, 14) }} />
        </linearGradient>
      ))}
      {/* 봉우리 위쪽만 하얗게: 위는 눈빛, 35% 아래부터는 투명 */}
      <linearGradient id={`ls-${id}-snowcap`} x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' style={{ stopColor: 'color-mix(in oklab, #ffffff, var(--ls-haze) 35%)', stopOpacity: 0.9 }} />
        <stop offset='0.35' style={{ stopColor: 'color-mix(in oklab, #ffffff, var(--ls-haze) 55%)', stopOpacity: 0 }} />
      </linearGradient>
      {/* 골짜기에 번진 안개 띠: 가운데만 하늘색, 위아래는 투명 */}
      <linearGradient id={`ls-${id}-mist`} x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' style={{ stopColor: tone(100), stopOpacity: 0 }} />
        <stop offset='0.5' style={{ stopColor: tone(100, 0), stopOpacity: 0.75 }} />
        <stop offset='1' style={{ stopColor: tone(100), stopOpacity: 0 }} />
      </linearGradient>
      <linearGradient id={`ls-${id}-water`} x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' style={{ stopColor: tone(70) }} />
        <stop offset='1' style={{ stopColor: tone(20) }} />
      </linearGradient>
    </defs>
  )
}

// 시간대·날씨별 가까운 색과 지평선 색
const TONES = [
  '[--ls-ink:#34465a] [--ls-haze:#c9d7e4]',
  // 노을 하늘의 지평선(짙은 적갈색)에 맞춘다. 더 밝으면 풍경이 하늘보다 떠 보인다
  'dawn:[--ls-ink:#110c16] dawn:[--ls-haze:#6e4450]',
  'dusk:[--ls-ink:#100a14] dusk:[--ls-haze:#6a3a40]',
  'night:[--ls-ink:#05070f] night:[--ls-haze:#1a2240]',
  'overcast:[--ls-haze:#aeb7c1] night:overcast:[--ls-haze:#141824]',
  'fog:[--ls-haze:#d9dee4] night:fog:[--ls-haze:#1f2433]',
  // 흐린 새벽·저녁: 노을이 가려진 어두운 잿빛 (overcast·fog보다 뒤에 둬서 이긴다)
  'dawn:overcast:[--ls-haze:#5d5561] dusk:overcast:[--ls-haze:#574d57]',
  'dawn:fog:[--ls-haze:#7a6f78] dusk:fog:[--ls-haze:#74666d]',
].join(' ')

const LIGHTS = 'opacity-0 transition-opacity duration-1000 dawn:opacity-30 dusk:opacity-70 night:opacity-100'

function Lights({ d }: { d: string }) {
  return (
    <path
      d={d}
      className={`fill-[#ffd9a0] ${LIGHTS}`}
    />
  )
}

// 높은 탑 꼭대기의 작은 항공 장애등
function Beacon({ x, y }: { x: number; y: number }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={1.4}
      className={`landscape-beacon fill-[#ff6a5c] ${LIGHTS}`}
    />
  )
}

// 붓 번짐 정도. wash: 산처럼 크게 번짐, fine: 건물처럼 형태를 알아볼 만큼만
const BRUSH = { wash: 'url(#ls-brush)', fine: 'url(#ls-brush-fine)' } as const

function Layer({
  scene,
  d,
  depth,
  className,
  style,
  fillRule,
  brush = 'wash',
}: {
  scene: LandscapeId
  d: string
  depth: Depth
  className?: string
  style?: CSSProperties
  fillRule?: 'evenodd'
  brush?: keyof typeof BRUSH
}) {
  const fills = fillsFor(scene)
  return (
    <path
      d={d}
      fill={fills.depth(depth)}
      filter={BRUSH[brush]}
      fillRule={fillRule}
      className={className}
      style={style}
    />
  )
}

// 산 사이에 번진 안개 띠
function Mist({ scene, y, height = 46 }: { scene: LandscapeId; y: number; height?: number }) {
  return (
    <rect
      x={-40}
      y={y - height / 2}
      width={W + 80}
      height={height}
      fill={fillsFor(scene).mist}
      filter='url(#ls-cloud-edge)'
    />
  )
}

// 물: 지평선 쪽은 하늘색, 가까울수록 짙어진다. 해·달이 뜬 오른쪽으로 윤슬이 반짝인다
function Water({ scene, y, height, glitterX = 1100 }: { scene: LandscapeId; y: number; height: number; glitterX?: number }) {
  const fills = fillsFor(scene)
  const rand = mulberry32(y)
  const glitter = Array.from({ length: 26 }, (_, i) => {
    const t = i / 26
    const yy = y + 3 + t * (height - y - 4)
    const w = 6 + t * 40 + rand() * 20
    return rect(glitterX - w / 2 + (rand() - 0.5) * (20 + t * 60), yy, w, 0.9 + t)
  }).join('')
  return (
    <>
      <rect x={0} y={y} width={W} height={height - y} fill={fills.water} />
      <path d={glitter} className='fill-white opacity-25 dusk:fill-[#ffc38f] dusk:opacity-50 dawn:fill-[#ffc9a3] dawn:opacity-45 night:fill-[#cfd8f5] night:opacity-15 overcast:opacity-0' />
    </>
  )
}

function Scene({ id, height, className = '', children }: { id: LandscapeId; height: number; className?: string; children: ReactNode }) {
  return (
    <svg
      // 붓 번짐으로 봉우리가 영역 위로 조금 넘쳐도 잘리지 않게 한다
      overflow='visible'
      className={`landscape-scene landscape-${id} absolute inset-x-0 bottom-0 w-full ${height > 320 ? 'h-[34vh] min-h-[210px]' : 'h-[28vh] min-h-[170px]'} ${className}`}
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio='xMidYMax slice'
      aria-hidden='true'
    >
      <SceneDefs id={id} />
      {children}
    </svg>
  )
}

/* ───────── 지형 ───────── */

const HILLS = [
  fractalRidge(21, 170, 70, 0.5, 320),
  fractalRidge(22, 200, 60, 0.52, 320),
  fractalRidge(23, 232, 50, 0.55, 320),
  fractalRidge(24, 262, 40, 0.58, 320),
  fractalRidge(25, 292, 30, 0.62, 320),
]

function Hills() {
  return (
    <Scene id='hills' height={320}>
      {HILLS.map((d, i) => (
        <g key={i}>
          <Layer scene='hills' d={d} depth={DEPTHS[i]} />
          {i < 3 && <Mist scene='hills' y={[196, 228, 258][i]} />}
        </g>
      ))}
    </Scene>
  )
}

const ALPINE = [
  fractalRidge(91, 176, 120, 0.56, 320),
  fractalRidge(92, 206, 100, 0.58, 320),
  fractalRidge(93, 236, 80, 0.6, 320),
  fractalRidge(94, 276, 50, 0.64, 320),
  fractalRidge(95, 304, 26, 0.66, 320),
]

function Snowcap({ scene, d, className }: { scene: LandscapeId; d: string; className?: string }) {
  // 밤엔 달빛 정도로만 희게. 낮처럼 빛나면 캄캄한 풍경에서 눈만 떠 보인다
  return <path d={d} fill={fillsFor(scene).snowcap} className={`night:opacity-35 ${className ?? ''}`} />
}

function Alpine() {
  return (
    <Scene id='alpine' height={320}>
      {/* 먼 봉우리는 꼭대기가 눈으로 하얗게 바랜다 */}
      <Layer scene='alpine' d={ALPINE[0]} depth={80} />
      <Snowcap scene='alpine' d={ALPINE[0]} />
      <Layer scene='alpine' d={ALPINE[1]} depth={66} />
      <Snowcap scene='alpine' d={ALPINE[1]} className='opacity-70' />
      {ALPINE.slice(2).map((d, i) => (
        <Layer scene='alpine' key={i} d={d} depth={DEPTHS[i + 2]} />
      ))}
    </Scene>
  )
}

const SNOW = [
  fractalRidge(101, 170, 100, 0.55, 320),
  fractalRidge(102, 214, 70, 0.56, 320),
  fractalRidge(103, 256, 44, 0.5, 320),
  fractalRidge(104, 292, 22, 0.45, 320),
]

function Snow() {
  // 설원은 가까운 색도 밝은 청회색이다
  return (
    <Scene id='snow' height={320} className='[--ls-ink:#7b8ca3] dawn:[--ls-ink:#2e2640] dusk:[--ls-ink:#2b233b] night:[--ls-ink:#10162a]'>
      {SNOW.map((d, i) => (
        <g key={i}>
          <Layer scene='snow' d={d} depth={DEPTHS[i]} />
          <Snowcap scene='snow' d={d} className={i < 2 ? 'opacity-90' : 'opacity-60'} />
        </g>
      ))}
    </Scene>
  )
}

const DUNES = [dunePath(111, 226, 18, 320), dunePath(112, 252, 22, 320), dunePath(113, 282, 26, 320), dunePath(114, 308, 16, 320)]

function Desert() {
  return (
    <Scene id='desert' height={320} className='[--ls-ink:#6a4a34] [--ls-haze:#e8cda6] dawn:[--ls-ink:#1a0f14] dawn:[--ls-haze:#7c4a3e] dusk:[--ls-ink:#180d12] dusk:[--ls-haze:#7a4636] night:[--ls-ink:#07070f] night:[--ls-haze:#231f33]'>
      {DUNES.map((dune, i) => (
        <g key={i}>
          <Layer scene='desert' d={dune.fill} depth={DEPTHS[i + 1]} />
          {/* 모래 언덕 능선에 비치는 옅은 빛 */}
          <path d={dune.crest} fill='none' strokeWidth={1.2} style={{ stroke: tone(DEPTHS[i + 1], 22) }} className='opacity-60' />
        </g>
      ))}
    </Scene>
  )
}

const COAST = [fractalRidge(81, 236, 40, 0.5, 320), fractalRidge(82, 250, 26, 0.55, 320)]

function Coast() {
  return (
    <Scene id='coast' height={320}>
      <Layer scene='coast' d={COAST[0]} depth={80} />
      <Layer scene='coast' d={COAST[1]} depth={66} />
      <Water scene='coast' y={262} height={320} />
      {/* 양옆의 어두운 곶 */}
      <Layer scene='coast' d='M0 320 L0 238 Q 60 226 130 244 Q 200 262 260 320 Z' depth={12} />
      <Layer scene='coast' d='M1440 320 L1440 230 Q 1360 222 1290 246 Q 1230 266 1190 320 Z' depth={4} />
    </Scene>
  )
}

/* ───────── 랜드마크 도시 ───────── */

const SEOUL = {
  bukhansan: fractalRidge(7, 300, 110, 0.55, 420),
  far: skyline(11, 300, 1300, 386, 70, { center: 980 }),
  near: skyline(12, 0, W, 398, 58, { center: 1150, minWidth: 14, maxWidth: 40 }),
}

function Seoul() {
  const tower = `${rect(717, 240, 6, 60)}${rect(709, 229, 22, 11)}${rect(719, 186, 2, 44)}`
  const lotte = 'M987 386 L991 200 Q 1000 150 1009 200 L1013 386 Z'
  return (
    <Scene id='seoul' height={420}>
      <Layer scene='seoul' brush='fine' d={SEOUL.bukhansan} depth={80} />
      {/* 남산과 N서울타워, 롯데월드타워 */}
      <Layer scene='seoul' brush='fine' d={`M560 386 Q 650 306 720 300 Q 790 306 880 386 Z${tower}`} depth={52} />
      <Layer scene='seoul' brush='fine' d={lotte + SEOUL.far.d} depth={38} />
      <Lights d={SEOUL.far.lights} />
      <Beacon x={720} y={186} />
      <Beacon x={1000} y={158} />
      <Layer scene='seoul' brush='fine' d={SEOUL.near.d} depth={12} />
      <Lights d={SEOUL.near.lights} />
      <Water scene='seoul' y={398} height={420} glitterX={1000} />
    </Scene>
  )
}

const BUSAN = {
  far: fractalRidge(22, 300, 60, 0.52, 420),
  shore: skyline(21, 1140, W, 352, 90, { center: 1300 }),
}
const BUSAN_CABLES = 'M120 338 Q 320 296 520 252 M520 252 Q 670 336 820 252 M820 252 Q 1000 296 1180 338'

function Busan() {
  const lct = 'M1226 352 L1226 128 L1248 138 L1248 352 Z M1254 352 L1254 146 L1276 156 L1276 352 Z M1282 352 L1282 156 L1302 166 L1302 352 Z'
  return (
    <Scene id='busan' height={420}>
      <Layer scene='busan' brush='fine' d={BUSAN.far} depth={80} />
      <Water scene='busan' y={344} height={420} glitterX={900} />
      {/* 광안대교 */}
      <Layer scene='busan' brush='fine' d={`${rect(110, 336, 1080, 4)}${rect(518, 250, 4, 90)}${rect(818, 250, 4, 90)}`} depth={38} />
      <path d={BUSAN_CABLES} fill='none' strokeWidth={1.1} style={{ stroke: tone(38) }} />
      <g className={LIGHTS}>
        {Array.from({ length: 36 }, (_, i) => (
          <circle key={i} cx={125 + i * 30} cy={335.5} r={0.9} fill='#fff1cc' />
        ))}
      </g>
      <Beacon x={520} y={250} />
      <Beacon x={820} y={250} />
      {/* 해운대 엘시티 */}
      <Layer scene='busan' brush='fine' d={BUSAN.shore.d} depth={24} />
      <Layer scene='busan' brush='fine' d={lct} depth={12} />
      <Lights d={BUSAN.shore.lights} />
      <Beacon x={1237} y={132} />
    </Scene>
  )
}

const TOKYO = {
  far: skyline(31, 480, W, 388, 110, { center: 980 }),
  near: skyline(32, 0, W, 404, 50, { minWidth: 12, maxWidth: 36 }),
}

function Tokyo() {
  const fuji = 'M40 388 Q 240 340 336 256 L424 256 Q 520 340 720 388 Z'
  const tokyoTower = `M618 404 Q 632 352 636 308 L639 256 L641 256 L644 308 Q 648 352 662 404 Z M627 404 Q 640 374 653 404 Z${rect(630, 322, 20, 5)}${rect(639.3, 220, 1.4, 38)}`
  const skytree = `M889 404 L895 158 L898 114 L902 114 L905 158 L911 404 Z${rect(892, 214, 16, 7)}${rect(894, 172, 12, 5)}${rect(899.2, 78, 1.6, 38)}`
  return (
    <Scene id='tokyo' height={420}>
      {/* 후지산: 정상부가 눈으로 하얗다 */}
      <Layer scene='tokyo' brush='fine' d={fuji} depth={80} />
      <Snowcap scene='tokyo' d={fuji} />
      <Layer scene='tokyo' brush='fine' d={TOKYO.far.d} depth={52} />
      <Lights d={TOKYO.far.lights} />
      <Layer scene='tokyo' brush='fine' d={tokyoTower} fillRule='evenodd' depth={38} />
      <Layer scene='tokyo' brush='fine' d={skytree} depth={38} />
      <Beacon x={640} y={220} />
      <Beacon x={900} y={78} />
      <Layer scene='tokyo' brush='fine' d={TOKYO.near.d} depth={12} />
      <Lights d={TOKYO.near.lights} />
    </Scene>
  )
}

const NEWYORK = {
  far: skyline(41, 160, 1320, 392, 150, { center: 900, spread: 360 }),
  near: skyline(42, 120, 1360, 392, 110, { center: 760, spread: 420, minWidth: 14, maxWidth: 36 }),
}

function NewYork() {
  const empire = `${rect(740, 242, 40, 150)}${rect(745, 222, 30, 20)}${rect(750, 205, 20, 17)}${rect(755, 192, 10, 13)}${rect(759, 150, 2, 42)}`
  const chrysler = `${rect(868, 232, 24, 160)}M868 232 L872 212 L876 212 L878 200 L882 200 L884 190 L886 200 L888 212 L892 232 Z${rect(879.6, 164, 0.8, 26)}`
  const wtc = `M1022 392 L1022 250 L1032 170 L1048 170 L1058 250 L1058 392 Z${rect(1039.2, 110, 1.6, 60)}`
  return (
    <Scene id='newyork' height={420}>
      <Layer scene='newyork' brush='fine' d={NEWYORK.far.d} depth={52} />
      <Lights d={NEWYORK.far.lights} />
      <Layer scene='newyork' brush='fine' d={empire + chrysler + wtc} depth={24} />
      <Layer scene='newyork' brush='fine' d={NEWYORK.near.d} depth={24} />
      <Lights d={NEWYORK.near.lights} />
      <Beacon x={760} y={150} />
      <Beacon x={1040} y={110} />
      <Water scene='newyork' y={392} height={420} glitterX={1040} />
    </Scene>
  )
}

const PARIS = {
  hills: fractalRidge(52, 360, 30, 0.5, 420),
  roofs: skyline(51, 0, W, 398, 42, { spread: 2000, minWidth: 26, maxWidth: 60 }),
}

function Paris() {
  const montmartre = `M220 386 Q 420 304 620 386 Z M398 320 Q 420 276 442 320 Z${rect(396, 318, 48, 14)}M372 328 Q 384 308 396 328 Z M444 328 Q 456 308 468 328 Z${rect(419, 264, 2, 14)}`
  const eiffel = `M820 398 Q 839 364 843 326 L853 244 L857 174 L859 114 L861 114 L863 174 L867 244 L877 326 Q 881 364 900 398 Z M833 398 Q 860 354 887 398 Z${rect(837, 324, 46, 4)}${rect(849, 242, 22, 3)}${rect(859.5, 90, 1, 26)}`
  return (
    <Scene id='paris' height={420}>
      <Layer scene='paris' brush='fine' d={PARIS.hills} depth={80} />
      <Layer scene='paris' brush='fine' d={montmartre} depth={66} />
      <Layer scene='paris' brush='fine' d={PARIS.roofs.d} depth={38} />
      <Lights d={PARIS.roofs.lights} />
      <Layer scene='paris' brush='fine' d={eiffel} fillRule='evenodd' depth={12} />
      <Beacon x={860} y={90} />
      <Water scene='paris' y={404} height={420} glitterX={1000} />
    </Scene>
  )
}

const LONDON = {
  far: skyline(61, 300, W, 395, 80, { center: 1100 }),
  near: skyline(62, 0, 500, 402, 50, { minWidth: 14, maxWidth: 34 }),
}

function London() {
  const parliament = `${rect(520, 356, 240, 39)}${Array.from({ length: 11 }, (_, i) => rect(531 + i * 22, 342, 2, 14)).join('')}${rect(522, 302, 22, 93)}M522 302 L533 288 L544 302 Z`
  const bigBen = `${rect(782, 216, 16, 179)}${rect(780, 206, 20, 20)}M780 206 L790 174 L800 206 Z${rect(789.4, 152, 1.2, 24)}`
  const shard = 'M1125 395 L1146 162 L1150 152 L1154 162 L1175 395 Z'
  const spokes = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2
    return `M960 290 L${n1(960 + Math.cos(angle) * 78)} ${n1(290 + Math.sin(angle) * 78)}`
  }).join(' ')
  return (
    <Scene id='london' height={420}>
      <Layer scene='london' brush='fine' d={LONDON.far.d} depth={52} />
      <Lights d={LONDON.far.lights} />
      <Layer scene='london' brush='fine' d={parliament + bigBen + shard} depth={24} />
      <Beacon x={1150} y={152} />
      {/* 런던 아이 */}
      <g fill='none' style={{ stroke: tone(24) }}>
        <circle cx={960} cy={290} r={78} strokeWidth={2} />
        <path d={spokes} strokeWidth={0.5} />
        <path d='M932 395 L960 290 L988 395' strokeWidth={2.4} />
      </g>
      <Layer scene='london' brush='fine' d={LONDON.near.d} depth={12} />
      <Lights d={LONDON.near.lights} />
      <Water scene='london' y={395} height={420} glitterX={1100} />
    </Scene>
  )
}

function quadPoints(p0: [number, number], c: [number, number], p1: [number, number], count: number) {
  return Array.from({ length: count }, (_, i) => {
    const t = (i + 1) / (count + 1)
    return [
      (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * p1[0],
      (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * p1[1],
    ] as [number, number]
  })
}

const GOLDEN_GATE: [[number, number], [number, number], [number, number]][] = [
  [[200, 330], [380, 280], [560, 205]],
  [[560, 205], [760, 322], [960, 205]],
  [[960, 205], [1140, 280], [1320, 330]],
]
const SF = {
  far: fractalRidge(72, 300, 60, 0.5, 420),
  mid: fractalRidge(73, 326, 34, 0.52, 420),
  city: skyline(71, 1180, W, 350, 70, { center: 1330 }),
}

function SanFrancisco() {
  const tower = (x: number) =>
    `${rect(x - 9, 200, 4, 150)}${rect(x + 5, 200, 4, 150)}${rect(x - 9, 216, 18, 3)}${rect(x - 9, 252, 18, 3)}${rect(x - 9, 292, 18, 3)}`
  const cables = GOLDEN_GATE.map(([a, c, b]) => `M${a[0]} ${a[1]} Q ${c[0]} ${c[1]} ${b[0]} ${b[1]}`).join(' ')
  const suspenders = GOLDEN_GATE.flatMap(([a, c, b]) =>
    quadPoints(a, c, b, 14).map(([x, y]) => `M${n1(x)} ${n1(y)} V330`),
  ).join(' ')
  // 금문교는 낮에만 주황빛이 살짝 돈다
  const bridgeColor = 'color-mix(in oklab, var(--ls-bridge), var(--ls-haze) 30%)'
  return (
    <Scene id='sanfrancisco' height={420} className='[--ls-bridge:#a8402c] dawn:[--ls-bridge:#3a1c20] dusk:[--ls-bridge:#3a1c20] night:[--ls-bridge:#0b0a12]'>
      <Layer scene='sanfrancisco' brush='fine' d={SF.far} depth={80} />
      <Layer scene='sanfrancisco' brush='fine' d={SF.mid} depth={66} />
      <Water scene='sanfrancisco' y={344} height={420} glitterX={1100} />
      <path d={`${rect(190, 330, 1140, 5)}${tower(560)}${tower(960)}`} style={{ fill: bridgeColor }} />
      <path d={cables} fill='none' strokeWidth={1.8} style={{ stroke: bridgeColor }} />
      <path d={suspenders} fill='none' strokeWidth={0.4} style={{ stroke: bridgeColor }} />
      <Beacon x={560} y={200} />
      <Beacon x={960} y={200} />
      <Layer scene='sanfrancisco' brush='fine' d={`${SF.city.d}M1300 350 L1310 252 L1320 350 Z`} depth={52} />
      <Lights d={SF.city.lights} />
    </Scene>
  )
}

/* ───────── 그림 에셋 ───────── */

type AssetLayer = 'far' | 'mid' | 'near'
type AssetManifest = Partial<Record<LandscapeId, Partial<Record<AssetLayer, { width: number; height: number }>>>>
const ASSETS = LANDSCAPE_ASSETS as AssetManifest

// 그림은 흐린 날 낮빛으로 그려져 있어서, 시간대 색은 필터로 입힌다 (그림 픽셀에만 적용돼 하늘은 그대로)
const TIME_GRADE = [
  'dawn:[filter:brightness(.74)_saturate(.9)_sepia(.28)_hue-rotate(-16deg)]',
  'dusk:[filter:brightness(.6)_saturate(.9)_sepia(.36)_hue-rotate(-22deg)_contrast(1.05)]',
  'night:[filter:sepia(.5)_hue-rotate(185deg)_saturate(.8)_brightness(.34)]',
].join(' ')
const WEATHER_GRADE = 'overcast:[filter:saturate(.72)_brightness(.93)] fog:[filter:saturate(.7)_contrast(.85)_brightness(1.05)]'

// 먼 산일수록 안개에 옅어지도록
const LAYER_OPACITY: Record<AssetLayer, string> = {
  far: 'opacity-90 fog:opacity-50',
  mid: 'fog:opacity-80',
  near: '',
}

function ImageScene({ id }: { id: LandscapeId }) {
  const layers = ASSETS[id] ?? {}
  return (
    // 화면 아래 절반에만 깔고, 위쪽 20%는 하늘로 서서히 녹아들게 한다
    <div className={`landscape-scene landscape-${id} absolute inset-x-0 bottom-0 h-[52vh] min-h-[280px] overflow-hidden [mask-image:linear-gradient(to_top,black_80%,transparent)] ${WEATHER_GRADE}`}>
      <div className={`absolute inset-0 transition-[filter] duration-1000 ${TIME_GRADE}`}>
        {(['far', 'mid', 'near'] as const).map((layer) =>
          layers[layer] ? (
            // 보이지 않는 풍경은 display:none이라 loading='lazy'면 내려받지 않는다
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={layer}
              src={`/img/landscapes/${id}/${layer}.webp`}
              alt=''
              width={layers[layer].width}
              height={layers[layer].height}
              loading='lazy'
              decoding='async'
              // 영역을 꽉 채우고 아래(땅)를 기준으로 맞춘다. 넘치는 위쪽·좌우는 잘린다
              className={`absolute inset-0 h-full w-full object-cover object-[50%_35%] ${LAYER_OPACITY[layer]}`}
            />
          ) : null,
        )}
      </div>
      {/* 사진은 디테일이 많아 글씨가 묻히므로 배경색 막을 반투명하게 얹는다 */}
      <div className='absolute inset-0 bg-background/55' />
    </div>
  )
}

// 그림이 있는 풍경은 그림으로, 없으면 코드로 그린 SVG로 보여준다
function Scenery({ id, children }: { id: LandscapeId; children: ReactNode }) {
  return ASSETS[id] ? <ImageScene id={id} /> : <>{children}</>
}

/* ───────── 조립 ───────── */

// 풍경마다 보여줄 SVG를 고르는 규칙. data-landscape가 없으면 산 능선
const VISIBILITY_CSS = [
  '.landscape-scene{display:none}',
  ':root:not([data-landscape]) .landscape-hills{display:block}',
  // WebGL이 3D 지형으로 그리는 풍경은 SVG를 숨긴다
  ...LANDSCAPES.map((id) => `[data-sky-terrain='${id}'] .landscape-${id}{display:none!important}`),
  ...LANDSCAPES.map((id) => `[data-landscape='${id}'] .landscape-${id}{display:block}`),
  '@keyframes landscape-blink{0%,55%,100%{opacity:1}65%,90%{opacity:.15}}',
  '[data-time=night] .landscape-beacon,[data-time=dusk] .landscape-beacon{animation:landscape-blink 2.4s ease-in-out infinite}',
  '@media (prefers-reduced-motion: reduce){.landscape-beacon{animation:none!important}}',
].join('')

export function Landscape() {
  return (
    <div className={`absolute inset-0 ${TONES}`}>
      <style>{VISIBILITY_CSS}</style>
      {/* 수채 필터. display:none인 SVG 안에 두면 참조가 깨지므로 따로 둔다 */}
      <svg
        className='absolute h-0 w-0'
        aria-hidden='true'
      >
        <defs>
          {/* 수채 붓 번짐: 윤곽을 흔들고(displacement), 안료 입자로 얼룩지게 하고, 가장자리에 안료가 고이게 한다 */}
          <filter id='ls-brush' x='-2%' y='-30%' width='104%' height='160%' colorInterpolationFilters='sRGB'>
            <feTurbulence type='fractalNoise' baseFrequency='0.006 0.035' numOctaves='3' seed='3' result='warp' />
            <feDisplacementMap in='SourceGraphic' in2='warp' scale='18' xChannelSelector='R' yChannelSelector='G' result='shape' />
            <feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' seed='8' result='grain' />
            <feColorMatrix in='grain' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.3 0 0 0 0.82' result='grainAlpha' />
            <feComposite in='shape' in2='grainAlpha' operator='in' result='grained' />
            <feMorphology in='shape' operator='erode' radius='1.4' result='inner' />
            <feComposite in='shape' in2='inner' operator='out' result='edge' />
            <feGaussianBlur in='edge' stdDeviation='1.6' result='edgeSoft' />
            <feComponentTransfer in='edgeSoft' result='edgeDark'>
              <feFuncR type='linear' slope='0.88' />
              <feFuncG type='linear' slope='0.88' />
              <feFuncB type='linear' slope='0.88' />
              <feFuncA type='linear' slope='0.6' />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in='grained' />
              <feMergeNode in='edgeDark' />
            </feMerge>
          </filter>
          {/* 건물용: 형태를 알아볼 만큼만 살짝 번진다 */}
          <filter id='ls-brush-fine' x='-2%' y='-10%' width='104%' height='120%' colorInterpolationFilters='sRGB'>
            <feTurbulence type='fractalNoise' baseFrequency='0.05' numOctaves='2' seed='5' result='warp' />
            <feDisplacementMap in='SourceGraphic' in2='warp' scale='2.5' xChannelSelector='R' yChannelSelector='G' result='shape' />
            <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='9' result='grain' />
            <feColorMatrix in='grain' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.25 0 0 0 0.85' result='grainAlpha' />
            <feComposite in='shape' in2='grainAlpha' operator='in' />
          </filter>
          {/* 안개·구름용: 크게 흔들고 부드럽게 번진다 */}
          <filter id='ls-cloud-edge' x='-10%' y='-60%' width='120%' height='220%' colorInterpolationFilters='sRGB'>
            <feTurbulence type='fractalNoise' baseFrequency='0.01 0.05' numOctaves='3' seed='11' result='warp' />
            <feDisplacementMap in='SourceGraphic' in2='warp' scale='30' xChannelSelector='R' yChannelSelector='G' />
            <feGaussianBlur stdDeviation='4' />
          </filter>
        </defs>
      </svg>
      <Scenery id='hills'><Hills /></Scenery>
      <Scenery id='coast'><Coast /></Scenery>
      <Scenery id='alpine'><Alpine /></Scenery>
      <Scenery id='snow'><Snow /></Scenery>
      <Scenery id='desert'><Desert /></Scenery>
      <Scenery id='seoul'><Seoul /></Scenery>
      <Scenery id='busan'><Busan /></Scenery>
      <Scenery id='tokyo'><Tokyo /></Scenery>
      <Scenery id='newyork'><NewYork /></Scenery>
      <Scenery id='paris'><Paris /></Scenery>
      <Scenery id='london'><London /></Scenery>
      <Scenery id='sanfrancisco'><SanFrancisco /></Scenery>
    </div>
  )
}
