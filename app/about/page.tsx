import type { Metadata } from 'next'
import { ACTIVITIES, CAREERS, CURRENT_WORK } from './constant'

export const metadata: Metadata = {
  title: 'About',
  description: '프론트엔드 엔지니어 박영호의 경력과 활동',
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className='mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] after:h-px after:flex-1 after:bg-border'>
        {title}
      </h2>
      <ul className='space-y-5'>{children}</ul>
    </section>
  )
}

function Item({
  title,
  period,
  role,
  team,
  href,
}: {
  title: string
  period?: string
  role?: string
  team?: string
  href?: string
}) {
  return (
    <li className='grid gap-x-6 gap-y-0.5 sm:grid-cols-[1fr_auto] sm:items-baseline'>
      {href ? (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='font-semibold hover:text-primary transition-colors'
        >
          {title} ↗
        </a>
      ) : (
        <span className='font-semibold'>{title}</span>
      )}
      {period && (
        <span className='text-sm text-muted-foreground tabular-nums sm:row-start-1 sm:col-start-2 sm:text-right'>
          {period}
        </span>
      )}
      {role && (
        <p className='text-sm sm:col-span-2'>
          <span className='text-muted-foreground'>{role}</span>
          {team && (
            <span className='text-muted-foreground/60'> · {team}</span>
          )}
        </p>
      )}
    </li>
  )
}

export default function AboutPage() {
  return (
    <div className='max-w-3xl mx-auto px-4 py-12 space-y-12'>
      <h1 className='sr-only'>About</h1>

      <Section title='Currently working on'>
        {CURRENT_WORK.map((work) => (
          <Item
            key={work.company}
            title={work.company}
            period={work.period}
            role={work.role}
            team={work.team}
            href={work.href}
          />
        ))}
      </Section>

      <Section title='Career'>
        {CAREERS.map((career) => (
          <Item
            key={career.company}
            title={career.company}
            period={career.period}
            role={career.role}
            team={career.team}
            href={career.href}
          />
        ))}
      </Section>

      <Section title='Activities'>
        {ACTIVITIES.map((activity) => (
          <Item
            key={activity.title}
            title={activity.title}
            period={activity.period}
            href={activity.href}
          />
        ))}
      </Section>
    </div>
  )
}
