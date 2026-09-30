"use client"

import { useState } from "react"
import Confetti from "react-confetti"

// Every CV button on the site points at /resume, a stable URL that serves
// whichever file is currently uploaded in the CMS.
export default function DownloadCvButton({ className = "" }: { className?: string }) {
  const [showConfetti, setShowConfetti] = useState(false)

  return (
    <>
      {showConfetti && (
        <Confetti recycle={false} numberOfPieces={500} onConfettiComplete={() => setShowConfetti(false)} />
      )}
      <a
        href="/resume"
        download
        className={`bg-black hover:bg-black/80 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 ${className}`}
        onClick={() => setShowConfetti(true)}
      >
        Download CV
      </a>
    </>
  )
}
