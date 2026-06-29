'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** شكل تخصيص كوبيستو */
export interface KubistoAppearance {
  bodyColor: string
  bellyColor: string
  accentColor: string
  hat: 'none' | 'cap' | 'crown' | 'beanie'
  glasses: 'none' | 'shades' | 'round'
}

/** أعلى النتائج لكل لعبة */
export type Game3DId = 'adventure' | 'racing' | 'puzzle' | 'battle' | 'survival' | 'shooter'

export interface HighScores3D {
  adventure: number
  racing: number
  puzzle: number
  battle: number
  survival: number
  shooter: number
}

/** شاشة المشروع */
export type Screen3D = 'menu' | 'games' | 'customize' | Game3DId

/** حالة الألعاب 3D */
interface Games3DState {
  // مظهر كوبيستو
  appearance: KubistoAppearance
  setAppearance: (a: Partial<KubistoAppearance>) => void
  resetAppearance: () => void

  // الشاشة الحالية
  screen: Screen3D
  setScreen: (s: Screen3D) => void

  // الصوت
  soundOn: boolean
  musicOn: boolean
  toggleSound: () => void
  toggleMusic: () => void

  // أعلى النتائج
  highScores: HighScores3D
  submitScore: (game: Game3DId, score: number) => boolean
}

const DEFAULT_APPEARANCE: KubistoAppearance = {
  bodyColor: '#f8f8f0',
  bellyColor: '#ffd1dc',
  accentColor: '#1e90ff',
  hat: 'none',
  glasses: 'none'
}

export const useGames3DStore = create<Games3DState>()(
  persist(
    (set, get) => ({
      appearance: DEFAULT_APPEARANCE,
      setAppearance: (a) => set({ appearance: { ...get().appearance, ...a } }),
      resetAppearance: () => set({ appearance: DEFAULT_APPEARANCE }),

      screen: 'menu',
      setScreen: (s) => set({ screen: s }),

      soundOn: true,
      musicOn: true,
      toggleSound: () => set({ soundOn: !get().soundOn }),
      toggleMusic: () => set({ musicOn: !get().musicOn }),

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
          set({ highScores: { ...get().highScores, [game]: score } })
          return true
        }
        return false
      }
    }),
    {
      name: 'kubisto-3d-games-store',
      partialize: (s) => ({
        appearance: s.appearance,
        soundOn: s.soundOn,
        musicOn: s.musicOn,
        highScores: s.highScores
      })
    }
  )
)
