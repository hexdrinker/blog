import { NextRequest, NextResponse } from 'next/server'
import type { Landscape, SkyWeather } from '@/lib/sky'

export const dynamic = 'force-dynamic'

interface ForecastResponse {
  elevation: number
  current: { weather_code: number }
}

interface MarineResponse {
  current?: { wave_height: number | null }
}

// WMO weather code → 배경에서 쓰는 날씨
// https://open-meteo.com/en/docs#weather_variable_documentation
function toWeather(code: number): SkyWeather {
  if (code <= 1) return 'clear'
  if (code <= 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow'
  if (code >= 95) return 'storm'
  return 'rain'
}

// 이 반경 안이면 그 도시의 랜드마크 스카이라인을 보여준다
const LANDMARK_RADIUS_KM = 35
const LANDMARKS: { id: Landscape; latitude: number; longitude: number }[] = [
  { id: 'seoul', latitude: 37.5665, longitude: 126.978 },
  { id: 'busan', latitude: 35.1796, longitude: 129.0756 },
  { id: 'tokyo', latitude: 35.6762, longitude: 139.6503 },
  { id: 'newyork', latitude: 40.7128, longitude: -74.006 },
  { id: 'paris', latitude: 48.8566, longitude: 2.3522 },
  { id: 'london', latitude: 51.5072, longitude: -0.1276 },
  { id: 'sanfrancisco', latitude: 37.7749, longitude: -122.4194 },
]

// 대략적인 건조 지대 (위도·경도 범위). 사하라·아라비아, 이란, 고비, 호주 내륙, 미국 남서부, 아타카마
const DESERTS: [minLat: number, maxLat: number, minLon: number, maxLon: number][] = [
  [15, 32, -17, 60],
  [25, 38, 48, 70],
  [38, 46, 90, 112],
  [-32, -18, 118, 142],
  [28, 37, -118, -106],
  [-28, -18, -71, -68],
]

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const rad = Math.PI / 180
  const dLat = (lat2 - lat1) * rad
  const dLon = (lon2 - lon1) * rad
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(a))
}

// 해양 모델 격자에 걸리면(파고 값이 있으면) 바다에 가까운 곳으로 본다
async function isCoastal(latitude: number, longitude: number) {
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: 'wave_height',
    })
    const res = await fetch(`https://marine-api.open-meteo.com/v1/marine?${params}`, {
      // 지형은 변하지 않으니 하루 동안 캐시한다
      next: { revalidate: 86400 },
    })
    if (!res.ok) return false
    const data = (await res.json()) as MarineResponse
    return typeof data.current?.wave_height === 'number'
  } catch {
    return false
  }
}

async function toLandscape(latitude: number, longitude: number, elevation: number): Promise<Landscape> {
  const landmark = LANDMARKS.find(
    (city) => distanceKm(latitude, longitude, city.latitude, city.longitude) <= LANDMARK_RADIUS_KM,
  )
  if (landmark) return landmark.id
  if (Math.abs(latitude) >= 60 || elevation >= 2500) return 'snow'
  if (elevation >= 1000) return 'alpine'
  if (await isCoastal(latitude, longitude)) return 'coast'
  const inDesert = DESERTS.some(
    ([minLat, maxLat, minLon, maxLon]) =>
      latitude >= minLat && latitude <= maxLat && longitude >= minLon && longitude <= maxLon,
  )
  return inDesert ? 'desert' : 'hills'
}

const EMPTY = { latitude: null, longitude: null, weather: null, landscape: null }

export async function GET(request: NextRequest) {
  // Vercel이 방문자 IP로 추정한 위치. 로컬 개발 환경에는 없다
  const latitudeHeader = request.headers.get('x-vercel-ip-latitude')
  const longitudeHeader = request.headers.get('x-vercel-ip-longitude')

  if (!latitudeHeader || !longitudeHeader) {
    return NextResponse.json(EMPTY)
  }

  // 소수 첫째 자리(약 10km)로 뭉개서 쓰고, 같은 지역끼리 캐시를 나눠 쓴다
  const latitude = Number(Number(latitudeHeader).toFixed(1))
  const longitude = Number(Number(longitudeHeader).toFixed(1))
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'weather_code',
  })

  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      next: { revalidate: 900 },
    })
    if (!res.ok) throw new Error(`open-meteo ${res.status}`)
    const data = (await res.json()) as ForecastResponse

    return NextResponse.json(
      // 해·달 위치와 시간대는 이 좌표로 브라우저에서 계산한다 (suncalc)
      {
        latitude,
        longitude,
        weather: toWeather(data.current.weather_code),
        landscape: await toLandscape(latitude, longitude, data.elevation),
      },
      // 방문자 위치마다 결과가 다르므로 공용 캐시에 두지 않는다
      { headers: { 'Cache-Control': 'private, max-age=600' } },
    )
  } catch {
    return NextResponse.json({ ...EMPTY, latitude, longitude })
  }
}
