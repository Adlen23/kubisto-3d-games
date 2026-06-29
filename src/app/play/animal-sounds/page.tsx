'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'

type GameState = 'start' | 'playing' | 'result'

interface Animal {
  emoji: string
  nameEn: string
  nameAr: string
  sound: string
  factEn: string
  factAr: string
}

const ANIMALS: Animal[] = [
  { emoji: '🐱', nameEn: 'Cat', nameAr: 'قطة', sound: '🐱 Meeeow!', factEn: 'Cats sleep about 16 hours a day!', factAr: 'القطط تنام حوالي 16 ساعة في اليوم!' },
  { emoji: '🐶', nameEn: 'Dog', nameAr: 'كلب', sound: '🐶 Woof Woof!', factEn: 'Dogs can smell 10,000 times better than humans!', factAr: 'الكلاب تشم أفضل من البشر بـ 10,000 مرة!' },
  { emoji: '🐮', nameEn: 'Cow', nameAr: 'بقرة', sound: '🐮 Moooo!', factEn: 'Cows have almost 360-degree vision!', factAr: 'الأبقار ترى تقريباً 360 درجة!' },
  { emoji: '🐷', nameEn: 'Pig', nameAr: 'خنزير', sound: '🐷 Oink Oink!', factEn: 'Pigs are very smart animals!', factAr: 'الخنازير حيوانات ذكية جداً!' },
  { emoji: '🐔', nameEn: 'Chicken', nameAr: 'دجاجة', sound: '🐔 Cluck Cluck!', factEn: 'Chickens can recognize over 100 faces!', factAr: 'الدجاج يمكنه التعرف على أكثر من 100 وجه!' },
  { emoji: '🐸', nameEn: 'Frog', nameAr: 'ضفدع', sound: '🐸 Ribbit Ribbit!', factEn: 'Frogs can breathe through their skin!', factAr: 'الضفادع يمكنها التنفس من خلال جلدها!' },
  { emoji: '🦁', nameEn: 'Lion', nameAr: 'أسد', sound: '🦁 Roooar!', factEn: 'A lion\'s roar can be heard from 5 miles away!', factAr: 'زئير الأسد يمكن سماعه من 5 أميال!' },
  { emoji: '🐘', nameEn: 'Elephant', nameAr: 'فيل', sound: '🐘 Paaaaw!', factEn: 'Elephants are the only animals that can\'t jump!', factAr: 'الفيلة هي الحيوانات الوحيدة التي لا تستطيع القفز!' },
  { emoji: '🐴', nameEn: 'Horse', nameAr: 'حصان', sound: '🐴 Neigh Neigh!', factEn: 'Horses can sleep standing up!', factAr: 'الخيول يمكنها النوم وهي واقفة!' },
  { emoji: '🐑', nameEn: 'Sheep', nameAr: 'خروف', sound: '🐑 Baaa Baaa!', factEn: 'Sheep have excellent memory!', factAr: 'الأغنام لديها ذاكرة ممتازة!' },
]

export default function AnimalSoundsPage() {
  const { isAr } = useLanguage()
  const [gameState, setGameState] = useState<GameState>('start')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [options, setOptions] = useState<Animal[]>([])
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showFact, setShowFact] = useState(false)
  const [shuffledAnimals, setShuffledAnimals] = useState<Animal[]>([])
  const totalQuestions = 8

  const generateOptions = (animals: Animal[], idx: number) => {
    const correct = animals[idx % animals.length]
    const others = animals.filter(a => a.emoji !== correct.emoji)
    const wrongOpts = others.sort(() => Math.random() - 0.5).slice(0, 3)
    setOptions([correct, ...wrongOpts].sort(() => Math.random() - 0.5))
  }

  const startGame = useCallback(() => {
    const shuffled = [...ANIMALS].sort(() => Math.random() - 0.5)
    setShuffledAnimals(shuffled)
    setQuestionIndex(0)
    setScore(0)
    setGameState('playing')
    setFeedback(null)
    setShowFact(false)
    generateOptions(shuffled, 0)
  }, [])

  const playSound = () => {
    const current = shuffledAnimals[questionIndex % shuffledAnimals.length]
    if (current) {
      // Visual sound effect since we can't play actual audio
      setFeedback(null)
    }
  }

  const handleAnswer = (animal: Animal) => {
    if (feedback) return
    const correct = shuffledAnimals[questionIndex % shuffledAnimals.length]

    if (animal.emoji === correct.emoji) {
      setFeedback('correct')
      setScore(s => s + 10)
      setShowFact(true)
    } else {
      setFeedback('wrong')
    }

    setTimeout(() => {
      if (feedback === 'correct' || animal.emoji === correct.emoji) {
        // Wait for fact display
        setTimeout(() => {
          setShowFact(false)
          setFeedback(null)
          if (questionIndex + 1 >= totalQuestions) {
            setGameState('result')
          } else {
            setQuestionIndex(i => i + 1)
            generateOptions(shuffledAnimals, questionIndex + 1)
          }
        }, 2000)
      } else {
        setFeedback(null)
      }
    }, 800)
  }

  const currentAnimal = shuffledAnimals[questionIndex % shuffledAnimals.length]

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
              🦁 {isAr ? 'أصوات الحيوانات' : 'Animal Sounds'}
            </h1>
          </motion.div>

          {gameState === 'start' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-32 h-32 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <p className="text-emerald-700 text-lg">{isAr ? 'استمع للصوت واختر الحيوان المناسب!' : 'Listen to the sound and pick the right animal!'}</p>
              <motion.button
                onClick={startGame}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg shadow-emerald-300/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 {isAr ? 'ابدأ اللعب!' : 'Start Playing!'}
              </motion.button>
            </motion.div>
          )}

          {gameState === 'playing' && currentAnimal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Score bar */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-emerald-700">{isAr ? 'السؤال' : 'Q'} {questionIndex + 1}/{totalQuestions}</span>
                  <span className="text-sm font-bold text-orange-500">⭐ {score}</span>
                </div>
              </div>

              {/* Kopisto */}
              <div className="flex justify-center mb-4">
                <motion.div
                  className="relative w-20 h-20"
                  animate={feedback === 'correct' ? { y: [0, -10, 0], scale: [1, 1.1, 1] } : { y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
                </motion.div>
              </div>

              {/* Sound display */}
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6"
                key={questionIndex}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <div className="text-lg text-emerald-600 mb-2">{isAr ? 'صوت الحيوان:' : 'Animal sound:'}</div>
                <motion.button
                  onClick={playSound}
                  className="text-4xl md:text-5xl p-4 bg-emerald-100 rounded-2xl cursor-pointer hover:bg-emerald-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  🔊
                </motion.button>
                <motion.div
                  className="mt-3 text-2xl font-bold text-emerald-700"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  {currentAnimal.sound}
                </motion.div>
              </motion.div>

              {/* Animal options */}
              <div className="grid grid-cols-2 gap-4">
                {options.map((opt, i) => (
                  <motion.button
                    key={`${questionIndex}-${i}`}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!feedback}
                    className={`py-5 rounded-2xl shadow-lg transition-all flex flex-col items-center gap-2 ${
                      feedback
                        ? opt.emoji === currentAnimal.emoji
                          ? 'bg-green-400 text-white ring-4 ring-green-300'
                          : 'bg-emerald-50 text-emerald-300'
                        : 'bg-white hover:bg-emerald-50 active:scale-95 cursor-pointer'
                    }`}
                    whileHover={!feedback ? { scale: 1.05 } : {}}
                    whileTap={!feedback ? { scale: 0.95 } : {}}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-4xl">{opt.emoji}</span>
                    <span className="text-sm font-bold">{isAr ? opt.nameAr : opt.nameEn}</span>
                  </motion.button>
                ))}
              </div>

              {/* Fun fact */}
              <AnimatePresence>
                {showFact && feedback === 'correct' && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="mt-4 bg-emerald-100 rounded-2xl p-4 text-center"
                  >
                    <div className="text-sm font-bold text-emerald-700 mb-1">💡 {isAr ? 'هل تعلم؟' : 'Fun Fact!'}</div>
                    <div className="text-emerald-600">{isAr ? currentAnimal.factAr : currentAnimal.factEn}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Feedback */}
              <AnimatePresence>
                {feedback && !showFact && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`text-center text-xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {feedback === 'correct'
                      ? (isAr ? '✅ أحسنت!' : '✅ Correct!')
                      : (isAr ? '❌ حاول مرة أخرى!' : '❌ Try again!')}
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
                {score >= 60 ? (isAr ? '🎉 رائع!' : '🎉 Amazing!') :
                 score >= 30 ? (isAr ? '👍 جيد!' : '👍 Good!') :
                 (isAr ? '💪 استمر!' : '💪 Keep trying!')}
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-5xl font-bold text-emerald-600">{score}</div>
                <div className="text-emerald-500">{isAr ? 'نقطة' : 'points'}</div>
              </div>
              <motion.button
                onClick={startGame}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg"
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
