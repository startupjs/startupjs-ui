export interface RadioOptionObject {
  /** Stored value (used for equality / onChange) */
  value?: any
  /** Visible label */
  label?: string
  /** Optional description under the label */
  description?: string
}

export type RadioOption = string | number | RadioOptionObject
export type RadioValue = string | number | RadioOptionObject | null | undefined

export function getOptionLabel (option: RadioOption): any {
  return (option as any)?.label ?? option
}

export function getOptionDescription (option: RadioOption): any {
  return (option as any)?.description
}

export function stringifyValue (option: any): string {
  return JSON.stringify(option?.value ?? option)
}

export function parseValue (value: any): any {
  return JSON.parse(value)
}

export function getLabelFromValue (value: RadioValue, options: RadioOption[]): any {
  for (const option of options) {
    if (stringifyValue(value) === stringifyValue(option)) {
      return getOptionLabel(option)
    }
  }
}
