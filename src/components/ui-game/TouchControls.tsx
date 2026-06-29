'use client'

import { useEffect, useState } from 'react'
import { useGames3DStore as useGameStore } from "@/lib/games-3d/game-store";
import { useT3D as useT } from "@/lib/games-3d/use-t"
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'
import type { InputState } from '@/lib/games-3d/use-game-input'

interface TouchControlsProps {
  inputRef: React.RefObject<InputState>
  setTouch: (key: keyof InputState, val: boolean) => void
  /** أي أزرار تظهر */
  variant?: 'full' | 'platformer' | 'shooter' | 'simple'
}

/**
 * أزرار التحكم اللمسية للأجهزة المحمولة
 * تظهر فقط عند تفعيل وضع اللمس أو عند اكتشاف جهاز لمسي
 */
export function TouchControls({ inputRef, setTouch, variant = 'full' }: TouchControlsProps) {
  const controlMode = useGameStore((s) => s.controlMode)
  const [isTouch, setIsTouch] = useState(false)
  const t = useT()

  useEffect(() => {
    const check = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      )
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!isTouch && controlMode !== 'touch') return null

  // منع سياق القائمة الطويلة
  const noContext = (e: React.MouseEvent) => e.preventDefault()

  const handleStart = (key: keyof InputState) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    setTouch(key, true)
  }
  const handleEnd = (key: keyof InputState) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault()
    setTouch(key, false)
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none" onContextMenu={noContext}>
      {/* D-pad يسار الشاشة */}
      <div className="absolute bottom-6 left-4 sm:left-8 pointer-events-auto">
        <div className="relative w-40 h-40 sm:w-44 sm:h-44">
          {/* أعلى */}
          <Button
            variant="secondary"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/85 hover:bg-white shadow-lg active:bg-amber-200 p-0"
            onTouchStart={handleStart('forward')}
            onTouchEnd={handleEnd('forward')}
            onMouseDown={handleStart('forward')}
            onMouseUp={handleEnd('forward')}
            onMouseLeave={handleEnd('forward')}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
          {/* أسفل */}
          <Button
            variant="secondary"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/85 hover:bg-white shadow-lg active:bg-amber-200 p-0"
            onTouchStart={handleStart('back')}
            onTouchEnd={handleEnd('back')}
            onMouseDown={handleStart('back')}
            onMouseUp={handleEnd('back')}
            onMouseLeave={handleEnd('back')}
          >
            <ArrowDown className="w-5 h-5" />
          </Button>
          {/* يسار */}
          <Button
            variant="secondary"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/85 hover:bg-white shadow-lg active:bg-amber-200 p-0"
            onTouchStart={handleStart('left')}
            onTouchEnd={handleEnd('left')}
            onMouseDown={handleStart('left')}
            onMouseUp={handleEnd('left')}
            onMouseLeave={handleEnd('left')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {/* يمين */}
          <Button
            variant="secondary"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/85 hover:bg-white shadow-lg active:bg-amber-200 p-0"
            onTouchStart={handleStart('right')}
            onTouchEnd={handleEnd('right')}
            onMouseDown={handleStart('right')}
            onMouseUp={handleEnd('right')}
            onMouseLeave={handleEnd('right')}
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          {/* المنتصف - دائرة شفافة */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm" />
        </div>
      </div>

      {/* أزرار الإجراءات يمين الشاشة */}
      <div className="absolute bottom-6 right-4 sm:right-8 pointer-events-auto">
        <div className="flex flex-col gap-2 items-end">
          {variant !== 'simple' && (
            <div className="flex gap-2">
              {variant === 'shooter' && (
                <ActionButton
                  label={t.controls.shoot}
                  color="bg-blue-500"
                  onStart={handleStart('shoot')}
                  onEnd={handleEnd('shoot')}
                />
              )}
              {variant === 'platformer' && (
                <ActionButton
                  label={t.controls.jump}
                  color="bg-green-500"
                  size="lg"
                  onStart={handleStart('jump')}
                  onEnd={handleEnd('jump')}
                />
              )}
              {variant === 'full' && (
                <ActionButton
                  label={t.controls.jump}
                  color="bg-green-500"
                  size="lg"
                  onStart={handleStart('jump')}
                  onEnd={handleEnd('jump')}
                />
              )}
              {variant === 'full' && (
                <ActionButton
                  label={t.controls.attack}
                  color="bg-red-500"
                  onStart={handleStart('attack')}
                  onEnd={handleEnd('attack')}
                />
              )}
            </div>
          )}
          {variant === 'shooter' && (
            <ActionButton
              label={t.controls.jump}
              color="bg-green-500"
              onStart={handleStart('jump')}
              onEnd={handleEnd('jump')}
            />
          )}
          {variant === 'simple' && (
            <ActionButton
              label={t.controls.jump}
              color="bg-green-500"
              size="lg"
              onStart={handleStart('jump')}
              onEnd={handleEnd('jump')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

interface ActionButtonProps {
  label: string
  color: string
  size?: 'md' | 'lg'
  onStart: (e: any) => void
  onEnd: (e: any) => void
}

function ActionButton({ label, color, size = 'md', onStart, onEnd }: ActionButtonProps) {
  const sz = size === 'lg' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-12 h-12 sm:w-14 sm:h-14'
  return (
    <button
      className={`${sz} rounded-full ${color} text-white font-bold text-xs sm:text-sm shadow-lg active:scale-95 active:brightness-110 transition-transform flex items-center justify-center select-none`}
      onTouchStart={onStart}
      onTouchEnd={onEnd}
      onTouchCancel={onEnd}
      onMouseDown={onStart}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
      style={{ touchAction: 'none' }}
    >
      {label}
    </button>
  )
}
