'use client'

import { useState, useCallback, useEffect } from 'react'
import { GameCanvas } from '@/components/ui-game/GameCanvas'
import { GameHUD } from '@/components/ui-game/GameHUD'
import { TouchControls } from '@/components/ui-game/TouchControls'
import { GameOverScreen } from '@/components/ui-game/GameOverScreen'
import { PauseOverlay } from '@/components/ui-game/PauseOverlay'
import { AdventureScene } from './AdventureScene'
import { useGames3DStore as useGameStore } from "@/lib/games-3d/game-store";
import { useT3D as useT, useLang3D } from "@/lib/games-3d/use-t"
import { useGameInput } from '@/lib/games-3d/use-game-input'
import { playSound } from '@/lib/games-3d/audio'
import { stopMusic } from '@/lib/games-3d/audio'

const MAX_LEVELS = 3

export function AdventureGame() {
  const t = useT()
  const { isAr, dir } = useLang3D()
  const lang = isAr ? "ar" : "en"
  const setScreen = useGameStore((s) => s.setScreen)
  const soundOn = useGameStore((s) => s.soundOn)
  const musicOn = useGameStore((s) => s.musicOn)
  const highScores = useGameStore((s) => s.highScores)
  const submitScore = useGameStore((s) => s.submitScore)

  const [level, setLevel] = useState(0)
  const [coins, setCoins] = useState(0)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState<null | 'win' | 'lose'>(null)
  const [resetKey, setResetKey] = useState(0)

  const { inputRef, setTouch } = useGameInput(!paused && !gameOver)

  useEffect(() => {
    if (!musicOn) stopMusic()
  }, [musicOn])

  const handleCoin = useCallback(() => {
    setCoins((c) => c + 1)
    setScore((s) => s + 10)
  }, [])

  const handleFall = useCallback(() => {
    setLives((l) => {
      const nl = l - 1
      if (nl <= 0) {
        setGameOver('lose')
        submitScore('adventure', score)
        return 0
      } else {
        playSound('hit', soundOn)
        // إعادة تشغيل المستوى الحالي بإعادة تركيب المشهد
        setResetKey((k) => k + 1)
        return nl
      }
    })
  }, [score, soundOn, submitScore])

  const handleReachEnd = useCallback(() => {
    if (level + 1 >= MAX_LEVELS) {
      // فوز - أكمل كل المستويات
      setScore((s) => s + 100)
      setGameOver('win')
      submitScore('adventure', score + 100)
      playSound('win', soundOn)
    } else {
      // المستوى التالي
      setScore((s) => s + 50)
      setLevel((l) => l + 1)
      playSound('levelup', soundOn)
    }
  }, [level, score, soundOn, submitScore])

  const handleRestart = useCallback(() => {
    setLevel(0)
    setCoins(0)
    setLives(3)
    setScore(0)
    setPaused(false)
    setGameOver(null)
    setResetKey((k) => k + 1)
  }, [])

  const handleQuit = useCallback(() => {
    setScreen('menu')
  }, [setScreen])

  const handleNext = useCallback(() => {
    handleRestart()
  }, [handleRestart])

  return (
    <div
      className="fixed inset-0 bg-sky-300"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <GameCanvas
        cameraPosition={[0, 5, 10]}
        cameraFov={55}
        groundColor="#5a9a3a"
        groundSize={80}
        ambientIntensity={0.7}
        sunIntensity={1.4}
        skySunPosition={[50, 80, 30]}
      >
        <AdventureScene
          key={`${level}-${resetKey}`}
          level={level}
          onCoinCollected={handleCoin}
          onFall={handleFall}
          onReachEnd={handleReachEnd}
          paused={paused || !!gameOver}
        />
      </GameCanvas>

      <GameHUD
        score={score}
        lives={lives}
        coins={coins}
        level={level + 1}
        highScore={highScores.adventure}
        showStats={['score', 'lives', 'coins', 'level', 'highScore']}
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
          score={score}
          highScore={highScores.adventure}
          isNewHighScore={score >= highScores.adventure && score > 0}
          onRestart={handleRestart}
          onQuit={handleQuit}
          onNext={gameOver === 'win' ? handleNext : undefined}
        />
      )}
    </div>
  )
}
