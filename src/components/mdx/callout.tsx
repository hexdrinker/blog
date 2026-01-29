import { ReactNode } from 'react'

type CalloutType = 'comment' | 'note' | 'warning' | 'tip'

interface CalloutProps {
  type?: CalloutType
  children: ReactNode
}

const calloutStyles: Record<
  CalloutType,
  { icon: string; border: string; bg: string }
> = {
  comment: {
    icon: '💬',
    border: 'border-blue-500/50',
    bg: 'bg-blue-500/10',
  },
  note: {
    icon: '📝',
    border: 'border-gray-500/50',
    bg: 'bg-gray-500/10',
  },
  warning: {
    icon: '⚠️',
    border: 'border-yellow-500/50',
    bg: 'bg-yellow-500/10',
  },
  tip: {
    icon: '💡',
    border: 'border-green-500/50',
    bg: 'bg-green-500/10',
  },
}

export function Callout({ type = 'note', children }: CalloutProps) {
  const style = calloutStyles[type]

  return (
    <div
      className={`my-4 rounded-lg border-l-4 ${style.border} ${style.bg} p-4`}
    >
      <div className='flex gap-3'>
        <span className='text-lg flex-shrink-0'>{style.icon}</span>
        <div className='min-w-0 flex-1 text-foreground/90 [&>p]:my-0 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&_pre]:overflow-x-auto [&_[data-rehype-pretty-code-figure]]:overflow-x-auto'>
          {children}
        </div>
      </div>
    </div>
  )
}
