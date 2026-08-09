'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'

interface AnimatedTextProps {
  text: string
  fontSize: 'sm' | 'md' | 'lg'
  isAr: boolean
  /** تشغيل الأنيميشن كلمة بكلمة أو عرض كامل */
  animate?: boolean
}

/**
 * نص يظهر كلمة بكلمة مع أنيميشن
 */
export function AnimatedText({ text, fontSize, isAr, animate = true }: AnimatedTextProps) {
  const [visibleWords, setVisibleWords] = useState(animate ? 0 : 9999)

  const words = useMemo(() => text.split(/\s+/), [text])

  useEffect(() => {
    if (!animate) {
      setVisibleWords(9999)
      return
    }
    setVisibleWords(0)
    const interval = setInterval(() => {
      setVisibleWords(prev => {
        if (prev >= words.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 120) // سرعة ظهور الكلمات
    return () => clearInterval(interval)
  }, [text, animate, words.length])

  const fontSizeClass = {
    sm: 'text-base md:text-lg',
    md: 'text-lg md:text-xl',
    lg: 'text-xl md:text-2xl',
  }[fontSize]

  return (
    <div className={`${fontSizeClass} text-amber-900 leading-loose text-center font-medium`} dir={isAr ? 'rtl' : 'ltr'}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginInline: '0.15em' }}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{
            opacity: i < visibleWords ? 1 : 0,
            y: i < visibleWords ? 0 : 20,
            filter: i < visibleWords ? 'blur(0px)' : 'blur(8px)',
          }}
          transition={{
            duration: 0.4,
            ease: 'easeOut',
          }}
        >
          {word}
        </motion.span>
      ))}
      {/* مؤشر الكتابة */}
      {visibleWords < words.length && (
        <motion.span
          className="inline-block w-1 h-6 bg-amber-500 ml-1 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  )
}
