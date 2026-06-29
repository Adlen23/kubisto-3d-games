'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'

type GameState = 'start' | 'playing' | 'result'

const ARABIC_LETTERS = [
  { letter: 'أ', name: 'Alif', pos: 1 },
  { letter: 'ب', name: 'Ba', pos: 2 },
  { letter: 'ت', name: 'Ta', pos: 3 },
  { letter: 'ث', name: 'Tha', pos: 4 },
  { letter: 'ج', name: 'Jim', pos: 5 },
  { letter: 'ح', name: 'Ha', pos: 6 },
  { letter: 'خ', name: 'Kha', pos: 7 },
  { letter: 'د', name: 'Dal', pos: 8 },
  { letter: 'ذ', name: 'Dhal', pos: 9 },
  { letter: 'ر', name: 'Ra', pos: 10 },
  { letter: 'ز', name: 'Zay', pos: 11 },
  { letter: 'س', name: 'Sin', pos: 12 },
  { letter: 'ش', name: 'Shin', pos: 13 },
  { letter: 'ص', name: 'Sad', pos: 14 },
  { letter: 'ض', name: 'Dad', pos: 15 },
  { letter: 'ط', name: 'Tta', pos: 16 },
  { letter: 'ظ', name: 'Ttha', pos: 17 },
  { letter: 'ع', name: 'Ain', pos: 18 },
  { letter: 'غ', name: 'Ghain', pos: 19 },
  { letter: 'ف', name: 'Fa', pos: 20 },
  { letter: 'ق', name: 'Qaf', pos: 21 },
  { letter: 'ك', name: 'Kaf', pos: 22 },
  { letter: 'ل', name: 'Lam', pos: 23 },
  { letter: 'م', name: 'Mim', pos: 24 },
  { letter: 'ن', name: 'Nun', pos: 25 },
  { letter: 'ه', name: 'Ha2', pos: 26 },
  { letter: 'و', name: 'Waw', pos: 27 },
  { letter: 'ي', name: 'Ya', pos: 28 },
]

export default function ArabicAlphabetPage() {
  const { isAr } = useLanguage()
  const [gameState, setGameState] = useState<GameState>('start')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [options, setOptions] = useState<typeof ARABIC_LETTERS>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn')
  const [totalQ, setTotalQ] = useState(0)
  const [correctQ, setCorrectQ] = useState(0)

  const lettersPerRound = 10

  const startLearn = useCallback(() => {
    setMode('learn')
    setCurrentIndex(0)
    setScore(0)
    setGameState('playing')
    setFeedback(null)
    setTotalQ(0)
    setCorrectQ(0)
  }, [])

  const generateQuestion = (idx: number) => {
    const correct = ARABIC_LETTERS[idx % ARABIC_LETTERS.length]
    const others = ARABIC_LETTERS.filter(l => l.letter !== correct.letter)
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3)
    const allOptions = [correct, ...shuffled].sort(() => Math.random() - 0.5)
    setOptions(allOptions)
  }

  const startQuiz = useCallback(() => {
    setMode('quiz')
    setCurrentIndex(0)
    setScore(0)
    setGameState('playing')
    setFeedback(null)
    setTotalQ(0)
    setCorrectQ(0)
    generateQuestion(0)
  }, [])

  const handleQuizAnswer = (letter: typeof ARABIC_LETTERS[0]) => {
    if (feedback) return
    const correct = ARABIC_LETTERS[currentIndex % ARABIC_LETTERS.length]
    setTotalQ(q => q + 1)

    if (letter.letter === correct.letter) {
      setFeedback('correct')
      setScore(s => s + 10)
      setCorrectQ(q => q + 1)
    } else {
      setFeedback('wrong')
    }

    setTimeout(() => {
      setFeedback(null)
      if (currentIndex + 1 >= lettersPerRound) {
        setGameState('result')
      } else {
        setCurrentIndex(i => i + 1)
        generateQuestion(currentIndex + 1)
      }
    }, 1200)
  }

  const handleLearnNext = () => {
    if (currentIndex + 1 >= lettersPerRound) {
      setGameState('result')
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  const currentLetter = ARABIC_LETTERS[currentIndex % ARABIC_LETTERS.length]

  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <Navbar />
      <main className="flex-1 pt-20 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/games" className="inline-flex items-center gap-1 text-amber-500 hover:text-amber-700 text-sm mb-3 transition-colors">
              <span>{isAr ? '→' : '←'}</span> {isAr ? 'العودة للألعاب' : 'Back to Games'}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-900">
              📝 {isAr ? 'تعلّم الحروف العربية' : 'Arabic Alphabet'}
            </h1>
          </motion.div>

          {gameState === 'start' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-32 h-32 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <p className="text-amber-700 text-lg">{isAr ? 'تعلّم الحروف العربية بطريقة ممتعة!' : 'Learn Arabic letters in a fun way!'}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={startLearn}
                  className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📖 {isAr ? 'تعلّم' : 'Learn'}
                </motion.button>
                <motion.button
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🧠 {isAr ? 'اختبر نفسك' : 'Quiz Mode'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Score bar */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-amber-700">
                    {currentIndex + 1}/{lettersPerRound}
                  </span>
                  <span className="text-sm font-bold text-orange-500">⭐ {score}</span>
                </div>
                <div className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-bold">
                  {mode === 'learn' ? (isAr ? 'تعلّم' : 'Learn') : (isAr ? 'اختبار' : 'Quiz')}
                </div>
              </div>

              {/* Kopisto */}
              <div className="flex justify-center mb-4">
                <motion.div
                  className="relative w-20 h-20"
                  animate={feedback === 'correct' ? { y: [0, -10, 0] } : { y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
                </motion.div>
              </div>

              {/* Letter display */}
              <motion.div
                className="bg-white rounded-3xl p-8 shadow-lg text-center mb-6"
                key={currentIndex}
                initial={{ scale: 0.8, rotateY: 90 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ type: 'spring', stiffness: 150 }}
              >
                <motion.div
                  className="text-8xl md:text-9xl font-bold text-amber-800 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  {currentLetter.letter}
                </motion.div>
                <div className="text-lg text-amber-500">{currentLetter.name}</div>
                <div className="text-sm text-amber-400 mt-1">
                  {isAr ? `الحرف رقم ${currentLetter.pos}` : `Letter #${currentLetter.pos}`}
                </div>

                {/* Animated writing guide dots */}
                <div className="mt-4 flex justify-center">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <motion.circle
                      cx="40" cy="40" r="35"
                      fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 4"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                  </svg>
                </div>
              </motion.div>

              {mode === 'learn' ? (
                <motion.button
                  onClick={handleLearnNext}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentIndex + 1 >= lettersPerRound
                    ? (isAr ? '🏆 إنهاء' : '🏆 Finish')
                    : (isAr ? 'التالي ←' : 'Next →')}
                </motion.button>
              ) : (
                <>
                  <p className="text-center text-amber-600 mb-3 font-bold">
                    {isAr ? 'اختر الحرف الصحيح:' : 'Pick the correct letter:'}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {options.map((opt, i) => (
                      <motion.button
                        key={i}
                        onClick={() => handleQuizAnswer(opt)}
                        disabled={!!feedback}
                        className={`py-4 rounded-2xl text-4xl font-bold shadow-lg transition-all ${
                          feedback
                            ? opt.letter === currentLetter.letter
                              ? 'bg-green-400 text-white ring-4 ring-green-300'
                              : 'bg-amber-100 text-amber-300'
                            : 'bg-white text-amber-800 hover:bg-amber-100 active:scale-95'
                        }`}
                        whileHover={!feedback ? { scale: 1.05 } : {}}
                        whileTap={!feedback ? { scale: 0.95 } : {}}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {opt.letter}
                      </motion.button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {feedback && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className={`text-center text-xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {feedback === 'correct'
                          ? (isAr ? '✅ أحسنت!' : '✅ Correct!')
                          : (isAr ? `❌ الحرف الصحيح: ${currentLetter.letter}` : `❌ Correct: ${currentLetter.letter}`)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-28 h-28 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <h2 className="text-3xl font-bold text-amber-900">
                {mode === 'learn'
                  ? (isAr ? '🎉 أحسنت! أنهيت التعلم!' : '🎉 Great job learning!')
                  : score >= 70 ? (isAr ? '🎉 رائع!' : '🎉 Amazing!') :
                    score >= 40 ? (isAr ? '👍 جيد!' : '👍 Good!') :
                    (isAr ? '💪 استمر!' : '💪 Keep practicing!')}
              </h2>
              {mode === 'quiz' && (
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-5xl font-bold text-amber-600">{score}</div>
                  <div className="text-amber-500">{isAr ? 'نقطة' : 'points'}</div>
                  <div className="mt-2 text-sm text-amber-400">
                    {correctQ}/{totalQ} {isAr ? 'إجابات صحيحة' : 'correct'}
                  </div>
                </div>
              )}
              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🧠 {isAr ? 'اختبر نفسك' : 'Take Quiz'}
                </motion.button>
                <motion.button
                  onClick={() => setGameState('start')}
                  className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 {isAr ? 'ابدأ من جديد' : 'Restart'}
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
