// src/hooks/useActiveSection.js
import { useState, useEffect } from 'react'

export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] || '')

  useEffect(() => {
    const observers = []

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
        observers.push(el)
      }
    })

    return () => {
      observers.forEach((el) => observer.unobserve(el))
    }
  }, [ids])

  return active
}
