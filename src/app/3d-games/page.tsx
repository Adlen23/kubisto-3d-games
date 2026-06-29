'use client'

import { useGames3DStore } from '@/lib/games-3d/game-store'
import { Menu3D } from '@/components/games-3d/Menu3D'
import { Customize3D } from '@/components/games-3d/Customize3D'
import { AdventureGame } from '@/components/games-3d/AdventureGame'
import { RacingGame } from '@/components/games-3d/RacingGame'
import { PuzzleGame } from '@/components/games-3d/PuzzleGame'
import { BattleGame } from '@/components/games-3d/BattleGame'
import { SurvivalGame } from '@/components/games-3d/SurvivalGame'
import { ShooterGame } from '@/components/games-3d/ShooterGame'
import { useEffect } from 'react'

export default function ThreeDGamesPage() {
  const screen = useGames3DStore((s) => s.screen)

  // منع تمرير الصفحة الأمامية عند بدء لعبة
  useEffect(() => {
    if (screen === 'menu' || screen === 'games' || screen === 'customize') {
      document.body.style.overflow = 'auto'
    } else {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [screen])

  switch (screen) {
    case 'menu':
    case 'games':
      return <Menu3D />
    case 'customize':
      return <Customize3D />
    case 'adventure':
      return <AdventureGame />
    case 'racing':
      return <RacingGame />
    case 'puzzle':
      return <PuzzleGame />
    case 'battle':
      return <BattleGame />
    case 'survival':
      return <SurvivalGame />
    case 'shooter':
      return <ShooterGame />
    default:
      return <Menu3D />
  }
}
