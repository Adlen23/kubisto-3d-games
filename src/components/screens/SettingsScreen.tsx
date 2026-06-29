'use client'

import { useGameStore, useT } from '@/lib/game-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Music, Music2, Keyboard, Smartphone, Gamepad2 } from 'lucide-react'
import { playSound } from '@/lib/audio'

export function SettingsScreen() {
  const t = useT()
  const lang = useGameStore((s) => s.lang)
  const setLang = useGameStore((s) => s.setLang)
  const setScreen = useGameStore((s) => s.setScreen)
  const soundOn = useGameStore((s) => s.soundOn)
  const musicOn = useGameStore((s) => s.musicOn)
  const toggleSound = useGameStore((s) => s.toggleSound)
  const toggleMusic = useGameStore((s) => s.toggleMusic)
  const controlMode = useGameStore((s) => s.controlMode)
  const setControlMode = useGameStore((s) => s.setControlMode)

  return (
    <div
      className="min-h-screen w-full"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(180deg, #c7d2fe 0%, #e0e7ff 100%)' }}
    >
      <div className="container mx-auto px-4 py-6 max-w-2xl">
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
            {t.settings.title}
          </h1>
          <div className="w-28" />
        </div>

        <div className="space-y-3">
          {/* اللغة */}
          <Card className="p-4 bg-white/95 shadow-lg">
            <Label className="text-sm font-bold text-gray-700 mb-3 block">
              {t.settings.language}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`px-4 py-3 rounded-xl border-2 font-bold transition-all hover:scale-105 ${
                  lang === 'ar' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700'
                }`}
                onClick={() => { playSound('click'); setLang('ar') }}
              >
                🇸🇦 العربية
              </button>
              <button
                className={`px-4 py-3 rounded-xl border-2 font-bold transition-all hover:scale-105 ${
                  lang === 'en' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-700'
                }`}
                onClick={() => { playSound('click'); setLang('en') }}
              >
                🇬🇧 English
              </button>
            </div>
          </Card>

          {/* الصوت */}
          <Card className="p-4 bg-white/95 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundOn ? <Volume2 className="w-6 h-6 text-emerald-500" /> : <VolumeX className="w-6 h-6 text-gray-400" />}
                <div>
                  <Label className="text-sm font-bold text-gray-700">
                    {t.settings.sound}
                  </Label>
                  <p className="text-xs text-gray-500">
                    {soundOn ? 'ON' : 'OFF'}
                  </p>
                </div>
              </div>
              <Button
                variant={soundOn ? 'default' : 'secondary'}
                className={soundOn ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-200'}
                onClick={() => { playSound('click'); toggleSound() }}
              >
                {soundOn ? 'ON' : 'OFF'}
              </Button>
            </div>
          </Card>

          {/* الموسيقى */}
          <Card className="p-4 bg-white/95 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {musicOn ? <Music2 className="w-6 h-6 text-purple-500" /> : <Music className="w-6 h-6 text-gray-400" />}
                <div>
                  <Label className="text-sm font-bold text-gray-700">
                    {t.settings.music}
                  </Label>
                  <p className="text-xs text-gray-500">
                    {musicOn ? 'ON' : 'OFF'}
                  </p>
                </div>
              </div>
              <Button
                variant={musicOn ? 'default' : 'secondary'}
                className={musicOn ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-gray-200'}
                onClick={() => { playSound('click'); toggleMusic() }}
              >
                {musicOn ? 'ON' : 'OFF'}
              </Button>
            </div>
          </Card>

          {/* التحكم */}
          <Card className="p-4 bg-white/95 shadow-lg">
            <Label className="text-sm font-bold text-gray-700 mb-3 block">
              {t.settings.controls}
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { v: 'keyboard', label: t.settings.keyboard, icon: <Keyboard className="w-5 h-5" /> },
                { v: 'touch', label: t.settings.touch, icon: <Smartphone className="w-5 h-5" /> },
                { v: 'gamepad', label: t.settings.gamepad, icon: <Gamepad2 className="w-5 h-5" /> }
              ] as const).map((opt) => (
                <button
                  key={opt.v}
                  className={`px-3 py-3 rounded-xl border-2 text-xs font-bold transition-all hover:scale-105 flex flex-col items-center gap-1.5 ${
                    controlMode === opt.v
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                  onClick={() => { playSound('click'); setControlMode(opt.v) }}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
