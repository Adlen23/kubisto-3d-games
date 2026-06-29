'use client'

import { useState, useCallback, useEffect } from 'react'
import { GameCanvas } from '@/components/ui-game/GameCanvas'
import { GameHUD } from '@/components/ui-game/GameHUD'
import { TouchControls } from '@/components/ui-game/TouchControls'
import { GameOverScreen } from '@/components/ui-game/GameOverScreen'
import { PauseOverlay } from '@/components/ui-game/PauseOverlay'
import { PuzzleScene } from './PuzzleScene'
import { useGames3DStore as useGameStore } from "@/lib/games-3d/game-store";
import { useT3D as useT, useLang3D } from "@/lib/games-3d/use-t"
import { useGameInput } from '@/lib/games-3d/use-game-input'
import { playSound, stopMusic } from '@/lib/games-3d/audio'

const MAX_LEVELS = 3

export function PuzzleGame() {
  const t = useT()
  const { isAr, dir } = useLang3D()
  const lang = isAr ? "ar" : "en"
  const setScreen = useGameStore((s) => s.setScreen)
  const soundOn = useGameStore((s) => s.soundOn)
  const musicOn = useGameStore((s) => s.musicOn)
  const highScores = useGameStore((s) => s.highScores)
  const submitScore = useGameStore((s) => s.submitScore)

  const [level, setLevel] = useState(0)
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState<null | 'win' | 'lose'>(null)
  const [resetKey, setResetKey] = useState(0)

  const { inputRef, setTouch } = useGameInput(!paused && !gameOver)

  useEffect(() => {
    if (!musicOn) stopMusic()
  }, [musicOn])

  const handleMove = useCallback(() => {
    setMoves((m) => m + 1)
    setScore((s) => Math.max(0, s - 1)) // كل حركة تنقص نقطة، التحدي بأقل حركات
  }, [])

  const handleWin = useCallback(() => {
    const bonus = Math.max(50, 200 - moves * 5)
    const newScore = score + bonus
    setScore(newScore)
    playSound('win', soundOn)
    if (level + 1 >= MAX_LEVELS) {
      setGameOver('win')
      submitScore('puzzle', newScore)
    } else {
      setTimeout(() => {
        setLevel((l) => l + 1)
        setMoves(0)
        setResetKey((k) => k + 1)
      }, 800)
    }
  }, [level, moves, score, soundOn, submitScore])

  const handleRestart = useCallback(() => {
    setLevel(0)
    setMoves(0)
    setScore(0)
    setPaused(false)
    setGameOver(null)
    setResetKey((k) => k + 1)
  }, [])

  const handleQuit = useCallback(() => setScreen('menu'), [setScreen])

  const handleNext = useCallback(() => {
    handleRestart()
  }, [handleRestart])

  return (
    <div
      className="fixed inset-0"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(180deg, #d1fae5 0%, #a7f3d0 100%)' }}
    >
      <GameCanvas
        cameraPosition={[0, 9, 8]}
        cameraFov={50}
        showGround={false}
        ambientIntensity={0.7}
        sunIntensity={1.2}
        skySunPosition={[30, 60, 30]}
      >
        <PuzzleScene
          key={`${level}-${resetKey}`}
          level={level}
          onMove={handleMove}
          onWin={handleWin}
          paused={paused || !!gameOver}
        />
      </GameCanvas>

      <GameHUD
        score={score}
        level={level + 1}
        highScore={highScores.puzzle}
        showStats={['score', 'level', 'highScore']}
        onPause={() => setPaused(true)}
        onRestart={handleRestart}
        onQuit={handleQuit}
      />

      {/* عداد الحركات - في وسط الشاشة العلوي */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-white/90 rounded-full px-4 py-1.5 shadow-md flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600">
            {lang === 'ar' ? 'الحركات:' : 'Moves:'}
          </span>
          <span className="text-lg font-black text-gray-900">{moves}</span>
        </div>
      </div>

      <TouchControls
        inputRef={inputRef}
        setTouch={setTouch}
        variant="simple"
      />

      {paused && !gameOver && (
        <PauseOverlay
          onResume={() => setPaused(false)}
          onRestart={handleRestart}
          onQuit={handleQuit}
        />
      )}

      {gameOver && (
        <GameOverScreen
          variant={gameOver}
          score={score}
          highScore={highScores.puzzle}
          isNewHighScore={score >= highScores.puzzle && score > 0}
          onRestart={handleRestart}
          onQuit={handleQuit}
          onNext={gameOver === 'win' ? handleNext : undefined}
        />
      )}
    </div>
  )
}
