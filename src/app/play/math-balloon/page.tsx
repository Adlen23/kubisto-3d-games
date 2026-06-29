'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'

type GameState = 'start' | 'playing' | 'result'

interface Balloon {
  id: number
  value: number
  x: number
  y: number
  color: string
  speed: number
  popped: boolean
}

const BALLOON_COLORS = [
  'from-red-400 to-red-500',
  'from-blue-400 to-blue-500',
  'from-green-400 to-green-500',
  'from-yellow-400 to-yellow-500',
  'from-pink-400 to-pink-500',
  'from-purple-400 to-purple-500',
  'from-orange-400 to-orange-500',
]

function generateEquation(max: number): { text: string; answer: number } {
  const ops = ['+', '-', '×']
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a: number, b: number, answer: number
  if (op === '×') {
    a = Math.floor(Math.random() * Math.min(max, 10)) + 1
    b = Math.floor(Math.random() * Math.min(max, 10)) + 1
    answer = a * b
  } else if (op === '-') {
    a = Math.floor(Math.random() * max) + 1
    b = Math.floor(Math.random() * a) + 1
    answer = a - b
  } else {
    a = Math.floor(Math.random() * max) + 1
    b = Math.floor(Math.random() * max) + 1
    answer = a + b
  }
  return { text: `${a} ${op} ${b} = ?`, answer }
}

export default function MathBalloonPage() {
  const { isAr } = useLanguage()
  const [gameState, setGameState] = useState<GameState>('start')
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [equation, setEquation] = useState<{ text: string; answer: number } | null>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [questionNum, setQuestionNum] = useState(0)
  const [totalQuestions] = useState(10)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [celebrating, setCelebrating] = useState(false)
  const animRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const spawnBalloons = useCallback((answer: number) => {
    const newBalloons: Balloon[] = []
    const valuesSet = new Set<number>([answer])
    while (valuesSet.size < 5) {
      const offset = Math.floor(Math.random() * 10) - 5
      const val = answer + (offset === 0 ? 1 : offset)
      if (val >= 0) valuesSet.add(val)
    }
    const values = Array.from(valuesSet)
    values.forEach((v, i) => {
      newBalloons.push({
        id: Date.now() + i,
        value: v,
        x: 10 + (i * 18) + Math.random() * 5,
        y: 100 + Math.random() * 20,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        speed: 0.3 + Math.random() * 0.3,
        popped: false,
      })
    })
    setBalloons(newBalloons)
  }, [])

  const nextQuestion = useCallback(() => {
    const eq = generateEquation(20)
    setEquation(eq)
    setQuestionNum(q => q + 1)
    setFeedback(null)
    spawnBalloons(eq.answer)
  }, [spawnBalloons])

  const startGame = useCallback(() => {
    setScore(0)
    setLives(3)
    setQuestionNum(0)
    setGameState('playing')
    setCelebrating(false)
    const eq = generateEquation(20)
    setEquation(eq)
    setQuestionNum(1)
    setFeedback(null)
    spawnBalloons(eq.answer)
  }, [spawnBalloons])

  // Animate balloons floating up
  useEffect(() => {
    if (gameState !== 'playing') return
    let lastTime = performance.now()
    const animate = (time: number) => {
      const delta = (time - lastTime) / 16
      lastTime = time
      setBalloons(prev => prev.map(b => {
        if (b.popped) return b
        const newY = b.y - b.speed * delta
        if (newY < -15) return { ...b, y: 100 }
        return { ...b, y: newY }
      }))
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [gameState])

  const handlePop = (balloon: Balloon) => {
    if (feedback || !equation || balloon.popped) return
    const isCorrect = balloon.value === equation.answer

    setBalloons(prev => prev.map(b => b.id === balloon.id ? { ...b, popped: true } : b))

    if (isCorrect) {
      setFeedback('correct')
      setScore(s => s + 10)
      setCelebrating(true)
      setTimeout(() => {
        setCelebrating(false)
        if (questionNum >= totalQuestions) {
          setGameState('result')
        } else {
          nextQuestion()
        }
      }, 1000)
    } else {
      setFeedback('wrong')
      setLives(l => {
        const newLives = l - 1
        if (newLives <= 0) {
          setTimeout(() => setGameState('result'), 800)
        }
        return newLives
      })
      setTimeout(() => setFeedback(null), 800)
    }
  }

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
              🎈 {isAr ? 'فقع البالونات' : 'Math Balloon Pop'}
            </h1>
          </motion.div>

          {gameState === 'start' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-32 h-32 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <p className="text-sky-700 text-lg">{isAr ? 'فقع البالون الذي يحمل الإجابة الصحيحة!' : 'Pop the balloon with the correct answer!'}</p>
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

          {gameState === 'playing' && equation && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Score bar */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-sky-700">{isAr ? 'السؤال' : 'Q'} {questionNum}/{totalQuestions}</span>
                  <span className="text-sm font-bold text-orange-500">⭐ {score}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className={`text-lg ${i < lives ? '' : 'opacity-30'}`}>❤️</span>
                  ))}
                </div>
              </div>

              {/* Equation */}
              <motion.div
                className="bg-white rounded-3xl p-4 shadow-lg text-center mb-4"
                key={questionNum}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-sky-900">{equation.text}</div>
              </motion.div>

              {/* Game area */}
              <div ref={containerRef} className="relative bg-gradient-to-b from-sky-200 via-sky-100 to-white rounded-3xl overflow-hidden" style={{ minHeight: '350px' }}>
                {/* Balloons */}
                {balloons.map(balloon => (
                  <motion.button
                    key={balloon.id}
                    onClick={() => handlePop(balloon)}
                    className={`absolute cursor-pointer ${balloon.popped ? 'pointer-events-none' : ''}`}
                    style={{
                      left: `${balloon.x}%`,
                      top: `${balloon.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    animate={balloon.popped ? { scale: 0, opacity: 0 } : { x: [0, 5, -5, 0] }}
                    transition={balloon.popped ? { duration: 0.2 } : { duration: 3, repeat: Infinity }}
                  >
                    <div className={`w-16 h-20 md:w-20 md:h-24 rounded-full bg-gradient-to-b ${balloon.color} flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg relative`}>
                      {!balloon.popped && balloon.value}
                      {/* Balloon knot */}
                      <div className={`absolute -bottom-2 w-3 h-3 bg-gradient-to-b ${balloon.color} rounded-full`} />
                      {/* String */}
                      <div className="absolute -bottom-8 w-px h-6 bg-gray-400" />
                    </div>
                  </motion.button>
                ))}

                {/* Kopisto at bottom */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                  <motion.div
                    className="w-16 h-16 relative"
                    animate={celebrating ? { y: [0, -10, 0], scale: [1, 1.1, 1] } : { y: [0, -3, 0] }}
                    transition={{ duration: celebrating ? 0.5 : 2, repeat: Infinity }}
                  >
                    <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
                  </motion.div>
                </div>

                {/* Clouds */}
                <div className="absolute top-4 left-8 text-4xl opacity-30">☁️</div>
                <div className="absolute top-8 right-12 text-3xl opacity-20">☁️</div>
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
                      ? (isAr ? '✅ أحسنت!' : '✅ Correct!')
                      : (isAr ? '❌ إجابة خاطئة!' : '❌ Wrong answer!')}
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
              <h2 className="text-3xl font-bold text-sky-900">
                {score >= 70 ? (isAr ? '🎉 رائع!' : '🎉 Amazing!') :
                 score >= 40 ? (isAr ? '👍 جيد!' : '👍 Good!') :
                 (isAr ? '💪 استمر في التدريب!' : '💪 Keep practicing!')}
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-5xl font-bold text-sky-600">{score}</div>
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
