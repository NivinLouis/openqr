declare module 'next-pwa' {
  import { NextConfig } from 'next'

  interface NextPWAOptions {
    dest: string
    register?: boolean
    skipWaiting?: boolean
    disable?: boolean
    publicExcludes?: string[]
  }

  function nextPWA(options: NextPWAOptions): (config: NextConfig) => NextConfig
  export default nextPWA
}