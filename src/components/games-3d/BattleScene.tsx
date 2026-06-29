'use client'

import { useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Kubisto } from '@/components/kubisto/Kubisto'
import { useGameInput } from '@/lib/games-3d/use-game-input'
import { useGames3DStore as useGameStore } from "@/lib/games-3d/game-store"
import { playSound } from '@/lib/games-3d/audio'

interface Enemy {
  id: number
  pos: THREE.Vector3
  vel: THREE.Vector3
  hp: number
  type: 'goblin' | 'slime' | 'bat'
  hitCooldown: number
  alive: boolean
}

interface BattleSceneProps {
  onKill: () => void
  onHit: () => void
  onWaveComplete: (wave: number) => void
  onGameOver: () => void
  paused: boolean
  wave: number
}

function BattleScene({ onKill, onHit, onWaveComplete, onGameOver, paused, wave }: BattleSceneProps) {
  const appearance = useGameStore((s) => s.appearance)
  const soundOn = useGameStore((s) => s.soundOn)
  const { inputRef, clearPressed } = useGameInput(!paused)

  const playerRef = useRef<THREE.Group>(null)
  const playerState = useRef({
    pos: new THREE.Vector3(0, 0, 0),
    vel: new THREE.Vector3(),
    facing: 0,
    attacking: false,
    attackTimer: 0,
    invuln: 0,
    animState: 'idle' as 'idle' | 'walk' | 'run' | 'attack' | 'hit'
  })

  const enemiesRef = useRef<Enemy[]>([])
  const enemyIdRef = useRef(0)
  const [enemyVersion, setEnemyVersion] = useState(0)
  const spawnTimer = useRef(0)
  const waveKills = useRef(0)
  const enemiesPerWave = 5 + wave * 2

  const { camera } = useThree()

  // دالة إنشاء عدو
  const spawnEnemy = useCallback(() => {
    const angle = Math.random() * Math.PI * 2
    const dist = 12 + Math.random() * 4
    const types: Enemy['type'][] = ['goblin', 'slime', 'bat']
    const newEnemy: Enemy = {
      id: enemyIdRef.current++,
      pos: new THREE.Vector3(
        Math.cos(angle) * dist,
        0,
        Math.sin(angle) * dist
      ),
      vel: new THREE.Vector3(),
      hp: 1 + Math.floor(wave / 2),
      type: types[Math.floor(Math.random() * types.length)],
      hitCooldown: 0,
      alive: true
    }
    enemiesRef.current.push(newEnemy)
    setEnemyVersion((v) => v + 1)
  }, [wave])

  // تهيئة الموجة الحالية
  const waveInited = useRef(false)
  if (!waveInited.current) {
    enemiesRef.current = []
    waveKills.current = 0
    waveInited.current = true
  }

  useFrame((_, dtRaw) => {
    if (paused) return
    const dt = Math.min(dtRaw, 0.05)
    const ps = playerState.current
    const inp = inputRef.current

    // الحركة
    const speed = 6
    const moveDir = new THREE.Vector3()
    if (inp.forward) moveDir.z -= 1
    if (inp.back) moveDir.z += 1
    if (inp.left) moveDir.x -= 1
    if (inp.right) moveDir.x += 1

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize()
      ps.vel.x = moveDir.x * speed
      ps.vel.z = moveDir.z * speed
      ps.facing = Math.atan2(moveDir.x, moveDir.z) + Math.PI
      ps.animState = ps.attacking ? 'attack' : 'run'
    } else {
      ps.vel.x *= 0.85
      ps.vel.z *= 0.85
      if (!ps.attacking) {
        ps.animState = Math.abs(ps.vel.x) + Math.abs(ps.vel.z) > 0.5 ? 'walk' : 'idle'
      }
    }

    // الهجوم
    if (inp.attackPressed && !ps.attacking) {
      ps.attacking = true
      ps.attackTimer = 0.4
      ps.animState = 'attack'
      playSound('shoot', soundOn)
    }
    if (ps.attacking) {
      ps.attackTimer -= dt
      if (ps.attackTimer <= 0) {
        ps.attacking = false
      }
    }

    // الجاذبية (لا حاجة - اللاعب على الأرض)
    ps.pos.x += ps.vel.x * dt
    ps.pos.z += ps.vel.z * dt
    // إبقاء اللاعب داخل الساحة
    const limit = 12
    ps.pos.x = Math.max(-limit, Math.min(limit, ps.pos.x))
    ps.pos.z = Math.max(-limit, Math.min(limit, ps.pos.z))

    // عدم قابليية الإصابة
    if (ps.invuln > 0) {
      ps.invuln -= dt
      ps.animState = 'hit'
    }

    // تحريك اللاعب
    if (playerRef.current) {
      playerRef.current.position.copy(ps.pos)
      playerRef.current.rotation.y = ps.facing
    }

    // توليد الأعداء
    spawnTimer.current -= dt
    if (spawnTimer.current <= 0 && enemiesRef.current.length < enemiesPerWave) {
      spawnTimer.current = Math.max(0.8, 2.5 - wave * 0.2)
      spawnEnemy()
    }

    // تحديث الأعداء
    let hitOccurred = false
    let killOccurred = false
    let waveDone = false
    for (const e of enemiesRef.current) {
      if (!e.alive) continue
      // يطارد اللاعب
      const dir = new THREE.Vector3().subVectors(ps.pos, e.pos)
      dir.y = 0
      const distToPlayer = dir.length()
      if (distToPlayer > 0.1) dir.normalize()
      const eSpeed = e.type === 'bat' ? 4 : e.type === 'slime' ? 2 : 3
      e.pos.addScaledVector(dir, eSpeed * dt)

      if (e.hitCooldown > 0) e.hitCooldown -= dt

      // هجوم اللاعب - التحقق من قرب العدو
      if (ps.attacking && distToPlayer < 2 && ps.attackTimer > 0.2) {
        if (e.hitCooldown <= 0) {
          e.hp -= 1
          e.hitCooldown = 0.3
          playSound('hit', soundOn)
          if (e.hp <= 0) {
            e.alive = false
            killOccurred = true
            waveKills.current++
            if (waveKills.current >= enemiesPerWave) {
              waveDone = true
            }
          }
        }
      }

      // العدو يصيب اللاعب
      if (distToPlayer < 1 && ps.invuln <= 0 && e.hitCooldown <= 0) {
        hitOccurred = true
        ps.invuln = 1.5
        e.hitCooldown = 1
      }
    }

    if (killOccurred) {
      onKill()
      setEnemyVersion((v) => v + 1)
    }
    if (hitOccurred) {
      onHit()
      ps.animState = 'hit'
    }
    if (waveDone) {
      onWaveComplete(wave)
    }

    // الكاميرا فوق اللاعب بزاوية مائلة
    const camTarget = new THREE.Vector3(
      ps.pos.x,
      8,
      ps.pos.z + 8
    )
    camera.position.lerp(camTarget, 0.1)
    camera.lookAt(ps.pos.x, 0.5, ps.pos.z - 1)

    clearPressed()
  })

  return (
    <>
      {/* الساحة - دائرة */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[15, 64]} />
        <meshStandardMaterial color="#8b6f47" roughness={0.9} />
      </mesh>

      {/* حدود الساحة - حواجز */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 14.5, 0.5, Math.sin(a) * 14.5]}
            castShadow
          >
            <boxGeometry args={[0.5, 1, 0.5]} />
            <meshStandardMaterial color="#5a3e1a" roughness={0.8} />
          </mesh>
        )
      })}

      {/* اللاعب */}
      <group ref={playerRef}>
        <Kubisto appearance={appearance} state={playerState.current.animState} animate scale={0.85} />
        {/* تأثير الهجوم - كرة برتقالية */}
        {playerState.current.attacking && (
          <mesh position={[0, 0.5, 1]} scale={1.2 - playerState.current.attackTimer * 2}>
            <sphereGeometry args={[0.6, 12, 12]} />
            <meshStandardMaterial color="#ff6600" transparent opacity={0.4 * (playerState.current.attackTimer / 0.4)} emissive="#ff6600" emissiveIntensity={0.8} />
          </mesh>
        )}
      </group>

      {/* الأعداء */}
      {enemiesRef.current.filter((e) => e.alive).map((e) => (
        <EnemyMesh key={e.id} enemy={e} playerPos={playerState.current.pos} />
      ))}

      {/* علامة الموجة في الزاوية */}
      <group position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[3, 3.3, 32]} />
          <meshStandardMaterial color="#ffd700" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  )
}

function EnemyMesh({ enemy, playerPos }: { enemy: Enemy; playerPos: THREE.Vector3 }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    // ينظر للاعب
    const dx = playerPos.x - enemy.pos.x
    const dz = playerPos.z - enemy.pos.z
    ref.current.rotation.y = Math.atan2(dx, dz) + Math.PI
    ref.current.position.copy(enemy.pos)
    // أنيميشن نطّي بسيط
    ref.current.position.y = Math.abs(Math.sin(performance.now() / 200)) * 0.15
  })

  if (enemy.type === 'goblin') {
    return (
      <group ref={ref}>
        {/* جسم */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <capsuleGeometry args={[0.3, 0.4, 4, 8]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.7} />
        </mesh>
        {/* رأس */}
        <mesh castShadow position={[0, 1.1, 0]}>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial color="#22c55e" roughness={0.6} />
        </mesh>
        {/* عيون */}
        <mesh position={[-0.12, 1.15, 0.25]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.12, 1.15, 0.25]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
        {/* قرون */}
        <mesh position={[-0.18, 1.35, 0]} rotation={[0, 0, 0.4]}>
          <coneGeometry args={[0.05, 0.18, 6]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <mesh position={[0.18, 1.35, 0]} rotation={[0, 0, -0.4]}>
          <coneGeometry args={[0.05, 0.18, 6]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    )
  }
  if (enemy.type === 'slime') {
    return (
      <group ref={ref}>
        <mesh castShadow position={[0, 0.4, 0]} scale={[1, 0.6, 1]}>
          <sphereGeometry args={[0.5, 12, 12]} />
          <meshStandardMaterial color="#06b6d4" roughness={0.3} transparent opacity={0.85} />
        </mesh>
        {/* عيون */}
        <mesh position={[-0.15, 0.5, 0.4]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.15, 0.5, 0.4]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
    )
  }
  // bat
  return (
    <group ref={ref} position={[enemy.pos.x, 1.5, enemy.pos.z]}>
      <mesh castShadow>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color="#581c87" roughness={0.7} />
      </mesh>
      {/* أجنحة */}
      <mesh position={[-0.3, 0, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.4, 0.05, 0.25]} />
        <meshStandardMaterial color="#3b0764" />
      </mesh>
      <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.4, 0.05, 0.25]} />
        <meshStandardMaterial color="#3b0764" />
      </mesh>
      {/* عيون */}
      <mesh position={[-0.08, 0.05, 0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0.08, 0.05, 0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.7} />
      </mesh>
    </group>
  )
}

export { BattleScene }
