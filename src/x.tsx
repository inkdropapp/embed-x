import type { EmbeddedComponentProps, EmbeddingProvider, Environment } from '@inkdropapp/types'
import { useEffect, useRef, useState } from 'react'

import { isXURL, getEmbedURL, getThemeAppearance, type ThemeAppearance } from './utils.js'

export const PROVIDER_ID = 'embed:x'

const isLocal = location.protocol === 'file:'

/**
 * Creates the X embedding provider bound to the given Inkdrop environment.
 * The environment is needed to detect the active theme appearance so the
 * embedded tweet can be rendered in dark mode.
 */
export function createXProvider(app: Environment): EmbeddingProvider {
  const Tweet: React.FC<EmbeddedComponentProps> = props => {
    const { href } = props
    const contentFrame = useRef<HTMLIFrameElement>(null)
    const [frameId] = useState('twitter-' + Math.random())
    const [theme, setTheme] = useState<ThemeAppearance>(() => getThemeAppearance(app))

    useEffect(() => {
      const disposable = app.themes.onDidChangeActiveThemes(() => {
        setTheme(getThemeAppearance(app))
      })
      return () => disposable.dispose()
    }, [])

    if (!href) {
      return null
    }

    const url = getEmbedURL(href, frameId, isLocal, theme)

    return (
      <iframe id={frameId} className="embed-frame" ref={contentFrame} src={url} allowTransparency />
    )
  }

  return {
    id: PROVIDER_ID,
    test: (url: string) => isXURL(url),
    getComponent: () => Tweet
  }
}
