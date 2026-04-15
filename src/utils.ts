const BASE_X_URL = 'https://x.com/'
const BASE_TWITTER_URL = 'https://twitter.com/'
const EMBED_PROVIDER_URL = 'https://em.ink.md/twitter.html'

export function isXURL(url: string): boolean {
  return url.startsWith(BASE_X_URL) || url.startsWith(BASE_TWITTER_URL)
}

export function getEmbedURL(
  href: string,
  frameId: string,
  isLocal: boolean
): string {
  return `${EMBED_PROVIDER_URL}?url=${encodeURIComponent(href)}&id=${frameId}&origin=${isLocal ? 0 : 1}`
}
