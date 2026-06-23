import React, {
  useImperativeHandle,
  useEffect,
  useState,
  useMemo,
  useRef,
  type ReactNode,
  type Ref
} from 'react'
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { css, pug, observer, themed } from 'startupjs'

import Div from '@startupjs-ui/div'
import Icon from '@startupjs-ui/icon'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'

/* eslint-disable react-hooks/exhaustive-deps */
export const _PropsJsonSchema = {/* CarouselProps */}

export interface CarouselProps {
  /** Custom styles applied to the outer wrapper */
  style?: StyleProp<ViewStyle>
  /** Styles for the back arrow container and icon */
  arrowBackStyle?: StyleProp<any>
  /** Styles for the next arrow container and icon */
  arrowNextStyle?: StyleProp<any>
  /** Initial active slide index @default 0 */
  startIndex?: number
  /** Direction of movement @default 'horizontal' */
  variant?: 'horizontal' | 'vertical'
  /** Enable swipe gestures @default true */
  isSwipe?: boolean
  /** Auto-scroll slides in a loop @default false */
  isLoop?: boolean
  /** Enable endless carousel mode @default false */
  isEndless?: boolean
  /** Adjust slide sizes based on available space @default false */
  isResponsive?: boolean
  /** Show navigation arrows @default true */
  hasArrows?: boolean
  /** Show navigation dots (responsive only) @default false */
  hasDots?: boolean
  /** Animation duration in ms @default 300 */
  duration?: number
  /** Slides to render inside the carousel */
  children?: any[]
  /** Callback fired when active slide changes */
  onChange?: (index: number) => void
  /** Test identifier */
  testID?: string
  /** Ref exposing active child and navigation helpers */
  ref?: Ref<any>
}

function Carousel ({
  style,
  arrowBackStyle = {},
  arrowNextStyle = {},
  startIndex = 0,
  variant = 'horizontal',
  isSwipe = true,
  isLoop = false,
  isEndless = false,
  isResponsive = false,
  hasArrows = true,
  hasDots = false,
  duration = 300,
  children = [],
  onChange,
  testID,
  ref
}: CarouselProps): ReactNode {
  arrowBackStyle = StyleSheet.flatten(arrowBackStyle)
  arrowNextStyle = StyleSheet.flatten(arrowNextStyle)
  const backArrowColor = arrowBackStyle?.color || '#eeeeee'
  const nextArrowColor = arrowNextStyle?.color || '#eeeeee'

  const refRoot = useRef<any>(null)
  const refCase = useRef<any>(null)
  const refTimeout = useRef<any>(null)
  const childrenInfo = useRef<any[]>([])
  const coardName = variant === 'horizontal' ? 'x' : 'y'
  const sideName = variant === 'horizontal' ? 'width' : 'height'

  const childrenRefs = useMemo(() => {
    const _refs: Record<number, any> = {}
    children.forEach((c, i) => {
      _refs[i] = React.createRef()
    })
    return _refs
  }, [children])

  const validChildren = useMemo(() => {
    return getValidChildren({ children, isEndless, isResponsive, childrenRefs })
  }, [children, childrenRefs, isEndless, isResponsive])

  const [activeIndex, setActiveIndex] = useState(startIndex)
  const [rootInfo, setRootInfo] = useState<Record<string, number>>({})
  const [caseInfo, setCaseInfo] = useState<Record<string, number>>({})
  const [animateTranslate, setAnimateTranslate] = useState(new Animated.Value(0))
  const [caseStyle, setCaseStyle] = useState<Record<string, any>>({})

  const [startDrag, setStartDrag] = useState<any>(null)
  const [endDrag, setEndDrag] = useState<any>(null)
  const [isRender, setIsRender] = useState(false)
  const [isAnimate, setIsAnimate] = useState(false)

  useImperativeHandle(ref, () => {
    return new Proxy(refRoot.current, {
      get (target: any, prop: any) {
        const actualChildIndex = activeIndex % children.length
        const activeRef = childrenRefs[actualChildIndex].current
        if (prop === 'getChildByIndex') return getChildByIndex
        if (prop === 'activeChild') return activeRef
        if (prop === 'element') return refRoot.current
        if (prop === 'toBack') return onBack
        if (prop === 'toNext') return onNext
        if (prop === 'toIndex') return toIndex
        if (target?.[prop]) return target[prop]
        return activeRef?.[prop]
      }
    })
  }, [
    activeIndex,
    rootInfo,
    caseInfo,
    isAnimate,
    isRender
  ])

  useEffect(() => {
    if (isRender && isLoop && !isAnimate) {
      refTimeout.current = setTimeout(onNext, 3000)
    } else {
      clearTimeout(refTimeout.current)
    }
  }, [isRender, isLoop, isAnimate, activeIndex])

  function getChildByIndex (index: number) {
    return childrenRefs[index].current
  }

  function onLayoutChild ({ nativeEvent }: any, index: number) {
    childrenInfo.current[index] = {
      width: Math.round(nativeEvent.layout.width),
      height: Math.round(nativeEvent.layout.height),
      x: Math.round(nativeEvent.layout.x),
      y: Math.round(nativeEvent.layout.y)
    }

    if (childrenInfo.current.length === validChildren.length && !isRender) {
      const isChildNotExists = childrenInfo.current.includes(undefined)
      if (isChildNotExists) return

      if (isEndless && isResponsive) {
        setActiveIndex(children.length + startIndex)

        const coard = childrenInfo.current[children.length + startIndex] &&
          -childrenInfo.current[children.length + startIndex][coardName]
        animateTranslate.setValue(coard || 0)
      } else {
        setActiveIndex(startIndex)

        const coard = childrenInfo.current[startIndex] &&
          -childrenInfo.current[startIndex][coardName]
        animateTranslate.setValue(coard || 0)
      }

      setIsRender(true)
    }
  }

  function toIndex (index: number) {
    setIsAnimate(true)

    if (isEndless && isResponsive) {
      index = index + children.length
    }

    let activeElement: any = childrenInfo.current[index]
    activeElement.index = index

    let toValue = -activeElement[coardName]
    if (caseInfo[sideName] - activeElement[coardName] < rootInfo[sideName]) {
      activeElement = getClosest({
        childrenInfo: childrenInfo.current,
        newPosition: caseInfo[sideName] - rootInfo[sideName],
        coardName,
        sideName
      })
      toValue = rootInfo[sideName] - caseInfo[sideName]
    }

    setActiveIndex(activeElement.index)
    onChange && onChange(activeElement.index % children.length)
    Animated.timing(animateTranslate, { toValue, duration, useNativeDriver: false }).start(() => {
      setIsAnimate(false)
    })
  }

  function onBack () {
    if ((activeIndex === 0 &&
        (animateTranslate as any)._value === 0 &&
        !isEndless) || isAnimate) return

    setIsAnimate(true)

    let activeElement: any = childrenInfo.current[activeIndex - 1]
    if (isResponsive) {
      activeElement.index = activeIndex - 1
    } else {
      const newPosition = childrenInfo.current[activeIndex][coardName] +
        childrenInfo.current[activeIndex][sideName] - rootInfo[sideName]

      activeElement = getClosest({
        childrenInfo: childrenInfo.current,
        coardName,
        sideName,
        newPosition
      })
    }

    let toValue = -activeElement[coardName]

    if (isEndless && !isResponsive && (activeIndex === 0)) {
      activeElement = getClosest({
        childrenInfo: childrenInfo.current,
        newPosition: caseInfo[sideName] - rootInfo[sideName],
        coardName,
        sideName
      })
      toValue = rootInfo[sideName] - caseInfo[sideName]
    }

    if (isEndless && isResponsive && (activeIndex - 1 < children.length)) {
      const index = activeElement.index * 2 + 1
      setActiveIndex(index)
      onChange && onChange(index % children.length)
    } else {
      setActiveIndex(activeElement.index)
      onChange && onChange(activeElement.index % children.length)
    }

    Animated.timing(animateTranslate, { toValue, duration, useNativeDriver: false }).start(() => {
      if (isEndless && isResponsive && activeIndex - 1 < children.length) {
        animateTranslate.setValue(-childrenInfo.current[activeElement.index * 2 + 1][coardName])
      }

      setIsAnimate(false)
    })
  }

  function onNext () {
    if (isAnimate) return
    if (!childrenInfo.current[activeIndex + 1] && !isEndless) return
    if ((caseInfo[sideName] - childrenInfo.current[activeIndex][coardName] <= rootInfo[sideName]) && !isEndless) {
      return
    }

    setIsAnimate(true)

    let activeElement: any = childrenInfo.current[activeIndex + 1]
    if (isResponsive) {
      activeElement.index = activeIndex + 1
    } else {
      if (childrenInfo.current[activeIndex][coardName] + childrenInfo.current[activeIndex][sideName] > rootInfo[sideName]) {
        activeElement.index = activeIndex + 1
      } else {
        activeElement = getClosest({
          childrenInfo: childrenInfo.current,
          newPosition: childrenInfo.current[activeIndex][coardName] + rootInfo[sideName],
          coardName,
          sideName
        })
      }
    }

    let toValue = -activeElement[coardName]
    if (caseInfo[sideName] - activeElement[coardName] < rootInfo[sideName]) {
      activeElement = getClosest({
        childrenInfo: childrenInfo.current,
        newPosition: caseInfo[sideName] - rootInfo[sideName],
        coardName,
        sideName
      })
      toValue = -(caseInfo[sideName] - rootInfo[sideName])
    }

    if (isEndless && !isResponsive && ((animateTranslate as any)._value === -(caseInfo[sideName] - rootInfo[sideName]))) {
      activeElement = childrenInfo.current[0]
      activeElement.index = 0
      toValue = activeElement[coardName]
    }

    if (isEndless && isResponsive && activeIndex + 1 >= (children.length * 2)) {
      setActiveIndex(children.length)
      onChange && onChange(0)
    } else {
      setActiveIndex(activeElement.index)
      onChange && onChange(activeElement.index % children.length)
    }

    Animated.timing(animateTranslate, { toValue, duration, useNativeDriver: false }).start(() => {
      if (isEndless && isResponsive && activeIndex + 1 >= (children.length * 2)) {
        animateTranslate.setValue(-childrenInfo.current[children.length][coardName])
      }

      setIsAnimate(false)
    })
  }

  useEffect(() => {
    if (!endDrag) return
    if (startDrag === endDrag) return
    setIsAnimate(true)

    let _endDrag = endDrag
    if (-endDrag > caseInfo[sideName]) {
      _endDrag = -caseInfo[sideName]
    }

    let activeElement: any = getClosest({
      childrenInfo: childrenInfo.current,
      newPosition: -_endDrag,
      coardName,
      sideName
    })
    const side = (startDrag > _endDrag) ? 'next' : 'back'

    if (activeElement.index === activeIndex) {
      if (side === 'next') {
        if (!childrenInfo.current[activeIndex + 1]) {
          activeElement = childrenInfo.current[activeIndex]
        } else {
          activeElement = childrenInfo.current[activeIndex + 1]
          activeElement.index = activeIndex + 1
        }
      } else if (activeIndex - 1 >= 0) {
        activeElement = childrenInfo.current[activeIndex - 1]
        activeElement.index = activeIndex - 1
      }
    }

    let toValue = -activeElement[coardName]
    if (caseInfo[sideName] - activeElement[coardName] < rootInfo[sideName]) {
      activeElement = getClosest({
        childrenInfo: childrenInfo.current,
        newPosition: caseInfo[sideName] - rootInfo[sideName],
        coardName,
        sideName
      })
      toValue = -(caseInfo[sideName] - rootInfo[sideName])
    }

    if (side === 'back' && isEndless && isResponsive && (activeIndex - 1 < children.length)) {
      const index = activeElement.index * 2 + 1
      setActiveIndex(index)
      onChange && onChange(index % children.length)
    } else if (side === 'next' && isEndless && isResponsive && (activeIndex + 1 >= (children.length * 2))) {
      setActiveIndex(children.length)
      onChange && onChange(0)
    } else {
      setActiveIndex(activeElement.index)
      onChange && onChange(activeElement.index % children.length)
    }

    Animated.timing(animateTranslate, { toValue, duration, useNativeDriver: false }).start(() => {
      if (side === 'back' && isEndless && isResponsive && activeIndex - 1 < children.length) {
        animateTranslate.setValue(-childrenInfo.current[activeElement.index * 2 + 1][coardName])
      }

      if (side === 'next' && isEndless && isResponsive && (activeIndex + 1 >= (children.length * 2))) {
        animateTranslate.setValue(-childrenInfo.current[children.length][coardName])
      }

      setIsAnimate(false)
    })
  }, [endDrag])

  const panResponder = useMemo(() => {
    if (isSwipe && !isAnimate) {
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          if (!(gestureState.dx === 0 && gestureState.dy === 0)) {
            setCaseStyle({ pointerEvents: 'box-only' })
            return true
          } else {
            return false
          }
        },
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => false,
        onPanResponderGrant: e => {
          setAnimateTranslate(animateTranslate => {
            setStartDrag((animateTranslate as any)._value)
            return animateTranslate
          })
        },
        onPanResponderMove: (e, gesture) => {
          const delta = (gesture as any)['d' + coardName]
          setStartDrag((startDrag: any) => {
            animateTranslate.setValue(startDrag + delta)
            return startDrag
          })
        },
        onPanResponderEnd: () => {
          setAnimateTranslate(animateTranslate => {
            setEndDrag((animateTranslate as any)._value)
            setCaseStyle({})
            return animateTranslate
          })
        }
      })
    }

    return { panHandlers: {} }
  }, [animateTranslate, coardName, isAnimate, isSwipe])

  const renderChildren = React.Children.toArray(validChildren).map((child: any, index, arr) => {
    const _style = StyleSheet.flatten([child.props.style])

    const sideCapitalLetter = sideName[0].toUpperCase() + sideName.slice(1)

    if (isResponsive) {
      if ((!_style['min' + sideCapitalLetter] || !_style['max' + sideCapitalLetter]) && _style['min' + sideCapitalLetter] !== '100%') {
        console.error('isResponsive need minWidth and maxWidth in children')
        return null
      }

      if (!rootInfo[sideName]) return null

      let step = 1
      let _side

      if (_style['min' + sideCapitalLetter] === '100%') {
        _style['min' + sideCapitalLetter] = rootInfo[sideName]
        _style['max' + sideCapitalLetter] = rootInfo[sideName]
        _side = rootInfo[sideName]
        step = -1
      }

      while (step !== -1) {
        _side = rootInfo[sideName] / step

        if (isNaN(_side)) break
        if (step > 10) {
          console.error('no valid minSide/maxSide')
          break
        }
        if ((_side >= _style['min' + sideCapitalLetter]) && (_side <= _style['max' + sideCapitalLetter])) {
          break
        }

        step++
      }

      if (_side && !isNaN(_side)) _style[sideName] = _side
    }

    child = React.cloneElement(child, { style: _style })

    return pug`
      View(
        key=index
        onLayout=e => onLayoutChild(e, index)
      )= child
    `
  })

  function onLayoutRoot ({ nativeEvent }: any) {
    setRootInfo({
      width: Math.round(nativeEvent.layout.width),
      height: Math.round(nativeEvent.layout.height)
    })
  }

  function onLayoutCase ({ nativeEvent }: any) {
    setCaseInfo({
      width: Math.round(nativeEvent.layout.width),
      height: Math.round(nativeEvent.layout.height)
    })
  }

  const dots = getDotsArray({
    children,
    childrenInfo: childrenInfo.current,
    coardName,
    sideName,
    rootInfo,
    caseInfo,
    isRender,
    isEndless,
    isResponsive
  })

  return pug`
    Div.wrapper(style=[style, { opacity: isRender ? 1 : 0 }] testID=testID)
      Div.carousel(styleName=variant)
        if hasArrows
          Div.arrow.arrowBack(
            style=arrowBackStyle
            styleName=variant
            onPress=onBack
          )
            Icon.icon(
              style={ color: backArrowColor }
              icon=variant === 'vertical' ? faAngleUp : faAngleLeft
              size='xxl'
            )
        View.root(
          ref=refRoot
          styleName=variant
          onLayout=onLayoutRoot
        )
          Animated.View.case(
            ref=refCase
            ...panResponder.panHandlers
            style=[
              {
                transform: [{
                  ['translate' + coardName.toUpperCase()]: animateTranslate
                }]
              },
              caseStyle
            ]
            styleName=variant
            onLayout=onLayoutCase
          )= renderChildren
        if hasArrows
          Div.arrow.arrowNext(
            style=arrowNextStyle
            styleName=variant
            onPress=onNext
          )
            Icon.icon(
              style={ color: nextArrowColor }
              icon=variant === 'vertical' ? faAngleDown : faAngleRight
              size='xxl'
            )

      if hasDots && isResponsive
        Div.dots(row)
          each _dummy, index in dots
            // noop on _dummy value to prevent eslint no-unused-vars error, since we only need the index here
            - _dummy?.noop?.()
            Div.dot(
              key=index
              onPress=() => toIndex(index)
              styleName={ dotActive: activeIndex === (isEndless ? (index + children.length) : index) }
            )
  `
}

function getClosest ({
  childrenInfo,
  newPosition,
  coardName,
  sideName
}: any) {
  let activeElement: any = {}

  for (let index = 0; index < childrenInfo.length; index++) {
    const item = childrenInfo[index]

    if (newPosition < item[coardName] && index === 0) {
      activeElement = { ...item, index }
      break
    }

    if (newPosition >= item[coardName] && newPosition <= (item[coardName] + item[sideName])) {
      activeElement = { ...item, index }
    }
  }

  return activeElement
}

function getDotsArray ({
  children,
  childrenInfo,
  coardName,
  sideName,
  rootInfo,
  caseInfo,
  isRender,
  isEndless,
  isResponsive
}: any) {
  if (!isRender) return []
  if (isEndless && isResponsive) return childrenInfo.slice(children.length * 2)

  return childrenInfo.filter((item: any) => {
    if (!item) return false
    return Math.round(item[coardName]) <= (caseInfo[sideName] - rootInfo[sideName])
  })
}

function getValidChildren ({ children, isEndless, isResponsive, childrenRefs }: any) {
  const childrenWithRefs = React.Children.toArray(children)
    .map((child: any, index: number) => {
      const childRef = childrenRefs[index]
      return React.cloneElement(child, { ref: childRef })
    })
  if (isEndless && isResponsive) {
    return [...children, ...childrenWithRefs, ...children]
  }

  return childrenWithRefs
}

export default observer(themed('Carousel', Carousel))

css`
  .wrapper {
    flex-grow: 1;
    flex-shrink: 1;
    flex-direction: column;
  }

  .carousel {
    flex-grow: 1;
    flex-shrink: 1;
    flex-direction: row;
  }

  .carousel.vertical {
    flex-direction: column;
  }

  .arrow {
    background-color: var(--Carousel-arrow-bg);
    align-self: center;
    cursor: pointer;
    position: absolute;
    user-select: none;
    z-index: 999;
    border-radius: var(--Carousel-arrow-radius);
    padding: var(--Carousel-arrow-padding);
  }

  .arrow.vertical {
    position: relative;
  }

  .arrowNext {
    right: var(--Carousel-arrow-offset);
  }

  .arrowNext.vertical {
    right: 0;
  }

  .arrowBack {
    left: var(--Carousel-arrow-offset);
  }

  .arrowBack.vertical {
    left: 0;
  }

  .root {
    overflow: hidden;
    flex-direction: row;
    flex-grow: 1;
    flex-shrink: 1;
  }

  .root.vertical {
    flex-direction: column;
  }

  .case {
    flex-direction: row;
  }

  .case.vertical {
    flex-direction: column;
  }

  .dots {
    align-self: center;
    margin-top: var(--Carousel-dots-margin-y);
    margin-bottom: var(--Carousel-dots-margin-y);
  }

  .dot {
    height: var(--Carousel-dot-size);
    width: var(--Carousel-dot-size);
    background-color: var(--Carousel-dot-bg);
    border-radius: var(--Carousel-dot-radius);
    margin-left: var(--Carousel-dot-gap);
    margin-right: var(--Carousel-dot-gap);
    cursor: pointer;
  }

  .dotActive {
    background-color: var(--Carousel-dot-active-bg);
  }
`
