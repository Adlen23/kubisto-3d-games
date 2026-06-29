'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Kubisto } from '@/components/kubisto/Kubisto'
import { useGameInput } from '@/lib/use-game-input'
import { useGameStore } from '@/lib/game-store'
import { playSound } from '@/lib/audio'

/** منصة في عالم المغامرة */
interface Platform {
  position: [number, number, number]
  size: [number, number, number]
  color?: string
}

interface Coin {
  id: number
  position: [number, number, number]
  collected: boolean
}

const LEVELS: Platform[][] = [
  // المستوى 1 - سهل
  [
    { position: [0, 0, 0], size: [8, 0.5, 8], color: '#7ec850' },
    { position: [8, 1, 0], size: [4, 0.5, 4], color: '#9bd06a' },
    { position: [14, 2, 2], size: [3, 0.5, 3], color: '#9bd06a' },
    { position: [18, 1.5, -2], size: [3, 0.5, 3], color: '#9bd06a' },
    { position: [22, 0, 0], size: [6, 0.5, 6], color: '#7ec850' }
  ],
  // المستوى 2 - متوسط
  [
    { position: [0, 0, 0], size: [6, 0.5, 6], color: '#7ec850' },
    { position: [6, 1.5, 0], size: [2, 0.5, 2], color: '#9bd06a' },
    { position: [10, 2.5, 2], size: [2, 0.5, 2], color: '#9bd06a' },
    { position: [14, 3, -1], size: [2, 0.5, 2], color: '#9bd06a' },
    { position: [18, 2.5, -3], size: [2, 0.5, 2], color: '#9bd06a' },
    { position: [22, 1.5, -2], size: [2, 0.5, 2], color: '#9bd06a' },
    { position: [26, 0, 0], size: [6, 0.5, 6], color: '#7ec850' }
  ],
  // المستوى 3 - صعب
  [
    { position: [0, 0, 0], size: [4, 0.5, 4], color: '#7ec850' },
    { position: [5, 2, 0], size: [1.5, 0.5, 1.5], color: '#9bd06a' },
    { position: [9, 3.5, 1], size: [1.5, 0.5, 1.5], color: '#9bd06a' },
    { position: [13, 4.5, -1], size: [1.5, 0.5, 1.5], color: '#9bd06a' },
    { position: [17, 4, 2], size: [1.5, 0.5, 1.5], color: '#9bd06a' },
    { position: [21, 3, 0], size: [1.5, 0.5, 1.5], color: '#9bd06a' },
    { position: [25, 1.5, -1], size: [1.5, 0.5, 1.5], color: '#9bd06a' },
    { position: [29, 0, 0], size: [6, 0.5, 6], color: '#7ec850' }
  ]
]

const COIN_LAYOUT: { level: number; positions: [number, number, number][] }[] = [
  {
    level: 0,
    positions: [
      [0, 1.5, 0], [-2, 1.5, 2], [2, 1.5, -2],
      [8, 2.5, 0], [10, 2.5, 0],
      [14, 3.5, 2], [18, 3, -2],
      [22, 1.5, 0], [24, 1.5, 0]
    ]
  },
  {
    level: 1,
    positions: [
      [0, 1.5, 0], [-2, 1.5, 2], [2, 1.5, -2],
      [6, 2.5, 0], [10, 3.5, 2], [14, 4, -1],
      [18, 3.5, -3], [22, 2.5, -2], [26, 1.5, 0]
    ]
  },
  {
    level: 2,
    positions: [
      [0, 1.5, 0], [5, 3, 0], [9, 4.5, 1], [13, 5.5, -1],
      [17, 5, 2], [21, 4, 0], [25, 2.5, -1], [29, 1.5, 0]
    ]
  }
]

interface AdventureSceneProps {
  level: number
  onCoinCollected: () => void
  onFall: () => void
  onReachEnd: () => void
  paused: boolean
}

function AdventureScene({ level, onCoinCollected, onFall, onReachEnd, paused }: AdventureSceneProps) {
  const appearance = useGameStore((s) => s.appearance)
  const soundOn = useGameStore((s) => s.soundOn)
  const { input, inputRef, clearPressed } = useGameInput(!paused)

  const platforms = LEVELS[level] || LEVELS[0]
  const coinPositions = (COIN_LAYOUT.find((c) => c.level === level)?.positions) || []
  const [coins, setCoins] = useState<Coin[]>(
    () => coinPositions.map((p, i) => ({ id: i, position: p, collected: false }))
  )

  // حالة اللاعب
  const playerRef = useRef<THREE.Group>(null)
  const playerState = useRef({
    pos: new THREE.Vector3(0, 1, 0),
    vel: new THREE.Vector3(),
    onGround: false,
    facing: 0,
    animState: 'idle' as 'idle' | 'walk' | 'run' | 'jump',
    alive: true
  })

  const { camera } = useThree()
  const camOffset = useRef(new THREE.Vector3(0, 4, 8))

  // استقبال القفز عند بداية كل إطار
  useFrame((_, dtRaw) => {
    if (paused || !playerRef.current) return
    const dt = Math.min(dtRaw, 0.05)
    const ps = playerState.current
    const inp = inputRef.current

    if (!ps.alive) return

    // الحركة الأفقية
    const speed = 6
    const moveDir = new THREE.Vector3()
    if (inp.forward) moveDir.z -= 1
    if (inp.back) moveDir.z += 1
    if (inp.left) moveDir.x -= 1
    if (inp.right) moveDir.x += 1

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize()
      // اتجاه الحركة بالنسبة للكاميرا (دائماً نسبة للعالم)
      ps.vel.x = moveDir.x * speed
      ps.vel.z = moveDir.z * speed
      // اتجاه الوجه
      ps.facing = Math.atan2(moveDir.x, moveDir.z) + Math.PI
      ps.animState = inp.forward ? 'run' : 'walk'
    } else {
      ps.vel.x *= 0.85
      ps.vel.z *= 0.85
      if (Math.abs(ps.vel.x) < 0.1 && Math.abs(ps.vel.z) < 0.1) {
        ps.animState = 'idle'
      }
    }

    // الجاذبية
    ps.vel.y -= 22 * dt

    // القفز
    if (inp.jumpPressed && ps.onGround) {
      ps.vel.y = 9
      ps.onGround = false
      ps.animState = 'jump'
      playSound('jump', soundOn)
    }

    // تطبيق الحركة
    const next = ps.pos.clone().addScaledVector(ps.vel, dt)

    // التحقق من المنصات (فوقها)
    ps.onGround = false
    for (const p of platforms) {
      const [px, py, pz] = p.position
      const [sx, sy, sz] = p.size
      const halfX = sx / 2
      const halfZ = sz / 2
      if (
        next.x > px - halfX && next.x < px + halfX &&
        next.z > pz - halfZ && next.z < pz + halfZ &&
        ps.pos.y >= py + sy / 2 - 0.05 &&
        next.y <= py + sy / 2 + 0.1
      ) {
        next.y = py + sy / 2 + 0.01
        ps.vel.y = 0
        ps.onGround = true
        if (ps.animState === 'jump') ps.animState = 'idle'
      }
    }

    ps.pos.copy(next)

    // منع السقوط اللانهائي
    if (ps.pos.y < -10) {
      ps.alive = false
      onFall()
      return
    }

    // جمع العملات
    setCoins((prev) => {
      let changed = false
      const updated = prev.map((c) => {
        if (c.collected) return c
        const dx = ps.pos.x - c.position[0]
        const dy = ps.pos.y + 0.5 - c.position[1]
        const dz = ps.pos.z - c.position[2]
        if (dx * dx + dy * dy + dz * dz < 0.6) {
          changed = true
          playSound('coin', soundOn)
          onCoinCollected()
          return { ...c, collected: true }
        }
        return c
      })
      return changed ? updated : prev
    })

    // التحقق من الوصول للنهاية (آخر منصة)
    const last = platforms[platforms.length - 1]
    const [lx, ly, lz] = last.position
    const dist = Math.hypot(ps.pos.x - lx, ps.pos.z - lz)
    if (dist < 2 && ps.pos.y < ly + 2) {
      onReachEnd()
    }

    // تحديث اللاعب
    playerRef.current.position.copy(ps.pos)
    playerRef.current.rotation.y = ps.facing

    // الكاميرا تتبع اللاعب
    const targetCam = new THREE.Vector3(
      ps.pos.x + camOffset.current.x,
      ps.pos.y + camOffset.current.y,
      ps.pos.z + camOffset.current.z
    )
    camera.position.lerp(targetCam, 0.1)
    camera.lookAt(ps.pos.x, ps.pos.y + 0.5, ps.pos.z)

    clearPressed()
  })

  return (
    <>
      {/* المنصات */}
      {platforms.map((p, i) => (
        <mesh
          key={i}
          position={p.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={p.size} />
          <meshStandardMaterial color={p.color || '#7ec850'} roughness={0.9} />
        </mesh>
      ))}

      {/* اللاعب - كوبيستو */}
      <group ref={playerRef}>
        <Kubisto
          appearance={appearance}
          state={playerState.current.animState}
          animate
        />
      </group>

      {/* العملات */}
      {coins.filter((c) => !c.collected).map((c) => (
        <CoinMesh key={c.id} position={c.position} />
      ))}

      {/* علامة النهاية - علم */}
      <EndFlag position={[
        platforms[platforms.length - 1].position[0],
        platforms[platforms.length - 1].position[1] + 1.5,
        platforms[platforms.length - 1].position[2]
      ]} />
    </>
  )
}

function CoinMesh({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 3
      ref.current.position.y = position[1] + Math.sin(performance.now() / 300) * 0.15
    }
  })
  return (
    <mesh ref={ref} position={position} castShadow>
      <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
      <meshStandardMaterial color="#ffd700" metalness={0.7} roughness={0.2} emissive="#ffa500" emissiveIntensity={0.3} />
    </mesh>
  )
}

function EndFlag({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(performance.now() / 500) * 0.2
    }
  })
  return (
    <group position={position}>
      {/* العمود */}
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      {/* العلم */}
      <mesh ref={ref} position={[0.4, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.02]} />
        <meshStandardMaterial color="#ef4444" side={THREE.DoubleSide} />
      </mesh>
      {/* الكرة العلوية */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

export { AdventureScene }
