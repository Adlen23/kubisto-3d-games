'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useT3D as useT } from "@/lib/games-3d/use-t"
import { Trophy, RotateCcw, Home, ChevronRight } from 'lucide-react'
import { playSound } from '@/lib/games-3d/audio'
import { useEffect } from 'react'

interface GameOverScreenProps {
  variant: 'win' | 'lose'
  score: number
  highScore: number
  isNewHighScore: boolean
  onRestart: () => void
  onQuit: () => void
  onNext?: () => void
  nextLabel?: string
}

/**
 * شاشة نهاية اللعبة - فوز أو خسارة
 */
export function GameOverScreen({
  variant,
  score,
  highScore,
  isNewHighScore,
  onRestart,
  onQuit,
  onNext,
  nextLabel
}: GameOverScreenProps) {
  const t = useT()

  useEffect(() => {
    playSound(variant === 'win' ? 'win' : 'lose')
  }, [variant])

  const isWin = variant === 'win'

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center p-4"
      style={{
        background: isWin
          ? 'linear-gradient(180deg, rgba(255,215,0,0.85) 0%, rgba(255,165,0,0.85) 100%)'
          : 'linear-gradient(180deg, rgba(60,60,80,0.85) 0%, rgba(30,30,50,0.85) 100%)',
        backdropFilter: 'blur(6px)'
      }}
    >
      <Card className="max-w-sm w-full p-6 bg-white/95 shadow-2xl border-4 border-white text-center">
        <div className="text-6xl mb-2">
          {isWin ? '🏆' : '💔'}
        </div>
        <h2
          className={`text-3xl font-black mb-2 ${
            isWin ? 'text-amber-600' : 'text-gray-700'
          }`}
        >
          {isWin ? t.inGame.youWin : t.inGame.gameOver}
        </h2>

        {isNewHighScore && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold border border-yellow-300">
            <Trophy className="w-3.5 h-3.5" />
            {t.messages.newHighScore}
          </div>
        )}

        <div className="space-y-2 mb-4">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-500 font-semibold">
              {t.inGame.score}
            </p>
            <p className="text-3xl font-black text-gray-900">
              {score}
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <p className="text-xs text-amber-600 font-semibold flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              {t.inGame.highScore}
            </p>
            <p className="text-xl font-bold text-amber-700">
              {highScore}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {isWin && onNext && (
            <Button
              className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-bold h-12"
              onClick={() => { playSound('click'); onNext() }}
            >
              {nextLabel || t.inGame.nextLevel}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold h-11"
              onClick={() => { playSound('click'); onRestart() }}
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              {t.inGame.restart}
            </Button>
            <Button
              variant="secondary"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold h-11"
              onClick={() => { playSound('click'); onQuit() }}
            >
              <Home className="w-4 h-4 mr-1.5" />
              {t.inGame.backToMenu}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
