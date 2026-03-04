import { useState, useRef, useEffect } from 'react'

interface SliderCaptchaProps {
  onSuccess: () => void
  onFail?: () => void
}

export default function SliderCaptcha({ onSuccess, onFail }: SliderCaptchaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(0)
  const [verified, setVerified] = useState(false)
  const [targetPos, setTargetPos] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTargetPos(Math.random() * 60 + 20)
  }, [])

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (verified) return
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMove = (clientX: number) => {
    if (!isDragging || !trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const newPos = Math.max(0, Math.min(clientX - rect.left, rect.width - 50))
    setPosition(newPos)
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const maxWidth = trackRef.current?.getBoundingClientRect().width || 300
    const tolerance = 5
    const targetPx = (targetPos / 100) * maxWidth

    if (Math.abs(position - targetPx) < tolerance) {
      setVerified(true)
      onSuccess()
    } else {
      setPosition(0)
      onFail?.()
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX)

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchend', handleEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, position])

  return (
    <div className="mb-4">
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {verified ? '✓ 验证成功' : '请拖动滑块完成验证'}
        </div>

        <div
          ref={trackRef}
          className="relative h-10 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-brand-500/20 transition-all"
            style={{ width: `${position}px` }}
          />
          <div
            className="absolute top-0 h-full w-1 bg-brand-500"
            style={{ left: `${targetPos}%` }}
          />
          <div
            ref={sliderRef}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            className={`absolute top-0 left-0 h-10 w-12 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors ${
              verified
                ? 'bg-green-500'
                : 'bg-white dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500'
            }`}
            style={{ transform: `translateX(${position}px)` }}>
            {verified ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
