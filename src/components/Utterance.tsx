import { useColorMode } from '@docusaurus/theme-common'
import React, { useMemo } from 'react'

import useUtterance from '../hooks/useUtterance'

export type Props = React.HTMLAttributes<HTMLDivElement>

export default function Utterance(props: Props) {
  const { colorMode } = useColorMode()
  const options = useMemo(
    () =>
      ({
        repo: 'hexdrinker/blog',
        theme: `github-${colorMode}`,
      } as const),
    [colorMode]
  )

  const { anchor } = useUtterance<HTMLDivElement>(options)

  return (
    <div
      ref={anchor}
      {...props}
    />
  )
}
