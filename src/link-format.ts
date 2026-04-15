import { editor } from 'inkdrop'
import type { Extension } from '@codemirror/state'
import type { LinkFormatItem, LinkFormatsConfig } from '@inkdropapp/types'
import { isXURL, getEmbedURL } from './utils.js'

const isLocal = location.protocol === 'file:'

function getXIframe(href: string): string {
  const frameId = 'twitter-' + Math.random()
  const src = getEmbedURL(href, frameId, isLocal)
  return [
    `<iframe`,
    ` src="${src}"`,
    ` class="embed-frame"`,
    ` allowtransparency="true"></iframe>`
  ].join('')
}

function getInitialFormats(url: string): LinkFormatItem[] {
  if (!isXURL(url)) return []

  const content = getXIframe(url)
  return [
    {
      type: 'x-embed',
      label: 'X embed iframe',
      detail: '<iframe ...>',
      content,
      order: 50
    }
  ]
}

const config: LinkFormatsConfig = {
  getInitialFormats
}

export function xLinkFormatExtension(): Extension {
  return editor.linkFormatsConfig.of(config)
}
