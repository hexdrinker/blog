import { NextRequest, NextResponse } from 'next/server'
import type { SkyWeather } from '@/lib/sky'

export const dynamic = 'force-dynamic'

interface OpenMeteoResponse {
  current: { weather_code: number }
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

const EMPTY = { latitude: null, longitude: null, weather: null }

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
    const data = (await res.json()) as OpenMeteoResponse

    return NextResponse.json(
      // 해·달 위치와 시간대는 이 좌표로 브라우저에서 계산한다 (suncalc)
      { latitude, longitude, weather: toWeather(data.current.weather_code) },
      // 방문자 위치마다 결과가 다르므로 공용 캐시에 두지 않는다
      { headers: { 'Cache-Control': 'private, max-age=600' } },
    )
  } catch {
    return NextResponse.json({ ...EMPTY, latitude, longitude })
  }
}
