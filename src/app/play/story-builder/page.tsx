'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/kopisto/Navbar'
import Footer from '@/components/kopisto/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { ArrowLeft, ArrowRight, Star, RefreshCw, Download, Sparkles } from 'lucide-react'

interface StoryPart {
  ar: string
  en: string
  emoji: string
  category: string
}

const storyParts: { [category: string]: StoryPart[] } = {
  character: [
    { ar: 'أرنب صغير اسمه كوبيستو', en: 'a little rabbit named Kopisto', emoji: '🐰', category: 'character' },
    { ar: 'طفل شجاع', en: 'a brave child', emoji: '👦', category: 'character' },
    { ar: 'بطة ذكية', en: 'a smart duck', emoji: '🦆', category: 'character' },
    { ar: 'ثعلب ماكر', en: 'a cunning fox', emoji: '🦊', category: 'character' },
  ],
  setting: [
    { ar: 'في غابة سحرية', en: 'in a magical forest', emoji: '🌳', category: 'setting' },
    { ar: 'على قمة جبل عالٍ', en: 'on top of a tall mountain', emoji: '⛰️', category: 'setting' },
    { ar: 'في أعماق البحر', en: 'deep in the sea', emoji: '🌊', category: 'setting' },
    { ar: 'في الفضاء البعيد', en: 'in outer space', emoji: '🚀', category: 'setting' },
  ],
  action: [
    { ar: 'بحث عن كنز مخفي', en: 'searched for a hidden treasure', emoji: '💎', category: 'action' },
    { ar: 'ساعد صديقاً ضائعاً', en: 'helped a lost friend', emoji: '🤝', category: 'action' },
    { ar: 'حلّ لغزاً صعباً', en: 'solved a difficult puzzle', emoji: '🧩', category: 'action' },
    { ar: 'تعلّم سحراً جديداً', en: 'learned a new magic', emoji: '✨', category: 'action' },
  ],
  ending: [
    { ar: 'وعاد بطلاً سعيداً', en: 'and returned a happy hero', emoji: '🏆', category: 'ending' },
    { ar: 'وأصبح صديقاً للجميع', en: 'and became everyone\'s friend', emoji: '💖', category: 'ending' },
    { ar: 'وحصل على وسام الشجاعة', en: 'and earned a bravery medal', emoji: '🥇', category: 'ending' },
    { ar: 'وأطلق سراح الطيور الأسيرة', en: 'and freed the captive birds', emoji: '🕊️', category: 'ending' },
  ],
}

const categoryLabels = {
  ar: { character: 'البطل', setting: 'المكان', action: 'المغامرة', ending: 'النهاية' },
  en: { character: 'Character', setting: 'Setting', action: 'Adventure', ending: 'Ending' },
}

const categoryColors = {
  character: 'from-sky-400 to-blue-500',
  setting: 'from-emerald-400 to-teal-500',
  action: 'from-amber-400 to-orange-500',
  ending: 'from-violet-400 to-purple-500',
}

export default function StoryBuilderPage() {
  const { isAr } = useLanguage()
  const [selectedParts, setSelectedParts] = useState<{ [key: string]: StoryPart | null }>({
    character: null,
    setting: null,
    action: null,
    ending: null,
  })
  const [storyTitle, setStoryTitle] = useState('')
  const [showResult, setShowResult] = useState(false)

  const selectPart = (category: string, part: StoryPart) => {
    setSelectedParts({ ...selectedParts, [category]: part })
  }

  const buildStory = () => {
    const allSelected = Object.values(selectedParts).every(p => p !== null)
    if (allSelected) {
      setShowResult(true)
    }
  }

  const getStoryText = () => {
    const parts = ['character', 'setting', 'action', 'ending']
    return parts.map(p => {
      const part = selectedParts[p]
      return part ? (isAr ? part.ar : part.en) : ''
    }).filter(Boolean).join(' ')
  }

  const restart = () => {
    setSelectedParts({ character: null, setting: null, action: null, ending: null })
    setStoryTitle('')
    setShowResult(false)
  }

  const downloadStory = () => {
    const text = `${storyTitle || (isAr ? 'قصتي' : 'My Story')}\n\n${getStoryText()}`
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${storyTitle || 'kopisto-story'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const allSelected = Object.values(selectedParts).every(p => p !== null)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-violet-50 to-purple-50" dir={isAr ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="flex-1 pt-20 px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/games" className="flex items-center gap-1 text-violet-700 hover:text-violet-900 font-semibold text-sm bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
              {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {isAr ? 'الألعاب' : 'Games'}
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span className="font-bold text-violet-900 text-sm">{Object.values(selectedParts).filter(p => p).length}/4</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-violet-900 mb-2">📚 {isAr ? 'بنّاء القصص' : 'Story Builder'}</h1>
            <p className="text-violet-600 text-sm">{isAr ? 'اختر العناصر لإنشاء قصتك الخاصة' : 'Choose elements to create your own story'}</p>
          </div>

          {!showResult ? (
            <>
              {/* Story Title Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-violet-800 mb-2">{isAr ? 'عنوان قصتك' : 'Your Story Title'}</label>
                <input
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder={isAr ? 'اكتب عنواناً مميزاً...' : 'Write a catchy title...'}
                  className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-violet-900 placeholder:text-violet-300"
                />
              </div>

              {/* Story Parts Selection */}
              {Object.keys(storyParts).map((category) => (
                <div key={category} className="mb-6">
                  <h3 className="font-bold text-violet-900 mb-3 flex items-center gap-2">
                    <span className={`w-2 h-6 rounded-full bg-gradient-to-b ${categoryColors[category as keyof typeof categoryColors]}`} />
                    {isAr ? categoryLabels.ar[category as keyof typeof categoryLabels.ar] : categoryLabels.en[category as keyof typeof categoryLabels.en]}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {storyParts[category].map((part, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => selectPart(category, part)}
                        className={`p-3 rounded-2xl text-center border-2 transition-all ${
                          selectedParts[category]?.ar === part.ar
                            ? `bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} text-white border-transparent shadow-lg`
                            : 'bg-white border-violet-100 text-violet-700 hover:border-violet-300'
                        }`}
                      >
                        <span className="text-3xl block mb-1">{part.emoji}</span>
                        <span className="text-xs font-semibold leading-tight">{isAr ? part.ar : part.en}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Build Button */}
              <div className="text-center mt-8">
                <motion.button
                  whileHover={allSelected ? { scale: 1.05 } : {}}
                  whileTap={allSelected ? { scale: 0.95 } : {}}
                  onClick={buildStory}
                  disabled={!allSelected}
                  className={`px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-2 mx-auto transition-all ${
                    allSelected
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  {isAr ? 'أنشئ قصتي! ✨' : 'Build My Story! ✨'}
                </motion.button>
                {!allSelected && (
                  <p className="text-xs text-violet-400 mt-2">{isAr ? 'اختر كل العناصر الأربعة' : 'Select all 4 elements'}</p>
                )}
              </div>
            </>
          ) : (
            /* Story Result */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-violet-200"
            >
              {/* Story emojis */}
              <div className="flex justify-center gap-2 mb-4">
                {['character', 'setting', 'action', 'ending'].map(cat => {
                  const part = selectedParts[cat]
                  return part ? (
                    <motion.span
                      key={cat}
                      className="text-4xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {part.emoji}
                    </motion.span>
                  ) : null
                })}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-violet-900 text-center mb-4">
                {storyTitle || (isAr ? 'قصتي الرائعة' : 'My Wonderful Story')}
              </h2>

              {/* Story text */}
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
                <p className="text-violet-900 leading-loose text-base md:text-lg text-center" dir={isAr ? 'rtl' : 'ltr'}>
                  {getStoryText()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={downloadStory}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-semibold shadow-md hover:shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  {isAr ? 'حمّل قصتي' : 'Download'}
                </button>
                <button
                  onClick={restart}
                  className="flex items-center gap-2 px-5 py-2.5 bg-violet-100 text-violet-700 rounded-xl font-semibold hover:bg-violet-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  {isAr ? 'قصة جديدة' : 'New Story'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
