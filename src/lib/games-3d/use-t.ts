'use client'

import { useLanguage } from '@/context/LanguageContext'
import { get3DTranslations } from '@/lib/games-3d/i18n'

/**
 * Hook للحصول على ترجمات الألعاب 3D مع نظام اللغة الموجود في kopisto-kids
 */
export function useT3D() {
  const { locale } = useLanguage()
  return get3DTranslations(locale)
}

/**
 * Hook للحصول على معلومات اللغة والاتجاه
 */
export function useLang3D() {
  const { locale, isAr, dir } = useLanguage()
  return { locale, isAr, dir }
}
