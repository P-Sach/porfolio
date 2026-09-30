"use client"

import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, Keyboard, Search } from "lucide-react"
import SiteShell from "@/components/site-shell"
import VirtualKeyboard from "@/components/virtual-keyboard"
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"
import { searchItems, type SearchItem } from "@/lib/content/search"
import type { Profile } from "@/lib/content/schema"

const GlobeComponent = dynamic(() => import("@/components/globe-marker"), { ssr: false })

const DEFAULT_PHOTO = "/photo_me-cropped.png"

interface HomeClientProps {
  profile: Profile
  /** Uploaded profile photo URL, or null to use the bundled cropped photo. */
  photoUrl: string | null
  searchIndex: SearchItem[]
}

function RevealArrow() {
  const draw = { initial: { pathLength: 0 }, animate: { pathLength: 1 } }
  return (
    <motion.svg
      initial={{ opacity: 0, pathLength: 0 }}
      animate={{ opacity: 1, pathLength: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="hidden md:block absolute -left-20 top-32 z-30 pointer-events-none"
      width="250"
      height="250"
      viewBox="0 0 250 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <motion.path {...draw} transition={{ duration: 1.5, ease: "easeInOut" }} d="M 30 20 Q 80 40, 100 80 Q 120 120, 90 160 Q 60 190, 130 220" stroke="#9333ea" strokeWidth="7" strokeLinecap="round" fill="none" />
      <motion.path {...draw} transition={{ duration: 1.5, ease: "easeInOut" }} d="M 25 15 Q 75 35, 95 75 Q 115 115, 85 155 Q 55 185, 125 215" stroke="#000" strokeWidth="7" strokeLinecap="round" fill="none" />
      <motion.path {...draw} transition={{ duration: 0.3, delay: 1.3 }} d="M 125 215 L 110 210 M 125 215 L 120 225" stroke="#000" strokeWidth="7" strokeLinecap="round" />
      <motion.path {...draw} transition={{ duration: 0.3, delay: 1.3 }} d="M 130 220 L 115 215 M 130 220 L 125 230" stroke="#9333ea" strokeWidth="7" strokeLinecap="round" />
    </motion.svg>
  )
}

export default function HomeClient({ profile, photoUrl, searchIndex }: HomeClientProps) {
  const [typed, setTyped] = useState("")
  const [revealed, setRevealed] = useState(true)
  const [query, setQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => searchItems(searchIndex, query), [searchIndex, query])
  const closeKeyboard = useCallback(() => setShowKeyboard(false), [])

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowResults(false)
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [])

  useEffect(() => {
    setTyped("")
    let i = 0
    const timer = setInterval(() => {
      i++
      setTyped(profile.title.substring(0, i))
      if (i >= profile.title.length) clearInterval(timer)
    }, 100)
    return () => clearInterval(timer)
  }, [profile.title])

  const searchBox = (
    <div className="relative" ref={searchRef}>
      <input
        type="text"
        placeholder="Search..."
        aria-label="Search the site"
        value={query}
        onFocus={() => setShowResults(true)}
        onChange={(e) => {
          setQuery(e.target.value)
          setShowResults(true)
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setShowResults(false)
            setQuery("")
          }
        }}
        className="pl-10 pr-12 py-2 rounded-xl border-2 border-black font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-64"
      />
      <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
      <button
        onClick={() => setShowKeyboard((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-purple-600 transition-colors"
        title="Toggle virtual keyboard"
        aria-label="Toggle virtual keyboard"
      >
        <Keyboard className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {showResults && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50"
          >
            {results.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {results.map((result) => (
                  <Link
                    key={`${result.category}-${result.title}`}
                    href={result.url}
                    onClick={() => {
                      setShowResults(false)
                      setQuery("")
                    }}
                    className="block p-3 hover:bg-purple-50 border-b border-gray-200 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-black">{result.title}</div>
                        <div className="text-sm text-gray-600">{result.category}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">No results found for &quot;{query}&quot;</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <>
      <SiteShell active="home" socials={profile.socials} showResume={profile.showResume} headerExtra={searchBox}>
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Hi, I&apos;m <span className="text-primary">{profile.name}</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground mb-6">
                <span className="text-foreground">{typed}</span>
                <span className="animate-blink">|</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">{profile.tagline}</p>
            </motion.div>

            <div className="flex flex-col items-center gap-4 relative">
              <AnimatePresence>{!revealed && <RevealArrow />}</AnimatePresence>

              <div
                className={`relative flex items-center justify-center w-80 h-80 overflow-hidden bg-transparent rounded-full ${
                  !revealed ? "md:flex hidden" : ""
                }`}
              >
                <AnimatePresence>
                  {revealed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 z-10 pointer-events-none"
                    >
                      <CanvasRevealEffect
                        animationSpeed={0.95}
                        containerClassName="bg-transparent"
                        colors={[[125, 211, 252]]}
                        dotSize={3}
                        showGradient={true}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {revealed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 z-20"
                    >
                      {photoUrl ? (
                        <div className="relative w-full h-full">
                          <Image src={photoUrl} alt={`${profile.name}`} fill className="object-cover" />
                        </div>
                      ) : (
                        // The bundled photo is a tall crop, offset/zoomed to centre the face.
                        <div className="relative w-full h-full flex items-center justify-center -translate-y-20 -translate-x-8">
                          <Image src={DEFAULT_PHOTO} alt={`${profile.name}`} fill className="object-cover scale-[1.6]" />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setRevealed((v) => !v)}
                className="px-6 py-3 text-lg font-semibold rounded-xl border-2 border-black text-black bg-transparent shadow-[0.3em_0.3em_0_#9333ea] hover:shadow-[-0.3em_-0.3em_0_#000] hover:bg-purple-600 hover:text-white transition-all duration-300"
              >
                {revealed ? "Hide" : "Reveal"}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">About Me</h2>
              <p className="text-lg text-muted-foreground">
                Based in <span className="font-semibold text-primary">{profile.location}</span>. {profile.about}
              </p>
              {profile.available && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">{profile.availableText}</span>
                </div>
              )}

              {profile.expertise.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4">Core Expertise</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {profile.expertise.map((item, i) => (
                      <div key={i} className="p-4 bg-white/50 rounded-xl border-2 border-black">
                        <h4 className="font-bold mb-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative h-[400px]">
              <GlobeComponent />
            </div>
          </div>
        </div>
      </SiteShell>

      <VirtualKeyboard open={showKeyboard} onClose={closeKeyboard} query={query} setQuery={setQuery} results={results} />
    </>
  )
}
