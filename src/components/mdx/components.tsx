import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1
      className='text-3xl font-semibold mt-8 mb-4'
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className='text-2xl font-semibold mt-8 mb-4 pb-2 border-b border-border'
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className='text-xl font-medium mt-6 mb-3'
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className='text-lg font-medium mt-4 mb-2'
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p
      className='my-4 leading-7 text-foreground/90'
      {...props}
    >
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http')
    if (isExternal) {
      return (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='text-foreground underline underline-offset-4 hover:text-foreground/80'
          {...props}
        >
          {children}
        </a>
      )
    }
    return (
      <Link
        href={href || '#'}
        className='text-foreground underline underline-offset-4 hover:text-foreground/80'
        {...props}
      >
        {children}
      </Link>
    )
  },
  ul: ({ children, ...props }) => (
    <ul
      className='my-4 ml-6 list-disc space-y-2'
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className='my-4 ml-6 list-decimal space-y-2'
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li
      className='leading-7'
      {...props}
    >
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className='my-4 border-l-2 border-border pl-4 text-muted-foreground'
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }) => {
    if (!className) {
      return (
        <code
          className='px-1.5 py-0.5 bg-muted rounded text-sm font-mono'
          {...props}
        >
          {children}
        </code>
      )
    }
    return (
      <code
        className={className}
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }) => (
    <pre
      className='my-4 p-4 bg-muted rounded-lg overflow-x-auto text-sm'
      {...props}
    >
      {children}
    </pre>
  ),
  img: ({ src, alt, ...props }) => {
    if (!src) return null
    if (src.startsWith('http')) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt || ''}
          className='my-4 rounded-lg max-w-full h-auto'
          {...props}
        />
      )
    }
    return (
      <Image
        src={src}
        alt={alt || ''}
        width={800}
        height={400}
        className='my-4 rounded-lg'
        {...props}
      />
    )
  },
  table: ({ children, ...props }) => (
    <div className='my-4 overflow-x-auto'>
      <table
        className='w-full border-collapse text-sm'
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className='border border-border px-4 py-2 bg-muted font-medium text-left'
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className='border border-border px-4 py-2'
      {...props}
    >
      {children}
    </td>
  ),
  hr: (props) => (
    <hr
      className='my-8 border-border'
      {...props}
    />
  ),
  figure: ({ className, children, ...props }) => (
    <figure
      className={`my-4 flex flex-col items-center ${className || ''}`}
      {...props}
    >
      {children}
    </figure>
  ),
  figcaption: ({ children, ...props }) => (
    <figcaption
      className='mt-2 text-sm text-muted-foreground'
      {...props}
    >
      {children}
    </figcaption>
  ),
}
