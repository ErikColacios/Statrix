"use client"
import React from "react"
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"

type Props = {
    src: string
    alt: string
    className?: string
}

const MAX_TILT = 14 // Degrees
const SPRING = { stiffness: 180, damping: 18, mass: 0.6 }

/**
 * Image shown as a physical card: it appears with an animation, tilts in 3D following the mouse or finger,
 * and reflects the light.
 * It is only visual, the image itself does not change.
 */
export default function HoloCard({ src, alt, className = "" }: Props) {
    const reduceMotion = useReducedMotion()

    // Pointer position over the card, from 0 to 1. 0.5 is the center (card facing the user)
    const pointerX = useMotionValue(0.5)
    const pointerY = useMotionValue(0.5)
    const x = useSpring(pointerX, SPRING)
    const y = useSpring(pointerY, SPRING)

    const rotateY = useTransform(x, [0, 1], [-MAX_TILT, MAX_TILT])
    const rotateX = useTransform(y, [0, 1], [MAX_TILT, -MAX_TILT])

    // The light reflection follows the pointer
    const glareX = useTransform(x, [0, 1], [0, 100])
    const glareY = useTransform(y, [0, 1], [0, 100])
    const glareOpacity = useSpring(0, SPRING)
    const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 25%, transparent 60%)`

    // The shadow moves to the opposite side of the tilt, as if the light came from the front
    const shadowX = useTransform(x, [0, 1], [24, -24])
    const shadowY = useTransform(y, [0, 1], [24, -24])
    const shadow = useMotionTemplate`${shadowX}px ${shadowY}px 50px -10px rgba(0,0,0,0.75), 0 0 40px -10px rgba(34,197,94,0.35)`

    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect()
        pointerX.set(Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1))
        pointerY.set(Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1))
        glareOpacity.set(1)
    }

    function handlePointerLeave() {
        pointerX.set(0.5)
        pointerY.set(0.5)
        glareOpacity.set(0)
    }

    // Users that prefer reduced motion see the card still
    if (reduceMotion) {
        return <img src={src} alt={alt} className={`rounded-2xl shadow-2xl ${className}`} />
    }

    return (
        <div className="[perspective:1200px]">
            <motion.div
                // touch-none so on mobile the finger tilts the card instead of scrolling
                className={`relative touch-none select-none rounded-2xl ${className}`}
                style={{ rotateX, rotateY, boxShadow: shadow, transformStyle: "preserve-3d" }}
                // Appears falling and turning until it faces the user
                initial={{ opacity: 0, y: -120, scale: 0.7, rotate: -12 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 14 }}
                whileHover={{ scale: 1.03 }}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}>

                {/* draggable={false} so the browser does not start its own image drag */}
                <img src={src} alt={alt} draggable={false} className="h-full w-full rounded-2xl object-cover" />

                {/* Light reflection */}
                <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-overlay"
                    style={{ background: glare, opacity: glareOpacity }} />

                {/* Thin bright edge, like the border of a plastic card */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
            </motion.div>
        </div>
    )
}
