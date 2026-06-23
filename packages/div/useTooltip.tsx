import React, { useState, useEffect, useMemo, useCallback, type ReactNode, type RefObject } from 'react'
import { Platform, View } from 'react-native'
import { css, pug } from 'startupjs'
import Span from '@startupjs-ui/span'
import AbstractPopover from '@startupjs-ui/abstract-popover'

const isWeb = Platform.OS === 'web'

const DEFAULT_TOOLTIP_PROPS = {
  position: 'top',
  attachment: 'center',
  arrow: true
}

export interface UseTooltipProps {
  style?: any
  anchorRef: RefObject<any>
  tooltip?: ReactNode | (() => ReactNode)
}

export type TooltipEventHandler = 'onMouseEnter' | 'onMouseLeave' | 'onLongPress' | 'onPressOut'
export type TooltipEventHandlers = Partial<Record<TooltipEventHandler, any>>
export const tooltipEventHandlersList: TooltipEventHandler[] = [
  'onMouseEnter',
  'onMouseLeave',
  'onLongPress',
  'onPressOut'
]

interface TooltipResult {
  tooltipElement?: ReactNode
  tooltipEventHandlers: TooltipEventHandlers
}

export default function useTooltip ({ style, anchorRef, tooltip }: UseTooltipProps) {
  const result: TooltipResult = { tooltipEventHandlers: {} }
  const [visible, setVisible] = useState(false)

  const cbSetVisibleTrue = useCallback(() => { setVisible(true) }, [])
  const cbSetVisibleFalse = useCallback(() => { setVisible(false) }, [])

  useEffect(() => {
    if (!isWeb) return
    if (!tooltip) return

    window.addEventListener('wheel', cbSetVisibleFalse, true)
    return () => {
      window.removeEventListener('wheel', cbSetVisibleFalse, true)
    }
  }, [cbSetVisibleFalse, cbSetVisibleTrue, tooltip])

  const tooltipEventHandlers = useMemo(() => {
    const handlers: TooltipEventHandlers = {}
    if (!tooltip) return handlers

    if (isWeb) {
      handlers.onMouseEnter = cbSetVisibleTrue
      handlers.onMouseLeave = cbSetVisibleFalse
    } else {
      handlers.onLongPress = cbSetVisibleTrue
      handlers.onPressOut = cbSetVisibleFalse
    }

    return handlers
  }, [cbSetVisibleFalse, cbSetVisibleTrue, tooltip])

  result.tooltipEventHandlers = tooltipEventHandlers

  css`
    .tooltip {
      background-color: var(--Div-tooltip-bg);
      max-width: 260px;
      border-radius: var(--Div-tooltip-radius);
      box-shadow: var(--Div-tooltip-shadow);
      padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);
    }

    @media (--breakpoint-tablet) {
      .tooltip {
        max-width: 320px;
      }
    }

    .tooltip-text {
      color: var(--Div-tooltip-foreground);
    }
  `

  if (tooltip) {
    result.tooltipElement = pug`
      AbstractPopover.tooltip(
        style=style
        anchorRef=anchorRef
        visible=visible
        ...DEFAULT_TOOLTIP_PROPS
      )
        //- case for DEPRECATED renderTooltip property
        if typeof tooltip === 'function'
          = tooltip()
        else
          //- HACK
          //- Wrap to row, because for small texts it does not correctly hyphenate in the text
          //- For example $500,000, Copy, etc...
          View(style={ flexDirection: 'row' })
            Span.tooltip-text= tooltip
    `
  }

  return result
}

export interface UseDecorateTooltipProps {
  props: Record<string, any>
  style?: any
  anchorRef: RefObject<any>
  tooltip?: ReactNode | (() => ReactNode)
}

interface DecorateTooltipResult {
  props: Record<string, any>
  tooltipElement?: ReactNode
}

export function useDecorateTooltipProps ({
  props,
  style,
  anchorRef,
  tooltip
}: UseDecorateTooltipProps): DecorateTooltipResult {
  const { tooltipElement, tooltipEventHandlers } = useTooltip({ style, anchorRef, tooltip })
  const {
    onMouseEnter,
    onMouseLeave,
    onLongPress,
    onPressOut
  } = props as TooltipEventHandlers

  const extraEventHandlerProps: TooltipEventHandlers = useMemo(() => {
    const res: TooltipEventHandlers = {}
    const divHandlers: TooltipEventHandlers = {
      onMouseEnter,
      onMouseLeave,
      onLongPress,
      onPressOut
    }

    for (const handlerName of tooltipEventHandlersList) {
      const tooltipHandler = tooltipEventHandlers[handlerName]
      if (!tooltipHandler) continue
      const divHandler = divHandlers[handlerName]

      res[handlerName] = divHandler
        ? (...args: any[]) => {
            tooltipHandler(...args)
            divHandler(...args)
          }
        : tooltipHandler
    }
    return res
  }, [
    tooltipEventHandlers,
    onMouseEnter,
    onMouseLeave,
    onLongPress,
    onPressOut
  ])

  Object.assign(props, extraEventHandlerProps)

  return { props, tooltipElement }
}
