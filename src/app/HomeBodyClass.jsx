'use client'

import { useEffect } from 'react'

export default function HomeBodyClass() {
  useEffect(() => {
    document.body.classList.add('home')

    return () => {
      document.body.classList.remove('home')
    }
  }, [])

  return null
}
