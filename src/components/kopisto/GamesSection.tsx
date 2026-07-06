'use client' // v2 - Bilingual support

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'

interface Game {
  id: number
  titleAr: string
  titleEn: string
  descAr: string
  descEn: string
  icon: string
  color: string
  gradient: string
  category: string
  difficulty: string
  players: string
  href: string
  playable: boolean
  tag?: string
  coverImage?: string
}

const games: Game[] = [
  // Math Category
  {
    id: 1,
    titleAr: 'عدّاء كوبيستو',
    titleEn: 'Kopisto Runner',
    descAr: 'اقفز على المنصات واجمع الإجابة الصحيحة للسؤال الرياضي! لعبة بلاتفورمر مثيرة بأسلوب ماريو!',
    descEn: 'Jump on platforms and collect the right math answer! A Mario-style platformer!',
    icon: '🏃',
    color: 'from-sky-500 to-sky-600',
    gradient: 'from-sky-50 to-sky-50',
    category: 'Math',
    difficulty: 'Medium',
    players: 'Solo',
    href: '/play/math-runner',
    playable: true,
    tag: 'Popular',
    coverImage: '/math-adventure.jpeg',
  },
  {
    id: 2,
    titleAr: 'تحدي الرياضيات',
    titleEn: 'Math Quiz Challenge',
    descAr: 'اختبر مهاراتك الحسابية! أجب عن أسئلة الجمع والطرح والضرب مع كوبيستو!',
    descEn: 'Test your math skills! Answer addition, subtraction and multiplication questions!',
    icon: '🧮',
    color: 'from-sky-500 to-sky-600',
    gradient: 'from-sky-50 to-sky-50',
    category: 'Math',
    difficulty: 'Medium',
    players: 'Solo',
    href: '/play/math-quiz',
    playable: true,
    tag: 'New',
  },
  {
    id: 3,
    titleAr: 'ترتيب الأرقام',
    titleEn: 'Number Order',
    descAr: 'اضغط على الأرقام بالترتيب من الأصغر للأكبر! طريقة ممتعة لتعلّم التسلسل!',
    descEn: 'Tap the numbers in ascending order! A fun way to learn number sequences!',
    icon: '🔢',
    color: 'from-sky-500 to-sky-600',
    gradient: 'from-sky-50 to-sky-50',
    category: 'Math',
    difficulty: 'Easy',
    players: 'Solo',
    href: '/play/number-order',
    playable: true,
    tag: 'New',
  },
  {
    id: 4,
    titleAr: 'فقع البالونات',
    titleEn: 'Math Balloon Pop',
    descAr: 'فقع البالون الذي يحمل الإجابة الصحيحة! حل المعادلات وانفجر البالونات!',
    descEn: 'Pop the balloon with the correct answer! Solve equations and pop balloons!',
    icon: '🎈',
    color: 'from-sky-500 to-sky-600',
    gradient: 'from-sky-50 to-sky-50',
    category: 'Math',
    difficulty: 'Easy',
    players: 'Solo',
    href: '/play/math-balloon',
    playable: true,
  },
  {
    id: 5,
    titleAr: 'عدّ مع كوبيستو',
    titleEn: 'Count with Kopisto',
    descAr: 'تعلّم الأرقام والعد من 1 إلى 20 بطريقة ممتعة! كم ثمرة ترى؟',
    descEn: 'Learn numbers and counting from 1 to 20 in a fun way! How many fruits?',
    icon: '🔢',
    color: 'from-sky-500 to-sky-600',
    gradient: 'from-sky-50 to-sky-50',
    category: 'Math',
    difficulty: 'Easy',
    players: 'Solo',
    href: '/play/counting',
    playable: true,
  },
  // Language Category
  {
    id: 6,
    titleAr: 'مغامرة الحروف',
    titleEn: 'Letter Adventure',
    descAr: 'اقفز واجمع الحروف العربية بالترتيب الصحيح! لعبة بلاتفورمر ممتعة لتعلّم الأبجدية!',
    descEn: 'Jump and collect Arabic letters in the correct order! A fun platformer to learn the alphabet!',
    icon: '📖',
    color: 'from-amber-500 to-orange-600',
    gradient: 'from-amber-50 to-orange-50',
    category: 'Language',
    difficulty: 'Medium',
    players: 'Solo',
    href: '/play/letter-adventure',
    playable: true,
    tag: 'Popular',
  },
  {
    id: 7,
    titleAr: 'تهجئة الكلمات',
    titleEn: 'Word Spelling',
    descAr: 'رتّب الحروف لتكوين الكلمة الصحيحة! تعلّم المفردات مع صور ممتعة!',
    descEn: 'Arrange the letters to spell the word correctly! Learn vocabulary with fun pictures!',
    icon: '✏️',
    color: 'from-amber-500 to-orange-600',
    gradient: 'from-amber-50 to-orange-50',
    category: 'Language',
    difficulty: 'Medium',
    players: 'Solo',
    href: '/play/word-spelling',
    playable: true,
    tag: 'New',
  },
  {
    id: 8,
    titleAr: 'تعلّم الحروف العربية',
    titleEn: 'Arabic Alphabet',
    descAr: 'تعلّم الحروف العربية واحدة واحدة مع طريقة النطق! اختبر نفسك!',
    descEn: 'Learn Arabic letters one by one with pronunciation! Test yourself!',
    icon: '📝',
    color: 'from-amber-500 to-orange-600',
    gradient: 'from-amber-50 to-orange-50',
    category: 'Language',
    difficulty: 'Easy',
    players: 'Solo',
    href: '/play/arabic-alphabet',
    playable: true,
    tag: 'New',
  },
  {
    id: 9,
    titleAr: 'طابق الكلمة والصورة',
    titleEn: 'Word-Picture Match',
    descAr: 'طابق كل صورة مع الكلمة المناسبة! لعبة ذاكرة ثنائية اللغة!',
    descEn: 'Match each picture with its word! A bilingual memory game!',
    icon: '🃏',
    color: 'from-amber-500 to-orange-600',
    gradient: 'from-amber-50 to-orange-50',
    category: 'Language',
    difficulty: 'Easy',
    players: 'Solo',
    href: '/play/word-match',
    playable: true,
    tag: 'New',
  },
  // Science Category
  {
    id: 10,
    titleAr: 'أصوات الحيوانات',
    titleEn: 'Animal Sounds',
    descAr: 'استمع لأصوات الحيوانات واختر الحيوان المناسب! معلومات ممتعة!',
    descEn: 'Listen to animal sounds and pick the right animal! Fun facts included!',
    icon: '🦁',
    color: 'from-emerald-500 to-teal-600',
    gradient: 'from-emerald-50 to-teal-50',
    category: 'Science',
    difficulty: 'Easy',
    players: 'Solo',
    href: '/play/animal-sounds',
    playable: true,
    tag: 'New',
    coverImage: '/science-explorer.jpeg',
  },
  {
    id: 11,
    titleAr: 'استكشاف المجموعة الشمسية',
    titleEn: 'Solar System Explorer',
    descAr: 'اكتشف الكواكب وتعلّم معلومات مدهشة! استكشف مع كوبيستو!',
    descEn: 'Discover planets and learn amazing facts! Explore the solar system with Kopisto!',
    icon: '🪐',
    color: 'from-emerald-500 to-teal-600',
    gradient: 'from-emerald-50 to-teal-50',
    category: 'Science',
    difficulty: 'Medium',
    players: 'Solo',
    href: '/play/solar-system',
    playable: true,
    tag: 'New',
  },
  {
    id: 12,
    titleAr: 'مختبر الألوان',
    titleEn: 'Color Mixing Lab',
    descAr: 'امزج الألوان لاكتشاف ألوان جديدة! تعلّم نظرية الألوان في مختبر كوبيستو!',
    descEn: "Mix colors to discover new ones! Learn color theory in Kopisto's lab!",
    icon: '🧪',
    color: 'from-emerald-500 to-teal-600',
    gradient: 'from-emerald-50 to-teal-50',
    category: 'Science',
    difficulty: 'Easy',
    players: 'Solo',
    href: '/play/color-mix',
    playable: true,
    tag: 'New',
  },
  // Art Category
  {
    id: 13,
    titleAr: 'ذاكرة كوبيستو',
    titleEn: 'Kopisto Memory',
    descAr: 'اختبر ذاكرتك! اقلب البطاقات واعثر على الأزواج المتشابهة!',
    descEn: 'Test your memory! Flip the cards and find matching pairs!',
    icon: '🧠',
    color: 'from-orange-500 to-orange-600',
    gradient: 'from-orange-50 to-orange-50',
    category: 'Art',
    difficulty: 'Medium',
    players: 'Solo',
    href: '/play/memory',
    playable: true,
    tag: 'New',
  },
  {
    id: 14,
    titleAr: 'لوحة الرسم',
    titleEn: 'Drawing Canvas',
    descAr: 'ارسم وابدع بالألوان والفرش! تتبع القوالب وعبر عن نفسك!',
    descEn: 'Draw and create with colors and brushes! Follow templates and express yourself!',
    icon: '🎨',
    color: 'from-orange-500 to-orange-600',
    gradient: 'from-orange-50 to-orange-50',
    category: 'Art',
    difficulty: 'Easy',
    players: 'Solo',
    href: '/play/drawing',
    playable: true,
    tag: 'New',
  },
  {
    id: 15,
    titleAr: 'تعرّف على النمط',
    titleEn: 'Pattern Game',
    descAr: 'ما الذي يأتي بعد في النمط؟ درّب عقلك مع تسلسلات ممتعة!',
    descEn: 'What comes next in the pattern? Train your brain with fun sequences!',
    icon: '🧩',
    color: 'from-orange-500 to-orange-600',
    gradient: 'from-orange-50 to-orange-50',
    category: 'Art',
    difficulty: 'Medium',
    players: 'Solo',
    href: '/play/pattern-game',
    playable: true,
    tag: 'New',
  },
  {
    id: 16,
    titleAr: 'موسيقى البيانو',
    titleEn: 'Music Piano',
    descAr: 'اعزف ألحاناً جميلة على بيانو ملون! اتبع اللحن أو أنشئ موسيقاك!',
    descEn: 'Play beautiful melodies on a colorful piano! Follow the tune or create your own!',
    icon: '🎹',
    color: 'from-orange-500 to-orange-600',
    gradient: 'from-orange-50 to-orange-50',
    category: 'Art',
    difficulty: 'Easy',
    players: 'Solo',
    href: '/play/music-piano',
    playable: true,
    tag: 'New',
  },
]

const categories = ['All', 'Math', 'Language', 'Science', 'Art']

export default function GamesSection() {
  const { isAr, t } = useLanguage()
  const gp = t.gamesPage
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredGames = activeCategory === 'All'
    ? games
    : games.filter(g => g.category === activeCategory)

  // ترجمات التصنيفات
  const categoryLabels: Record<string, { ar: string; en: string; emoji: string }> = {
    'All': { ar: 'الكل', en: 'All', emoji: '🌟' },
    'Math': { ar: 'رياضيات', en: 'Math', emoji: '🧮' },
    'Language': { ar: 'لغة عربية', en: 'Language', emoji: '📝' },
    'Science': { ar: 'علوم', en: 'Science', emoji: '🔬' },
    'Art': { ar: 'فنون', en: 'Art', emoji: '🎨' },
  }

  // ترجمات الصعوبة
  const difficultyLabels: Record<string, { ar: string; en: string }> = {
    'Easy': { ar: 'سهل', en: 'Easy' },
    'Medium': { ar: 'متوسط', en: 'Medium' },
    'Hard': { ar: 'صعب', en: 'Hard' },
  }

  // ترجمات اللاعبين
  const playerLabels: Record<string, { ar: string; en: string }> = {
    'Solo': { ar: 'فردي', en: 'Solo' },
    'Duo': { ar: 'ثنائي', en: 'Duo' },
  }

  // ترجمات الوسوم
  const tagLabels: Record<string, { ar: string; en: string }> = {
    'Popular': { ar: 'الأشهر', en: 'Popular' },
    'New': { ar: 'جديد', en: 'New' },
    'Coming': { ar: 'قريباً', en: 'Coming' },
  }

  return (
    <section id="games" className="py-16 md:py-20 bg-white relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block text-4xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎮
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
            {isAr ? (
              <>ألعاب <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">ممتعة</span> ومعلومة!</>
            ) : (
              <>Fun & <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Educational</span> Games!</>
            )}
          </h2>
          <p className="text-sky-600/70 text-lg max-w-2xl mx-auto">
            {gp.description}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex gap-2 mb-10 overflow-x-auto no-scrollbar px-2 -mx-2 md:flex-wrap md:justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-300/30'
                  : 'bg-sky-100 text-sky-700 hover:bg-sky-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
            >
              {categoryLabels[cat].emoji} {isAr ? categoryLabels[cat].ar : categoryLabels[cat].en}
            </motion.button>
          ))}
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              className="game-card group relative bg-white rounded-2xl border-2 border-sky-100 overflow-hidden"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{
                borderColor: '#7dd3fc',
                boxShadow: '0 20px 40px rgba(14, 165, 233, 0.15)',
              }}
            >
              <Link href={game.playable ? game.href : '#'} className={`block ${!game.playable ? 'pointer-events-none' : ''}`}>
                {/* Game Cover Image / Icon Area */}
                <div className={`relative overflow-hidden ${game.coverImage ? 'h-44' : `bg-gradient-to-bl ${game.gradient} p-6 flex items-center justify-center`}`}>
                  {game.coverImage ? (
                    <>
                      <Image
                        src={game.coverImage}
                        alt={isAr ? game.titleAr : game.titleEn}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </>
                  ) : (
                    <motion.div
                      className="text-5xl"
                      whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      {game.icon}
                    </motion.div>
                  )}

                  {game.tag && (
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-xs font-bold z-10 ${
                      game.tag === 'Coming' ? 'bg-gray-200 text-gray-600' :
                      game.tag === 'Popular' ? 'bg-rose-400 text-white' :
                      'bg-orange-400 text-white'
                    }`}>
                      {isAr ? tagLabels[game.tag]?.ar : tagLabels[game.tag]?.en || game.tag}
                    </div>
                  )}
                  {/* Floating icon on cover images */}
                  {game.coverImage && (
                    <div className="absolute bottom-2 right-2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-xl shadow-md z-10">
                      {game.icon}
                    </div>
                  )}
                  {!game.coverImage && (
                    <>
                      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/20 rounded-full" />
                      <div className="absolute -top-3 -right-3 w-12 h-12 bg-white/10 rounded-full" />
                    </>
                  )}
                </div>

                {/* Game Info */}
                <div className="p-5">
                  <h3 className="font-bold text-sky-900 text-lg mb-2">{isAr ? game.titleAr : game.titleEn}</h3>
                  <p className="text-sky-600/60 text-sm leading-relaxed mb-3">{isAr ? game.descAr : game.descEn}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        game.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {isAr ? difficultyLabels[game.difficulty]?.ar : difficultyLabels[game.difficulty]?.en || game.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-lg bg-sky-100 text-sky-700 font-medium">
                        {isAr ? playerLabels[game.players]?.ar : playerLabels[game.players]?.en || game.players}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-lg bg-orange-100 text-orange-700 font-medium">
                        {isAr ? categoryLabels[game.category]?.ar : categoryLabels[game.category]?.en || game.category}
                      </span>
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${game.color} text-white flex items-center justify-center text-sm shadow-md ${
                      game.playable ? '' : 'opacity-50'
                    }`}>
                      ▶
                    </div>
                  </div>
                </div>
              </Link>

              {game.playable && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-sky-900/80 via-sky-900/20 to-transparent flex items-end justify-center pb-6 sm:pb-8 pointer-events-none opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 [@media(hover:none)]:from-sky-900/50 transition-opacity"
                >
                  <div className={`bg-gradient-to-r ${game.color} text-white px-6 py-3 rounded-xl font-bold shadow-xl`}>
                    {isAr ? 'العب الآن! 🎮' : 'Play Now! 🎮'}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
