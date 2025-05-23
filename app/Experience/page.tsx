'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Linkedin, Menu, Github, Mail } from "lucide-react"
import MobileNavigation from "@/components/mobile-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SectionHeading from "@/components/ui/section-heading"
import Timeline from "@/components/ui/timeline"
import Confetti from 'react-confetti'
import { useState } from "react"

export default function Experience() {
  const [showConfetti, setShowConfetti] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-2 sm:p-4 md:p-8">
      {/* Glassmorphic container */}
      <div className="w-full max-w-7xl mx-auto backdrop-blur-xl bg-white/30 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Header */}
        <header className="border-b-4 border-black p-4 sm:p-6 bg-white/40 backdrop-blur-md">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Portfolio</h1>

            {/* Mobile menu */}
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl border-2 border-black">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="border-r-4 border-black p-0">
                  <MobileNavigation />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href="/ParthSachdeva_CV_22.pdf"
                download
                className="bg-black hover:bg-black/80 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2"
                onClick={() => setShowConfetti(true)}
              >
                Download CV
              </a>
            </div>
          </div>
        </header>

        {showConfetti && <Confetti recycle={false} numberOfPieces={500} onConfettiComplete={() => setShowConfetti(false)} />}

        <div className="grid md:grid-cols-[280px_1fr] h-[calc(100vh-6rem)]">
          {/* Sidebar - Desktop only */}
          <div className="hidden md:block border-r-4 border-black bg-white/40 p-4">
            <nav className="space-y-2">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl">
                Home
              </Link>
              <Link href="/Experience" className="flex items-center gap-2 text-lg font-bold p-3 bg-black text-white rounded-xl">
                Work Experience
              </Link>
              <Link href="/Projects" className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl">
                Projects
              </Link>
              <Link href="/Skills" className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl">
                Skills
              </Link>
            </nav>

            <div className="mt-8">
              <h2 className="text-xl font-black mb-4">CONNECT</h2>
              <div className="space-y-2">
                <a href="https://github.com/P-Sach" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold"
                  >
                    <Github className="h-5 w-5" /> Github
                  </Button>
                </a>
                <a href="https://linkedin.com/in/parthsachdeva" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold"
                  >
                    <Linkedin className="h-5 w-5" /> LinkedIn
                  </Button>
                </a>
                <a href="mailto:parthsachdeva10@gmail.com">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold"
                  >
                    <Mail className="h-5 w-5" /> Mail
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="overflow-auto p-4 sm:p-6">
            <section className="py-16 relative">
              <div className="absolute inset-0 z-0">
                <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
              </div>

              <div className="container relative z-10">
                <SectionHeading title="Work Experience" subtitle="My professional journey" />

                <div className="mt-16">
                  <Timeline />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 