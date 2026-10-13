import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-admin className='max-w-4xl mx-auto px-4 py-12'>
      {children}
    </div>
  )
}
