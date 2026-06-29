'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'

type GameState = 'start' | 'playing' | 'result'
type PlayMode = 'free' | 'follow'

interface Note {
  key: string
  label: string
  color: string
  freq: number
}

const NOTES: Note[] = [
  { key: 'C', label: 'Do', color: 'bg-red-400 hover:bg-red-500', freq: 261.63 },
  { key: 'D', label: 'Re', color: 'bg-orange-400 hover:bg-orange-500', freq: 293.66 },
  { key: 'E', label: 'Mi', color: 'bg-yellow-400 hover:bg-yellow-500', freq: 329.63 },
  { key: 'F', label: 'Fa', color: 'bg-green-400 hover:bg-green-500', freq: 349.23 },
  { key: 'G', label: 'Sol', color: 'bg-teal-400 hover:bg-teal-500', freq: 392.00 },
  { key: 'A', label: 'La', color: 'bg-blue-400 hover:bg-blue-500', freq: 440.00 },
  { key: 'B', label: 'Si', color: 'bg-purple-400 hover:bg-purple-500', freq: 493.88 },
  { key: 'C2', label: 'Do', color: 'bg-pink-400 hover:bg-pink-500', freq: 523.25 },
]

const MELODIES: { nameEn: string; nameAr: string; notes: string[] }[] = [
  { nameEn: 'Twinkle Star', nameAr: 'نجمة لامعة', notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G'] },
  { nameEn: 'Happy Tune', nameAr: 'لحن سعيد', notes: ['C', 'D', 'E', 'C', 'C', 'D', 'E', 'C'] },
  { nameEn: 'Simple Song', nameAr: 'أغنية بسيطة', notes: ['E', 'E', 'F', 'G', 'G', 'F', 'E'] },
  { nameEn: 'Up and Down', nameAr: 'صعود وهبوط', notes: ['C', 'D', 'E', 'F', 'G', 'F', 'E', 'D', 'C'] },
]

export default function MusicPianoPage() {
  const { isAr } = useLanguage()
  const [gameState, setGameState] = useState<GameState>('start')
  const [playMode, setPlayMode] = useState<PlayMode>('free')
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [melodyIndex, setMelodyIndex] = useState(0)
  const [noteIndex, setNoteIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [playedNotes, setPlayedNotes] = useState<string[]>([])
  const [highlightedKey, setHighlightedKey] = useState<string | null>(null)
  const [showingMelody, setShowingMelody] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    return audioCtxRef.current
  }, [])

  const playNote = useCallback((noteKey: string) => {
    const note = NOTES.find(n => n.key === noteKey)
    if (!note) return

    const ctx = getAudioCtx()
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    oscillator.frequency.value = note.freq
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.5)

    setActiveKey(noteKey)
    setTimeout(() => setActiveKey(null), 200)
  }, [getAudioCtx])

  const startFree = useCallback(() => {
    setPlayMode('free')
    setGameState('playing')
    setPlayedNotes([])
  }, [])

  const showMelodySequence = (mIdx: number) => {
    const melody = MELODIES[mIdx % MELODIES.length]
    setShowingMelody(true)
    melody.notes.forEach((n, i) => {
      setTimeout(() => {
        setHighlightedKey(n)
        playNote(n)
        setTimeout(() => setHighlightedKey(null), 400)
        if (i === melody.notes.length - 1) {
          setTimeout(() => setShowingMelody(false), 500)
        }
      }, i * 600)
    })
  }

  const startFollow = useCallback(() => {
    setPlayMode('follow')
    setMelodyIndex(0)
    setNoteIndex(0)
    setScore(0)
    setGameState('playing')
    setFeedback(null)
    setPlayedNotes([])
    showMelodySequence(0)
  }, [])

  const handleKeyClick = (noteKey: string) => {
    if (showingMelody) return
    playNote(noteKey)

    if (playMode === 'free') {
      setPlayedNotes(prev => [...prev, noteKey])
    } else {
      const melody = MELODIES[melodyIndex % MELODIES.length]
      const expected = melody.notes[noteIndex]

      if (noteKey === expected) {
        setFeedback('correct')
        setScore(s => s + 10)
        setNoteIndex(i => i + 1)

        if (noteIndex + 1 >= melody.notes.length) {
          setTimeout(() => {
            if (melodyIndex + 1 >= MELODIES.length) {
              setGameState('result')
            } else {
              setMelodyIndex(m => m + 1)
              setNoteIndex(0)
              showMelodySequence(melodyIndex + 1)
            }
          }, 800)
        }
      } else {
        setFeedback('wrong')
      }

      setTimeout(() => setFeedback(null), 600)
    }
  }

  const currentMelody = MELODIES[melodyIndex % MELODIES.length]

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
              🎹 {isAr ? 'موسيقى البيانو' : 'Music Piano'}
            </h1>
          </motion.div>

          {gameState === 'start' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-32 h-32 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <p className="text-orange-700 text-lg">{isAr ? 'اعزف ألحاناً جميلة مع كوبيستو!' : 'Play beautiful melodies with Kopisto!'}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={startFree}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎵 {isAr ? 'عزف حر' : 'Free Play'}
                </motion.button>
                <motion.button
                  onClick={startFollow}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎼 {isAr ? 'اتبع اللحن' : 'Follow Along'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Score bar for follow mode */}
              {playMode === 'follow' && (
                <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-orange-700">
                      {isAr ? currentMelody.nameAr : currentMelody.nameEn}
                    </span>
                    <span className="text-sm font-bold text-amber-500">⭐ {score}</span>
                  </div>
                  <div className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-bold">
                    {noteIndex}/{currentMelody.notes.length}
                  </div>
                </div>
              )}

              {/* Kopisto */}
              <div className="flex justify-center mb-4">
                <motion.div
                  className="relative w-20 h-20"
                  animate={activeKey ? { y: [0, -8, 0], rotate: [0, -5, 5, 0] } : { y: [0, -3, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
                  <div className="absolute -top-1 -right-1 text-sm">🎵</div>
                </motion.div>
              </div>

              {/* Follow mode: melody display */}
              {playMode === 'follow' && (
                <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                  <div className="flex justify-center gap-1 flex-wrap">
                    {currentMelody.notes.map((n, i) => {
                      const note = NOTES.find(nn => nn.key === n)
                      return (
                        <motion.div
                          key={i}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            i < noteIndex
                              ? 'bg-green-200 text-green-700'
                              : i === noteIndex
                              ? 'bg-orange-200 text-orange-700 ring-2 ring-orange-400'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                          animate={i === noteIndex && !showingMelody ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          {note?.label}
                        </motion.div>
                      )
                    })}
                  </div>
                  {showingMelody && (
                    <div className="text-center text-sm text-orange-500 mt-2 font-bold">
                      {isAr ? '👆 شاهد اللحن...' : '👆 Watch the melody...'}
                    </div>
                  )}
                </div>
              )}

              {/* Free mode: played notes */}
              {playMode === 'free' && playedNotes.length > 0 && (
                <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                  <div className="flex justify-center gap-1 flex-wrap">
                    {playedNotes.slice(-16).map((n, i) => {
                      const note = NOTES.find(nn => nn.key === n)
                      return (
                        <div
                          key={i}
                          className={`w-7 h-7 rounded-lg ${note?.color || 'bg-gray-200'} flex items-center justify-center text-xs font-bold text-white`}
                        >
                          {note?.label}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`text-center text-lg font-bold mb-3 ${feedback === 'correct' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {feedback === 'correct' ? '✅' : '❌'}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Piano keys */}
              <div className="bg-white rounded-3xl p-4 shadow-lg">
                <div className="flex gap-1 md:gap-2 justify-center">
                  {NOTES.map((note) => (
                    <motion.button
                      key={note.key}
                      onClick={() => handleKeyClick(note.key)}
                      className={`flex-1 h-28 md:h-36 rounded-xl md:rounded-2xl ${note.color} flex flex-col items-center justify-center text-white font-bold shadow-lg transition-all active:scale-95 relative overflow-hidden ${
                        activeKey === note.key ? 'scale-95 brightness-110' : ''
                      } ${highlightedKey === note.key ? 'ring-4 ring-white scale-105' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-lg md:text-xl font-bold">{note.label}</span>
                      <span className="text-xs opacity-75">{note.key}</span>
                      {/* Glow effect */}
                      {activeKey === note.key && (
                        <motion.div
                          className="absolute inset-0 bg-white/30 rounded-xl"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-4">
                {playMode === 'free' && (
                  <motion.button
                    onClick={() => setPlayedNotes([])}
                    className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-2xl font-bold"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🗑️ {isAr ? 'مسح' : 'Clear'}
                  </motion.button>
                )}
                {playMode === 'follow' && !showingMelody && (
                  <motion.button
                    onClick={() => showMelodySequence(melodyIndex)}
                    className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 rounded-2xl font-bold shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🔁 {isAr ? 'أعد اللحن' : 'Replay'}
                  </motion.button>
                )}
                <motion.button
                  onClick={() => setGameState('start')}
                  className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-2xl font-bold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🏠 {isAr ? 'الرئيسية' : 'Home'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState === 'result' && (
            <motion.div className="text-center space-y-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <div className="relative w-28 h-28 mx-auto">
                <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              </div>
              <h2 className="text-3xl font-bold text-orange-900">
                {score >= 60 ? (isAr ? '🎉 موسيقي رائع!' : '🎉 Great Musician!') :
                 score >= 30 ? (isAr ? '👍 جيد!' : '👍 Good!') :
                 (isAr ? '💪 استمر في التدريب!' : '💪 Keep practicing!')}
              </h2>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-5xl font-bold text-orange-600">{score}</div>
                <div className="text-orange-500">{isAr ? 'نقطة' : 'points'}</div>
              </div>
              <div className="flex gap-3 justify-center">
                <motion.button
                  onClick={startFollow}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 {isAr ? 'تحدي جديد' : 'New Challenge'}
                </motion.button>
                <motion.button
                  onClick={startFree}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎵 {isAr ? 'عزف حر' : 'Free Play'}
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
