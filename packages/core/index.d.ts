import type * as React from 'react'
import type { ViewProps } from 'react-native'

export type UIRole = ViewProps['role'] | 'listbox' | 'gridcell'

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

export interface CssVariablesMeta {
  palette?: Record<string, any>
  colors?: Record<string, any>
  componentColors?: Record<string, any>
}

export interface CssVariablesProps {
  meta?: CssVariablesMeta
  clear?: boolean
  children?: React.ReactNode
}

export const CssVariables: React.ComponentType<CssVariablesProps>

export const palette: Record<string, any>

export function generateColors (
  palette: Record<string, any>,
  overrides?: Record<string, any>
): Record<string, any>

export function useCssVariablesMeta (options: {
  staticOverrides?: Record<string, any>
  palette?: Record<string, any>
  colors?: Record<string, any>
  componentColors?: Record<string, any>
}): CssVariablesMeta | undefined

export const StyleContext: React.Context<any>

export class Palette {
  constructor (palette?: Record<string, any>)
  colors: Record<string, any>
  generateColors (overrides?: Record<string, any>, componentOverrides?: Record<string, any>): Record<string, any>
  Color (name: string, level?: any, options?: { alpha?: number }): any
}

export const Colors: Record<string, string>

export const ThemeProvider: React.Provider<any>

export const ThemeContext: React.Context<any>

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
