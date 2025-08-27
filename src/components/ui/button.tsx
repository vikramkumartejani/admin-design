"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

interface Ripple {
  key: number
  x: number
  y: number
  size: number
}

const RippleButton: React.FC<ButtonProps> = ({ children, className = "", ...props }) => {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const rippleCount = useRef(0)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const styleId = "ripple-animation-styles"
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style")
      style.id = styleId
      style.textContent = `
        @keyframes ripple-expand {
          0% {
            transform: scale(0);
            opacity: 0.6;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
        .ripple-animate {
          animation: ripple-expand 0.6s ease-out forwards;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  const createRipple = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const newRipple: Ripple = {
      key: rippleCount.current++,
      x,
      y,
      size,
    }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.key !== newRipple.key))
    }, 600)
  }

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden transition-all duration-200 select-none ${
        props.disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${className}`}
      onClick={(e) => {
        createRipple(e)
        if (props.onClick) props.onClick(e)
      }}
      {...props}
    >
      {children}
      <span className="absolute inset-0 pointer-events-none">
        {ripples.map((ripple) => (
          <span
            key={ripple.key}
            className="absolute bg-white/30 rounded-full ripple-animate"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              transform: "scale(0)",
            }}
          />
        ))}
      </span>
    </button>
  )
}

export default RippleButton