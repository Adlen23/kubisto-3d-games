'use client'

/**
 * نظام مؤثرات صوتية بسيط باستخدام Web Audio API
 * Simple sound effects system using Web Audio API
 * لا يحتاج ملفات صوت خارجية - يولّد الأصوات برمجياً
 */

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch {
      return null
    }
  }
  return audioCtx
}

/** تشغيل نغمة بسيطة */
function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.15,
  startTime = 0
) {
  const ctx = getCtx()
  if (!ctx) return
  const t0 = ctx.currentTime + startTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

export const sounds = {
  jump: () => {
    const ctx = getCtx()
    if (!ctx) return
    const t0 = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(220, t0)
    osc.frequency.exponentialRampToValueAtTime(660, t0 + 0.15)
    gain.gain.setValueAtTime(0.12, t0)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + 0.25)
  },
  coin: () => {
    playTone(880, 0.08, 'sine', 0.12)
    playTone(1320, 0.12, 'sine', 0.1, 0.06)
  },
  hit: () => {
    const ctx = getCtx()
    if (!ctx) return
    const t0 = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, t0)
    osc.frequency.exponentialRampToValueAtTime(50, t0 + 0.2)
    gain.gain.setValueAtTime(0.2, t0)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + 0.3)
  },
  shoot: () => {
    const ctx = getCtx()
    if (!ctx) return
    const t0 = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(880, t0)
    osc.frequency.exponentialRampToValueAtTime(220, t0 + 0.1)
    gain.gain.setValueAtTime(0.1, t0)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + 0.15)
  },
  win: () => {
    playTone(523, 0.12, 'sine', 0.15)
    playTone(659, 0.12, 'sine', 0.15, 0.1)
    playTone(784, 0.12, 'sine', 0.15, 0.2)
    playTone(1047, 0.25, 'sine', 0.18, 0.3)
  },
  lose: () => {
    playTone(440, 0.15, 'triangle', 0.15)
    playTone(330, 0.15, 'triangle', 0.15, 0.12)
    playTone(220, 0.3, 'triangle', 0.18, 0.24)
  },
  click: () => {
    playTone(660, 0.04, 'sine', 0.08)
  },
  select: () => {
    playTone(440, 0.05, 'sine', 0.1)
    playTone(660, 0.05, 'sine', 0.08, 0.03)
  },
  levelup: () => {
    playTone(523, 0.1, 'sine', 0.15)
    playTone(659, 0.1, 'sine', 0.15, 0.08)
    playTone(784, 0.2, 'sine', 0.18, 0.16)
  }
}

/** تشغيل صوت مع احترام إعداد المستخدم */
export function playSound(name: keyof typeof sounds, enabled = true) {
  if (!enabled) return
  try {
    sounds[name]()
  } catch {
    // ignore
  }
}

/** موسيقى خلفية بسيطة - لحن متكرر */
let musicTimer: ReturnType<typeof setInterval> | null = null
let musicStep = 0

const melody = [
  262, 330, 392, 523, 392, 330, 262, 196,
  220, 277, 330, 440, 330, 277, 220, 165
]

export function startMusic() {
  if (musicTimer) return
  musicTimer = setInterval(() => {
    const note = melody[musicStep % melody.length]
    playTone(note, 0.3, 'triangle', 0.04)
    if (musicStep % 2 === 0) {
      playTone(note / 2, 0.3, 'sine', 0.03)
    }
    musicStep++
  }, 350)
}

export function stopMusic() {
  if (musicTimer) {
    clearInterval(musicTimer)
    musicTimer = null
  }
}
