'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Linkedin, Menu, Github, Mail } from "lucide-react"
import MobileNavigation from "@/components/mobile-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Confetti from 'react-confetti'
import { useState, useEffect, useRef } from "react"
import dynamic from 'next/dynamic'

const FloatingSkillItem = dynamic(() => import('@/components/FloatingSkillItem'), { ssr: false })

const programmingLanguages = ["JavaScript", "TypeScript", "Python", "HTML/CSS", "PostgreSQL"]
const developerTools = ["Git", "MongoDB", "VS Code", "Postman","Replit","V0","Cursor","Windsurf"]
const familiarityWith = ["Redis", "Node.js", "React", "Express.js", "Flask", "FastAPI", "HuggingFace", "PostGIS", "Cloud-Optimized GeoTIFF (COG)", "WebRTC","RAG Architecture"]

export default function Experience() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [progLangDims, setProgLangDims] = useState({ width: 0, height: 0 })
  const [devtoolsDims, setDevtoolsDims] = useState({ width: 0, height: 0 })
  const [familiarityDims, setFamiliarityDims] = useState({ width: 0, height: 0 })

  const progLangRef = useRef<HTMLDivElement | null>(null)
  const devtoolsRef = useRef<HTMLDivElement | null>(null)
  const familiarityRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setIsMounted(true)

    if (progLangRef.current) {
      setProgLangDims({ width: progLangRef.current.offsetWidth, height: progLangRef.current.offsetHeight })
    }
    if (devtoolsRef.current) {
      setDevtoolsDims({ width: devtoolsRef.current.offsetWidth, height: devtoolsRef.current.offsetHeight })
    }
    if (familiarityRef.current) {
      setFamiliarityDims({ width: familiarityRef.current.offsetWidth, height: familiarityRef.current.offsetHeight })
    }
  }, [isMounted])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-2 sm:p-4 md:p-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} onConfettiComplete={() => setShowConfetti(false)} />}
      <div className="w-full max-w-7xl mx-auto backdrop-blur-xl bg-white/30 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <header className="border-b-4 border-black p-4 sm:p-6 bg-white/40 backdrop-blur-md">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Portfolio</h1>
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


        <div className="grid md:grid-cols-[280px_1fr] h-[calc(100vh-6rem)]">
          <div className="hidden md:block border-r-4 border-black bg-white/40 p-4">
            <nav className="space-y-2">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl">Home</Link>
              <Link href="/Experience" className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl">Work Experience</Link>
              <Link href="/Projects" className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl">Projects</Link>
              <Link href="/Skills" className="flex items-center gap-2 text-lg font-bold p-3 bg-black text-white rounded-xl">Skills</Link>
            </nav>
            <div className="mt-8">
              <h2 className="text-xl font-black mb-4">CONNECT</h2>
              <div className="space-y-2">
                <a href="https://github.com/P-Sach" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold"><Github className="h-5 w-5" /> Github</Button>
                </a>
                <a href="https://linkedin.com/in/parthsachdeva" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold"><Linkedin className="h-5 w-5" /> LinkedIn</Button>
                </a>
                <a href="mailto:parthsachdeva10@gmail.com">
                  <Button variant="outline" className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold"><Mail className="h-5 w-5" /> Mail</Button>
                </a>
              </div>
            </div>
          </div>

          <div className="overflow-auto p-4 sm:p-6">
            <div className="space-y-12">
              <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black mb-6">Programming Languages</h2>
                <div
                  ref={progLangRef}
                  className="relative w-full h-[300px] bg-white/50 rounded-xl border-2 border-black"
                >
                  {programmingLanguages.map((lang, index) => (
                    <FloatingSkillItem
                      key={lang}
                      text={lang}
                      containerWidth={progLangDims.width}
                      containerHeight={progLangDims.height}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              {/* Developer Tools Section */}
              <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black mb-6">Developer Tools</h2>
                <div
                  ref={devtoolsRef}
                  className="relative w-full h-[300px] bg-white/50 rounded-xl border-2 border-black"
                >
                  {developerTools.map((tool, index) => (
                    <FloatingSkillItem
                      key={tool}
                      text={tool}
                      containerWidth={devtoolsDims.width}
                      containerHeight={devtoolsDims.height}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              {/* Familiarity With Section */}
              <div className="bg-white/40 backdrop-blur-md p-6 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black mb-6">Familiarity with</h2>
                <div
                  ref={familiarityRef}
                  className="relative w-full h-[300px] bg-white/50 rounded-xl border-2 border-black"
                >
                  {familiarityWith.map((item, index) => (
                    <FloatingSkillItem
                      key={item}
                      text={item}
                      containerWidth={familiarityDims.width}
                      containerHeight={familiarityDims.height}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
