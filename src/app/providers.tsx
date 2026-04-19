'use client'

import { useState, createContext, useContext, ReactNode } from 'react'

type AppMode = 'create' | 'scan'

interface AppContextType {
  mode: AppMode
  setMode: (mode: AppMode) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>('create')
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev)

  return (
    <AppContext.Provider value={{ mode, setMode, isDarkMode, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}