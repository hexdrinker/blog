// 물감이 번진 듯한 수채 구름. 하늘(WebGL)과 풍경 사이에서 천천히 흘러간다.
// 색은 시간대·날씨를 따르는 CSS 변수(--cl-lit: 햇빛 받은 윗면, --cl-shade: 그늘진 아랫면)로 칠한다

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 원 여러 개를 이어 붙인 뭉게구름. 아래쪽은 평평하게 눌러준다
function cloudPath(seed: number) {
  const rand = mulberry32(seed)
  const bumps = 5 + Math.floor(rand() * 4)
  let d = ''
  for (let i = 0; i < bumps; i++) {
    const t = (i + 0.5) / bumps
    const cx = 20 + t * 360
    const r = 22 + Math.sin(t * Math.PI) * (26 + rand() * 24) + rand() * 10
    const cy = 90 - r * 0.55
    d += `M${(cx - r).toFixed(1)} ${cy.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(r * 2).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-r * 2).toFixed(1)} 0`
  }
  return `${d}M20 72h360v26h-360Z`
}

const COLORS = [
  '[--cl-lit:#ffffff] [--cl-shade:#bccada]',
  'dawn:[--cl-lit:#f4c6b3] dawn:[--cl-shade:#6f4d62]',
  'dusk:[--cl-lit:#f1b196] dusk:[--cl-shade:#5e3b50]',
  'night:[--cl-lit:#34405f] night:[--cl-shade:#161b31]',
  'overcast:[--cl-lit:#c6ccd4] overcast:[--cl-shade:#838c98]',
  'night:overcast:[--cl-lit:#262b3b] night:overcast:[--cl-shade:#12151f]',
  // 흐린 새벽·저녁엔 노을빛이 잿빛 구름에 살짝만 비친다 (overcast보다 뒤에 둬서 이긴다)
  'dawn:overcast:[--cl-lit:#8e7f8c] dawn:overcast:[--cl-shade:#4a4251]',
  'dusk:overcast:[--cl-lit:#86737c] dusk:overcast:[--cl-shade:#43393f]',
].join(' ')

const random = mulberry32(2026)
// 앞의 5개는 맑은 날에도 떠 있고, 나머지는 흐린 날에만 더해진다
const CLOUDS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  d: cloudPath(100 + i),
  top: 4 + random() * 42,
  width: 18 + random() * 22,
  duration: 420 + random() * 360,
  delay: -random() * 780,
  opacity: 0.55 + random() * 0.35,
  always: i < 5,
}))

const CSS = [
  '@keyframes painted-cloud-drift{from{transform:translateX(-40vw)}to{transform:translateX(140vw)}}',
  '.painted-cloud{animation:painted-cloud-drift var(--duration) linear infinite;animation-delay:var(--delay)}',
  '@media (prefers-reduced-motion: reduce){.painted-cloud{animation:none;transform:translateX(var(--rest))}}',
].join('')

export function PaintedClouds() {
  return (
    <div className={`absolute inset-0 overflow-hidden ${COLORS}`}>
      <style>{CSS}</style>
      <svg
        className='absolute h-0 w-0'
        aria-hidden='true'
      >
        <defs>
          {/* 크게 흔들고 부드럽게 번지게 해서 붓으로 적신 물감처럼 */}
          <filter id='painted-cloud' x='-20%' y='-40%' width='140%' height='180%' colorInterpolationFilters='sRGB'>
            <feTurbulence type='fractalNoise' baseFrequency='0.012 0.03' numOctaves='4' seed='4' result='warp' />
            <feDisplacementMap in='SourceGraphic' in2='warp' scale='34' xChannelSelector='R' yChannelSelector='G' result='shape' />
            <feGaussianBlur in='shape' stdDeviation='3.5' result='soft' />
            <feTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='2' seed='12' result='grain' />
            <feColorMatrix in='grain' type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.5 0 0 0 0.62' result='grainAlpha' />
            <feComposite in='soft' in2='grainAlpha' operator='in' />
          </filter>
          <linearGradient id='painted-cloud-fill' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0.15' style={{ stopColor: 'var(--cl-lit)' }} />
            <stop offset='1' style={{ stopColor: 'var(--cl-shade)' }} />
          </linearGradient>
        </defs>
      </svg>
      {CLOUDS.map((cloud) => (
        <div
          key={cloud.id}
          className={`painted-cloud absolute left-0 transition-opacity duration-1000 ${
            cloud.always ? '' : 'hidden cloudy:block overcast:block fog:block'
          }`}
          style={
            {
              top: `${cloud.top}%`,
              width: `${cloud.width}vw`,
              opacity: cloud.opacity,
              '--duration': `${cloud.duration}s`,
              '--delay': `${cloud.delay}s`,
              '--rest': `${(cloud.id * 37) % 100}vw`,
            } as React.CSSProperties
          }
        >
          <svg
            viewBox='0 0 400 110'
            className='block h-auto w-full overflow-visible'
            aria-hidden='true'
          >
            <path
              d={cloud.d}
              fill='url(#painted-cloud-fill)'
              filter='url(#painted-cloud)'
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
