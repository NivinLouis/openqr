'use client'

import { useEffect, useId, useRef, useState } from 'react'
import clsx from 'clsx'
import QRCodeStyling from 'qr-code-styling'
import StyledQRCode from '@/components/StyledQRCode'
import {
  BadgeInfo,
  Camera,
  Check,
  Copy,
  Download,
  FileCode2,
  FileImage,
  FileJson,
  Globe,
  Github,
  ImagePlus,
  Link2,
  Mail,
  MoonStar,
  Palette,
  Phone,
  QrCode,
  RefreshCw,
  ScanLine,
  SunMedium,
  Type,
  Upload,
  WandSparkles,
  Wifi,
  X
} from 'lucide-react'

type DotType = 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded'
type CornerType = 'dot' | 'square' | 'extra-rounded'
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'
type FramePosition = 'top' | 'bottom' | 'left' | 'right'
type DataType = 'text' | 'url' | 'email' | 'phone' | 'wifi'
type ThemeMode = 'light' | 'dark'
type ControlSection = 'content' | 'style' | 'frame'

interface FrameStyle {
  textColor: string
  backgroundColor: string
  borderColor: string
  borderWidth: string
  borderRadius: string
  padding: string
}

interface TemplateState {
  text: string
  url: string
  email: string
  subject: string
  message: string
  phone: string
  ssid: string
  password: string
  encryption: 'WPA' | 'WEP' | 'nopass'
  hidden: boolean
}

interface ThemePreset {
  name: string
  label: string
  dotsColor: string
  cornersSquareColor: string
  cornersDotColor: string
  backgroundColor: string
  dotsType: DotType
  cornersSquareType: CornerType
  cornersDotType: CornerType
  borderRadius: string
}

declare global {
  interface Window {
    ClipboardItem?: typeof ClipboardItem
  }
}

const DOT_TYPES: DotType[] = ['dots', 'rounded', 'classy', 'classy-rounded', 'square', 'extra-rounded']
const CORNER_TYPES: CornerType[] = ['dot', 'square', 'extra-rounded']
const ERROR_CORRECTION_LEVELS: ErrorCorrectionLevel[] = ['L', 'M', 'Q', 'H']

const DEFAULT_FRAME_STYLE: FrameStyle = {
  textColor: '#102033',
  backgroundColor: 'rgba(255, 255, 255, 0.84)',
  borderColor: 'rgba(255, 255, 255, 0.42)',
  borderWidth: '1px',
  borderRadius: '28px',
  padding: '18px'
}

const DEFAULT_TEMPLATE_STATE: TemplateState = {
  text: 'https://openqr.vercel.app',
  url: 'https://openqr.vercel.app',
  email: 'hello@example.com',
  subject: 'Quick hello',
  message: 'Let us connect.',
  phone: '+1 555 010 9999',
  ssid: 'Studio WiFi',
  password: 'supersecret',
  encryption: 'WPA',
  hidden: false
}

const PRESET_STYLES: ThemePreset[] = [
  {
    name: 'sea-glass',
    label: 'Ocean Breeze',
    dotsColor: '#0c6f82',
    cornersSquareColor: '#083d77',
    cornersDotColor: '#1b998b',
    backgroundColor: '#f2fbff',
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
    borderRadius: '28px'
  },
  {
    name: 'sunset-film',
    label: 'Golden Hour',
    dotsColor: '#7b2d26',
    cornersSquareColor: '#b1740f',
    cornersDotColor: '#df8e1d',
    backgroundColor: '#fff5eb',
    dotsType: 'classy-rounded',
    cornersSquareType: 'square',
    cornersDotType: 'square',
    borderRadius: '18px'
  },
  {
    name: 'midnight-tint',
    label: 'Deep Night',
    dotsColor: '#ecfeff',
    cornersSquareColor: '#74d3ae',
    cornersDotColor: '#9fd356',
    backgroundColor: '#102033',
    dotsType: 'rounded',
    cornersSquareType: 'extra-rounded',
    cornersDotType: 'dot',
    borderRadius: '32px'
  }
]

function buildDataString(type: DataType, fields: TemplateState, fallback: string): string {
  switch (type) {
    case 'url':
      return fields.url.trim() || fallback
    case 'email':
      return `MATMSG:TO:${fields.email.trim()};SUB:${fields.subject.trim()};BODY:${fields.message.trim()};;`
    case 'phone':
      return `TEL:${fields.phone.trim()}`
    case 'wifi':
      return `WIFI:T:${fields.encryption};S:${fields.ssid.trim()};P:${fields.password.trim()};H:${fields.hidden ? 'true' : 'false'};;`
    case 'text':
    default:
      return fields.text.trim() || fallback
  }
}

function getFrameDirection(position: FramePosition) {
  if (position === 'left') return 'row-reverse'
  if (position === 'right') return 'row'
  if (position === 'top') return 'column-reverse'
  return 'column'
}

function makeRandomHex() {
  const value = Math.floor(Math.random() * 0xffffff)
  return `#${value.toString(16).padStart(6, '0')}`
}

export default function Home() {
  const qrRef = useRef<HTMLDivElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const configInputRef = useRef<HTMLInputElement>(null)
  const scanInputRef = useRef<HTMLInputElement>(null)
  const scannerRef = useRef<any>(null)
  const scanRegionId = useId().replace(/:/g, '-')

  const [mode, setMode] = useState<'create' | 'scan'>('create')
  const [themeMode, setThemeMode] = useState<ThemeMode>('light')
  const [activePreset, setActivePreset] = useState('custom')
  const [activeSection, setActiveSection] = useState<ControlSection>('content')

  const [data, setData] = useState('https://openqr.vercel.app')
  const [showFrame, setShowFrame] = useState(false)
  const [frameText, setFrameText] = useState('')
  const [frameTextPosition, setFrameTextPosition] = useState<FramePosition>('bottom')
  const [frameStyle, setFrameStyle] = useState<FrameStyle>(DEFAULT_FRAME_STYLE)

  const [dotsColor, setDotsColor] = useState('#000000')
  const [dotsType, setDotsType] = useState<DotType>('rounded')
  const [cornersSquareColor, setCornersSquareColor] = useState('#000000')
  const [cornersSquareType, setCornersSquareType] = useState<CornerType>('extra-rounded')
  const [cornersDotColor, setCornersDotColor] = useState('#000000')
  const [cornersDotType, setCornersDotType] = useState<CornerType>('dot')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [includeBackground, setIncludeBackground] = useState(true)
  const [borderRadius, setBorderRadius] = useState(PRESET_STYLES[0].borderRadius)
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<ErrorCorrectionLevel>('Q')

  const [width, setWidth] = useState(320)
  const [height, setHeight] = useState(320)
  const [margin, setMargin] = useState(8)
  const [imageMargin, setImageMargin] = useState(6)
  const [logoImage, setLogoImage] = useState('')

  const [exportFilename, setExportFilename] = useState('openqr-glass')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [dataType, setDataType] = useState<DataType>('url')
  const [templateState, setTemplateState] = useState<TemplateState>(DEFAULT_TEMPLATE_STATE)
  const [statusMessage, setStatusMessage] = useState('')

  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState('')
  const [scannedData, setScannedData] = useState('')
  const [cameraActive, setCameraActive] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setStatusMessage(''), 2400)
    return () => window.clearTimeout(timer)
  }, [statusMessage])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    void (async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations()
        await Promise.all(registrations.map((registration) => registration.unregister()))

        if ('caches' in window) {
          const cacheKeys = await caches.keys()
          await Promise.all(cacheKeys.map((cacheKey) => caches.delete(cacheKey)))
        }
      } catch (error) {
        console.error('Development service worker cleanup failed', error)
      }
    })()
  }, [])

  useEffect(() => {
    return () => {
      void stopCameraScan()
    }
  }, [])

  const qrProps = {
    data,
    width: Math.min(width, 360),
    height: Math.min(height, 360),
    margin,
    dotsOptions: { color: dotsColor, type: dotsType },
    cornersSquareOptions: { color: cornersSquareColor, type: cornersSquareType },
    cornersDotOptions: { color: cornersDotColor, type: cornersDotType },
    backgroundOptions: { color: includeBackground ? backgroundColor : 'transparent' },
    imageOptions: { margin: imageMargin, image: logoImage || undefined, crossOrigin: 'anonymous' },
    qrOptions: { errorCorrectionLevel }
  }

  const previewCardStyle = {
    borderRadius,
    background: includeBackground ? backgroundColor : 'transparent',
    overflow: 'hidden'
  }

  async function copyEncodedData(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setStatusMessage('Copied to clipboard')
    } catch (error) {
      console.error('Clipboard copy failed', error)
      setStatusMessage('Copy failed')
    }
  }

  function buildQrInstance(format: 'png' | 'jpg' | 'svg') {
    return new QRCodeStyling({
      data,
      width,
      height,
      margin,
      dotsOptions: { color: dotsColor, type: dotsType },
      cornersSquareOptions: { color: cornersSquareColor, type: cornersSquareType },
      cornersDotOptions: { color: cornersDotColor, type: cornersDotType },
      backgroundOptions: { color: includeBackground ? backgroundColor : 'transparent' },
      imageOptions: { margin: imageMargin, image: logoImage || undefined, crossOrigin: 'anonymous' },
      qrOptions: { errorCorrectionLevel },
      type: format === 'svg' ? 'svg' : 'canvas'
    })
  }

  async function copyQrImage() {
    try {
      const qr = buildQrInstance('png')
      const blob = await qr.getRawData('png')

      if (!blob || !navigator.clipboard || !window.ClipboardItem) {
        await copyEncodedData(data)
        return
      }

      await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })])
      setStatusMessage('QR image copied')
    } catch (error) {
      console.error('QR image copy failed', error)
      await copyEncodedData(data)
    }
  }

  async function downloadQR(format: 'png' | 'jpg' | 'svg') {
    const qr = buildQrInstance(format)

    try {
      let url: string

      if (format === 'svg') {
        const blob = await qr.getRawData('svg')
        url = blob ? URL.createObjectURL(blob) : await qr.toDataURL('svg')
      } else {
        url = await qr.toDataURL(format)
      }

      const link = document.createElement('a')
      link.href = url
      link.download = `${exportFilename}.${format}`
      link.click()
      setStatusMessage(`Downloaded ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Download failed', error)
      setStatusMessage('Download failed')
    }
  }

  function saveConfig() {
    const payload = {
      data,
      frame: showFrame ? { text: frameText, position: frameTextPosition, style: frameStyle } : null,
      visual: {
        dotsColor,
        dotsType,
        cornersSquareColor,
        cornersSquareType,
        cornersDotColor,
        cornersDotType,
        backgroundColor,
        includeBackground,
        borderRadius,
        errorCorrectionLevel,
        width,
        height,
        margin,
        imageMargin,
        logoImage
      }
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${exportFilename || 'openqr'}.json`
    link.click()
    URL.revokeObjectURL(url)
    setStatusMessage('Configuration saved')
  }

  function loadConfig(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    void file.text().then((text) => {
      try {
        const config = JSON.parse(text)
        setData(config.data || '')
        setShowFrame(Boolean(config.frame))
        if (config.frame) {
          setFrameText(config.frame.text || '')
          setFrameTextPosition(config.frame.position || 'bottom')
          setFrameStyle(config.frame.style || DEFAULT_FRAME_STYLE)
        }

        if (config.visual) {
          setDotsColor(config.visual.dotsColor || '#000000')
          setDotsType(config.visual.dotsType || 'rounded')
          setCornersSquareColor(config.visual.cornersSquareColor || '#000000')
          setCornersSquareType(config.visual.cornersSquareType || 'extra-rounded')
          setCornersDotColor(config.visual.cornersDotColor || '#000000')
          setCornersDotType(config.visual.cornersDotType || 'dot')
          setBackgroundColor(config.visual.backgroundColor || '#ffffff')
          setIncludeBackground(config.visual.includeBackground ?? true)
          setBorderRadius(config.visual.borderRadius || '28px')
          setErrorCorrectionLevel(config.visual.errorCorrectionLevel || 'Q')
          setWidth(config.visual.width || 320)
          setHeight(config.visual.height || 320)
          setMargin(config.visual.margin || 8)
          setImageMargin(config.visual.imageMargin || 6)
          setLogoImage(config.visual.logoImage || '')
        }

        setStatusMessage('Configuration loaded')
      } catch (error) {
        console.error('Config load failed', error)
        setStatusMessage('Invalid configuration file')
      } finally {
        event.target.value = ''
      }
    })
  }

  function applyPreset(preset: ThemePreset) {
    setActivePreset(preset.name)
    setDotsColor(preset.dotsColor)
    setDotsType(preset.dotsType)
    setCornersSquareColor(preset.cornersSquareColor)
    setCornersSquareType(preset.cornersSquareType)
    setCornersDotColor(preset.cornersDotColor)
    setCornersDotType(preset.cornersDotType)
    setBackgroundColor(preset.backgroundColor)
    setBorderRadius(preset.borderRadius)
    setStatusMessage(`Using the ${preset.label} look`)
  }

  function randomizeStyle() {
    setActivePreset('custom')
    setDotsColor(makeRandomHex())
    setCornersSquareColor(makeRandomHex())
    setCornersDotColor(makeRandomHex())
    setBackgroundColor(makeRandomHex())
    setDotsType(DOT_TYPES[Math.floor(Math.random() * DOT_TYPES.length)])
    setCornersSquareType(CORNER_TYPES[Math.floor(Math.random() * CORNER_TYPES.length)])
    setCornersDotType(CORNER_TYPES[Math.floor(Math.random() * CORNER_TYPES.length)])
    setBorderRadius(`${12 + Math.floor(Math.random() * 28)}px`)
    setStatusMessage('Mixed it up for you')
  }

  function resetDesign() {
    setActivePreset('custom')
    setDotsColor('#000000')
    setDotsType('rounded')
    setCornersSquareColor('#000000')
    setCornersSquareType('extra-rounded')
    setCornersDotColor('#000000')
    setCornersDotType('dot')
    setBackgroundColor('#ffffff')
    setBorderRadius('28px')
    setData('https://openqr.vercel.app')
    setShowFrame(false)
    setFrameText('')
    setFrameTextPosition('bottom')
    setFrameStyle(DEFAULT_FRAME_STYLE)
    setIncludeBackground(true)
    setErrorCorrectionLevel('Q')
    setWidth(320)
    setHeight(320)
    setMargin(8)
    setImageMargin(6)
    setLogoImage('')
    setExportFilename('openqr-glass')
    setStatusMessage('Everything’s fresh and ready')
  }

  function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoImage(reader.result)
        setStatusMessage('Logo loaded')
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  function applyTemplateData() {
    const nextData = buildDataString(dataType, templateState, data)
    setData(nextData)
    setShowTemplateModal(false)
    setStatusMessage('Template applied')
  }

  async function scanFile(file: File) {
    setIsScanning(true)
    setScanError('')

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const html5QrCode = new Html5Qrcode(scanRegionId)
      const result = await html5QrCode.scanFile(file, true)
      setScannedData(result)
      setStatusMessage('QR code detected')
    } catch (error) {
      console.error('Image scan failed', error)
      setScanError('No QR code was detected in that image.')
    } finally {
      setIsScanning(false)
    }
  }

  async function stopCameraScan() {
    if (!scannerRef.current) return

    try {
      await scannerRef.current.stop()
      await scannerRef.current.clear()
    } catch (error) {
      console.error('Stopping camera scan failed', error)
    } finally {
      scannerRef.current = null
      setCameraActive(false)
    }
  }

  async function startCameraScan() {
    setScanError('')
    setScannedData('')

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const cameras = await Html5Qrcode.getCameras()

      if (!cameras.length) {
        setScanError('No camera was found on this device.')
        return
      }

      const scanner = new Html5Qrcode(scanRegionId)
      scannerRef.current = scanner

      await scanner.start(
        { deviceId: { exact: cameras[0].id } },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText: string) => {
          setScannedData(decodedText)
          setStatusMessage('Camera scan complete')
          void stopCameraScan()
        },
        () => {}
      )

      setCameraActive(true)
    } catch (error) {
      console.error('Camera scan failed', error)
      setScanError('Camera access failed. Check permissions and try again.')
      await stopCameraScan()
    }
  }

  const framePreview = (
    <div
      style={{
        backgroundColor: frameStyle.backgroundColor,
        borderColor: frameStyle.borderColor,
        borderWidth: frameStyle.borderWidth,
        borderRadius: frameStyle.borderRadius,
        padding: frameStyle.padding,
        display: 'flex',
        flexDirection: getFrameDirection(frameTextPosition),
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        width: 'fit-content',
        margin: '0 auto'
      }}
    >
      {frameTextPosition === 'bottom' ? (
        <>
          <p
            aria-hidden="true"
            style={{
              color: 'transparent',
              margin: 0,
              maxWidth: '280px',
              textAlign: 'center',
              whiteSpace: 'pre-line',
              userSelect: 'none',
              visibility: 'hidden'
            }}
            className="font-medium tracking-[0.03em]"
          >
            {frameText}
          </p>
          <div style={previewCardStyle}>
            <StyledQRCode {...qrProps} />
          </div>
          <p
            style={{
              color: frameStyle.textColor,
              margin: 0,
              maxWidth: '280px',
              textAlign: 'center',
              whiteSpace: 'pre-line'
            }}
            className="font-medium tracking-[0.03em]"
          >
            {frameText}
          </p>
        </>
      ) : frameTextPosition === 'top' ? (
        <>
          <p
            style={{
              color: frameStyle.textColor,
              margin: 0,
              maxWidth: '280px',
              textAlign: 'center',
              whiteSpace: 'pre-line'
            }}
            className="font-medium tracking-[0.03em]"
          >
            {frameText}
          </p>
          <div style={previewCardStyle}>
            <StyledQRCode {...qrProps} />
          </div>
          <p
            aria-hidden="true"
            style={{
              color: 'transparent',
              margin: 0,
              maxWidth: '280px',
              textAlign: 'center',
              whiteSpace: 'pre-line',
              userSelect: 'none',
              visibility: 'hidden'
            }}
            className="font-medium tracking-[0.03em]"
          >
            {frameText}
          </p>
        </>
      ) : (
        <>
          <div style={previewCardStyle}>
            <StyledQRCode {...qrProps} />
          </div>
          <p
            style={{
              color: frameStyle.textColor,
              margin: 0,
              maxWidth: frameTextPosition === 'left' || frameTextPosition === 'right' ? '180px' : '280px',
              textAlign: 'center',
              whiteSpace: 'pre-line'
            }}
            className="font-medium tracking-[0.03em]"
          >
            {frameText}
          </p>
        </>
      )}
    </div>
  )

  return (
    <main className={clsx('min-h-screen transition-colors duration-500', themeMode === 'dark' ? 'theme-dark' : 'theme-light')}>
      <div className="page-shell">
        <div className="background-orb background-orb-a" />
        <div className="background-orb background-orb-b" />
        <div className="background-grid" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          <header className="glass-panel mb-5 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="brand-mark">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="sr-only">
                    Free QR Code Generator — No Redirects, No Tracking
                  </h1>
                  <div aria-hidden="true" className="font-display text-2xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-3xl">
                    OpenQR
                  </div>
                  <p className="mt-1 text-[15px] text-[var(--muted)] sm:text-base">
                    A simple place to create, save, and scan your QR codes.
                  </p>
                  <p className="sr-only">
                    Use our custom QR code generator to create direct links without routing through tracking intermediaries. Whether you need a free QR code without URL shortener for a personal event, or plan to use our bulk QR code generator free no watermark features for commercial use, everything exported here points directly to your destination. Best of all, it remains a free QR code no sign up solution forever.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="glass-pill p-1">
                  <button
                    className={clsx('mode-pill', mode === 'create' && 'mode-pill-active')}
                    onClick={() => setMode('create')}
                  >
                    <QrCode className="h-4 w-4" />
                    Create
                  </button>
                  <button
                    className={clsx('mode-pill', mode === 'scan' && 'mode-pill-active')}
                    onClick={() => setMode('scan')}
                  >
                    <ScanLine className="h-4 w-4" />
                    Scan
                  </button>
                </div>

                <a
                  className="glass-icon-button"
                  href="https://github.com/NivinLouis/openqr"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open GitHub repository"
                >
                  <Github className="h-4 w-4" />
                </a>

                <button className="glass-icon-button" onClick={() => setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'))}>
                  {themeMode === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </header>

          {mode === 'create' ? (
            <section className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
              <div className="space-y-6">
                <div ref={qrRef} className="glass-panel sticky top-4 overflow-hidden px-4 py-4 sm:px-5">
                  <div className="relative">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl font-semibold text-[var(--text-strong)]">Preview</h2>
                      </div>
                      <span className="status-chip">
                        <Check className="h-3.5 w-3.5" />
                        {width} x {height}
                      </span>
                    </div>

                    <div className="preview-stage">
                      {showFrame ? framePreview : <div style={previewCardStyle}><StyledQRCode {...qrProps} /></div>}
                    </div>

                    <div className="mt-4 grid gap-2">
                      <button className="primary-action" onClick={copyQrImage}>
                        <FileImage className="h-4 w-4" />
                        Copy to clipboard
                      </button>
                    </div>

                    <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
                      <button className="secondary-action" onClick={() => downloadQR('png')}>
                        <Download className="h-4 w-4" />
                        PNG
                      </button>
                      <button className="secondary-action" onClick={() => downloadQR('jpg')}>
                        <Download className="h-4 w-4" />
                        JPG
                      </button>
                      <button className="secondary-action" onClick={() => downloadQR('svg')}>
                        <Download className="h-4 w-4" />
                        SVG
                      </button>
                    </div>

                    <input ref={configInputRef} type="file" accept="application/json" className="hidden" onChange={loadConfig} />
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-panel px-4 py-4 sm:px-5">
                  <div className="compact-toolbar">
                    <button
                      className={clsx('toolbar-tab', activeSection === 'content' && 'toolbar-tab-active')}
                      onClick={() => setActiveSection('content')}
                    >
                      <FileCode2 className="h-4 w-4" />
                      Content
                    </button>
                    <button
                      className={clsx('toolbar-tab', activeSection === 'style' && 'toolbar-tab-active')}
                      onClick={() => setActiveSection('style')}
                    >
                      <Palette className="h-4 w-4" />
                      Style
                    </button>
                    <div className={clsx('toolbar-tab toolbar-tab-frame', activeSection === 'frame' && 'toolbar-tab-active')}>
                      <button className="toolbar-tab-trigger" onClick={() => setActiveSection('frame')}>
                        <Type className="h-4 w-4" />
                        Frame
                      </button>
                      <label className="toolbar-checkbox toolbar-checkbox-inline" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={showFrame}
                          onChange={(event) => setShowFrame(event.target.checked)}
                          aria-label="Enable frame"
                        />
                        <span className="toolbar-check">
                          {showFrame && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span className="toolbar-checkbox-label">Enable</span>
                      </label>
                    </div>
                  </div>

                  {activeSection === 'content' && (
                    <div className="section-fade mt-4 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="eyebrow">Content</p>
                          <h2 className="mt-1 font-display text-2xl font-semibold text-[var(--text-strong)]">
                            {dataType === 'url' ? 'URL' : dataType === 'wifi' ? 'WiFi' : dataType.charAt(0).toUpperCase() + dataType.slice(1)}
                          </h2>
                        </div>
                        <button className="ghost-action !min-h-0 !px-3 !py-2" onClick={() => setShowTemplateModal(true)}>
                          <RefreshCw className="h-4 w-4" />
                          Switch content type
                        </button>
                      </div>

                      <label className="field-label" htmlFor="qr-data">Data</label>
                      <textarea
                        id="qr-data"
                        className="glass-input min-h-28"
                        value={data}
                        onChange={(event) => setData(event.target.value)}
                        placeholder="Paste a URL, text, phone number, email details, or WiFi details."
                      />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="field-label" htmlFor="file-name">File name</label>
                          <input
                            id="file-name"
                            className="glass-input"
                            value={exportFilename}
                            onChange={(event) => setExportFilename(event.target.value)}
                            placeholder="openqr-glass"
                          />
                        </div>
                        <div>
                          <label className="field-label" htmlFor="logo-image">Logo</label>
                          <input
                            id="logo-image"
                            className="glass-input"
                            value={logoImage}
                            onChange={(event) => setLogoImage(event.target.value)}
                            placeholder="Image URL or file path"
                          />
                        </div>
                      </div>

                      <label className="toggle-row">
                        <input type="checkbox" checked={includeBackground} onChange={(event) => setIncludeBackground(event.target.checked)} />
                        <span>Include background fill</span>
                      </label>

                      <div className="grid gap-2 sm:grid-cols-3">
                        <button className="secondary-action" onClick={() => logoInputRef.current?.click()}>
                          <ImagePlus className="h-4 w-4" />
                          Upload logo
                        </button>
                        <button className="secondary-action" onClick={randomizeStyle}>
                          <RefreshCw className="h-4 w-4" />
                          Randomize style
                        </button>
                        <button className="secondary-action" onClick={resetDesign}>
                          <X className="h-4 w-4" />
                          Reset
                        </button>
                      </div>
                    </div>
                  )}

                  {activeSection === 'style' && (
                    <div className="section-fade mt-4 space-y-4">
                      <div>
                        <p className="eyebrow">Style</p>
                        <h2 className="mt-1 font-display text-2xl font-semibold text-[var(--text-strong)]">Style presets</h2>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        {PRESET_STYLES.map((preset) => (
                          <button
                            key={preset.name}
                            className={clsx('preset-card', activePreset === preset.name && 'preset-card-active')}
                            onClick={() => applyPreset(preset)}
                          >
                            <span className="preset-swatch" style={{ background: `linear-gradient(135deg, ${preset.backgroundColor}, ${preset.cornersSquareColor})` }} />
                            <span className="font-semibold text-[var(--text-strong)]">{preset.label}</span>
                            <span className="text-xs text-[var(--muted)]">{preset.dotsType}</span>
                          </button>
                        ))}
                      </div>

                      <div className="grid gap-4 xl:grid-cols-2">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <ColorField label="Dots" value={dotsColor} onChange={setDotsColor} />
                          <ColorField label="Background" value={backgroundColor} onChange={setBackgroundColor} disabled={!includeBackground} />
                          <ColorField label="Corner square" value={cornersSquareColor} onChange={setCornersSquareColor} />
                          <ColorField label="Corner dot" value={cornersDotColor} onChange={setCornersDotColor} />
                          <SelectField label="Dots type" value={dotsType} onChange={(value) => setDotsType(value as DotType)} options={DOT_TYPES} />
                          <SelectField label="Corner square type" value={cornersSquareType} onChange={(value) => setCornersSquareType(value as CornerType)} options={CORNER_TYPES} />
                          <SelectField label="Corner dot type" value={cornersDotType} onChange={(value) => setCornersDotType(value as CornerType)} options={CORNER_TYPES} />
                          <SelectField label="Error correction" value={errorCorrectionLevel} onChange={(value) => setErrorCorrectionLevel(value as ErrorCorrectionLevel)} options={ERROR_CORRECTION_LEVELS} />
                        </div>

                        <div className="grid gap-4">
                          <RangeField label="Width" min={200} max={600} step={10} value={width} onChange={setWidth} />
                          <RangeField label="Height" min={200} max={600} step={10} value={height} onChange={setHeight} />
                          <RangeField label="Outer margin" min={0} max={32} step={1} value={margin} onChange={setMargin} />
                          <RangeField label="Logo margin" min={0} max={24} step={1} value={imageMargin} onChange={setImageMargin} />
                          <RangeField label="Corner radius" min={0} max={40} step={1} value={parseInt(borderRadius, 10)} onChange={(value) => setBorderRadius(`${value}px`)} />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'frame' && (
                    <div className="section-fade mt-4 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h2 className="font-display text-2xl font-semibold text-[var(--text-strong)]">Frame settings</h2>
                        </div>
                        <span className="status-chip">{showFrame ? 'Enabled' : 'Disabled'}</span>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-2">
                        <div className="space-y-4">
                          <label className="field-label" htmlFor="frame-copy">Caption</label>
                          <textarea
                            id="frame-copy"
                            className="glass-input min-h-24"
                            value={frameText}
                            onChange={(event) => setFrameText(event.target.value)}
                            placeholder="Enter caption text"
                          />

                          <SelectField
                            label="Position"
                            value={frameTextPosition}
                            onChange={(value) => setFrameTextPosition(value as FramePosition)}
                            options={['top', 'bottom', 'left', 'right']}
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <ColorField label="Caption color" value={frameStyle.textColor} onChange={(value) => setFrameStyle({ ...frameStyle, textColor: value })} />
                          <ColorField label="Frame fill" value={frameStyle.backgroundColor} onChange={(value) => setFrameStyle({ ...frameStyle, backgroundColor: value })} />
                          <ColorField label="Frame border" value={frameStyle.borderColor} onChange={(value) => setFrameStyle({ ...frameStyle, borderColor: value })} />
                          <TextField label="Border width" value={frameStyle.borderWidth} onChange={(value) => setFrameStyle({ ...frameStyle, borderWidth: value })} />
                          <TextField label="Frame radius" value={frameStyle.borderRadius} onChange={(value) => setFrameStyle({ ...frameStyle, borderRadius: value })} />
                          <TextField label="Frame padding" value={frameStyle.padding} onChange={(value) => setFrameStyle({ ...frameStyle, padding: value })} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="glass-panel px-4 py-4 sm:px-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">Configurations</p>
                      <h2 className="mt-1 font-display text-2xl font-semibold text-[var(--text-strong)]">Save and load configurations</h2>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button className="ghost-action" onClick={saveConfig}>
                      <FileJson className="h-4 w-4" />
                      Save configuration
                    </button>
                    <button className="ghost-action" onClick={() => configInputRef.current?.click()}>
                      <Upload className="h-4 w-4" />
                      Load configuration
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="glass-panel px-4 py-4 sm:px-5">
                <div className="mb-3">
                  <p className="eyebrow">Scanner</p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-[var(--text-strong)]">Read from image or camera</h2>
                </div>

                <div className="scan-stage" id={scanRegionId} />

                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="primary-action" onClick={() => scanInputRef.current?.click()} disabled={isScanning}>
                    <FileImage className="h-4 w-4" />
                    {isScanning ? 'Processing image...' : 'Upload image'}
                  </button>
                  <button className="secondary-action" onClick={() => void (cameraActive ? stopCameraScan() : startCameraScan())}>
                    <Camera className="h-4 w-4" />
                    {cameraActive ? 'Stop camera' : 'Start camera'}
                  </button>
                </div>

                <input
                  ref={scanInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) void scanFile(file)
                    event.target.value = ''
                  }}
                />

                <p className="mt-4 text-sm text-[var(--muted)]">
                  Keep the QR centered and well lit. For printed codes, avoid glare and motion blur.
                </p>

                {scanError && (
                  <div className="mt-4 rounded-2xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 dark:text-rose-200">
                    {scanError}
                  </div>
                )}
              </div>

              <div className="glass-panel px-4 py-4 sm:px-5">
                  <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Result</p>
                    <h2 className="mt-1 font-display text-2xl font-semibold text-[var(--text-strong)]">Scanned result</h2>
                  </div>
                  {scannedData && (
                    <span className="status-chip">
                      <BadgeInfo className="h-3.5 w-3.5" />
                      Ready
                    </span>
                  )}
                </div>

                {scannedData ? (
                  <>
                    <div className="glass-subpanel min-h-48 whitespace-pre-wrap break-words px-4 py-4 font-mono text-sm leading-6 text-[var(--text-strong)]">
                      {scannedData}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button className="primary-action" onClick={() => copyEncodedData(scannedData)}>
                        <Copy className="h-4 w-4" />
                        Copy result
                      </button>
                      <button className="secondary-action" onClick={() => { setMode('create'); setData(scannedData) }}>
                        <QrCode className="h-4 w-4" />
                        Open in generator
                      </button>
                      <button className="secondary-action" onClick={() => { setScannedData(''); setScanError('') }}>
                        <RefreshCw className="h-4 w-4" />
                        Clear result
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <ScanLine className="h-10 w-10 text-[var(--accent-strong)]" />
                    <p className="font-semibold text-[var(--text-strong)]">Nothing scanned yet</p>
                    <p className="max-w-md text-center text-sm text-[var(--muted)]">
                      Upload a screenshot, photo, or document snapshot, or start the camera and point it at a QR code.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {statusMessage && (
            <div className="mt-5 flex justify-end">
              <span className="status-chip">{statusMessage}</span>
            </div>
          )}

          <section className="sr-only">
            <h2>Frequently Asked Questions</h2>
            <div>
              <article>
                <h3>Are these QR codes really free?</h3>
                <p>
                  Yes, our QR code maker online is completely free to use without any hidden strings attached. There are no watermarks, meaning you get clean, professional codes every time. We offer a true create QR code free experience.
                </p>
              </article>
              <article>
                <h3>Do your QR codes redirect through another link?</h3>
                <p>
                  No, your QR code points directly to your URL or data. We provide a direct QR code generator with zero tracking or intermediaries. You can trust that our free QR code without URL shortener means your users go exactly where you intended.
                </p>
              </article>
              <article>
                <h3>Do I need to create an account?</h3>
                <p>
                  There is no sign up required to start creating your codes today. Our platform is built as a QR code generator no account required, so you can jump in and export immediately. It&apos;s truly a free QR code no sign up solution.
                </p>
              </article>
              <article>
                <h3>Do the QR codes expire?</h3>
                <p>
                  Since our tool generates static codes, there is absolutely no expiry. As long as the destination URL or data exists, the QR code will continue to work perfectly. It is a reliable free QR code generator no redirect ensuring long-term usability.
                </p>
              </article>
              <article>
                <h3>Can I use these QR codes commercially?</h3>
                <p>
                  Yes, you are fully authorized to use any custom QR code generator output from our site for your business or marketing materials. Whether it&apos;s a single QR code or using a bulk QR code generator free no watermark tool in the future, we support commercial usage.
                </p>
              </article>
            </div>
          </section>
        </div>
      </div>

      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,15,25,0.58)] px-4 py-6 backdrop-blur-md">
          <div className="glass-modal w-full max-w-3xl px-5 py-5 sm:px-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Templates</p>
                <h2 className="mt-1 font-display text-3xl font-semibold text-[var(--text-strong)]">Fill in the details</h2>
              </div>
              <button className="glass-icon-button" onClick={() => setShowTemplateModal(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="space-y-2">
                <TemplateButton icon={Link2} label="URL" active={dataType === 'url'} onClick={() => setDataType('url')} />
                <TemplateButton icon={Type} label="Text" active={dataType === 'text'} onClick={() => setDataType('text')} />
                <TemplateButton icon={Mail} label="Email" active={dataType === 'email'} onClick={() => setDataType('email')} />
                <TemplateButton icon={Phone} label="Phone" active={dataType === 'phone'} onClick={() => setDataType('phone')} />
                <TemplateButton icon={Wifi} label="WiFi" active={dataType === 'wifi'} onClick={() => setDataType('wifi')} />
              </div>

              <div className="space-y-4">
                {dataType === 'url' && (
                  <TextField label="URL" value={templateState.url} onChange={(value) => setTemplateState({ ...templateState, url: value })} icon={<Globe className="h-4 w-4" />} />
                )}
                {dataType === 'text' && (
                  <div>
                    <label className="field-label" htmlFor="template-text">Text</label>
                    <textarea
                      id="template-text"
                      className="glass-input min-h-40"
                      value={templateState.text}
                      onChange={(event) => setTemplateState({ ...templateState, text: event.target.value })}
                    />
                  </div>
                )}
                {dataType === 'email' && (
                  <div className="grid gap-4">
                    <TextField label="Email" value={templateState.email} onChange={(value) => setTemplateState({ ...templateState, email: value })} icon={<Mail className="h-4 w-4" />} />
                    <TextField label="Subject" value={templateState.subject} onChange={(value) => setTemplateState({ ...templateState, subject: value })} />
                    <div>
                      <label className="field-label" htmlFor="template-message">Message</label>
                      <textarea
                        id="template-message"
                        className="glass-input min-h-32"
                        value={templateState.message}
                        onChange={(event) => setTemplateState({ ...templateState, message: event.target.value })}
                      />
                    </div>
                  </div>
                )}
                {dataType === 'phone' && (
                  <TextField label="Phone number" value={templateState.phone} onChange={(value) => setTemplateState({ ...templateState, phone: value })} icon={<Phone className="h-4 w-4" />} />
                )}
                {dataType === 'wifi' && (
                  <div className="grid gap-4">
                    <TextField label="Network name" value={templateState.ssid} onChange={(value) => setTemplateState({ ...templateState, ssid: value })} icon={<Wifi className="h-4 w-4" />} />
                    <TextField label="Password" value={templateState.password} onChange={(value) => setTemplateState({ ...templateState, password: value })} />
                    <SelectField
                      label="Encryption"
                      value={templateState.encryption}
                      onChange={(value) => setTemplateState({ ...templateState, encryption: value as TemplateState['encryption'] })}
                      options={['WPA', 'WEP', 'nopass']}
                    />
                    <label className="toggle-row">
                      <input type="checkbox" checked={templateState.hidden} onChange={(event) => setTemplateState({ ...templateState, hidden: event.target.checked })} />
                      <span>Hidden network</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button className="secondary-action" onClick={() => setTemplateState(DEFAULT_TEMPLATE_STATE)}>
                <RefreshCw className="h-4 w-4" />
                Reset fields
              </button>
              <button className="primary-action" onClick={applyTemplateData}>
                <WandSparkles className="h-4 w-4" />
                Use this content
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function TemplateButton({
  icon: Icon,
  label,
  active,
  onClick
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button className={clsx('template-button', active && 'template-button-active')} onClick={onClick}>
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function ColorField({
  label,
  value,
  onChange,
  disabled
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <label className="field-stack">
      <span className="field-label">{label}</span>
      <div className={clsx('glass-input flex items-center gap-3', disabled && 'opacity-50')}>
        <input type="color" value={normalizeColor(value)} onChange={(event) => onChange(event.target.value)} disabled={disabled} className="h-10 w-12 cursor-pointer rounded-xl border-0 bg-transparent p-0" />
        <input value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} className="w-full bg-transparent text-sm outline-none" />
      </div>
    </label>
  )
}

function TextField({
  label,
  value,
  onChange,
  icon
}: {
  label: string
  value: string
  onChange: (value: string) => void
  icon?: React.ReactNode
}) {
  return (
    <label className="field-stack">
      <span className="field-label">{label}</span>
      <div className="glass-input flex items-center gap-3">
        {icon}
        <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent text-sm outline-none" />
      </div>
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  const formatOption = (text: string) => {
    if (text === 'nopass') return 'No password'
    const spaced = text.replace(/-/g, ' ')
    return spaced.charAt(0).toUpperCase() + spaced.slice(1)
  }

  return (
    <label className="field-stack">
      <span className="field-label">{label}</span>
      <select className="glass-input" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOption(option)}
          </option>
        ))}
      </select>
    </label>
  )
}

function RangeField({
  label,
  min,
  max,
  step,
  value,
  onChange
}: {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="field-stack">
      <div className="flex items-center justify-between gap-3">
        <span className="field-label">{label}</span>
        <span className="text-sm font-semibold text-[var(--text-strong)]">{value}</span>
      </div>
      <input className="glass-range" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}

function normalizeColor(value: string) {
  if (value.startsWith('#') && (value.length === 7 || value.length === 4)) return value
  return '#ffffff'
}
