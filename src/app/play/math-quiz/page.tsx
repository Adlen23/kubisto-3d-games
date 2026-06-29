'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'

type Difficulty = 'easy' | 'medium' | 'hard'
type GameState = 'start' | 'playing' | 'result'
type OpType = '+' | '-' | '×'

interface Question {
  a: number
  b: number
  op: OpType
  answer: number
  options: number[]
}

function generateQuestion(difficulty: Difficulty): Question {
  const max = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 50 : 100
  const ops: OpType[] = ['+', '-', '×']
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a: number, b: number, answer: number

  if (op === '×') {
    a = Math.floor(Math.random() * Math.min(max, 12)) + 1
    b = Math.floor(Math.random() * Math.min(max, 12)) + 1
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

  const optionsSet = new Set<number>([answer])
  while (optionsSet.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5
    const opt = answer + (offset === 0 ? 1 : offset)
    if (opt >= 0) optionsSet.add(opt)
  }
  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5)

  return { a, b, op, answer, options }
}

export default function MathQuizPage() {
  const { isAr } = useLanguage()
  const [gameState, setGameState] = useState<GameState>('start')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [question, setQuestion] = useState<Question | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [questionNum, setQuestionNum] = useState(0)
  const [totalQuestions] = useState(10)
  const [timeLeft, setTimeLeft] = useState(15)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [kopistoMood, setKopistoMood] = useState<'idle' | 'happy' | 'sad'>('idle')

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion(difficulty))
    setTimeLeft(15)
    setFeedback(null)
    setKopistoMood('idle')
  }, [difficulty])

  const startGame = useCallback(() => {
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setQuestionNum(0)
    setGameState('playing')
    setQuestion(generateQuestion(difficulty))
    setTimeLeft(15)
    setFeedback(null)
    setKopistoMood('idle')
  }, [difficulty])

  useEffect(() => {
    if (gameState !== 'playing' || feedback) return
    if (timeLeft <= 0) {
      setFeedback('wrong')
      setKopistoMood('sad')
      setStreak(0)
      setTimeout(() => {
        if (questionNum + 1 >= totalQuestions) {
          setGameState('result')
        } else {
          setQuestionNum(q => q + 1)
          nextQuestion()
        }
      }, 1200)
      return
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, gameState, feedback, questionNum, totalQuestions, nextQuestion])

  const handleAnswer = (selected: number) => {
    if (feedback || !question) return
    const isCorrect = selected === question.answer
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setKopistoMood(isCorrect ? 'happy' : 'sad')

    if (isCorrect) {
      const streakBonus = Math.min(streak, 5)
      setScore(s => s + 10 + streakBonus * 2)
      setStreak(s => {
        const newStreak = s + 1
        setBestStreak(b => Math.max(b, newStreak))
        return newStreak
      })
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (questionNum + 1 >= totalQuestions) {
        setGameState('result')
      } else {
        setQuestionNum(q => q + 1)
        nextQuestion()
      }
    }, 1200)
  }

  const diffLabels = {
    easy: isAr ? 'سهل' : 'Easy',
    medium: isAr ? 'متوسط' : 'Medium',
    hard: isAr ? 'صعب' : 'Hard',
  }

  const diffColors = {
    easy: 'from-green-400 to-green-500',
    medium: 'from-yellow-400 to-yellow-500',
    hard: 'from-red-400 to-red-500',
  }

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <Navbar />
      <main className="flex-1 pt-20 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/games" className="inline-flex items-center gap-1 text-sky-500 hover:text-sky-700 text-sm mb-3 transition-colors">
              <span>{isAr ? '→' : '←'}</span> {isAr ? 'العودة للألعاب' : 'Back to Games'}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-sky-900">
              🧮 {isAr ? 'تحدي الرياضيات' : 'Math Quiz Challenge'}
            </h1>
          </motion.div>

          {/* Start Screen */}
          {gameState === 'start' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-32 h-32 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <p className="text-sky-700 text-lg">{isAr ? 'اختر مستوى الصعوبة!' : 'Choose your difficulty!'}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                  <motion.button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-6 py-3 rounded-2xl text-white font-bold text-lg shadow-lg transition-all ${
                      difficulty === d ? `bg-gradient-to-r ${diffColors[d]} ring-4 ring-offset-2 ring-sky-300` : 'bg-sky-200 text-sky-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {diffLabels[d]}
                  </motion.button>
                ))}
              </div>
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

          {/* Playing Screen */}
          {gameState === 'playing' && question && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Score bar */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-sky-700">{isAr ? 'السؤال' : 'Q'} {questionNum + 1}/{totalQuestions}</span>
                  <span className="text-sm font-bold text-orange-500">⭐ {score}</span>
                  {streak > 1 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-sm font-bold text-red-500">
                      🔥 {streak}x
                    </motion.span>
                  )}
                </div>
                <div className={`text-sm font-bold px-3 py-1 rounded-full ${timeLeft <= 5 ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-600'}`}>
                  ⏱ {timeLeft}s
                </div>
              </div>

              {/* Timer bar */}
              <div className="w-full h-2 bg-sky-100 rounded-full mb-6 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${timeLeft <= 5 ? 'bg-red-400' : 'bg-sky-400'}`}
                  animate={{ width: `${(timeLeft / 15) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Kopisto character */}
              <div className="flex justify-center mb-4">
                <motion.div
                  className="relative w-24 h-24"
                  animate={
                    kopistoMood === 'happy' ? { y: [0, -15, 0], scale: [1, 1.1, 1] } :
                    kopistoMood === 'sad' ? { x: [0, -5, 5, -5, 0] } :
                    { y: [0, -5, 0] }
                  }
                  transition={{ duration: 0.5 }}
                >
                  <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
                </motion.div>
              </div>

              {/* Question */}
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6"
                key={questionNum}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-sky-900">
                  {question.a} {question.op} {question.b} = ?
                </div>
              </motion.div>

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`text-center text-2xl font-bold mb-4 ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {feedback === 'correct'
                      ? (isAr ? '✅ أحسنت!' : '✅ Correct!')
                      : (isAr ? '❌ حاول مرة أخرى!' : '❌ Try again!')}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Answer bubbles */}
              <div className="grid grid-cols-2 gap-4">
                {question.options.map((opt, i) => (
                  <motion.button
                    key={`${questionNum}-${i}`}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!feedback}
                    className={`relative py-5 rounded-2xl text-2xl font-bold shadow-lg transition-all ${
                      feedback
                        ? opt === question.answer
                          ? 'bg-green-400 text-white ring-4 ring-green-300'
                          : 'bg-sky-100 text-sky-300'
                        : 'bg-gradient-to-br from-sky-100 to-sky-200 text-sky-800 hover:from-sky-200 hover:to-sky-300 active:scale-95'
                    }`}
                    whileHover={!feedback ? { scale: 1.05 } : {}}
                    whileTap={!feedback ? { scale: 0.95 } : {}}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {opt}
                    {feedback && opt === question.answer && (
                      <motion.span
                        className="absolute -top-2 -right-2 text-2xl"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✨
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results Screen */}
          {gameState === 'result' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              {/* Confetti effect */}
              <div className="relative">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl"
                    initial={{ y: -100, x: Math.random() * 300 - 150, opacity: 1, rotate: 0 }}
                    animate={{ y: 300, x: Math.random() * 300 - 150, opacity: 0, rotate: 360 }}
                    transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5, repeat: Infinity, repeatDelay: Math.random() * 2 }}
                    style={{ left: `${Math.random() * 100}%`, top: 0 }}
                  >
                    {['🎉', '⭐', '🌟', '✨', '🎊'][i % 5]}
                  </motion.div>
                ))}
              </div>

              <div className="relative w-28 h-28 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <h2 className="text-3xl font-bold text-sky-900">
                {score >= 80 ? (isAr ? '🎉 رائع!' : '🎉 Amazing!') :
                 score >= 50 ? (isAr ? '👍 جيد!' : '👍 Good job!') :
                 (isAr ? '💪 حاول مرة أخرى!' : '💪 Try again!')}
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg space-y-3">
                <div className="text-5xl font-bold text-sky-600">{score}</div>
                <div className="text-sky-500">{isAr ? 'نقطة' : 'points'}</div>
                <div className="flex justify-center gap-6 pt-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">🔥 {bestStreak}</div>
                    <div className="text-xs text-sky-500">{isAr ? 'أفضل سلسلة' : 'Best streak'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">✅ {Math.round(score / 12)}</div>
                    <div className="text-xs text-sky-500">{isAr ? 'إجابات صحيحة' : 'Correct'}</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={startGame}
                  className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 {isAr ? 'العب مرة أخرى' : 'Play Again'}
                </motion.button>
                <motion.button
                  onClick={() => setGameState('start')}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⚙️ {isAr ? 'تغيير المستوى' : 'Change Level'}
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
