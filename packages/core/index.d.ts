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

export function useMedia (): any
