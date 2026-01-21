import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import type { Authors, Author } from '@/types/post'

const AUTHORS_FILE = path.join(process.cwd(), 'content/authors.yml')

export function getAuthors(): Authors {
  if (!fs.existsSync(AUTHORS_FILE)) {
    return {}
  }

  const content = fs.readFileSync(AUTHORS_FILE, 'utf-8')
  return yaml.parse(content) as Authors
}

export function getAuthor(id: string): Author | null {
  const authors = getAuthors()
  return authors[id] || null
}
