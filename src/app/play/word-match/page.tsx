'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'

type GameState = 'start' | 'playing' | 'result'

interface Card {
  id: number
  type: 'picture' | 'word'
  emoji: string
  wordEn: string
  wordAr: string
  pairId: number
  flipped: boolean
  matched: boolean
}

const ITEMS = [
  { emoji: '🐱', wordEn: 'Cat', wordAr: 'قطة' },
  { emoji: '🐶', wordEn: 'Dog', wordAr: 'كلب' },
  { emoji: '🍎', wordEn: 'Apple', wordAr: 'تفاحة' },
  { emoji: '🌻', wordEn: 'Sun', wordAr: 'شمس' },
  { emoji: '🌙', wordEn: 'Moon', wordAr: 'قمر' },
  { emoji: '🏠', wordEn: 'House', wordAr: 'بيت' },
  { emoji: '🐟', wordEn: 'Fish', wordAr: 'سمكة' },
  { emoji: '🌳', wordEn: 'Tree', wordAr: 'شجرة' },
]

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function WordMatchPage() {
  const { isAr } = useLanguage()
  const [gameState, setGameState] = useState<GameState>('start')
  const [cards, setCards] = useState<Card[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [matches, setMatches] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const totalPairs = 6

  const startGame = useCallback(() => {
    const items = shuffleArray(ITEMS).slice(0, totalPairs)
    const newCards: Card[] = []
    items.forEach((item, i) => {
      newCards.push({
        id: i * 2,
        type: 'picture',
        emoji: item.emoji,
        wordEn: item.wordEn,
        wordAr: item.wordAr,
        pairId: i,
        flipped: false,
        matched: false,
      })
      newCards.push({
        id: i * 2 + 1,
        type: 'word',
        emoji: item.emoji,
        wordEn: item.wordEn,
        wordAr: item.wordAr,
        pairId: i,
        flipped: false,
        matched: false,
      })
    })
    setCards(shuffleArray(newCards))
    setSelected(null)
    setScore(0)
    setMatches(0)
    setAttempts(0)
    setGameState('playing')
    setFeedback(null)
  }, [])

  const handleCardClick = (cardId: number) => {
    if (feedback) return
    const card = cards.find(c => c.id === cardId)
    if (!card || card.matched || card.flipped) return

    const newCards = cards.map(c => c.id === cardId ? { ...c, flipped: true } : c)
    setCards(newCards)

    if (selected === null) {
      setSelected(cardId)
    } else {
      const firstCard = newCards.find(c => c.id === selected)!
      setAttempts(a => a + 1)

      if (firstCard.pairId === card.pairId && firstCard.type !== card.type) {
        // Match!
        setFeedback('correct')
        setScore(s => s + 10)
        setMatches(m => m + 1)
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.pairId === firstCard.pairId ? { ...c, matched: true } : c
          ))
          setSelected(null)
          setFeedback(null)
          if (matches + 1 >= totalPairs) {
            setTimeout(() => setGameState('result'), 500)
          }
        }, 800)
      } else {
        // No match
        setFeedback('wrong')
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === selected || c.id === cardId ? { ...c, flipped: false } : c
          ))
          setSelected(null)
          setFeedback(null)
        }, 800)
      }
    }
  }

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
              🃏 {isAr ? 'طابق الكلمة والصورة' : 'Word-Picture Match'}
            </h1>
          </motion.div>

          {gameState === 'start' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-32 h-32 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <p className="text-amber-700 text-lg">{isAr ? 'طابق كل صورة مع الكلمة المناسبة!' : 'Match each picture with its word!'}</p>
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

          {gameState === 'playing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Score bar */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-amber-700">{isAr ? 'الأزواج' : 'Pairs'} {matches}/{totalPairs}</span>
                  <span className="text-sm font-bold text-orange-500">⭐ {score}</span>
                </div>
                <span className="text-sm text-amber-500">{isAr ? 'محاولات' : 'Tries'}: {attempts}</span>
              </div>

              {/* Kopisto */}
              <div className="flex justify-center mb-4">
                <motion.div
                  className="relative w-16 h-16"
                  animate={feedback === 'correct' ? { y: [0, -10, 0], scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
                </motion.div>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {cards.map((card) => (
                  <motion.button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`aspect-square rounded-2xl text-center shadow-lg transition-all flex flex-col items-center justify-center p-2 ${
                      card.matched
                        ? 'bg-green-100 border-2 border-green-300'
                        : card.flipped
                        ? 'bg-white border-2 border-amber-300'
                        : 'bg-gradient-to-br from-amber-200 to-amber-300 hover:from-amber-300 hover:to-amber-400 cursor-pointer'
                    }`}
                    whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : {}}
                    whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
                    layout
                  >
                    {card.matched ? (
                      <div>
                        <div className="text-3xl mb-1">{card.emoji}</div>
                        <div className="text-xs font-bold text-green-700">{isAr ? card.wordAr : card.wordEn}</div>
                      </div>
                    ) : card.flipped ? (
                      card.type === 'picture' ? (
                        <div className="text-4xl">{card.emoji}</div>
                      ) : (
                        <div className="text-sm md:text-base font-bold text-amber-800">
                          {isAr ? card.wordAr : card.wordEn}
                        </div>
                      )
                    ) : (
                      <div className="text-3xl">❓</div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`text-center text-xl font-bold mt-4 ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {feedback === 'correct'
                      ? (isAr ? '✅ تطابق!' : '✅ Match!')
                      : (isAr ? '❌ حاول مرة أخرى' : '❌ Try again')}
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
              <h2 className="text-3xl font-bold text-amber-900">
                🎉 {isAr ? 'أحسنت! أنهيت اللعبة!' : 'Great job! You finished!'}
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-5xl font-bold text-amber-600">{score}</div>
                <div className="text-amber-500">{isAr ? 'نقطة' : 'points'}</div>
                <div className="mt-2 text-sm text-amber-400">
                  {attempts} {isAr ? 'محاولة' : 'attempts'}
                </div>
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
