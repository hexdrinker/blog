'use client'

import { useRef } from 'react'
import {
  getDateForSkyTime,
  getSkyTime,
  SKY_STORAGE_KEY,
  SKY_TIMES,
  SKY_WEATHERS,
  skyStore,
  type SkyTime,
  type SkyWeather,
} from '@/lib/sky'
import { useSky } from './WeatherSync'

const TAP_COUNT = 5
const TAP_WINDOW = 1500

const TIME_LABELS: Record<string, string> = {
  dawn: '새벽',
  day: '낮',
  dusk: '저녁',
  night: '밤',
}
const WEATHER_LABELS: Record<string, string> = {
  clear: '맑음',
  cloudy: '흐림',
  rain: '비',
  snow: '눈',
  fog: '안개',
  storm: '뇌우',
}

// 개발 환경 전용: 헤더 로고 왼쪽 빈 공간을 5번 누르면 배경 시간대·날씨를 바꿔볼 수 있다
export function DevSkyPanel() {
  const sky = useSky()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const taps = useRef<number[]>([])
  const time = getSkyTime(sky.date ?? new Date(), sky.latitude, sky.longitude)
  const weather = sky.weather

  const onSecretTap = () => {
    const now = Date.now()
    taps.current = [...taps.current.filter((t) => now - t < TAP_WINDOW), now]
    if (taps.current.length < TAP_COUNT) return
    taps.current = []
    dialogRef.current?.showModal()
  }

  // 시간대는 오늘 그 위치에서 해당 시간대가 되는 시각으로 바꿔서 해·달 위치까지 맞춘다
  const changeTime = (next: SkyTime) =>
    skyStore.set({ date: getDateForSkyTime(next, sky.latitude, sky.longitude) })
  const changeWeather = (next: SkyWeather) => skyStore.set({ weather: next })

  // 위치 기반 값을 다시 받아오도록 저장값을 지우고 새로고침한다
  const resetToLocation = () => {
    try {
      sessionStorage.removeItem(SKY_STORAGE_KEY)
    } catch {}
    window.location.reload()
  }

  const optionClassName = (isActive: boolean) =>
    `rounded-md border px-3 py-1.5 text-sm transition-colors cursor-pointer ${
      isActive
        ? 'border-foreground bg-foreground text-background'
        : 'border-foreground/15 text-muted-foreground hover:text-foreground hover:bg-foreground/10'
    }`

  return (
    <>
      <button
        type='button'
        tabIndex={-1}
        aria-hidden='true'
        onClick={onSecretTap}
        className='absolute right-full top-0 h-full w-12 cursor-default'
      />
      <dialog
        ref={dialogRef}
        onClick={(event) => event.target === dialogRef.current && dialogRef.current?.close()}
        className='m-auto w-[calc(100%-2rem)] max-w-sm rounded-lg border border-foreground/10 bg-background/85 p-5 text-foreground shadow-xl backdrop-blur-xl backdrop:bg-black/40'
      >
        <div className='flex items-center justify-between'>
          <h2 className='text-sm font-semibold'>배경 테스트</h2>
          <span className='rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary'>
            dev
          </span>
        </div>

        <fieldset className='mt-4'>
          <legend className='mb-2 text-xs text-muted-foreground'>시간대</legend>
          <div className='flex flex-wrap gap-2'>
            {SKY_TIMES.map((value) => (
              <button
                key={value}
                type='button'
                onClick={() => changeTime(value)}
                className={optionClassName(time === value)}
              >
                {TIME_LABELS[value]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className='mt-4'>
          <legend className='mb-2 text-xs text-muted-foreground'>날씨</legend>
          <div className='flex flex-wrap gap-2'>
            {SKY_WEATHERS.map((value) => (
              <button
                key={value}
                type='button'
                onClick={() => changeWeather(value)}
                className={optionClassName(weather === value)}
              >
                {WEATHER_LABELS[value]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className='mt-5 flex justify-between gap-2'>
          <button
            type='button'
            onClick={resetToLocation}
            className='text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground cursor-pointer'
          >
            위치 기반으로 되돌리기
          </button>
          <button
            type='button'
            onClick={() => dialogRef.current?.close()}
            className='rounded-md bg-foreground px-3 py-1.5 text-sm text-background cursor-pointer'
          >
            닫기
          </button>
        </div>
      </dialog>
    </>
  )
}
