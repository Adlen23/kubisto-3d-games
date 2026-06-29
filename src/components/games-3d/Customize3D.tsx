'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, BrightnessContrast } from '@react-three/postprocessing'
import { Suspense } from 'react'
import * as THREE from 'three'
import { useGames3DStore } from '@/lib/games-3d/game-store'
import { useT3D, useLang3D } from '@/lib/games-3d/use-t'
import { Kubisto } from '@/components/kubisto/Kubisto'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, RotateCcw, Save } from 'lucide-react'
import { playSound } from '@/lib/games-3d/audio'

const BODY_COLORS = ['#f8f8f0', '#ff8c42', '#a78bfa', '#7dd3fc', '#86efac', '#fda4af', '#fbbf24', '#c4b5fd']
const BELLY_COLORS = ['#ffd1dc', '#fff4e6', '#fef9c3', '#d1fae5', '#dbeafe', '#fce7f3', '#fed7aa', '#ffffff']
const ACCENT_COLORS = ['#1e90ff', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#1f2937']

function PreviewScene() {
  const appearance = useGames3DStore((s) => s.appearance)
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.2, 3.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={1.4}
          color="#fff5e6"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-bias={-0.0005}
          shadow-normalBias={0.02}
        />
        <directionalLight position={[-3, 3, -2]} intensity={0.5} color="#bde0ff" />
        <directionalLight position={[0, 3, -4]} intensity={0.8} color="#ffe5cc" />
        <hemisphereLight args={['#bde0ff', '#f8e0a0', 0.3]} />

        <mesh position={[0, -0.95, 0]} receiveShadow>
          <cylinderGeometry args={[1.2, 1.3, 0.1, 32]} />
          <meshPhysicalMaterial color="#ffcc88" roughness={0.4} metalness={0.2} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[1.15, 1.15, 0.02, 32]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
        </mesh>

        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
          <Kubisto appearance={appearance} state="idle" animate scale={1.05} />
        </Float>
        <ContactShadows
          position={[0, -0.85, 0]}
          opacity={0.6}
          scale={5}
          blur={2.5}
          far={3}
          resolution={512}
        />
        <Environment preset="sunset" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.1}
          enableDamping
        />

        <EffectComposer>
          <Bloom intensity={0.35} luminanceThreshold={0.6} luminanceSmoothing={0.4} mipmapBlur />
          <BrightnessContrast brightness={0.02} contrast={0.1} />
          <Vignette eskil={false} offset={0.25} darkness={0.5} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}

export function Customize3D() {
  const t = useT3D()
  const { isAr, dir } = useLang3D()
  const setScreen = useGames3DStore((s) => s.setScreen)
  const appearance = useGames3DStore((s) => s.appearance)
  const setAppearance = useGames3DStore((s) => s.setAppearance)
  const resetAppearance = useGames3DStore((s) => s.resetAppearance)

  return (
    <div
      className="min-h-screen w-full relative overflow-y-auto"
      dir={dir}
      style={{
        background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)'
      }}
    >
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/95 hover:bg-white shadow-md"
            onClick={() => { playSound('click'); setScreen('menu') }}
          >
            {isAr ? <ArrowRight className="w-4 h-4 mr-1" /> : <ArrowLeft className="w-4 h-4 mr-1" />}
            {t.inGame.backToMenu}
          </Button>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800">
            {t.customize.title}
          </h1>
          <div className="w-28" />
        </div>

        <Card className="overflow-hidden mb-4 border-4 border-white shadow-xl">
          <div className="h-72 sm:h-80 bg-gradient-to-b from-sky-200 to-emerald-100">
            <PreviewScene />
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="p-4 bg-white/95 shadow-lg">
            <Label className="text-sm font-bold text-gray-700 mb-2 block">
              {t.customize.bodyColor}
            </Label>
            <div className="flex flex-wrap gap-2">
              {BODY_COLORS.map((c) => (
                <button
                  key={c}
                  className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                    appearance.bodyColor === c ? 'border-gray-900 scale-110 ring-2 ring-amber-400' : 'border-white shadow'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => { playSound('click'); setAppearance({ bodyColor: c }) }}
                  aria-label={c}
                />
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-white/95 shadow-lg">
            <Label className="text-sm font-bold text-gray-700 mb-2 block">
              {t.customize.bellyColor}
            </Label>
            <div className="flex flex-wrap gap-2">
              {BELLY_COLORS.map((c) => (
                <button
                  key={c}
                  className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                    appearance.bellyColor === c ? 'border-gray-900 scale-110 ring-2 ring-amber-400' : 'border-white shadow'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => { playSound('click'); setAppearance({ bellyColor: c }) }}
                  aria-label={c}
                />
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-white/95 shadow-lg">
            <Label className="text-sm font-bold text-gray-700 mb-2 block">
              {t.customize.accentColor}
            </Label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  className={`w-9 h-9 rounded-full border-2 transition-all hover:scale-110 ${
                    appearance.accentColor === c ? 'border-gray-900 scale-110 ring-2 ring-amber-400' : 'border-white shadow'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => { playSound('click'); setAppearance({ accentColor: c }) }}
                  aria-label={c}
                />
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-white/95 shadow-lg">
            <Label className="text-sm font-bold text-gray-700 mb-2 block">
              {t.customize.hat}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { v: 'none', label: t.customize.noHat, icon: '🚫' },
                { v: 'cap', label: t.customize.cap, icon: '🧢' },
                { v: 'crown', label: t.customize.crown, icon: '👑' },
                { v: 'beanie', label: t.customize.beanie, icon: '🎩' }
              ] as const).map((opt) => (
                <button
                  key={opt.v}
                  className={`px-3 py-2 rounded-xl border-2 text-sm font-bold transition-all hover:scale-105 flex items-center justify-center gap-1.5 ${
                    appearance.hat === opt.v
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                  onClick={() => { playSound('click'); setAppearance({ hat: opt.v }) }}
                >
                  <span>{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-white/95 shadow-lg sm:col-span-2">
            <Label className="text-sm font-bold text-gray-700 mb-2 block">
              {t.customize.glasses}
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { v: 'none', label: t.customize.noGlasses, icon: '🚫' },
                { v: 'shades', label: t.customize.shades, icon: '🕶️' },
                { v: 'round', label: t.customize.round, icon: '👓' }
              ] as const).map((opt) => (
                <button
                  key={opt.v}
                  className={`px-3 py-2 rounded-xl border-2 text-sm font-bold transition-all hover:scale-105 flex items-center justify-center gap-1.5 ${
                    appearance.glasses === opt.v
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                  onClick={() => { playSound('click'); setAppearance({ glasses: opt.v }) }}
                >
                  <span>{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="secondary"
            className="flex-1 bg-white hover:bg-gray-100 text-gray-700 font-bold h-12"
            onClick={() => { playSound('click'); resetAppearance() }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.customize.reset}
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold h-12"
            onClick={() => { playSound('win'); setScreen('menu') }}
          >
            <Save className="w-4 h-4 mr-2" />
            {t.customize.save}
          </Button>
        </div>
      </div>
    </div>
  )
}
