'use client'

import { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'

interface QRCodeOptions {
  data?: string
  image?: string
  width?: number
  height?: number
  type?: 'svg' | 'canvas'
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

interface StyledQRCodeProps extends QRCodeOptions {
  width?: number
  height?: number
}

export default function StyledQRCode({
  data,
  width = 200,
  height = 200,
  type = 'svg',
  image,
  margin = 0,
  dotsOptions = { color: 'black', type: 'rounded' },
  backgroundOptions = { color: 'transparent' },
  imageOptions = { margin: 0, crossOrigin: 'anonymous' },
  cornersSquareOptions = { color: 'black', type: 'extra-rounded' },
  cornersDotOptions = { color: 'black', type: 'dot' },
  qrOptions = { errorCorrectionLevel: 'Q' }
}: StyledQRCodeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStyling | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    qrCodeRef.current = new QRCodeStyling({
      data,
      width,
      height,
      type,
      image: image === null ? undefined : image,
      margin,
      dotsOptions,
      backgroundOptions,
      imageOptions,
      cornersSquareOptions,
      cornersDotOptions,
      qrOptions
    } as any)

    qrCodeRef.current.append(containerRef.current)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  useEffect(() => {
    if (qrCodeRef.current) {
      qrCodeRef.current.update({
        data,
        width,
        height,
        type,
        image: image === null ? undefined : image,
        margin,
        dotsOptions,
        backgroundOptions,
        imageOptions,
        cornersSquareOptions,
        cornersDotOptions,
        qrOptions
      } as any)
    }
  }, [
    data,
    width,
    height,
    type,
    image,
    margin,
    dotsOptions,
    backgroundOptions,
    imageOptions,
    cornersSquareOptions,
    cornersDotOptions,
    qrOptions
  ])

  return (
    <div
      className="inline-flex items-center justify-center"
      style={{ width, height }}
    >
      <div
        ref={containerRef}
        className="flex items-center justify-center"
        style={{ width, height }}
      />
    </div>
  )
}
