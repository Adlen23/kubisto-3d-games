'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const faqs = {
  ar: [
    {
      q: 'هل كوبيستو مناسب لجميع الأعمار؟',
      a: 'نعم! كوبيستو مصمم للأطفال من عمر 3 إلى 12 سنة. كل لعبة ومحتوى يتكيف مع عمر الطفل ومستواه. يمكنك ضبط الفئة العمرية من لوحة التحكم في ركن الآباء.',
    },
    {
      q: 'هل الموقع آمن لطفلي؟',
      a: 'بالتأكيد! كوبيستو بيئة آمنة 100% - خالية من الإعلانات، ومراقبة بالكامل، وبدون دردشة مفتوحة أو روابط خارجية. كل المحتوى منظم ومختار بعناية.',
    },
    {
      q: 'هل يمكنني تتبع تقدم طفلي؟',
      a: 'نعم! يوفر ركن الآباء لوحة تحكم شاملة تتيح لك متابعة تقدم طفلك في جميع الألعاب والقصص والمهارات، مع تقارير أسبوعية وملاحظات من المعلمين.',
    },
    {
      q: 'هل توجد قصص تعليمية للأطفال؟',
      a: 'نعم! لدينا مكتبة قصص غنية بـ 6 قصص مكتوبة بأسلوب أدبي جميل، مع رسوم متحركة وسرد صوتي. كما يمكنك إنشاء قصص مخصصة بطفلك كبطل من ركن الآباء!',
    },
    {
      q: 'هل الموقع يعمل بدون إنترنت؟',
      a: 'بعض الألعاب والقصص تتطلب اتصالاً بالإنترنت. ننصح باستخدام الموقع عبر WiFi للحصول على أفضل تجربة. سنضيف قريباً وضع عدم الاتصال لبعض الألعاب.',
    },
    {
      q: 'هل كوبيستو مجاني؟',
      a: 'نعم! جميع الألعاب التعليمية والقصص الأساسية مجانية تماماً. نخطط لإطلاق ميزات premium إضافية في المستقبل، لكن المحتوى الأساسي سيبقى مجانياً.',
    },
    {
      q: 'كيف يمكنني تغيير لغة الموقع؟',
      a: 'اضغط على زر اللغة في الأعلى (🇬🇧 EN / 🇸🇦 عربي) للتبديل بين العربية والإنجليزية. كل المحتوى يتغير تلقائياً بما في ذلك الألعاب والقصص والنصائح.',
    },
    {
      q: 'هل يمكنني استخدام كوبيستو على الموبايل؟',
      a: 'نعم! كوبيستو مصمم ليعمل بشكل مثالي على جميع الأجهزة - الهواتف الذكية، الأجهزة اللوحية، والكمبيوترات. يمكن أيضاً تثبيته كتطبيق من المتصفح.',
    },
  ],
  en: [
    {
      q: 'Is Kopisto suitable for all ages?',
      a: 'Yes! Kopisto is designed for children aged 3 to 12. Every game and content adapts to the child\'s age and level. You can adjust the age range from the Parent Zone dashboard.',
    },
    {
      q: 'Is the website safe for my child?',
      a: 'Absolutely! Kopisto is a 100% safe environment - ad-free, fully moderated, with no open chat or external links. All content is carefully curated.',
    },
    {
      q: 'Can I track my child\'s progress?',
      a: 'Yes! The Parent Zone provides a comprehensive dashboard to track your child\'s progress across all games, stories, and skills, with weekly reports and tutor feedback.',
    },
    {
      q: 'Are there educational stories for children?',
      a: 'Yes! We have a rich story library with 6 beautifully written stories, animated illustrations, and voice narration. You can also create personalized stories with your child as the hero!',
    },
    {
      q: 'Does the website work offline?',
      a: 'Some games and stories require an internet connection. We recommend using WiFi for the best experience. We\'ll soon add offline mode for select games.',
    },
    {
      q: 'Is Kopisto free?',
      a: 'Yes! All educational games and core stories are completely free. We plan to launch additional premium features in the future, but core content will remain free.',
    },
    {
      q: 'How do I change the website language?',
      a: 'Click the language button at the top (🇬🇧 EN / 🇸🇦 عربي) to switch between Arabic and English. All content changes automatically including games, stories, and tips.',
    },
    {
      q: 'Can I use Kopisto on mobile?',
      a: 'Yes! Kopisto is designed to work perfectly on all devices - smartphones, tablets, and computers. It can also be installed as an app from the browser.',
    },
  ],
}

export default function FAQSection() {
  const { isAr } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const list = isAr ? faqs.ar : faqs.en

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-sky-50/50 relative overflow-hidden">
      <div className="absolute top-10 right-10 text-6xl opacity-5">❓</div>
      <div className="absolute bottom-10 left-10 text-5xl opacity-5">💬</div>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
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
            ❓
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-4">
            {isAr ? (
              <>الأسئلة <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">الشائعة</span></>
            ) : (
              <>Frequently Asked <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Questions</span></>
            )}
          </h2>
          <p className="text-sky-600/70 text-lg">
            {isAr ? 'كل ما تريد معرفته عن كوبيستو' : 'Everything you want to know about Kopisto'}
          </p>
        </motion.div>

        <div className="space-y-3">
          {list.map((faq, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-sky-50/50 transition-colors"
              >
                <span className="font-bold text-sky-900 text-sm md:text-base flex items-center gap-2">
                  <span className="text-lg">{['🤔', '🛡️', '📊', '📖', '📶', '🎁', '🌍', '📱'][i % 8]}</span>
                  {faq.q}
                </span>
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown className="w-5 h-5 text-sky-400 shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0">
                      <p className="text-sky-600/80 text-sm leading-relaxed pr-8">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
