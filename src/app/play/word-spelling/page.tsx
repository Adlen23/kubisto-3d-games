'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'

type GameState = 'start' | 'playing' | 'result'

interface WordItem {
  emoji: string
  en: string
  ar: string
  letters: string[]
}

const WORDS: WordItem[] = [
  { emoji: '🐱', en: 'cat', ar: 'قطة', letters: ['c', 'a', 't'] },
  { emoji: '🐶', en: 'dog', ar: 'كلب', letters: ['d', 'o', 'g'] },
  { emoji: '🍎', en: 'apple', ar: 'تفاحة', letters: ['a', 'p', 'p', 'l', 'e'] },
  { emoji: '⭐', en: 'star', ar: 'نجمة', letters: ['s', 't', 'a', 'r'] },
  { emoji: '🌙', en: 'moon', ar: 'قمر', letters: ['m', 'o', 'o', 'n'] },
  { emoji: '🌻', en: 'sun', ar: 'شمس', letters: ['s', 'u', 'n'] },
  { emoji: '🏠', en: 'house', ar: 'بيت', letters: ['h', 'o', 'u', 's', 'e'] },
  { emoji: '🐟', en: 'fish', ar: 'سمكة', letters: ['f', 'i', 's', 'h'] },
  { emoji: '🌳', en: 'tree', ar: 'شجرة', letters: ['t', 'r', 'e', 'e'] },
  { emoji: '📚', en: 'book', ar: 'كتاب', letters: ['b', 'o', 'o', 'k'] },
]

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function WordSpellingPage() {
  const { isAr } = useLanguage()
  const [gameState, setGameState] = useState<GameState>('start')
  const [wordIndex, setWordIndex] = useState(0)
  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>([])
  const [availableLetters, setAvailableLetters] = useState<{ letter: string; id: number }[]>([])
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [totalWords] = useState(8)
  const [usedWords, setUsedWords] = useState<WordItem[]>([])

  const setupWord = useCallback((word: WordItem) => {
    setPlacedLetters(Array(word.letters.length).fill(null))
    const shuffled = shuffleArray(word.letters.map((l, i) => ({ letter: l, id: i })))
    setAvailableLetters(shuffled)
    setFeedback(null)
  }, [])

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(WORDS).slice(0, totalWords)
    setUsedWords(shuffled)
    setWordIndex(0)
    setScore(0)
    setGameState('playing')
    setupWord(shuffled[0])
  }, [setupWord, totalWords])

  const handleLetterClick = (letterId: number) => {
    if (feedback) return
    const letterObj = availableLetters.find(l => l.id === letterId)
    if (!letterObj) return

    const currentWord = usedWords[wordIndex]
    if (!currentWord) return

    // Find next empty slot
    const nextSlot = placedLetters.findIndex(l => l === null)
    if (nextSlot === -1) return

    const newPlaced = [...placedLetters]
    newPlaced[nextSlot] = letterObj.letter
    setPlacedLetters(newPlaced)
    setAvailableLetters(prev => prev.filter(l => l.id !== letterId))

    // Check if word is complete
    if (newPlaced.every(l => l !== null)) {
      const spelled = newPlaced.join('')
      if (spelled === currentWord.letters.join('')) {
        setFeedback('correct')
        setScore(s => s + 10)
        setTimeout(() => {
          if (wordIndex + 1 >= totalWords) {
            setGameState('result')
          } else {
            setWordIndex(i => i + 1)
            setupWord(usedWords[wordIndex + 1])
          }
        }, 1200)
      } else {
        setFeedback('wrong')
        setTimeout(() => {
          setupWord(currentWord)
        }, 1000)
      }
    }
  }

  const handleSlotClick = (slotIndex: number) => {
    if (feedback) return
    const letter = placedLetters[slotIndex]
    if (letter === null) return

    // Return letter to available
    setAvailableLetters(prev => [...prev, { letter, id: Date.now() + slotIndex }])
    const newPlaced = [...placedLetters]
    newPlaced[slotIndex] = null
    setPlacedLetters(newPlaced)
  }

  const currentWord = usedWords[wordIndex]

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
              ✏️ {isAr ? 'تهجئة الكلمات' : 'Word Spelling'}
            </h1>
          </motion.div>

          {gameState === 'start' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-32 h-32 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <p className="text-amber-700 text-lg">{isAr ? 'رتّب الحروف لتكوين الكلمة الصحيحة!' : 'Arrange the letters to spell the word correctly!'}</p>
              <motion.button
                onClick={startGame}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg shadow-amber-300/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 {isAr ? 'ابدأ اللعب!' : 'Start Playing!'}
              </motion.button>
            </motion.div>
          )}

          {gameState === 'playing' && currentWord && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Score bar */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-amber-700">{isAr ? 'الكلمة' : 'Word'} {wordIndex + 1}/{totalWords}</span>
                  <span className="text-sm font-bold text-orange-500">⭐ {score}</span>
                </div>
              </div>

              {/* Kopisto */}
              <div className="flex justify-center mb-4">
                <motion.div
                  className="relative w-20 h-20"
                  animate={feedback === 'correct' ? { y: [0, -10, 0], scale: [1, 1.1, 1] } : { y: [0, -3, 0] }}
                  transition={{ duration: feedback === 'correct' ? 0.5 : 2, repeat: Infinity }}
                >
                  <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
                </motion.div>
              </div>

              {/* Word display */}
              <motion.div
                className="bg-white rounded-3xl p-6 shadow-lg text-center mb-6"
                key={wordIndex}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                <div className="text-6xl mb-3">{currentWord.emoji}</div>
                <div className="text-lg text-amber-600">{isAr ? currentWord.ar : currentWord.en}</div>
              </motion.div>

              {/* Letter slots */}
              <div className="flex justify-center gap-2 mb-6 flex-wrap">
                {placedLetters.map((letter, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleSlotClick(i)}
                    className={`w-12 h-14 md:w-14 md:h-16 rounded-xl text-2xl font-bold shadow-md flex items-center justify-center transition-colors ${
                      letter
                        ? 'bg-amber-400 text-white cursor-pointer hover:bg-amber-500'
                        : 'bg-amber-100 border-2 border-dashed border-amber-300 text-amber-300'
                    }`}
                    whileHover={letter ? { scale: 1.1 } : {}}
                    whileTap={letter ? { scale: 0.9 } : {}}
                    layout
                  >
                    {letter ? letter.toUpperCase() : '_'}
                  </motion.button>
                ))}
              </div>

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
                      ? (isAr ? '✅ ممتاز!' : '✅ Perfect!')
                      : (isAr ? '❌ حاول مرة أخرى!' : '❌ Try again!')}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Available letters */}
              <div className="flex justify-center gap-2 flex-wrap">
                {availableLetters.map((l) => (
                  <motion.button
                    key={l.id}
                    onClick={() => handleLetterClick(l.id)}
                    className="w-12 h-14 md:w-14 md:h-16 bg-gradient-to-b from-amber-200 to-amber-300 rounded-xl text-2xl font-bold text-amber-800 shadow-lg hover:shadow-xl transition-shadow active:scale-95 cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    layout
                  >
                    {l.letter.toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-28 h-28 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <h2 className="text-3xl font-bold text-amber-900">
                {score >= 60 ? (isAr ? '🎉 رائع!' : '🎉 Amazing!') :
                 score >= 30 ? (isAr ? '👍 جيد!' : '👍 Good!') :
                 (isAr ? '💪 استمر!' : '💪 Keep trying!')}
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-5xl font-bold text-amber-600">{score}</div>
                <div className="text-amber-500">{isAr ? 'نقطة' : 'points'}</div>
              </div>
              <motion.button
                onClick={startGame}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg"
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
