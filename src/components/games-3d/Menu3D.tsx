'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, BrightnessContrast } from '@react-three/postprocessing'
import { Suspense, useState, useEffect } from 'react'
import * as THREE from 'three'
import Link from 'next/link'
import { useGames3DStore, type Game3DId } from '@/lib/games-3d/game-store'
import { useT3D, useLang3D } from '@/lib/games-3d/use-t'
import { Kubisto } from '@/components/kubisto/Kubisto'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { playSound, startMusic, stopMusic } from '@/lib/games-3d/audio'
import {
  Gamepad2, Sparkles, ArrowLeft, ArrowRight,
  Volume2, VolumeX, Music, Music2, ChevronRight, Home
} from 'lucide-react'

const GAMES: { id: Game3DId; emoji: string; gradient: string; bgGradient: string }[] = [
  { id: 'adventure', emoji: '🪙', gradient: 'from-amber-400 to-orange-500', bgGradient: 'from-amber-100 to-orange-100' },
  { id: 'racing', emoji: '🏁', gradient: 'from-red-400 to-rose-500', bgGradient: 'from-red-100 to-rose-100' },
  { id: 'puzzle', emoji: '🧩', gradient: 'from-purple-400 to-fuchsia-500', bgGradient: 'from-purple-100 to-fuchsia-100' },
  { id: 'battle', emoji: '⚔️', gradient: 'from-slate-500 to-gray-700', bgGradient: 'from-slate-100 to-gray-100' },
  { id: 'survival', emoji: '🛡️', gradient: 'from-emerald-400 to-teal-500', bgGradient: 'from-emerald-100 to-teal-100' },
  { id: 'shooter', emoji: '🎯', gradient: 'from-blue-400 to-indigo-500', bgGradient: 'from-blue-100 to-indigo-100' }
]

/** مشهد كوبيستو ثلاثي الأبعاد للقائمة الرئيسية */
function MenuScene() {
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
        {/* إضاءة 3-point سينمائية */}
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

        {/* منصة عرض أنيقة */}
        <mesh position={[0, -0.95, 0]} receiveShadow>
          <cylinderGeometry args={[1.2, 1.3, 0.1, 32]} />
          <meshPhysicalMaterial color="#ffcc88" roughness={0.4} metalness={0.2} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[1.15, 1.15, 0.02, 32]} />
          <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
        </mesh>

        <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.5}>
          <Kubisto appearance={appearance} state="idle" animate scale={1.05} position={[0, 0, 0]} />
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
          autoRotate
          autoRotateSpeed={1.2}
          target={[0, 0, 0]}
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

export function Menu3D() {
  const t = useT3D()
  const { isAr, dir } = useLang3D()
  const lang = isAr ? 'ar' : 'en'
  const setScreen = useGames3DStore((s) => s.setScreen)
  const soundOn = useGames3DStore((s) => s.soundOn)
  const musicOn = useGames3DStore((s) => s.musicOn)
  const toggleSound = useGames3DStore((s) => s.toggleSound)
  const toggleMusic = useGames3DStore((s) => s.toggleMusic)
  const highScores = useGames3DStore((s) => s.highScores)
  const [showGames, setShowGames] = useState(false)

  useEffect(() => {
    if (musicOn) startMusic()
    return () => stopMusic()
  }, [musicOn])

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      dir={dir}
      style={{
        background: 'linear-gradient(180deg, #87ceeb 0%, #b3e0ff 40%, #d4f1d4 80%, #a8d88a 100%)'
      }}
    >
      {/* غيوم زخرفية */}
      <div className="absolute top-10 left-10 w-32 h-12 bg-white/70 rounded-full blur-md" />
      <div className="absolute top-20 right-20 w-40 h-14 bg-white/60 rounded-full blur-md" />
      <div className="absolute top-40 left-1/3 w-24 h-10 bg-white/50 rounded-full blur-md" />

      {/* أزرار التحكم العلوية */}
      <div className="absolute top-4 right-4 z-30 flex gap-2">
        <Link href="/">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white shadow-md"
            onClick={() => playSound('click')}
          >
            <Home className="w-4 h-4 mr-1" />
            {t.mainMenu.backToSite}
          </Button>
        </Link>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/90 hover:bg-white shadow-md w-9 h-9 p-0"
          onClick={() => { playSound('click'); toggleSound() }}
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/90 hover:bg-white shadow-md w-9 h-9 p-0"
          onClick={() => { playSound('click'); toggleMusic() }}
        >
          {musicOn ? <Music2 className="w-4 h-4" /> : <Music className="w-4 h-4" />}
        </Button>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-8 flex flex-col items-center">
        {/* العنوان */}
        <div className="text-center mb-2">
          <h1
            className="text-5xl sm:text-7xl font-black tracking-tight drop-shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa940 50%, #ffd93d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(2px 2px 0 rgba(255,255,255,0.8))'
            }}
          >
            {t.appTitle}
          </h1>
          <p className="text-base sm:text-lg text-white font-bold mt-1 drop-shadow">
            {t.appSubtitle}
          </p>
        </div>

        {/* مشهد كوبيستو */}
        <div className="w-full max-w-md h-64 sm:h-80 relative">
          <MenuScene />
        </div>

        <p className="text-center text-sm sm:text-base text-gray-800 font-semibold mb-4 max-w-md bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5">
          {t.tagline}
        </p>

        {!showGames ? (
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white text-xl font-bold h-14 rounded-2xl shadow-xl transition-all hover:scale-105"
              onClick={() => { playSound('select'); setShowGames(true) }}
            >
              <Gamepad2 className="w-6 h-6 mr-2" />
              {t.mainMenu.play}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white/95 hover:bg-white text-gray-800 text-lg font-bold h-12 rounded-2xl shadow-lg"
              onClick={() => { playSound('click'); setScreen('customize') }}
            >
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              {t.mainMenu.customize}
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:bg-white/40"
                onClick={() => { playSound('click'); setShowGames(false) }}
              >
                {isAr ? <ArrowRight className="w-4 h-4 mr-1" /> : <ArrowLeft className="w-4 h-4 mr-1" />}
                {isAr ? 'رجوع' : 'Back'}
              </Button>
              <h2 className="text-xl font-bold text-gray-800">
                {isAr ? 'اختر لعبة' : 'Choose a Game'}
              </h2>
              <div className="w-20" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GAMES.map((g) => {
                const meta = t.games[g.id]
                const hs = highScores[g.id]
                return (
                  <Card
                    key={g.id}
                    className={`relative overflow-hidden cursor-pointer border-2 border-white/60 bg-gradient-to-br ${g.bgGradient} hover:scale-[1.02] transition-transform shadow-lg`}
                    onClick={() => { playSound('select'); setScreen(g.id) }}
                  >
                    <div className="p-4 flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${g.gradient} flex items-center justify-center text-2xl shadow-md shrink-0`}>
                        {g.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-base leading-tight">
                          {meta.title}
                        </h3>
                        <p className="text-xs text-gray-700 mt-0.5 line-clamp-2">
                          {meta.desc}
                        </p>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-600 ${isAr ? 'rotate-180' : ''}`} />
                    </div>
                    {hs > 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90 text-amber-700 text-xs gap-1 px-2 py-0.5">
                          🏆 {hs}
                        </Badge>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-700/70">
        © 2026 Kubisto 3D Games · Made with ♥
      </div>
    </div>
  )
}
