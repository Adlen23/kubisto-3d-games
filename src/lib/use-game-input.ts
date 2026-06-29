'use client'

import { useEffect, useRef, useState } from 'react'

/** حالات المدخلات الموحدة لجميع الألعاب */
export interface InputState {
  forward: boolean
  back: boolean
  left: boolean
  right: boolean
  jump: boolean
  attack: boolean
  shoot: boolean
  pause: boolean
  // للسماح بالضغط المستمر مع تشغيل لمرة واحدة
  jumpPressed: boolean
  attackPressed: boolean
  shootPressed: boolean
}

const initialInput: InputState = {
  forward: false,
  back: false,
  left: false,
  right: false,
  jump: false,
  attack: false,
  shoot: false,
  pause: false,
  jumpPressed: false,
  attackPressed: false,
  shootPressed: false
}

/**
 * Hook موحد لإدارة المدخلات
 * يدعم: لوحة المفاتيح + Gamepad + أزرار لمسية (TouchButtons)
 */
export function useGameInput(enabled = true) {
  const [input, setInput] = useState<InputState>(initialInput)
  const inputRef = useRef<InputState>(initialInput)
  const enabledRef = useRef(enabled)
  enabledRef.current = enabled

  // تحديث الحالة ومرجع
  const update = (patch: Partial<InputState>) => {
    inputRef.current = { ...inputRef.current, ...patch }
    setInput(inputRef.current)
  }

  useEffect(() => {
    if (!enabled) return

    const down = (e: KeyboardEvent) => {
      if (!enabledRef.current) return
      const k = e.key.toLowerCase()
      let patch: Partial<InputState> = {}
      switch (k) {
        case 'w': case 'arrowup': case 'z':
          patch = { forward: true }
          break
        case 's': case 'arrowdown':
          patch = { back: true }
          break
        case 'a': case 'arrowleft': case 'q':
          patch = { left: true }
          break
        case 'd': case 'arrowright':
          patch = { right: true }
          break
        case ' ':
        case 'arrowup':
          if (k === ' ') {
            e.preventDefault()
            patch = { jump: true, jumpPressed: true }
          } else {
            patch = { forward: true }
          }
          break
        case 'j': case 'k':
          patch = { attack: true, attackPressed: true }
          break
        case 'x': case 'l':
          patch = { shoot: true, shootPressed: true }
          break
        case 'p': case 'escape':
          patch = { pause: true }
          break
      }
      if (Object.keys(patch).length > 0) {
        update(patch)
      }
    }

    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      let patch: Partial<InputState> = {}
      switch (k) {
        case 'w': case 'arrowup': case 'z':
          patch = { forward: false }
          break
        case 's': case 'arrowdown':
          patch = { back: false }
          break
        case 'a': case 'arrowleft': case 'q':
          patch = { left: false }
          break
        case 'd': case 'arrowright':
          patch = { right: false }
          break
        case ' ':
          patch = { jump: false }
          break
        case 'j': case 'k':
          patch = { attack: false }
          break
        case 'x': case 'l':
          patch = { shoot: false }
          break
        case 'p': case 'escape':
          patch = { pause: false }
          break
      }
      if (Object.keys(patch).length > 0) {
        update(patch)
      }
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)

    // Gamepad polling
    let raf = 0
    let prevJump = false, prevAttack = false, prevShoot = false
    const pollGamepad = () => {
      const pads = navigator.getGamepads?.() || []
      const gp = pads[0]
      if (gp) {
        // المحور الأيسر للحركة
        const x = gp.axes[0] || 0
        const y = gp.axes[1] || 0
        const deadzone = 0.25
        const patch: Partial<InputState> = {}
        if (y < -deadzone) patch.forward = true
        else if (y > -deadzone && !keyDown('w')) patch.forward = false
        if (y > deadzone) patch.back = true
        else if (y < deadzone && !keyDown('s')) patch.back = false
        if (x < -deadzone) patch.left = true
        else if (x > -deadzone && !keyDown('a')) patch.left = false
        if (x > deadzone) patch.right = true
        else if (x < deadzone && !keyDown('d')) patch.right = false

        // D-pad
        if (gp.buttons[12]?.pressed) patch.forward = true
        if (gp.buttons[13]?.pressed) patch.back = true
        if (gp.buttons[14]?.pressed) patch.left = true
        if (gp.buttons[15]?.pressed) patch.right = true

        // A = قفز، X = هجوم، RT/B = رماية
        const jumpNow = gp.buttons[0]?.pressed || false
        const attackNow = gp.buttons[2]?.pressed || gp.buttons[3]?.pressed || false
        const shootNow = gp.buttons[7]?.pressed || gp.buttons[1]?.pressed || false

        patch.jump = jumpNow
        if (jumpNow && !prevJump) patch.jumpPressed = true
        patch.attack = attackNow
        if (attackNow && !prevAttack) patch.attackPressed = true
        patch.shoot = shootNow
        if (shootNow && !prevShoot) patch.shootPressed = true

        prevJump = jumpNow
        prevAttack = attackNow
        prevShoot = shootNow

        if (Object.keys(patch).length > 0) update(patch)
      }
      raf = requestAnimationFrame(pollGamepad)
    }
    raf = requestAnimationFrame(pollGamepad)

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  /** مسح "pressed" بعد كل إطار */
  const clearPressed = () => {
    inputRef.current = {
      ...inputRef.current,
      jumpPressed: false,
      attackPressed: false,
      shootPressed: false
    }
    setInput(inputRef.current)
  }

  /** ضبط زر لمسي */
  const setTouch = (key: keyof InputState, val: boolean) => {
    const patch: Partial<InputState> = { [key]: val } as any
    if ((key === 'jump' || key === 'attack' || key === 'shoot') && val) {
      ;(patch as any)[`${key}Pressed`] = true
    }
    update(patch)
  }

  return { input, inputRef, clearPressed, setTouch }
}

function keyDown(k: string) {
  return false // placeholder, we just always trust gamepad when active
}
