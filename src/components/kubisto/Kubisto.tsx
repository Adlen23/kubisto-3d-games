'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { KubistoAppearance } from '@/lib/games-3d/game-store'

interface KubistoProps {
  appearance: KubistoAppearance
  state?: 'idle' | 'walk' | 'run' | 'jump' | 'attack' | 'hit' | 'celebrate'
  rotation?: number
  scale?: number
  position?: [number, number, number]
  animate?: boolean
}

/** مولّد نسيج ضوضاء للفراء - يحاكي ملمس الفرو */
function useFurTexture(baseColor: string) {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    // اللون الأساسي
    ctx.fillStyle = baseColor
    ctx.fillRect(0, 0, 256, 256)
    // نقاط عشوانية لمحاكاة الفرو
    const base = new THREE.Color(baseColor)
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 256
      const y = Math.random() * 256
      const variation = (Math.random() - 0.5) * 0.15
      const c = base.clone()
      c.r = Math.max(0, Math.min(1, c.r + variation))
      c.g = Math.max(0, Math.min(1, c.g + variation))
      c.b = Math.max(0, Math.min(1, c.b + variation))
      ctx.fillStyle = `rgb(${Math.floor(c.r * 255)}, ${Math.floor(c.g * 255)}, ${Math.floor(c.b * 255)})`
      ctx.fillRect(x, y, 1.5, 1.5)
    }
    // خصلات أطول
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 256
      const y = Math.random() * 256
      const variation = (Math.random() - 0.5) * 0.2
      const c = base.clone()
      c.r = Math.max(0, Math.min(1, c.r + variation))
      c.g = Math.max(0, Math.min(1, c.g + variation))
      c.b = Math.max(0, Math.min(1, c.b + variation))
      ctx.fillStyle = `rgba(${Math.floor(c.r * 255)}, ${Math.floor(c.g * 255)}, ${Math.floor(c.b * 255)}, 0.6)`
      ctx.fillRect(x, y, 2, 4)
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)
    return texture
  }, [baseColor])
}

/**
 * كوبيستو v3 - الأرنب الكرتوني بدقة سينمائية
 * - نسيج فراء مولّد إجرائياً
 * - عيون عميقة متعددة الطبقات
 * - شوارب، رموش، حواجب
 * - أظافر، باودات
 * - ذيل قطني كثيف
 */
export function Kubisto({
  appearance,
  state = 'idle',
  rotation = 0,
  scale = 1,
  position = [0, 0, 0],
  animate = true
}: KubistoProps) {
  const group = useRef<THREE.Group>(null)
  const leftEar = useRef<THREE.Group>(null)
  const rightEar = useRef<THREE.Group>(null)
  const tail = useRef<THREE.Group>(null)
  const leftLeg = useRef<THREE.Group>(null)
  const rightLeg = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Group>(null)
  const rightArm = useRef<THREE.Group>(null)
  const leftEye = useRef<THREE.Group>(null)
  const rightEye = useRef<THREE.Group>(null)
  const mouthRef = useRef<THREE.Mesh>(null)
  const leftEyebrow = useRef<THREE.Mesh>(null)
  const rightEyebrow = useRef<THREE.Mesh>(null)
  const t = useRef(0)
  const blinkTimer = useRef(0)
  const isBlinking = useRef(false)

  // أنسجة الفرو - مولّدة إجرائياً
  const bodyFurTexture = useFurTexture(appearance.bodyColor)
  const bellyFurTexture = useFurTexture(appearance.bellyColor)

  // المواد المُحسّنة - مع نسيج فرو
  const furMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: bodyFurTexture,
      color: new THREE.Color(appearance.bodyColor),
      roughness: 0.85,
      metalness: 0,
      sheen: 1,
      sheenRoughness: 0.6,
      sheenColor: new THREE.Color('#ffffff'),
      clearcoat: 0.05,
      clearcoatRoughness: 0.9
    })
  }, [appearance.bodyColor, bodyFurTexture])

  const bellyMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: bellyFurTexture,
      color: new THREE.Color(appearance.bellyColor),
      roughness: 0.9,
      metalness: 0,
      sheen: 0.7,
      sheenColor: new THREE.Color('#ffffff'),
      sheenRoughness: 0.7
    })
  }, [appearance.bellyColor, bellyFurTexture])

  const earInsideMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ff9eb5'),
      roughness: 0.5,
      metalness: 0,
      sheen: 0.8,
      sheenColor: new THREE.Color('#ffd1dc'),
      transmission: 0.15,
      thickness: 0.5
    })
  }, [])

  const eyeWhiteMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#fafafa'),
      roughness: 0.1,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      sheen: 0.3,
      sheenColor: new THREE.Color('#ffffff')
    })
  }, [])

  const irisMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(appearance.accentColor),
      roughness: 0.18,
      metalness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      emissive: new THREE.Color(appearance.accentColor),
      emissiveIntensity: 0.06
    })
  }, [appearance.accentColor])

  const pupilMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a0a0a'),
      roughness: 0.05,
      metalness: 0.4
    })
  }, [])

  const noseMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ff7a96'),
      roughness: 0.2,
      metalness: 0,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      sheen: 0.5,
      sheenColor: new THREE.Color('#ffd1dc')
    })
  }, [])

  const mouthMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7a2535'),
      roughness: 0.4,
      metalness: 0
    })
  }, [])

  const pawPadMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffb6c1'),
      roughness: 0.45,
      metalness: 0,
      sheen: 0.7,
      sheenColor: new THREE.Color('#ffffff'),
      clearcoat: 0.3,
      clearcoatRoughness: 0.5
    })
  }, [])

  const blushMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ff8fa3'),
      transparent: true,
      opacity: 0.5
    })
  }, [])

  const toothMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#fffef0'),
      roughness: 0.2,
      metalness: 0,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2
    })
  }, [])

  const whiskerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.3,
      transparent: true,
      opacity: 0.85
    })
  }, [])

  const nailMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#fff8e7'),
      roughness: 0.2,
      metalness: 0,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15
    })
  }, [])

  useFrame((_, dtRaw) => {
    if (!animate || !group.current) return
    const dt = Math.min(dtRaw, 0.05)
    t.current += dt

    const tt = t.current
    let bounce = 0
    let legSwing = 0
    let armSwing = 0
    let tailWag = 0
    let earTiltL = 0
    let earTiltR = 0
    let headBob = 0
    let headTilt = 0
    let bodyLean = 0
    let mouthOpen = 0
    let eyebrowRaise = 0

    switch (state) {
      case 'idle':
        bounce = Math.sin(tt * 1.8) * 0.04
        headBob = Math.sin(tt * 1.3) * 0.02
        headTilt = Math.sin(tt * 0.7) * 0.05
        tailWag = Math.sin(tt * 2.5) * 0.12
        earTiltL = Math.sin(tt * 2.2) * 0.06
        earTiltR = Math.sin(tt * 2.2 + 0.4) * 0.06
        bodyLean = Math.sin(tt * 0.9) * 0.02
        break
      case 'walk':
        bounce = Math.abs(Math.sin(tt * 5)) * 0.08
        legSwing = Math.sin(tt * 5) * 0.45
        armSwing = Math.sin(tt * 5 + Math.PI) * 0.35
        tailWag = Math.sin(tt * 5) * 0.25
        earTiltL = Math.sin(tt * 5) * 0.1
        earTiltR = Math.sin(tt * 5 + 0.3) * 0.1
        bodyLean = 0.08
        break
      case 'run':
        bounce = Math.abs(Math.sin(tt * 11)) * 0.13
        legSwing = Math.sin(tt * 11) * 0.7
        armSwing = Math.sin(tt * 11 + Math.PI) * 0.6
        tailWag = Math.sin(tt * 11) * 0.35
        headBob = Math.sin(tt * 11) * 0.04
        earTiltL = -0.4 + Math.sin(tt * 11) * 0.05
        earTiltR = -0.4 + Math.sin(tt * 11 + 0.3) * 0.05
        bodyLean = 0.2
        break
      case 'jump':
        bounce = Math.sin(tt * 7) * 0.3
        legSwing = -0.5
        armSwing = -0.6
        earTiltL = 0.25
        earTiltR = 0.25
        bodyLean = -0.1
        mouthOpen = 0.5
        eyebrowRaise = 0.05
        break
      case 'attack':
        armSwing = Math.sin(tt * 13) * 0.8
        bounce = Math.sin(tt * 13) * 0.06
        earTiltL = Math.sin(tt * 13) * 0.2
        earTiltR = Math.sin(tt * 13) * 0.2
        bodyLean = 0.15
        mouthOpen = Math.max(0, Math.sin(tt * 13)) * 0.4
        eyebrowRaise = 0.08
        break
      case 'hit':
        bounce = Math.sin(tt * 20) * 0.15
        headBob = Math.sin(tt * 25) * 0.1
        earTiltL = Math.sin(tt * 25) * 0.3
        earTiltR = Math.sin(tt * 25 + 1) * 0.3
        headTilt = 0.15
        mouthOpen = 0.6
        eyebrowRaise = -0.05
        break
      case 'celebrate':
        bounce = Math.abs(Math.sin(tt * 5)) * 0.35
        armSwing = Math.sin(tt * 5) * 0.9
        tailWag = Math.sin(tt * 8) * 0.5
        earTiltL = Math.sin(tt * 5) * 0.15
        earTiltR = Math.sin(tt * 5 + 0.3) * 0.15
        bodyLean = Math.sin(tt * 5) * 0.1
        mouthOpen = 0.3
        eyebrowRaise = 0.1
        break
    }

    group.current.position.y = position[1] + bounce
    group.current.position.x = position[0]
    group.current.position.z = position[2]
    group.current.rotation.y = rotation
    group.current.rotation.z = bodyLean

    if (leftLeg.current) leftLeg.current.rotation.x = legSwing
    if (rightLeg.current) rightLeg.current.rotation.x = -legSwing
    if (leftArm.current) leftArm.current.rotation.x = armSwing
    if (rightArm.current) rightArm.current.rotation.x = -armSwing

    if (tail.current) {
      tail.current.rotation.z = tailWag
      tail.current.rotation.y = tailWag * 0.5
    }

    if (leftEar.current) {
      leftEar.current.rotation.z = 0.12 + earTiltL
      leftEar.current.rotation.x = tailWag * 0.3
    }
    if (rightEar.current) {
      rightEar.current.rotation.z = -0.12 - earTiltR
      rightEar.current.rotation.x = -tailWag * 0.3
    }

    if (head.current) {
      head.current.position.y = 0.92 + headBob
      head.current.rotation.z = headTilt
    }

    // الرمش التلقائي
    blinkTimer.current += dt
    if (!isBlinking.current && blinkTimer.current > 3 + Math.random() * 2) {
      isBlinking.current = true
      blinkTimer.current = 0
    }
    let blinkScale = 1
    if (isBlinking.current) {
      const blinkT = blinkTimer.current / 0.15
      if (blinkT >= 1) {
        isBlinking.current = false
        blinkTimer.current = 0
      } else {
        blinkScale = Math.abs(Math.sin(blinkT * Math.PI))
        blinkScale = Math.max(0.1, blinkScale)
      }
    }
    if (leftEye.current) leftEye.current.scale.y = blinkScale
    if (rightEye.current) rightEye.current.scale.y = blinkScale

    if (mouthRef.current) {
      mouthRef.current.scale.y = 1 + mouthOpen * 2
      mouthRef.current.position.y = -0.18 - mouthOpen * 0.05
    }

    if (leftEyebrow.current) {
      leftEyebrow.current.position.y = 0.22 + eyebrowRaise
      leftEyebrow.current.rotation.z = 0.1 - eyebrowRaise * 0.5
    }
    if (rightEyebrow.current) {
      rightEyebrow.current.position.y = 0.22 + eyebrowRaise
      rightEyebrow.current.rotation.z = -0.1 + eyebrowRaise * 0.5
    }
  })

  // خصلات شعر صغيرة على الرأس
  const headTufts = useMemo(() => {
    const tufts: { pos: [number, number, number]; rot: [number, number, number]; scale: number }[] = []
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI - Math.PI / 2
      tufts.push({
        pos: [Math.cos(a) * 0.15, 0.42, Math.sin(a) * 0.15],
        rot: [Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.3],
        scale: 0.07 + Math.random() * 0.04
      })
    }
    return tufts
  }, [])

  // خصلات فراء على الجسم
  const bodyFurTufts = useMemo(() => {
    const tufts: { pos: [number, number, number]; scale: number; color: string }[] = []
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 0.35 + Math.random() * 0.35
      const y = Math.random() * 1.3 - 0.5
      const variation = (Math.random() - 0.5) * 0.1
      const c = new THREE.Color(appearance.bodyColor)
      c.r = Math.max(0, Math.min(1, c.r + variation))
      c.g = Math.max(0, Math.min(1, c.g + variation))
      c.b = Math.max(0, Math.min(1, c.b + variation))
      tufts.push({
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        scale: 0.04 + Math.random() * 0.04,
        color: `#${c.getHexString()}`
      })
    }
    return tufts
  }, [appearance.bodyColor])

  // الشوارب - 6 شوارب على كل جانب
  const whiskers = useMemo(() => {
    const list: { pos: [number, number, number]; rot: [number, number, number]; len: number }[] = []
    for (let side of [-1, 1]) {
      for (let i = 0; i < 5; i++) {
        const y = -0.13 - i * 0.015
        const angle = (i - 2) * 0.15
        list.push({
          pos: [side * 0.12, y, 0.42],
          rot: [0, side * (Math.PI / 2 + angle), 0],
          len: 0.25 + Math.random() * 0.1
        })
      }
    }
    return list
  }, [])

  return (
    <group ref={group} position={position} scale={scale} dispose={null}>
      {/* ====== الجسم - بيضاوي واقعي ====== */}
      <mesh castShadow receiveShadow scale={[0.95, 1.05, 1.0]} material={furMaterial}>
        <sphereGeometry args={[0.5, 64, 48]} />
      </mesh>

      {/* البطن */}
      <mesh position={[0, -0.15, 0.18]} scale={[0.7, 0.85, 0.55]} castShadow material={bellyMaterial}>
        <sphereGeometry args={[0.42, 48, 32]} />
      </mesh>

      {/* الصدر */}
      <mesh position={[0, 0.15, 0.3]} scale={[0.5, 0.4, 0.3]} castShadow material={bellyMaterial}>
        <sphereGeometry args={[0.3, 32, 24]} />
      </mesh>

      {/* خصلات فراء على الجسم */}
      {bodyFurTufts.map((t, i) => (
        <mesh key={`fur-${i}`} position={t.pos} scale={t.scale} castShadow>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color={t.color} roughness={0.85} sheen={1} sheenColor="#ffffff" />
        </mesh>
      ))}

      {/* ====== الرأس ====== */}
      <group ref={head} position={[0, 0.92, 0.05]}>
        <mesh castShadow receiveShadow material={furMaterial}>
          <sphereGeometry args={[0.46, 64, 48]} />
        </mesh>

        {/* خصلات شعر علوية */}
        {headTufts.map((t, i) => (
          <mesh
            key={`tuft-${i}`}
            position={t.pos}
            rotation={t.rot}
            scale={t.scale}
            castShadow
          >
            <coneGeometry args={[0.5, 1.5, 6]} />
            <meshStandardMaterial color={appearance.bodyColor} roughness={0.85} sheen={1} sheenColor="#ffffff" />
          </mesh>
        ))}

        {/* الخدود */}
        <mesh position={[-0.3, -0.08, 0.18]} scale={[0.85, 0.95, 0.75]} castShadow material={furMaterial}>
          <sphereGeometry args={[0.22, 32, 24]} />
        </mesh>
        <mesh position={[0.3, -0.08, 0.18]} scale={[0.85, 0.95, 0.75]} castShadow material={furMaterial}>
          <sphereGeometry args={[0.22, 32, 24]} />
        </mesh>

        {/* الكمامة */}
        <mesh position={[0, -0.13, 0.32]} scale={[0.75, 0.65, 0.55]} castShadow material={bellyMaterial}>
          <sphereGeometry args={[0.22, 48, 32]} />
        </mesh>

        {/* ====== الأنف - بارز جداً ====== */}
        <mesh position={[0, -0.06, 0.48]} castShadow material={noseMaterial}>
          <sphereGeometry args={[0.075, 32, 24]} />
        </mesh>
        {/* فتحتا الأنف */}
        <mesh position={[-0.028, -0.06, 0.535]} rotation={[0.2, 0, 0]}>
          <capsuleGeometry args={[0.018, 0.025, 8, 12]} />
          <meshStandardMaterial color="#5a2030" roughness={0.6} />
        </mesh>
        <mesh position={[0.028, -0.06, 0.535]} rotation={[0.2, 0, 0]}>
          <capsuleGeometry args={[0.018, 0.025, 8, 12]} />
          <meshStandardMaterial color="#5a2030" roughness={0.6} />
        </mesh>
        {/* لمعان الأنف - بقعتان */}
        <mesh position={[-0.02, -0.03, 0.545]}>
          <sphereGeometry args={[0.014, 12, 12]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.022, -0.08, 0.54]}>
          <sphereGeometry args={[0.008, 10, 10]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>

        {/* ====== الفم ====== */}
        <mesh ref={mouthRef} position={[0, -0.18, 0.43]}>
          <torusGeometry args={[0.06, 0.014, 16, 24, Math.PI]} />
          <primitive object={mouthMaterial} attach="material" />
        </mesh>
        {/* السن الأمامية */}
        <mesh position={[0, -0.21, 0.45]}>
          <boxGeometry args={[0.04, 0.07, 0.03]} />
          <primitive object={toothMaterial} attach="material" />
        </mesh>
        {/* السن الثانية */}
        <mesh position={[0.025, -0.21, 0.448]}>
          <boxGeometry args={[0.018, 0.06, 0.025]} />
          <primitive object={toothMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.025, -0.21, 0.448]}>
          <boxGeometry args={[0.018, 0.06, 0.025]} />
          <primitive object={toothMaterial} attach="material" />
        </mesh>

        {/* ====== الشوارب ====== */}
        {whiskers.map((w, i) => (
          <mesh
            key={`wh-${i}`}
            position={w.pos}
            rotation={w.rot}
            material={whiskerMaterial}
          >
            <cylinderGeometry args={[0.003, 0.001, w.len, 4]} />
          </mesh>
        ))}

        {/* ====== الحواجب ====== */}
        <mesh ref={leftEyebrow} position={[-0.18, 0.22, 0.35]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[0.025, 0.08, 6, 12]} />
          <meshStandardMaterial color={appearance.bodyColor} roughness={0.75} sheen={1} sheenColor="#ffffff" />
        </mesh>
        <mesh ref={rightEyebrow} position={[0.18, 0.22, 0.35]} rotation={[0, 0, -0.1]}>
          <capsuleGeometry args={[0.025, 0.08, 6, 12]} />
          <meshStandardMaterial color={appearance.bodyColor} roughness={0.75} sheen={1} sheenColor="#ffffff" />
        </mesh>

        {/* ====== العيون - عمق متعدد الطبقات ====== */}
        <group ref={leftEye} position={[-0.18, 0.1, 0.3]}>
          {/* محجر العين - ظل خفيف */}
          <mesh position={[0, 0, -0.02]} scale={[1.15, 1.15, 0.5]}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial color={appearance.bodyColor} roughness={0.95} />
          </mesh>
          {/* بياض العين */}
          <mesh material={eyeWhiteMaterial}>
            <sphereGeometry args={[0.135, 32, 32]} />
          </mesh>
          {/* القزحية - بارزة للخارج */}
          <mesh position={[0, 0, 0.085]} material={irisMaterial}>
            <sphereGeometry args={[0.092, 32, 32]} />
          </mesh>
          {/* حلقة قزحية أغمق */}
          <mesh position={[0, 0, 0.115]}>
            <sphereGeometry args={[0.082, 32, 32]} />
            <meshStandardMaterial color={appearance.accentColor} roughness={0.4} transparent opacity={0.5} />
          </mesh>
          {/* خطوط القزحية */}
          <mesh position={[0, 0, 0.12]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.06, 0.005, 8, 24]} />
            <meshStandardMaterial color="#000000" transparent opacity={0.4} />
          </mesh>
          {/* البؤبؤ */}
          <mesh position={[0, 0, 0.155]} material={pupilMaterial}>
            <sphereGeometry args={[0.052, 24, 24]} />
          </mesh>
          {/* لمعان رئيسي */}
          <mesh position={[-0.025, 0.04, 0.18]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
          </mesh>
          {/* لمعان ثانوي */}
          <mesh position={[0.025, -0.03, 0.16]}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.9} />
          </mesh>
          {/* الرموش */}
          <mesh position={[-0.05, 0.13, 0.06]} rotation={[0, 0, 0.4]}>
            <coneGeometry args={[0.01, 0.045, 6]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
          <mesh position={[-0.02, 0.15, 0.06]} rotation={[0, 0, 0.1]}>
            <coneGeometry args={[0.01, 0.05, 6]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
          <mesh position={[0.02, 0.15, 0.06]} rotation={[0, 0, -0.1]}>
            <coneGeometry args={[0.01, 0.05, 6]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
          <mesh position={[0.05, 0.13, 0.06]} rotation={[0, 0, -0.4]}>
            <coneGeometry args={[0.01, 0.045, 6]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
        </group>

        {/* العين اليمنى - نسخة مطابقة */}
        <group ref={rightEye} position={[0.18, 0.1, 0.3]}>
          <mesh position={[0, 0, -0.02]} scale={[1.15, 1.15, 0.5]}>
            <sphereGeometry args={[0.13, 24, 24]} />
            <meshStandardMaterial color={appearance.bodyColor} roughness={0.95} />
          </mesh>
          <mesh material={eyeWhiteMaterial}>
            <sphereGeometry args={[0.135, 32, 32]} />
          </mesh>
          <mesh position={[0, 0, 0.085]} material={irisMaterial}>
            <sphereGeometry args={[0.092, 32, 32]} />
          </mesh>
          <mesh position={[0, 0, 0.115]}>
            <sphereGeometry args={[0.082, 32, 32]} />
            <meshStandardMaterial color={appearance.accentColor} roughness={0.4} transparent opacity={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <torusGeometry args={[0.06, 0.005, 8, 24]} />
            <meshStandardMaterial color="#000000" transparent opacity={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.155]} material={pupilMaterial}>
            <sphereGeometry args={[0.052, 24, 24]} />
          </mesh>
          <mesh position={[0.025, 0.04, 0.18]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.2} />
          </mesh>
          <mesh position={[-0.025, -0.03, 0.16]}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.9} />
          </mesh>
          <mesh position={[-0.05, 0.13, 0.06]} rotation={[0, 0, 0.4]}>
            <coneGeometry args={[0.01, 0.045, 6]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
          <mesh position={[-0.02, 0.15, 0.06]} rotation={[0, 0, 0.1]}>
            <coneGeometry args={[0.01, 0.05, 6]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
          <mesh position={[0.02, 0.15, 0.06]} rotation={[0, 0, -0.1]}>
            <coneGeometry args={[0.01, 0.05, 6]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
          <mesh position={[0.05, 0.13, 0.06]} rotation={[0, 0, -0.4]}>
            <coneGeometry args={[0.01, 0.045, 6]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
        </group>

        {/* خدود وردية */}
        <mesh position={[-0.34, -0.08, 0.22]} scale={[1.3, 1, 0.4]} material={blushMaterial}>
          <sphereGeometry args={[0.085, 16, 16]} />
        </mesh>
        <mesh position={[0.34, -0.08, 0.22]} scale={[1.3, 1, 0.4]} material={blushMaterial}>
          <sphereGeometry args={[0.085, 16, 16]} />
        </mesh>

        {/* ====== الأذنان الطويلتان - بتفصيل عالٍ ====== */}
        <group ref={leftEar} position={[-0.18, 0.38, -0.02]}>
          {/* الجسم الخارجي */}
          <mesh position={[0, 0.42, 0]} castShadow material={furMaterial}>
            <capsuleGeometry args={[0.115, 0.65, 16, 32]} />
          </mesh>
          {/* الطرف المدور */}
          <mesh position={[0, 0.78, 0]} castShadow material={furMaterial}>
            <sphereGeometry args={[0.115, 24, 24]} />
          </mesh>
          {/* القاعدة */}
          <mesh position={[0, 0.05, 0]} castShadow material={furMaterial}>
            <sphereGeometry args={[0.14, 24, 24]} />
          </mesh>
          {/* داخل الأذن - وردي */}
          <mesh position={[0, 0.42, 0.06]} scale={[0.55, 0.95, 0.4]} castShadow material={earInsideMaterial}>
            <capsuleGeometry args={[0.1, 0.6, 12, 24]} />
          </mesh>
          {/* تجاعيد داخل الأذن */}
          {[0.25, 0.45, 0.65].map((y, i) => (
            <mesh key={i} position={[0, y, 0.085]} scale={[0.45, 0.3, 0.3]}>
              <torusGeometry args={[0.06, 0.012, 8, 16]} />
              <meshStandardMaterial color="#ff8fa3" roughness={0.6} />
            </mesh>
          ))}
          {/* شعر داخل الأذن */}
          <mesh position={[0, 0.7, 0.08]} scale={[0.3, 0.4, 0.3]}>
            <coneGeometry args={[0.05, 0.2, 8]} />
            <meshStandardMaterial color="#ffd1dc" roughness={0.7} />
          </mesh>
        </group>

        <group ref={rightEar} position={[0.18, 0.38, -0.02]}>
          <mesh position={[0, 0.42, 0]} castShadow material={furMaterial}>
            <capsuleGeometry args={[0.115, 0.65, 16, 32]} />
          </mesh>
          <mesh position={[0, 0.78, 0]} castShadow material={furMaterial}>
            <sphereGeometry args={[0.115, 24, 24]} />
          </mesh>
          <mesh position={[0, 0.05, 0]} castShadow material={furMaterial}>
            <sphereGeometry args={[0.14, 24, 24]} />
          </mesh>
          <mesh position={[0, 0.42, 0.06]} scale={[0.55, 0.95, 0.4]} castShadow material={earInsideMaterial}>
            <capsuleGeometry args={[0.1, 0.6, 12, 24]} />
          </mesh>
          {[0.25, 0.45, 0.65].map((y, i) => (
            <mesh key={i} position={[0, y, 0.085]} scale={[0.45, 0.3, 0.3]}>
              <torusGeometry args={[0.06, 0.012, 8, 16]} />
              <meshStandardMaterial color="#ff8fa3" roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[0, 0.7, 0.08]} scale={[0.3, 0.4, 0.3]}>
            <coneGeometry args={[0.05, 0.2, 8]} />
            <meshStandardMaterial color="#ffd1dc" roughness={0.7} />
          </mesh>
        </group>

        {/* ====== الإكسسوارات ====== */}
        {appearance.hat === 'cap' && (
          <group position={[0, 0.4, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.42, 0.45, 0.14, 32]} />
              <meshPhysicalMaterial color={appearance.accentColor} roughness={0.4} clearcoat={0.6} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshPhysicalMaterial color="#ffd700" roughness={0.2} metalness={0.7} clearcoat={1} />
            </mesh>
            <mesh position={[0, 0.04, 0.34]} castShadow>
              <boxGeometry args={[0.44, 0.04, 0.32]} />
              <meshPhysicalMaterial color={appearance.accentColor} roughness={0.4} clearcoat={0.6} />
            </mesh>
          </group>
        )}
        {appearance.hat === 'crown' && (
          <group position={[0, 0.42, 0]}>
            <mesh position={[0, 0.04, 0]} castShadow>
              <cylinderGeometry args={[0.4, 0.42, 0.12, 24]} />
              <meshPhysicalMaterial color="#ffd700" roughness={0.15} metalness={0.95} clearcoat={1} />
            </mesh>
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2
              return (
                <mesh key={i} position={[Math.cos(a) * 0.38, 0.2, Math.sin(a) * 0.38]} castShadow>
                  <coneGeometry args={[0.06, 0.2, 8]} />
                  <meshPhysicalMaterial color="#ffd700" roughness={0.15} metalness={0.95} clearcoat={1} />
                </mesh>
              )
            })}
            {Array.from({ length: 4 }).map((_, i) => {
              const a = (i / 4) * Math.PI * 2 + Math.PI / 4
              return (
                <mesh key={`gem-${i}`} position={[Math.cos(a) * 0.4, 0.08, Math.sin(a) * 0.4]}>
                  <octahedronGeometry args={[0.045, 0]} />
                  <meshPhysicalMaterial color="#ff3366" roughness={0.05} metalness={0.3} transmission={0.8} thickness={0.5} clearcoat={1} ior={1.5} />
                </mesh>
              )
            })}
          </group>
        )}
        {appearance.hat === 'beanie' && (
          <group position={[0, 0.35, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.44, 32, 24, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
              <meshPhysicalMaterial color={appearance.accentColor} roughness={0.95} sheen={1} sheenColor="#ffffff" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.44, 0.44, 0.06, 32]} />
              <meshPhysicalMaterial color={appearance.accentColor} roughness={0.95} />
            </mesh>
            <mesh position={[0, 0.25, 0]} castShadow>
              <sphereGeometry args={[0.11, 20, 20]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.95} sheen={1} sheenColor="#ffffff" />
            </mesh>
          </group>
        )}

        {appearance.glasses === 'shades' && (
          <group position={[0, 0.1, 0.42]}>
            <mesh position={[-0.17, 0, 0]}>
              <boxGeometry args={[0.21, 0.14, 0.07]} />
              <meshPhysicalMaterial color="#1a1a1a" roughness={0.1} metalness={0.85} clearcoat={1} />
            </mesh>
            <mesh position={[0.17, 0, 0]}>
              <boxGeometry args={[0.21, 0.14, 0.07]} />
              <meshPhysicalMaterial color="#1a1a1a" roughness={0.1} metalness={0.85} clearcoat={1} />
            </mesh>
            <mesh position={[-0.17, 0.02, 0.04]}>
              <planeGeometry args={[0.18, 0.1]} />
              <meshBasicMaterial color="#88ddff" transparent opacity={0.35} />
            </mesh>
            <mesh position={[0.17, 0.02, 0.04]}>
              <planeGeometry args={[0.18, 0.1]} />
              <meshBasicMaterial color="#88ddff" transparent opacity={0.35} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.14, 0.025, 0.04]} />
              <meshPhysicalMaterial color="#1a1a1a" roughness={0.1} metalness={0.85} />
            </mesh>
            <mesh position={[-0.28, 0, -0.05]}>
              <boxGeometry args={[0.1, 0.025, 0.04]} />
              <meshPhysicalMaterial color="#1a1a1a" roughness={0.1} metalness={0.85} />
            </mesh>
            <mesh position={[0.28, 0, -0.05]}>
              <boxGeometry args={[0.1, 0.025, 0.04]} />
              <meshPhysicalMaterial color="#1a1a1a" roughness={0.1} metalness={0.85} />
            </mesh>
          </group>
        )}
        {appearance.glasses === 'round' && (
          <group position={[0, 0.1, 0.42]}>
            <mesh position={[-0.17, 0, 0]}>
              <torusGeometry args={[0.11, 0.028, 12, 32]} />
              <meshPhysicalMaterial color="#8b4513" roughness={0.4} clearcoat={0.8} />
            </mesh>
            <mesh position={[0.17, 0, 0]}>
              <torusGeometry args={[0.11, 0.028, 12, 32]} />
              <meshPhysicalMaterial color="#8b4513" roughness={0.4} clearcoat={0.8} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.14, 0.025, 0.025]} />
              <meshPhysicalMaterial color="#8b4513" roughness={0.4} />
            </mesh>
            <mesh position={[-0.17, 0, 0]}>
              <circleGeometry args={[0.1, 32]} />
              <meshPhysicalMaterial color="#aaccff" transparent opacity={0.15} transmission={0.7} thickness={0.1} roughness={0.1} />
            </mesh>
            <mesh position={[0.17, 0, 0]}>
              <circleGeometry args={[0.1, 32]} />
              <meshPhysicalMaterial color="#aaccff" transparent opacity={0.15} transmission={0.7} thickness={0.1} roughness={0.1} />
            </mesh>
          </group>
        )}
      </group>

      {/* ====== الذراعان ====== */}
      <group ref={leftArm} position={[-0.45, 0.1, 0.1]}>
        <mesh rotation={[0, 0, 0.4]} castShadow material={furMaterial}>
          <capsuleGeometry args={[0.11, 0.22, 12, 24]} />
        </mesh>
        <mesh position={[-0.13, -0.13, 0.08]} castShadow material={furMaterial}>
          <sphereGeometry args={[0.12, 24, 20]} />
        </mesh>
        {/* باودات اليد */}
        <mesh position={[-0.19, -0.18, 0.13]} material={pawPadMaterial}>
          <sphereGeometry args={[0.038, 16, 16]} />
        </mesh>
        <mesh position={[-0.13, -0.23, 0.13]} material={pawPadMaterial}>
          <sphereGeometry args={[0.028, 14, 14]} />
        </mesh>
        <mesh position={[-0.07, -0.18, 0.13]} material={pawPadMaterial}>
          <sphereGeometry args={[0.028, 14, 14]} />
        </mesh>
        {/* أظافر صغيرة */}
        <mesh position={[-0.22, -0.21, 0.16]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.012, 0.04, 6]} />
          <primitive object={nailMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.14, -0.26, 0.16]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.01, 0.035, 6]} />
          <primitive object={nailMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.06, -0.21, 0.16]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.012, 0.04, 6]} />
          <primitive object={nailMaterial} attach="material" />
        </mesh>
      </group>

      <group ref={rightArm} position={[0.45, 0.1, 0.1]}>
        <mesh rotation={[0, 0, -0.4]} castShadow material={furMaterial}>
          <capsuleGeometry args={[0.11, 0.22, 12, 24]} />
        </mesh>
        <mesh position={[0.13, -0.13, 0.08]} castShadow material={furMaterial}>
          <sphereGeometry args={[0.12, 24, 20]} />
        </mesh>
        <mesh position={[0.19, -0.18, 0.13]} material={pawPadMaterial}>
          <sphereGeometry args={[0.038, 16, 16]} />
        </mesh>
        <mesh position={[0.13, -0.23, 0.13]} material={pawPadMaterial}>
          <sphereGeometry args={[0.028, 14, 14]} />
        </mesh>
        <mesh position={[0.07, -0.18, 0.13]} material={pawPadMaterial}>
          <sphereGeometry args={[0.028, 14, 14]} />
        </mesh>
        <mesh position={[0.22, -0.21, 0.16]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.012, 0.04, 6]} />
          <primitive object={nailMaterial} attach="material" />
        </mesh>
        <mesh position={[0.14, -0.26, 0.16]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.01, 0.035, 6]} />
          <primitive object={nailMaterial} attach="material" />
        </mesh>
        <mesh position={[0.06, -0.21, 0.16]} rotation={[0.3, 0, 0]}>
          <coneGeometry args={[0.012, 0.04, 6]} />
          <primitive object={nailMaterial} attach="material" />
        </mesh>
      </group>

      {/* ====== الساقان ====== */}
      <group ref={leftLeg} position={[-0.22, -0.5, 0.05]}>
        <mesh castShadow material={furMaterial}>
          <capsuleGeometry args={[0.15, 0.18, 12, 24]} />
        </mesh>
        <mesh position={[0, -0.18, 0.1]} castShadow scale={[1, 0.5, 1.5]} material={furMaterial}>
          <sphereGeometry args={[0.18, 32, 24]} />
        </mesh>
        {/* باودات القدم */}
        <mesh position={[0, -0.26, 0.23]} material={pawPadMaterial}>
          <sphereGeometry args={[0.05, 20, 20]} />
        </mesh>
        <mesh position={[-0.07, -0.26, 0.18]} material={pawPadMaterial}>
          <sphereGeometry args={[0.028, 14, 14]} />
        </mesh>
        <mesh position={[0.07, -0.26, 0.18]} material={pawPadMaterial}>
          <sphereGeometry args={[0.028, 14, 14]} />
        </mesh>
        <mesh position={[-0.04, -0.25, 0.27]} material={pawPadMaterial}>
          <sphereGeometry args={[0.022, 12, 12]} />
        </mesh>
        <mesh position={[0.04, -0.25, 0.27]} material={pawPadMaterial}>
          <sphereGeometry args={[0.022, 12, 12]} />
        </mesh>
        {/* أظافر القدم */}
        <mesh position={[0, -0.28, 0.32]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.014, 0.045, 6]} />
          <primitive object={nailMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.06, -0.27, 0.3]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.011, 0.04, 6]} />
          <primitive object={nailMaterial} attach="material" />
        </mesh>
        <mesh position={[0.06, -0.27, 0.3]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.011, 0.04, 6]} />
          <primitive object={nailMaterial} attach="material" />
        </mesh>
      </group>

      <group ref={rightLeg} position={[0.22, -0.5, 0.05]}>
        <mesh castShadow material={furMaterial}>
          <capsuleGeometry args={[0.15, 0.18, 12, 24]} />
        </mesh>
        <mesh position={[0, -0.18, 0.1]} castShadow scale={[1, 0.5, 1.5]} material={furMaterial}>
          <sphereGeometry args={[0.18, 32, 24]} />
        </mesh>
        <mesh position={[0, -0.26, 0.23]} material={pawPadMaterial}>
          <sphereGeometry args={[0.05, 20, 20]} />
        </mesh>
        <mesh position={[-0.07, -0.26, 0.18]} material={pawPadMaterial}>
          <sphereGeometry args={[0.028, 14, 14]} />
        </mesh>
        <mesh position={[0.07, -0.26, 0.18]} material={pawPadMaterial}>
          <sphereGeometry args={[0.028, 14, 14]} />
        </mesh>
        <mesh position={[-0.04, -0.25, 0.27]} material={pawPadMaterial}>
          <sphereGeometry args={[0.022, 12, 12]} />
        </mesh>
        <mesh position={[0.04, -0.25, 0.27]} material={pawPadMaterial}>
          <sphereGeometry args={[0.022, 12, 12]} />
        </mesh>
        <mesh position={[0, -0.28, 0.32]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.014, 0.045, 6]} />
          <primitive object={nailMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.06, -0.27, 0.3]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.011, 0.04, 6]} />
          <primitive object={nailMaterial} attach="material" />
        </mesh>
        <mesh position={[0.06, -0.27, 0.3]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.011, 0.04, 6]} />
          <primitive object={nailMaterial} attach="material" />
        </mesh>
      </group>

      {/* ====== الذيل القطني الكثيف ====== */}
      <group ref={tail} position={[0, -0.1, -0.5]}>
        <mesh castShadow material={bellyMaterial}>
          <sphereGeometry args={[0.2, 32, 32]} />
        </mesh>
        {/* خصلات كثيفة حول الذيل */}
        {Array.from({ length: 12 }).map((_, i) => {
          const phi = (i / 12) * Math.PI * 2
          const theta = Math.random() * Math.PI
          const r = 0.18
          return (
            <mesh
              key={`tail-${i}`}
              position={[
                Math.sin(theta) * Math.cos(phi) * r,
                Math.sin(theta) * Math.sin(phi) * r,
                Math.cos(theta) * r * 0.5 - 0.05
              ]}
              castShadow
              material={bellyMaterial}
            >
              <sphereGeometry args={[0.09, 16, 16]} />
            </mesh>
          )
        })}
        {/* لمسة لامعة في المنتصف */}
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.08} roughness={0.6} />
        </mesh>
      </group>
    </group>
  )
}
