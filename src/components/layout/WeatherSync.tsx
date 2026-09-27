'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import {
  applySkyToDocument,
  getDateForSkyTime,
  getSkyTime,
  LANDSCAPES,
  SKY_STORAGE_KEY,
  SKY_TIMES,
  SKY_WEATHERS,
  skyStore,
  type Landscape,
  type SkyTime,
  type SkyWeather,
} from '@/lib/sky'

const SKY_TTL = 15 * 60 * 1000

interface WeatherResponse {
  latitude: number | null
  longitude: number | null
  weather: SkyWeather | null
  landscape: Landscape | null
}

const isSkyTime = (value: string | null): value is SkyTime =>
  SKY_TIMES.includes(value as SkyTime)
const isSkyWeather = (value: string | null): value is SkyWeather =>
  SKY_WEATHERS.includes(value as SkyWeather)
const isLandscape = (value: string | null): value is Landscape =>
  LANDSCAPES.includes(value as Landscape)

export function useSky() {
  return useSyncExternalStore(skyStore.subscribe, skyStore.get, skyStore.get)
}

// 방문자 위치·날씨를 받아 하늘 상태(skyStore)를 채우고,
// 태양 고도로 정한 시간대를 <html data-time/data-weather>와 테마에 반영한다
export function WeatherSync() {
  const { setTheme } = useTheme()
  const sky = useSky()

  // 1) 위치·날씨 불러오기
  useEffect(() => {
    // 로컬 확인용: ?time=dusk&weather=rain&landscape=seoul
    const params = new URLSearchParams(window.location.search)
    const timeParam = params.get('time')
    const weatherParam = params.get('weather')
    const landscapeParam = params.get('landscape')
    if (isSkyTime(timeParam) || isSkyWeather(weatherParam) || isLandscape(landscapeParam)) {
      const { latitude, longitude } = skyStore.get()
      skyStore.set({
        ...(isSkyWeather(weatherParam) && { weather: weatherParam }),
        ...(isLandscape(landscapeParam) && { landscape: landscapeParam }),
        ...(isSkyTime(timeParam) && { date: getDateForSkyTime(timeParam, latitude, longitude) }),
      })
      return
    }

    try {
      const cached = JSON.parse(sessionStorage.getItem(SKY_STORAGE_KEY) ?? 'null')
      if (cached && Date.now() - cached.at < SKY_TTL) {
        skyStore.set({
          latitude: cached.latitude,
          longitude: cached.longitude,
          weather: cached.weather,
          ...(isLandscape(cached.landscape) && { landscape: cached.landscape }),
        })
        return
      }
    } catch {}

    fetch('/api/weather')
      .then((res) => res.json() as Promise<WeatherResponse>)
      .then(({ latitude, longitude, weather, landscape }) => {
        skyStore.set({
          ...(latitude !== null && longitude !== null && { latitude, longitude }),
          ...(weather && { weather }),
          ...(landscape && { landscape }),
        })
        if (latitude === null) return
        const current = skyStore.get()
        try {
          sessionStorage.setItem(
            SKY_STORAGE_KEY,
            JSON.stringify({
              latitude: current.latitude,
              longitude: current.longitude,
              weather: current.weather,
              landscape: current.landscape,
              time: getSkyTime(new Date(), current.latitude, current.longitude),
              at: Date.now(),
            }),
          )
        } catch {}
      })
      .catch(() => {})
  }, [])

  // 2) 시간대 반영. 해가 움직이므로 1분마다 다시 계산한다
  useEffect(() => {
    const update = () => {
      const time = getSkyTime(sky.date ?? new Date(), sky.latitude, sky.longitude)
      setTheme(applySkyToDocument(time, sky.weather, sky.landscape))
    }
    update()
    const timer = window.setInterval(update, 60 * 1000)
    return () => window.clearInterval(timer)
  }, [sky, setTheme])

  return null
}
