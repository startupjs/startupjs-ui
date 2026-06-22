import type * as React from 'react'
import type { ViewProps } from 'react-native'

export type UIRole = ViewProps['role'] | 'listbox' | 'gridcell'

export function u (value?: number): number

export function colorToRGBA (color: string, alpha?: number): string

export interface ColorVariableRequestOptions {
  prefix?: string
}

export interface ColorVariableRequest {
  name: string
  fallback?: string
}

export function colorVariableRequest (
  color?: string,
  options?: ColorVariableRequestOptions
): ColorVariableRequest

export function isColorToken (color?: string): boolean

export interface GetCssVariableOptions {
  convertToString?: boolean
}

export type CssVariableValue = string | undefined | Record<string, any>

export function getCssVariable (
  cssVarName: string,
  options?: GetCssVariableOptions
): CssVariableValue

export const ThemeProvider: React.Provider<any>

export const ThemeContext: React.Context<any>

export function useMedia (): any

export interface ThemedOptions {
  name?: string
}

export function themed<P> (name: string, component: React.ComponentType<P>): React.ComponentType<P>
export function themed<P> (component: React.ComponentType<P>): React.ComponentType<P>
