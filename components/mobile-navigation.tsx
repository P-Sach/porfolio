import Link from "next/link"
import { Button } from "@/components/ui/button"
import {Linkedin, Github, Mail } from "lucide-react"
import Confetti from 'react-confetti'
import { useState } from 'react'

export default function MobileNavigation() {
  const [showConfetti, setShowConfetti] = useState(false)

  return (
    <div className="h-full bg-white/40 backdrop-blur-md flex flex-col">
      <div className="p-6 border-b-4 border-black">
        <h2 className="text-2xl font-black">PORTFOLIO</h2>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <nav className="space-y-2 mb-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold p-3 bg-black text-white rounded-xl">
            Home
          </Link>
          <Link href="/Experience" className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl">
            Work Experience
          </Link>
          <Link href="/Projects" className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl">
            Projects
          </Link>
          <Link href="/Skills" className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl">
            Skills
          </Link>
        </nav>

        <div>
          <h2 className="text-xl font-black mb-4">CONNECT</h2>
          <div className="space-y-2">
            <a href="https://github.com/P-Sach" target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold">
                <Github className="h-5 w-5" /> Github
              </Button>
            </a>
            <a href="https://linkedin.com/in/parthsachdeva" target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold">
                <Linkedin className="h-5 w-5" /> LinkedIn
              </Button>
            </a>
            <a href="mailto:parthsachdeva10@gmail.com" className="block">
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold">
                <Mail className="h-5 w-5" /> Mail
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="p-4 border-t-4 border-black mt-auto">
          {showConfetti && <Confetti recycle={false} numberOfPieces={500} onConfettiComplete={() => setShowConfetti(false)} />}
          <a
            href="/ParthSachdeva_CV_22.pdf"
            download
            className="bg-black hover:bg-black/80 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 w-full text-center block"
            onClick={() => setShowConfetti(true)}
          >
            Download CV
          </a>
        </div>
    </div>
  )
}
