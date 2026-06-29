'use client'

import { useState, useCallback, useEffect } from 'react'
import { GameCanvas } from '@/components/ui-game/GameCanvas'
import { GameHUD } from '@/components/ui-game/GameHUD'
import { TouchControls } from '@/components/ui-game/TouchControls'
import { GameOverScreen } from '@/components/ui-game/GameOverScreen'
import { PauseOverlay } from '@/components/ui-game/PauseOverlay'
import { BattleScene } from './BattleScene'
import { useGames3DStore as useGameStore } from "@/lib/games-3d/game-store";
import { useT3D as useT, useLang3D } from "@/lib/games-3d/use-t"
import { useGameInput } from '@/lib/games-3d/use-game-input'
import { playSound, stopMusic } from '@/lib/games-3d/audio'

const MAX_WAVES = 5

export function BattleGame() {
  const t = useT()
  const { isAr, dir } = useLang3D()
  const lang = isAr ? "ar" : "en"
  const setScreen = useGameStore((s) => s.setScreen)
  const soundOn = useGameStore((s) => s.soundOn)
  const musicOn = useGameStore((s) => s.musicOn)
  const highScores = useGameStore((s) => s.highScores)
  const submitScore = useGameStore((s) => s.submitScore)

  const [wave, setWave] = useState(1)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState<null | 'win' | 'lose'>(null)
  const [resetKey, setResetKey] = useState(0)

  const { inputRef, setTouch } = useGameInput(!paused && !gameOver)

  useEffect(() => {
    if (!musicOn) stopMusic()
  }, [musicOn])

  const handleKill = useCallback(() => {
    setScore((s) => s + 25 * wave)
  }, [wave])

  const handleHit = useCallback(() => {
    setLives((l) => {
      const nl = l - 1
      if (nl <= 0) {
        setGameOver('lose')
        submitScore('battle', score)
        return 0
      }
      playSound('hit', soundOn)
      return nl
    })
  }, [score, soundOn, submitScore])

  const handleWaveComplete = useCallback((w: number) => {
    if (w >= MAX_WAVES) {
      const bonus = 500
      setScore((s) => s + bonus)
      setGameOver('win')
      submitScore('battle', score + bonus)
      playSound('win', soundOn)
    } else {
      setScore((s) => s + 100)
      setWave((wv) => wv + 1)
      setResetKey((k) => k + 1)
      playSound('levelup', soundOn)
    }
  }, [score, soundOn, submitScore])

  const handleRestart = useCallback(() => {
    setWave(1)
    setScore(0)
    setLives(3)
    setPaused(false)
    setGameOver(null)
    setResetKey((k) => k + 1)
  }, [])

  const handleQuit = useCallback(() => setScreen('menu'), [setScreen])
  const handleNext = useCallback(() => handleRestart(), [handleRestart])

  return (
    <div
      className="fixed inset-0"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(180deg, #4a2c2a 0%, #6b3e3a 50%, #8b5a4f 100%)' }}
    >
      <GameCanvas
        cameraPosition={[0, 8, 8]}
        cameraFov={55}
        groundColor="#5a3a2a"
        groundSize={40}
        ambientIntensity={0.5}
        sunIntensity={1.0}
        skySunPosition={[30, 60, -30]}
        showSky={false}
        fog={['#2a1a18', 30]}
      >
        <BattleScene
          key={resetKey}
          wave={wave}
          onKill={handleKill}
          onHit={handleHit}
          onWaveComplete={handleWaveComplete}
          onGameOver={() => setGameOver('lose')}
          paused={paused || !!gameOver}
        />
      </GameCanvas>

      <GameHUD
        score={score}
        lives={lives}
        level={wave}
        highScore={highScores.battle}
        showStats={['score', 'lives', 'level', 'highScore']}
        onPause={() => setPaused(true)}
        onRestart={handleRestart}
        onQuit={handleQuit}
      />

      <TouchControls
        inputRef={inputRef}
        setTouch={setTouch}
        variant="full"
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
          highScore={highScores.battle}
          isNewHighScore={score >= highScores.battle && score > 0}
          onRestart={handleRestart}
          onQuit={handleQuit}
          onNext={gameOver === 'win' ? handleNext : undefined}
        />
      )}
    </div>
  )
}
