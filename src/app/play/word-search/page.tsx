'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft, ArrowRight, Star, Trophy, RefreshCw, CheckCircle2 } from 'lucide-react'

interface WordSearchData {
  ar: string
  en: string
  emoji: string
}

const wordList: WordSearchData[] = [
  { ar: 'قطة', en: 'CAT', emoji: '🐱' },
  { ar: 'كلب', en: 'DOG', emoji: '🐶' },
  { ar: 'شمس', en: 'SUN', emoji: '☀️' },
  { ar: 'قمر', en: 'MOON', emoji: '🌙' },
  { ar: 'بحر', en: 'SEA', emoji: '🌊' },
  { ar: 'سماء', en: 'SKY', emoji: '🌤️' },
  { ar: 'نجوم', en: 'STAR', emoji: '⭐' },
]

const GRID_SIZE = 10

// توليد شبكة بحروف عشوائية + الكلمات المخفية
function generateGrid(words: WordSearchData[], isAr: boolean): { grid: string[][]; placedWords: { word: string; cells: { row: number; col: number }[]; data: WordSearchData }[] } {
  const grid: string[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(''))
  const placedWords: { word: string; cells: { row: number; col: number }[]; data: WordSearchData }[] = []
  const letters = isAr ? 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  const directions = [
    [0, 1],   // أفقي
    [1, 0],   // عمودي
    [1, 1],   // قطري
  ]

  // وضع الكلمات
  words.forEach(wordData => {
    const word = (isAr ? wordData.ar : wordData.en).toUpperCase()
    let placed = false
    let attempts = 0

    while (!placed && attempts < 100) {
      attempts++
      const dir = directions[Math.floor(Math.random() * directions.length)]
      const row = Math.floor(Math.random() * GRID_SIZE)
      const col = Math.floor(Math.random() * GRID_SIZE)
      const endRow = row + dir[0] * (word.length - 1)
      const endCol = col + dir[1] * (word.length - 1)

      if (endRow < 0 || endRow >= GRID_SIZE || endCol < 0 || endCol >= GRID_SIZE) continue

      let canPlace = true
      const cells: { row: number; col: number }[] = []

      for (let i = 0; i < word.length; i++) {
        const r = row + dir[0] * i
        const c = col + dir[1] * i
        if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
          canPlace = false
          break
        }
        cells.push({ row: r, col: c })
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const r = row + dir[0] * i
          const c = col + dir[1] * i
          grid[r][c] = word[i]
        }
        placedWords.push({ word, cells, data: wordData })
        placed = true
      }
    }
  })

  // ملء الفراغات بحروف عشوائية
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)]
      }
    }
  }

  return { grid, placedWords }
}

export default function WordSearchPage() {
  const { isAr } = useLanguage()
  const [gridData, setGridData] = useState(() => generateGrid(wordList.slice(0, 5), isAr))
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([])
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [score, setScore] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const checkSelection = useCallback(() => {
    if (selectedCells.length < 2) return
    const selectedStr = selectedCells.map(c => gridData.grid[c.row][c.col]).join('')

    const found = gridData.placedWords.find(pw => {
      if (foundWords.has(pw.word)) return false
      const wordStr = pw.word
      const reversed = wordStr.split('').reverse().join('')
      const selectedReversed = selectedCells.map(c => gridData.grid[c.row][c.col]).reverse().join('')

      // تحقق من التطابق في أي اتجاه
      if (selectedStr === wordStr || selectedStr === reversed ||
          selectedReversed === wordStr || selectedReversed === reversed) {
        // تحقق من تطابق الخلايا
        const cellsMatch = pw.cells.every(c =>
          selectedCells.some(sc => sc.row === c.row && sc.col === c.col)
        )
        return cellsMatch || pw.cells.every(c =>
          selectedCells.some(sc => sc.row === c.row && sc.col === c.col)
        )
      }
      return false
    })

    if (found) {
      setFoundWords(prev => new Set([...prev, found.word]))
      setScore(s => s + 20)
    }
    setSelectedCells([])
  }, [selectedCells, gridData, foundWords])

  useEffect(() => {
    if (gridData.placedWords.length > 0 && foundWords.size === gridData.placedWords.length) {
      setShowResult(true)
    }
  }, [foundWords, gridData.placedWords.length])

  const handleCellClick = (row: number, col: number) => {
    const exists = selectedCells.find(c => c.row === row && c.col === col)
    if (exists) {
      setSelectedCells(selectedCells.filter(c => !(c.row === row && c.col === col)))
    } else {
      setSelectedCells([...selectedCells, { row, col }])
    }
  }

  const handleCellMouseDown = (row: number, col: number) => {
    setIsDragging(true)
    setSelectedCells([{ row, col }])
  }

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isDragging) {
      const exists = selectedCells.find(c => c.row === row && c.col === col)
      if (!exists) {
        setSelectedCells([...selectedCells, { row, col }])
      }
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      checkSelection()
    }
  }

  const restart = () => {
    setGridData(generateGrid(wordList.slice(0, 5), isAr))
    setFoundWords(new Set())
    setScore(0)
    setSelectedCells([])
    setShowResult(false)
  }

  const isCellSelected = (row: number, col: number) =>
    selectedCells.some(c => c.row === row && c.col === col)

  const isCellFound = (row: number, col: number) => {
    return gridData.placedWords.some(pw => {
      if (!foundWords.has(pw.word)) return false
      return pw.cells.some(c => c.row === row && c.col === col)
    })
  }

  if (showResult) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-teal-50" dir={isAr ? 'rtl' : 'ltr'}>
        <Navbar />
        <main className="flex-1 pt-20 px-4 flex items-center justify-center">
          <motion.div
            className="bg-white rounded-3xl p-8 text-center max-w-md w-full shadow-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <motion.div className="text-7xl mb-4" animate={{ rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity }}>🏆</motion.div>
            <h2 className="text-2xl font-bold text-emerald-900 mb-2">{isAr ? 'وصلت للقمة!' : 'You won!'}</h2>
            <p className="text-emerald-600 mb-4">{isAr ? `لقد وجدت كل ${foundWords.size} كلمات!` : `You found all ${foundWords.size} words!`}</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map(i => (
                <motion.span key={i} className="text-4xl" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.2 }}>⭐</motion.span>
              ))}
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 mb-4">
              <span className="text-emerald-700 text-sm">{isAr ? 'النقاط' : 'Score'}: </span>
              <span className="font-bold text-emerald-900 text-xl">{score}</span>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={restart} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold">
                <RefreshCw className="w-4 h-4" /> {isAr ? 'العب مرة أخرى' : 'Play Again'}
              </button>
              <Link href="/games" className="flex items-center gap-2 px-5 py-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold">
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-teal-50" dir={isAr ? 'rtl' : 'ltr'} onMouseUp={handleMouseUp}>
      <Navbar />
      <main className="flex-1 pt-20 px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/games" className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold text-sm bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {isAr ? 'الألعاب' : 'Games'}
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span className="font-bold text-emerald-900 text-sm">{score}</span>
              </div>
              <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-emerald-900 text-sm">{foundWords.size}/{gridData.placedWords.length}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">🔍 {isAr ? 'البحث عن الكلمات' : 'Word Search'}</h1>
            <p className="text-emerald-600 text-sm">{isAr ? 'حدد الكلمات المخفية في الشبكة' : 'Find the hidden words in the grid'}</p>
          </div>

          {/* Word list */}
          <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
            <p className="text-sm font-semibold text-emerald-700 mb-2">{isAr ? 'ابحث عن:' : 'Find:'}</p>
            <div className="flex flex-wrap gap-2">
              {gridData.placedWords.map((pw, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                    foundWords.has(pw.word)
                      ? 'bg-emerald-500 text-white line-through opacity-60'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {pw.data.emoji} {isAr ? pw.data.ar : pw.data.en}
                </span>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="bg-white rounded-2xl p-4 shadow-xl overflow-x-auto">
            <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`, maxWidth: '500px' }}>
              {gridData.grid.map((row, r) =>
                row.map((letter, c) => (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    onMouseDown={() => handleCellMouseDown(r, c)}
                    onMouseEnter={() => handleCellMouseEnter(r, c)}
                    onTouchStart={() => handleCellMouseDown(r, c)}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm md:text-base font-bold transition-all select-none ${
                      isCellFound(r, c)
                        ? 'bg-emerald-500 text-white shadow-md'
                        : isCellSelected(r, c)
                        ? 'bg-amber-400 text-white shadow-md scale-110'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {letter}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Check button */}
          <div className="text-center mt-4">
            <button
              onClick={checkSelection}
              disabled={selectedCells.length < 2}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
                selectedCells.length < 2
                  ? 'bg-gray-200 text-gray-400'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg'
              }`}
            >
              {isAr ? 'تحقق من الاختيار' : 'Check Selection'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
