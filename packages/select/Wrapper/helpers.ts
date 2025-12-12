export type SelectOption =
  | string
  | number
  | { value?: any, label?: string | number }

// TODO: create logic for objects with circular structure like jsx components

// Stringify values to omit bugs in Android/iOS Picker implementation

// Force undefined to be a special value to
// workaround the undefined value bug in Picker
export const PICKER_NULL = '-\u00A0\u00A0\u00A0\u00A0\u00A0'
export const NULL_OPTION: undefined = undefined

export function stringifyValue (option: any): string | undefined {
  try {
    let value: any
    if (option?.value != null) {
      value = option.value
    } else {
      value = option
    }
    if (value == null) return PICKER_NULL
    return JSON.stringify(value)
  } catch (error) {
    console.warn('[@startupjs/ui] Select: ' + String(error))
  }
}

export function parseValue (value: any): any {
  try {
    if (value === PICKER_NULL || value == null) {
      return undefined
    } else {
      return JSON.parse(value)
    }
  } catch (error) {
    console.warn('[@startupjs/ui] Select: ' + String(error))
  }
}

export function getLabel (option: any): string {
  let label: any
  if (option?.label != null) {
    label = option.label
  } else {
    label = option
  }
  if (label == null) return PICKER_NULL
  return '' + label
}

export function getLabelFromValue (
  value: any,
  options: SelectOption[],
  emptyValueLabel: any = NULL_OPTION
): string {
  for (const option of options) {
    if (stringifyValue(value) === stringifyValue(option)) {
      return getLabel(option)
    }
  }
  return getLabel(emptyValueLabel)
}
