'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Send, X, Sparkles, Loader2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export function KopistoChatbot() {
  const { isAr, locale } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const t = isAr
    ? {
        welcome: 'مرحباً! أنا كوبيستو 🐰 صديقك المفضل! كيف حالك اليوم؟',
        placeholder: 'اكتب لي رسالة...',
        sending: 'كوبيستو يفكر...',
        tooltip: 'تحدث مع كوبيستو',
      }
    : {
        welcome: "Hi! I'm Kopisto 🐰 your best friend! How are you today?",
        placeholder: 'Type me a message...',
        sending: 'Kopisto is thinking...',
        tooltip: 'Chat with Kopisto',
      }

  // رسالة الترحيب
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: t.welcome,
        timestamp: Date.now(),
      }])
    }
  }, [isAr])

  // التمرير للأسفل عند رسالة جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // التركيز على الإدخال عند الفتح
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage, timestamp: Date.now() }
    ]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/kopisto-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language: locale,
          history: messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await response.json()

      if (data.reply) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.reply, timestamp: Date.now() }
        ])
        if (!isOpen) setHasUnread(true)
      } else {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: isAr ? 'عذراً، لم أفهم. حاول مرة أخرى!' : "Sorry, I didn't understand. Try again!",
            timestamp: Date.now()
          }
        ])
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: isAr ? 'حدث خطأ في الاتصال. حاول مرة أخرى!' : 'Connection error. Try again!',
          timestamp: Date.now()
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, locale, isAr, isOpen])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* زر فتح/إغلاق الشات */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-5 right-5 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 shadow-2xl shadow-orange-300/50 flex items-center justify-center hover:scale-110 transition-transform group"
            aria-label={t.tooltip}
          >
            {/* صورة كوبيستو */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
              <Image
                src="/kopisto.webp"
                alt="Kopisto"
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>

            {/* مؤشر الإنترنت (نشط) */}
            <motion.div
              className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-400 border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* إشعار رسائل غير مقروءة */}
            {hasUnread && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center"
              >
                1
              </motion.div>
            )}

            {/* تأثير نبض */}
            <motion.div
              className="absolute inset-0 rounded-full bg-orange-400"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* نافذة الشات */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-orange-100"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            {/* الرأس */}
            <div className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <Image
                    src="/kopisto.webp"
                    alt="Kopisto"
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                  <motion.div
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border border-white"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-1">
                    كوبيستو
                    <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                  </h3>
                  <p className="text-white/80 text-xs">
                    {isAr ? '🟢 متصل الآن' : '🟢 Online now'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-orange-50/30 to-amber-50/30">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-orange-200 shrink-0">
                        <Image
                          src="/kopisto.webp"
                          alt="Kopisto"
                          fill
                          className="object-cover"
                          sizes="28px"
                        />
                      </div>
                    )}
                    <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-sky-500 to-blue-500 text-white rounded-br-md'
                        : 'bg-white text-gray-800 border border-orange-100 rounded-bl-md shadow-sm'
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* مؤشر الكتابة */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end gap-2">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-orange-200 shrink-0">
                      <Image
                        src="/kopisto.webp"
                        alt="Kopisto"
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    </div>
                    <div className="px-4 py-3 bg-white rounded-2xl rounded-bl-md border border-orange-100 shadow-sm">
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-orange-400 rounded-full"
                            animate={{
                              y: [0, -6, 0],
                              opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* اقتراحات سريعة */}
            {messages.length <= 1 && !isLoading && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {(isAr
                  ? ['📚 أحب القراءة!', '🔬 علمني شيئاً!', '🎨 أريد رسمة!', '⭐ احكِ لي قصة!']
                  : ['📚 I love reading!', '🔬 Teach me something!', '🎨 I want to draw!', '⭐ Tell me a story!']
                ).map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(suggestion)
                      setTimeout(() => sendMessage(), 100)
                    }}
                    className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full text-xs font-semibold transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* الإدخال */}
            <div className="p-3 bg-white border-t border-orange-100 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t.placeholder}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-orange-50 rounded-full border border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none text-sm text-gray-800 placeholder:text-orange-400 disabled:opacity-50"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
                    input.trim() && !isLoading
                      ? 'bg-gradient-to-br from-orange-400 to-amber-500 hover:scale-110'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  whileHover={input.trim() && !isLoading ? { scale: 1.1 } : {}}
                  whileTap={input.trim() && !isLoading ? { scale: 0.95 } : {}}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
