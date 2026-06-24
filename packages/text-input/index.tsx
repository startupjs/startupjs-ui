import {
  useState,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject
} from 'react'
import {
  TextInput as RNTextInput,
  Platform,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  type TextInputProps
} from 'react-native'
import { css, pug, observer, useCssVariable, useIsomorphicLayoutEffect, themed } from 'startupjs'
import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import Span from '@startupjs-ui/span'

const IS_WEB = Platform.OS === 'web'
const IS_ANDROID = Platform.OS === 'android'
const ICON_SIZES = {
  s: 'm',
  m: 'm',
  l: 'l'
} as const
const HEIGHT_FALLBACKS = {
  s: 16,
  m: 20,
  l: 24
}
const PADDING_FALLBACKS = {
  s: 4,
  m: 6,
  l: 8
}

function toNumber (value: unknown, fallback: number): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function toOptionalNumber (value: unknown): number | undefined {
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

export default themed('TextInput', observer(TextInput))

export const _PropsJsonSchema = {/* TextInputProps */}

export interface UITextInputProps extends Omit<TextInputProps, 'placeholder' | 'style'> {
  /** Ref to access the underlying input */
  ref?: RefObject<any>
  /** Custom styles for the wrapper element */
  style?: StyleProp<ViewStyle>
  /** Custom styles for the input element */
  inputStyle?: StyleProp<TextStyle>
  /** Custom styles for the primary icon */
  iconStyle?: StyleProp<TextStyle>
  /** Custom styles for the secondary icon */
  secondaryIconStyle?: StyleProp<TextStyle>
  /** Placeholder text */
  placeholder?: string | number
  /** Test identifier */
  testID?: string
  /** Input value @default '' */
  value?: string
  /** Size preset @default 'm' */
  size?: 'l' | 'm' | 's'
  /** Disable input interactions @default false */
  disabled?: boolean
  /** Render a non-editable value @default false */
  readonly?: boolean
  /** Enable dynamic height based on content @default false */
  resize?: boolean
  /** Number of lines to display @default 1 */
  numberOfLines?: number
  /** Primary icon component */
  icon?: any
  /** Position of the primary icon @default 'left' */
  iconPosition?: 'left' | 'right'
  /** Secondary icon component */
  secondaryIcon?: any
  /** Primary icon press handler */
  onIconPress?: () => void
  /** Secondary icon press handler */
  onSecondaryIconPress?: () => void
  /** Focus event handler */
  onFocus?: (...args: any[]) => void
  /** Blur event handler */
  onBlur?: (...args: any[]) => void
  /** Change text handler */
  onChangeText?: (...args: any[]) => void
  /** Custom wrapper renderer @private */
  _renderWrapper?: (options: { style?: StyleProp<ViewStyle> }, children: ReactNode) => ReactNode
  /** Error state flag @private */
  _hasError?: boolean
}

function TextInput ({
  ref,
  style,
  inputStyle,
  iconStyle,
  secondaryIconStyle,
  placeholder,
  value = '',
  size = 'm',
  disabled = false,
  readonly = false,
  resize = false,
  numberOfLines = 1,
  iconPosition = 'left',
  icon,
  secondaryIcon,
  onFocus,
  onBlur,
  onIconPress,
  onSecondaryIconPress,
  _renderWrapper,
  _hasError,
  ...props
}: UITextInputProps): ReactNode {
  const [focused, setFocused] = useState(false)
  const [currentNumberOfLines, setCurrentNumberOfLines] = useState(numberOfLines)
  const fallbackRef = useRef<any>(null)
  const inputRef = ref ?? fallbackRef

  const caretColor = useCssVariable('--TextInput-caret-color', 'var(--TextInput-color)') as string
  const resolvedIconColor = useCssVariable('--TextInput-icon-color', 'var(--color-muted-foreground)') as string
  const placeholderTextColor = useCssVariable('--TextInput-placeholder-color', 'var(--color-muted-foreground)') as string
  const borderWidth = toNumber(useCssVariable('--TextInput-border-width', 1), 1)
  const inputHeight = toNumber(useCssVariable(`--TextInput-height-${size}`), HEIGHT_FALLBACKS[size])
  const inputPadding = toNumber(useCssVariable(`--TextInput-padding-y-${size}`), PADDING_FALLBACKS[size])
  const lineHeight = toOptionalNumber(useCssVariable(`--TextInput-line-height-${size}`))

  function handleFocus (...args: any[]) {
    onFocus && onFocus(...args)
    setFocused(true)
  }
  function handleBlur (...args: any[]) {
    onBlur && onBlur(...args)
    setFocused(false)
  }

  if (!_renderWrapper) {
    _renderWrapper = ({ style }: { style?: StyleProp<ViewStyle> }, children: ReactNode): ReactNode => pug`
      Div(style=style)= children
    `
  }

  useIsomorphicLayoutEffect(() => {
    if (readonly || !resize) return
    const numberOfLinesInValue = value.split('\n').length
    if (numberOfLinesInValue >= numberOfLines) {
      setCurrentNumberOfLines(numberOfLinesInValue)
    }
  }, [value, resize, numberOfLines, readonly])

  if (IS_WEB) {
    // repeat mobile behaviour on the web
    // TODO
    // test mobile device behaviour

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useIsomorphicLayoutEffect(() => {
      if (readonly) return
      if (focused && disabled) {
        inputRef.current?.blur()
        setFocused(false)
      }
    }, [disabled, focused, readonly])
    // fix minWidth on web
    // ref: https://stackoverflow.com/a/29990524/1930491
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useIsomorphicLayoutEffect(() => {
      if (readonly) return
      // TODO: looks like it's not available anymore on new versions of react-native-web
      inputRef.current?.setNativeProps?.({ size: '1' })
    }, [readonly])
  }

  // useDidUpdate(() => {
  //   if (readonly) return
  //   if (numberOfLines !== currentNumberOfLines) {
  //     setCurrentNumberOfLines(numberOfLines)
  //   }
  // }, [numberOfLines, currentNumberOfLines, readonly])

  const multiline = useMemo(() => {
    return resize || numberOfLines > 1
  }, [resize, numberOfLines])

  const legacySizing = useMemo(() => {
    if (typeof inputHeight !== 'number' || typeof lineHeight !== 'number') return

    const verticalPadding = Math.max((inputHeight - lineHeight) / 2 - borderWidth, 0)
    const fullHeight = currentNumberOfLines * lineHeight + 2 * (verticalPadding + borderWidth)

    return {
      fullHeight,
      inputStyle: {
        lineHeight,
        paddingTop: verticalPadding,
        paddingBottom: verticalPadding
      }
    }
  }, [borderWidth, currentNumberOfLines, inputHeight, lineHeight])

  const fullHeight = useMemo(() => {
    if (legacySizing) return legacySizing.fullHeight
    return currentNumberOfLines * inputHeight + inputPadding * 2
  }, [currentNumberOfLines, inputHeight, inputPadding, legacySizing])

  function onLayoutIcon (e: any) {
    if (IS_WEB) {
      e.nativeEvent.target.childNodes[0].tabIndex = -1
      e.nativeEvent.target.childNodes[0].childNodes[0].tabIndex = -1
    }
  }

  const inputExtraProps: Record<string, any> = {}
  if (IS_WEB) inputExtraProps.disabled = disabled
  if (IS_ANDROID && multiline) inputExtraProps.textAlignVertical = 'top'
  const inputMinHeightStyle = legacySizing ? null : { minHeight: fullHeight }
  const inputStyleName = [
    size,
    {
      disabled,
      focused,
      [`icon-${iconPosition}`]: !!icon,
      [`icon-${getOppositePosition(iconPosition)}`]: !!secondaryIcon,
      error: _hasError
    }
  ]

  if (readonly) {
    return pug`
      Span= value
    `
  }

  return _renderWrapper({
    style: legacySizing ? [{ minHeight: fullHeight }, style] : [style]
  }, pug`
    RNTextInput.input-input(
      part=['input', {
        inputIconLeft: icon && iconPosition === 'left',
        inputIconRight: icon && iconPosition === 'right'
      }]
      ref=inputRef
      style=[inputMinHeightStyle, legacySizing?.inputStyle, inputStyle]
      styleName=inputStyleName
      selectionColor=caretColor
      placeholder=placeholder == null ? undefined : String(placeholder)
      placeholderTextColor=placeholderTextColor
      value=value
      editable=IS_WEB ? undefined : !disabled
      multiline=multiline
      selectTextOnFocus=false
      onFocus=handleFocus
      onBlur=handleBlur
      ...props
      ...inputExtraProps
    )
    if icon
      Div.input-icon(
        focusable=false
        onLayout=onLayoutIcon
        styleName=[size, iconPosition]
        onPress=disabled ? undefined : onIconPress
        pointerEvents=onIconPress ? undefined : 'none'
      )
        Icon(
          part='icon'
          icon=icon
          size=ICON_SIZES[size]
          style=[{ color: resolvedIconColor }, iconStyle]
        )
    if secondaryIcon
      Div.input-icon(
        focusable=false
        onLayout=onLayoutIcon
        styleName=[size, getOppositePosition(iconPosition)]
        onPress=disabled ? undefined : onSecondaryIconPress
        pointerEvents=onSecondaryIconPress ? undefined : 'none'
      )
        Icon(
          part='secondaryIcon'
          icon=secondaryIcon
          size=ICON_SIZES[size]
          style=[{ color: resolvedIconColor }, secondaryIconStyle]
        )
  `)
}

function getOppositePosition (position: 'left' | 'right') {
  return position === 'left' ? 'right' : 'left'
}

css`
  .input-input {
    margin: 0;
    flex: 1;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: var(--TextInput-padding-x);
    padding-right: var(--TextInput-padding-x);
    color: var(--TextInput-color);
    background-color: var(--TextInput-bg);
    border-width: var(--TextInput-border-width);
    border-style: solid;
    border-color: var(--TextInput-border-color);
    border-radius: var(--TextInput-radius);
    min-width: var(--TextInput-min-width);
    font-family: var(--font-sans);
  }

  .input-input.s {
    padding-top: var(--TextInput-padding-y-s);
    padding-bottom: var(--TextInput-padding-y-s);
    font-size: var(--TextInput-font-size-s);
    line-height: var(--TextInput-height-s);
  }

  .input-input.m {
    padding-top: var(--TextInput-padding-y-m);
    padding-bottom: var(--TextInput-padding-y-m);
    font-size: var(--TextInput-font-size-m);
    line-height: var(--TextInput-height-m);
  }

  .input-input.l {
    padding-top: var(--TextInput-padding-y-l);
    padding-bottom: var(--TextInput-padding-y-l);
    font-size: var(--TextInput-font-size-l);
    line-height: var(--TextInput-height-l);
  }

  .input-input.disabled {
    background-color: var(--TextInput-bg-disabled);
  }

  .input-input.focused {
    border-color: var(--TextInput-border-color-focused);
  }

  .input-input.error {
    border-color: var(--TextInput-border-color-error);
  }

  .input-input.icon-left.s,
  .input-input.icon-left.m {
    padding-left: var(--TextInput-icon-padding-m);
  }

  .input-input.icon-right.s,
  .input-input.icon-right.m {
    padding-right: var(--TextInput-icon-padding-m);
  }

  .input-input.icon-left.l {
    padding-left: var(--TextInput-icon-padding-l);
  }

  .input-input.icon-right.l {
    padding-right: var(--TextInput-icon-padding-l);
  }

  .input-icon {
    position: absolute;
    top: 0;
    bottom: 0;
    justify-content: center;
    z-index: 1;
  }

  .input-icon.left {
    left: var(--TextInput-icon-offset);
  }

  .input-icon.right {
    right: var(--TextInput-icon-offset);
  }
`
