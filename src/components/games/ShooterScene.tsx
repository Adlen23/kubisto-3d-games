'use client'

import { useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Kubisto } from '@/components/kubisto/Kubisto'
import { useGameInput } from '@/lib/use-game-input'
import { useGameStore } from '@/lib/game-store'
import { playSound } from '@/lib/audio'

interface Target {
  id: number
  pos: THREE.Vector3
  vel: THREE.Vector3
  hp: number
  type: 'red' | 'gold' | 'blue'
  hit: boolean
  scale: number
}

interface Bullet {
  id: number
  pos: THREE.Vector3
  vel: THREE.Vector3
  alive: boolean
}

interface ShooterSceneProps {
  onHit: (type: 'red' | 'gold' | 'blue') => void
  onMissedTarget: () => void
  onMissedShot: () => void
  paused: boolean
  level: number
}

function ShooterScene({ onHit, onMissedTarget, onMissedShot, paused, level }: ShooterSceneProps) {
  const appearance = useGameStore((s) => s.appearance)
  const soundOn = useGameStore((s) => s.soundOn)
  const { inputRef, clearPressed } = useGameInput(!paused)

  const playerRef = useRef<THREE.Group>(null)
  const playerState = useRef({
    pos: new THREE.Vector3(0, 0, 5),
    facing: 0,
    shootCooldown: 0,
    animState: 'idle' as 'idle' | 'walk' | 'attack'
  })

  const targetsRef = useRef<Target[]>([])
  const bulletsRef = useRef<Bullet[]>([])
  const idRef = useRef(0)
  const spawnTimer = useRef(1)
  const shotTimer = useRef(0)
  const [version, setVersion] = useState(0)

  const { camera } = useThree()

  useFrame((_, dtRaw) => {
    if (paused) return
    const dt = Math.min(dtRaw, 0.05)
    const ps = playerState.current
    const inp = inputRef.current

    // الحركة الأفقية فقط
    const speed = 7
    if (inp.left) ps.pos.x -= speed * dt
    if (inp.right) ps.pos.x += speed * dt
    if (inp.forward) ps.pos.z -= speed * dt * 0.5
    if (inp.back) ps.pos.z += speed * dt * 0.5
    ps.pos.x = Math.max(-7, Math.min(7, ps.pos.x))
    ps.pos.z = Math.max(2, Math.min(8, ps.pos.z))

    // تحريك اللاعب (يواجه الأمامي -z)
    if (playerRef.current) {
      playerRef.current.position.copy(ps.pos)
      playerRef.current.rotation.y = Math.PI
    }

    // إطلاق النار
    if (ps.shootCooldown > 0) ps.shootCooldown -= dt
    if ((inp.shootPressed || inp.shoot || inp.attackPressed) && ps.shootCooldown <= 0) {
      ps.shootCooldown = 0.18
      const b: Bullet = {
        id: idRef.current++,
        pos: new THREE.Vector3(ps.pos.x, 1.2, ps.pos.z - 0.5),
        vel: new THREE.Vector3(0, 0, -25),
        alive: true
      }
      bulletsRef.current.push(b)
      ps.animState = 'attack'
      playSound('shoot', soundOn)
      setVersion((v) => v + 1)
    } else {
      ps.animState = (inp.left || inp.right || inp.forward || inp.back) ? 'walk' : 'idle'
    }

    // توليد الأهداف
    spawnTimer.current -= dt
    if (spawnTimer.current <= 0) {
      spawnTimer.current = Math.max(0.4, 1.8 - level * 0.15)
      const r = Math.random()
      const type: Target['type'] = r > 0.85 ? 'gold' : r > 0.5 ? 'blue' : 'red'
      const hp = type === 'gold' ? 1 : type === 'blue' ? 2 : 1
      const newTarget: Target = {
        id: idRef.current++,
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          1 + Math.random() * 2,
          -15
        ),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 2 * level,
          0,
          3 + level * 0.4
        ),
        hp,
        type,
        hit: false,
        scale: type === 'gold' ? 0.6 : type === 'blue' ? 0.8 : 1.0
      }
      targetsRef.current.push(newTarget)
      setVersion((v) => v + 1)
    }

    // تحديث الأهداف
    let missed = 0
    for (const t of targetsRef.current) {
      t.pos.addScaledVector(t.vel, dt)
      // ارتداد من الحواف الجانبية
      if (t.pos.x < -8 || t.pos.x > 8) t.vel.x *= -1
      // تجاوز اللاعب
      if (t.pos.z > 10 && !t.hit) {
        t.hit = true
        missed++
      }
    }
    if (missed > 0) {
      onMissedTarget()
    }
    targetsRef.current = targetsRef.current.filter((t) => !t.hit && t.pos.z < 12)

    // تحديث الرصاص
    let hitOccurred = false
    let hitType: Target['type'] = 'red'
    for (const b of bulletsRef.current) {
      b.pos.addScaledVector(b.vel, dt)
      if (b.pos.z < -25) {
        b.alive = false
        onMissedShot()
        continue
      }
      // تصادم مع الأهداف
      for (const t of targetsRef.current) {
        if (t.hit) continue
        const dx = b.pos.x - t.pos.x
        const dy = b.pos.y - t.pos.y
        const dz = b.pos.z - t.pos.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        if (dist < 0.7 * t.scale + 0.2) {
          t.hp -= 1
          b.alive = false
          if (t.hp <= 0) {
            t.hit = true
            hitOccurred = true
            hitType = t.type
            playSound('coin', soundOn)
          } else {
            playSound('hit', soundOn)
          }
          break
        }
      }
    }
    bulletsRef.current = bulletsRef.current.filter((b) => b.alive)

    if (hitOccurred) {
      onHit(hitType)
    }

    // الكاميرا خلف اللاعب
    const camTarget = new THREE.Vector3(0, 4, ps.pos.z + 6)
    camera.position.lerp(camTarget, 0.1)
    camera.lookAt(0, 1.5, -8)

    clearPressed()
  })

  return (
    <>
      {/* الأرضية - ميدان رمي */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#8b6f47" roughness={0.9} />
      </mesh>

      {/* خطوط الميدان */}
      {[-8, -4, 0, 4, 8].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, -5]}>
          <planeGeometry args={[0.1, 20]} />
          <meshStandardMaterial color="#5a3e1a" />
        </mesh>
      ))}

      {/* حواجز خلفية */}
      <mesh position={[0, 2, -15]} receiveShadow>
        <boxGeometry args={[20, 4, 0.3]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.9} />
      </mesh>

      {/* اللاعب - كوبيستو */}
      <group ref={playerRef}>
        <Kubisto appearance={appearance} state={playerState.current.animState} animate scale={0.8} />
        {/* سلاح - شكل بسيط */}
        <mesh position={[0.3, 0.6, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* الأهداف */}
      {targetsRef.current.map((tg) => (
        <TargetMesh key={tg.id} target={tg} />
      ))}

      {/* الرصاص */}
      {bulletsRef.current.map((b) => (
        <mesh key={b.id} position={b.pos}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={1} />
        </mesh>
      ))}
    </>
  )
}

function TargetMesh({ target }: { target: Target }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.02
      ref.current.rotation.z += 0.01
    }
  })
  const color = target.type === 'gold' ? '#ffd700' : target.type === 'blue' ? '#3b82f6' : '#ef4444'
  const points = target.type === 'gold' ? 50 : target.type === 'blue' ? 30 : 10

  return (
    <group position={target.pos} scale={target.scale}>
      {/* القرص الدائري */}
      <mesh ref={ref} castShadow>
        <torusGeometry args={[0.6, 0.15, 8, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} roughness={0.3} metalness={0.4} />
      </mesh>
      {/* المركز */}
      <mesh>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

export { ShooterScene }
