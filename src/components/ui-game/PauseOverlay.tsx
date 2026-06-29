'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useT3D as useT } from "@/lib/games-3d/use-t"
import { Play, RotateCcw, Home } from 'lucide-react'
import { playSound } from '@/lib/games-3d/audio'

interface PauseOverlayProps {
  onResume: () => void
  onRestart: () => void
  onQuit: () => void
}

/**
 * شاشة الإيقاف المؤقت
 */
export function PauseOverlay({ onResume, onRestart, onQuit }: PauseOverlayProps) {
  const t = useT()
  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center p-4"
      style={{
        background: 'rgba(20,20,40,0.7)',
        backdropFilter: 'blur(6px)'
      }}
    >
      <Card className="max-w-xs w-full p-6 bg-white/95 shadow-2xl text-center">
        <div className="text-5xl mb-2">⏸️</div>
        <h2 className="text-2xl font-black mb-4 text-gray-800">
          {t.inGame.pause}
        </h2>
        <div className="flex flex-col gap-2">
          <Button
            className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-bold h-12"
            onClick={() => { playSound('click'); onResume() }}
          >
            <Play className="w-4 h-4 mr-2" />
            {t.inGame.resume}
          </Button>
          <Button
            variant="secondary"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold h-11"
            onClick={() => { playSound('click'); onRestart() }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.inGame.restart}
          </Button>
          <Button
            variant="secondary"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold h-11"
            onClick={() => { playSound('click'); onQuit() }}
          >
            <Home className="w-4 h-4 mr-2" />
            {t.inGame.backToMenu}
          </Button>
        </div>
      </Card>
    </div>
  )
}
