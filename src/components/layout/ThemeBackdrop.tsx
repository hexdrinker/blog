import { SkyLayer } from './SkyLayer'

// 라이트: 해가 뜬 들판과 마을 / 다크: 달이 뜬 우주
// next-themes가 <html>에 붙이는 .dark 클래스로 두 장면 중 하나만 보여준다

// 서버에서 한 번 그리므로 시드 고정 난수로 별 위치를 만든다
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const random = mulberry32(629)
const STARS = Array.from({ length: 180 }, () => ({
  x: random() * 1600,
  y: random() * 1000,
  r: random() < 0.9 ? 0.6 + random() * 0.9 : 1.6 + random() * 0.8,
  opacity: 0.35 + random() * 0.65,
  twinkle: random() < 0.25,
  delay: random() * 6,
}))

function DaySky() {
  return (
    <div className='css-sky absolute inset-0 dark:hidden'>
      {/* 하늘: 기본은 낮, 접속 시간대(data-time)에 따라 바뀐다 */}
      <div className='absolute inset-0 bg-[linear-gradient(to_bottom,#a9d6f5_0%,#cfe8fa_40%,#eef7fb_70%,#fbf6e6_100%)] dawn:bg-[linear-gradient(to_bottom,#b7c4ec_0%,#e6cde0_45%,#fbd9cf_75%,#ffe2bf_100%)] dusk:bg-[linear-gradient(to_bottom,#9fb0e0_0%,#e3b5c8_45%,#fcc3a4_75%,#ffcf96_100%)] night:bg-[linear-gradient(to_bottom,#b3bde3_0%,#cfd2ee_45%,#e5e0f2_80%,#efe9f1_100%)]' />
      {/* 날씨: 흐리거나 비·눈·안개면 하늘이 잿빛으로 가라앉는다 */}
      <div className='absolute inset-0 bg-[#9aa6b6] opacity-0 transition-opacity duration-1000 cloudy:opacity-30 overcast:opacity-55 fog:opacity-35' />
      {/* 해: 새벽·저녁엔 지평선 가까이 내려오고 밤엔 진다 */}
      <div className='absolute top-[72px] right-[6%] h-32 w-32 max-lg:opacity-50 transition-opacity duration-1000 dawn:top-[46vh] dusk:top-[44vh] night:hidden cloudy:opacity-60 fog:opacity-40 overcast:opacity-0'>
        <div className='absolute -inset-[196px] rounded-full bg-[radial-gradient(circle,rgba(255,244,196,0.95)_0%,rgba(255,226,140,0.55)_14%,rgba(255,221,150,0.18)_32%,transparent_62%)] dawn:bg-[radial-gradient(circle,rgba(255,226,200,0.9)_0%,rgba(255,190,150,0.45)_16%,transparent_60%)] dusk:bg-[radial-gradient(circle,rgba(255,200,150,0.9)_0%,rgba(255,150,100,0.45)_16%,transparent_60%)]' />
        <div className='absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_40%,#fffbe6,#ffe08a_70%,#ffd36b)] shadow-[0_0_60px_20px_rgba(255,220,120,0.45)] dawn:bg-[radial-gradient(circle_at_40%_40%,#fff4e0,#ffc58f_70%,#ffab70)] dusk:bg-[radial-gradient(circle_at_40%_40%,#ffe6c4,#ff9f6b_70%,#f57f55)] dusk:shadow-[0_0_70px_24px_rgba(255,140,90,0.45)]' />
      </div>
      {/* 구름: 저녁엔 노을빛이 든다 */}
      <div className='backdrop-cloud absolute top-[14%] left-[6%] h-10 w-56 rounded-full bg-white/70 blur-md dusk:bg-[#ffe0d2]/75' />
      <div className='backdrop-cloud absolute top-[11%] left-[10%] h-14 w-32 rounded-full bg-white/75 blur-md [animation-delay:-20s] dusk:bg-[#ffe0d2]/80' />
      <div className='backdrop-cloud absolute top-[30%] left-[58%] h-8 w-44 rounded-full bg-white/60 blur-md [animation-delay:-45s] dusk:bg-[#ffd6c4]/65' />
      <div className='backdrop-cloud absolute top-[42%] left-[20%] h-7 w-36 rounded-full bg-white/50 blur-md [animation-delay:-70s] dusk:bg-[#ffd6c4]/55' />
      {/* 먹구름: 흐린 날에만 */}
      <div className='absolute inset-x-0 top-0 h-[45vh] opacity-0 transition-opacity duration-1000 cloudy:opacity-70 overcast:opacity-100'>
        <div className='backdrop-cloud absolute top-[4%] left-[2%] h-24 w-[38rem] rounded-full bg-[#aab4c2]/80 blur-2xl' />
        <div className='backdrop-cloud absolute top-[10%] right-[4%] h-28 w-[42rem] rounded-full bg-[#9ea9b8]/80 blur-2xl [animation-delay:-30s]' />
        <div className='backdrop-cloud absolute top-[24%] left-[30%] h-20 w-[30rem] rounded-full bg-[#b3bcc8]/70 blur-2xl [animation-delay:-50s]' />
      </div>

    </div>
  )
}

function NightSky() {
  return (
    <div className='css-sky absolute inset-0 hidden dark:block'>
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,#1c2458_0%,#0d1230_45%,#060816_100%)]' />
      {/* 은하수 */}
      <div className='absolute left-1/2 top-1/2 h-[38vh] w-[160vmax] -translate-x-1/2 -translate-y-1/2 -rotate-[24deg] bg-[radial-gradient(ellipse_at_center,rgba(170,160,255,0.16)_0%,rgba(120,150,255,0.08)_35%,transparent_70%)] blur-2xl' />
      {/* 성운 */}
      <div className='absolute left-[8%] top-[18%] h-[340px] w-[440px] rounded-full bg-[radial-gradient(ellipse,rgba(186,104,255,0.18),transparent_65%)] blur-2xl' />
      <div className='absolute bottom-[6%] right-[12%] h-[300px] w-[420px] rounded-full bg-[radial-gradient(ellipse,rgba(64,196,220,0.12),transparent_65%)] blur-2xl' />
      {/* 새벽·저녁 지평선 빛 */}
      <div className='absolute inset-x-0 bottom-0 h-[45vh] bg-[linear-gradient(to_top,rgba(255,150,110,0.22),rgba(255,120,140,0.08)_45%,transparent)] opacity-0 dawn:opacity-100' />
      <div className='absolute inset-x-0 bottom-0 h-[45vh] bg-[linear-gradient(to_top,rgba(170,90,200,0.25),rgba(120,80,200,0.08)_45%,transparent)] opacity-0 dusk:opacity-100' />
      {/* 나선 은하 */}
      <div className='absolute bottom-[22%] left-[12%] h-16 w-44 -rotate-[28deg] rounded-full bg-[radial-gradient(ellipse,rgba(255,244,230,0.55)_0%,rgba(200,190,255,0.22)_30%,transparent_70%)] blur-[2px]' />

      {/* 별 */}
      <svg
        className='absolute inset-0 h-full w-full'
        viewBox='0 0 1600 1000'
        preserveAspectRatio='xMidYMid slice'
        aria-hidden='true'
      >
        {STARS.map((star, i) => (
          <circle
            key={i}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill='#f4f1ff'
            opacity={star.opacity}
            className={star.twinkle ? 'backdrop-twinkle' : undefined}
            style={star.twinkle ? { animationDelay: `${star.delay}s` } : undefined}
          />
        ))}
      </svg>

      {/* 날씨: 구름이 끼면 별이 가려진다 */}
      <div className='absolute inset-0 bg-[#080b1a] opacity-0 transition-opacity duration-1000 cloudy:opacity-45 overcast:opacity-65 fog:opacity-40' />
      <div className='absolute inset-x-0 top-0 h-[50vh] opacity-0 transition-opacity duration-1000 cloudy:opacity-70 overcast:opacity-100'>
        <div className='backdrop-cloud absolute top-[6%] left-[4%] h-24 w-[38rem] rounded-full bg-[#1b2140]/90 blur-2xl' />
        <div className='backdrop-cloud absolute top-[14%] right-[2%] h-28 w-[42rem] rounded-full bg-[#171c36]/90 blur-2xl [animation-delay:-30s]' />
      </div>

      {/* 별똥별: 맑은 밤에만 가끔 지나간다 */}
      <div className='backdrop-meteor absolute left-[30%] top-[12%] hidden h-px w-40 bg-gradient-to-r from-transparent via-white/70 to-white night:block cloudy:hidden overcast:hidden fog:hidden' />

      {/* 달: 낮 시간대엔 흐린 낮달 */}
      <div className='absolute top-[72px] right-[6%] max-lg:opacity-50 day:opacity-60 cloudy:opacity-50 fog:opacity-40 overcast:opacity-15 transition-opacity duration-1000 h-28 w-28 rounded-full bg-[radial-gradient(circle_at_38%_35%,#fbf8ea,#e4e0cb_65%,#cfcab2)] shadow-[0_0_70px_18px_rgba(235,232,200,0.22)]'>
        <span className='absolute left-[22%] top-[28%] h-5 w-5 rounded-full bg-[#d3ceb6]/80' />
        <span className='absolute left-[58%] top-[20%] h-3 w-3 rounded-full bg-[#d3ceb6]/70' />
        <span className='absolute left-[48%] top-[56%] h-7 w-7 rounded-full bg-[#d6d1b9]/70' />
        <span className='absolute left-[24%] top-[64%] h-2.5 w-2.5 rounded-full bg-[#d3ceb6]/70' />
      </div>
    </div>
  )
}

// 사인파 여러 개를 겹쳐 봉우리가 들쭉날쭉한 능선을 만든다 (시드 고정이라 매번 같은 산)
function ridgePath(seed: number, base: number, amplitude: number, detail: number) {
  const rand = mulberry32(seed)
  const waves = Array.from({ length: 5 }, (_, i) => ({
    frequency: (0.004 + rand() * 0.004) * 2 ** i,
    phase: rand() * Math.PI * 2,
    weight: 0.55 ** i,
  }))
  const points: string[] = []
  for (let x = 0; x <= 1440; x += 12) {
    const height = waves.reduce(
      (sum, wave) => sum + Math.sin(x * wave.frequency + wave.phase) * wave.weight,
      0,
    )
    const jitter = (rand() - 0.5) * detail
    points.push(`${x} ${(base - height * amplitude + jitter).toFixed(1)}`)
  }
  return `M0 320 L${points.join(' L')} L1440 320 Z`
}

const RIDGES = [
  {
    id: 'far',
    d: ridgePath(21, 150, 34, 2),
    top: '[stop-color:#b9c8d6] dawn:[stop-color:#6f5d7b] dusk:[stop-color:#6d5872] night:[stop-color:#1d2440]',
    bottom: '[stop-color:#d4dee7] dawn:[stop-color:#8a7589] dusk:[stop-color:#8a6f84] night:[stop-color:#232a45]',
    className: 'fog:opacity-40',
  },
  {
    id: 'mid',
    d: ridgePath(34, 196, 24, 3),
    top: '[stop-color:#9db1c3] dawn:[stop-color:#4f4262] dusk:[stop-color:#4c3d5a] night:[stop-color:#151b30]',
    bottom: '[stop-color:#b6c6d4] dawn:[stop-color:#605171] dusk:[stop-color:#5d4b6a] night:[stop-color:#1a2036]',
    className: 'fog:opacity-60',
  },
  {
    id: 'near',
    d: ridgePath(55, 244, 14, 5),
    top: '[stop-color:#7f97ac] dawn:[stop-color:#322a42] dusk:[stop-color:#30263d] night:[stop-color:#0c1020]',
    bottom: '[stop-color:#91a7ba] dawn:[stop-color:#3b3150] dusk:[stop-color:#382d47] night:[stop-color:#0f1324]',
    className: 'fog:opacity-80',
  },
]

// 먼 산부터 가까운 산까지 세 겹. 먼 산일수록 옅고 아래로 갈수록 안개가 낀 듯 밝아진다
// 해 뜰 녘·질 녘엔 역광이라 산이 어두운 실루엣이 된다
function Ridges() {
  return (
    <svg
      className='absolute inset-x-0 bottom-0 h-[26vh] min-h-[160px] w-full'
      viewBox='0 0 1440 320'
      preserveAspectRatio='xMidYMax slice'
      aria-hidden='true'
    >
      <defs>
        {RIDGES.map((ridge) => (
          <linearGradient
            key={ridge.id}
            id={`ridge-${ridge.id}`}
            x1='0'
            y1='0'
            x2='0'
            y2='1'
          >
            <stop
              offset='0'
              className={ridge.top}
            />
            <stop
              offset='1'
              className={ridge.bottom}
            />
          </linearGradient>
        ))}
      </defs>
      {RIDGES.map((ridge) => (
        <path
          key={ridge.id}
          d={ridge.d}
          fill={`url(#ridge-${ridge.id})`}
          className={ridge.className}
        />
      ))}
    </svg>
  )
}

export function ThemeBackdrop() {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'
    >
      <DaySky />
      <NightSky />
      {/* WebGL 하늘을 불러오는 동안 보이는 자리표시. 시간대별로 WebGL 하늘과 비슷한 색이다 */}
      <div className='sky-placeholder absolute inset-0 hidden bg-[linear-gradient(to_bottom,#86a4c2_0%,#a9bfd3_55%,#cdd8e2_100%)] dawn:bg-[linear-gradient(to_bottom,#3b475d_0%,#8e7a78_55%,#d99a64_100%)] dusk:bg-[linear-gradient(to_bottom,#3b475d_0%,#8e7a78_55%,#d99a64_100%)] night:bg-[linear-gradient(to_bottom,#0b0f20_0%,#141a2e_60%,#1e2438_100%)] overcast:bg-[linear-gradient(to_bottom,#8d98a5_0%,#aab3bd_60%,#c3cad2_100%)] night:overcast:bg-[linear-gradient(to_bottom,#0a0c14_0%,#12151f_100%)]' />
      <SkyLayer />
      {/* 글이 잘 읽히도록 하늘을 살짝 눌러준다. 비·눈엔 잿빛, 다크 테마엔 짙은 남색을 더한다 */}
      <div className='absolute inset-0 transition-colors duration-1000 overcast:bg-[#8994a3]/35 dark:bg-[#060b24]/30 night:bg-[#050a28]/60 dark:overcast:bg-[#05070f]/55' />
      <Ridges />

      {/* 비·눈·안개·번개는 두 장면 공통 */}
      <div className='css-sky absolute inset-0 hidden rain:block storm:block'>
        <div className='backdrop-rain backdrop-rain-far' />
        <div className='backdrop-rain backdrop-rain-near' />
      </div>
      <div className='css-sky absolute inset-0 hidden snow:block'>
        <div className='backdrop-snow backdrop-snow-far' />
        <div className='backdrop-snow backdrop-snow-near' />
      </div>
      <div className='absolute inset-x-0 bottom-0 h-2/3 opacity-0 transition-opacity duration-1000 fog:opacity-100 bg-[linear-gradient(to_top,rgba(236,239,243,0.9),rgba(236,239,243,0.45)_50%,transparent)] dark:bg-[linear-gradient(to_top,rgba(120,130,165,0.35),transparent)]' />
      <div className='backdrop-flash absolute inset-0 hidden bg-white storm:block' />
    </div>
  )
}
