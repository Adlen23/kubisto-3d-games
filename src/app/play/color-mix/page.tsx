'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'

type GameState = 'start' | 'playing' | 'result'

interface ColorMix {
  nameEn: string
  nameAr: string
  color: string
  emoji: string
}

const PRIMARY_COLORS: Record<string, ColorMix> = {
  red: { nameEn: 'Red', nameAr: 'أحمر', color: '#ef4444', emoji: '🔴' },
  blue: { nameEn: 'Blue', nameAr: 'أزرق', color: '#3b82f6', emoji: '🔵' },
  yellow: { nameEn: 'Yellow', nameAr: 'أصفر', color: '#eab308', emoji: '🟡' },
}

const MIX_RESULTS: Record<string, ColorMix> = {
  'red+blue': { nameEn: 'Purple', nameAr: 'بنفسجي', color: '#8b5cf6', emoji: '🟣' },
  'red+yellow': { nameEn: 'Orange', nameAr: 'برتقالي', color: '#f97316', emoji: '🟠' },
  'blue+yellow': { nameEn: 'Green', nameAr: 'أخضر', color: '#22c55e', emoji: '🟢' },
  'red+blue+yellow': { nameEn: 'Brown', nameAr: 'بني', color: '#92400e', emoji: '🟤' },
}

interface Challenge {
  target: ColorMix
  ingredients: string[]
}

const CHALLENGES: Challenge[] = [
  { target: MIX_RESULTS['red+blue'], ingredients: ['red', 'blue'] },
  { target: MIX_RESULTS['red+yellow'], ingredients: ['red', 'yellow'] },
  { target: MIX_RESULTS['blue+yellow'], ingredients: ['blue', 'yellow'] },
  { target: MIX_RESULTS['red+blue+yellow'], ingredients: ['red', 'blue', 'yellow'] },
]

export default function ColorMixPage() {
  const { isAr } = useLanguage()
  const [gameState, setGameState] = useState<GameState>('start')
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [beakerColor, setBeakerColor] = useState<string>('#e5e7eb')
  const [mixing, setMixing] = useState(false)
  const [mode, setMode] = useState<'free' | 'challenge'>('free')
  const [freeResult, setFreeResult] = useState<ColorMix | null>(null)

  const startFree = useCallback(() => {
    setMode('free')
    setSelectedColors([])
    setBeakerColor('#e5e7eb')
    setGameState('playing')
    setFeedback(null)
    setFreeResult(null)
    setMixing(false)
  }, [])

  const startChallenge = useCallback(() => {
    setMode('challenge')
    setChallengeIndex(0)
    setScore(0)
    setSelectedColors([])
    setBeakerColor('#e5e7eb')
    setGameState('playing')
    setFeedback(null)
    setMixing(false)
  }, [])

  const handleColorClick = (colorKey: string) => {
    if (feedback || mixing) return
    if (selectedColors.includes(colorKey)) {
      setSelectedColors(prev => prev.filter(c => c !== colorKey))
      return
    }
    if (selectedColors.length >= 3) return

    const newSelected = [...selectedColors, colorKey]
    setSelectedColors(newSelected)
  }

  const mixColors = () => {
    if (selectedColors.length < 2 || mixing) return
    setMixing(true)

    const sorted = [...selectedColors].sort().join('+')
    const result = MIX_RESULTS[sorted]

    setTimeout(() => {
      if (result) {
        setBeakerColor(result.color)
        if (mode === 'challenge') {
          const currentChallenge = CHALLENGES[challengeIndex % CHALLENGES.length]
          if (result.nameEn === currentChallenge.target.nameEn) {
            setFeedback('correct')
            setScore(s => s + 10)
          } else {
            setFeedback('wrong')
          }
        } else {
          setFreeResult(result)
        }
      } else {
        setBeakerColor('#6b7280')
        if (mode === 'challenge') {
          setFeedback('wrong')
        } else {
          setFreeResult({ nameEn: 'Muddy Color', nameAr: 'لون طيني', color: '#6b7280', emoji: '🫙' })
        }
      }
      setMixing(false)
    }, 1500)
  }

  const nextChallenge = () => {
    if (challengeIndex + 1 >= CHALLENGES.length) {
      setGameState('result')
    } else {
      setChallengeIndex(i => i + 1)
      setSelectedColors([])
      setBeakerColor('#e5e7eb')
      setFeedback(null)
      setMixing(false)
    }
  }

  const resetBeaker = () => {
    setSelectedColors([])
    setBeakerColor('#e5e7eb')
    setFeedback(null)
    setFreeResult(null)
    setMixing(false)
  }

  const currentChallenge = CHALLENGES[challengeIndex % CHALLENGES.length]

  return (
    <div className="min-h-screen flex flex-col bg-emerald-50">
      <Navbar />
      <main className="flex-1 pt-20 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/games" className="inline-flex items-center gap-1 text-emerald-500 hover:text-emerald-700 text-sm mb-3 transition-colors">
              <span>{isAr ? '→' : '←'}</span> {isAr ? 'العودة للألعاب' : 'Back to Games'}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-900">
              🧪 {isAr ? 'مختبر الألوان' : 'Color Mixing Lab'}
            </h1>
          </motion.div>

          {gameState === 'start' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-32 h-32 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <p className="text-emerald-700 text-lg">{isAr ? 'امزج الألوان لاكتشاف ألوان جديدة!' : 'Mix colors to discover new ones!'}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={startFree}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎨 {isAr ? 'حرّك بحرية' : 'Free Play'}
                </motion.button>
                <motion.button
                  onClick={startChallenge}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🧪 {isAr ? 'تحدي المزج' : 'Mix Challenge'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Score bar for challenge mode */}
              {mode === 'challenge' && (
                <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-700">{challengeIndex + 1}/{CHALLENGES.length}</span>
                    <span className="text-sm font-bold text-orange-500">⭐ {score}</span>
                  </div>
                  <div className="bg-emerald-100 px-3 py-1 rounded-full text-sm font-bold text-emerald-700">
                    {isAr ? 'اصنع اللون:' : 'Make:'} <span style={{ color: currentChallenge.target.color }}>{isAr ? currentChallenge.target.nameAr : currentChallenge.target.nameEn}</span>
                  </div>
                </div>
              )}

              {/* Kopisto scientist */}
              <div className="flex justify-center mb-4">
                <motion.div
                  className="relative w-20 h-20"
                  animate={feedback === 'correct' ? { y: [0, -10, 0], scale: [1, 1.1, 1] } : { y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
                  <div className="absolute -top-1 -right-1 text-sm">🔬</div>
                </motion.div>
              </div>

              {/* Beaker */}
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6"
                animate={mixing ? { rotate: [0, -5, 5, -5, 0] } : {}}
                transition={{ duration: 0.5, repeat: mixing ? 3 : 0 }}
              >
                <div className="text-6xl mb-2">🧪</div>
                <motion.div
                  className="w-24 h-32 mx-auto rounded-b-3xl border-4 border-gray-300 relative overflow-hidden"
                  style={{ background: `linear-gradient(to top, ${beakerColor}, transparent)` }}
                  animate={mixing ? { scaleY: [1, 1.1, 0.9, 1] } : {}}
                  transition={{ duration: 0.5, repeat: mixing ? 3 : 0 }}
                >
                  {/* Bubbles */}
                  {mixing && Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white/40 rounded-full"
                      style={{ left: `${20 + Math.random() * 60}%`, bottom: '10%' }}
                      animate={{ y: -60, opacity: [1, 0] }}
                      transition={{ duration: 0.8, delay: i * 0.15, repeat: 2 }}
                    />
                  ))}
                </motion.div>
                {freeResult && mode === 'free' && (
                  <div className="mt-3 text-lg font-bold" style={{ color: freeResult.color }}>
                    {freeResult.emoji} {isAr ? freeResult.nameAr : freeResult.nameEn}
                  </div>
                )}
              </motion.div>

              {/* Primary color buttons */}
              <div className="flex justify-center gap-4 mb-6">
                {Object.entries(PRIMARY_COLORS).map(([key, color]) => (
                  <motion.button
                    key={key}
                    onClick={() => handleColorClick(key)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all ${
                      selectedColors.includes(key) ? 'ring-4 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.color }}
                    whileHover={{ scale: selectedColors.includes(key) ? 1.1 : 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {color.emoji}
                  </motion.button>
                ))}
              </div>

              {/* Selected colors display */}
              <div className="text-center mb-4">
                <div className="text-sm text-emerald-600 mb-2">{isAr ? 'الألوان المختارة:' : 'Selected colors:'}</div>
                <div className="flex justify-center gap-2">
                  {selectedColors.length === 0 ? (
                    <span className="text-emerald-400 text-sm">{isAr ? 'اختر لونين أو أكثر' : 'Pick 2 or more colors'}</span>
                  ) : (
                    selectedColors.map(c => (
                      <span key={c} className="text-2xl">{PRIMARY_COLORS[c].emoji}</span>
                    ))
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={mixColors}
                  disabled={selectedColors.length < 2 || mixing}
                  className={`px-6 py-3 rounded-2xl font-bold shadow-lg ${
                    selectedColors.length >= 2 && !mixing
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                  whileHover={selectedColors.length >= 2 ? { scale: 1.05 } : {}}
                  whileTap={selectedColors.length >= 2 ? { scale: 0.95 } : {}}
                >
                  {mixing ? '🔄 ...' : `🧪 ${isAr ? 'امزج!' : 'Mix!'}`}
                </motion.button>
                <motion.button
                  onClick={resetBeaker}
                  className="px-6 py-3 rounded-2xl font-bold bg-gray-200 text-gray-600 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🗑️ {isAr ? 'تفريغ' : 'Clear'}
                </motion.button>
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-center mt-4"
                  >
                    <div className={`text-xl font-bold ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                      {feedback === 'correct'
                        ? (isAr ? '✅ أحسنت! لون صحيح!' : '✅ Correct color!')
                        : (isAr ? '❌ حاول مزج ألوان مختلفة!' : '❌ Try different colors!')}
                    </div>
                    <motion.button
                      onClick={nextChallenge}
                      className="mt-3 bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {challengeIndex + 1 >= CHALLENGES.length
                        ? (isAr ? '🏆 إنهاء' : '🏆 Finish')
                        : (isAr ? 'التالي ←' : 'Next →')}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-28 h-28 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-900">
                {score >= 30 ? (isAr ? '🎉 عالم ألوان!' : '🎉 Color Scientist!') : (isAr ? '💪 استمر!' : '💪 Keep mixing!')}
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-5xl font-bold text-emerald-600">{score}</div>
                <div className="text-emerald-500">{isAr ? 'نقطة' : 'points'}</div>
              </div>
              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={startChallenge}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 {isAr ? 'تحدي جديد' : 'New Challenge'}
                </motion.button>
                <motion.button
                  onClick={() => setGameState('start')}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🏠 {isAr ? 'الرئيسية' : 'Home'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
