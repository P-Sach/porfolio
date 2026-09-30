"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

const FloatingSkillItem = dynamic(() => import("@/components/FloatingSkillItem"), { ssr: false })

// One draggable, floating-chip panel. Replaces three copy-pasted blocks that
// each tracked their own ref and dimensions.
export default function SkillCategory({ title, items }: { title: string; items: string[] }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [dims, setDims] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setDims({ width: el.offsetWidth, height: el.offsetHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="text-2xl font-black mb-6">{title}</h2>
      <div ref={ref} className="relative w-full h-[300px] bg-white/50 rounded-xl border-2 border-black">
        {items.map((text, index) => (
          <FloatingSkillItem
            key={`${text}-${index}`}
            text={text}
            containerWidth={dims.width}
            containerHeight={dims.height}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}
