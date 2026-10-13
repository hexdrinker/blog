'use client'

import { useEffect, useRef } from 'react'

// 브라우저 기본 <dialog>: 포커스 가두기, Esc 닫기, 배경 처리를 그대로 쓴다
export function AlertModal({ message, onClose }: { message: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (message && !dialog.open) dialog.showModal()
    if (!message && dialog.open) dialog.close()
  }, [message])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className='m-auto w-[calc(100%-2rem)] max-w-sm rounded-lg border bg-background p-6 text-foreground shadow-xl backdrop:bg-black/50'
    >
      <p className='text-sm leading-relaxed whitespace-pre-wrap'>{message}</p>
      <form method='dialog' className='mt-5 flex justify-end'>
        <button
          autoFocus
          className='rounded-md bg-foreground px-4 py-1.5 text-sm text-background hover:bg-foreground/90'
        >
          확인
        </button>
      </form>
    </dialog>
  )
}
