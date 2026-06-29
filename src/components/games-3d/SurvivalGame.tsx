'use client'

import { useState, useCallback, useEffect } from 'react'
import { GameCanvas } from '@/components/ui-game/GameCanvas'
import { GameHUD } from '@/components/ui-game/GameHUD'
import { TouchControls } from '@/components/ui-game/TouchControls'
import { GameOverScreen } from '@/components/ui-game/GameOverScreen'
import { PauseOverlay } from '@/components/ui-game/PauseOverlay'
import { SurvivalScene } from './SurvivalScene'
import { useGames3DStore as useGameStore } from "@/lib/games-3d/game-store";
import { useT3D as useT, useLang3D } from "@/lib/games-3d/use-t"
import { useGameInput } from '@/lib/games-3d/use-game-input'
import { playSound, stopMusic } from '@/lib/games-3d/audio'

const SURVIVAL_TARGET = 60 // 60 ثانية = فوز

export function SurvivalGame() {
  const t = useT()
  const { isAr, dir } = useLang3D()
  const lang = isAr ? "ar" : "en"
  const setScreen = useGameStore((s) => s.setScreen)
  const soundOn = useGameStore((s) => s.soundOn)
  const musicOn = useGameStore((s) => s.musicOn)
  const highScores = useGameStore((s) => s.highScores)
  const submitScore = useGameStore((s) => s.submitScore)

  const [time, setTime] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState<null | 'win' | 'lose'>(null)
  const [resetKey, setResetKey] = useState(0)

  const { inputRef, setTouch } = useGameInput(!paused && !gameOver)

  useEffect(() => {
    if (!musicOn) stopMusic()
  }, [musicOn])

  // صعوبة متزايدة
  const difficulty = Math.min(10, Math.floor(time / 5))

  const handleTimeUpdate = useCallback((t: number) => {
    setTime(t)
    setScore(Math.floor(t * 10))
    if (t >= SURVIVAL_TARGET && !gameOver) {
      const finalScore = Math.floor(t * 10) + 500
      setGameOver('win')
      submitScore('survival', finalScore)
      playSound('win', soundOn)
    }
  }, [gameOver, soundOn, submitScore])

  const handleHit = useCallback(() => {
    setLives((l) => {
      const nl = l - 1
      if (nl <= 0) {
        const finalScore = Math.floor(time * 10)
        setGameOver('lose')
        submitScore('survival', finalScore)
        return 0
      }
      playSound('hit', soundOn)
      return nl
    })
  }, [time, soundOn, submitScore])

  const handleHeartCollect = useCallback(() => {
    setLives((l) => Math.min(5, l + 1))
  }, [])

  const handleRestart = useCallback(() => {
    setTime(0)
    setScore(0)
    setLives(3)
    setPaused(false)
    setGameOver(null)
    setResetKey((k) => k + 1)
  }, [])

  const handleQuit = useCallback(() => setScreen('menu'), [setScreen])

  return (
    <div
      className="fixed inset-0"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)' }}
    >
      <GameCanvas
        cameraPosition={[0, 12, 10]}
        cameraFov={55}
        groundColor="#5a9a3a"
        groundSize={30}
        ambientIntensity={0.7}
        sunIntensity={1.2}
        skySunPosition={[30, 70, 30]}
      >
        <SurvivalScene
          key={resetKey}
          onTimeUpdate={handleTimeUpdate}
          onHit={handleHit}
          onCollectHeart={handleHeartCollect}
          paused={paused || !!gameOver}
          difficulty={difficulty}
        />
      </GameCanvas>

      <GameHUD
        score={score}
        lives={lives}
        time={Math.max(0, Math.floor(SURVIVAL_TARGET - time))}
        highScore={highScores.survival}
        showStats={['score', 'lives', 'time', 'highScore']}
        onPause={() => setPaused(true)}
        onRestart={handleRestart}
        onQuit={handleQuit}
      />

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
          score={score + (gameOver === 'win' ? 500 : 0)}
          highScore={highScores.survival}
          isNewHighScore={(score + (gameOver === 'win' ? 500 : 0)) >= highScores.survival && score > 0}
          onRestart={handleRestart}
          onQuit={handleQuit}
        />
      )}
    </div>
  )
}
