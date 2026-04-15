import { useRef, useState } from 'react'
import type {
  EmbeddedComponentProps,
  EmbeddingProvider
} from '@inkdropapp/types'
import { isXURL, getEmbedURL } from './utils.js'

export const PROVIDER_ID = 'embed:x'

const isLocal = location.protocol === 'file:'

const Tweet: React.FC<EmbeddedComponentProps> = props => {
  const { href } = props
  const contentFrame = useRef<HTMLIFrameElement>(null)
  const [frameId] = useState('twitter-' + Math.random())

  if (!href) {
    return null
  }

  const url = getEmbedURL(href, frameId, isLocal)

  return (
    <iframe
      id={frameId}
      className="embed-frame"
      ref={contentFrame}
      src={url}
      allowTransparency
    />
  )
}

export const xProvider: EmbeddingProvider = {
  id: PROVIDER_ID,
  test: (url: string) => isXURL(url),
  getComponent: () => Tweet
}
