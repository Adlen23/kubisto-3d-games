'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft, ArrowRight, Volume2, Star, Trophy, RefreshCw, CheckCircle2, XCircle } from 'lucide-react'

interface Word {
  ar: string
  en: string
  scrambled: string[]
  correct: string[]
  emoji: string
  hintAr: string
  hintEn: string
}

const words: Word[] = [
  { ar: 'قطة', en: 'cat', scrambled: ['ة','ط','ق'], correct: ['ق','ط','ة'], emoji: '🐱', hintAr: 'حيوان أليف صغير', hintEn: 'A small pet animal' },
  { ar: 'كلب', en: 'dog', scrambled: ['ب','ل','ك'], correct: ['ك','ل','ب'], emoji: '🐶', hintAr: 'صديق الإنسان الوفي', hintEn: 'Man\'s loyal friend' },
  { ar: 'شمس', en: 'sun', scrambled: ['س','م','ش'], correct: ['ش','م','س'], emoji: '☀️', hintAr: 'تشرق في النهار', hintEn: 'Shines during the day' },
  { ar: 'قمر', en: 'moon', scrambled: ['ر','م','ق'], correct: ['ق','م','ر'], emoji: '🌙', hintAr: 'يظهر في الليل', hintEn: 'Appears at night' },
  { ar: 'بیت', en: 'home', scrambled: ['ت','ي','ب'], correct: ['ب','ي','ت'], emoji: '🏠', hintAr: 'مسكن الإنسان', hintEn: 'Where you live' },
  { ar: 'كتاب', en: 'book', scrambled: ['ب','ا','ت','ك'], correct: ['ك','ت','ا','ب'], emoji: '📚', hintAr: 'تقرأ منه', hintEn: 'You read it' },
  { ar: 'ماء', en: 'water', scrambled: ['ء','ا','م'], correct: ['م','ا','ء'], emoji: '💧', hintAr: 'سائل شفاف', hintEn: 'A clear liquid' },
  { ar: 'شجرة', en: 'tree', scrambled: ['ة','ر','ج','ش'], correct: ['ش','ج','ر','ة'], emoji: '🌳', hintAr: 'نبات كبير', hintEn: 'A large plant' },
]

export default function SpellingBeePage() {
  const { isAr } = useLanguage()
  const [currentWord, setCurrentWord] = useState(0)
  const [arranged, setArranged] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const word = words[currentWord]

  const resetWord = useCallback(() => {
    setArranged([])
    setFeedback(null)
    setShowHint(false)
  }, [])

  const speakWord = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = isAr ? 'ar-SA' : 'en-US'
      utterance.rate = 0.7
      window.speechSynthesis.speak(utterance)
    }
  }

  const checkAnswer = () => {
    const correct = isAr ? word.correct : word.en.split('')
    if (arranged.length === 0) return

    const isCorrect = arranged.every((letter, i) => letter === correct[i])
    setAttempts(a => a + 1)

    if (isCorrect) {
      setFeedback('correct')
      setScore(s => s + 10)
      setCompleted(c => c + 1)
      setTimeout(() => {
        if (currentWord < words.length - 1) {
          setCurrentWord(w => w + 1)
          resetWord()
        } else {
          setShowResult(true)
        }
      }, 1500)
    } else {
      setFeedback('wrong')
      setTimeout(() => setFeedback(null), 1500)
    }
  }

  const nextWord = () => {
    if (currentWord < words.length - 1) {
      setCurrentWord(w => w + 1)
      resetWord()
    } else {
      setShowResult(true)
    }
  }

  const restart = () => {
    setCurrentWord(0)
    setScore(0)
    setAttempts(0)
    setCompleted(0)
    setShowResult(false)
    resetWord()
  }

  const availableLetters = (isAr ? word.scrambled : word.en.split('').sort(() => Math.random() - 0.5)).filter(
    l => !arranged.includes(l) || arranged.filter(a => a === l).length < (isAr ? word.scrambled : word.en.split('')).filter(s => s === l).length
  )

  const uniqueAvailable: string[] = []
  const tempArranged = [...arranged]
  ;(isAr ? word.scrambled : word.en.split('')).forEach(letter => {
    const usedCount = tempArranged.filter(l => l === letter).length
    if (usedCount < (isAr ? word.scrambled : word.en.split('')).filter(l => l === letter).length) {
      if (!uniqueAvailable.includes(letter) || uniqueAvailable.filter(l => l === letter).length < (isAr ? word.scrambled : word.en.split('')).filter(l => l === letter).length - usedCount) {
        const availableCount = (isAr ? word.scrambled : word.en.split('')).filter(l => l === letter).length
        const usedInAvailable = uniqueAvailable.filter(l => l === letter).length
        if (usedCount + usedInAvailable < availableCount) {
          uniqueAvailable.push(letter)
        }
      }
    }
  })

  if (showResult) {
    const stars = completed >= 7 ? 3 : completed >= 5 ? 2 : 1
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-50" dir={isAr ? 'rtl' : 'ltr'}>
        <Navbar />
        <main className="flex-1 pt-20 px-4 flex items-center justify-center">
          <motion.div
            className="bg-white rounded-3xl p-8 text-center max-w-md w-full shadow-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <motion.div className="text-7xl mb-4" animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 1, repeat: Infinity }}>🎉</motion.div>
            <h2 className="text-2xl font-bold text-amber-900 mb-2">{isAr ? 'أحسنت! انتهيت!' : 'Great job! You finished!'}</h2>
            <p className="text-amber-600 mb-4">{isAr ? `لقد أكملت ${completed} كلمات صحيحة من ${words.length}` : `You spelled ${completed} words correctly out of ${words.length}`}</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map(i => (
                <motion.span key={i} className="text-4xl" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.2 }}>
                  {i <= stars ? '⭐' : '☆'}
                </motion.span>
              ))}
            </div>
            <div className="bg-amber-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-amber-700">{isAr ? 'النقاط' : 'Score'}</span>
                <span className="font-bold text-amber-900">{score}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-amber-700">{isAr ? 'المحاولات' : 'Attempts'}</span>
                <span className="font-bold text-amber-900">{attempts}</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={restart} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold">
                <RefreshCw className="w-4 h-4" /> {isAr ? 'العب مرة أخرى' : 'Play Again'}
              </button>
              <Link href="/games" className="flex items-center gap-2 px-5 py-3 bg-amber-100 text-amber-700 rounded-xl font-bold">
                {isAr ? 'ألعاب أخرى' : 'More Games'}
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-50" dir={isAr ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-1 pt-20 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/games" className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-semibold text-sm bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {isAr ? 'الألعاب' : 'Games'}
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span className="font-bold text-amber-900 text-sm">{score}</span>
              </div>
              <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-1">
                <span className="text-xs text-amber-500">{isAr ? 'كلمة' : 'Word'}</span>
                <span className="font-bold text-amber-900 text-sm">{currentWord + 1}/{words.length}</span>
              </div>
            </div>
          </div>

          {/* Game Card */}
          <motion.div
            key={currentWord}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-amber-100"
          >
            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-2">🐝 {isAr ? 'لعبة الإملاء' : 'Spelling Bee'}</h1>
              <p className="text-amber-600 text-sm">{isAr ? 'استمع للكلمة ورتّب الحروف بالترتيب الصحيح' : 'Listen and arrange the letters in the correct order'}</p>
            </div>

            {/* Emoji + Speak */}
            <div className="flex flex-col items-center mb-6">
              <motion.div className="text-8xl mb-3" whileHover={{ scale: 1.1 }}>{word.emoji}</motion.div>
              <button
                onClick={() => speakWord(isAr ? word.ar : word.en)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Volume2 className="w-5 h-5" />
                {isAr ? 'استمع للكلمة' : 'Listen'}
              </button>
            </div>

            {/* Arranged letters */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 flex-wrap min-h-[60px] p-4 bg-amber-50 rounded-2xl border-2 border-dashed border-amber-200">
                <AnimatePresence mode="popLayout">
                  {arranged.length === 0 ? (
                    <p className="text-amber-400 text-sm">{isAr ? 'اضغط على الحروف بالترتيب الصحيح' : 'Tap letters in the correct order'}</p>
                  ) : (
                    arranged.map((letter, i) => (
                      <motion.button
                        key={`${letter}-${i}`}
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: -20 }}
                        onClick={() => setArranged(arranged.filter((_, idx) => idx !== i))}
                        className="w-12 h-12 rounded-xl bg-white border-2 border-amber-300 flex items-center justify-center text-2xl font-bold text-amber-900 shadow-md hover:bg-amber-50"
                      >
                        {letter}
                      </motion.button>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Available letters */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
              {(isAr ? word.scrambled : word.en.split('').sort(() => Math.random() - 0.5)).map((letter, i) => {
                const usedCount = arranged.filter(l => l === letter).length
                const totalCount = (isAr ? word.scrambled : word.en.split('')).filter(l => l === letter).length
                const isUsed = usedCount >= totalCount
                return (
                  <motion.button
                    key={`${letter}-${i}`}
                    whileHover={!isUsed ? { scale: 1.1, y: -3 } : {}}
                    whileTap={!isUsed ? { scale: 0.95 } : {}}
                    onClick={() => !isUsed && setArranged([...arranged, letter])}
                    disabled={isUsed}
                    className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold shadow-md transition-all ${
                      isUsed ? 'bg-gray-100 border-gray-200 text-gray-300' : 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300 text-white hover:shadow-lg'
                    }`}
                  >
                    {letter}
                  </motion.button>
                )
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-center mb-4 p-3 rounded-xl font-bold ${
                    feedback === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {feedback === 'correct' ? (
                    <span className="flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" /> {isAr ? 'إجابة صحيحة! 🎉' : 'Correct! 🎉'}</span>
                  ) : (
                    <span className="flex items-center justify-center gap-2"><XCircle className="w-5 h-5" /> {isAr ? 'حاول مرة أخرى!' : 'Try again!'}</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint */}
            {showHint && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-sky-50 rounded-xl p-3 text-center mb-4">
                <p className="text-sky-700 text-sm">💡 {isAr ? word.hintAr : word.hintEn}</p>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2 bg-sky-100 text-sky-700 rounded-xl font-semibold text-sm hover:bg-sky-200"
              >
                💡 {isAr ? 'تلميح' : 'Hint'}
              </button>
              <button
                onClick={checkAnswer}
                disabled={arranged.length === 0}
                className={`px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                  arranged.length === 0 ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> {isAr ? 'تحقق' : 'Check'}
              </button>
              <button
                onClick={nextWord}
                className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-semibold text-sm hover:bg-amber-200"
              >
                {isAr ? 'تخطّي' : 'Skip'} →
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
