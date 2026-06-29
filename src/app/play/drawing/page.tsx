'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6',
  '#8b5cf6', '#ec4899', '#000000', '#ffffff', '#6b7280',
]

const BRUSH_SIZES = [3, 6, 12, 20]

const TEMPLATES = [
  { nameEn: 'Star', nameAr: 'نجمة', emoji: '⭐' },
  { nameEn: 'Heart', nameAr: 'قلب', emoji: '❤️' },
  { nameEn: 'House', nameAr: 'بيت', emoji: '🏠' },
  { nameEn: 'Sun', nameAr: 'شمس', emoji: '☀️' },
  { nameEn: 'Tree', nameAr: 'شجرة', emoji: '🌳' },
  { nameEn: 'Fish', nameAr: 'سمكة', emoji: '🐟' },
]

export default function DrawingPage() {
  const { isAr } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#ef4444')
  const [brushSize, setBrushSize] = useState(6)
  const [isEraser, setIsEraser] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pos = getPos(e)
    ctx.lineWidth = brushSize
    ctx.strokeStyle = isEraser ? '#ffffff' : selectedColor
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  const stopDraw = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
  }

  const drawTemplate = useCallback((emoji: string) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    clearCanvas()
    ctx.font = `${Math.min(rect.width, rect.height) * 0.5}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#e5e7eb'
    ctx.fillText(emoji, rect.width / 2, rect.height / 2)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-orange-50">
      <Navbar />
      <main className="flex-1 pt-20 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <motion.div className="text-center mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/games" className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-700 text-sm mb-2 transition-colors">
              <span>{isAr ? '→' : '←'}</span> {isAr ? 'العودة للألعاب' : 'Back to Games'}
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-orange-900">
              🎨 {isAr ? 'لوحة الرسم' : 'Drawing Canvas'}
            </h1>
          </motion.div>

          {/* Kopisto art teacher */}
          <div className="flex justify-center mb-3">
            <motion.div
              className="relative w-16 h-16"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Image src="/kopisto-idle.webp" alt="Kopisto" fill className="object-contain" />
              <div className="absolute -top-1 -right-1 text-sm">🎨</div>
            </motion.div>
          </div>

          {/* Canvas */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-4">
            <canvas
              ref={canvasRef}
              className="w-full cursor-crosshair touch-none"
              style={{ height: '350px' }}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
          </div>

          {/* Color palette */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-orange-700">{isAr ? 'الألوان' : 'Colors'}</span>
              {isEraser && (
                <span className="text-xs bg-orange-100 px-2 py-1 rounded-full text-orange-600 font-bold">
                  {isAr ? 'ممحاة' : 'Eraser'}
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {COLORS.map(color => (
                <motion.button
                  key={color}
                  onClick={() => { setSelectedColor(color); setIsEraser(false) }}
                  className={`w-9 h-9 rounded-full shadow-md border-2 transition-all ${
                    selectedColor === color && !isEraser ? 'border-gray-800 scale-110' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
              <motion.button
                onClick={() => setIsEraser(!isEraser)}
                className={`w-9 h-9 rounded-full shadow-md border-2 flex items-center justify-center text-sm ${
                  isEraser ? 'border-gray-800 scale-110 bg-gray-100' : 'border-gray-200 bg-white'
                }`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                🧹
              </motion.button>
            </div>
          </div>

          {/* Brush sizes */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
            <span className="text-sm font-bold text-orange-700 mb-2 block">{isAr ? 'حجم الفرشاة' : 'Brush Size'}</span>
            <div className="flex gap-3 justify-center">
              {BRUSH_SIZES.map(size => (
                <motion.button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`rounded-full flex items-center justify-center transition-all ${
                    brushSize === size ? 'bg-orange-400 ring-2 ring-orange-300' : 'bg-orange-100'
                  }`}
                  style={{ width: size + 20, height: size + 20 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
                    className="rounded-full bg-orange-700"
                    style={{ width: size, height: size }}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap">
            <motion.button
              onClick={clearCanvas}
              className="flex-1 bg-gradient-to-r from-red-400 to-red-500 text-white py-3 rounded-2xl font-bold shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🗑️ {isAr ? 'مسح الكل' : 'Clear'}
            </motion.button>
            <motion.button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex-1 bg-gradient-to-r from-purple-400 to-purple-500 text-white py-3 rounded-2xl font-bold shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📋 {isAr ? 'قوالب' : 'Templates'}
            </motion.button>
          </div>

          {/* Templates */}
          {showTemplates && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3 bg-white rounded-2xl p-4 shadow-sm"
            >
              <span className="text-sm font-bold text-orange-700 mb-2 block">{isAr ? 'اختر قالباً للتتبع' : 'Pick a template to trace'}</span>
              <div className="flex gap-3 justify-center flex-wrap">
                {TEMPLATES.map((t, i) => (
                  <motion.button
                    key={i}
                    onClick={() => drawTemplate(t.emoji)}
                    className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-2xl hover:bg-orange-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {t.emoji}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
