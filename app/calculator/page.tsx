'use client'

import { checkLogin } from '@/utils/login'
import { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";

type Operator = '+' | '-' | '*' | '/'
type MemoryAction = 'MC' | 'MR' | 'M+' | 'M-'

// คำนวณ (คืน null เมื่อหารด้วยศูนย์)
function calculate(a: number, b: number, op: Operator): number | null {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    case '/': return b !== 0 ? a / b : null
  }
}

const format = (n: number) => String(parseFloat(n.toFixed(7)))

export default function Calculator() {
    const router = useRouter()
      useEffect(() => checkLogin(router, '/calculator'), [router])
  
  const [display, setDisplay] = useState('0')
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [waitingForSecond, setWaitingForSecond] = useState(false)
  const [memory, setMemory] = useState(0)

  const showError = () => {
    setDisplay('Error')
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecond(false)
  }

  // เพิ่มตัวเลข / จุดทศนิยม
  const appendNumber = (n: string) => {
    const base = display === 'Error' ? '0' : display
    if (waitingForSecond || display === 'Error') {
      setDisplay(n === '.' ? '0.' : n)
      setWaitingForSecond(false)
      return
    }
    if (n === '.') {
      if (!base.includes('.')) setDisplay(base + '.')
      return
    }
    setDisplay(base === '0' ? n : base + n)
  }

  // + - * /
  const appendOperator = (next: Operator) => {
    if (display === 'Error') return
    const input = parseFloat(display)

    if (operator && waitingForSecond) {
      setOperator(next)
      return
    }

    if (firstOperand === null) {
      setFirstOperand(input)
    } else if (operator) {
      const result = calculate(firstOperand, input, operator)
      if (result === null) return showError()
      setDisplay(format(result))
      setFirstOperand(result)
    }

    setWaitingForSecond(true)
    setOperator(next)
  }

  const calculateResult = () => {
    if (operator === null || firstOperand === null || waitingForSecond) return
    const result = calculate(firstOperand, parseFloat(display), operator)
    if (result === null) return showError()
    setDisplay(format(result))
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecond(false)
  }

  const clearDisplay = () => {
    setDisplay('0')
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecond(false)
  }

  const toggleSign = () => {
    if (display === 'Error') return
    setDisplay((parseFloat(display) * -1).toString())
  }

  const calculatePercentage = () => {
    if (display === 'Error') return
    setDisplay((parseFloat(display) / 100).toString())
  }

  const calculateSquareRoot = () => {
    const val = parseFloat(display)
    setDisplay(val >= 0 ? Math.sqrt(val).toString() : 'Error')
  }

  const calculateReciprocal = () => {
    const val = parseFloat(display)
    setDisplay(val !== 0 && !isNaN(val) ? (1 / val).toString() : 'Error')
  }

  const handleMemory = (type: MemoryAction) => {
    const current = parseFloat(display)
    if (type === 'MC') setMemory(0)
    if (type === 'MR') setDisplay(memory.toString())
    if (type === 'M+' && !isNaN(current)) setMemory(memory + current)
    if (type === 'M-' && !isNaN(current)) setMemory(memory - current)
  }

  // รองรับคีย์บอร์ด (ผูกใหม่ทุกครั้งที่ state เปลี่ยน เพื่อให้ได้ค่าล่าสุดเสมอ)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key
      if (/^[0-9]$/.test(key) || key === '.') appendNumber(key)
      else if (key === 'Escape') clearDisplay()
      else if (key === 'Enter') {
        e.preventDefault()
        calculateResult()
      } else if (key === '+' || key === '-' || key === '*') appendOperator(key)
      else if (key === '/') {
        e.preventDefault()
        appendOperator('/')
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  })

  const colors = {
    green: 'bg-gradient-to-b from-[#a8ffb2] to-[#5cdb6d]',
    blue: 'bg-gradient-to-b from-[#e3edff] to-[#a6c8ff]',
    orange: 'bg-gradient-to-b from-[#ffc0a3] to-[#ff7b42]',
  }

  const btn = (label: string, color: keyof typeof colors, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      className={`${colors[color]} h-[50px] rounded-lg border border-[#777] text-lg font-bold text-black cursor-pointer shadow-[0_4px_#888] transition-all duration-100 active:translate-y-[3px] active:shadow-[0_1px_#666]`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <div className="w-[320px] rounded-[20px] border-[6px] border-[#4a4a4a] bg-gradient-to-b from-[#dcdcdc] to-[#8c8c8c] p-[15px] shadow-[0_8px_15px_rgba(0,0,0,0.4)]">
        {/* หน้าจอแสดงผล */}
        <div className="mb-[15px] h-[55px] overflow-hidden rounded-lg border-2 border-[#a5d6a7] bg-[#e0f7fa] px-[15px] py-[10px] text-right text-[32px] leading-[1.15] text-black shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)]">
          {display}
        </div>

        {/* ปุ่มกด */}
        <div className="grid grid-cols-5 gap-2">
          {/* แถวที่ 1 */}
          {btn('MC', 'green', () => handleMemory('MC'))}
          {btn('MR', 'green', () => handleMemory('MR'))}
          {btn('M+', 'green', () => handleMemory('M+'))}
          {btn('M-', 'green', () => handleMemory('M-'))}
          {btn('CE', 'orange', clearDisplay)}

          {/* แถวที่ 2 */}
          {btn('7', 'blue', () => appendNumber('7'))}
          {btn('8', 'blue', () => appendNumber('8'))}
          {btn('9', 'blue', () => appendNumber('9'))}
          {btn('÷', 'green', () => appendOperator('/'))}
          {btn('√', 'green', calculateSquareRoot)}

          {/* แถวที่ 3 */}
          {btn('4', 'blue', () => appendNumber('4'))}
          {btn('5', 'blue', () => appendNumber('5'))}
          {btn('6', 'blue', () => appendNumber('6'))}
          {btn('×', 'green', () => appendOperator('*'))}
          {btn('%', 'green', calculatePercentage)}

          {/* แถวที่ 4 */}
          {btn('1', 'blue', () => appendNumber('1'))}
          {btn('2', 'blue', () => appendNumber('2'))}
          {btn('3', 'blue', () => appendNumber('3'))}
          {btn('-', 'green', () => appendOperator('-'))}
          {btn('1/x', 'green', calculateReciprocal)}

          {/* แถวที่ 5 */}
          {btn('0', 'blue', () => appendNumber('0'))}
          {btn('.', 'blue', () => appendNumber('.'))}
          {btn('+/–', 'blue', toggleSign)}
          {btn('+', 'green', () => appendOperator('+'))}
          {btn('=', 'green', calculateResult)}
        </div>

        <div className="mt-3 text-center text-[11px] tracking-[2px] text-white">68015210 ภูมิพัฒน์ ศรีเวียงธวัช</div>
      </div>
    </div>
  )
}