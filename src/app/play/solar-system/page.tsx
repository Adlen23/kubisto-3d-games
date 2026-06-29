'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'

type GameState = 'start' | 'explore' | 'quiz' | 'result'

interface Planet {
  emoji: string
  nameEn: string
  nameAr: string
  color: string
  size: number
  distance: number
  factEn: string
  factAr: string
}

const PLANETS: Planet[] = [
  { emoji: '☀️', nameEn: 'Sun', nameAr: 'الشمس', color: 'bg-yellow-400', size: 60, distance: 0, factEn: 'The Sun is a star at the center of our solar system!', factAr: 'الشمس هي نجمة في مركز مجموعتنا الشمسية!' },
  { emoji: '☿️', nameEn: 'Mercury', nameAr: 'عطارد', color: 'bg-gray-400', size: 20, distance: 1, factEn: 'Mercury is the closest planet to the Sun!', factAr: 'عطارد هو أقرب كوكب إلى الشمس!' },
  { emoji: '♀️', nameEn: 'Venus', nameAr: 'الزهرة', color: 'bg-orange-300', size: 25, distance: 2, factEn: 'Venus is the hottest planet in our solar system!', factAr: 'الزهرة هو أسخن كوكب في مجموعتنا الشمسية!' },
  { emoji: '🌍', nameEn: 'Earth', nameAr: 'الأرض', color: 'bg-blue-400', size: 26, distance: 3, factEn: 'Earth is the only planet known to have life!', factAr: 'الأرض هو الكوكب الوحيد المعروف بوجود حياة عليه!' },
  { emoji: '🔴', nameEn: 'Mars', nameAr: 'المريخ', color: 'bg-red-400', size: 22, distance: 4, factEn: 'Mars is called the Red Planet!', factAr: 'المريخ يسمى الكوكب الأحمر!' },
  { emoji: '🟠', nameEn: 'Jupiter', nameAr: 'المشتري', color: 'bg-orange-400', size: 45, distance: 5, factEn: 'Jupiter is the biggest planet in our solar system!', factAr: 'المشتري هو أكبر كوكب في مجموعتنا الشمسية!' },
  { emoji: '🟡', nameEn: 'Saturn', nameAr: 'زحل', color: 'bg-yellow-500', size: 40, distance: 6, factEn: 'Saturn has beautiful rings made of ice and rock!', factAr: 'زحل له حلقات جميلة مصنوعة من الجليد والصخور!' },
  { emoji: '🔵', nameEn: 'Uranus', nameAr: 'أورانوس', color: 'bg-cyan-300', size: 32, distance: 7, factEn: 'Uranus rotates on its side!', factAr: 'أورانوس يدور على جانبه!' },
  { emoji: '🟣', nameEn: 'Neptune', nameAr: 'نبتون', color: 'bg-blue-600', size: 30, distance: 8, factEn: 'Neptune has the strongest winds in the solar system!', factAr: 'نبتون لديه أقوى الرياح في المجموعة الشمسية!' },
]

const QUIZ_QUESTIONS = [
  { questionEn: 'Which planet is closest to the Sun?', questionAr: 'أي كوكب هو الأقرب إلى الشمس؟', answer: 'Mercury', emoji: '☿️' },
  { questionEn: 'Which is the biggest planet?', questionAr: 'ما هو أكبر كوكب؟', answer: 'Jupiter', emoji: '🟠' },
  { questionEn: 'Which planet has beautiful rings?', questionAr: 'أي كوكب لديه حلقات جميلة؟', answer: 'Saturn', emoji: '🟡' },
  { questionEn: 'Which planet is known as the Red Planet?', questionAr: 'أي كوكب يُعرف بالكوكب الأحمر؟', answer: 'Mars', emoji: '🔴' },
  { questionEn: 'Which planet do we live on?', questionAr: 'على أي كوكب نعيش؟', answer: 'Earth', emoji: '🌍' },
  { questionEn: 'Which is the hottest planet?', questionAr: 'ما هو أسخن كوكب؟', answer: 'Venus', emoji: '♀️' },
  { questionEn: 'Which planet has the strongest winds?', questionAr: 'أي كوكب لديه أقوى رياح؟', answer: 'Neptune', emoji: '🟣' },
  { questionEn: 'Which planet rotates on its side?', questionAr: 'أي كوكب يدور على جانبه؟', answer: 'Uranus', emoji: '🔵' },
]

export default function SolarSystemPage() {
  const { isAr } = useLanguage()
  const [gameState, setGameState] = useState<GameState>('start')
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null)
  const [quizIndex, setQuizIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [quizOptions, setQuizOptions] = useState<Planet[]>([])

  const startExplore = useCallback(() => {
    setGameState('explore')
    setSelectedPlanet(null)
  }, [])

  const generateQuizQ = (idx: number) => {
    const q = QUIZ_QUESTIONS[idx % QUIZ_QUESTIONS.length]
    const correctPlanet = PLANETS.find(p => p.nameEn === q.answer)!
    const others = PLANETS.filter(p => p.nameEn !== q.answer).sort(() => Math.random() - 0.5).slice(0, 3)
    setQuizOptions([correctPlanet, ...others].sort(() => Math.random() - 0.5))
  }

  const startQuiz = useCallback(() => {
    setGameState('quiz')
    setQuizIndex(0)
    setScore(0)
    setFeedback(null)
    generateQuizQ(0)
  }, [])

  const handleQuizAnswer = (planet: Planet) => {
    if (feedback) return
    const q = QUIZ_QUESTIONS[quizIndex % QUIZ_QUESTIONS.length]
    const isCorrect = planet.nameEn === q.answer

    setFeedback(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 10)

    setTimeout(() => {
      setFeedback(null)
      if (quizIndex + 1 >= QUIZ_QUESTIONS.length) {
        setGameState('result')
      } else {
        setQuizIndex(i => i + 1)
        generateQuizQ(quizIndex + 1)
      }
    }, 1200)
  }

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
              🪐 {isAr ? 'استكشاف المجموعة الشمسية' : 'Solar System Explorer'}
            </h1>
          </motion.div>

          {gameState === 'start' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-32 h-32 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <p className="text-emerald-700 text-lg">{isAr ? 'اكتشف الكواكب وتعلّم معلومات مدهشة!' : 'Discover planets and learn amazing facts!'}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={startExplore}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔭 {isAr ? 'استكشف' : 'Explore'}
                </motion.button>
                <motion.button
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🧠 {isAr ? 'اختبر نفسك' : 'Quiz Mode'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState === 'explore' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Solar system */}
              <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 overflow-hidden" style={{ minHeight: '350px' }}>
                {/* Stars */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                  />
                ))}

                {/* Sun in center */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.button
                    onClick={() => setSelectedPlanet(PLANETS[0])}
                    className="text-5xl cursor-pointer"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ☀️
                  </motion.button>
                </div>

                {/* Planets */}
                {PLANETS.slice(1).map((planet, i) => {
                  const angle = (i * 40) + 20
                  const radius = 60 + i * 28
                  return (
                    <motion.button
                      key={planet.nameEn}
                      onClick={() => setSelectedPlanet(planet)}
                      className="absolute left-1/2 top-1/2 cursor-pointer"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
                      }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
                    >
                      <span className="text-2xl md:text-3xl" style={{ transform: `rotate(-${angle}deg)` }}>
                        {planet.emoji}
                      </span>
                    </motion.button>
                  )
                })}

                {/* Kopisto in space suit */}
                <div className="absolute bottom-4 right-4">
                  <motion.div
                    className="relative w-14 h-14"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
                    <div className="absolute -top-1 -right-1 text-xs">🚀</div>
                  </motion.div>
                </div>
              </div>

              {/* Planet info */}
              <AnimatePresence>
                {selectedPlanet && (
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 30, opacity: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-lg mt-4"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-5xl">{selectedPlanet.emoji}</span>
                      <div>
                        <h3 className="text-xl font-bold text-emerald-900">
                          {isAr ? selectedPlanet.nameAr : selectedPlanet.nameEn}
                        </h3>
                        <div className="text-sm text-emerald-500">
                          {isAr ? `المسافة: ${selectedPlanet.distance}` : `Distance: ${selectedPlanet.distance}`}
                        </div>
                      </div>
                    </div>
                    <p className="text-emerald-700">{isAr ? selectedPlanet.factAr : selectedPlanet.factEn}</p>
                    <button
                      onClick={() => setSelectedPlanet(null)}
                      className="mt-3 text-sm text-emerald-500 hover:text-emerald-700"
                    >
                      {isAr ? 'إغلاق ←' : 'Close →'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={startQuiz}
                className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-2xl font-bold shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                🧠 {isAr ? 'ابدأ الاختبار' : 'Start Quiz'}
              </motion.button>
            </motion.div>
          )}

          {gameState === 'quiz' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-emerald-700">{quizIndex + 1}/{QUIZ_QUESTIONS.length}</span>
                  <span className="text-sm font-bold text-orange-500">⭐ {score}</span>
                </div>
              </div>

              {/* Question */}
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6"
                key={quizIndex}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <div className="text-2xl font-bold text-emerald-900">
                  {isAr ? QUIZ_QUESTIONS[quizIndex].questionAr : QUIZ_QUESTIONS[quizIndex].questionEn}
                </div>
              </motion.div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {quizOptions.map((opt, i) => (
                  <motion.button
                    key={`${quizIndex}-${i}`}
                    onClick={() => handleQuizAnswer(opt)}
                    disabled={!!feedback}
                    className={`py-4 rounded-2xl shadow-lg transition-all flex flex-col items-center gap-2 ${
                      feedback
                        ? opt.nameEn === QUIZ_QUESTIONS[quizIndex].answer
                          ? 'bg-green-400 text-white ring-4 ring-green-300'
                          : 'bg-emerald-50 text-emerald-300'
                        : 'bg-white hover:bg-emerald-50 active:scale-95 cursor-pointer'
                    }`}
                    whileHover={!feedback ? { scale: 1.05 } : {}}
                    whileTap={!feedback ? { scale: 0.95 } : {}}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="text-sm font-bold">{isAr ? opt.nameAr : opt.nameEn}</span>
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
                    {feedback === 'correct' ? (isAr ? '✅ أحسنت!' : '✅ Correct!') : (isAr ? '❌ خطأ!' : '❌ Wrong!')}
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
                {score >= 60 ? (isAr ? '🎉 عالم فضاء!' : '🎉 Space Expert!') :
                 score >= 30 ? (isAr ? '👍 جيد!' : '👍 Good!') :
                 (isAr ? '💪 استمر!' : '💪 Keep exploring!')}
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-5xl font-bold text-emerald-600">{score}</div>
                <div className="text-emerald-500">{isAr ? 'نقطة' : 'points'}</div>
              </div>
              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 {isAr ? 'اختبار جديد' : 'New Quiz'}
                </motion.button>
                <motion.button
                  onClick={() => setGameState('start')}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔭 {isAr ? 'استكشف' : 'Explore'}
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
