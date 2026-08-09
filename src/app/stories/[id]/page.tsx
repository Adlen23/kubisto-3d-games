'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { getStoryById } from '@/lib/stories-data'
import { AnimatedBackground } from '@/components/stories/AnimatedBackground'
import { AnimatedIllustration } from '@/components/stories/AnimatedIllustration'
import { AnimatedText } from '@/components/stories/AnimatedText'
import { NarrationControls } from '@/components/stories/NarrationControls'
import {
  ChevronRight, ChevronLeft, BookOpen,
  Clock, Heart, Bookmark, Lightbulb, Sparkles, Volume2
} from 'lucide-react'

export default function StoryReaderPage() {
  const { isAr } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const storyId = pathname?.split('/').pop() || ''
  const story = getStoryById(storyId)
  const [currentPage, setCurrentPage] = useState(0)
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [pageDirection, setPageDirection] = useState(1) // 1 للأمام، -1 للخلف
  const [isAutoNarrating, setIsAutoNarrating] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && story) {
      const favs = JSON.parse(localStorage.getItem('story-favorites') || '[]')
      setIsFavorite(favs.includes(story.id))
      const marks = JSON.parse(localStorage.getItem('story-bookmarks') || '[]')
      setIsBookmarked(marks.includes(story.id))
    }
  }, [story])

  useEffect(() => {
    if (story) {
      setReadingProgress(((currentPage + 1) / story.pages.length) * 100)
    }
  }, [currentPage, story])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && isAr) nextPage()
      if (e.key === 'ArrowRight' && !isAr) nextPage()
      if (e.key === 'ArrowRight' && isAr) prevPage()
      if (e.key === 'ArrowLeft' && !isAr) prevPage()
      if (e.key === 'Escape') router.push('/stories')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentPage, isAr, router])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPage])

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📖</div>
          <p className="text-amber-700 font-semibold">
            {isAr ? 'جارٍ تحميل القصة...' : 'Loading story...'}
          </p>
        </div>
      </div>
    )
  }

  const page = story.pages[currentPage]
  const isLastPage = currentPage === story.pages.length - 1

  const nextPage = () => {
    if (!isLastPage) {
      setPageDirection(1)
      setCurrentPage(p => p + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setPageDirection(-1)
      setCurrentPage(p => p - 1)
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    if (typeof window !== 'undefined') {
      const favs = JSON.parse(localStorage.getItem('story-favorites') || '[]')
      const newFavs = isFavorite ? favs.filter((id: string) => id !== story.id) : [...favs, story.id]
      localStorage.setItem('story-favorites', JSON.stringify(newFavs))
    }
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    if (typeof window !== 'undefined') {
      const marks = JSON.parse(localStorage.getItem('story-bookmarks') || '[]')
      const newMarks = isBookmarked ? marks.filter((id: string) => id !== story.id) : [...marks, story.id]
      localStorage.setItem('story-bookmarks', JSON.stringify(newMarks))
    }
  }

  const fontSizeClass = {
    sm: 'text-base md:text-lg',
    md: 'text-lg md:text-xl',
    lg: 'text-xl md:text-2xl',
  }[fontSize]

  // اتجاه الأنيميشن حسب الاتجاه
  const pageVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      rotateY: dir > 0 ? (isAr ? -25 : 25) : (isAr ? 25 : -25),
      x: dir > 0 ? (isAr ? -80 : 80) : (isAr ? 80 : -80),
      scale: 0.9,
    }),
    center: {
      opacity: 1,
      rotateY: 0,
      x: 0,
      scale: 1,
    },
    exit: (dir: number) => ({
      opacity: 0,
      rotateY: dir > 0 ? (isAr ? 25 : -25) : (isAr ? -25 : 25),
      x: dir > 0 ? (isAr ? 80 : -80) : (isAr ? -80 : 80),
      scale: 0.9,
    }),
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-50" dir={isAr ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* شريط التقدم */}
      <div className="fixed top-16 left-0 right-0 h-1.5 bg-amber-100 z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 relative"
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* نقطة لامعة على رأس الشريط */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg"
            animate={{
              scale: [1, 1.3, 1],
              boxShadow: ['0 0 10px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,1)', '0 0 10px rgba(255,255,255,0.5)'],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>

      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6" ref={scrollRef}>
          {/* الشريط العلوي */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/stories"
              className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-semibold text-sm bg-white/80 px-3 py-1.5 rounded-full shadow-sm transition-all hover:shadow-md"
            >
              {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              {isAr ? 'المكتبة' : 'Library'}
            </Link>

            <div className="flex items-center gap-2">
              {/* حجم الخط */}
              <div className="flex items-center gap-1 bg-white/80 rounded-full p-1 shadow-sm">
                {(['sm', 'md', 'lg'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-2 py-1 rounded-full text-xs font-bold transition-all ${
                      fontSize === size ? 'bg-amber-500 text-white' : 'text-amber-600'
                    }`}
                  >
                    {size === 'sm' ? 'A' : size === 'md' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>

              {/* حفظ */}
              <button
                onClick={toggleBookmark}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isBookmarked ? 'bg-amber-500 text-white' : 'bg-white/80 text-amber-600 hover:bg-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white' : ''}`} />
              </button>

              {/* مفضلة */}
              <button
                onClick={toggleFavorite}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isFavorite ? 'bg-rose-500 text-white' : 'bg-white/80 text-rose-400 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* الكتاب - مع انتقال 3D */}
          <AnimatePresence mode="wait" custom={pageDirection}>
            <motion.div
              key={currentPage}
              custom={pageDirection}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
              }}
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden relative"
            >
              {/* رأس الصفحة */}
              <div className={`bg-gradient-to-r ${page.bgGradient} px-6 py-4 flex items-center justify-between relative z-10`}>
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <BookOpen className="w-5 h-5 text-amber-700" />
                  </motion.div>
                  <span className="text-amber-800 font-semibold text-sm">
                    {isAr ? story.titleAr : story.titleEn}
                  </span>
                </div>
                <motion.span
                  key={currentPage}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-amber-700 font-bold text-sm bg-white/60 px-3 py-1 rounded-full"
                >
                  {currentPage + 1} / {story.pages.length}
                </motion.span>
              </div>

              {/* محتوى الصفحة - مع الخلفية المتحركة */}
              <div className="relative overflow-hidden">
                <AnimatedBackground theme={story.bgTheme} bgGradient={page.bgGradient} />

                <div className="relative z-10 p-8 md:p-12 min-h-[500px] flex flex-col items-center justify-between">
                  {/* الرسوم التوضيحية المتحركة */}
                  <div className="mb-8">
                    <AnimatedIllustration emoji={page.illustration} theme={story.bgTheme} />
                  </div>

                  {/* النص المتحرك */}
                  <div className="max-w-2xl mx-auto w-full">
                    <AnimatedText
                      text={isAr ? page.ar : page.en}
                      fontSize={fontSize}
                      isAr={isAr}
                      animate={true}
                    />
                  </div>

                  {/* أزرار السرد */}
                  <div className="mt-6">
                    <NarrationControls
                      text={isAr ? page.ar : page.en}
                      isAr={isAr}
                      onNext={nextPage}
                      isLastPage={isLastPage}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* أزرار التنقل */}
          <div className="flex items-center justify-between mt-6">
            <motion.button
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all ${
                currentPage === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-amber-700 hover:bg-amber-500 hover:text-white shadow-md hover:shadow-lg'
              }`}
              whileHover={currentPage !== 0 ? { scale: 1.05 } : {}}
              whileTap={currentPage !== 0 ? { scale: 0.95 } : {}}
            >
              {isAr ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              {isAr ? 'السابق' : 'Previous'}
            </motion.button>

            {/* مؤشرات الصفحات */}
            <div className="flex items-center gap-1.5">
              {story.pages.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => {
                    setPageDirection(i > currentPage ? 1 : -1)
                    setCurrentPage(i)
                  }}
                  className={`transition-all rounded-full ${
                    i === currentPage
                      ? 'w-8 h-2.5 bg-gradient-to-r from-amber-500 to-orange-500'
                      : i < currentPage
                      ? 'w-2 h-2 bg-amber-400 hover:bg-amber-500'
                      : 'w-2 h-2 bg-amber-200 hover:bg-amber-300'
                  }`}
                  aria-label={`Page ${i + 1}`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {isLastPage ? (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Link
                  href="/stories"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <motion.div
                    animate={{ rotate: [0, 20, -20, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  {isAr ? 'أنهيت القصة!' : 'Done!'}
                </Link>
              </motion.div>
            ) : (
              <motion.button
                onClick={nextPage}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAr ? 'التالي' : 'Next'}
                {isAr ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </motion.button>
            )}
          </div>

          {/* صندوق الدرس */}
          <AnimatePresence>
            {isLastPage && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
                className="mt-8 bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 rounded-3xl p-6 md:p-8 border-2 border-amber-200 shadow-xl relative overflow-hidden"
              >
                {/* جسيمات لامعة في الخلفية */}
                {[0, 1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl pointer-events-none"
                    style={{ left: `${20 + i * 15}%`, top: '10%' }}
                    animate={{
                      y: [0, 200],
                      opacity: [0, 1, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.4,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    ✨
                  </motion.div>
                ))}

                <div className="relative z-10 flex items-start gap-4">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shrink-0"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Lightbulb className="w-7 h-7" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-900 mb-2 flex items-center gap-2">
                      {isAr ? '🌟 الدرس المستفاد' : '🌟 The Lesson'}
                    </h3>
                    <p className="text-amber-800 leading-relaxed text-base md:text-lg">
                      {isAr ? story.lessonAr : story.lessonEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* معلومات القصة */}
          <div className="mt-8 bg-white rounded-2xl p-5 shadow-md border border-amber-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Clock className="w-5 h-5 text-amber-500" />, label: isAr ? 'المدة' : 'Duration', value: `${story.durationMin} ${isAr ? 'دقيقة' : 'min'}` },
                { icon: <BookOpen className="w-5 h-5 text-amber-500" />, label: isAr ? 'الصفحات' : 'Pages', value: story.pages.length },
                { icon: <Sparkles className="w-5 h-5 text-amber-500" />, label: isAr ? 'العمر' : 'Age', value: story.ageRange },
                { icon: <BookOpen className="w-5 h-5 text-amber-500" />, label: isAr ? 'النوع' : 'Type', value: isAr ? story.categoryAr : story.categoryEn },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <div className="flex justify-center mb-1">{item.icon}</div>
                  <div className="text-xs text-amber-600">{item.label}</div>
                  <div className="font-bold text-amber-900">{item.value}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <motion.button
              onClick={() => {
                setPageDirection(-1)
                setCurrentPage(0)
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-amber-700 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAr ? '🔄 اقرأ مرة أخرى' : '🔄 Read Again'}
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/stories"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
              >
                {isAr ? '📚 قصص أخرى' : '📚 More Stories'}
              </Link>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
