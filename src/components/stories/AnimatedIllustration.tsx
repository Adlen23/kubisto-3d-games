'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'

interface AnimatedIllustrationProps {
  emoji: string
  theme: string
}

/**
 * مكوّن الرسوم التوضيحية المتحركة
 * كل emoji له أنيميشن مخصص حسب نوعه
 */
export function AnimatedIllustration({ emoji, theme }: AnimatedIllustrationProps) {
  const [tapCount, setTapCount] = useState(0)

  // تحديد نوع الأنيميشن حسب الـ emoji
  const animationType = useMemo(() => {
    // كائنات طائرة
    const flying = ['⭐', '🌟', '✨', '💫', '🌙', '☁️', '🐦', '🦋', '🐝', '☄️']
    // كائنات مائية
    const water = ['💧', '🫧', '🌊', '🐟']
    // كائنات نباتية
    const plants = ['🌳', '🌲', '🌴', '🌷', '🌸', '🌹', '🌻', '🍃', '🌿', '🌱']
    // كائنات أرضية
    const ground = ['🐰', '🐢', '🐿️', '🦊', '🏠', '🏡', '🏔️', '🪨']
    // كائنات سحرية
    const magical = ['📦', '📖', '📜', '🪓', '🥇', '🥈', '💎', '🎁', '👑', '🏆']
    // تعبيرات
    const expressions = ['😊', '😢', '😴', '😄', '🎉', '😱', '🤝', '💪', '👼']

    if (flying.includes(emoji)) return 'flying'
    if (water.includes(emoji)) return 'water'
    if (plants.includes(emoji)) return 'plants'
    if (ground.includes(emoji)) return 'ground'
    if (magical.includes(emoji)) return 'magical'
    if (expressions.includes(emoji)) return 'expressions'
    return 'default'
  }, [emoji])

  const baseAnimation = {
    flying: {
      animate: {
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 1],
      },
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
    water: {
      animate: {
        y: [0, 15, 0],
        x: [0, 5, -5, 0],
        scale: [1, 0.95, 1],
      },
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    plants: {
      animate: {
        rotate: [0, 3, -3, 0],
        scale: [1, 1.03, 1],
      },
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
    },
    ground: {
      animate: {
        y: [0, -5, 0],
        scale: [1, 1.02, 1],
      },
      transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    magical: {
      animate: {
        scale: [1, 1.15, 1],
        rotate: [0, 10, -10, 0],
        filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
      },
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
    },
    expressions: {
      animate: {
        scale: [1, 1.1, 1],
        y: [0, -3, 0],
      },
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    default: {
      animate: {
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0],
      },
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
  }

  const config = baseAnimation[animationType]

  return (
    <div className="relative flex items-center justify-center">
      {/* هالة خلفية */}
      <motion.div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* حلقات دوارة */}
      <motion.div
        className="absolute rounded-full border-2 border-white/30"
        style={{ width: 180, height: 180 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full border-2 border-white/20"
        style={{ width: 220, height: 220 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      {/* الـ emoji الرئيسي */}
      <motion.div
        className="relative cursor-pointer select-none"
        style={{ fontSize: '8rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}
        animate={config.animate}
        transition={config.transition}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setTapCount(c => c + 1)}
      >
        {emoji}
      </motion.div>

      {/* تأثير النقر */}
      {tapCount > 0 && (
        <motion.div
          key={tapCount}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-6xl">✨</span>
        </motion.div>
      )}

      {/* جسيمات صغيرة حول الـ emoji */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 100
        return (
          <motion.div
            key={i}
            className="absolute text-2xl pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [
                Math.cos(angle) * 50,
                Math.cos(angle) * radius,
                Math.cos(angle) * 50,
              ],
              y: [
                Math.sin(angle) * 50,
                Math.sin(angle) * radius,
                Math.sin(angle) * 50,
              ],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ✨
          </motion.div>
        )
      })}
    </div>
  )
}
