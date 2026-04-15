import { markdownRenderer } from 'inkdrop'
import type { Extension } from '@codemirror/state'
import { xProvider, PROVIDER_ID } from './x.js'
import { xLinkFormatExtension } from './link-format.js'

const ALLOWED_SCHEMES = ['https:', 'http:']

function isSafeUri(uri: string): boolean {
  try {
    const parsed = new URL(uri)
    return ALLOWED_SCHEMES.includes(parsed.protocol)
  } catch {
    return false
  }
}

class InkdropPlugin {
  private extension: Extension | null = null

  activate() {
    markdownRenderer.embeddings.register(xProvider)
    window.addEventListener('message', this.handleMessageFromFrame, false)

    this.extension = xLinkFormatExtension()
    inkdrop.onEditorLoad(() => {
      inkdrop.commands.dispatch(document.body, 'editor:add-extension', {
        extension: this.extension
      })
    })
  }

  deactivate() {
    markdownRenderer.embeddings.unregister(PROVIDER_ID)
    window.removeEventListener('message', this.handleMessageFromFrame, false)

    if (this.extension) {
      inkdrop.commands.dispatch(document.body, 'editor:remove-extension', {
        extension: this.extension
      })
      this.extension = null
    }
  }

  handleMessageFromFrame(event: MessageEvent) {
    const { data } = event
    if (data instanceof Object) {
      switch (data.message) {
        case 'embed:open-external': {
          const { uri } = data
          if (!uri || !isSafeUri(uri)) break
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const electron = globalThis.require('electron')
          if (electron && electron.shell) {
            electron.shell.openExternal(uri)
          } else if ((window as any).inkdrop.sendMessageToNative) {
            ;(window as any).inkdrop.sendMessageToNative({
              message: 'core:open-link',
              params: { uri }
            })
          }
          break
        }
      }
    }
  }
}

const plugin = new InkdropPlugin()
export default plugin
