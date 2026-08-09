'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import type { KubistoAppearance } from '@/lib/games-3d/game-store'

interface SpriteKubistoProps {
  appearance?: KubistoAppearance
  state?: 'idle' | 'walk' | 'run' | 'jump' | 'attack' | 'hit' | 'celebrate'
  rotation?: number
  scale?: number
  position?: [number, number, number]
  animate?: boolean
}

/**
 * SpriteKubisto - يستخدم صور 2D كـ billboard sprite في عالم 3D
 * - idle/attack/hit: يستخدم الصورة 1 (واقف)
 * - walk/run/jump/celebrate: يستخدم الصورة 2 (يجري)
 * السبرايت يواجه الكاميرا دائماً (billboard)
 */
export function SpriteKubisto({
  state = 'idle',
  rotation = 0,
  scale = 1,
  position = [0, 0, 0],
  animate = true
}: SpriteKubistoProps) {
  const group = useRef<THREE.Group>(null)
  const spriteRef = useRef<THREE.Sprite>(null)
  const t = useRef(0)

  // تحميل الصور (PNG بخلفية شفافة)
  const idleTexture = useLoader(THREE.TextureLoader, '/kubisto-idle-sprite.png')
  const runTexture = useLoader(THREE.TextureLoader, '/kubisto-run-sprite.png')

  // ضبط إعدادات النسيج للجودة العالية
  useEffect(() => {
    [idleTexture, runTexture].forEach((tex) => {
      if (tex) {
        tex.magFilter = THREE.LinearFilter
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.anisotropy = 16
        tex.colorSpace = THREE.SRGBColorSpace
        tex.needsUpdate = true
      }
    })
  }, [idleTexture, runTexture])

  // اختيار النسيج بناءً على الحالة
  const useRunningSprite = state === 'walk' || state === 'run' || state === 'jump' || state === 'celebrate'
  const targetTexture = useRunningSprite ? runTexture : idleTexture

  useFrame((_, dtRaw) => {
    if (!animate || !group.current) return
    const dt = Math.min(dtRaw, 0.05)
    t.current += dt
    const tt = t.current

    // تحديث النسيج على السبرايت بشكل مباشر (أكثر موثوقية)
    if (spriteRef.current && spriteRef.current.material.map !== targetTexture) {
      spriteRef.current.material.map = targetTexture
      spriteRef.current.material.needsUpdate = true
    }

    let bounce = 0
    let tilt = 0
    let scaleX = scale
    let scaleY = scale

    switch (state) {
      case 'idle':
        bounce = Math.sin(tt * 2) * 0.03
        scaleY = scale * (1 + Math.sin(tt * 2) * 0.02)
        scaleX = scale * (1 - Math.sin(tt * 2) * 0.015)
        tilt = Math.sin(tt * 0.7) * 0.03
        break
      case 'walk':
        bounce = Math.abs(Math.sin(tt * 8)) * 0.08
        tilt = Math.sin(tt * 8) * 0.05
        break
      case 'run':
        bounce = Math.abs(Math.sin(tt * 14)) * 0.12
        tilt = Math.sin(tt * 14) * 0.08
        scaleX = scale * 1.02
        break
      case 'jump':
        bounce = Math.sin(tt * 6) * 0.2
        tilt = -0.1
        scaleY = scale * 1.05
        break
      case 'attack':
        bounce = Math.sin(tt * 16) * 0.05
        tilt = Math.sin(tt * 16) * 0.1
        break
      case 'hit':
        bounce = Math.sin(tt * 22) * 0.15
        tilt = Math.sin(tt * 25) * 0.15
        break
      case 'celebrate':
        bounce = Math.abs(Math.sin(tt * 5)) * 0.3
        tilt = Math.sin(tt * 5) * 0.1
        scaleY = scale * (1 + Math.sin(tt * 5) * 0.05)
        break
    }

    group.current.position.set(position[0], position[1] + bounce, position[2])
    group.current.rotation.y = rotation

    if (spriteRef.current) {
      spriteRef.current.rotation.x = tilt
      // السبرايت حجمه طبيعي 1×1، نضربه في scale وبعدل بنسبة عرض/طول الصورة
      // الصورة لها نسبة ~2:3 (عرض:طول) لذا نضرب Y بـ 1.5
      spriteRef.current.scale.set(scaleX, scaleY * 1.5, 1)
    }
  })

  // مادة السبرايت
  const spriteMaterial = useRef(
    new THREE.SpriteMaterial({
      map: idleTexture,
      transparent: true,
      alphaTest: 0.05,
      depthWrite: false,
      toneMapped: true
    })
  ).current

  // تنظيف المادة عند إزالة المكوّن
  useEffect(() => {
    return () => {
      spriteMaterial.dispose()
    }
  }, [spriteMaterial])

  return (
    <group ref={group} position={position} scale={scale} dispose={null}>
      {/* السبرايت الرئيسي - يواجه الكاميرا دائماً */}
      <sprite ref={spriteRef} material={spriteMaterial} scale={[1, 1.5, 1]} />

      {/* ظل على الأرض */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.75, 0]}>
        <circleGeometry args={[0.45, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}
