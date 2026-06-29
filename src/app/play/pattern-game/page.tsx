'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'

type GameState = 'start' | 'playing' | 'result'

interface PatternItem {
  emoji: string
  color: string
}

interface PatternQuestion {
  sequence: PatternItem[]
  answer: PatternItem
  options: PatternItem[]
}

const PATTERN_ITEMS: PatternItem[] = [
  { emoji: '🔴', color: 'bg-red-100' },
  { emoji: '🔵', color: 'bg-blue-100' },
  { emoji: '🟢', color: 'bg-green-100' },
  { emoji: '🟡', color: 'bg-yellow-100' },
  { emoji: '🟣', color: 'bg-purple-100' },
  { emoji: '🟠', color: 'bg-orange-100' },
  { emoji: '⭐', color: 'bg-amber-100' },
  { emoji: '🌙', color: 'bg-indigo-100' },
  { emoji: '❤️', color: 'bg-pink-100' },
  { emoji: '🔺', color: 'bg-red-50' },
]

function generatePattern(level: number): PatternQuestion {
  const itemCount = Math.min(2 + Math.floor(level / 3), 4)
  const patternLength = Math.min(4 + Math.floor(level / 2), 8)

  const available = PATTERN_ITEMS.slice(0, itemCount + 2)
  const patternItems = available.slice(0, itemCount)

  const sequence: PatternItem[] = []
  for (let i = 0; i < patternLength; i++) {
    sequence.push(patternItems[i % patternItems.length])
  }

  const answer = patternItems[patternLength % patternItems.length]

  const optionsSet = new Set<PatternItem>([answer])
  while (optionsSet.size < 4 && optionsSet.size < available.length) {
    optionsSet.add(available[Math.floor(Math.random() * available.length)])
  }

  return {
    sequence,
    answer,
    options: Array.from(optionsSet).sort(() => Math.random() - 0.5),
  }
}

export default function PatternGamePage() {
  const { isAr } = useLanguage()
  const [gameState, setGameState] = useState<GameState>('start')
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [question, setQuestion] = useState<PatternQuestion | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [questionNum, setQuestionNum] = useState(0)
  const totalQuestions = 10

  const startGame = useCallback(() => {
    setLevel(1)
    setScore(0)
    setQuestionNum(0)
    setGameState('playing')
    setFeedback(null)
    setQuestion(generatePattern(1))
  }, [])

  const handleAnswer = (item: PatternItem) => {
    if (feedback || !question) return
    const isCorrect = item.emoji === question.answer.emoji

    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) {
      setScore(s => s + 10 + level * 2)
    }

    setTimeout(() => {
      setFeedback(null)
      if (questionNum + 1 >= totalQuestions) {
        setGameState('result')
      } else {
        const newLevel = isCorrect ? level + 1 : Math.max(1, level)
        setLevel(newLevel)
        setQuestionNum(q => q + 1)
        setQuestion(generatePattern(newLevel))
      }
    }, 1200)
  }

  return (
    <div className="min-h-screen flex flex-col bg-orange-50">
      <Navbar />
      <main className="flex-1 pt-20 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/games" className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-700 text-sm mb-3 transition-colors">
              <span>{isAr ? '→' : '←'}</span> {isAr ? 'العودة للألعاب' : 'Back to Games'}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-orange-900">
              🧩 {isAr ? 'تعرّف على النمط' : 'Pattern Game'}
            </h1>
          </motion.div>

          {gameState === 'start' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-32 h-32 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <p className="text-orange-700 text-lg">{isAr ? 'ما هو العنصر التالي في النمط؟' : 'What comes next in the pattern?'}</p>
              <div className="flex justify-center gap-2">
                {['🔴', '🔵', '🔴', '🔵', '❓'].map((e, i) => (
                  <motion.span
                    key={i}
                    className="text-3xl"
                    animate={i === 4 ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {e}
                  </motion.span>
                ))}
              </div>
              <motion.button
                onClick={startGame}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg shadow-orange-300/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 {isAr ? 'ابدأ اللعب!' : 'Start Playing!'}
              </motion.button>
            </motion.div>
          )}

          {gameState === 'playing' && question && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Score bar */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-orange-700">{isAr ? 'السؤال' : 'Q'} {questionNum + 1}/{totalQuestions}</span>
                  <span className="text-sm font-bold text-amber-500">⭐ {score}</span>
                </div>
                <div className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-bold">
                  {isAr ? `مستوى ${level}` : `Level ${level}`}
                </div>
              </div>

              {/* Kopisto dancing */}
              <div className="flex justify-center mb-4">
                <motion.div
                  className="relative w-20 h-20"
                  animate={feedback === 'correct'
                    ? { y: [0, -15, 0], rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }
                    : { y: [0, -3, 0] }
                  }
                  transition={{ duration: feedback === 'correct' ? 0.6 : 2, repeat: Infinity }}
                >
                  <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
                </motion.div>
              </div>

              {/* Pattern display */}
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6"
                key={questionNum}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <div className="text-sm font-bold text-orange-600 mb-3">{isAr ? 'ما الذي يأتي بعد؟' : 'What comes next?'}</div>
                <div className="flex justify-center gap-1 md:gap-2 flex-wrap">
                  {question.sequence.map((item, i) => (
                    <motion.div
                      key={i}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${item.color} flex items-center justify-center text-xl md:text-2xl shadow-sm`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      {item.emoji}
                    </motion.div>
                  ))}
                  <motion.div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-200 border-2 border-dashed border-orange-400 flex items-center justify-center text-xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ❓
                  </motion.div>
                </div>
              </motion.div>

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`text-center text-xl font-bold mb-4 ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {feedback === 'correct'
                      ? (isAr ? '✅ ممتاز!' : '✅ Correct!')
                      : (isAr ? '❌ حاول مرة أخرى!' : '❌ Try again!')}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Options */}
              <div className="flex justify-center gap-4">
                {question.options.map((opt, i) => (
                  <motion.button
                    key={`${questionNum}-${i}`}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!feedback}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-lg flex items-center justify-center text-3xl md:text-4xl transition-all ${
                      feedback
                        ? opt.emoji === question.answer.emoji
                          ? 'bg-green-200 ring-4 ring-green-300 scale-110'
                          : 'bg-white opacity-50'
                        : `${opt.color} hover:scale-110 active:scale-95 cursor-pointer`
                    }`}
                    whileHover={!feedback ? { scale: 1.1 } : {}}
                    whileTap={!feedback ? { scale: 0.9 } : {}}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {opt.emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{ y: -50, opacity: 1 }}
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
              <h2 className="text-3xl font-bold text-orange-900">
                {score >= 100 ? (isAr ? '🎉 عبقري الأنماط!' : '🎉 Pattern Genius!') :
                 score >= 60 ? (isAr ? '👍 ممتاز!' : '👍 Great!') :
                 (isAr ? '💪 استمر!' : '💪 Keep trying!')}
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-5xl font-bold text-orange-600">{score}</div>
                <div className="text-orange-500">{isAr ? 'نقطة' : 'points'}</div>
                <div className="mt-2 text-sm text-orange-400">
                  {isAr ? `وصلت لمستوى ${level}` : `Reached level ${level}`}
                </div>
              </div>
              <motion.button
                onClick={startGame}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg"
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
