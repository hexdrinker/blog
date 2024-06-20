import Utterance from '@site/src/components/Utterance'
import BlogPostPaginator from '@theme-original/BlogPostPaginator'
import React from 'react'

export default function BlogPostPaginatorWrapper(props) {
  return (
    <>
      <BlogPostPaginator {...props} />
      <Utterance style={{ marginTop: '50px' }} />
    </>
  )
}
