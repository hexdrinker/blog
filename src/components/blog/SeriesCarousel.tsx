'use client'

import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface SeriesCard {
  href: string
  order: number
  title: string
  description: string
  date: string
  readingTime: string
}

// 가운데 카드 양옆으로 몇 장까지 보여줄지
const VISIBLE_RANGE = 3
const SWIPE_THRESHOLD = 40
// 드래그 거리 이만큼마다 한 장씩 돌아간다
const DRAG_STEP = 90

function cardStyle(offset: number, total: number, index: number): CSSProperties {
  const distance = Math.abs(offset)
  const direction = Math.sign(offset)
  // 색상도 한 바퀴 돌아서 마지막 카드와 첫 카드가 자연스럽게 이어진다
  const hue = (220 + (index / total) * 360) % 360

  return {
    '--card-hue': hue,
    transform: `translateX(${offset * 58}%) translateZ(${-distance * 140}px) rotateY(${-direction * Math.min(distance * 28, 50)}deg)`,
    zIndex: 100 - distance,
    opacity: distance > VISIBLE_RANGE ? 0 : 1,
    // 멀어질수록 어둡게 해서 가운데 카드에 시선이 가게 한다
    filter: `brightness(${1 - Math.min(distance, VISIBLE_RANGE) * 0.18})`,
    pointerEvents: distance > VISIBLE_RANGE ? 'none' : 'auto',
  } as CSSProperties
}

export function SeriesCarousel({ cards }: { cards: SeriesCard[] }) {
  const router = useRouter()
  const [active, setActive] = useState(0)
  const dragStartX = useRef<number | null>(null)
  // 드래그 중 손가락을 따라 움직인 거리(px). 0이 아니면 카드가 실시간으로 따라 돈다
  const [dragDx, setDragDx] = useState(0)
  const didDrag = useRef(false)
  const activeCardRef = useRef<HTMLDivElement>(null)

  const total = cards.length
  // 끝과 처음이 이어진 원형으로 돈다
  const go = (index: number) => setActive(((index % total) + total) % total)

  // 원형 배치에서 가운데 카드로부터 가장 가까운 방향의 거리
  const position = active - dragDx / DRAG_STEP
  const offsetOf = (index: number) => {
    let offset = index - position
    if (offset > total / 2) offset -= total
    if (offset < -total / 2) offset += total
    return offset
  }

  const onPointerDown = (event: PointerEvent) => {
    dragStartX.current = event.clientX
    didDrag.current = false
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return
    const dx = event.clientX - dragStartX.current
    if (!didDrag.current && Math.abs(dx) > 6) {
      didDrag.current = true
      // 드래그가 시작된 뒤에만 잡아야 카드 탭(click)이 막히지 않는다
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (didDrag.current) setDragDx(dx)
  }
  const endDrag = (event: PointerEvent) => {
    if (dragStartX.current === null) return
    const dx = event.clientX - dragStartX.current
    dragStartX.current = null
    setDragDx(0)
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      const steps = Math.max(1, Math.round(Math.abs(dx) / DRAG_STEP))
      go(active + (dx < 0 ? steps : -steps))
    }
  }
  const cancelDrag = () => {
    dragStartX.current = null
    setDragDx(0)
  }

  // 가운데 카드: 포인터를 따라 기울고 광택이 움직인다
  const onTilt = (event: PointerEvent<HTMLDivElement>) => {
    const el = activeCardRef.current
    if (!el || event.pointerType !== 'mouse') return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    el.style.setProperty('--tilt-x', `${(0.5 - y) * 14}deg`)
    el.style.setProperty('--tilt-y', `${(x - 0.5) * 14}deg`)
    el.style.setProperty('--glare-x', `${x * 100}%`)
    el.style.setProperty('--glare-y', `${y * 100}%`)
  }
  const resetTilt = () => {
    const el = activeCardRef.current
    if (!el) return
    el.style.removeProperty('--tilt-x')
    el.style.removeProperty('--tilt-y')
  }

  const current = cards[active]

  return (
    <section
      aria-roledescription='carousel'
      aria-label='시리즈 글'
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(active + 1)
        if (event.key === 'ArrowLeft') go(active - 1)
        if (event.key === 'Enter' && current) router.push(current.href)
      }}
      className='outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-xl'
    >
      <div
        className={`series-stage ${dragDx !== 0 ? 'is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={cancelDrag}
      >
        {cards.map((card, index) => {
          const offset = offsetOf(index)
          const isActive = index === active

          return (
            <div
              key={card.href}
              className='series-slot'
              style={cardStyle(offset, total, index)}
              aria-hidden={!isActive}
            >
              <div
                ref={isActive ? activeCardRef : undefined}
                role='link'
                tabIndex={-1}
                aria-label={`${card.order}편 ${card.title}`}
                onClick={() => {
                  if (didDrag.current) return
                  if (isActive) router.push(card.href)
                  else go(index)
                }}
                onPointerMove={isActive ? onTilt : undefined}
                onPointerLeave={isActive ? resetTilt : undefined}
                className={`series-card ${isActive ? 'is-active' : ''}`}
              >
                <div className='series-card-inner'>
                  <div className='flex items-center justify-between px-3 pt-2.5 text-[11px] font-semibold tracking-wider text-white/85'>
                    <span>No. {String(card.order).padStart(2, '0')}</span>
                    <span>{card.readingTime}</span>
                  </div>
                  <div className='series-card-art'>
                    <span className='series-card-number'>{card.order}</span>
                  </div>
                  <div className='series-card-text'>
                    <h3 className='text-sm font-bold leading-snug text-balance line-clamp-2'>
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className='mt-1 text-xs leading-snug text-muted-foreground line-clamp-2'>
                        {card.description}
                      </p>
                    )}
                    <p className='mt-auto pt-2 text-[11px] text-muted-foreground tabular-nums'>
                      {card.date}
                    </p>
                  </div>
                </div>
                <span
                  className='series-card-glare'
                  aria-hidden='true'
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className='mt-6 flex items-center justify-center gap-4'>
        <button
          type='button'
          onClick={() => go(active - 1)}
          aria-label='이전 글'
          className='w-9 h-9 flex items-center justify-center rounded-full border border-foreground/10 text-muted-foreground hover:text-foreground hover:bg-foreground/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer'
        >
          <ChevronLeft className='w-4 h-4' />
        </button>
        <label className='flex items-center gap-3 text-xs text-muted-foreground tabular-nums'>
          <span className='sr-only'>편 선택</span>
          <input
            id='series-scrubber'
            type='range'
            min={0}
            max={cards.length - 1}
            value={active}
            onChange={(event) => go(Number(event.target.value))}
            className='w-40 sm:w-56 accent-foreground'
          />
          <span className='w-12'>
            {active + 1} / {cards.length}
          </span>
        </label>
        <button
          type='button'
          onClick={() => go(active + 1)}
          aria-label='다음 글'
          className='w-9 h-9 flex items-center justify-center rounded-full border border-foreground/10 text-muted-foreground hover:text-foreground hover:bg-foreground/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer'
        >
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>
    </section>
  )
}
