import { LucideIcon } from 'lucide-react'

type SocialLink = {
  name: string
  href: string
  icon: LucideIcon
}

type WorkItem = {
  company: string
  team: string
  role: string
  period: string
  companyIntro?: string
  contents: {
    projectName?: string
    description?: string
    images?: string[]
    links?: {
      playStore?: string
      appStore?: string
      website?: string
    }
    items: string[]
  }[]
}

type ActivityItem = {
  title: string
  period: string
  description: string
  link?: {
    label: string
    href: string
  }
}

type CareerItem = {
  company: string
  period: string
  team?: string
  role: string
  href?: string
}

export type { SocialLink, WorkItem, ActivityItem, CareerItem }
