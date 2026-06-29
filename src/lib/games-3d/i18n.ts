/**
 * نظام اللغات ثنائي اللغة (عربي/إنجليزي) للألعاب 3D
 * يستخدم نظام اللغة الموجود في kopisto-kids-v2
 */

import type { Locale } from '@/lib/i18n'

export const translations3D = {
  ar: {
    appTitle: 'كوبيستو 3D',
    appSubtitle: 'مجموعة الألعاب ثلاثية الأبعاد',
    tagline: 'عيش المغامرات الست مع كوبيستو البطل',

    mainMenu: {
      play: 'العب',
      customize: 'تخصيص الشخصية',
      backToSite: 'العودة للموقع'
    },

    games: {
      adventure: { title: 'مغامرة كوبيستو', desc: 'اجمع العملات الذهبية وتجاوز المنصات' },
      racing: { title: 'سباق السرعة', desc: 'تسارع في المسار وتفادى العقبات' },
      puzzle: { title: 'لغز المكعبات', desc: 'دفع الصناديق إلى أماكنها الصحيحة' },
      battle: { title: 'معركة الأبطال', desc: 'قاتل موجات الأعداء وكن بطلاً' },
      survival: { title: 'البقاء للأقوى', desc: 'تجنب العقبات المتساقطة بأطول فترة' },
      shooter: { title: 'الرماية الذهبية', desc: 'صوّب على الأهداف المتحركة' }
    },

    inGame: {
      score: 'النقاط',
      lives: 'الأرواح',
      time: 'الوقت',
      level: 'المستوى',
      coins: 'العملات',
      pause: 'إيقاف مؤقت',
      resume: 'استئناف',
      restart: 'إعادة',
      quit: 'خروج',
      backToMenu: 'القائمة الرئيسية',
      gameOver: 'انتهت اللعبة',
      youWin: 'فزت!',
      nextLevel: 'المستوى التالي',
      highScore: 'أعلى نتيجة',
      moves: 'الحركات',
      ammo: 'ذخيرة',
      missed: 'مفقود'
    },

    customize: {
      title: 'تخصيص كوبيستو',
      bodyColor: 'لون الجسم',
      bellyColor: 'لون البطن',
      accentColor: 'اللون الثانوي',
      hat: 'القبعة',
      noHat: 'بدون',
      cap: 'قبعة رياضية',
      crown: 'تاج',
      beanie: 'قبعة صوف',
      glasses: 'النظارة',
      noGlasses: 'بدون',
      shades: 'نظارة شمسية',
      round: 'نظارة دائرية',
      save: 'حفظ',
      reset: 'إعادة تعيين'
    },

    controls: {
      move: 'حركة',
      jump: 'قفز',
      attack: 'هجوم',
      shoot: 'إطلاق',
      pause: 'إيقاف'
    },

    messages: {
      loading: 'جارٍ التحميل...',
      newHighScore: 'نتيجة جديدة!'
    }
  },

  en: {
    appTitle: 'Kubisto 3D',
    appSubtitle: '3D Games Collection',
    tagline: 'Live six adventures with Kubisto the hero',

    mainMenu: {
      play: 'Play',
      customize: 'Customize',
      backToSite: 'Back to Site'
    },

    games: {
      adventure: { title: 'Kubisto Adventure', desc: 'Collect golden coins and cross platforms' },
      racing: { title: 'Speed Race', desc: 'Race through the track and avoid obstacles' },
      puzzle: { title: 'Cube Puzzle', desc: 'Push boxes to their correct places' },
      battle: { title: 'Heroes Battle', desc: 'Fight waves of enemies and be a hero' },
      survival: { title: 'Survival Fittest', desc: 'Dodge falling obstacles as long as you can' },
      shooter: { title: 'Golden Shooter', desc: 'Shoot at moving targets' }
    },

    inGame: {
      score: 'Score',
      lives: 'Lives',
      time: 'Time',
      level: 'Level',
      coins: 'Coins',
      pause: 'Pause',
      resume: 'Resume',
      restart: 'Restart',
      quit: 'Quit',
      backToMenu: 'Main Menu',
      gameOver: 'Game Over',
      youWin: 'You Win!',
      nextLevel: 'Next Level',
      highScore: 'High Score',
      moves: 'Moves',
      ammo: 'Ammo',
      missed: 'Missed'
    },

    customize: {
      title: 'Customize Kubisto',
      bodyColor: 'Body Color',
      bellyColor: 'Belly Color',
      accentColor: 'Accent Color',
      hat: 'Hat',
      noHat: 'None',
      cap: 'Cap',
      crown: 'Crown',
      beanie: 'Beanie',
      glasses: 'Glasses',
      noGlasses: 'None',
      shades: 'Shades',
      round: 'Round',
      save: 'Save',
      reset: 'Reset'
    },

    controls: {
      move: 'Move',
      jump: 'Jump',
      attack: 'Attack',
      shoot: 'Shoot',
      pause: 'Pause'
    },

    messages: {
      loading: 'Loading...',
      newHighScore: 'New High Score!'
    }
  }
} as const

export type Translation3D = typeof translations3D.ar

export function get3DTranslations(locale: Locale): Translation3D {
  return translations3D[locale] || translations3D.ar
}
