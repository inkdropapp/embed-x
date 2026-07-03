import type { Environment } from '@inkdropapp/types'

const BASE_X_URL = 'https://x.com/'
const BASE_TWITTER_URL = 'https://twitter.com/'
const EMBED_PROVIDER_URL = 'https://em.ink.md/twitter.html'

export function isXURL(url: string): boolean {
  return url.startsWith(BASE_X_URL) || url.startsWith(BASE_TWITTER_URL)
}

export type ThemeAppearance = 'light' | 'dark'

export function getThemeAppearance(app: Environment): ThemeAppearance {
  const isDark = app.themes
    .getActiveThemes()
    .some(theme => theme.metadata.themeAppearance === 'dark')
  return isDark ? 'dark' : 'light'
}

export function getEmbedURL(
  href: string,
  frameId: string,
  isLocal: boolean,
  theme: ThemeAppearance
): string {
  return `${EMBED_PROVIDER_URL}?url=${encodeURIComponent(href)}&id=${frameId}&origin=${isLocal ? 0 : 1}&theme=${theme}`
}
