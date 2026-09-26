'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// three.js 번들은 첫 화면과 분리해서 따로 불러온다. 그동안은 비슷한 색의 그라데이션이 보인다
const SkyCanvas = dynamic(() => import('./SkyCanvas'), { ssr: false })

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

// WebGL 하늘. 동작 줄이기 설정이거나 WebGL이 없으면 CSS 배경(ThemeBackdrop)을 그대로 둔다
export function SkyLayer() {
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // 인라인 스크립트가 붙인 data-sky='gl'을 믿지 못하는 경우엔 떼서 CSS 일러스트 배경으로 되돌린다
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !supportsWebGL()) {
      delete document.documentElement.dataset.sky
      return
    }
    setEnabled(true)
  }, [])

  if (!enabled) return null

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-600 ${ready ? 'opacity-100' : 'opacity-0'}`}
    >
      <SkyCanvas onReady={() => setReady(true)} />
    </div>
  )
}
