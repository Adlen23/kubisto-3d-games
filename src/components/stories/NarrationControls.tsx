'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface NarrationControlsProps {
  text: string
  isAr: boolean
  onNext: () => void
  isLastPage: boolean
}

/**
 * تحكم بالسرد التلقائي باستخدام Web Speech API (text-to-speech)
 */
export function NarrationControls({ text, isAr, onNext, isLastPage }: NarrationControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true)
    }
  }, [])

  // إيقاف السرد عند تغيير الصفحة
  useEffect(() => {
    stopNarration()
  }, [text])

  const startNarration = () => {
    if (!isSupported) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = isAr ? 'ar-SA' : 'en-US'
    utterance.rate = 0.85
    utterance.pitch = 1.1

    // محاولة العثور على صوت مناسب
    const voices = window.speechSynthesis.getVoices()
    const langVoice = voices.find(v => v.lang.startsWith(isAr ? 'ar' : 'en'))
    if (langVoice) utterance.voice = langVoice

    utterance.onend = () => {
      setIsPlaying(false)
      // الانتقال للصفحة التالية تلقائياً
      if (!isLastPage) {
        setTimeout(onNext, 500)
      }
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  const stopNarration = () => {
    if (!isSupported) return
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }

  const toggleNarration = () => {
    if (isPlaying) {
      stopNarration()
    } else {
      startNarration()
    }
  }

  if (!isSupported) return null

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={toggleNarration}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm shadow-md transition-all ${
          isPlaying
            ? 'bg-rose-500 text-white hover:bg-rose-600'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4" />
            {isAr ? 'إيقاف' : 'Stop'}
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            {isAr ? 'اسمع القصة' : 'Listen'}
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="flex items-center gap-1"
          >
            {/* مؤشر صوتي متحرك */}
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                className="w-1 bg-amber-500 rounded-full"
                animate={{
                  height: [8, 20, 8],
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
