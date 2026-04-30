export type SelectOption =
  | string
  | number
  | { value?: any, label?: string | number }

// Force undefined to be a special value to
// workaround the undefined value bug in Picker
export const PICKER_NULL = 'empty'
export const NULL_OPTION: undefined = undefined

export interface SelectOptionEntry {
  key: string
  value: any
  label: string
}

function getOptionValue (option: any): any {
  return option?.value ?? option
}

function stringifyComparableValue (option: any): string | undefined {
  try {
    const value = getOptionValue(option)
    if (value == null) return PICKER_NULL
    return JSON.stringify(value)
  } catch (error) {
    console.warn('[@startupjs/ui] Select: ' + String(error))
  }
}

export function areValuesEqual (a: any, b: any): boolean {
  return stringifyComparableValue(a) === stringifyComparableValue(b)
}

function getOptionKey (index: number): string {
  return `opt:${index}`
}

export function getOptionEntries (
  options: SelectOption[],
  showEmptyValue?: boolean,
  emptyValueLabel?: string | number
): SelectOptionEntry[] {
  const entries: SelectOptionEntry[] = []

  if (showEmptyValue) {
    entries.push({
      key: PICKER_NULL,
      value: undefined,
      label: getLabel(emptyValueLabel ?? NULL_OPTION)
    })
  }

  options.forEach((option, index) => {
    entries.push({
      key: getOptionKey(index),
      value: getOptionValue(option),
      label: getLabel(option)
    })
  })

  return entries
}

export function getOptionKeyFromValue (
  value: any,
  options: SelectOption[],
  showEmptyValue?: boolean,
  emptyValueLabel?: string | number
): string | undefined {
  const entries = getOptionEntries(options, showEmptyValue, emptyValueLabel)
  return entries.find(entry => areValuesEqual(entry.value, value))?.key
}

export function getValueFromKey (
  key: string,
  options: SelectOption[],
  showEmptyValue?: boolean,
  emptyValueLabel?: string | number
): any {
  const entries = getOptionEntries(options, showEmptyValue, emptyValueLabel)
  return entries.find(entry => entry.key === key)?.value
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
    if (areValuesEqual(value, option)) {
      return getLabel(option)
    }
  }
  return getLabel(emptyValueLabel)
}
