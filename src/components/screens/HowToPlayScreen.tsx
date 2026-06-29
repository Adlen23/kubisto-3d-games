'use client'

import { useGameStore, useT } from '@/lib/game-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Keyboard, Smartphone, Gamepad2 } from 'lucide-react'
import { playSound } from '@/lib/audio'

export function HowToPlayScreen() {
  const t = useT()
  const lang = useGameStore((s) => s.lang)
  const setScreen = useGameStore((s) => s.setScreen)

  return (
    <div
      className="min-h-screen w-full"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(180deg, #d1fae5 0%, #a7f3d0 100%)' }}
    >
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/95 hover:bg-white shadow-md"
            onClick={() => { playSound('click'); setScreen('menu') }}
          >
            {lang === 'ar' ? <ArrowRight className="w-4 h-4 mr-1" /> : <ArrowLeft className="w-4 h-4 mr-1" />}
            {t.inGame.backToMenu}
          </Button>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
            {t.mainMenu.howToPlay}
          </h1>
          <div className="w-28" />
        </div>

        <div className="space-y-4">
          {/* التحكم بلوحة المفاتيح */}
          <Card className="p-4 bg-white/95 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Keyboard className="w-6 h-6 text-indigo-500" />
              <h2 className="text-lg font-bold text-gray-800">
                {t.settings.keyboard}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <KeyRow keys={['W', '↑']} label={t.controls.moveForward} />
              <KeyRow keys={['S', '↓']} label={t.controls.moveBack} />
              <KeyRow keys={['A', '←', 'Q']} label={t.controls.moveLeft} />
              <KeyRow keys={['D', '→']} label={t.controls.moveRight} />
              <KeyRow keys={['Space']} label={t.controls.jump} />
              <KeyRow keys={['J', 'K']} label={t.controls.attack} />
              <KeyRow keys={['X', 'L']} label={t.controls.shoot} />
              <KeyRow keys={['P', 'Esc']} label={t.controls.pause} />
            </div>
          </Card>

          {/* التحكم باللمس */}
          <Card className="p-4 bg-white/95 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-6 h-6 text-purple-500" />
              <h2 className="text-lg font-bold text-gray-800">
                {t.settings.touch}
              </h2>
            </div>
            <p className="text-sm text-gray-600">
              {t.controls.mobileHint}
            </p>
            <div className="mt-3 flex items-center justify-around bg-purple-50 rounded-xl p-3">
              <div className="text-center">
                <div className="text-3xl mb-1">🎮</div>
                <p className="text-xs font-semibold text-gray-700">D-Pad</p>
                <p className="text-xs text-gray-500">{lang === 'ar' ? 'يسار الشاشة' : 'Left side'}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1">🔴</div>
                <p className="text-xs font-semibold text-gray-700">Action</p>
                <p className="text-xs text-gray-500">{lang === 'ar' ? 'يمين الشاشة' : 'Right side'}</p>
              </div>
            </div>
          </Card>

          {/* Gamepad */}
          <Card className="p-4 bg-white/95 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Gamepad2 className="w-6 h-6 text-emerald-500" />
              <h2 className="text-lg font-bold text-gray-800">
                {t.settings.gamepad}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <KeyRow keys={['Left Stick', 'D-Pad']} label={t.controls.move} />
              <KeyRow keys={['A']} label={t.controls.jump} />
              <KeyRow keys={['X / Y']} label={t.controls.attack} />
              <KeyRow keys={['RT / B']} label={t.controls.shoot} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function KeyRow({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
      <span className="text-gray-700 font-medium text-xs sm:text-sm">{label}</span>
      <div className="flex gap-1">
        {keys.map((k, i) => (
          <kbd
            key={i}
            className="px-2 py-0.5 bg-white border border-gray-300 rounded shadow-sm text-xs font-mono font-bold text-gray-700"
          >
            {k}
          </kbd>
        ))}
      </div>
    </div>
  )
}
