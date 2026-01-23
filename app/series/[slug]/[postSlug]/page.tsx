import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import type { Options } from 'rehype-pretty-code'
import { getSeriesPostBySlug, getPostsBySeries, getAllSeries } from '@/lib/posts'
import { BLOG_AUTHOR } from '@/lib/authors'
import { mdxComponents } from '@/components/mdx'
import {
  TableOfContents,
  MobileTableOfContents,
} from '@/components/blog/TableOfContents'
import { ViewCounter } from '@/components/blog'

const prettyCodeOptions: Options = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  keepBackground: false,
}

interface Props {
  params: Promise<{ slug: string; postSlug: string }>
}

export async function generateStaticParams() {
  const seriesList = getAllSeries()
  const params: { slug: string; postSlug: string }[] = []

  for (const series of seriesList) {
    const posts = getPostsBySeries(series)
    for (const post of posts) {
      params.push({
        slug: series,
        postSlug: post.meta.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, postSlug } = await params
  const post = getSeriesPostBySlug(slug, postSlug)

  if (!post) {
    return {}
  }

  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: 'article',
      publishedTime: post.meta.date,
      authors: [BLOG_AUTHOR],
      tags: post.meta.tags,
      ...(post.meta.thumbnail && {
        images: [
          {
            url: post.meta.thumbnail,
            width: 1200,
            height: 630,
            alt: post.meta.title,
          },
        ],
      }),
    },
    twitter: {
      card: post.meta.thumbnail ? 'summary_large_image' : 'summary',
      title: post.meta.title,
      description: post.meta.description,
      ...(post.meta.thumbnail && {
        images: [post.meta.thumbnail],
      }),
    },
  }
}

export default async function SeriesPostPage({ params }: Props) {
  const { slug, postSlug } = await params
  const post = getSeriesPostBySlug(slug, postSlug)

  if (!post) {
    notFound()
  }

  const contentWithoutTruncate = post.content.replace(/<!--truncate-->/g, '')
  const seriesPosts = getPostsBySeries(slug)
  const currentIndex = seriesPosts.findIndex((p) => p.meta.slug === postSlug)

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <div className='flex gap-8 justify-center xl:justify-start'>
        <article className='flex-1 max-w-3xl min-w-0'>
          <header className='mb-8'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground mb-4'>
              <Link
                href='/series'
                className='hover:text-foreground transition-colors'
              >
                Series
              </Link>
              <span>/</span>
              <Link
                href={`/series/${slug}`}
                className='hover:text-foreground transition-colors'
              >
                {slug}
              </Link>
            </div>

            <h1 className='text-4xl font-bold tracking-tight mb-3'>
              {post.meta.title}
            </h1>

            <div className='flex justify-between items-center gap-3 text-sm text-muted-foreground'>
              <time dateTime={post.meta.date}>
                {format(new Date(post.meta.date), 'MMM dd, yyyy', {
                  locale: enUS,
                })}
              </time>
              <div className='flex items-center gap-3'>
                <ViewCounter slug={`${slug}/${postSlug}`} />
                <span>{post.meta.readingTime}</span>
              </div>
            </div>
          </header>

          <hr className='border-border mb-8' />

          <MobileTableOfContents content={contentWithoutTruncate} />

          {post.meta.thumbnail && (
            <div className='relative w-full aspect-[3/2] mb-8 rounded-lg overflow-hidden'>
              <Image
                src={post.meta.thumbnail}
                alt={post.meta.title}
                fill
                className='object-cover'
                priority
              />
            </div>
          )}
          <div className='prose dark:prose-invert max-w-none'>
            <MDXRemote
              source={contentWithoutTruncate}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
                },
              }}
            />
          </div>

          <hr className='border-border my-12' />

          {/* Series navigation */}
          <nav className='flex justify-between gap-4'>
            {currentIndex > 0 ? (
              <Link
                href={`/series/${slug}/${seriesPosts[currentIndex - 1].meta.slug}`}
                className='flex-1 p-4 border border-border rounded-lg hover:border-foreground/20 transition-colors'
              >
                <span className='text-sm text-muted-foreground'>이전 글</span>
                <p className='font-medium mt-1 line-clamp-1'>
                  {seriesPosts[currentIndex - 1].meta.title}
                </p>
              </Link>
            ) : (
              <div className='flex-1' />
            )}
            {currentIndex < seriesPosts.length - 1 ? (
              <Link
                href={`/series/${slug}/${seriesPosts[currentIndex + 1].meta.slug}`}
                className='flex-1 p-4 border border-border rounded-lg hover:border-foreground/20 transition-colors text-right'
              >
                <span className='text-sm text-muted-foreground'>다음 글</span>
                <p className='font-medium mt-1 line-clamp-1'>
                  {seriesPosts[currentIndex + 1].meta.title}
                </p>
              </Link>
            ) : (
              <div className='flex-1' />
            )}
          </nav>
        </article>

        <aside className='hidden xl:block w-64 shrink-0 self-start sticky top-24'>
          <TableOfContents content={contentWithoutTruncate} />
        </aside>
      </div>
    </div>
  )
}
