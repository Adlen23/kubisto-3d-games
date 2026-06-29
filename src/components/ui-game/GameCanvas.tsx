'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Sky } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ToneMapping, BrightnessContrast } from '@react-three/postprocessing'
import { Suspense, type ReactNode } from 'react'
import * as THREE from 'three'
import { ToneMappingMode } from 'postprocessing'

interface GameCanvasProps {
  children: ReactNode
  cameraPosition?: [number, number, number]
  cameraFov?: number
  enableControls?: boolean
  showSky?: boolean
  skySunPosition?: [number, number, number]
  groundColor?: string
  showGround?: boolean
  groundSize?: number
  ambientIntensity?: number
  sunIntensity?: number
  fog?: [string, number]
  enableZoom?: boolean
  enablePan?: boolean
  minDistance?: number
  maxDistance?: number
  maxPolarAngle?: number
  target?: [number, number, number]
  /** تفعيل post-processing للجودة السينمائية */
  cinematic?: boolean
}

/**
 * Canvas ثلاثي الأبعاد محسّن مع إضاءة سينمائية 3-point + post-processing
 */
export function GameCanvas({
  children,
  cameraPosition = [0, 5, 10],
  cameraFov = 50,
  enableControls = false,
  showSky = true,
  skySunPosition = [100, 50, 100],
  groundColor = '#7ec850',
  showGround = true,
  groundSize = 60,
  ambientIntensity = 0.5,
  sunIntensity = 1.0,
  fog,
  enableZoom = true,
  enablePan = false,
  minDistance = 3,
  maxDistance = 30,
  maxPolarAngle = Math.PI / 2.1,
  target = [0, 0, 0],
  cinematic = true
}: GameCanvasProps) {
  return (
    <Canvas
      shadows
      camera={{ position: cameraPosition, fov: cameraFov, near: 0.1, far: 200 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        {/* ====== إضاءة 3-point سينمائية ====== */}
        {/* ضوء محيط منخفض */}
        <ambientLight intensity={ambientIntensity} />

        {/* الضوء الرئيسي (Key Light) - شمس قوية مع ظلال */}
        <directionalLight
          position={skySunPosition}
          intensity={sunIntensity}
          color="#fff5e6"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
          shadow-camera-near={0.1}
          shadow-camera-far={100}
          shadow-bias={-0.0005}
          shadow-normalBias={0.02}
        />

        {/* ضوء ملء (Fill Light) - من الجانب المعاكس، أضعف وأبرد */}
        <directionalLight
          position={[-skySunPosition[0], skySunPosition[1] * 0.6, -skySunPosition[2]]}
          intensity={sunIntensity * 0.35}
          color="#bde0ff"
        />

        {/* ضوء خلفي (Rim Light) - يحدد حواف الشخصية */}
        <directionalLight
          position={[0, 5, -skySunPosition[2]]}
          intensity={sunIntensity * 0.5}
          color="#ffe5cc"
        />

        {/* ضوء نصف كروي لإضاءة السماء والأرض */}
        <hemisphereLight args={['#bde0ff', '#5a7a3a', 0.3]} />

        {/* السماء */}
        {showSky && (
          <Sky
            sunPosition={skySunPosition}
            turbidity={6}
            rayleigh={1.5}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
          />
        )}

        {/* الضباب */}
        {fog && <fog attach="fog" args={[fog[0], 10, fog[1]]} />}

        {/* المحتوى */}
        {children}

        {/* الأرضية */}
        {showGround && (
          <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
              <circleGeometry args={[groundSize, 64]} />
              <meshStandardMaterial color={groundColor} roughness={0.9} />
            </mesh>
            <ContactShadows
              position={[0, 0.01, 0]}
              opacity={0.5}
              scale={groundSize}
              blur={2.5}
              far={20}
              resolution={1024}
            />
          </>
        )}

        {/* البيئة لانعكاسات أفضل */}
        <Environment preset="sunset" />

        {/* أدوات التحكم بالكاميرا */}
        {enableControls && (
          <OrbitControls
            enableZoom={enableZoom}
            enablePan={enablePan}
            minDistance={minDistance}
            maxDistance={maxDistance}
            maxPolarAngle={maxPolarAngle}
            target={target}
            enableDamping
            dampingFactor={0.1}
          />
        )}

        {/* ====== Post-processing للجودة السينمائية ====== */}
        {cinematic && (
          <EffectComposer>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
            <BrightnessContrast brightness={0.02} contrast={0.08} />
            <Vignette eskil={false} offset={0.2} darkness={0.6} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  )
}
