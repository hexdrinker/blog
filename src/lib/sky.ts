import * as SunCalc from 'suncalc'

// 배경(ThemeBackdrop, SkyCanvas)이 공유하는 하늘 상태: 방문자 위치·날씨·(테스트용) 시각

export const SKY_TIMES = ['dawn', 'day', 'dusk', 'night'] as const
export const SKY_WEATHERS = ['clear', 'cloudy', 'rain', 'snow', 'fog', 'storm'] as const

export type SkyTime = (typeof SKY_TIMES)[number]
export type SkyWeather = (typeof SKY_WEATHERS)[number]

export interface SkyState {
  latitude: number
  longitude: number
  weather: SkyWeather
  /** 테스트용으로 고정한 시각. null이면 현재 시각 */
  date: Date | null
}

// app/layout.tsx의 인라인 스크립트도 같은 키를 읽어 첫 화면에 바로 적용한다
export const SKY_STORAGE_KEY = 'sky'

// 위치를 모르면 기기 시간대로 경도를 어림한다 (UTC+9 → 동경 135°)
function fallbackLocation() {
  return { latitude: 37, longitude: -new Date().getTimezoneOffset() / 4 }
}

let state: SkyState = { ...fallbackLocation(), weather: 'clear', date: null }
const listeners = new Set<() => void>()

export const skyStore = {
  get: () => state,
  set(partial: Partial<SkyState>) {
    state = { ...state, ...partial }
    listeners.forEach((listener) => listener())
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

/** 실제 태양 고도로 시간대를 나눈다. 시민 박명(-6°)까지를 새벽·저녁으로 본다 */
export function getSkyTime(date: Date, latitude: number, longitude: number): SkyTime {
  // suncalc 2.x는 각도를 도(degree) 단위로 준다
  const { altitude } = SunCalc.getPosition(date, latitude, longitude)
  if (altitude >= 6) return 'day'
  if (altitude >= -6) {
    const { solarNoon } = SunCalc.getTimes(date, latitude, longitude)
    return solarNoon && date < solarNoon ? 'dawn' : 'dusk'
  }
  return 'night'
}

/** 테스트용: 오늘 그 위치에서 해당 시간대가 되는 대표 시각 */
export function getDateForSkyTime(time: SkyTime, latitude: number, longitude: number) {
  const times = SunCalc.getTimes(new Date(), latitude, longitude)
  const pick = {
    dawn: times.sunrise,
    day: times.solarNoon,
    dusk: times.sunset,
    night: times.night && new Date(times.night.getTime() + 60 * 60 * 1000),
  }[time]
  // 백야·극야처럼 계산이 안 되는 곳은 정오/자정으로 대신한다
  if (!pick || Number.isNaN(pick.getTime())) {
    const fallback = new Date()
    fallback.setHours(time === 'night' ? 23 : time === 'day' ? 12 : time === 'dawn' ? 6 : 18, 0, 0, 0)
    return fallback
  }
  return pick
}

/** <html data-time/data-weather>를 바꾸고, 맞춰야 할 테마를 돌려준다 */
export function applySkyToDocument(time: SkyTime, weather: SkyWeather): 'light' | 'dark' {
  const root = document.documentElement
  root.dataset.time = time
  root.dataset.weather = weather
  // 노을·여명 하늘은 위쪽이 어두워서 밝은 글씨가 잘 읽힌다. 낮에만 라이트 테마를 쓴다
  return time === 'day' ? 'light' : 'dark'
}
