'use client'

import { useRef, useState, useCallback, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Kubisto } from '@/components/kubisto/Kubisto'
import { useGameInput } from '@/lib/games-3d/use-game-input'
import { useGames3DStore as useGameStore } from "@/lib/games-3d/game-store"
import { playSound } from '@/lib/games-3d/audio'

/**
 * لعبة دفع الصناديق - Sokoban style 3D
 * اللاعب يدفع الصناديق إلى الأماكن المحددة
 */

type Cell = 'empty' | 'wall' | 'target' | 'box' | 'boxOnTarget'
type Grid = Cell[][]

const LEVELS: Grid[] = [
  // المستوى 1 - سهل
  [
    ['wall','wall','wall','wall','wall','wall','wall'],
    ['wall','empty','empty','empty','empty','empty','wall'],
    ['wall','empty','target','empty','target','empty','wall'],
    ['wall','empty','empty','box','empty','empty','wall'],
    ['wall','empty','empty','empty','box','empty','wall'],
    ['wall','empty','empty','empty','empty','empty','wall'],
    ['wall','wall','wall','wall','wall','wall','wall']
  ],
  // المستوى 2
  [
    ['wall','wall','wall','wall','wall','wall','wall','wall'],
    ['wall','empty','empty','empty','empty','empty','empty','wall'],
    ['wall','empty','target','empty','empty','target','empty','wall'],
    ['wall','empty','empty','empty','box','empty','empty','wall'],
    ['wall','empty','empty','box','empty','empty','empty','wall'],
    ['wall','empty','empty','empty','empty','target','empty','wall'],
    ['wall','empty','empty','empty','empty','empty','empty','wall'],
    ['wall','wall','wall','wall','wall','wall','wall','wall']
  ],
  // المستوى 3 - أصعب
  [
    ['wall','wall','wall','wall','wall','wall','wall','wall','wall'],
    ['wall','empty','empty','empty','empty','empty','empty','empty','wall'],
    ['wall','empty','target','empty','target','empty','target','empty','wall'],
    ['wall','empty','empty','box','empty','box','empty','box','empty'],
    ['wall','empty','empty','empty','empty','empty','empty','empty','wall'],
    ['wall','empty','empty','empty','empty','empty','empty','empty','wall'],
    ['wall','wall','wall','wall','wall','wall','wall','wall','wall']
  ]
]

interface PuzzleSceneProps {
  level: number
  onMove: () => void
  onWin: () => void
  paused: boolean
}

function PuzzleScene({ level, onMove, onWin, paused }: PuzzleSceneProps) {
  const appearance = useGameStore((s) => s.appearance)
  const soundOn = useGameStore((s) => s.soundOn)
  const { inputRef, clearPressed } = useGameInput(!paused)

  const baseGrid = LEVELS[level] || LEVELS[0]
  const [grid, setGrid] = useState<Grid>(() => baseGrid.map((r) => [...r]))

  // إيجاد موقع اللاعب الابتدائي (مركز فارغ)
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>(() => {
    const cy = Math.floor(baseGrid.length / 2)
    const cx = Math.floor(baseGrid[0].length / 2)
    return { x: cx, y: cy }
  })

  const playerRef = useRef<THREE.Group>(null)
  const targetRot = useRef(0)

  const { camera } = useThree()

  const CELL = 1.2
  const offsetX = -((baseGrid[0].length - 1) * CELL) / 2
  const offsetZ = -((baseGrid.length - 1) * CELL) / 2

  const gridToWorld = (gx: number, gy: number): [number, number, number] => [
    offsetX + gx * CELL,
    0,
    offsetZ + gy * CELL
  ]

  // التحقق من الفوز
  const checkWin = useCallback((g: Grid) => {
    for (const row of g) {
      for (const cell of row) {
        if (cell === 'target') return false // يوجد هدف فارغ
      }
    }
    return true
  }, [])

  // محاولة تحريك اللاعب
  const tryMove = useCallback((dx: number, dy: number) => {
    setGrid((prevGrid) => {
      const px = playerPos.x
      const py = playerPos.y
      const nx = px + dx
      const ny = py + dy
      if (ny < 0 || ny >= prevGrid.length || nx < 0 || nx >= prevGrid[0].length) return prevGrid
      const target = prevGrid[ny][nx]
      if (target === 'wall') return prevGrid

      // إذا كان صندوقاً، حاول دفعه
      if (target === 'box' || target === 'boxOnTarget') {
        const bx = nx + dx
        const by = ny + dy
        if (by < 0 || by >= prevGrid.length || bx < 0 || bx >= prevGrid[0].length) return prevGrid
        const beyond = prevGrid[by][bx]
        if (beyond === 'wall' || beyond === 'box' || beyond === 'boxOnTarget') return prevGrid

        // دفع الصندوق
        const newG = prevGrid.map((r) => [...r])
        newG[ny][nx] = target === 'boxOnTarget' ? 'target' : 'empty'
        newG[by][bx] = beyond === 'target' ? 'boxOnTarget' : 'box'
        playSound('click', soundOn)
        setPlayerPos({ x: nx, y: ny })
        onMove()
        if (checkWin(newG)) {
          setTimeout(() => onWin(), 300)
        }
        return newG
      }

      // تحريك اللاعب فقط
      playSound('click', soundOn)
      setPlayerPos({ x: nx, y: ny })
      onMove()
      return prevGrid
    })
  }, [playerPos, soundOn, onMove, onWin, checkWin])

  useFrame((_, dtRaw) => {
    if (paused || !playerRef.current) return
    const dt = Math.min(dtRaw, 0.05)
    const inp = inputRef.current

    // الحركة على شبكة - عند الضغط
    if (inp.jumpPressed || inp.forward) {
      if (!inp._puzzleHandled) {
        tryMove(0, -1)
        targetRot.current = 0
        inp._puzzleHandled = true
      }
    } else if (inp.back) {
      if (!inp._puzzleHandled) {
        tryMove(0, 1)
        targetRot.current = Math.PI
        inp._puzzleHandled = true
      }
    } else if (inp.left) {
      if (!inp._puzzleHandled) {
        tryMove(-1, 0)
        targetRot.current = -Math.PI / 2
        inp._puzzleHandled = true
      }
    } else if (inp.right) {
      if (!inp._puzzleHandled) {
        tryMove(1, 0)
        targetRot.current = Math.PI / 2
        inp._puzzleHandled = true
      }
    } else {
      inp._puzzleHandled = false
    }

    // انتقال سلس للاعب
    const [tx, , tz] = gridToWorld(playerPos.x, playerPos.y)
    playerRef.current.position.x += (tx - playerRef.current.position.x) * Math.min(1, dt * 15)
    playerRef.current.position.z += (tz - playerRef.current.position.z) * Math.min(1, dt * 15)

    // دوران سلس
    let cur = playerRef.current.rotation.y
    let tgt = targetRot.current
    let diff = tgt - cur
    while (diff > Math.PI) diff -= Math.PI * 2
    while (diff < -Math.PI) diff += Math.PI * 2
    playerRef.current.rotation.y = cur + diff * Math.min(1, dt * 12)

    // الكاميرا من فوق بزاوية مائلة
    const camTargetX = 0
    const camTargetY = 9
    const camTargetZ = 8
    camera.position.x += (camTargetX - camera.position.x) * 0.1
    camera.position.y += (camTargetY - camera.position.y) * 0.1
    camera.position.z += (camTargetZ - camera.position.z) * 0.1
    camera.lookAt(0, 0, 0)

    clearPressed()
  })

  // رسم الشبكة
  return (
    <>
      {/* الأرضية */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#5a9a3a" roughness={1} />
      </mesh>

      {/* الخلايا */}
      {grid.map((row, y) =>
        row.map((cell, x) => {
          const [wx, , wz] = gridToWorld(x, y)
          if (cell === 'wall') {
            return (
              <mesh key={`${x}-${y}`} position={[wx, 0.5, wz]} castShadow receiveShadow>
                <boxGeometry args={[CELL, 1, CELL]} />
                <meshStandardMaterial color="#7c5e3c" roughness={0.9} />
              </mesh>
            )
          }
          // بلاط أرضية لكل خلية فارغة
          return (
            <group key={`${x}-${y}`}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[wx, 0, wz]} receiveShadow>
                <planeGeometry args={[CELL * 0.95, CELL * 0.95]} />
                <meshStandardMaterial color={cell === 'target' || cell === 'boxOnTarget' ? '#ffd700' : '#9bd06a'} roughness={0.9} />
              </mesh>
              {(cell === 'target' || cell === 'boxOnTarget') && (
                <mesh position={[wx, 0.05, wz]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.3, 0.45, 24]} />
                  <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={0.4} side={THREE.DoubleSide} />
                </mesh>
              )}
              {(cell === 'box' || cell === 'boxOnTarget') && (
                <mesh position={[wx, 0.4, wz]} castShadow>
                  <boxGeometry args={[CELL * 0.8, 0.8, CELL * 0.8]} />
                  <meshStandardMaterial
                    color={cell === 'boxOnTarget' ? '#22c55e' : '#a16207'}
                    roughness={0.7}
                    emissive={cell === 'boxOnTarget' ? '#22c55e' : '#000000'}
                    emissiveIntensity={cell === 'boxOnTarget' ? 0.2 : 0}
                  />
                </mesh>
              )}
            </group>
          )
        })
      )}

      {/* اللاعب */}
      <group ref={playerRef}>
        <Kubisto appearance={appearance} state="idle" animate scale={0.7} />
      </group>
    </>
  )
}

// إضافة خاصية على InputState
declare module '@/lib/games-3d/use-game-input' {
  interface InputState {
    _puzzleHandled?: boolean
  }
}

export { PuzzleScene }
