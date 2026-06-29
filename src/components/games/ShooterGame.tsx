'use client'

import { useState, useCallback, useEffect } from 'react'
import { GameCanvas } from '@/components/ui-game/GameCanvas'
import { GameHUD } from '@/components/ui-game/GameHUD'
import { TouchControls } from '@/components/ui-game/TouchControls'
import { GameOverScreen } from '@/components/ui-game/GameOverScreen'
import { PauseOverlay } from '@/components/ui-game/PauseOverlay'
import { ShooterScene } from './ShooterScene'
import { useGameStore, useT } from '@/lib/game-store'
import { useGameInput } from '@/lib/use-game-input'
import { playSound, stopMusic } from '@/lib/audio'

const TARGET_SCORE = 500 // الفوز عند 500 نقطة

export function ShooterGame() {
  const t = useT()
  const lang = useGameStore((s) => s.lang)
  const setScreen = useGameStore((s) => s.setScreen)
  const soundOn = useGameStore((s) => s.soundOn)
  const musicOn = useGameStore((s) => s.musicOn)
  const highScores = useGameStore((s) => s.highScores)
  const submitScore = useGameStore((s) => s.submitScore)

  const [score, setScore] = useState(0)
  const [ammo, setAmmo] = useState(30)
  const [missed, setMissed] = useState(0)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState<null | 'win' | 'lose'>(null)
  const [resetKey, setResetKey] = useState(0)

  const { inputRef, setTouch } = useGameInput(!paused && !gameOver)

  useEffect(() => {
    if (!musicOn) stopMusic()
  }, [musicOn])

  // المستوى يتغير مع النقاط
  const level = Math.min(5, 1 + Math.floor(score / 100))

  const handleHit = useCallback((type: 'red' | 'gold' | 'blue') => {
    const points = type === 'gold' ? 50 : type === 'blue' ? 30 : 10
    setScore((s) => {
      const ns = s + points
      if (ns >= TARGET_SCORE && !gameOver) {
        setTimeout(() => {
          setGameOver('win')
          submitScore('shooter', ns)
          playSound('win', soundOn)
        }, 100)
      }
      return ns
    })
  }, [gameOver, soundOn, submitScore])

  const handleMissedTarget = useCallback(() => {
    setMissed((m) => {
      const nm = m + 1
      if (nm >= 10) {
        setGameOver('lose')
        submitScore('shooter', score)
      }
      return nm
    })
  }, [score, submitScore])

  const handleMissedShot = useCallback(() => {
    setAmmo((a) => Math.max(0, a - 1))
  }, [])

  // تجديد الذخيرة ببطء
  useEffect(() => {
    if (paused || gameOver) return
    const interval = setInterval(() => {
      setAmmo((a) => Math.min(30, a + 1))
    }, 2000)
    return () => clearInterval(interval)
  }, [paused, gameOver])

  const handleRestart = useCallback(() => {
    setScore(0)
    setAmmo(30)
    setMissed(0)
    setPaused(false)
    setGameOver(null)
    setResetKey((k) => k + 1)
  }, [])

  const handleQuit = useCallback(() => setScreen('menu'), [setScreen])

  return (
    <div
      className="fixed inset-0"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 50%, #93c5fd 100%)' }}
    >
      <GameCanvas
        cameraPosition={[0, 4, 11]}
        cameraFov={55}
        groundColor="#3a2a1a"
        groundSize={30}
        ambientIntensity={0.6}
        sunIntensity={1.0}
        skySunPosition={[20, 80, -30]}
        fog={['#1e3a8a', 25]}
      >
        <ShooterScene
          key={resetKey}
          level={level}
          onHit={handleHit}
          onMissedTarget={handleMissedTarget}
          onMissedShot={handleMissedShot}
          paused={paused || !!gameOver}
        />
      </GameCanvas>

      <GameHUD
        score={score}
        level={level}
        highScore={highScores.shooter}
        showStats={['score', 'level', 'highScore']}
        onPause={() => setPaused(true)}
        onRestart={handleRestart}
        onQuit={handleQuit}
      />

      {/* مؤشر الذخيرة والأهداف المفقودة */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex gap-2">
        <div className="bg-white/90 rounded-full px-4 py-1.5 shadow-md flex items-center gap-2">
          <span className="text-xs font-bold text-gray-600">
            {lang === 'ar' ? 'ذخيرة:' : 'Ammo:'}
          </span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-4 rounded-sm ${i < Math.ceil(ammo / 6) ? 'bg-yellow-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-sm font-black text-gray-900">{ammo}</span>
        </div>
        <div className="bg-white/90 rounded-full px-4 py-1.5 shadow-md flex items-center gap-1.5">
          <span className="text-xs font-bold text-gray-600">
            {lang === 'ar' ? 'مفقود:' : 'Missed:'}
          </span>
          <span className="text-sm font-black text-red-600">{missed}/10</span>
        </div>
      </div>

      {/* شريط التقدم نحو الفوز */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none w-64 max-w-[80vw]">
        <div className="bg-white/90 rounded-full h-3 shadow-md overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
            style={{ width: `${Math.min(100, (score / TARGET_SCORE) * 100)}%` }}
          />
        </div>
        <p className="text-center text-xs font-bold text-white mt-1 drop-shadow">
          {score}/{TARGET_SCORE}
        </p>
      </div>

      <TouchControls
        inputRef={inputRef}
        setTouch={setTouch}
        variant="shooter"
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
          highScore={highScores.shooter}
          isNewHighScore={score >= highScores.shooter && score > 0}
          onRestart={handleRestart}
          onQuit={handleQuit}
        />
      )}
    </div>
  )
}
