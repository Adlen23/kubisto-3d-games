'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  emoji: string
  drift: number
}

interface AnimatedBackgroundProps {
  theme: string
  bgGradient: string
}

const themeEmojis: Record<string, string[]> = {
  forest: ['🍃', '🌿', '🌸', '🦋', '✨', '🌟'],
  space: ['⭐', '✨', '🌟', '💫', '🌙', '☄️'],
  pond: ['💧', '🫧', '✨', '🌊', '🐟', '🌿'],
  sky: ['☁️', '✨', '🌈', '🐦', '💫', '☀️'],
  garden: ['🌸', '🦋', '🐝', '🌷', '✨', '🌿'],
}

/**
 * خلفية متحركة مع جسيمات عائمة
 */
export function AnimatedBackground({ theme, bgGradient }: AnimatedBackgroundProps) {
  const emojis = themeEmojis[theme] || themeEmojis.forest

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 16 + Math.random() * 24,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      drift: (Math.random() - 0.5) * 100,
    }))
  }, [emojis])

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} overflow-hidden pointer-events-none`}>
      {/* جسيمات عائمة */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
          }}
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            scale: [0, 1, 1, 0.5],
            y: [50, -100, -200, -300],
            x: [0, p.drift / 2, p.drift, p.drift * 1.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {p.emoji}
        </motion.div>
      ))}

      {/* موجات خلفية */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.4) 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%),
                            radial-gradient(circle at 40% 40%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* نقاط لامعة */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            delay: Math.random() * 3,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  )
}
