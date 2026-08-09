'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { stories, type Story } from '@/lib/stories-data'
import { Clock, BookOpen, Heart, Star, Search, ChevronRight, ChevronLeft } from 'lucide-react'

const categoryConfig = [
  { id: 'all', ar: 'الكل', en: 'All', emoji: '🌟' },
  { id: 'adventure', ar: 'مغامرة', en: 'Adventure', emoji: '🗺️' },
  { id: 'bedtime', ar: 'قبل النوم', en: 'Bedtime', emoji: '🌙' },
  { id: 'educational', ar: 'تعليمية', en: 'Educational', emoji: '📚' },
  { id: 'moral', ar: 'قيم وأخلاق', en: 'Moral', emoji: '💎' },
]

export default function StoriesPage() {
  const { isAr, t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredStories = stories.filter(story => {
    const matchesCategory = activeCategory === 'all' || story.category === activeCategory
    const matchesSearch = searchQuery === '' ||
      story.titleAr.includes(searchQuery) ||
      story.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tagsAr.some(tag => tag.includes(searchQuery)) ||
      story.tagsEn.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 relative overflow-x-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float-slow">📖</div>
          <div className="absolute top-20 right-20 text-5xl opacity-10 animate-float-slow" style={{ animationDelay: '1s' }}>📚</div>
          <div className="absolute bottom-20 left-1/4 text-4xl opacity-10 animate-float-slow" style={{ animationDelay: '2s' }}>✨</div>
          <div className="absolute top-1/2 right-10 text-5xl opacity-10 animate-float-slow" style={{ animationDelay: '1.5s' }}>🌟</div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-amber-200 mb-4"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-2xl">📖</span>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {isAr ? (
                    <>مكتبة <span className="bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent">القصص</span></>
                  ) : (
                    <>Stories <span className="bg-gradient-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent">Library</span></>
                  )}
                </h1>
              </motion.div>
              <p className="text-amber-700/70 text-lg max-w-2xl mx-auto">
                {isAr
                  ? 'مجموعة من القصص التعليمية المختارة بعناية لإسعاد أطفالكم وتعليمهم القيم الجميلة'
                  : 'A collection of educational stories carefully selected to delight your children and teach them beautiful values'}
              </p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              className="max-w-md mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <Search className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-amber-400`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'ابحث عن قصة...' : 'Search for a story...'}
                  className={`w-full py-3 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-full bg-white/80 backdrop-blur-sm border-2 border-amber-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-amber-900 placeholder:text-amber-400`}
                />
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              className="flex flex-wrap gap-2 justify-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {categoryConfig.map(cat => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200'
                      : 'bg-white/80 text-amber-700 hover:bg-amber-100 border border-amber-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{cat.emoji}</span>
                  {isAr ? cat.ar : cat.en}
                </motion.button>
              ))}
            </motion.div>

            {/* Stories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredStories.map((story, index) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    isAr={isAr}
                    isFavorite={favorites.has(story.id)}
                    onToggleFavorite={() => toggleFavorite(story.id)}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>

            {filteredStories.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-amber-700 font-semibold">
                  {isAr ? 'لا توجد قصص مطابقة' : 'No matching stories'}
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Reading Tips Section */}
        <section className="py-12 bg-gradient-to-r from-amber-100/50 to-orange-100/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-amber-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-amber-900">
                  {isAr ? 'نصائح للقراءة مع طفلك' : 'Tips for Reading with Your Child'}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(isAr ? [
                  { emoji: '🎭', tip: 'غيّر صوتك مع كل شخصية في القصة' },
                  { emoji: '⏰', tip: 'اقرأ لطفلك 15 دقيقة يومياً على الأقل' },
                  { emoji: '❓', tip: 'اسأل طفلك أسئلة عن القصة بعد الانتهاء' },
                  { emoji: '🌙', tip: 'اجعل القراءة قبل النوم روتيناً يومياً' },
                ] : [
                  { emoji: '🎭', tip: 'Change your voice for each character' },
                  { emoji: '⏰', tip: 'Read to your child at least 15 minutes daily' },
                  { emoji: '❓', tip: 'Ask your child questions about the story' },
                  { emoji: '🌙', tip: 'Make bedtime reading a daily routine' },
                ]).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-sm font-medium text-amber-800">{item.tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

interface StoryCardProps {
  story: Story
  isAr: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
  index: number
}

function StoryCard({ story, isAr, isFavorite, onToggleFavorite, index }: StoryCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-amber-100 hover:shadow-2xl hover:border-amber-300 transition-all"
    >
      <Link href={`/stories/${story.id}`}>
        {/* Cover */}
        <div className={`relative h-48 bg-gradient-to-br ${story.coverGradient} overflow-hidden`}>
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 40% 80%, white 1px, transparent 1px)',
            backgroundSize: '30px 30px, 40px 40px, 50px 50px',
          }} />
          {/* Big emoji */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-7xl drop-shadow-lg"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {story.coverEmoji}
            </motion.div>
          </div>
          {/* Category badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-700 shadow-md">
            {isAr ? story.categoryAr : story.categoryEn}
          </div>
          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorite()
            }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isFavorite ? 'bg-rose-500 text-white' : 'bg-white/90 text-rose-400 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
          {/* Age badge */}
          <div className="absolute bottom-3 right-3 bg-black/30 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold">
            {isAr ? `${story.ageRange} سنوات` : `${story.ageRange} years`}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-amber-900 mb-2 line-clamp-1">
            {isAr ? story.titleAr : story.titleEn}
          </h3>
          <p className="text-amber-700/70 text-sm leading-relaxed mb-3 line-clamp-2">
            {isAr ? story.descriptionAr : story.descriptionEn}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-amber-600/70 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{story.durationMin} {isAr ? 'دقيقة' : 'min'}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{story.pages.length} {isAr ? 'صفحة' : 'pages'}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {(isAr ? story.tagsAr : story.tagsEn).slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* Read button */}
          <div className="flex items-center justify-between pt-3 border-t border-amber-100">
            <span className="text-xs text-amber-500 font-medium">
              {story.authorAr === 'إعداد فريق كوبيستو' ? (isAr ? story.authorAr : story.authorEn) : (isAr ? story.authorAr : story.authorEn)}
            </span>
            <div className="flex items-center gap-1 text-amber-600 font-semibold text-sm group-hover:gap-2 transition-all">
              {isAr ? 'اقرأ' : 'Read'}
              {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
