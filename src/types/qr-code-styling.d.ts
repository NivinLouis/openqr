declare module 'qr-code-styling' {
  export type CornerDotType = 'dot' | 'square'
  export type CornerSquareType = 'dot' | 'square' | 'extra-rounded'
  export type DotType = 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded'
  export type DrawType = 'svg' | 'canvas'
  export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

  export interface Options {
    data?: string
    image?: string
    width?: number
    height?: number
    type?: DrawType
    margin?: number
    dotsOptions?: {
      color?: string
      type?: string
    }
    backgroundOptions?: {
      color?: string
    }
    imageOptions?: {
      image?: string
      margin?: number
      crossOrigin?: string
    }
    cornersSquareOptions?: {
      color?: string
      type?: string
    }
    cornersDotOptions?: {
      color?: string
      type?: string
    }
    qrOptions?: {
      errorCorrectionLevel?: string
      mode?: string
      type?: number
    }
  }

  export default class QRCodeStyling {
    constructor(options: Options)
    append(element: Element | string): void
    update(options: Options): void
    getRawData(extension?: string): Blob | null
    toCanvas(options?: { width?: number; height?: number }): Promise<void>
    toDataURL(extension?: string): Promise<string>
  }
}