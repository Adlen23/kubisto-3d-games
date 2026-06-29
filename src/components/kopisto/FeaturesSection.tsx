'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface GameItem {
  id: string
  icon: string
  href: string
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  difficulty: 'easy' | 'medium'
  tag?: string
}

interface CategoryData {
  key: 'math' | 'words' | 'science' | 'art'
  coverImage: string
  topIcon: string
  games: GameItem[]
}

const categories: CategoryData[] = [
  {
    key: 'math',
    coverImage: '/math-adventure.jpeg',
    topIcon: '×+',
    games: [
      { id: 'math-runner', icon: '🏃', href: '/play/math-runner', titleAr: 'عدّاء كوبيستو', titleEn: 'Kopisto Runner', descAr: 'اقفز واجمع الإجابة الصحيحة!', descEn: 'Jump and collect the right answer!', difficulty: 'medium', tag: 'Popular' },
      { id: 'math-quiz', icon: '🧮', href: '/play/math-quiz', titleAr: 'تحدي الرياضيات', titleEn: 'Math Quiz', descAr: 'اختبر مهاراتك الحسابية!', descEn: 'Test your math skills!', difficulty: 'medium', tag: 'New' },
      { id: 'number-order', icon: '🔢', href: '/play/number-order', titleAr: 'ترتيب الأرقام', titleEn: 'Number Order', descAr: 'اضغط الأرقام بالترتيب!', descEn: 'Tap numbers in order!', difficulty: 'easy', tag: 'New' },
      { id: 'math-balloon', icon: '🎈', href: '/play/math-balloon', titleAr: 'فقع البالونات', titleEn: 'Balloon Pop', descAr: 'فقع البالون بالإجابة الصحيحة!', descEn: 'Pop the right answer balloon!', difficulty: 'easy', tag: 'New' },
      { id: 'counting', icon: '🔢', href: '/play/counting', titleAr: 'عدّ مع كوبيستو', titleEn: 'Count with Kopisto', descAr: 'تعلّم العد من 1 إلى 20!', descEn: 'Learn counting 1 to 20!', difficulty: 'easy' },
    ],
  },
  {
    key: 'words',
    coverImage: '/word-puzzles.jpeg',
    topIcon: 'A',
    games: [
      { id: 'letter-adventure', icon: '📖', href: '/play/letter-adventure', titleAr: 'مغامرة الحروف', titleEn: 'Letter Adventure', descAr: 'اجمع الحروف بالترتيب!', descEn: 'Collect letters in order!', difficulty: 'medium', tag: 'Popular' },
      { id: 'word-spelling', icon: '✏️', href: '/play/word-spelling', titleAr: 'تهجئة الكلمات', titleEn: 'Word Spelling', descAr: 'رتّب الحروف لتكوين الكلمة!', descEn: 'Arrange letters to spell words!', difficulty: 'medium', tag: 'New' },
      { id: 'arabic-alphabet', icon: '📝', href: '/play/arabic-alphabet', titleAr: 'تعلّم الحروف العربية', titleEn: 'Arabic Alphabet', descAr: 'تعلّم الحروف مع النطق!', descEn: 'Learn letters with pronunciation!', difficulty: 'easy', tag: 'New' },
      { id: 'word-match', icon: '🃏', href: '/play/word-match', titleAr: 'طابق الكلمة والصورة', titleEn: 'Word-Picture Match', descAr: 'طابق الصور مع الكلمات!', descEn: 'Match pictures with words!', difficulty: 'easy', tag: 'New' },
      { id: 'memory', icon: '🧠', href: '/play/memory', titleAr: 'ذاكرة كوبيستو', titleEn: 'Kopisto Memory', descAr: 'اعثر على الأزواج المتشابهة!', descEn: 'Find matching pairs!', difficulty: 'medium' },
    ],
  },
  {
    key: 'science',
    coverImage: '/science-explorer.jpeg',
    topIcon: '🧪',
    games: [
      { id: 'animal-sounds', icon: '🦁', href: '/play/animal-sounds', titleAr: 'أصوات الحيوانات', titleEn: 'Animal Sounds', descAr: 'استمع واختر الحيوان الصحيح!', descEn: 'Listen and pick the right animal!', difficulty: 'easy', tag: 'New' },
      { id: 'solar-system', icon: '🪐', href: '/play/solar-system', titleAr: 'استكشاف المجموعة الشمسية', titleEn: 'Solar System', descAr: 'اكتشف الكواكب ومعلومات مدهشة!', descEn: 'Discover planets and facts!', difficulty: 'medium', tag: 'New' },
      { id: 'color-mix', icon: '🧪', href: '/play/color-mix', titleAr: 'مختبر الألوان', titleEn: 'Color Mixing Lab', descAr: 'امزج الألوان واكتشف جديدة!', descEn: 'Mix colors and discover new ones!', difficulty: 'easy', tag: 'New' },
    ],
  },
  {
    key: 'art',
    coverImage: '/art-creativity.jpeg',
    topIcon: '🖌️',
    games: [
      { id: 'drawing', icon: '🎨', href: '/play/drawing', titleAr: 'لوحة الرسم', titleEn: 'Drawing Canvas', descAr: 'ارسم وابدع بالألوان!', descEn: 'Draw and create with colors!', difficulty: 'easy', tag: 'New' },
      { id: 'pattern-game', icon: '🧩', href: '/play/pattern-game', titleAr: 'تعرّف على النمط', titleEn: 'Pattern Game', descAr: 'ما الذي يأتي بعد في النمط؟', descEn: 'What comes next in the pattern?', difficulty: 'medium', tag: 'New' },
      { id: 'music-piano', icon: '🎹', href: '/play/music-piano', titleAr: 'موسيقى البيانو', titleEn: 'Music Piano', descAr: 'اعزف ألحاناً جميلة!', descEn: 'Play beautiful melodies!', difficulty: 'easy', tag: 'New' },
    ],
  },
]

export default function FeaturesSection() {
  const { t, isAr } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<CategoryData | null>(null)

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
  }

  const difficultyLabels = {
    easy: isAr ? 'سهل' : 'Easy',
    medium: isAr ? 'متوسط' : 'Medium',
  }

  const categoryGradients = {
    math: 'from-sky-500 to-sky-600',
    words: 'from-amber-500 to-orange-500',
    science: 'from-emerald-500 to-teal-600',
    art: 'from-orange-500 to-rose-500',
  }

  return (
    <section className="py-16 md:py-20 bg-white relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="inline-block text-4xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🗺️
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
            {t.cards.sectionTitle}
          </h2>
          <p className="text-sky-600/70 text-lg max-w-2xl mx-auto">
            {t.cards.sectionSubtitle}
          </p>
        </motion.div>

        {/* 4 Square Cards with Cover Images */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const cardText = t.cards[category.key]
            return (
              <motion.div
                key={category.key}
                className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-shadow duration-300 h-[220px] md:h-[300px]"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                onClick={() => setActiveCategory(category)}
              >
                {/* Cover Image */}
                <div className="absolute inset-0">
                  <Image
                    src={category.coverImage}
                    alt={cardText.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

                {/* Top Icon Badge */}
                <div className="absolute top-3 right-3 w-11 h-11 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center z-10">
                  <span className="text-white font-bold text-base">{category.topIcon}</span>
                </div>

                {/* Games count badge */}
                <div className="absolute top-3 left-3 bg-white/25 backdrop-blur-sm px-2.5 py-1 rounded-full z-10">
                  <span className="text-white font-bold text-xs">
                    {category.games.length} {isAr ? 'ألعاب' : 'Games'}
                  </span>
                </div>

                {/* Card Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white z-10">
                  <h3 className="font-bold text-lg md:text-xl mb-1 drop-shadow-md">{cardText.title}</h3>
                  <p className="text-white/85 text-xs md:text-sm leading-relaxed mb-2.5 drop-shadow-sm line-clamp-2">{cardText.description}</p>
                  <span className="bg-white/25 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold hover:bg-white/40 transition-colors">
                    {isAr ? 'ابدأ الآن' : 'Start Now'} →
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Games Modal */}
      <AnimatePresence>
        {activeCategory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setActiveCategory(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white shadow-2xl z-10"
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {/* Modal Header with Cover Image */}
              <div className="relative h-40 md:h-48 overflow-hidden rounded-t-3xl">
                <Image
                  src={activeCategory.coverImage}
                  alt={t.cards[activeCategory.key].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

                {/* Close button */}
                <button
                  className="absolute top-3 right-3 w-10 h-10 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center z-20 hover:bg-white/40 transition-colors"
                  onClick={() => setActiveCategory(null)}
                >
                  <span className="text-white text-xl font-bold">✕</span>
                </button>

                {/* Category title */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{activeCategory.topIcon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl md:text-3xl drop-shadow-lg">
                        {t.cards[activeCategory.key].title}
                      </h3>
                      <p className="text-white/85 text-sm drop-shadow-md">
                        {activeCategory.games.length} {isAr ? 'ألعاب متاحة' : 'Games Available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Games Grid - Square Cards */}
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                  {activeCategory.games.map((game, gameIndex) => (
                    <Link key={game.id} href={game.href} onClick={() => setActiveCategory(null)}>
                      <motion.div
                        className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden cursor-pointer group hover:shadow-xl hover:border-sky-200 transition-all duration-300 hover:-translate-y-1"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, delay: gameIndex * 0.06 }}
                      >
                        {/* Game Icon - Square */}
                        <div className={`relative bg-gradient-to-br ${categoryGradients[activeCategory.key]} aspect-square flex items-center justify-center`}>
                          <motion.span
                            className="text-4xl md:text-5xl"
                            whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.3 }}
                          >
                            {game.icon}
                          </motion.span>

                          {/* Tag */}
                          {game.tag && (
                            <div className={`absolute top-2 ${isAr ? 'left-2' : 'right-2'} px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                              game.tag === 'Popular' ? 'bg-rose-400 text-white' :
                              game.tag === 'New' ? 'bg-white text-sky-600' :
                              'bg-gray-200 text-gray-600'
                            }`}>
                              {game.tag === 'Popular' ? (isAr ? 'شائع' : 'Popular') :
                               game.tag === 'New' ? (isAr ? 'جديد' : 'New') : game.tag}
                            </div>
                          )}

                          {/* Play button overlay on hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <span className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-lg shadow-lg opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300">
                              ▶
                            </span>
                          </div>
                        </div>

                        {/* Game Info */}
                        <div className="p-2.5 md:p-3">
                          <h4 className="font-bold text-sky-900 text-xs md:text-sm leading-tight mb-1 truncate">
                            {isAr ? game.titleAr : game.titleEn}
                          </h4>
                          <p className="text-sky-600/60 text-[10px] md:text-xs leading-tight mb-2 line-clamp-2">
                            {isAr ? game.descAr : game.descEn}
                          </p>
                          <span className={`text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-md font-medium ${difficultyColors[game.difficulty]}`}>
                            {difficultyLabels[game.difficulty]}
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
