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
import {
  getSeriesPostBySlug,
  getPostsBySeries,
  getAllSeries,
} from '@/lib/posts'
import { getSeriesBySlug } from '@/lib/series'
import { BLOG_AUTHOR } from '@/lib/authors'
import {
  mdxComponents,
  createImg,
  createImageList,
  createMarkdownImg,
} from '@/components/mdx'
import { MobileTableOfContents } from '@/components/blog/TableOfContents'
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

  const hasDescriptionCaption = post.content.includes('<!--description-->')
  const contentWithoutMetaComments = post.content.replace(/<!--description-->/g, '')
  const seriesPosts = getPostsBySeries(slug)
  const currentIndex = seriesPosts.findIndex((p) => p.meta.slug === postSlug)
  const seriesInfo = getSeriesBySlug(slug)

  // 문서 폴더 구조를 기준으로 이미지 경로 자동 조합
  const imagePath = post.meta.imageBasePath || `series/${slug}/${postSlug}`
  const components = {
    ...mdxComponents,
    Img: createImg(imagePath),
    ImageList: createImageList(imagePath),
    img: createMarkdownImg(imagePath),
  }

  return (
    <div className='max-w-3xl mx-auto px-4 py-12'>
      <article className='min-w-0'>
        <header className='mb-8'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground mb-4'>
              <Link
                href='/series'
                className='hover:text-foreground transition-colors'
              >
                시리즈
              </Link>
            <span>/</span>
            <Link
              href={`/series/${slug}`}
              className='hover:text-foreground transition-colors'
            >
              {seriesInfo?.title ?? slug}
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

        <MobileTableOfContents content={contentWithoutMetaComments} />

        {post.meta.thumbnail && (
          <figure className='w-4/5 mx-auto mb-8'>
            <div className='relative aspect-[3/2] rounded-lg overflow-hidden'>
              <Image
                src={post.meta.thumbnail}
                alt={post.meta.title}
                fill
                className='object-cover'
                priority
              />
            </div>
            {hasDescriptionCaption && post.meta.description && (
              <figcaption className='mt-2 text-center text-sm text-muted-foreground'>
                {post.meta.description}
              </figcaption>
            )}
          </figure>
        )}
        <div className='prose dark:prose-invert max-w-none'>
          <MDXRemote
            source={contentWithoutMetaComments}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypePrettyCode, prettyCodeOptions],
                ],
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
    </div>
  )
}
