'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lang } from './i18n'

/** شكل تخصيص كوبيستو */
export interface KubistoAppearance {
  bodyColor: string
  bellyColor: string
  accentColor: string
  hat: 'none' | 'cap' | 'crown' | 'beanie'
  glasses: 'none' | 'shades' | 'round'
}

/** أعلى النتائج لكل لعبة */
export type GameId = 'adventure' | 'racing' | 'puzzle' | 'battle' | 'survival' | 'shooter'

export interface HighScores {
  adventure: number
  racing: number
  puzzle: number
  battle: number
  survival: number
  shooter: number
}

/** حالة التطبيق العامة */
interface AppState {
  // اللغة والاتجاه
  lang: Lang
  setLang: (l: Lang) => void

  // الصوت
  soundOn: boolean
  musicOn: boolean
  toggleSound: () => void
  toggleMusic: () => void

  // التحكم
  controlMode: 'keyboard' | 'touch' | 'gamepad'
  setControlMode: (m: 'keyboard' | 'touch' | 'gamepad') => void

  // الشاشة الحالية
  screen: 'menu' | 'games' | 'customize' | 'settings' | 'howto' | GameId
  setScreen: (s: AppState['screen']) => void

  // مظهر كوبيستو
  appearance: KubistoAppearance
  setAppearance: (a: Partial<KubistoAppearance>) => void
  resetAppearance: () => void

  // أعلى النتائج
  highScores: HighScores
  submitScore: (game: GameId, score: number) => boolean
}

const DEFAULT_APPEARANCE: KubistoAppearance = {
  bodyColor: '#f8f8f0',     // أبيض كريمي - لون الأرنب الأساسي
  bellyColor: '#ffd1dc',    // وردي فاتح - البطن وداخل الأذن
  accentColor: '#1e90ff',   // أزرق زاهي - لون العيون
  hat: 'none',
  glasses: 'none'
}

export const useGameStore = create<AppState>()(
  persist(
    (set, get) => ({
      lang: 'ar',
      setLang: (l) => set({ lang: l }),

      soundOn: true,
      musicOn: true,
      toggleSound: () => set({ soundOn: !get().soundOn }),
      toggleMusic: () => set({ musicOn: !get().musicOn }),

      controlMode: 'keyboard',
      setControlMode: (m) => set({ controlMode: m }),

      screen: 'menu',
      setScreen: (s) => set({ screen: s }),

      appearance: DEFAULT_APPEARANCE,
      setAppearance: (a) =>
        set({ appearance: { ...get().appearance, ...a } }),
      resetAppearance: () => set({ appearance: DEFAULT_APPEARANCE }),

      highScores: {
        adventure: 0,
        racing: 0,
        puzzle: 0,
        battle: 0,
        survival: 0,
        shooter: 0
      },
      submitScore: (game, score) => {
        const cur = get().highScores[game]
        if (score > cur) {
          set({
            highScores: { ...get().highScores, [game]: score }
          })
          return true
        }
        return false
      }
    }),
    {
      name: 'kubisto-game-store',
      partialize: (s) => ({
        lang: s.lang,
        soundOn: s.soundOn,
        musicOn: s.musicOn,
        controlMode: s.controlMode,
        appearance: s.appearance,
        highScores: s.highScores
      })
    }
  )
)

/** Hook للحصول على الترجمات */
export function useT() {
  const lang = useGameStore((s) => s.lang)
  return translations[lang]
}

// استيراد الترجمات
import { translations } from './i18n'
