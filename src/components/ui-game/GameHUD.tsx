'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Coins, Heart, Clock, Trophy, Pause, Home, RotateCcw } from 'lucide-react'
import { useT3D as useT } from "@/lib/games-3d/use-t"
import { playSound } from '@/lib/games-3d/audio'

interface GameHUDProps {
  score?: number
  lives?: number
  time?: number
  level?: number
  coins?: number
  highScore?: number
  onPause?: () => void
  onRestart?: () => void
  onQuit?: () => void
  showStats?: ('score' | 'lives' | 'time' | 'level' | 'coins' | 'highScore')[]
}

/**
 * واجهة HUD العلوية - تظهر النقاط والأرواح والوقت
 */
export function GameHUD({
  score = 0,
  lives,
  time,
  level,
  coins,
  highScore,
  onPause,
  onRestart,
  onQuit,
  showStats = ['score', 'lives']
}: GameHUDProps) {
  const t = useT()

  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4">
        {/* اليمين: الإحصائيات */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {showStats.includes('score') && (
            <Badge variant="secondary" className="bg-white/90 text-gray-900 text-base px-3 py-1.5 gap-1.5 shadow-md">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-bold">{t.inGame.score}:</span> {score}
            </Badge>
          )}
          {showStats.includes('lives') && lives !== undefined && (
            <Badge variant="secondary" className="bg-white/90 text-gray-900 text-base px-3 py-1.5 gap-1.5 shadow-md">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="font-bold">{lives}</span>
            </Badge>
          )}
          {showStats.includes('coins') && coins !== undefined && (
            <Badge variant="secondary" className="bg-white/90 text-gray-900 text-base px-3 py-1.5 gap-1.5 shadow-md">
              <Coins className="w-4 h-4 text-yellow-500 fill-yellow-300" />
              <span className="font-bold">{coins}</span>
            </Badge>
          )}
          {showStats.includes('time') && time !== undefined && (
            <Badge variant="secondary" className="bg-white/90 text-gray-900 text-base px-3 py-1.5 gap-1.5 shadow-md">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="font-bold">{time}s</span>
            </Badge>
          )}
          {showStats.includes('level') && level !== undefined && (
            <Badge variant="secondary" className="bg-white/90 text-gray-900 text-base px-3 py-1.5 gap-1.5 shadow-md">
              <span className="font-bold">{t.inGame.level} {level}</span>
            </Badge>
          )}
          {showStats.includes('highScore') && highScore !== undefined && (
            <Badge variant="outline" className="bg-white/70 text-gray-700 text-sm px-3 py-1.5 gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              {highScore}
            </Badge>
          )}
        </div>

        {/* اليسار: أزرار التحكم */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {onRestart && (
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white shadow-md h-9 w-9 p-0"
              onClick={() => { playSound('click'); onRestart() }}
              title={t.inGame.restart}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          {onPause && (
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white shadow-md h-9 w-9 p-0"
              onClick={() => { playSound('click'); onPause() }}
              title={t.inGame.pause}
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}
          {onQuit && (
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white shadow-md h-9 w-9 p-0"
              onClick={() => { playSound('click'); onQuit() }}
              title={t.inGame.backToMenu}
            >
              <Home className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
