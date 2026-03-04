import { useEffect } from 'react'

type ParticleEffect = 'default' | 'fireworks' | 'stars' | 'hearts' | 'none'

export default function MouseParticles() {
  useEffect(() => {
    const savedEffect = (localStorage.getItem('mouse-effect') || 'default') as ParticleEffect
    if (savedEffect === 'none') return

    const particles: HTMLDivElement[] = []

    const createParticle = (x: number, y: number, effect: ParticleEffect) => {
      const particle = document.createElement('div')
      particle.className = 'mouse-particle'
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`

      if (effect === 'default') {
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
        const color = colors[Math.floor(Math.random() * colors.length)]
        particle.style.background = color
        particle.style.boxShadow = `0 0 10px ${color}`
      } else if (effect === 'fireworks') {
        particle.style.background = '#fbbf24'
        particle.style.boxShadow = '0 0 15px #fbbf24'
        particle.style.width = '8px'
        particle.style.height = '8px'
      } else if (effect === 'stars') {
        particle.innerHTML = '⭐'
        particle.style.fontSize = '16px'
        particle.style.background = 'transparent'
      } else if (effect === 'hearts') {
        particle.innerHTML = '❤️'
        particle.style.fontSize = '14px'
        particle.style.background = 'transparent'
      }

      const angle = Math.random() * Math.PI * 2
      const velocity = effect === 'fireworks' ? 4 + Math.random() * 3 : 2 + Math.random() * 2
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
    const throttleDelay = 50

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < throttleDelay) return
      lastTime = now
      createParticle(e.clientX, e.clientY, savedEffect)
    }

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => createParticle(e.clientX, e.clientY, savedEffect), i * 20)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('click', handleClick)
      particles.forEach(p => p.remove())
    }
  }, [])

  return null
}
