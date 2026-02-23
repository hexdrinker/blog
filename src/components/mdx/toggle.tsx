import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const detailsBaseClass =
  'mdx-toggle group my-4 rounded-lg border border-border bg-muted/30 px-4 py-3 text-foreground/90 [&>*:not(summary)]:ml-5 [&>*:not(summary)]:mt-3'

const summaryBaseClass =
  'flex list-none cursor-pointer items-center rounded-sm font-medium text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60'

interface DetailsProps extends ComponentPropsWithoutRef<'details'> {
  children: ReactNode
}

interface SummaryProps extends ComponentPropsWithoutRef<'summary'> {
  children: ReactNode
}

interface ToggleProps extends Omit<
  ComponentPropsWithoutRef<'details'>,
  'title'
> {
  summary: ReactNode
  children: ReactNode
  summaryClassName?: string
}

export function Details({ className, children, ...props }: DetailsProps) {
  return (
    <details
      className={cn(detailsBaseClass, className)}
      {...props}
    >
      {children}
    </details>
  )
}

export function Summary({ className, children, ...props }: SummaryProps) {
  return (
    <summary
      className={cn(summaryBaseClass, className)}
      {...props}
    >
      <span
        aria-hidden
        className='inline-flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground transition-transform duration-200 group-open:rotate-90'
      >
        <ChevronRight className='h-5 w-5' />
      </span>
      <span className='leading-6'>{children}</span>
    </summary>
  )
}

export function Toggle({
  summary,
  children,
  summaryClassName,
  className,
  ...props
}: ToggleProps) {
  return (
    <Details
      className={className}
      {...props}
    >
      <Summary className={summaryClassName}>{summary}</Summary>
      {children}
    </Details>
  )
}
