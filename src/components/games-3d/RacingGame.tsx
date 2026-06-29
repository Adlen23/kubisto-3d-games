'use client'

import { useState, useCallback, useEffect } from 'react'
import { GameCanvas } from '@/components/ui-game/GameCanvas'
import { GameHUD } from '@/components/ui-game/GameHUD'
import { TouchControls } from '@/components/ui-game/TouchControls'
import { GameOverScreen } from '@/components/ui-game/GameOverScreen'
import { PauseOverlay } from '@/components/ui-game/PauseOverlay'
import { RacingScene } from './RacingScene'
import { useGames3DStore as useGameStore } from "@/lib/games-3d/game-store";
import { useT3D as useT, useLang3D } from "@/lib/games-3d/use-t"
import { useGameInput } from '@/lib/games-3d/use-game-input'
import { playSound, stopMusic } from '@/lib/games-3d/audio'

export function RacingGame() {
  const t = useT()
  const { isAr, dir } = useLang3D()
  const lang = isAr ? "ar" : "en"
  const setScreen = useGameStore((s) => s.setScreen)
  const soundOn = useGameStore((s) => s.soundOn)
  const musicOn = useGameStore((s) => s.musicOn)
  const highScores = useGameStore((s) => s.highScores)
  const submitScore = useGameStore((s) => s.submitScore)

  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [distance, setDistance] = useState(0)
  const [lives, setLives] = useState(3)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState<null | 'win' | 'lose'>(null)
  const [resetKey, setResetKey] = useState(0)

  const { inputRef, setTouch } = useGameInput(!paused && !gameOver)

  useEffect(() => {
    if (!musicOn) stopMusic()
  }, [musicOn])

  // السرعة تزيد مع المسافة
  const speed = Math.min(35, 12 + distance / 100)

  const handleCoin = useCallback(() => {
    setCoins((c) => c + 1)
    setScore((s) => s + 10)
  }, [])

  const handleCrash = useCallback(() => {
    setLives((l) => {
      const nl = l - 1
      if (nl <= 0) {
        const finalScore = score + distance
        setGameOver('lose')
        submitScore('racing', finalScore)
        return 0
      } else {
        playSound('hit', soundOn)
        setResetKey((k) => k + 1)
        return nl
      }
    })
  }, [score, distance, soundOn, submitScore])

  const handleDistance = useCallback((d: number) => {
    setDistance(d)
    setScore(d)
  }, [])

  const handleRestart = useCallback(() => {
    setScore(0)
    setCoins(0)
    setDistance(0)
    setLives(3)
    setPaused(false)
    setGameOver(null)
    setResetKey((k) => k + 1)
  }, [])

  const handleQuit = useCallback(() => setScreen('menu'), [setScreen])

  // الفوز عند الوصول لمسافة 1000
  const handleDistanceChecked = useCallback((d: number) => {
    if (d >= 1000 && !gameOver) {
      const finalScore = score + 500
      setGameOver('win')
      submitScore('racing', finalScore)
      playSound('win', soundOn)
    }
  }, [gameOver, score, soundOn, submitScore])

  useEffect(() => {
    handleDistanceChecked(distance)
  }, [distance, handleDistanceChecked])

  return (
    <div
      className="fixed inset-0"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(180deg, #87ceeb 0%, #b3e0ff 100%)' }}
    >
      <GameCanvas
        cameraPosition={[0, 4, 7]}
        cameraFov={60}
        showGround={false}
        ambientIntensity={0.8}
        sunIntensity={1.3}
        skySunPosition={[30, 80, -50]}
        fog={['#b3e0ff', 50]}
      >
        <RacingScene
          key={resetKey}
          onCoin={handleCoin}
          onCrash={handleCrash}
          onDistanceUpdate={handleDistance}
          paused={paused || !!gameOver}
          speed={speed}
        />
      </GameCanvas>

      <GameHUD
        score={score}
        lives={lives}
        coins={coins}
        highScore={highScores.racing}
        showStats={['score', 'lives', 'coins', 'highScore']}
        onPause={() => setPaused(true)}
        onRestart={handleRestart}
        onQuit={handleQuit}
      />

      <TouchControls
        inputRef={inputRef}
        setTouch={setTouch}
        variant="platformer"
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
          highScore={highScores.racing}
          isNewHighScore={(score + (gameOver === 'win' ? 500 : 0)) >= highScores.racing && score > 0}
          onRestart={handleRestart}
          onQuit={handleQuit}
        />
      )}
    </div>
  )
}
