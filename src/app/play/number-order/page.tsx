'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'

type GameState = 'start' | 'playing' | 'result'

interface Bubble {
  id: number
  value: number
  x: number
  y: number
  popped: boolean
  scale: number
}

function generateBubbles(count: number, max: number): Bubble[] {
  const values = new Set<number>()
  while (values.size < count) {
    values.add(Math.floor(Math.random() * max) + 1)
  }
  const sortedValues = Array.from(values).sort(() => Math.random() - 0.5)
  return sortedValues.map((v, i) => ({
    id: i,
    value: v,
    x: 10 + Math.random() * 70,
    y: 15 + Math.random() * 65,
    popped: false,
    scale: 0.8 + Math.random() * 0.4,
  }))
}

export default function NumberOrderPage() {
  const { isAr } = useLanguage()
  const [gameState, setGameState] = useState<GameState>('start')
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [nextNumber, setNextNumber] = useState(1)
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [totalRounds] = useState(5)
  const [totalScore, setTotalScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([])
  const [kopistoX, setKopistoX] = useState(50)
  const particleId = useRef(0)

  const startGame = useCallback(() => {
    const count = 6
    const max = 20
    const newBubbles = generateBubbles(count, max)
    setBubbles(newBubbles)
    const sortedVals = newBubbles.map(b => b.value).sort((a, b) => a - b)
    setNextNumber(sortedVals[0])
    setScore(0)
    setRound(1)
    setTotalScore(0)
    setGameState('playing')
    setFeedback(null)
    setParticles([])
  }, [])

  const nextRound = useCallback(() => {
    const count = Math.min(6 + round, 10)
    const max = 20 + round * 10
    const newBubbles = generateBubbles(count, max)
    setBubbles(newBubbles)
    const sortedVals = newBubbles.map(b => b.value).sort((a, b) => a - b)
    setNextNumber(sortedVals[0])
    setFeedback(null)
    setParticles([])
  }, [round])

  const handleBubbleClick = (bubble: Bubble) => {
    if (feedback || bubble.popped) return

    const sortedVals = bubbles.map(b => b.value).sort((a, b) => a - b)
    const currentNext = sortedVals.find(v => !bubbles.find(b => b.value === v && b.popped))

    if (bubble.value === currentNext) {
      setFeedback('correct')
      setScore(s => s + 10)
      setTotalScore(s => s + 10)
      setKopistoX(bubble.x)

      // Add particles
      const newParticles = Array.from({ length: 5 }).map(() => ({
        id: particleId.current++,
        x: bubble.x + (Math.random() - 0.5) * 20,
        y: bubble.y + (Math.random() - 0.5) * 20,
      }))
      setParticles(p => [...p, ...newParticles])

      // Mark bubble as popped
      setBubbles(bs => bs.map(b => b.id === bubble.id ? { ...b, popped: true } : b))

      // Find next number
      const remaining = bubbles.filter(b => b.id !== bubble.id && !b.popped)
      const nextSorted = remaining.map(b => b.value).sort((a, b) => a - b)

      setTimeout(() => {
        setFeedback(null)
        setParticles([])
        if (nextSorted.length === 0) {
          // Round complete
          if (round >= totalRounds) {
            setGameState('result')
          } else {
            setRound(r => r + 1)
            nextRound()
          }
        } else {
          setNextNumber(nextSorted[0])
        }
      }, 600)
    } else {
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 800)
    }
  }

  const sortedRemaining = bubbles.filter(b => !b.popped).map(b => b.value).sort((a, b) => a - b)
  const currentTarget = sortedRemaining[0]

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar />
      <main className="flex-1 pt-20 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/games" className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-700 text-sm mb-3 transition-colors">
              <span>{isAr ? '→' : '←'}</span> {isAr ? 'العودة للألعاب' : 'Back to Games'}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-sky-900">
              🔢 {isAr ? 'ترتيب الأرقام' : 'Number Order'}
            </h1>
          </motion.div>

          {gameState === 'start' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-32 h-32 mx-auto">
                <Image src="/kopisto-run.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <p className="text-sky-700 text-lg">{isAr ? 'اضغط على الأرقام بالترتيب من الأصغر للأكبر!' : 'Tap the numbers in order from smallest to biggest!'}</p>
              <motion.button
                onClick={startGame}
                className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg shadow-sky-300/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 {isAr ? 'ابدأ اللعب!' : 'Start Playing!'}
              </motion.button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Score bar */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-sky-700">{isAr ? 'الجولة' : 'Round'} {round}/{totalRounds}</span>
                  <span className="text-sm font-bold text-orange-500">⭐ {totalScore}</span>
                </div>
                <div className="bg-sky-100 px-3 py-1 rounded-full text-sm font-bold text-sky-700">
                  {isAr ? 'التالي:' : 'Next:'} {currentTarget}
                </div>
              </div>

              {/* Game area */}
              <div className="relative bg-gradient-to-b from-sky-100 to-sky-200 rounded-3xl overflow-hidden" style={{ minHeight: '400px' }}>
                {/* Kopisto running character */}
                <motion.div
                  className="absolute bottom-2 w-16 h-16 z-10"
                  animate={{ left: `${kopistoX}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                >
                  <Image src="/kopisto-run.webp" alt="Kopisto" fill className="object-contain" />
                </motion.div>

                {/* Number bubbles */}
                {bubbles.map((bubble) => (
                  <motion.button
                    key={bubble.id}
                    onClick={() => handleBubbleClick(bubble)}
                    className={`absolute w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold shadow-lg transition-all ${
                      bubble.popped
                        ? 'bg-green-300 text-green-700 scale-0'
                        : 'bg-white text-sky-700 hover:scale-110 active:scale-95 cursor-pointer'
                    }`}
                    style={{
                      left: `${bubble.x}%`,
                      top: `${bubble.y}%`,
                      transform: `translate(-50%, -50%) scale(${bubble.scale})`,
                    }}
                    animate={
                      bubble.popped
                        ? { scale: 0, opacity: 0 }
                        : { y: [0, -8, 0] }
                    }
                    transition={
                      bubble.popped
                        ? { duration: 0.3 }
                        : { duration: 2 + Math.random(), repeat: Infinity, ease: 'easeInOut' }
                    }
                    whileHover={!bubble.popped ? { scale: 1.2 } : {}}
                  >
                    {!bubble.popped && bubble.value}
                  </motion.button>
                ))}

                {/* Particles */}
                {particles.map(p => (
                  <motion.div
                    key={p.id}
                    className="absolute text-lg"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0, y: -30 }}
                    transition={{ duration: 0.6 }}
                  >
                    ✨
                  </motion.div>
                ))}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`text-center text-xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {feedback === 'correct'
                      ? (isAr ? '✅ ممتاز!' : '✅ Great!')
                      : (isAr ? '❌ ليس هذا الرقم!' : '❌ Not this number!')}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{ y: -50, x: Math.random() * 300 - 150, opacity: 1 }}
                  animate={{ y: 250, opacity: 0, rotate: 360 }}
                  transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5, repeat: Infinity, repeatDelay: Math.random() * 2 }}
                  style={{ left: `${Math.random() * 100}%`, top: 0 }}
                >
                  {['🎉', '🌟', '✨', '🎊', '⭐'][i % 5]}
                </motion.div>
              ))}
              <div className="relative w-28 h-28 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <h2 className="text-3xl font-bold text-sky-900">
                {totalScore >= 70 ? (isAr ? '🎉 رائع!' : '🎉 Amazing!') :
                 totalScore >= 40 ? (isAr ? '👍 جيد!' : '👍 Good!') :
                 (isAr ? '💪 استمر!' : '💪 Keep going!')}
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-5xl font-bold text-sky-600">{totalScore}</div>
                <div className="text-sky-500">{isAr ? 'نقطة' : 'points'}</div>
              </div>
              <motion.button
                onClick={startGame}
                className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔄 {isAr ? 'العب مرة أخرى' : 'Play Again'}
              </motion.button>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
