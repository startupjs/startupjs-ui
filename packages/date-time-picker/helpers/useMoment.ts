import { use } from 'react'

let momentPromise: any

const loadMoment = (): Promise<any> => {
  if (!momentPromise) momentPromise = import('moment-timezone').then(m => m.default)
  return momentPromise
}

export default function useMoment () {
  return use(loadMoment())
}
