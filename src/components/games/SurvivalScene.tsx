'use client'

import { useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Kubisto } from '@/components/kubisto/Kubisto'
import { useGameInput } from '@/lib/use-game-input'
import { useGameStore } from '@/lib/game-store'
import { playSound } from '@/lib/audio'

interface FallingObject {
  id: number
  pos: THREE.Vector3
  vel: THREE.Vector3
  type: 'rock' | 'bomb' | 'crate'
  size: number
  spin: THREE.Vector3
  warned: boolean
}

interface PowerUp {
  id: number
  pos: THREE.Vector3
  type: 'heart' | 'shield'
  collected: boolean
}

interface SurvivalSceneProps {
  onTimeUpdate: (s: number) => void
  onHit: () => void
  onCollectHeart: () => void
  paused: boolean
  difficulty: number
}

function SurvivalScene({ onTimeUpdate, onHit, onCollectHeart, paused, difficulty }: SurvivalSceneProps) {
  const appearance = useGameStore((s) => s.appearance)
  const soundOn = useGameStore((s) => s.soundOn)
  const { inputRef, clearPressed } = useGameInput(!paused)

  const playerRef = useRef<THREE.Group>(null)
  const playerState = useRef({
    pos: new THREE.Vector3(0, 0, 0),
    facing: 0,
    animState: 'idle' as 'idle' | 'walk' | 'run',
    shield: 0
  })

  const objectsRef = useRef<FallingObject[]>([])
  const powerupsRef = useRef<PowerUp[]>([])
  const idRef = useRef(0)
  const spawnTimer = useRef(0)
  const powerupTimer = useRef(8)
  const elapsed = useRef(0)
  const [objVersion, setObjVersion] = useState(0)

  const { camera } = useThree()

  useFrame((_, dtRaw) => {
    if (paused) return
    const dt = Math.min(dtRaw, 0.05)
    elapsed.current += dt
    onTimeUpdate(elapsed.current)
    const ps = playerState.current
    const inp = inputRef.current

    // الحركة
    const speed = 8
    const moveDir = new THREE.Vector3()
    if (inp.forward) moveDir.z -= 1
    if (inp.back) moveDir.z += 1
    if (inp.left) moveDir.x -= 1
    if (inp.right) moveDir.x += 1

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize()
      ps.pos.x += moveDir.x * speed * dt
      ps.pos.z += moveDir.z * speed * dt
      ps.facing = Math.atan2(moveDir.x, moveDir.z) + Math.PI
      ps.animState = 'run'
    } else {
      ps.animState = 'idle'
    }

    // حدود الساحة
    const limit = 8
    ps.pos.x = Math.max(-limit, Math.min(limit, ps.pos.x))
    ps.pos.z = Math.max(-limit, Math.min(limit, ps.pos.z))

    // درع
    if (ps.shield > 0) ps.shield -= dt

    // تحريك اللاعب
    if (playerRef.current) {
      playerRef.current.position.copy(ps.pos)
      playerRef.current.rotation.y = ps.facing
    }

    // توليد العوائق الساقطة
    spawnTimer.current -= dt
    const spawnInterval = Math.max(0.3, 1.2 - difficulty * 0.1)
    if (spawnTimer.current <= 0) {
      spawnTimer.current = spawnInterval
      const id = idRef.current++
      const types: FallingObject['type'][] = ['rock', 'bomb', 'crate']
      const newType = types[Math.floor(Math.random() * types.length)]
      // ظهور قرب اللاعب أحياناً لجعل التحدي أكبر
      const targetX = Math.random() < 0.3 ? ps.pos.x + (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 16
      const targetZ = Math.random() < 0.3 ? ps.pos.z + (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 16
      const size = 0.3 + Math.random() * 0.5
      objectsRef.current.push({
        id,
        pos: new THREE.Vector3(targetX, 15, targetZ),
        vel: new THREE.Vector3(0, -8 - difficulty * 0.5, 0),
        type: newType,
        size,
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        ),
        warned: false
      })
      setObjVersion((v) => v + 1)
    }

    // توليد power-ups
    powerupTimer.current -= dt
    if (powerupTimer.current <= 0) {
      powerupTimer.current = 15 + Math.random() * 10
      powerupsRef.current.push({
        id: idRef.current++,
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          0.5,
          (Math.random() - 0.5) * 14
        ),
        type: Math.random() > 0.5 ? 'heart' : 'shield',
        collected: false
      })
      setObjVersion((v) => v + 1)
    }

    // تحديث العوائق
    let hitOccurred = false
    let heartCollected = false
    for (const obj of objectsRef.current) {
      obj.pos.addScaledVector(obj.vel, dt)
      obj.pos.x += obj.spin.x * dt * 0.1
      obj.pos.y += 0 // فقط في y
      // دوران
      // تحقق من الاصطدام باللاعب (في y منخفض)
      if (obj.pos.y < 1.2 && obj.pos.y > -0.5) {
        const dx = obj.pos.x - ps.pos.x
        const dz = obj.pos.z - ps.pos.z
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < obj.size + 0.5 && ps.shield <= 0) {
          hitOccurred = true
          obj.pos.y = -10 // إزالة
        }
      }
      // إزالة عند الوصول للأرض
      if (obj.pos.y < -2) {
        obj.pos.y = -100
      }
    }
    // تنظيف
    objectsRef.current = objectsRef.current.filter((o) => o.pos.y > -50)

    // تحديث power-ups
    for (const p of powerupsRef.current) {
      if (p.collected) continue
      const dx = p.pos.x - ps.pos.x
      const dz = p.pos.z - ps.pos.z
      const dist = Math.sqrt(dx * dx + dz * dz)
      if (dist < 0.8) {
        p.collected = true
        if (p.type === 'heart') {
          heartCollected = true
          playSound('coin', soundOn)
        } else {
          ps.shield = 5
          playSound('levelup', soundOn)
        }
      }
    }
    powerupsRef.current = powerupsRef.current.filter((p) => !p.collected)

    if (hitOccurred) {
      onHit()
      ps.animState = 'hit' as any
    }
    if (heartCollected) {
      onCollectHeart()
    }

    // الكاميرا - منظر علوي مائل ثابت تقريباً
    const camTarget = new THREE.Vector3(ps.pos.x * 0.3, 12, ps.pos.z * 0.3 + 10)
    camera.position.lerp(camTarget, 0.05)
    camera.lookAt(ps.pos.x * 0.5, 0, ps.pos.z * 0.5 - 1)

    clearPressed()
  })

  return (
    <>
      {/* الأرضية - ساحة دائرية */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color="#7ec850" roughness={0.9} />
      </mesh>

      {/* حدود دائرية */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[9.8, 10, 64]} />
        <meshStandardMaterial color="#ff6600" side={THREE.DoubleSide} />
      </mesh>

      {/* اللاعب */}
      <group ref={playerRef}>
        <Kubisto appearance={appearance} state={playerState.current.animState} animate scale={0.85} />
        {/* درع حول اللاعب */}
        {playerState.current.shield > 0 && (
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[1.2, 16, 16]} />
            <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} emissive="#3b82f6" emissiveIntensity={0.5} side={THREE.DoubleSide} />
          </mesh>
        )}
        {/* ظل تحذيري على الأرض - يتبع مواقع العوائق */}
      </group>

      {/* ظلال تحذيرية للعوائق الساقطة */}
      {objectsRef.current.map((o) => {
        if (o.pos.y < 0) return null
        return (
          <mesh
            key={`shadow-${o.id}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[o.pos.x, 0.02, o.pos.z]}
          >
            <circleGeometry args={[o.size * 1.2, 16]} />
            <meshStandardMaterial
              color="#000000"
              transparent
              opacity={Math.max(0.15, 0.6 - o.pos.y / 25)}
            />
          </mesh>
        )
      })}

      {/* العوائق */}
      {objectsRef.current.map((o) => (
        <FallingObjMesh key={o.id} obj={o} />
      ))}

      {/* power-ups */}
      {powerupsRef.current.map((p) => (
        <PowerUpMesh key={p.id} powerup={p} />
      ))}
    </>
  )
}

function FallingObjMesh({ obj }: { obj: FallingObject }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.x += obj.spin.x * dt
    ref.current.rotation.y += obj.spin.y * dt
    ref.current.rotation.z += obj.spin.z * dt
  })
  if (obj.type === 'rock') {
    return (
      <mesh ref={ref} position={obj.pos} castShadow>
        <dodecahedronGeometry args={[obj.size]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
      </mesh>
    )
  }
  if (obj.type === 'bomb') {
    return (
      <group ref={ref as any} position={obj.pos}>
        <mesh castShadow>
          <sphereGeometry args={[obj.size, 12, 12]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
        </mesh>
        {/* فتيل */}
        <mesh position={[0, obj.size + 0.15, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 6]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        {/* شرارة */}
        <mesh position={[0, obj.size + 0.35, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={1.5} />
        </mesh>
      </group>
    )
  }
  // crate
  return (
    <mesh ref={ref} position={obj.pos} castShadow>
      <boxGeometry args={[obj.size * 1.5, obj.size * 1.5, obj.size * 1.5]} />
      <meshStandardMaterial color="#a16207" roughness={0.7} />
    </mesh>
  )
}

function PowerUpMesh({ powerup }: { powerup: PowerUp }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 2
      ref.current.position.y = 0.5 + Math.sin(performance.now() / 300) * 0.15
    }
  })
  if (powerup.type === 'heart') {
    return (
      <mesh ref={ref} position={powerup.pos}>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#ff3366" emissive="#ff3366" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>
    )
  }
  // shield - نجمة زرقاء
  return (
    <mesh ref={ref} position={powerup.pos}>
      <octahedronGeometry args={[0.35, 0]} />
      <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} roughness={0.2} metalness={0.5} />
    </mesh>
  )
}

export { SurvivalScene }
