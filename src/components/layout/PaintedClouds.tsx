// 물감이 번진 듯한 수채 구름. 하늘(WebGL)과 풍경 사이에서 천천히 흘러간다.
// 날씨마다 구름 종류가 다르다: 맑음(뭉게구름·새털구름), 흐림(회색 뭉게구름·층적운),
// 비(비층구름·비 기둥), 뇌우(적란운·먹구름층), 눈(옅은 구름층), 안개(층운 띠).
// 색은 구름 종류 × 시간대로 정하고, CSS 변수로 그라데이션에 넘긴다

import type { CSSProperties, ReactNode } from 'react'

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const f1 = (v: number) => v.toFixed(1)
const circle = (cx: number, cy: number, r: number) =>
  `M${f1(cx - r)} ${f1(cy)}a${f1(r)} ${f1(r)} 0 1 0 ${f1(r * 2)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-r * 2)} 0`

/* ───────── 구름 모양 ───────── */

// 뭉게구름: 가운데가 높이 솟은 둥근 봉우리, 밑면은 살짝 평평하다 (viewBox 400×200)
function cumulusPath(seed: number) {
  const rand = mulberry32(seed)
  const bumps = 4 + Math.floor(rand() * 2)
  let d = ''
  for (let i = 0; i < bumps; i++) {
    const t = (i + 0.5) / bumps
    const r = 34 + Math.sin(t * Math.PI) * (46 + rand() * 18)
    d += circle(60 + t * 280, 170 - r * 0.85, r)
  }
  // 꼭대기에 봉우리를 더 얹어 몽글몽글하게 솟게 한다
  for (let i = 0; i < 3; i++) d += circle(140 + rand() * 120, 72 - rand() * 26, 26 + rand() * 18)
  return `${d}M70 150 Q 200 176 330 150 L 330 168 Q 200 180 70 168 Z`
}

// 층적운: 낮고 넓게 퍼진 둥근 덩어리들이 이어진 줄 (viewBox 600×120)
function stratocumulusPath(seed: number) {
  const rand = mulberry32(seed)
  const bumps = 8 + Math.floor(rand() * 4)
  let d = ''
  for (let i = 0; i < bumps; i++) {
    const t = (i + 0.5) / bumps
    const r = 22 + rand() * 16 + Math.sin(t * Math.PI) * 12
    d += circle(40 + t * 520, 74 - rand() * 12, r)
    // 아래쪽에도 겹쳐서 밑면이 평평한 판이 아니라 둥근 덩어리가 되게 한다
    d += circle(50 + t * 500 + rand() * 20, 88 + rand() * 6, r * 0.7)
  }
  return d
}

// 적란운: 넓은 밑동에서 두툼하게 솟아오른 몸통, 꼭대기는 모루처럼 옆으로 퍼진다 (viewBox 400×420)
function cumulonimbusPath(seed: number) {
  const rand = mulberry32(seed)
  let d = ''
  // 몸통: 아래는 넓고 위로 갈수록 조금씩 좁아지는 사다리꼴 안을 큰 덩어리로 빽빽하게 채운다
  for (let row = 0; row < 7; row++) {
    const y = 370 - row * 40
    const halfWidth = 170 - row * 11
    const count = 4 + (row < 3 ? 1 : 0)
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1)
      d += circle(200 + (t - 0.5) * 2 * halfWidth * 0.78 + (rand() - 0.5) * 16, y + (rand() - 0.5) * 14, 44 + rand() * 16 - row * 1.5)
    }
  }
  // 몸통과 모루를 잇는 목: 사이가 뜨면 버섯구름처럼 보인다
  for (let i = 0; i < 4; i++) d += circle(120 + i * 53 + (rand() - 0.5) * 10, 104 + (rand() - 0.5) * 10, 38 + rand() * 10)
  // 모루: 꼭대기에서 양옆으로 길고 평평하게 퍼진다
  // 원(반시계 방향)과 같은 방향으로 그려야 겹친 곳이 서로 지워지지 않는다
  d += 'M8 96 Q 30 120 110 116 Q 200 128 290 116 Q 380 112 396 84 Q 340 38 200 44 Q 60 52 8 96 Z'
  return d
}

// 비층구름: 화면 위를 덮는 구름층. 아랫면이 너덜너덜하게 늘어진다 (viewBox 1000×260, 가로로 늘여 쓴다)
function nimbostratusPath(seed: number) {
  const rand = mulberry32(seed)
  const points: string[] = []
  for (let x = 0; x <= 1000; x += 25) {
    const sag = Math.sin(x * 0.012 + seed) * 18 + Math.sin(x * 0.041 + seed * 2) * 10
    const tatter = rand() < 0.3 ? 20 + rand() * 30 : rand() * 10
    points.push(`${x} ${f1(170 + sag + tatter)}`)
  }
  let d = `M0 -20 L1000 -20 L${points.reverse().join(' L')} Z`
  // 아랫면에 매달린 덩어리
  for (let i = 0; i < 14; i++) d += circle(rand() * 1000, 160 + rand() * 30, 18 + rand() * 26)
  return d
}

// 새털구름: 높은 하늘에 붓으로 슥 그은 듯한 가는 줄, 끝이 갈고리처럼 휜다 (viewBox 400×120)
function cirrusPath(seed: number) {
  const rand = mulberry32(seed)
  let d = ''
  for (let i = 0; i < 5; i++) {
    const x = 20 + rand() * 120
    const y = 20 + i * 18 + rand() * 10
    const length = 180 + rand() * 160
    d += `M${f1(x)} ${f1(y)} q ${f1(length * 0.5)} ${f1(-10 - rand() * 10)} ${f1(length)} ${f1(6 + rand() * 8)} q ${f1(14)} ${f1(4)} ${f1(10 + rand() * 12)} ${f1(-14 - rand() * 8)} `
  }
  return d
}

// 층운·안개 띠: 낮게 길게 깔린 흐릿한 띠 (viewBox 800×60)
const STRATUS_PATH = 'M0 30 Q 120 8 300 18 Q 480 6 640 20 Q 760 12 800 28 Q 700 50 520 44 Q 340 56 180 46 Q 60 52 0 30 Z'

/* ───────── 색 ───────── */

type Species = 'cu' | 'cug' | 'sc' | 'scd' | 'ns' | 'cb' | 'ci' | 'st'
type Tone = { lit: string; shade: string }
type Palette = Record<'day' | 'dawn' | 'dusk' | 'night', Tone>

// 구름 종류 × 시간대. lit은 햇빛 받은 윗면, shade는 그늘진 아랫면
const PALETTES: Record<Species, Palette> = {
  // 맑은 날 뭉게구름: 새하얀 윗면
  cu: {
    day: { lit: '#ffffff', shade: '#b9c8da' },
    dawn: { lit: '#ffe0cf', shade: '#8d6a80' },
    dusk: { lit: '#ffd0b2', shade: '#7c5567' },
    night: { lit: '#4c5878', shade: '#1d2440' },
  },
  // 흐린 날 뭉게구름: 윗면도 잿빛
  cug: {
    day: { lit: '#e7eaef', shade: '#8f99a7' },
    dawn: { lit: '#b9a8b1', shade: '#5b4d5a' },
    dusk: { lit: '#b39ba2', shade: '#56404c' },
    night: { lit: '#363d53', shade: '#161a2a' },
  },
  // 층적운(밝은 회색)
  sc: {
    day: { lit: '#d6dbe2', shade: '#7f8897' },
    dawn: { lit: '#a3939d', shade: '#4d414f' },
    dusk: { lit: '#9c8790', shade: '#473640' },
    night: { lit: '#2d3345', shade: '#11141f' },
  },
  // 층적운(짙은 먹색)
  scd: {
    day: { lit: '#9ea6b1', shade: '#555c67' },
    dawn: { lit: '#786a76', shade: '#342b36' },
    dusk: { lit: '#72606a', shade: '#30252c' },
    night: { lit: '#232837', shade: '#0b0d14' },
  },
  // 비층구름·먹구름층
  ns: {
    day: { lit: '#8b939e', shade: '#4d545e' },
    dawn: { lit: '#675d68', shade: '#2e2830' },
    dusk: { lit: '#62545c', shade: '#2b2227' },
    night: { lit: '#1d2130', shade: '#090b12' },
  },
  // 적란운: 꼭대기는 햇빛에 밝고 밑동은 먹빛
  cb: {
    day: { lit: '#eef1f5', shade: '#3f454e' },
    dawn: { lit: '#f0c3ad', shade: '#2d252c' },
    dusk: { lit: '#eeb096', shade: '#2a2026' },
    night: { lit: '#48526d', shade: '#0a0c13' },
  },
  // 새털구름
  ci: {
    day: { lit: '#ffffff', shade: '#e6eef8' },
    dawn: { lit: '#ffd6c2', shade: '#f0b39e' },
    dusk: { lit: '#ffc49e', shade: '#ee9a78' },
    night: { lit: '#5b6790', shade: '#3a4466' },
  },
  // 층운·안개 띠
  st: {
    day: { lit: '#eef1f4', shade: '#cfd6dd' },
    dawn: { lit: '#a8989f', shade: '#7d6f78' },
    dusk: { lit: '#a08c93', shade: '#76646d' },
    night: { lit: '#2a3040', shade: '#1a1f2b' },
  },
}

const TIMES = ['day', 'dawn', 'dusk', 'night'] as const

// 시간대별로 구름 종류의 색 변수를 정한다. 기본(시간대 없음)은 낮
const COLOR_CSS = TIMES.map((time) => {
  const vars = (Object.keys(PALETTES) as Species[])
    .map((s) => `--${s}-lit:${PALETTES[s][time].lit};--${s}-shade:${PALETTES[s][time].shade}`)
    .join(';')
  const selector = time === 'day' ? '.painted-clouds' : `[data-time='${time}'] .painted-clouds`
  return `${selector}{${vars}}`
}).join('')

/* ───────── 날씨별 구성 ───────── */

type Weather = 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog'

// 날씨마다 보여줄 요소를 CSS로 고른다. data-weather가 없으면 맑음
const VISIBILITY_CSS = [
  '.pc{display:none}',
  ":root:not([data-weather]) .pc-clear{display:block}",
  ...(['clear', 'cloudy', 'rain', 'storm', 'snow', 'fog'] as Weather[]).map(
    (w) => `[data-weather='${w}'] .pc-${w}{display:block}`,
  ),
  // 흐린 날엔 뭉게구름도 잿빛으로
  "[data-weather='cloudy'] .painted-clouds{--cu-lit:var(--cug-lit);--cu-shade:var(--cug-shade)}",
  // 눈 오는 날의 구름층은 비구름보다 옅고 밝다
  "[data-weather='snow'] .painted-clouds{--ns-lit:var(--sc-lit);--ns-shade:var(--sc-shade)}",
  // 뇌우의 구름층은 더 짙다
  "[data-weather='storm'] .painted-clouds{--ns-lit:var(--scd-lit);--ns-shade:var(--scd-shade)}",
].join('')

const MOTION_CSS = [
  '@keyframes pc-drift{from{transform:translateX(-45vw)}to{transform:translateX(145vw)}}',
  '@keyframes pc-sway{from{transform:translateX(-3vw)}to{transform:translateX(3vw)}}',
  '.pc-drift{animation:pc-drift var(--duration) linear infinite;animation-delay:var(--delay)}',
  '.pc-sway{animation:pc-sway var(--duration) ease-in-out infinite alternate;animation-delay:var(--delay)}',
  '@media (prefers-reduced-motion: reduce){.pc-drift{animation:none;transform:translateX(var(--rest))}.pc-sway{animation:none}}',
].join('')

interface CloudSpec {
  species: Species
  d: string
  viewBox: string
  weathers: Weather[]
  top: number
  width: number
  opacity: number
  filter: 'soft' | 'sheet' | 'wisp' | 'band'
  motion: 'drift' | 'sway'
  duration: number
  delay: number
  /** 가로세로 비율을 무시하고 늘여 쓴다 (구름층) */
  stretch?: boolean
  height?: string
}

const random = mulberry32(2026)
const between = (min: number, max: number) => min + random() * (max - min)
// 처음 열었을 때 구름이 화면 안에 고르게 흩어져 있도록, 흘러가는 경로(-45vw~145vw) 중 20~80% 지점에 나눠 둔다
const drift = (i: number, n: number) => {
  const duration = between(420, 780)
  const progress = 0.2 + 0.6 * ((i + 0.5) / n) + between(-0.04, 0.04)
  return { motion: 'drift' as const, duration, delay: -duration * progress }
}

const CLOUDS: CloudSpec[] = [
  // 뭉게구름: 맑은 날엔 새하얗게 몇 개, 흐린 날엔 잿빛으로
  ...Array.from({ length: 7 }, (_, i) => ({
    species: 'cu' as const,
    d: cumulusPath(100 + i),
    viewBox: '0 0 400 200',
    weathers: (i < 6 ? ['clear', 'cloudy'] : ['cloudy']) as Weather[],
    top: between(6, 34),
    width: between(15, 26),
    opacity: 0.95,
    filter: 'soft' as const,
    ...drift(i, 7),
  })),
  // 새털구름: 높은 하늘
  ...Array.from({ length: 3 }, (_, i) => ({
    species: 'ci' as const,
    d: cirrusPath(200 + i),
    viewBox: '0 0 400 120',
    weathers: (i < 2 ? ['clear', 'cloudy'] : ['clear']) as Weather[],
    top: between(1, 14),
    width: between(22, 34),
    opacity: 0.55,
    filter: 'wisp' as const,
    ...drift(i, 3),
  })),
  // 층적운: 흐린 날의 넓은 회색 덩어리. 밝은 것과 짙은 것을 섞는다
  ...Array.from({ length: 9 }, (_, i) => ({
    species: (i % 3 === 0 ? 'scd' : 'sc') as Species,
    d: stratocumulusPath(300 + i),
    viewBox: '0 0 600 120',
    // 비·뇌우엔 짙은 먹색(scd)만, 흐림·눈엔 밝은 회색도 섞는다
    weathers: (i % 3 === 0 ? ['cloudy', 'rain', 'storm'] : ['cloudy', 'snow']) as Weather[],
    top: between(6, 46),
    width: between(28, 46),
    opacity: 0.92,
    filter: 'soft' as const,
    ...drift(i, 9),
  })),
  // 비층구름·먹구름층: 화면 위를 덮는다
  {
    species: 'ns',
    d: nimbostratusPath(3),
    viewBox: '0 0 1000 260',
    weathers: ['rain', 'storm', 'snow'],
    top: -2,
    width: 120,
    height: '40vh',
    opacity: 0.96,
    filter: 'sheet',
    stretch: true,
    motion: 'sway',
    duration: 90,
    delay: -20,
  },
  {
    species: 'ns',
    d: nimbostratusPath(7),
    viewBox: '0 0 1000 260',
    weathers: ['rain', 'storm'],
    top: 8,
    width: 130,
    height: '34vh',
    opacity: 0.7,
    filter: 'sheet',
    stretch: true,
    motion: 'sway',
    duration: 120,
    delay: -60,
  },
  // 적란운: 뇌우 때 탑처럼 솟는다
  ...Array.from({ length: 2 }, (_, i) => ({
    species: 'cb' as const,
    d: cumulonimbusPath(400 + i),
    viewBox: '0 0 400 420',
    weathers: ['storm'] as Weather[],
    top: i === 0 ? 4 : 16,
    width: i === 0 ? 34 : 24,
    opacity: 0.92,
    filter: 'soft' as const,
    motion: 'drift' as const,
    duration: i === 0 ? 900 : 760,
    delay: i === 0 ? -420 : -80,
  })),
  // 층운·안개 띠: 낮게 깔린다
  ...Array.from({ length: 5 }, (_, i) => ({
    species: 'st' as const,
    d: STRATUS_PATH,
    viewBox: '0 0 800 60',
    weathers: (i < 2 ? ['fog', 'snow'] : ['fog']) as Weather[],
    top: 34 + i * 7 + between(-2, 2),
    width: between(60, 90),
    opacity: 0.75,
    filter: 'band' as const,
    ...drift(i, 5),
  })),
]

// 번개: 구름 밑에서 땅까지 지그재그로 내리꽂히는 줄기와 곁가지 (viewBox 200×600)
function lightningPath(seed: number) {
  const rand = mulberry32(seed)
  let x = 100
  let y = 0
  const trunk = [`M${x} ${y}`]
  const branches: string[] = []
  while (y < 600) {
    x += (rand() - 0.5) * 46
    y += 18 + rand() * 30
    trunk.push(`L${f1(x)} ${f1(Math.min(y, 600))}`)
    // 가끔 옆으로 갈라지는 곁가지
    if (rand() < 0.22 && y < 460) {
      let bx = x
      let by = y
      const side = rand() < 0.5 ? -1 : 1
      const branch = [`M${f1(bx)} ${f1(by)}`]
      for (let k = 0; k < 3 + Math.floor(rand() * 3); k++) {
        bx += side * (10 + rand() * 20)
        by += 14 + rand() * 22
        branch.push(`L${f1(bx)} ${f1(by)}`)
      }
      branches.push(branch.join(''))
    }
  }
  return { trunk: trunk.join(''), branches: branches.join('') }
}

// 번개마다 주기와 치는 시점(주기 중 %)을 다르게 해서 가끔씩 불규칙하게 친다
const BOLTS = [
  { left: 58, top: 24, height: 46, width: 7, period: 11, at: 70, seed: 1 },
  { left: 22, top: 20, height: 50, width: 6, period: 17, at: 38, seed: 5 },
  { left: 80, top: 26, height: 42, width: 5, period: 23, at: 84, seed: 9 },
].map((bolt) => ({ ...bolt, ...lightningPath(bolt.seed) }))

// 번쩍: 한 번 크게 치고 곧바로 두어 번 더 깜빡인다
const boltKeyframes = (name: string, at: number, peak: number) =>
  `@keyframes ${name}{0%,${at}%{opacity:0}${at + 0.3}%{opacity:${peak}}${at + 0.8}%{opacity:${peak * 0.25}}${at + 1.2}%{opacity:${peak}}${at + 1.6}%{opacity:${peak * 0.4}}${at + 2}%{opacity:${peak * 0.8}}${at + 3}%,100%{opacity:0}}`

const LIGHTNING_CSS = [
  ...BOLTS.map((bolt, i) => boltKeyframes(`pc-bolt-${i}`, bolt.at, 1)),
  ...BOLTS.map((bolt, i) => boltKeyframes(`pc-bolt-flash-${i}`, bolt.at, 0.28)),
  ...BOLTS.map(
    (bolt, i) =>
      `.pc-bolt-${i}{opacity:0;animation:pc-bolt-${i} ${bolt.period}s linear infinite}.pc-bolt-flash-${i}{opacity:0;animation:pc-bolt-flash-${i} ${bolt.period}s linear infinite}`,
  ),
  '@media (prefers-reduced-motion: reduce){[class*=pc-bolt]{animation:none!important;opacity:0!important}}',
].join('')

// 비 기둥: 비구름 아래로 비스듬히 드리운 흐릿한 줄기 (비·뇌우)
const RAIN_SHAFTS = [
  { left: 8, width: 14, skew: -8 },
  { left: 38, width: 10, skew: -6 },
  { left: 66, width: 16, skew: -9 },
]

const FILTERS: Record<CloudSpec['filter'], string> = {
  soft: 'url(#pc-soft)',
  sheet: 'url(#pc-sheet)',
  wisp: 'url(#pc-wisp)',
  band: 'url(#pc-band)',
}

function Cloud({ cloud, index }: { cloud: CloudSpec; index: number }) {
  const weatherClasses = cloud.weathers.map((w) => `pc-${w}`).join(' ')
  const isWisp = cloud.filter === 'wisp'
  return (
    <div
      className={`pc pc-${cloud.motion} ${weatherClasses} absolute left-0`}
      style={
        {
          top: `${cloud.top}%`,
          width: `${cloud.width}vw`,
          height: cloud.height,
          left: cloud.stretch ? '-10vw' : undefined,
          opacity: cloud.opacity,
          '--duration': `${cloud.duration}s`,
          '--delay': `${cloud.delay}s`,
          '--rest': `${(index * 37) % 100}vw`,
        } as CSSProperties
      }
    >
      <svg
        viewBox={cloud.viewBox}
        preserveAspectRatio={cloud.stretch ? 'none' : undefined}
        className={`block w-full overflow-visible ${cloud.stretch ? 'h-full' : 'h-auto'}`}
        aria-hidden='true'
      >
        <path
          d={cloud.d}
          fill={isWisp ? 'none' : `url(#pc-fill-${cloud.species})`}
          stroke={isWisp ? `url(#pc-fill-${cloud.species})` : undefined}
          strokeWidth={isWisp ? 5 : undefined}
          strokeLinecap='round'
          filter={FILTERS[cloud.filter]}
        />
      </svg>
    </div>
  )
}

function Defs({ children }: { children: ReactNode }) {
  return (
    <svg
      className='absolute h-0 w-0'
      aria-hidden='true'
    >
      <defs>{children}</defs>
    </svg>
  )
}

export function PaintedClouds() {
  return (
    <div className='painted-clouds absolute inset-0 overflow-hidden'>
      <style>{COLOR_CSS + VISIBILITY_CSS + MOTION_CSS + LIGHTNING_CSS}</style>
      <Defs>
        {(Object.keys(PALETTES) as Species[]).map((s) => (
          <linearGradient
            key={s}
            id={`pc-fill-${s}`}
            x1='0'
            y1='0'
            x2='0'
            y2='1'
          >
            <stop offset={s === 'cb' ? '0.05' : '0.2'} style={{ stopColor: `var(--${s}-lit)` }} />
            <stop offset='1' style={{ stopColor: `var(--${s}-shade)` }} />
          </linearGradient>
        ))}
        {/* 뭉게구름·층적운·적란운: 크게 흔들고 부드럽게 번지게 해서 붓으로 적신 물감처럼 */}
        <filter id='pc-soft' x='-20%' y='-40%' width='140%' height='180%' colorInterpolationFilters='sRGB'>
          <feTurbulence type='fractalNoise' baseFrequency='0.018' numOctaves='4' seed='4' result='warp' />
          <feDisplacementMap in='SourceGraphic' in2='warp' scale='16' xChannelSelector='R' yChannelSelector='G' result='shape' />
          <feGaussianBlur in='shape' stdDeviation='2.5' result='soft' />
          <feTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='2' seed='12' result='grain' />
          <feColorMatrix in='grain' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.35 0 0 0 0.75' result='grainAlpha' />
          <feComposite in='soft' in2='grainAlpha' operator='in' />
        </filter>
        {/* 구름층: 가로로 길게 번지고 아랫면이 흐트러진다 */}
        <filter id='pc-sheet' x='-5%' y='-20%' width='110%' height='150%' colorInterpolationFilters='sRGB'>
          <feTurbulence type='fractalNoise' baseFrequency='0.006 0.03' numOctaves='4' seed='9' result='warp' />
          <feDisplacementMap in='SourceGraphic' in2='warp' scale='40' xChannelSelector='R' yChannelSelector='G' result='shape' />
          <feGaussianBlur in='shape' stdDeviation='5' />
        </filter>
        {/* 새털구름: 결 방향으로 가늘게 흩어진다 */}
        <filter id='pc-wisp' x='-10%' y='-60%' width='120%' height='220%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.02 0.12' numOctaves='3' seed='21' result='warp' />
          <feDisplacementMap in='SourceGraphic' in2='warp' scale='16' xChannelSelector='R' yChannelSelector='G' result='shape' />
          <feGaussianBlur in='shape' stdDeviation='2.2 1' />
        </filter>
        {/* 층운·안개 띠: 아주 흐릿하게 */}
        <filter id='pc-band' x='-10%' y='-100%' width='120%' height='300%'>
          <feTurbulence type='fractalNoise' baseFrequency='0.008 0.05' numOctaves='3' seed='31' result='warp' />
          <feDisplacementMap in='SourceGraphic' in2='warp' scale='24' xChannelSelector='R' yChannelSelector='G' result='shape' />
          <feGaussianBlur in='shape' stdDeviation='7' />
        </filter>
        {/* 번개 빛무리: 흐리게 번진 빛 위에 선명한 줄기를 겹친다 */}
        <filter id='pc-bolt-glow' x='-60%' y='-5%' width='220%' height='110%'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='6' result='glow' />
          <feMerge>
            <feMergeNode in='glow' />
            <feMergeNode in='glow' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <linearGradient id='pc-shaft' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' style={{ stopColor: 'var(--ns-shade)', stopOpacity: 0.55 }} />
          <stop offset='1' style={{ stopColor: 'var(--ns-shade)', stopOpacity: 0 }} />
        </linearGradient>
      </Defs>

      {/* 번개는 구름 뒤에서 내려와, 윗부분은 구름에 가려 구름 속에서 치는 것처럼 보인다 */}
      {BOLTS.map((bolt, i) => (
        <div
          key={`bolt-${i}`}
          className='pc pc-storm'
        >
          <div className={`pc-bolt-flash-${i} absolute inset-0 bg-white`} />
          <svg
            className={`pc-bolt-${i} absolute`}
            style={{ left: `${bolt.left}%`, top: `${bolt.top}%`, width: `${bolt.width}vw`, height: `${bolt.height}vh` }}
            viewBox='0 0 200 600'
            preserveAspectRatio='none'
            aria-hidden='true'
          >
            <g
              fill='none'
              stroke='#f4f6ff'
              strokeLinecap='round'
              strokeLinejoin='round'
              filter='url(#pc-bolt-glow)'
            >
              <path
                d={bolt.trunk}
                strokeWidth={4}
                // 가로세로를 다르게 늘여도 줄기 굵기가 일그러지지 않게
                vectorEffect='non-scaling-stroke'
              />
              <path
                d={bolt.branches}
                strokeWidth={2}
                // 가로세로를 다르게 늘여도 줄기 굵기가 일그러지지 않게
                vectorEffect='non-scaling-stroke'
                opacity={0.8}
              />
            </g>
          </svg>
        </div>
      ))}

      {/* 비 기둥은 구름층 뒤에서 아래로 드리운다 */}
      {RAIN_SHAFTS.map((shaft, i) => (
        <div
          key={`shaft-${i}`}
          className='pc pc-rain pc-storm absolute'
          style={{
            left: `${shaft.left}%`,
            top: '22vh',
            width: `${shaft.width}vw`,
            height: '48vh',
            transform: `skewX(${shaft.skew}deg)`,
          }}
        >
          <svg
            viewBox='0 0 100 100'
            preserveAspectRatio='none'
            className='block h-full w-full'
            aria-hidden='true'
          >
            <rect
              width='100'
              height='100'
              fill='url(#pc-shaft)'
              filter='url(#pc-band)'
            />
          </svg>
        </div>
      ))}

      {CLOUDS.map((cloud, i) => (
        <Cloud
          key={i}
          cloud={cloud}
          index={i}
        />
      ))}
    </div>
  )
}
