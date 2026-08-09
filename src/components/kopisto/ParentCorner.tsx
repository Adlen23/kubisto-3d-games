'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import {
  BarChart3, BookOpen, Video, Lightbulb, Award,
  MessageCircle, TrendingUp, ShoppingBag, Camera,
  Sparkles, Send, Download, Upload, Play, Star,
  ChevronDown, Clock, BookMarked, Palette, Rocket,
  Calculator, Heart, Brain, Eye, Users, Lock,
  Trophy, Target, Zap, Feather, Baby, GraduationCap,
  Shield, Moon, Globe, Music, TreePine, Fish,
  Gift, Stamp, Crown, FileText, Image as ImageIcon,
  CheckCircle2, X, Plus, ChevronLeft, ChevronRight,
  Calendar, ClipboardList, School, Smartphone, Trash2,
  Flame, Medal, ThumbsUp, Bell, Bookmark, Share2,
  BookHeart, PencilRuler, Utensils, Dumbbell, Languages,
  AlarmClock, Wifi, Settings, Crown as CrownIcon, Printer,
  Smile, Frown, Meh, ClipboardCheck, PenTool, BookCheck,
  Filter, Eye as EyeIcon, ShieldCheck, MessageSquare, UserCog
} from 'lucide-react'
import Image from 'next/image'

// ========================
// Types
// ========================
type TabId = 'progress' | 'storyCreator' | 'videos' | 'tips' | 'certificates' | 'assistant' | 'weeklyReport' | 'store' | 'memoryBox' | 'childDashboard' | 'contentControl' | 'writingSkills' | 'readingLog' | 'tutorFeedback'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface MemoryItem {
  id: string
  type: 'photo' | 'drawing' | 'achievement'
  url: string
  caption: string
  date: string
}

// ========================
// Tab Configuration
// ========================
const tabConfig: Array<{ id: TabId; icon: React.ReactNode; color: string; emoji: string }> = [
  { id: 'progress', icon: <BarChart3 className="w-5 h-5" />, color: 'from-sky-400 to-sky-600', emoji: '📊' },
  { id: 'childDashboard', icon: <ClipboardCheck className="w-5 h-5" />, color: 'from-indigo-400 to-blue-600', emoji: '📋' },
  { id: 'storyCreator', icon: <BookOpen className="w-5 h-5" />, color: 'from-orange-400 to-amber-500', emoji: '📖' },
  { id: 'writingSkills', icon: <PenTool className="w-5 h-5" />, color: 'from-fuchsia-400 to-purple-600', emoji: '✍️' },
  { id: 'readingLog', icon: <BookCheck className="w-5 h-5" />, color: 'from-lime-400 to-green-600', emoji: '📚' },
  { id: 'videos', icon: <Video className="w-5 h-5" />, color: 'from-rose-400 to-pink-600', emoji: '🎬' },
  { id: 'tips', icon: <Lightbulb className="w-5 h-5" />, color: 'from-yellow-400 to-amber-500', emoji: '💡' },
  { id: 'tutorFeedback', icon: <MessageSquare className="w-5 h-5" />, color: 'from-teal-400 to-cyan-600', emoji: '💬' },
  { id: 'certificates', icon: <Award className="w-5 h-5" />, color: 'from-emerald-400 to-teal-600', emoji: '🏆' },
  { id: 'assistant', icon: <MessageCircle className="w-5 h-5" />, color: 'from-violet-400 to-purple-600', emoji: '🤖' },
  { id: 'contentControl', icon: <ShieldCheck className="w-5 h-5" />, color: 'from-red-400 to-rose-600', emoji: '🛡️' },
  { id: 'weeklyReport', icon: <TrendingUp className="w-5 h-5" />, color: 'from-cyan-400 to-sky-600', emoji: '📈' },
  { id: 'store', icon: <ShoppingBag className="w-5 h-5" />, color: 'from-orange-400 to-red-500', emoji: '🛒' },
  { id: 'memoryBox', icon: <Camera className="w-5 h-5" />, color: 'from-pink-400 to-rose-600', emoji: '📸' },
]

// ========================
// Mock Data
// ========================
const mockProgress = {
  gamesCompleted: 12,
  skillsLearned: 8,
  readingLevel: 'advanced' as const,
  mathLevel: 'intermediate' as const,
  storiesRead: 7,
  newWords: 15,
  tasksThisWeek: 12,
  badge: 'explorerBadge',
  totalStars: 47,
  level: 5,
  scienceLevel: 'advanced' as const,
  artLevel: 'intermediate' as const,
}

const mockWeeklyData = [
  { day: 'sat', minutes: 15, games: 2 },
  { day: 'sun', minutes: 25, games: 3 },
  { day: 'mon', minutes: 10, games: 1 },
  { day: 'tue', minutes: 30, games: 4 },
  { day: 'wed', minutes: 20, games: 2 },
  { day: 'thu', minutes: 35, games: 5 },
  { day: 'fri', minutes: 18, games: 2 },
]

const mockActivities = [
  { type: 'game', title: 'عدّاء كوبيستو', time: 'منذ 2 ساعة', stars: 3, icon: '🎮' },
  { type: 'story', title: 'مغامرة في الفضاء', time: 'منذ 5 ساعات', stars: 5, icon: '📖' },
  { type: 'badge', title: 'شارة مستكشف العلوم', time: 'أمس', stars: 0, icon: '🏅' },
  { type: 'game', title: 'تحدي الرياضيات', time: 'أمس', stars: 4, icon: '🎮' },
  { type: 'word', title: 'تعلم 5 كلمات جديدة', time: 'منذ يومين', stars: 2, icon: '📝' },
]

const mockSkillRadar = [
  { skill: 'math', value: 75 },
  { skill: 'reading', value: 85 },
  { skill: 'science', value: 90 },
  { skill: 'art', value: 65 },
  { skill: 'logic', value: 70 },
  { skill: 'memory', value: 80 },
]

// ========================
// Main Component
// ========================
export default function ParentCorner() {
  const { t, isAr } = useLanguage()
  const pc = t.parentCorner
  const [activeTab, setActiveTab] = useState<TabId>('progress')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-sky-50 via-white to-sky-50/30 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-[20%] text-4xl opacity-10 animate-float-slow">👨‍👩‍👧‍👦</div>
        <div className="absolute top-20 right-[15%] text-3xl opacity-10 animate-float-slow" style={{ animationDelay: '1s' }}>🌟</div>
        <div className="absolute bottom-20 left-[10%] text-3xl opacity-10 animate-float-slow" style={{ animationDelay: '2s' }}>📚</div>
        <div className="absolute top-40 right-[30%] text-2xl opacity-10 animate-float-slow" style={{ animationDelay: '3s' }}>🎯</div>
        <div className="absolute bottom-40 right-[20%] text-2xl opacity-10 animate-float-slow" style={{ animationDelay: '1.5s' }}>✨</div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-sky-200 mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-2xl">🏡</span>
            <h1 className="text-2xl md:text-3xl font-bold">
              {pc.title}{' '}
              <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                {pc.titleHighlight}
              </span>
            </h1>
          </motion.div>
          <p className="text-sky-600/70 text-lg max-w-2xl mx-auto">
            {pc.subtitle}
          </p>
        </motion.div>

        {/* Tab Navigation - Desktop */}
        <div className="hidden lg:block mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-sky-100">
            <div className="flex flex-wrap justify-center gap-1.5">
              {tabConfig.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : 'text-sky-700 hover:bg-sky-50'
                  }`}
                  whileHover={{ scale: activeTab === tab.id ? 1 : 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-base">{tab.emoji}</span>
                  {pc.tabs[tab.id]}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation - Mobile */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-sky-100 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{tabConfig.find(t => t.id === activeTab)?.emoji}</span>
              <span className="font-semibold text-sky-700">{pc.tabs[activeTab]}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-sky-400 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-2 bg-white rounded-xl border border-sky-100 shadow-lg z-50"
              >
                <div className="p-2 grid grid-cols-3 gap-1">
                  {tabConfig.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false) }}
                      className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r ${tab.color} text-white`
                          : 'text-sky-700 hover:bg-sky-50'
                      }`}
                    >
                      <span className="text-lg">{tab.emoji}</span>
                      {pc.tabs[tab.id]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'progress' && <ProgressSection />}
            {activeTab === 'storyCreator' && <StoryCreatorSection />}
            {activeTab === 'videos' && <VideosSection />}
            {activeTab === 'tips' && <TipsSection />}
            {activeTab === 'certificates' && <CertificatesSection />}
            {activeTab === 'assistant' && <AssistantSection />}
            {activeTab === 'weeklyReport' && <WeeklyReportSection />}
            {activeTab === 'store' && <StoreSection />}
            {activeTab === 'memoryBox' && <MemoryBoxSection />}
            {activeTab === 'childDashboard' && <ChildDashboardSection />}
            {activeTab === 'contentControl' && <ContentControlSection />}
            {activeTab === 'writingSkills' && <WritingSkillsSection />}
            {activeTab === 'readingLog' && <ReadingLogSection />}
            {activeTab === 'tutorFeedback' && <TutorFeedbackSection />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ========================
// 1. Progress Section (Enhanced)
// ========================
function ProgressSection() {
  const { t, isAr } = useLanguage()
  const pc = t.parentCorner.progress

  const levelColor = (level: string) => {
    switch (level) {
      case 'advanced': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'intermediate': return 'bg-amber-100 text-amber-700 border-amber-200'
      default: return 'bg-sky-100 text-sky-700 border-sky-200'
    }
  }

  const levelLabel = (level: string) => {
    switch (level) {
      case 'advanced': return pc.advanced
      case 'intermediate': return pc.intermediate
      default: return pc.beginner
    }
  }

  const levelPercent = (level: string) => {
    switch (level) {
      case 'advanced': return 85
      case 'intermediate': return 60
      default: return 30
    }
  }

  const stats = [
    { icon: <Rocket className="w-6 h-6" />, value: mockProgress.gamesCompleted, label: pc.gamesCompleted, color: 'from-sky-400 to-sky-600', bg: 'bg-sky-50' },
    { icon: <Star className="w-6 h-6" />, value: mockProgress.skillsLearned, label: pc.skillsLearned, color: 'from-amber-400 to-amber-600', bg: 'bg-amber-50' },
    { icon: <BookOpen className="w-6 h-6" />, value: mockProgress.storiesRead, label: pc.storiesRead, color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50' },
    { icon: <Sparkles className="w-6 h-6" />, value: mockProgress.newWords, label: pc.newWords, color: 'from-violet-400 to-purple-600', bg: 'bg-violet-50' },
  ]

  const levels = [
    { name: pc.readingLevel, level: mockProgress.readingLevel, icon: <BookMarked className="w-5 h-5" />, color: 'from-emerald-400 to-teal-600', percent: levelPercent(mockProgress.readingLevel) },
    { name: pc.mathLevel, level: mockProgress.mathLevel, icon: <Calculator className="w-5 h-5" />, color: 'from-sky-400 to-sky-600', percent: levelPercent(mockProgress.mathLevel) },
    { name: pc.scienceLevel || pc.readingLevel, level: mockProgress.scienceLevel, icon: <Globe className="w-5 h-5" />, color: 'from-emerald-400 to-teal-600', percent: levelPercent(mockProgress.scienceLevel) },
    { name: pc.artLevel || pc.mathLevel, level: mockProgress.artLevel, icon: <Palette className="w-5 h-5" />, color: 'from-pink-400 to-rose-600', percent: levelPercent(mockProgress.artLevel) },
  ]

  return (
    <div className="space-y-6">
      {/* Child Profile Hero Card */}
      <motion.div
        className="bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-sky-200/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute top-4 right-4 text-6xl opacity-10">🚀</div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-lg">
              <Image src="/kopisto-idle-256.png" alt="Kopisto" width={80} height={80} className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold">{isAr ? 'أحمد' : 'Ahmed'}</h3>
              <p className="text-white/80 text-sm mt-1">{pc.level} {mockProgress.level} • {mockProgress.totalStars} ⭐</p>
              <div className="flex items-center gap-2 mt-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 w-fit">
                <span className="text-lg">🏅</span>
                <span className="font-semibold text-sm">{pc.explorerBadge}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-white/70 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Skill Levels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {levels.map((item, i) => (
          <motion.div
            key={item.name}
            className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md`}>
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-sky-900">{item.name}</div>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${levelColor(item.level)}`}>
                    {levelLabel(item.level)}
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-sky-900">{item.percent}%</span>
            </div>
            <div className="bg-sky-50 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${item.percent}%` }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-bold text-sky-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-500" />
          {pc.recentActivity || (isAr ? 'النشاط الأخير' : 'Recent Activity')}
        </h4>
        <div className="space-y-3">
          {mockActivities.map((activity, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-sky-50/50 hover:bg-sky-50 transition-colors"
              initial={{ opacity: 0, x: isAr ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
            >
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sky-900 text-sm truncate">{activity.title}</p>
                <p className="text-sky-400 text-xs">{activity.time}</p>
              </div>
              {activity.stars > 0 && (
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-sm font-bold">{activity.stars}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ========================
// 2. Story Creator Section (Enhanced)
// ========================
function StoryCreatorSection() {
  const { t, isAr } = useLanguage()
  const pc = t.parentCorner.storyCreator
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')
  const [storyIdea, setStoryIdea] = useState('')
  const [storyType, setStoryType] = useState<'adventure' | 'bedtime' | 'educational' | 'fantasy' | 'friendship'>('adventure')
  const [story, setStory] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [storyHistory, setStoryHistory] = useState<Array<{ title: string; date: string }>>([])
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [generationStep, setGenerationStep] = useState<string>('')
  const [generatedStory, setGeneratedStory] = useState<{
    title: string
    pages: Array<{
      pageNumber: number
      textAr: string
      textEn: string
      imagePrompt: string
      imageUrl: string | null
      imageGenerated: boolean
    }>
  } | null>(null)
  const [currentStoryPage, setCurrentStoryPage] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const storyTypes = [
    { id: 'adventure' as const, emoji: '🗺️', color: 'from-orange-400 to-amber-500', label: isAr ? 'مغامرة' : 'Adventure' },
    { id: 'bedtime' as const, emoji: '🌙', color: 'from-indigo-400 to-purple-600', label: isAr ? 'قبل النوم' : 'Bedtime' },
    { id: 'educational' as const, emoji: '🎓', color: 'from-emerald-400 to-teal-600', label: isAr ? 'تعليمية' : 'Educational' },
    { id: 'fantasy' as const, emoji: '✨', color: 'from-fuchsia-400 to-pink-600', label: isAr ? 'خيالية' : 'Fantasy' },
    { id: 'friendship' as const, emoji: '🤝', color: 'from-rose-400 to-red-500', label: isAr ? 'صداقة' : 'Friendship' },
  ]

  // معالجة رفع الصورة
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // التحقق من النوع والحجم
    if (!file.type.startsWith('image/')) {
      setError(isAr ? 'الرجاء اختيار صورة' : 'Please select an image')
      return
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError(isAr ? 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' : 'Image must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setReferenceImage(result)
      setImagePreview(result)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setReferenceImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleGenerate = async () => {
    if (!childName || !storyIdea || !referenceImage) return
    setGenerating(true)
    setError('')
    setStory('')
    setGeneratedStory(null)
    setCurrentStoryPage(0)

    try {
      setGenerationStep(isAr ? 'يكتب كوبيستو القصة...' : 'Kopisto is writing the story...')

      const res = await fetch('/api/generate-story-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName,
          childAge,
          storyIdea,
          storyType,
          referenceImage,
          language: isAr ? 'ar' : 'en',
        }),
      })
      const data = await res.json()

      if (data.error) {
        setError(pc.errorGenerate)
      } else if (data.pages) {
        setGenerationStep(isAr ? 'يرسم كوبيستو الصور...' : 'Kopisto is drawing pictures...')
        setGeneratedStory(data)
        setStoryHistory(prev => [{
          title: data.title || (isAr ? 'قصة جديدة' : 'New Story'),
          date: new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US')
        }, ...prev.slice(0, 4)])
      }
    } catch {
      setError(pc.errorGenerate)
    } finally {
      setGenerating(false)
      setGenerationStep('')
    }
  }

  // طريقة قديمة للنص فقط (fallback)
  const handleGenerateTextOnly = async () => {
    if (!childName || !childAge || !storyIdea) return
    setGenerating(true)
    setError('')

    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childName,
          childAge,
          hobbies: storyIdea,
          storyType,
          language: isAr ? 'ar' : 'en',
        }),
      })
      const data = await res.json()
      if (data.error) {
        setError(pc.errorGenerate)
      } else {
        setStory(data.story)
      }
    } catch {
      setError(pc.errorGenerate)
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadPdf = () => {
    const content = generatedStory
      ? `${generatedStory.title}\n\n${generatedStory.pages.map(p => isAr ? p.textAr : p.textEn).join('\n\n')}`
      : story
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${childName || 'kopisto'}-story.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="bg-white rounded-3xl p-6 md:p-8 border border-sky-100 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white shadow-lg">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-sky-900">{pc.title}</h3>
            <p className="text-sky-500/70 text-sm">{pc.subtitle}</p>
          </div>
        </div>

        {/* رفع صورة الطفل - المرجع للشخصية */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-sky-800 mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4 text-orange-500" />
            {isAr ? '📷 صورة طفلك (سيكون بطل القصة!)' : "📷 Your child's photo (will be the hero!)"}
          </label>

          {!imagePreview ? (
            <motion.div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-orange-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-orange-50 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <motion.div
                className="text-5xl mb-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📸
              </motion.div>
              <p className="text-sky-700 font-semibold mb-1">
                {isAr ? 'اضغط لرفع صورة طفلك' : 'Click to upload your child\'s photo'}
              </p>
              <p className="text-sky-400 text-xs">
                {isAr ? '(JPG, PNG - حد أقصى 5 ميجابايت)' : '(JPG, PNG - Max 5MB)'}
              </p>
            </motion.div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border-2 border-orange-200 shadow-md">
              <div className="relative w-full h-48">
                <img
                  src={imagePreview}
                  alt={isAr ? 'صورة الطفل' : 'Child photo'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {isAr ? 'الصورة جاهزة' : 'Photo ready'}
                </div>
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 left-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50">
                <p className="text-xs text-orange-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {isAr
                    ? '🌟 طفلك سيكون بطل القصة!'
                    : '🌟 Your child will be the story hero!'}
                </p>
              </div>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Story Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-sky-800 mb-3">
            {pc.storyType || (isAr ? 'نوع القصة' : 'Story Type')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {storyTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => setStoryType(type.id)}
                className={`p-3 rounded-2xl text-center transition-all border-2 ${
                  storyType === type.id
                    ? `bg-gradient-to-br ${type.color} text-white border-transparent shadow-lg`
                    : 'bg-white border-sky-100 text-sky-700 hover:border-sky-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl block mb-1">{type.emoji}</span>
                <span className="text-xs font-bold">{type.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-sky-800 mb-2">{pc.childName}</label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder={pc.childNamePlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sky-900 placeholder:text-sky-300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-sky-800 mb-2">{pc.childAge}</label>
            <input
              type="text"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              placeholder={pc.childAgePlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sky-900 placeholder:text-sky-300"
            />
          </div>
        </div>

        {/* فكرة القصة */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-sky-800 mb-2">
            {isAr ? '💭 فكرة القصة' : '💭 Story Idea'}
          </label>
          <textarea
            value={storyIdea}
            onChange={(e) => setStoryIdea(e.target.value)}
            placeholder={isAr
              ? 'مثال: ذهب طفلي في رحلة إلى الفضاء واكتشف كوكباً جديداً...'
              : 'e.g., My child went on a space journey and discovered a new planet...'
            }
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-sky-900 placeholder:text-sky-300 resize-none"
          />
        </div>

        {/* أزرار الإنشاء */}
        <div className="space-y-3">
          <motion.button
            onClick={handleGenerate}
            disabled={generating || !childName || !storyIdea || !referenceImage}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all text-lg ${
              generating || !childName || !storyIdea || !referenceImage
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-xl'
            }`}
            whileHover={!generating && childName && storyIdea && referenceImage ? { scale: 1.02 } : {}}
            whileTap={!generating && childName && storyIdea && referenceImage ? { scale: 0.98 } : {}}
          >
            {generating ? (
              <>
                <motion.div
                  className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                {generationStep || pc.generating}
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                {isAr ? '✨ أنشئ قصة مصورة بطفلي!' : '✨ Create illustrated story!'}
              </>
            )}
          </motion.button>

          {/* زر بديل: قصة نصية فقط */}
          <button
            onClick={handleGenerateTextOnly}
            disabled={generating || !childName || !childAge || !storyIdea}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
              generating || !childName || !childAge || !storyIdea
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            {isAr ? '📝 أو أنشئ قصة نصية فقط (بدون صورة)' : '📝 Or text-only story (no photo)'}
          </button>
        </div>

        {error && (
          <motion.div
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* القصة المصورة الناتجة */}
      {generatedStory && (
        <motion.div
          className="bg-white rounded-3xl p-6 md:p-8 border-2 border-orange-200 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h4 className="text-lg font-bold text-sky-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              {generatedStory.title}
            </h4>
            <motion.button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-semibold text-sm shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              {pc.downloadPdf}
            </motion.button>
          </div>

          {/* عرض القصة ككتاب */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-inner">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStoryPage}
                initial={{ opacity: 0, rotateY: isAr ? 15 : -15, x: 50 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: isAr ? -15 : 15, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {/* صورة الصفحة */}
                <div className="mb-4 flex justify-center">
                  {generatedStory.pages[currentStoryPage]?.imageUrl ? (
                    <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={generatedStory.pages[currentStoryPage].imageUrl!}
                        alt={`Page ${currentStoryPage + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-md aspect-square rounded-2xl bg-gradient-to-br from-orange-200 via-amber-200 to-yellow-200 flex items-center justify-center shadow-lg relative overflow-hidden">
                      {/* placeholder ملون عند عدم توفر صورة */}
                      <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                      }} />
                      <div className="text-center relative z-10">
                        <motion.div
                          className="text-8xl mb-2"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {['🌟', '🎨', '✨', '📚'][currentStoryPage % 4]}
                        </motion.div>
                        <p className="text-orange-700 text-sm font-semibold px-4">
                          {isAr ? '🖼️ صورة القصة' : '🖼️ Story illustration'}
                        </p>
                        <p className="text-orange-600 text-xs mt-1 px-4">
                          {isAr ? 'سيتم تفعيلها مع KIE.AI' : 'Will be enabled with KIE.AI'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* نص الصفحة */}
                <div className="text-center">
                  <p className="text-sky-900 leading-loose text-base md:text-lg font-medium" dir={isAr ? 'rtl' : 'ltr'}>
                    {isAr
                      ? generatedStory.pages[currentStoryPage]?.textAr
                      : generatedStory.pages[currentStoryPage]?.textEn
                    }
                  </p>
                </div>

                {/* رقم الصفحة */}
                <div className="text-center mt-4 text-orange-500 text-sm font-semibold">
                  {currentStoryPage + 1} / {generatedStory.pages.length}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* أزرار التنقل */}
            <div className="flex items-center justify-between mt-6">
              <motion.button
                onClick={() => setCurrentStoryPage(p => Math.max(0, p - 1))}
                disabled={currentStoryPage === 0}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  currentStoryPage === 0
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-white text-orange-600 hover:bg-orange-100 shadow-sm'
                }`}
                whileHover={currentStoryPage !== 0 ? { scale: 1.05 } : {}}
              >
                {isAr ? '→ السابق' : '← Previous'}
              </motion.button>

              <div className="flex gap-1.5">
                {generatedStory.pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStoryPage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentStoryPage
                        ? 'w-6 bg-orange-500'
                        : 'bg-orange-200 hover:bg-orange-300'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                onClick={() => setCurrentStoryPage(p => Math.min(generatedStory.pages.length - 1, p + 1))}
                disabled={currentStoryPage === generatedStory.pages.length - 1}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  currentStoryPage === generatedStory.pages.length - 1
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-white text-orange-600 hover:bg-orange-100 shadow-sm'
                }`}
                whileHover={currentStoryPage !== generatedStory.pages.length - 1 ? { scale: 1.05 } : {}}
              >
                {isAr ? 'التالي ←' : 'Next →'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* نتيجة القصة النصية فقط */}
      {story && !generatedStory && (
        <motion.div
          className="bg-white rounded-3xl p-6 md:p-8 border-2 border-orange-200 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-sky-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              {pc.storyResult}
            </h4>
            <motion.button
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-semibold text-sm shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              {pc.downloadPdf}
            </motion.button>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 max-h-[500px] overflow-y-auto shadow-inner">
            <div className="text-sky-900 leading-loose whitespace-pre-wrap text-sm md:text-base" dir={isAr ? 'rtl' : 'ltr'}>
              {story}
            </div>
          </div>
        </motion.div>
      )}

      {/* Story History */}
      {storyHistory.length > 0 && (
        <motion.div
          className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h4 className="font-bold text-sky-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-500" />
            {pc.storyHistory || (isAr ? 'القصص السابقة' : 'Story History')}
          </h4>
          <div className="space-y-2">
            {storyHistory.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-sky-50/50 text-sm">
                <span className="font-medium text-sky-900 truncate">{item.title}</span>
                <span className="text-sky-400 text-xs">{item.date}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* معلومات KIE.AI */}
      <motion.div
        className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 border border-violet-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-violet-900 mb-1 text-sm">
              {isAr ? '🚀 ميزة الصور الذكية (قريباً)' : '🚀 AI Image Feature (Coming Soon)'}
            </h4>
            <p className="text-violet-700 text-xs leading-relaxed">
              {isAr
                ? 'سيتم تفعيل توليد صور حقيقية لطفلك داخل القصة باستخدام KIE.AI API (GPT-IMAGE-1 / Nano Banana). سيرى طفلك نفسه بطلاً للقصة برسوم كرتونية جميلة!'
                : 'Real image generation of your child inside the story will be enabled using KIE.AI API (GPT-IMAGE-1 / Nano Banana). Your child will see themselves as the story hero with beautiful cartoon illustrations!'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ========================
// 3. Videos Section (Enhanced)
// ========================
function VideosSection() {
  const { t, isAr } = useLanguage()
  const pc = t.parentCorner.videos
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const videoTypes = [
    {
      title: pc.encouragement,
      desc: pc.encouragementDesc,
      color: 'from-rose-400 to-pink-600',
      emoji: '💪',
      preview: isAr ? 'أحسنت يا بطل! استمر في التعلم!' : 'Great job champion! Keep learning!',
    },
    {
      title: pc.birthday,
      desc: pc.birthdayDesc,
      color: 'from-amber-400 to-orange-500',
      emoji: '🎂',
      preview: isAr ? 'عيد ميلاد سعيد! 🎉' : 'Happy Birthday! 🎉',
    },
    {
      title: pc.motivational,
      desc: pc.motivationalDesc,
      color: 'from-sky-400 to-cyan-600',
      emoji: '🚀',
      preview: isAr ? 'أنتم المستقبل! 🌟' : 'You are the future! 🌟',
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        className="bg-white rounded-3xl p-6 md:p-8 border border-sky-100 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center text-white shadow-lg">
            <Video className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-sky-900">{pc.title}</h3>
            <p className="text-sky-500/70 text-sm">{pc.subtitle}</p>
          </div>
        </div>

        {/* Upload area */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          className="border-2 border-dashed border-sky-200 rounded-2xl p-8 text-center hover:border-sky-400 transition-colors cursor-pointer bg-sky-50/50 relative overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadedImage ? (
            <div className="flex flex-col items-center gap-3">
              <img src={uploadedImage} alt="Uploaded" className="w-24 h-24 rounded-2xl object-cover shadow-md" />
              <p className="text-sky-600 font-semibold text-sm">{isAr ? 'تم رفع الصورة بنجاح!' : 'Photo uploaded!'}</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-sky-400 mb-3" />
              <p className="text-sky-600 font-semibold mb-1">{pc.uploadPhoto}</p>
              <p className="text-sky-400 text-sm">{pc.uploadPlaceholder}</p>
            </>
          )}
        </div>
      </motion.div>

      {/* Video Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {videoTypes.map((video, i) => (
          <motion.div
            key={video.title}
            className="bg-white rounded-2xl overflow-hidden border border-sky-100 shadow-sm hover:shadow-lg transition-all group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`bg-gradient-to-br ${video.color} p-8 text-white relative min-h-[180px] flex flex-col justify-between`}>
              <div className="absolute top-3 end-3">
                <span className="bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold">{pc.comingSoon}</span>
              </div>
              <span className="text-5xl">{video.emoji}</span>
              <div className="mt-3 bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-sm font-semibold">{video.preview}</p>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sky-900 mb-1">{video.title}</h4>
              <p className="text-sky-500/70 text-sm mb-3">{video.desc}</p>
              <button
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-100 to-sky-200 text-sky-500 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                disabled
              >
                <Lock className="w-4 h-4" />
                {pc.comingSoon}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ========================
// 4. Tips Section (Enhanced)
// ========================
function TipsSection() {
  const { t, isAr } = useLanguage()
  const pc = t.parentCorner.tips
  const [expandedTip, setExpandedTip] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'reading' | 'behavior' | 'learning'>('all')

  const tipsData = [
    { title: pc.tip1, desc: pc.tip1Desc, color: 'from-sky-400 to-sky-600', emoji: '📖', category: 'reading' as const },
    { title: pc.tip2, desc: pc.tip2Desc, color: 'from-amber-400 to-orange-500', emoji: '📱', category: 'behavior' as const },
    { title: pc.tip3, desc: pc.tip3Desc, color: 'from-rose-400 to-pink-600', emoji: '💪', category: 'behavior' as const },
    { title: pc.tip4, desc: pc.tip4Desc, color: 'from-emerald-400 to-teal-600', emoji: '🔢', category: 'learning' as const },
    { title: pc.tip5, desc: pc.tip5Desc, color: 'from-violet-400 to-purple-600', emoji: '🧘', category: 'behavior' as const },
    { title: pc.tip6, desc: pc.tip6Desc, color: 'from-pink-400 to-rose-600', emoji: '🎨', category: 'learning' as const },
    { title: pc.tip7, desc: pc.tip7Desc, color: 'from-cyan-400 to-sky-600', emoji: '🎯', category: 'learning' as const },
    { title: pc.tip8, desc: pc.tip8Desc, color: 'from-orange-400 to-amber-600', emoji: '🤗', category: 'behavior' as const },
  ]

  const filteredTips = filter === 'all' ? tipsData : tipsData.filter(t => t.category === filter)
  const filters = [
    { id: 'all' as const, label: isAr ? 'الكل' : 'All' },
    { id: 'reading' as const, label: isAr ? 'القراءة' : 'Reading' },
    { id: 'behavior' as const, label: isAr ? 'السلوك' : 'Behavior' },
    { id: 'learning' as const, label: isAr ? 'التعلم' : 'Learning' },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-lg">
            <Lightbulb className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-sky-900">{pc.title}</h3>
            <p className="text-sky-500/70 text-sm">{pc.subtitle}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-1.5 bg-sky-50 p-1 rounded-xl">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f.id
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-sky-500 hover:text-sky-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredTips.map((tip, i) => {
            const originalIndex = tipsData.indexOf(tip)
            return (
              <motion.div
                key={tip.title}
                className="bg-white rounded-2xl border border-sky-100 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setExpandedTip(expandedTip === originalIndex ? null : originalIndex)}
                layout
              >
                <div className={`bg-gradient-to-br ${tip.color} p-5 flex items-start justify-between`}>
                  <span className="text-3xl">{tip.emoji}</span>
                  <div className="flex items-center gap-1 text-white/80 text-xs bg-white/15 rounded-full px-2 py-0.5">
                    <Clock className="w-3 h-3" />
                    1 {pc.minuteRead}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-sky-900 text-sm mb-2 leading-tight">{tip.title}</h4>
                  <AnimatePresence>
                    {expandedTip === originalIndex ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sky-600/80 text-xs leading-relaxed">{tip.desc}</p>
                      </motion.div>
                    ) : (
                      <motion.p
                        className="text-sky-400 text-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {pc.readMore}...
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ========================
// 5. Certificates Section (Enhanced)
// ========================
function CertificatesSection() {
  const { t, isAr } = useLanguage()
  const pc = t.parentCorner.certificates
  const [childName, setChildName] = useState(isAr ? 'أحمد' : 'Ahmed')
  const [selectedCert, setSelectedCert] = useState<number>(0)
  const certRef = useRef<HTMLDivElement>(null)

  const certificates = [
    {
      title: pc.bestReader,
      desc: pc.bestReaderDesc,
      icon: '📚',
      color: 'from-sky-400 to-sky-600',
      borderColor: 'border-sky-300',
      bgGradient: 'from-sky-50 via-white to-sky-50',
      accent: 'sky',
      stars: 5,
    },
    {
      title: pc.mathChampion,
      desc: pc.mathChampionDesc,
      icon: '🏆',
      color: 'from-amber-400 to-orange-500',
      borderColor: 'border-amber-300',
      bgGradient: 'from-amber-50 via-white to-amber-50',
      accent: 'amber',
      stars: 5,
    },
    {
      title: pc.scienceExplorer,
      desc: pc.scienceExplorerDesc,
      icon: '🔬',
      color: 'from-emerald-400 to-teal-600',
      borderColor: 'border-emerald-300',
      bgGradient: 'from-emerald-50 via-white to-emerald-50',
      accent: 'emerald',
      stars: 5,
    },
  ]

  const handleDownload = useCallback(() => {
    // Simple text download as certificate
    const cert = certificates[selectedCert]
    const text = `
${'═'.repeat(40)}
    ${cert.title}
${'═'.repeat(40)}

${'★'.repeat(cert.stars)}

    ${childName || (isAr ? 'اسم الطفل' : 'Child Name')}

${isAr ? 'تهنئة من كوبيستو على إنجازك الرائع!' : 'Congratulations from Kopisto on your amazing achievement!'}

${cert.desc}

${'─'.repeat(40)}
Kopisto © ${new Date().getFullYear()}
${'═'.repeat(40)}
`.trim()

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${childName || 'certificate'}-${cert.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [selectedCert, childName, certificates, isAr])

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center gap-3 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg">
          <Award className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-sky-900">{pc.title}</h3>
          <p className="text-sky-500/70 text-sm">{pc.subtitle}</p>
        </div>
      </motion.div>

      {/* Name input */}
      <motion.div
        className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm flex flex-col sm:flex-row gap-3 items-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-sky-800 mb-2">{pc.childName}</label>
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder={pc.childNamePlaceholder}
            className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sky-900 placeholder:text-sky-300"
          />
        </div>
      </motion.div>

      {/* Certificate selector and preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificate list */}
        <div className="space-y-3">
          {certificates.map((cert, i) => (
            <motion.div
              key={i}
              className={`rounded-2xl p-5 cursor-pointer transition-all ${
                selectedCert === i
                  ? `bg-gradient-to-r ${cert.color} text-white shadow-lg`
                  : 'bg-white border border-sky-100 shadow-sm hover:shadow-md'
              }`}
              initial={{ opacity: 0, x: isAr ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedCert(i)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{cert.icon}</span>
                <div className="flex-1">
                  <h4 className={`font-bold text-lg ${selectedCert === i ? 'text-white' : 'text-sky-900'}`}>{cert.title}</h4>
                  <p className={`text-sm mt-1 ${selectedCert === i ? 'text-white/80' : 'text-sky-500/70'}`}>{cert.desc}</p>
                </div>
                {selectedCert === i && <CheckCircle2 className="w-6 h-6 text-white" />}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certificate Preview */}
        <motion.div
          className={`bg-gradient-to-br ${certificates[selectedCert].bgGradient} rounded-2xl border-2 ${certificates[selectedCert].borderColor} p-8 shadow-lg relative overflow-hidden`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          key={selectedCert}
          ref={certRef}
        >
          {/* Decorative elements */}
          <div className="absolute top-6 start-6 w-10 h-10 border-t-3 border-s-3 border-sky-300/60 rounded-tl-lg" />
          <div className="absolute top-6 end-6 w-10 h-10 border-t-3 border-e-3 border-sky-300/60 rounded-tr-lg" />
          <div className="absolute bottom-6 start-6 w-10 h-10 border-b-3 border-s-3 border-sky-300/60 rounded-bl-lg" />
          <div className="absolute bottom-6 end-6 w-10 h-10 border-b-3 border-e-3 border-sky-300/60 rounded-br-lg" />

          {/* Kopisto watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
            <Image src="/kopisto-idle-256.png" alt="" width={200} height={200} className="w-40 h-40 object-contain" />
          </div>

          <div className="text-center relative z-10">
            <div className="text-6xl mb-4">{certificates[selectedCert].icon}</div>
            <div className="text-amber-400 text-lg font-bold mb-3">
              {'★'.repeat(certificates[selectedCert].stars)}
            </div>
            <h4 className="text-xl font-bold text-sky-900 mb-2">{certificates[selectedCert].title}</h4>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-sky-300 to-transparent mx-auto my-4" />
            <p className="text-3xl font-bold text-sky-800 mb-2">{childName || (isAr ? 'اسم الطفل' : 'Child Name')}</p>
            <p className="text-sky-500/70 text-sm mt-2">{certificates[selectedCert].desc}</p>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-sky-300 to-transparent mx-auto my-4" />
            <p className="text-sky-400 text-sm font-semibold">Kopisto © {new Date().getFullYear()}</p>
          </div>

          <motion.button
            onClick={handleDownload}
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold shadow-lg flex items-center justify-center gap-2 text-lg"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download className="w-5 h-5" />
            {pc.download}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

// ========================
// 6. AI Assistant Section (Enhanced)
// ========================
function AssistantSection() {
  const { t, isAr } = useLanguage()
  const pc = t.parentCorner.assistant
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: pc.welcome },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const suggestedQuestions = isAr ? [
    'ابني عمره 7 سنوات ويكره الرياضيات، ماذا أفعل؟',
    'كيف أجعل طفلي يحب القراءة؟',
    'ابنتي خجولة جداً، كيف أعزز ثقتها بنفسها؟',
    'كم ساعة يجب أن يقضي طفلي أمام الشاشة؟',
  ] : [
    'My 7-year-old hates math, what should I do?',
    'How can I make my child love reading?',
    'My daughter is very shy, how to boost her confidence?',
    'How much screen time should my child have?',
  ]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/parent-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language: isAr ? 'ar' : 'en',
          history,
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: pc.errorReply }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: pc.errorReply }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <div className="space-y-4">
      <motion.div
        className="bg-white rounded-3xl border border-sky-100 shadow-lg overflow-hidden flex flex-col"
        style={{ height: '600px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center overflow-hidden">
              <Image src="/kopisto-idle-256.png" alt="Kopisto" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{pc.title}</h3>
              <p className="text-white/80 text-xs">{pc.subtitle}</p>
            </div>
            <div className="ms-auto flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs">{isAr ? 'متصل' : 'Online'}</span>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="p-3 bg-violet-50/50 border-b border-violet-100">
            <p className="text-xs text-violet-600 font-semibold mb-2">{isAr ? '💡 أسئلة مقترحة:' : '💡 Suggested questions:'}</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="text-xs bg-white text-violet-700 px-3 py-1.5 rounded-full border border-violet-200 hover:bg-violet-100 transition-colors truncate max-w-[200px]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white shadow-sm me-2 mt-1 flex-shrink-0 overflow-hidden">
                  <Image src="/kopisto-idle-256.png" alt="K" width={32} height={32} className="w-full h-full object-contain" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-br-md'
                    : 'bg-sky-50 text-sky-900 rounded-bl-md border border-sky-100'
                }`}
                dir={isAr ? 'rtl' : 'ltr'}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white shadow-sm me-2 mt-1 flex-shrink-0 overflow-hidden">
                <Image src="/kopisto-idle-256.png" alt="K" width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <div className="bg-sky-50 rounded-2xl rounded-bl-md px-4 py-3 border border-sky-100 flex items-center gap-2">
                <motion.div className="flex gap-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      className="w-2 h-2 bg-violet-400 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
                    />
                  ))}
                </motion.div>
                <span className="text-sky-500 text-sm">{pc.thinking}</span>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-sky-100 bg-sky-50/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={pc.placeholder}
              className="flex-1 px-4 py-3 rounded-xl border border-sky-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm text-sky-900 placeholder:text-sky-300"
              disabled={isLoading}
            />
            <motion.button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`px-5 py-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center transition-all ${
                isLoading || !input.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700'
              }`}
              whileHover={!isLoading && input.trim() ? { scale: 1.05 } : {}}
              whileTap={!isLoading && input.trim() ? { scale: 0.95 } : {}}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ========================
// 7. Weekly Report Section (Enhanced)
// ========================
function WeeklyReportSection() {
  const { t, isAr } = useLanguage()
  const pc = t.parentCorner.weeklyReport

  const maxMinutes = Math.max(...mockWeeklyData.map(d => d.minutes))
  const dayLabels: Record<string, string> = {
    sat: pc.sat, sun: pc.sun, mon: pc.mon, tue: pc.tue, wed: pc.wed, thu: pc.thu, fri: pc.fri
  }

  const summaryStats = [
    { value: 5, label: pc.gamesThisWeek, icon: <Rocket className="w-6 h-6" />, color: 'from-sky-400 to-sky-600' },
    { value: 12, label: pc.wordsThisWeek, icon: <BookOpen className="w-6 h-6" />, color: 'from-amber-400 to-amber-600' },
    { value: 40, label: pc.minutesThisWeek, icon: <Clock className="w-6 h-6" />, color: 'from-emerald-400 to-teal-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white bg-gradient-to-br ${stat.color} mb-3 shadow-md`}>
              {stat.icon}
            </div>
            <div className="text-4xl font-bold text-sky-900">{stat.value}</div>
            <div className="text-sm text-sky-500/70 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Daily Activity Chart */}
      <motion.div
        className="bg-white rounded-2xl p-6 border border-sky-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="font-bold text-sky-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-sky-500" />
          {pc.dailyActivity}
        </h4>
        <div className="flex items-end justify-between gap-2 h-48">
          {mockWeeklyData.map((day, i) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-sky-900">{day.minutes}</span>
              <motion.div
                className="w-full rounded-t-lg bg-gradient-to-t from-sky-400 to-sky-500 relative overflow-hidden"
                initial={{ height: 0 }}
                animate={{ height: `${(day.minutes / maxMinutes) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <div className="absolute inset-0 bg-white/10" />
              </motion.div>
              <span className="text-xs text-sky-500 font-medium">{dayLabels[day.day] || day.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Summary */}
      <motion.div
        className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-2xl p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Star className="w-5 h-5" />
          {pc.summary}
        </h4>
        <p className="text-white/90 leading-relaxed">
          {isAr
            ? `هذا الأسبوع أكمل طفلك 5 ألعاب وتعلم 12 كلمة جديدة وقضى 40 دقيقة في الأنشطة التعليمية. أحسن يوم كان الخميس بـ 35 دقيقة نشاط. استمر في تشجيع طفلك! 🌟`
            : `This week your child completed 5 games, learned 12 new words, and spent 40 minutes on educational activities. Best day was Thursday with 35 minutes of activity. Keep encouraging your child! 🌟`
          }
        </p>
      </motion.div>
    </div>
  )
}

// ========================
// 8. Store Section (Enhanced)
// ========================
function StoreSection() {
  const { t, isAr } = useLanguage()
  const pc = t.parentCorner.store

  const products = [
    { title: pc.product1, desc: pc.product1Desc, emoji: '🎨', color: 'from-pink-400 to-rose-600' },
    { title: pc.product2, desc: pc.product2Desc, emoji: '📖', color: 'from-amber-400 to-orange-500' },
    { title: pc.product3, desc: pc.product3Desc, emoji: '🃏', color: 'from-sky-400 to-sky-600' },
    { title: pc.product4, desc: pc.product4Desc, emoji: '🐰', color: 'from-emerald-400 to-teal-600' },
    { title: pc.product5, desc: pc.product5Desc, emoji: '🏷️', color: 'from-violet-400 to-purple-600' },
    { title: pc.product6, desc: pc.product6Desc, emoji: '📓', color: 'from-orange-400 to-red-500' },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center gap-3 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-lg">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-sky-900">{pc.title}</h3>
          <p className="text-sky-500/70 text-sm">{pc.subtitle}</p>
        </div>
        <div className="ms-auto bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">
          {pc.comingSoon}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl overflow-hidden border border-sky-100 shadow-sm hover:shadow-lg transition-all group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className={`bg-gradient-to-br ${product.color} p-8 text-center relative`}>
              <span className="text-5xl block">{product.emoji}</span>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sky-900 mb-1">{product.title}</h4>
              <p className="text-sky-500/70 text-sm mb-3">{product.desc}</p>
              <button className="w-full py-2.5 rounded-xl bg-sky-50 text-sky-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-sky-100 transition-colors">
                <StoreBell className="w-4 h-4" />
                {pc.notify}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Bell icon component for store (local - renamed to avoid conflict with lucide-react Bell)
function StoreBell({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

// ========================
// 9. Memory Box Section (Enhanced)
// ========================
function MemoryBoxSection() {
  const { t, isAr } = useLanguage()
  const pc = t.parentCorner.memoryBox
  const [memories, setMemories] = useState<MemoryItem[]>([
    { id: '1', type: 'achievement', url: '', caption: isAr ? 'شارة مستكشف العلوم' : 'Science Explorer Badge', date: '2026-05-20' },
    { id: '2', type: 'achievement', url: '', caption: isAr ? 'أكمل 10 ألعاب' : 'Completed 10 Games', date: '2026-05-15' },
    { id: '3', type: 'drawing', url: '', caption: isAr ? 'رسمة كوبيستو' : 'Kopisto Drawing', date: '2026-05-10' },
  ])
  const [activeMemoryTab, setActiveMemoryTab] = useState<'all' | 'photos' | 'drawings' | 'achievements'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (type: 'photo' | 'drawing' | 'achievement') => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newMemory: MemoryItem = {
          id: Date.now().toString(),
          type: 'photo',
          url: reader.result as string,
          caption: file.name,
          date: new Date().toISOString().split('T')[0],
        }
        setMemories(prev => [newMemory, ...prev])
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredMemories = activeMemoryTab === 'all'
    ? memories
    : memories.filter(m => m.type === activeMemoryTab.slice(0, -1)) // remove 's'

  const memoryTabs = [
    { id: 'all' as const, label: isAr ? 'الكل' : 'All', emoji: '📁' },
    { id: 'photos' as const, label: pc.photos, emoji: '📷' },
    { id: 'drawings' as const, label: pc.drawings, emoji: '🎨' },
    { id: 'achievements' as const, label: pc.achievements, emoji: '🏅' },
  ]

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <motion.div
        className="flex items-center gap-3 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-600 flex items-center justify-center text-white shadow-lg">
          <Camera className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-sky-900">{pc.title}</h3>
          <p className="text-sky-500/70 text-sm">{pc.subtitle}</p>
        </div>
      </motion.div>

      {/* Upload Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { type: 'photo' as const, label: pc.uploadPhoto, emoji: '📷', color: 'from-sky-400 to-sky-600' },
          { type: 'drawing' as const, label: pc.uploadDrawing, emoji: '🎨', color: 'from-pink-400 to-rose-600' },
          { type: 'achievement' as const, label: pc.uploadAchievement, emoji: '🏅', color: 'from-amber-400 to-orange-500' },
        ].map((btn) => (
          <motion.button
            key={btn.type}
            onClick={() => handleUpload(btn.type)}
            className={`bg-gradient-to-br ${btn.color} text-white rounded-2xl p-4 text-center shadow-md hover:shadow-lg transition-shadow`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-3xl block mb-2">{btn.emoji}</span>
            <span className="text-xs font-bold">{btn.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Memory Tabs */}
      <div className="flex gap-2 bg-sky-50 p-1.5 rounded-xl">
        {memoryTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveMemoryTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeMemoryTab === tab.id
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-sky-500 hover:text-sky-700'
            }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Memory Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredMemories.map((memory, i) => (
          <motion.div
            key={memory.id}
            className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            {memory.url ? (
              <img src={memory.url} alt={memory.caption} className="w-full h-32 object-cover" />
            ) : (
              <div className={`h-32 flex items-center justify-center ${
                memory.type === 'achievement' ? 'bg-amber-50' : memory.type === 'drawing' ? 'bg-pink-50' : 'bg-sky-50'
              }`}>
                <span className="text-4xl">
                  {memory.type === 'achievement' ? '🏅' : memory.type === 'drawing' ? '🎨' : '📷'}
                </span>
              </div>
            )}
            <div className="p-3">
              <p className="text-sm font-semibold text-sky-900 truncate">{memory.caption}</p>
              <p className="text-xs text-sky-400 mt-1">{memory.date}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Memory Book */}
      <motion.div
        className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 rounded-2xl p-6 text-white text-center shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-5xl block mb-3">📖</span>
        <h4 className="text-xl font-bold mb-2">{pc.memoryBook}</h4>
        <p className="text-white/80 text-sm mb-4">
          {isAr
            ? 'أنشئ كتاب ذكريات 2026 يحتوي على صور وشهادات وقصص طفلك وأفضل رسوماته'
            : 'Create a 2026 memory book containing your child\'s photos, certificates, stories, and best drawings'
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-rose-600 rounded-xl font-bold shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5" />
            {pc.createMemoryBook}
          </motion.button>
          <motion.button
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold border border-white/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            {pc.downloadPdf}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// ========================
// Child Dashboard Section (لوحة تتبع الطفل)
// ========================
function ChildDashboardSection() {
  const { isAr } = useLanguage()

  const dashboardStats = [
    { icon: '⏰', value: '127', label: isAr ? 'دقيقة هذا الأسبوع' : 'min this week', color: 'from-sky-400 to-blue-500' },
    { icon: '🎮', value: '15', label: isAr ? 'لعبة مكتملة' : 'games completed', color: 'from-emerald-400 to-teal-500' },
    { icon: '📖', value: '3', label: isAr ? 'قصص مقروءة' : 'stories read', color: 'from-amber-400 to-orange-500' },
    { icon: '✍️', value: '8', label: isAr ? 'كتابات منشورة' : 'writings published', color: 'from-violet-400 to-purple-500' },
  ]

  const recentActivities = [
    { type: 'game', icon: '🎮', title: isAr ? 'تحدي الرياضيات' : 'Math Quiz Challenge', time: isAr ? 'منذ ساعتين' : '2 hours ago', score: 85 },
    { type: 'story', icon: '📖', title: isAr ? 'كنز الأرنب الحكيم' : 'The Wise Rabbit\'s Treasure', time: isAr ? 'أمس' : 'Yesterday', score: 100 },
    { type: 'writing', icon: '✍️', title: isAr ? 'مغامرتي في الفضاء' : 'My Space Adventure', time: isAr ? 'منذ يومين' : '2 days ago', score: 92 },
    { type: 'game', icon: '🎨', title: isAr ? 'لوحة الرسم' : 'Drawing Canvas', time: isAr ? 'منذ 3 أيام' : '3 days ago', score: 78 },
  ]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dashboardStats.map((stat, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3 }}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-sky-900">{stat.value}</div>
            <div className="text-xs text-sky-500 mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <motion.div
        className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-bold text-sky-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-500" />
          {isAr ? 'النشاط الأخير' : 'Recent Activity'}
        </h4>
        <div className="space-y-3">
          {recentActivities.map((activity, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-sky-50/50 hover:bg-sky-50 transition-colors"
              initial={{ opacity: 0, x: isAr ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
            >
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sky-900 text-sm truncate">{activity.title}</p>
                <p className="text-sky-400 text-xs">{activity.time}</p>
              </div>
              {activity.score > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-12 h-2 bg-sky-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${activity.score >= 90 ? 'bg-emerald-500' : activity.score >= 70 ? 'bg-amber-500' : 'bg-sky-500'}`}
                      style={{ width: `${activity.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-sky-700">{activity.score}%</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          {isAr ? 'إجراءات سريعة' : 'Quick Actions'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(isAr ? [
            { icon: '📝', label: 'تعيين مهمة' },
            { icon: '🏆', label: 'منح شارة' },
            { icon: '📩', label: 'رسالة لطفلك' },
            { icon: '⏰', label: 'تحديد وقت' },
          ] : [
            { icon: '📝', label: 'Assign Task' },
            { icon: '🏆', label: 'Award Badge' },
            { icon: '📩', label: 'Message Child' },
            { icon: '⏰', label: 'Set Timer' },
          ]).map((action, i) => (
            <button
              key={i}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/25 transition-all"
            >
              <div className="text-2xl mb-1">{action.icon}</div>
              <div className="text-xs font-semibold">{action.label}</div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ========================
// Content Control Section (التحكم في المحتوى)
// ========================
function ContentControlSection() {
  const { isAr } = useLanguage()
  const [settings, setSettings] = useState({
    adFree: true,
    moderated: true,
    ageFilter: '5-8',
    difficulty: 'medium',
    allowedCategories: ['math', 'language', 'science', 'art'],
    blockChat: true,
    blockExternal: true,
    sessionLimit: 60,
  })

  const categories = [
    { id: 'math', ar: 'رياضيات', en: 'Math', emoji: '🧮' },
    { id: 'language', ar: 'لغة', en: 'Language', emoji: '📝' },
    { id: 'science', ar: 'علوم', en: 'Science', emoji: '🔬' },
    { id: 'art', ar: 'فنون', en: 'Art', emoji: '🎨' },
    { id: 'stories', ar: 'قصص', en: 'Stories', emoji: '📖' },
    { id: 'music', ar: 'موسيقى', en: 'Music', emoji: '🎵' },
  ]

  const toggleCategory = (id: string) => {
    setSettings(prev => ({
      ...prev,
      allowedCategories: prev.allowedCategories.includes(id)
        ? prev.allowedCategories.filter(c => c !== id)
        : [...prev.allowedCategories, id]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Safety Settings */}
      <motion.div
        className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">{isAr ? 'سلامة طفلك' : 'Your Child\'s Safety'}</h3>
            <p className="text-white/80 text-sm">{isAr ? 'بيئة آمنة خالية من الإعلانات' : 'Ad-free, safe environment'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-2"><Lock className="w-4 h-4" /> {isAr ? 'خالٍ من الإعلانات' : 'Ad-Free'}</span>
            <span className="bg-emerald-400 text-white text-xs px-2 py-0.5 rounded-full">{isAr ? 'مفعّل' : 'ON'}</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-2"><Eye className="w-4 h-4" /> {isAr ? 'مراقبة المحتوى' : 'Content Moderated'}</span>
            <span className="bg-emerald-400 text-white text-xs px-2 py-0.5 rounded-full">{isAr ? 'مفعّل' : 'ON'}</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4" /> {isAr ? 'منع الدردشة' : 'No Open Chat'}</span>
            <span className="bg-emerald-400 text-white text-xs px-2 py-0.5 rounded-full">{isAr ? 'مفعّل' : 'ON'}</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-2"><Globe className="w-4 h-4" /> {isAr ? 'منع الروابط الخارجية' : 'Block External Links'}</span>
            <span className="bg-emerald-400 text-white text-xs px-2 py-0.5 rounded-full">{isAr ? 'مفعّل' : 'ON'}</span>
          </div>
        </div>
      </motion.div>

      {/* Age & Difficulty */}
      <motion.div
        className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h4 className="font-bold text-sky-900 mb-4 flex items-center gap-2">
          <Baby className="w-5 h-5 text-sky-500" />
          {isAr ? 'الفئة العمرية والمستوى' : 'Age & Difficulty'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-sky-700 mb-2">{isAr ? 'العمر' : 'Age Range'}</label>
            <select
              value={settings.ageFilter}
              onChange={(e) => setSettings({ ...settings, ageFilter: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-sky-200 text-sky-900"
            >
              <option value="3-5">{isAr ? '3-5 سنوات' : '3-5 years'}</option>
              <option value="5-8">{isAr ? '5-8 سنوات' : '5-8 years'}</option>
              <option value="8-12">{isAr ? '8-12 سنة' : '8-12 years'}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-sky-700 mb-2">{isAr ? 'مستوى الصعوبة' : 'Difficulty Level'}</label>
            <select
              value={settings.difficulty}
              onChange={(e) => setSettings({ ...settings, difficulty: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-sky-200 text-sky-900"
            >
              <option value="easy">{isAr ? 'سهل' : 'Easy'}</option>
              <option value="medium">{isAr ? 'متوسط' : 'Medium'}</option>
              <option value="hard">{isAr ? 'صعب' : 'Hard'}</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-semibold text-sky-700 mb-2">
            {isAr ? `الحد الأقصى للجلسة: ${settings.sessionLimit} دقيقة` : `Session limit: ${settings.sessionLimit} min`}
          </label>
          <input
            type="range"
            min="15"
            max="120"
            step="15"
            value={settings.sessionLimit}
            onChange={(e) => setSettings({ ...settings, sessionLimit: parseInt(e.target.value) })}
            className="w-full accent-sky-500"
          />
        </div>
      </motion.div>

      {/* Allowed Categories */}
      <motion.div
        className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="font-bold text-sky-900 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-sky-500" />
          {isAr ? 'التصنيفات المسموحة' : 'Allowed Categories'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                settings.allowedCategories.includes(cat.id)
                  ? 'bg-sky-50 border-sky-400 text-sky-700'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-sm font-semibold">{isAr ? cat.ar : cat.en}</span>
              {settings.allowedCategories.includes(cat.id) && <CheckCircle2 className="w-4 h-4 text-sky-500 ml-auto" />}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ========================
// Writing Skills Section (مهارات الكتابة)
// ========================
function WritingSkillsSection() {
  const { isAr } = useLanguage()

  const skills = [
    { name: isAr ? 'الإملاء' : 'Spelling', level: 75, color: 'from-sky-400 to-blue-500', icon: '📝' },
    { name: isAr ? 'القواعد' : 'Grammar', level: 60, color: 'from-emerald-400 to-teal-500', icon: '📐' },
    { name: isAr ? 'المفردات' : 'Vocabulary', level: 85, color: 'from-amber-400 to-orange-500', icon: '📚' },
    { name: isAr ? 'علامات الترقيم' : 'Punctuation', level: 50, color: 'from-rose-400 to-pink-500', icon: '❗' },
    { name: isAr ? 'الكتابة الإبداعية' : 'Creative Writing', level: 70, color: 'from-violet-400 to-purple-500', icon: '✍️' },
    { name: isAr ? 'فهم القراءة' : 'Reading Comprehension', level: 90, color: 'from-cyan-400 to-sky-500', icon: '📖' },
  ]

  const writings = [
    { title: isAr ? 'مغامرتي في الغابة' : 'My Forest Adventure', date: isAr ? 'اليوم' : 'Today', words: 120, rating: 4 },
    { title: isAr ? 'صديقي كوبيستو' : 'My Friend Kopisto', date: isAr ? 'أمس' : 'Yesterday', words: 85, rating: 5 },
    { title: isAr ? 'رحلة إلى الفضاء' : 'Journey to Space', date: isAr ? 'منذ 3 أيام' : '3 days ago', words: 200, rating: 4 },
  ]

  return (
    <div className="space-y-6">
      {/* Skills Overview */}
      <motion.div
        className="bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <PenTool className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">{isAr ? 'مهارات الكتابة' : 'Writing Skills'}</h3>
            <p className="text-white/80 text-sm">{isAr ? 'تتبع تطور مهارات طفلك' : 'Track your child\'s writing development'}</p>
          </div>
        </div>
        <div className="space-y-3">
          {skills.map((skill, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold flex items-center gap-2">
                  <span className="text-lg">{skill.icon}</span>
                  {skill.name}
                </span>
                <span className="text-sm font-bold">{skill.level}%</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Writings */}
      <motion.div
        className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-bold text-sky-900 mb-4 flex items-center gap-2">
          <Feather className="w-5 h-5 text-violet-500" />
          {isAr ? 'كتابات طفلك الأخيرة' : 'Your Child\'s Recent Writings'}
        </h4>
        <div className="space-y-3">
          {writings.map((writing, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-violet-50/50 hover:bg-violet-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white">
                <Feather className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sky-900 text-sm">{writing.title}</p>
                <p className="text-xs text-sky-500">{writing.date} • {writing.words} {isAr ? 'كلمة' : 'words'}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s < writing.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Writing Prompt */}
      <motion.div
        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          {isAr ? 'فكرة كتابة اليوم' : 'Today\'s Writing Prompt'}
        </h4>
        <p className="text-amber-800 text-sm leading-relaxed mb-3">
          {isAr
            ? 'تخيّل أنك تستيقظ في صباح يوم لتجد أن كوبيستو قد ترك لك رسالة وكنزًا صغيرًا. اكتب قصة عن مغامرتك مع الكنز!'
            : 'Imagine waking up to find Kopisto has left you a note and a small treasure. Write a story about your adventure with the treasure!'}
        </p>
        <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl font-semibold text-sm">
          {isAr ? 'ابدأ الكتابة ✍️' : 'Start Writing ✍️'}
        </button>
      </motion.div>
    </div>
  )
}

// ========================
// Reading Log Section (سجل القراءة)
// ========================
function ReadingLogSection() {
  const { isAr } = useLanguage()

  const [readBooks, setReadBooks] = useState([
    { id: 1, title: isAr ? 'كنز الأرنب الحكيم' : 'The Wise Rabbit\'s Treasure', date: '2026-07-01', minutes: 8, rating: 5 },
    { id: 2, title: isAr ? 'النجمة التي أرادت أن تنام' : 'The Sleepy Little Star', date: '2026-06-28', minutes: 6, rating: 5 },
    { id: 3, title: isAr ? 'السلحفاة الشجاعة' : 'The Brave Turtle', date: '2026-06-25', minutes: 10, rating: 4 },
  ])

  const totalMinutes = readBooks.reduce((sum, b) => sum + b.minutes, 0)
  const totalBooks = readBooks.length

  return (
    <div className="space-y-6">
      {/* Reading Stats */}
      <motion.div
        className="bg-gradient-to-br from-lime-500 to-green-600 rounded-3xl p-6 text-white shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <BookCheck className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">{isAr ? 'سجل القراءة' : 'Reading Log'}</h3>
            <p className="text-white/80 text-sm">{isAr ? 'تابع رحلة طفلك مع القراءة' : 'Track your child\'s reading journey'}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-3xl font-bold">{totalBooks}</div>
            <div className="text-xs text-white/80">{isAr ? 'قصص مقروءة' : 'stories read'}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-3xl font-bold">{totalMinutes}</div>
            <div className="text-xs text-white/80">{isAr ? 'دقيقة قراءة' : 'minutes read'}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-3xl font-bold">{(totalMinutes / totalBooks).toFixed(1)}</div>
            <div className="text-xs text-white/80">{isAr ? 'متوسط الدقائق' : 'avg per book'}</div>
          </div>
        </div>
      </motion.div>

      {/* Reading List */}
      <motion.div
        className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="font-bold text-sky-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-green-500" />
          {isAr ? 'القصص المقروءة' : 'Books Read'}
        </h4>
        <div className="space-y-3">
          {readBooks.map((book) => (
            <div key={book.id} className="flex items-center gap-3 p-3 rounded-xl bg-green-50/50 hover:bg-green-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center text-white">
                <BookCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sky-900 text-sm">{book.title}</p>
                <p className="text-xs text-sky-500">{book.date} • {book.minutes} {isAr ? 'دقيقة' : 'min'}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s < book.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reading Goal */}
      <motion.div
        className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-emerald-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-500" />
          {isAr ? 'هدف القراءة الأسبوعي' : 'Weekly Reading Goal'}
        </h4>
        <div className="bg-white rounded-full h-4 overflow-hidden mb-2">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ duration: 1 }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-emerald-700 font-semibold">{isAr ? '3 من 5 قصص' : '3 of 5 stories'}</span>
          <span className="text-emerald-600 font-bold">60%</span>
        </div>
        <p className="text-xs text-emerald-600 mt-2">
          {isAr ? '🏆 اقرأ قصتين آخرتين للحصول على شارة القارئ النهم!' : '🏆 Read 2 more stories to earn the Book Worm badge!'}
        </p>
      </motion.div>
    </div>
  )
}

// ========================
// Tutor Feedback Section (ملاحظات المعلم)
// ========================
function TutorFeedbackSection() {
  const { isAr } = useLanguage()

  const feedback = [
    {
      tutor: isAr ? 'أ. سارة' : 'Ms. Sarah',
      subject: isAr ? 'الرياضيات' : 'Math',
      avatar: '👩‍🏫',
      date: isAr ? 'اليوم' : 'Today',
      rating: 5,
      comment: isAr
        ? 'أحمد أبدع اليوم في حل مسائل الجمع! أراه متحمساً للتعلم. ننصح بممارسة الطرح في المنزل.'
        : 'Ahmed excelled at addition problems today! He\'s enthusiastic about learning. We recommend practicing subtraction at home.',
      writing: isAr ? 'حل 10 مسائل بنجاح' : 'Solved 10 problems correctly',
    },
    {
      tutor: isAr ? 'أ. فاطمة' : 'Ms. Fatima',
      subject: isAr ? 'اللغة العربية' : 'Arabic',
      avatar: '👩‍🎓',
      date: isAr ? 'أمس' : 'Yesterday',
      rating: 4,
      comment: isAr
        ? 'كتابة أحمد عن "مغامرتي في الغابة" رائعة! استخدم كلمات جديدة. يحتاج للتركيز على علامات الترقيم.'
        : 'Ahmed\'s writing about "My Forest Adventure" is wonderful! He used new words. Needs to focus on punctuation.',
      writing: isAr ? 'كتب 120 كلمة' : 'Wrote 120 words',
    },
    {
      tutor: isAr ? 'أ. أحمد' : 'Mr. Ahmed',
      subject: isAr ? 'العلوم' : 'Science',
      avatar: '👨‍🔬',
      date: isAr ? 'منذ 3 أيام' : '3 days ago',
      rating: 5,
      comment: isAr
        ? 'أحمد أظهر فضولاً كبيراً في درس المجموعة الشمسية. أسئلته ذكية! شجعوه على مشاهدة فيديوهات تعليمية عن الفضاء.'
        : 'Ahmed showed great curiosity in the solar system lesson. His questions were smart! Encourage him to watch educational space videos.',
      writing: isAr ? 'أكمل اختبار الكواكب' : 'Completed planet quiz',
    },
  ]

  const [replyText, setReplyText] = useState('')

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl p-6 text-white shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">{isAr ? 'ملاحظات المعلمين' : 'Tutor Feedback'}</h3>
            <p className="text-white/80 text-sm">{isAr ? 'تقييمات وتعليقات من معلمي طفلك' : 'Reviews and comments from your child\'s tutors'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center flex-1">
            <div className="text-2xl font-bold">4.7</div>
            <div className="text-xs text-white/80">{isAr ? 'متوسط التقييم' : 'Average rating'}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center flex-1">
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs text-white/80">{isAr ? 'ملاحظات جديدة' : 'New feedback'}</div>
          </div>
        </div>
      </motion.div>

      {/* Feedback Cards */}
      {feedback.map((fb, i) => (
        <motion.div
          key={i}
          className="bg-white rounded-2xl p-5 border border-sky-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-2xl">
              {fb.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-sky-900">{fb.tutor}</h4>
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">{fb.subject}</span>
              </div>
              <p className="text-xs text-sky-500">{fb.date} • {fb.writing}</p>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className={`w-4 h-4 ${s < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
            <p className="text-sky-800 text-sm leading-relaxed">{fb.comment}</p>
          </div>

          {/* Reply box */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={isAr ? 'اكتب ردّك للمعلم...' : 'Write a reply to the tutor...'}
              className="flex-1 px-4 py-2 rounded-full border border-sky-200 text-sm focus:border-teal-400 outline-none"
            />
            <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
              <Send className="w-4 h-4" />
              {isAr ? 'إرسال' : 'Reply'}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
