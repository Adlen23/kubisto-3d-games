'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Kubisto } from '@/components/kubisto/Kubisto'
import { useGameInput } from '@/lib/use-game-input'
import { useGameStore } from '@/lib/game-store'
import { playSound } from '@/lib/audio'

/** عائق على المسار */
interface Obstacle {
  id: number
  z: number
  lane: number // -1, 0, 1
  type: 'box' | 'cone' | 'wall'
  passed: boolean
}

interface Coin {
  id: number
  z: number
  lane: number
  collected: boolean
}

interface RacingSceneProps {
  onCoin: () => void
  onCrash: () => void
  onDistanceUpdate: (dist: number) => void
  paused: boolean
  speed: number
}

const LANES = [-2, 0, 2]

function RacingScene({ onCoin, onCrash, onDistanceUpdate, paused, speed }: RacingSceneProps) {
  const appearance = useGameStore((s) => s.appearance)
  const soundOn = useGameStore((s) => s.soundOn)
  const { inputRef, clearPressed } = useGameInput(!paused)

  const playerRef = useRef<THREE.Group>(null)
  const playerState = useRef({
    lane: 1, // 0, 1, 2 (المقابل لـ LANES)
    targetLane: 1,
    x: 0,
    y: 0,
    jumping: false,
    jumpVel: 0,
    animState: 'idle' as 'idle' | 'run' | 'jump'
  })

  // العوائق والعملات
  const nextId = useRef(0)
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [coins, setCoins] = useState<Coin[]>([])
  const spawnTimer = useRef(0)
  const distance = useRef(0)

  const { camera } = useThree()

  useFrame((_, dtRaw) => {
    if (paused) return
    const dt = Math.min(dtRaw, 0.05)
    const ps = playerState.current
    const inp = inputRef.current

    // التحكم بالحركة الجانبية
    if (inp.left && !inp._leftHandled) {
      if (ps.targetLane > 0) {
        ps.targetLane -= 1
        playSound('click', soundOn)
      }
      inp._leftHandled = true
    }
    if (inp.right && !inp._rightHandled) {
      if (ps.targetLane < 2) {
        ps.targetLane += 1
        playSound('click', soundOn)
      }
      inp._rightHandled = true
    }
    if (!inp.left) inp._leftHandled = false
    if (!inp.right) inp._rightHandled = false

    // القفز
    if (inp.jumpPressed && !ps.jumping && ps.y === 0) {
      ps.jumping = true
      ps.jumpVel = 8
      ps.animState = 'jump'
      playSound('jump', soundOn)
    }

    // الحركة الجانبية السلسة
    const targetX = LANES[ps.targetLane]
    ps.x += (targetX - ps.x) * Math.min(1, dt * 12)
    ps.lane = ps.targetLane

    // الجاذبية للقفز
    if (ps.jumping) {
      ps.y += ps.jumpVel * dt
      ps.jumpVel -= 22 * dt
      if (ps.y <= 0) {
        ps.y = 0
        ps.jumping = false
        ps.jumpVel = 0
        ps.animState = 'run'
      }
    } else {
      ps.animState = 'run'
    }

    // تحريك اللاعب
    if (playerRef.current) {
      playerRef.current.position.x = ps.x
      playerRef.current.position.y = ps.y
      playerRef.current.rotation.y = Math.PI // يواجه عكس z (للأمام)
      playerRef.current.rotation.z = (targetX - ps.x) * 0.15
    }

    // المسافة تتقدم
    const moveSpeed = speed * dt
    distance.current += moveSpeed
    onDistanceUpdate(Math.floor(distance.current))

    // توليد العوائق والعملات
    spawnTimer.current += dt
    if (spawnTimer.current > 1.2 - Math.min(0.7, distance.current / 500)) {
      spawnTimer.current = 0
      const id = nextId.current++
      const isObstacle = Math.random() > 0.4
      const lane = Math.floor(Math.random() * 3)
      if (isObstacle) {
        const types: Obstacle['type'][] = ['box', 'cone', 'wall']
        setObstacles((prev) => [...prev, {
          id,
          z: -80,
          lane,
          type: types[Math.floor(Math.random() * types.length)],
          passed: false
        }])
      } else {
        // مجموعة عملات
        setCoins((prev) => [
          ...prev,
          { id, z: -80, lane, collected: false }
        ])
      }
    }

    // تحريك العوائق نحو اللاعب
    setObstacles((prev) => prev
      .map((o) => ({ ...o, z: o.z + moveSpeed }))
      .filter((o) => o.z < 15)
    )
    setCoins((prev) => prev
      .map((c) => ({ ...c, z: c.z + moveSpeed }))
      .filter((c) => c.z < 15)
    )

    // التحقق من الاصطدام
    const playerZ = 0
    const playerLaneX = LANES[ps.lane]
    setObstacles((prev) => {
      let crashed = false
      const updated = prev.map((o) => {
        if (o.passed) return o
        const ox = LANES[o.lane]
        const dz = o.z - playerZ
        if (Math.abs(dz) < 1.2 && Math.abs(ox - playerLaneX) < 1.0 && ps.y < 1.2) {
          crashed = true
          return { ...o, passed: true }
        }
        return o
      })
      if (crashed) {
        onCrash()
      }
      return updated.filter((o) => !o.passed || o.z < 10)
    })

    // جمع العملات
    setCoins((prev) => {
      let collected = false
      const updated = prev.map((c) => {
        if (c.collected) return c
        const cx = LANES[c.lane]
        const dz = c.z - playerZ
        if (Math.abs(dz) < 1.2 && Math.abs(cx - playerLaneX) < 0.8) {
          collected = true
          return { ...c, collected: true }
        }
        return c
      })
      if (collected) {
        playSound('coin', soundOn)
        onCoin()
      }
      return updated.filter((c) => !c.collected)
    })

    // الكاميرا خلف اللاعب
    camera.position.set(0, 4, 7)
    camera.lookAt(0, 1, -5)

    clearPressed()
  })

  // المسار - يتكرر للأمام
  return (
    <>
      {/* الطريق */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]} receiveShadow>
        <planeGeometry args={[8, 200]} />
        <meshStandardMaterial color="#3a3a4a" roughness={0.9} />
      </mesh>

      {/* خطوط المسار */}
      {[-2, -1, 0, 1, 2].map((lane) => (
        <mesh
          key={lane}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[lane, 0.01, -40]}
        >
          <planeGeometry args={[0.05, 200]} />
          <meshStandardMaterial color="white" />
        </mesh>
      ))}

      {/* العشب جانبي */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-7, 0, -40]} receiveShadow>
        <planeGeometry args={[6, 200]} />
        <meshStandardMaterial color="#5a9a3a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7, 0, -40]} receiveShadow>
        <planeGeometry args={[6, 200]} />
        <meshStandardMaterial color="#5a9a3a" roughness={1} />
      </mesh>

      {/* حواجز جانبية */}
      {Array.from({ length: 20 }).map((_, i) => (
        <group key={`l-${i}`} position={[-4.5, 0.5, -i * 10]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 1, 0.3]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <group key={`r-${i}`} position={[4.5, 0.5, -i * 10]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 1, 0.3]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>
      ))}

      {/* العوائق */}
      {obstacles.map((o) => (
        <ObstacleMesh key={o.id} obstacle={o} />
      ))}

      {/* العملات */}
      {coins.filter((c) => !c.collected).map((c) => (
        <RaceCoin key={c.id} coin={c} />
      ))}

      {/* اللاعب */}
      <group ref={playerRef} position={[0, 0, 0]}>
        <Kubisto appearance={appearance} state={playerState.current.animState} animate scale={0.85} />
      </group>
    </>
  )
}

function ObstacleMesh({ obstacle }: { obstacle: Obstacle }) {
  const x = LANES[obstacle.lane]
  if (obstacle.type === 'box') {
    return (
      <mesh position={[x, 0.5, obstacle.z]} castShadow>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
    )
  }
  if (obstacle.type === 'cone') {
    return (
      <mesh position={[x, 0.5, obstacle.z]} castShadow>
        <coneGeometry args={[0.5, 1, 12]} />
        <meshStandardMaterial color="#ff6600" roughness={0.5} />
      </mesh>
    )
  }
  // wall
  return (
    <mesh position={[x, 0.75, obstacle.z]} castShadow>
      <boxGeometry args={[1.8, 1.5, 0.3]} />
      <meshStandardMaterial color="#7c2d12" roughness={0.8} />
    </mesh>
  )
}

function RaceCoin({ coin }: { coin: Coin }) {
  const x = LANES[coin.lane]
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 4
  })
  return (
    <mesh ref={ref} position={[x, 1, coin.z]} castShadow>
      <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
      <meshStandardMaterial color="#ffd700" metalness={0.7} roughness={0.2} emissive="#ffa500" emissiveIntensity={0.3} />
    </mesh>
  )
}

// إضافة خصائص إضافية على InputState في الـ type
declare module '@/lib/use-game-input' {
  interface InputState {
    _leftHandled?: boolean
    _rightHandled?: boolean
  }
}

export { RacingScene }
