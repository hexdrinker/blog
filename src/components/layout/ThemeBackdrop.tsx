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
    <div className='absolute inset-0 dark:hidden'>
      {/* 하늘: 기본은 낮, 접속 시간대(data-time)에 따라 바뀐다 */}
      <div className='absolute inset-0 bg-[linear-gradient(to_bottom,#a9d6f5_0%,#cfe8fa_40%,#eef7fb_70%,#fbf6e6_100%)] dawn:bg-[linear-gradient(to_bottom,#b7c4ec_0%,#e6cde0_45%,#fbd9cf_75%,#ffe2bf_100%)] dusk:bg-[linear-gradient(to_bottom,#9fb0e0_0%,#e3b5c8_45%,#fcc3a4_75%,#ffcf96_100%)] night:bg-[linear-gradient(to_bottom,#b3bde3_0%,#cfd2ee_45%,#e5e0f2_80%,#efe9f1_100%)]' />
      {/* 해: 새벽·저녁엔 지평선 가까이 내려오고 밤엔 진다 */}
      <div className='absolute top-[72px] right-[6%] h-32 w-32 max-lg:opacity-50 dawn:top-[46vh] dusk:top-[44vh] night:hidden'>
        <div className='absolute -inset-[196px] rounded-full bg-[radial-gradient(circle,rgba(255,244,196,0.95)_0%,rgba(255,226,140,0.55)_14%,rgba(255,221,150,0.18)_32%,transparent_62%)] dawn:bg-[radial-gradient(circle,rgba(255,226,200,0.9)_0%,rgba(255,190,150,0.45)_16%,transparent_60%)] dusk:bg-[radial-gradient(circle,rgba(255,200,150,0.9)_0%,rgba(255,150,100,0.45)_16%,transparent_60%)]' />
        <div className='absolute inset-0 rounded-full bg-[radial-gradient(circle_at_40%_40%,#fffbe6,#ffe08a_70%,#ffd36b)] shadow-[0_0_60px_20px_rgba(255,220,120,0.45)] dawn:bg-[radial-gradient(circle_at_40%_40%,#fff4e0,#ffc58f_70%,#ffab70)] dusk:bg-[radial-gradient(circle_at_40%_40%,#ffe6c4,#ff9f6b_70%,#f57f55)] dusk:shadow-[0_0_70px_24px_rgba(255,140,90,0.45)]' />
      </div>
      {/* 구름: 저녁엔 노을빛이 든다 */}
      <div className='backdrop-cloud absolute top-[14%] left-[6%] h-10 w-56 rounded-full bg-white/70 blur-md dusk:bg-[#ffe0d2]/75' />
      <div className='backdrop-cloud absolute top-[11%] left-[10%] h-14 w-32 rounded-full bg-white/75 blur-md [animation-delay:-20s] dusk:bg-[#ffe0d2]/80' />
      <div className='backdrop-cloud absolute top-[30%] left-[58%] h-8 w-44 rounded-full bg-white/60 blur-md [animation-delay:-45s] dusk:bg-[#ffd6c4]/65' />
      <div className='backdrop-cloud absolute top-[42%] left-[20%] h-7 w-36 rounded-full bg-white/50 blur-md [animation-delay:-70s] dusk:bg-[#ffd6c4]/55' />
      {/* 들판과 마을 */}
      <svg
        className='absolute inset-x-0 bottom-0 h-[30vh] min-h-[180px] w-full'
        viewBox='0 0 1440 320'
        preserveAspectRatio='xMidYMax slice'
        aria-hidden='true'
      >
        {/* 먼 언덕 */}
        <path
          d='M0 170 C 180 120 320 150 470 132 C 640 112 760 150 930 128 C 1110 104 1280 140 1440 118 L1440 320 L0 320 Z'
          fill='#d5e8c8'
        />
        {/* 마을 */}
        <g transform='translate(1170 88)'>
          <rect x='0' y='22' width='26' height='22' fill='#f3e6d0' />
          <path d='M-3 23 L13 8 L29 23 Z' fill='#d59a7b' />
          <rect x='34' y='16' width='20' height='28' fill='#efe0c6' />
          <path d='M31 17 L44 4 L57 17 Z' fill='#c98a6c' />
          <rect x='62' y='26' width='30' height='18' fill='#f5ead7' />
          <path d='M59 27 L77 13 L95 27 Z' fill='#d8a283' />
          {/* 종탑 */}
          <rect x='100' y='6' width='14' height='38' fill='#ebdcc2' />
          <path d='M98 7 L107 -14 L116 7 Z' fill='#b98068' />
          <rect x='104' y='14' width='6' height='8' rx='3' fill='#c9b596' />
          <rect x='122' y='24' width='24' height='20' fill='#f1e3cc' />
          <path d='M119 25 L134 12 L149 25 Z' fill='#cf9577' />
          {/* 창문: 저녁·밤엔 불이 켜진다 */}
          <g className='fill-[#e3c9a4] dusk:fill-[#ffc964] night:fill-[#ffd27a]'>
            <rect x='6' y='29' width='5' height='5' />
            <rect x='40' y='24' width='5' height='5' />
            <rect x='70' y='32' width='5' height='5' />
            <rect x='82' y='32' width='5' height='5' />
            <rect x='128' y='30' width='5' height='5' />
          </g>
        </g>
        {/* 풍차 */}
        <g transform='translate(190 116)'>
          <path d='M-7 40 L-4 4 L4 4 L7 40 Z' fill='#efe2cb' />
          <g
            className='backdrop-windmill'
            fill='#e4d2b4'
          >
            {[0, 90, 180, 270].map((angle) => (
              <rect
                key={angle}
                x='-1.5'
                y='-22'
                width='3'
                height='22'
                transform={`rotate(${angle})`}
              />
            ))}
          </g>
          <circle r='2.5' fill='#cdb58f' />
        </g>
        {/* 중간 언덕 */}
        <path
          d='M0 220 C 200 180 380 214 560 196 C 760 176 900 216 1100 198 C 1260 184 1360 200 1440 192 L1440 320 L0 320 Z'
          fill='#c3dfae'
        />
        {/* 나무 */}
        <g fill='#a9cf92'>
          <circle cx='180' cy='196' r='14' />
          <circle cx='200' cy='200' r='10' />
          <circle cx='640' cy='186' r='12' />
          <circle cx='1210' cy='188' r='13' />
          <circle cx='1230' cy='193' r='9' />
        </g>
        {/* 가까운 들판과 밭고랑 */}
        <path
          d='M0 262 C 240 236 480 258 720 248 C 960 238 1200 258 1440 244 L1440 320 L0 320 Z'
          fill='#b2d69a'
        />
        <g
          stroke='#a3cb89'
          strokeWidth='2'
          fill='none'
        >
          <path d='M0 286 C 360 270 1080 290 1440 272' />
          <path d='M0 304 C 360 290 1080 308 1440 292' />
        </g>
      </svg>
    </div>
  )
}

function NightSky() {
  return (
    <div className='absolute inset-0 hidden dark:block'>
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

      {/* 별똥별: 밤에만 가끔 지나간다 */}
      <div className='backdrop-meteor absolute left-[30%] top-[12%] hidden h-px w-40 bg-gradient-to-r from-transparent via-white/70 to-white night:block' />

      {/* 달: 낮 시간대엔 흐린 낮달 */}
      <div className='absolute top-[72px] right-[6%] max-lg:opacity-50 day:opacity-60 h-28 w-28 rounded-full bg-[radial-gradient(circle_at_38%_35%,#fbf8ea,#e4e0cb_65%,#cfcab2)] shadow-[0_0_70px_18px_rgba(235,232,200,0.22)]'>
        <span className='absolute left-[22%] top-[28%] h-5 w-5 rounded-full bg-[#d3ceb6]/80' />
        <span className='absolute left-[58%] top-[20%] h-3 w-3 rounded-full bg-[#d3ceb6]/70' />
        <span className='absolute left-[48%] top-[56%] h-7 w-7 rounded-full bg-[#d6d1b9]/70' />
        <span className='absolute left-[24%] top-[64%] h-2.5 w-2.5 rounded-full bg-[#d3ceb6]/70' />
      </div>
    </div>
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
    </div>
  )
}
