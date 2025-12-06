declare module 'randomcolor' {
  interface RandomColorOptions {
    luminosity?: string
    hue?: string | number
    seed?: string | number
    count?: number
    format?: 'rgb' | 'rgba' | 'hex' | 'hsl' | 'hsla'
  }

  function randomcolor (options?: RandomColorOptions): string | string[]
  export default randomcolor
}
