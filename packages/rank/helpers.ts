export function stringifyValue (option: any): string {
  try {
    const value = getOptionValue(option)
    return JSON.stringify(value)
  } catch (err) {
    console.error(err)
    return ''
  }
}

export function getOptionValue (option: any): any {
  return option?.value ?? option
}

export function getOptionLabel (option: any): any {
  return option?.label ?? option
}

export function move<T> (arr: T[], oldIndex: number, newIndex: number): T[] {
  const arrCopy = arr.slice()
  const element = arrCopy[oldIndex]
  arrCopy.splice(oldIndex, 1)
  arrCopy.splice(newIndex, 0, element)
  return arrCopy
}
