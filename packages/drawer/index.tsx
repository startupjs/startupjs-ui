import { useState, useEffect, useRef, type ComponentType, type ReactNode } from 'react'
import {
  SafeAreaView,
  Animated,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { pug, observer } from 'startupjs'
import { themed } from '@startupjs-ui/core'
import Portal from '@startupjs-ui/portal'
import Swipe from './Swipe'
import animate, { type DrawerAnimateStates } from './animate'
import './index.cssx.styl'

const POSITION_STYLES = {
  left: { alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  top: { justifyContent: 'flex-start' },
  bottom: { justifyContent: 'flex-end' }
} satisfies Record<string, ViewStyle>

const POSITION_NAMES = {
  left: 'translateX',
  right: 'translateX',
  top: 'translateY',
  bottom: 'translateY'
} as const

export const _PropsJsonSchema = {/* DrawerProps */}

export interface DrawerProps {
  /** Custom styles applied to the drawer container */
  style?: StyleProp<ViewStyle>
  /** Root component wrapping the drawer area @default SafeAreaView */
  AreaComponent?: ComponentType<any>
  /** Component used as the drawer content wrapper @default View */
  ContentComponent?: ComponentType<any>
  /** Custom styles applied to the swipe responder zone */
  swipeStyle?: StyleProp<ViewStyle>
  /** Content rendered inside the drawer */
  children?: ReactNode
  /** Controlled visibility flag @default false */
  visible?: boolean
  /** Drawer position relative to the screen @default 'left' */
  position?: 'left' | 'right' | 'top' | 'bottom'
  /** Enable swipe-to-close interaction @default true */
  isSwipe?: boolean
  /** Render a dimming overlay behind the drawer @default true */
  hasOverlay?: boolean
  /** Show swipe responder zone @default true */
  showResponder?: boolean
  /** Called after drawer is dismissed (after hide animation completes) */
  onDismiss: () => void
  /** Called after drawer becomes visible (after show animation completes) */
  onRequestOpen?: () => void
}

// TODO: more test for work responder with ScrollView
// https://material-ui.com/ru/components/drawers/#%D1%81%D1%82%D0%BE%D0%B9%D0%BA%D0%B0%D1%8F-%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C
function Drawer ({
  style,
  AreaComponent = SafeAreaView,
  ContentComponent = View,
  swipeStyle,
  children,
  visible = false,
  position = 'left',
  isSwipe = true,
  hasOverlay = true,
  showResponder = true,
  onDismiss,
  onRequestOpen
}: DrawerProps): ReactNode {
  const isHorizontal = position === 'left' || position === 'right'
  const isInvertPosition = position === 'left' || position === 'top'

  const refContent = useRef<any>(null)
  const [isShow, setIsShow] = useState(false)
  const [contentSize, setContentSize] = useState<{ width?: number, height?: number }>({})

  const [animateStates] = useState<DrawerAnimateStates>({
    opacity: new Animated.Value(visible ? 1 : 0),
    position: new Animated.Value(0)
  })

  // -main
  useEffect(() => {
    if (visible) {
      setIsShow(true)
      setTimeout(() => { void runShow() }, 0)
    } else {
      runHide()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])
  // -

  async function waitForDrawerRef () {
    let attempts = 0

    while (attempts < 5) {
      if (refContent.current) return true
      await new Promise(resolve => setTimeout(resolve, 30))
      attempts++
    }

    return !!refContent.current
  }

  async function runShow () {
    await waitForDrawerRef()

    getValidNode(refContent.current).measure((x: number, y: number, width: number, height: number) => {
      const isInit = !contentSize.width
      setContentSize({ width, height })

      animate.show({
        width,
        height,
        animateStates,
        hasOverlay,
        isHorizontal,
        isInvertPosition,
        isInit
      }, () => {
        onRequestOpen && onRequestOpen()
      })
    })
  }

  async function runHide () {
    if (!refContent.current) return

    getValidNode(refContent.current).measure((x: number, y: number, width: number, height: number) => {
      animate.hide({
        width,
        height,
        animateStates,
        hasOverlay,
        isHorizontal,
        isInvertPosition
      }, () => {
        setContentSize({})
        setIsShow(false)
        onDismiss()
      })
    })
  }

  const _styleCase = StyleSheet.flatten([
    POSITION_STYLES[position],
    { opacity: isShow ? 1 : 0 }
  ])

  const _styleContent = StyleSheet.flatten([
    { transform: [{ [POSITION_NAMES[position]]: animateStates.position }] },
    style
  ])

  return pug`
    if isShow
      Portal
        AreaComponent.area
          ContentComponent.case(style=_styleCase)
            if hasOverlay
              TouchableWithoutFeedback.overlayCase(onPress=onDismiss)
                Animated.View.overlay(style={ opacity: animateStates.opacity })

            Animated.View(
              ref=refContent
              styleName={
                contentDefault: isShow,
                contentBottom: isShow && position === 'bottom',
                fullHorizontal: isShow && isHorizontal,
                fullVertical: isShow && !isHorizontal
              }
              style=_styleContent
            )
              if showResponder
                Swipe(
                  position=position
                  contentSize=contentSize
                  swipeStyle=swipeStyle
                  isHorizontal=isHorizontal
                  isSwipe=isSwipe
                  isInvertPosition=isInvertPosition
                  animateStates=animateStates
                  runHide=runHide
                  runShow=runShow
                )
              = children
  `
}

function getValidNode (current: any) {
  return current?.measure
    ? current
    : current?.getNode?.()
}

export default observer(themed('Drawer', Drawer))
