'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkLogin } from '@/utils/login'

// รูปทั้งหมดต้องอยู่ใน public/ และอ้างด้วย "/" นำหน้า
const wallpaper = '/field.png'
const images = {
  basketball: '/Basketball.PNG',
  football: '/football.png',
  volleyball: '/volleyball.png',
  std: '/face.png',
} as const

type BallType = 'none' | keyof typeof images

type AnimationProps = {
  fieldWidth?: number
  fieldHeight?: number
  ballRadius?: number
  velocity?: number
}

const ballButtons: { type: BallType; label: string; icon: string; key: string }[] = [
  { type: 'none', label: 'None', icon: '🚫', key: '0' },
  { type: 'basketball', label: 'Basketball', icon: '🏀', key: '1' },
  { type: 'football', label: 'Football', icon: '⚽', key: '2' },
  { type: 'volleyball', label: 'Volleyball', icon: '🏐', key: '3' },
  { type: 'std', label: 'Student', icon: '🧑‍🎓', key: '4' },
]

const Animation = ({
  fieldWidth = 640,
  fieldHeight = 480,
  ballRadius = 50,
  velocity = 100,
}: AnimationProps) => {
  const [ballType, setBallType] = useState<BallType>('none')
  const [runing, setRuning] = useState<boolean>(false)
  const [x, setX] = useState<number>(0)
  const [y, setY] = useState<number>(0)
  const [rotation, setRotation] = useState<number>(0)

  const xVelocity = Math.round(velocity * Math.sqrt(2))
  const yVelocity = Math.round(velocity * Math.sqrt(2))
  const frameRate = 25
  const frameTime = 1 / frameRate
  const ballDiameter = 2 * ballRadius
  const maxX = fieldWidth - ballDiameter - 5
  const maxY = fieldHeight - ballDiameter - 5

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const xRef = useRef<number>(0)
  const yRef = useRef<number>(0)
  const moveRightRef = useRef<boolean>(true)
  const moveDownRef = useRef<boolean>(true)
  const rotationRef = useRef<number>(0)
  const rotationDirectionRef = useRef<number>(1)

  // keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        setRuning((prev) => !prev)
        return
      }
      const found = ballButtons.find((b) => b.key === e.key)
      if (found) setBallType(found.type)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const calculateNextFrame = () => {
    let currentX = xRef.current
    let currentY = yRef.current

    if (moveRightRef.current) {
      currentX += xVelocity / frameRate
      if (currentX >= maxX) {
        currentX = maxX - (currentX - maxX)
        moveRightRef.current = false
        rotationDirectionRef.current = -1
      }
    } else {
      currentX -= xVelocity / frameRate
      if (currentX <= 0) {
        currentX = -currentX
        moveRightRef.current = true
        rotationDirectionRef.current = 1
      }
    }

    if (moveDownRef.current) {
      currentY += yVelocity / frameRate
      if (currentY >= maxY) {
        currentY = maxY - (currentY - maxY)
        moveDownRef.current = false
      }
    } else {
      currentY -= yVelocity / frameRate
      if (currentY <= 0) {
        currentY = -currentY
        moveDownRef.current = true
      }
    }

    xRef.current = currentX
    yRef.current = currentY
    rotationRef.current += rotationDirectionRef.current * 5

    setX(currentX)
    setY(currentY)
    setRotation(rotationRef.current)

    timer.current = setTimeout(calculateNextFrame, frameTime * 1000)
  }

  useEffect(() => {
    if (runing) {
      if (timer.current === null) {
        timer.current = setTimeout(calculateNextFrame, frameTime * 1000)
      }
    } else if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
    return () => {
      if (timer.current !== null) {
        clearTimeout(timer.current)
        timer.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runing])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {/* field (เลื่อนซ้าย-ขวาได้บนจอเล็ก) */}
        <div className="overflow-x-auto">
          <div
            className="relative mx-auto rounded-3xl border-2 border-slate-800"
            style={{
              width: `${fieldWidth}px`,
              height: `${fieldHeight}px`,
              backgroundColor: '#86efac',
              backgroundImage: `url(${wallpaper})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div
              className="absolute rounded-full border border-slate-800"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${ballDiameter}px`,
                height: `${ballDiameter}px`,
                backgroundColor: 'lightblue',
                backgroundImage:
                  ballType === 'none' ? 'none' : `url(${images[ballType]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `rotate(${rotation}deg)`,
              }}
            />
          </div>
        </div>

        {/* controls */}
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <button
            onClick={() => setRuning(!runing)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-sm transition ${
              runing
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {runing ? '⏸ Pause' : '▶ Play'}
          </button>

          <div className="flex flex-wrap gap-2">
            {ballButtons.map(({ type, label, icon }) => {
              const active = ballType === type
              return (
                <button
                  key={type}
                  onClick={() => setBallType(type)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-medium transition ${
                    active
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <span>{icon}</span>
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* keyboard hints */}
        <p className="mt-4 text-center text-xs text-slate-500">
          แป้นพิมพ์:{' '}
          <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5">Space</kbd>{' '}
          เล่น/หยุด ·{' '}
          <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5">0–4</kbd>{' '}
          เปลี่ยนลูกบอล
        </p>
      </div>
    </div>
  )
}

export default function Page() {
  const router = useRouter()

  // ถ้ายังไม่ login ให้ไปหน้า login แล้วกลับมาที่ /animation
  useEffect(() => checkLogin(router, '/animation'), [router])

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pb-2 pt-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Animation
        </h1>
        <p className="mt-1 text-sm text-slate-500">ลูกบอลเด้งในสนาม เลือกชนิดลูกบอลได้ตามต้องการ</p>
      </div>
      <Animation />
    </>
  )
}