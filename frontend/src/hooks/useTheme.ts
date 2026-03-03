import { useState, useEffect, useCallback } from 'react'

function getInitialDark() {
  const saved = localStorage.getItem('theme')
  if (saved) return saved === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

const initialDark = getInitialDark()
applyTheme(initialDark)

export function useTheme() {
  const [dark, setDark] = useState(initialDark)

  useEffect(() => {
    applyTheme(dark)
  }, [dark])

  const toggle = useCallback(() => setDark(d => !d), [])

  return { dark, toggle }
}
