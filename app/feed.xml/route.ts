import { getAllPosts } from '@/lib/posts'

const SITE_URL = 'https://hexdrinker.dev'
const SITE_TITLE = 'hexdrinker blog'
const SITE_DESCRIPTION = 'hexdrinker의 개발 블로그'

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = getAllPosts()

  const rssItems = posts
    .map((post) => {
      const postUrl = `${SITE_URL}/${post.slug}`
      const pubDate = new Date(post.meta.date).toUTCString()

      return `    <item>
      <title>${escapeXml(post.meta.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.meta.description || post.excerpt || '')}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.meta.category)}</category>
    </item>`
    })
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
