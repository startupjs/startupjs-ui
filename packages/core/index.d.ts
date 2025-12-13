import type * as React from 'react'

export function u (value?: number): number

export function colorToRGBA (color: string, alpha?: number): string

export interface GetCssVariableOptions {
  convertToString?: boolean
}

export type CssVariableValue = string | undefined | Record<string, any>

export function getCssVariable (
  cssVarName: string,
  options?: GetCssVariableOptions
): CssVariableValue

export const Colors: Record<string, string>

export interface GetColorOptions {
  prefix?: string
  convertToString?: boolean
}

export type ColorValue = string | undefined

export type GetColor = (color?: string, options?: GetColorOptions) => ColorValue

export function useColors (): GetColor

export function useMedia (): any

export interface ThemedOptions {
  name?: string
}

export function themed<P> (name: string, component: React.ComponentType<P>): React.ComponentType<P>
export function themed<P> (component: React.ComponentType<P>): React.ComponentType<P>
