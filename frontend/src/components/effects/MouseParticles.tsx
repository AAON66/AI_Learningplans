import { useEffect } from 'react'

export default function MouseParticles() {
  useEffect(() => {
    const particles: HTMLDivElement[] = []
    let animationFrameId: number

    const createParticle = (x: number, y: number) => {
      const particle = document.createElement('div')
      particle.className = 'mouse-particle'
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`

      // 随机颜色
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
      const color = colors[Math.floor(Math.random() * colors.length)]
      particle.style.background = color
      particle.style.boxShadow = `0 0 10px ${color}`

      // 随机方向
      const angle = Math.random() * Math.PI * 2
      const velocity = 2 + Math.random() * 2
      const vx = Math.cos(angle) * velocity
      const vy = Math.sin(angle) * velocity

      document.body.appendChild(particle)
      particles.push(particle)

      let opacity = 1
      let scale = 1
      let posX = x
      let posY = y

      const animate = () => {
        opacity -= 0.02
        scale -= 0.02
        posX += vx
        posY += vy

        particle.style.opacity = opacity.toString()
        particle.style.transform = `translate(-50%, -50%) scale(${scale})`
        particle.style.left = `${posX}px`
        particle.style.top = `${posY}px`

        if (opacity <= 0) {
          particle.remove()
          const index = particles.indexOf(particle)
          if (index > -1) particles.splice(index, 1)
        } else {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }

    let lastTime = 0
    const throttleDelay = 50 // 每50ms最多创建一个粒子

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < throttleDelay) return
      lastTime = now

      createParticle(e.clientX, e.clientY)
    }

    const handleClick = (e: MouseEvent) => {
      // 点击时创建多个粒子
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          createParticle(e.clientX, e.clientY)
        }, i * 20)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('click', handleClick)
      particles.forEach(p => p.remove())
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return null
}
