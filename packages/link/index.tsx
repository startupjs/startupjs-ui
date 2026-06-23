import { Children, cloneElement, type ReactNode } from 'react'
import { Linking, Platform, type StyleProp, type TextStyle, type ViewStyle } from 'react-native'
import { css, pug, observer, themed } from 'startupjs'
import useRouter from 'startupjs/useRouter'

import Button from '@startupjs-ui/button'
import Div, { type DivProps } from '@startupjs-ui/div'
import Span from '@startupjs-ui/span'

const isWeb = Platform.OS === 'web'
const EXTERNAL_LINK_REGEXP = /^(https?:\/\/|\/\/|mailto:)/i
const DEFAULT_COLOR = 'default'

export default themed('Link', observer(Link))

export const _PropsJsonSchema = {/* LinkProps */} // used in docs generation
export interface LinkProps extends Omit<DivProps, 'style'> {
  /** Custom styles applied to the root view */
  style?: StyleProp<TextStyle | ViewStyle>
  /** Content rendered inside Link */
  children?: ReactNode
  /** Link target path or URL */
  to?: string
  /** Alias for `to` */
  href?: string
  /** Use router push instead of navigate */
  push?: boolean
  /** Replace current history entry instead of pushing */
  replace?: boolean
  /** Display mode @default auto-detected */
  display?: 'inline' | 'block'
  /** Color variant for inline links @default 'default' */
  color?: 'default' | 'primary'
  /** Theme name used for styling */
  theme?: string
  /** Render text in bold style when inline @default false */
  bold?: boolean
  /** Render text in italic style when inline @default false */
  italic?: boolean
  /** onPress handler */
  onPress?: (event: any) => void
}

function Link ({
  style,
  to,
  href,
  color = DEFAULT_COLOR,
  theme,
  display,
  push,
  replace = false,
  children,
  onPress,
  ...restProps
}: LinkProps): ReactNode {
  let bold = restProps.bold
  let italic = restProps.italic
  if (bold == null) bold = false
  if (italic == null) italic = false
  restProps.bold = bold
  restProps.italic = italic

  let target = to ?? ''
  if (href) target = href

  let resolvedDisplay = display
  if (!resolvedDisplay) resolvedDisplay = typeof children === 'string' ? 'inline' : 'block'

  const isBlock = resolvedDisplay === 'block'
  const Component = isBlock ? Div : Span
  const extraProps: Record<string, any> = { role: 'link', onPress: handlePress }
  const {
    navigate: routerNavigate,
    push: routerPush,
    replace: routerReplace,
    usePathname
  } = useRouter()

  const pathname = usePathname()

  if (isWeb) {
    let hrefValue = target ?? ''
    if (!EXTERNAL_LINK_REGEXP.test(hrefValue) && !/^[/?#]/.test(hrefValue)) {
      let p = pathname
      p = p.replace(/#.*$/, '')
      p = p.replace(/\?.*$/, '')
      p = p.replace(/\/$/, '')
      hrefValue = hrefValue.replace(/^\//, '')
      hrefValue = hrefValue.replace(/\/$/, '')
      hrefValue = p + '/' + hrefValue
    }
    extraProps.href = hrefValue
  }

  function handlePress (event: any) {
    if (onPress) onPress(event)

    if (!event.defaultPrevented) {
      if (isWeb) {
        if (isModifiedEvent(event)) return
        event.preventDefault()
      }

      if (EXTERNAL_LINK_REGEXP.test(target ?? '')) {
        const url = target ?? ''
        if (/^mailto:/i.test(url)) {
          if (isWeb && typeof document !== 'undefined') {
            const a = document.createElement('a')
            a.href = url
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          } else {
            Linking.openURL(url)
          }
        } else {
          if (isWeb) {
            window.open(target, '_blank')
          } else {
            Linking.openURL(target ?? '')
          }
        }
      } else {
        let method
        if (push) method = routerPush
        else if (replace) method = routerReplace
        else method = routerNavigate
        method(target)
      }
    }
  }

  if (isBlock) {
    try {
      Children.only(children as any)
      if ((children as any)?.props?.originalType === Button || (children as any)?.type === Button) {
        return cloneElement(children as any, { style, ...restProps, ...extraProps })
      }
    } catch {
      // ignore errors when children contains multiple elements
    }
  }

  return pug`
    Component.root(
      part='root'
      style=style
      styleName=[theme, color, resolvedDisplay]
      ...restProps
      ...extraProps
    )= children
  `
}

function isModifiedEvent (event: any) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

css`
  .root {
    color: var(--Link-color);
    text-decoration-line: underline;
    text-decoration-color: var(--Link-decoration-color);
  }

  .root.primary {
    color: var(--Link-primary-color);
    text-decoration-color: var(--Link-primary-decoration-color);
  }

  .root.block {
    display: flex;
    text-decoration-line: none;
  }
`
