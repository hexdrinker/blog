import { Redirect } from '@docusaurus/router'
import React from 'react'

export default function NotFoundWrapper() {
  return <Redirect to='/blog' />
}
