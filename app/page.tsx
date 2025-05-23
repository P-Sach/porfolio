'use client'
import Link from "next/link"
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic';
import { Linkedin, Menu, Plus, Github, Mail, Instagram, Twitter } from "lucide-react"
import MobileNavigation from "@/components/mobile-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Confetti from 'react-confetti';

export default function Dashboard() {
  const [text, setText] = useState<string>("");
  const fullText = "Software Developer";
  const GlobeComponent = dynamic(() => import('@/components/globe-marker'), { ssr: false });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);


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
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Hi, I'm <span className="text-primary">Parth Sachdeva</span>
                </h1>
                <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground mb-6">
                  <span className="text-foreground">{text}</span>
                  <span className="animate-blink">|</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  I enjoy building thoughtful digital solutions using modern technologies, with a focus on usability and clarity.
                </p>
              </motion.div>
            </div>
          </div>
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">About Me</h2>
                <p className="text-lg text-muted-foreground">
                  Based in <span className="font-semibold text-primary">Gurgaon, India</span>. I'm open to remote and hybrid roles.
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">Available for work</span>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4">Core Expertise</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/50 rounded-xl border-2 border-black">
                      <h4 className="font-bold mb-2">Frontend Development</h4>
                      <p className="text-sm text-muted-foreground">React, Next.js, TypeScript</p>
                    </div>
                    <div className="p-4 bg-white/50 rounded-xl border-2 border-black">
                      <h4 className="font-bold mb-2">Dev Tools</h4>
                      <p className="text-sm text-muted-foreground">Git, Postman, VSCode</p>
                    </div>
                    <div className="p-4 bg-white/50 rounded-xl border-2 border-black">
                      <h4 className="font-bold mb-2">Backend</h4>
                      <p className="text-sm text-muted-foreground">Node.js, Express, FastApi</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px]">
                <GlobeComponent />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
