'use client'
import Link from "next/link"
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic';
import { Linkedin, Menu, Plus, Github, Mail, Instagram, Twitter } from "lucide-react"
import MobileNavigation from "@/components/mobile-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Confetti from 'react-confetti';
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import Image from "next/image";

const GlobeComponent = dynamic(() => import('@/components/globe-marker'), { ssr: false });

// Search content database
const searchContent = [
  // Skills
  { title: "React", category: "Skills", url: "/Skills", keywords: ["react", "frontend", "javascript", "ui", "component"] },
  { title: "Next.js", category: "Skills", url: "/Skills", keywords: ["nextjs", "next", "react", "framework", "ssr"] },
  { title: "TypeScript", category: "Skills", url: "/Skills", keywords: ["typescript", "ts", "javascript", "type", "programming"] },
  { title: "Node.js", category: "Skills", url: "/Skills", keywords: ["nodejs", "node", "backend", "javascript", "server"] },
  { title: "PostgreSQL", category: "Skills", url: "/Skills", keywords: ["postgresql", "postgres", "sql", "database", "db"] },
  { title: "MongoDB", category: "Skills", url: "/Skills", keywords: ["mongodb", "mongo", "nosql", "database", "db"] },
  { title: "Python", category: "Skills", url: "/Skills", keywords: ["python", "programming", "backend", "ai", "ml"] },
  { title: "AI/ML", category: "Skills", url: "/Skills", keywords: ["ai", "ml", "artificial intelligence", "machine learning", "rag"] },
  { title: "Blockchain", category: "Skills", url: "/Skills", keywords: ["blockchain", "crypto", "web3", "smart contract"] },
  { title: "GIS", category: "Skills", url: "/Skills", keywords: ["gis", "geospatial", "maps", "location"] },
  
  // Sections
  { title: "Work Experience", category: "Section", url: "/Experience", keywords: ["work", "experience", "jobs", "career", "employment"] },
  { title: "Projects", category: "Section", url: "/Projects", keywords: ["projects", "portfolio", "work", "development"] },
  { title: "Skills", category: "Section", url: "/Skills", keywords: ["skills", "technologies", "tech stack", "expertise"] },
  
  // About
  { title: "About Me", category: "About", url: "/", keywords: ["about", "bio", "information", "contact", "location", "gurgaon", "india"] },
  { title: "Contact", category: "Contact", url: "/", keywords: ["contact", "email", "github", "linkedin", "social"] },
];

export default function Dashboard() {
  const [text, setText] = useState<string>("");
  const fullText = "Software Developer";
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealed, setRevealed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Virtual keyboard key listeners
  useEffect(() => {
    if (!showKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const { key, code } = e;
      
      setActiveKeys((prev) => new Set(prev).add(code));

      if (key === "Escape") {
        setShowKeyboard(false);
      } else if (key === "Backspace") {
        e.preventDefault();
        setSearchQuery((prev) => prev.slice(0, -1));
      } else if (key === "Enter") {
        e.preventDefault();
        // Keep keyboard open, just show results
      } else if (key.length === 1) {
        e.preventDefault();
        setSearchQuery((prev) => prev + key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(e.code);
        return newSet;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [showKeyboard]);

  // Filter search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return searchContent
      .filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.keywords.some(keyword => keyword.includes(query))
      )
      .slice(0, 5); // Limit to 5 results
  }, [searchQuery]);

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
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onFocus={() => setShowSearchResults(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setShowSearchResults(false);
                      setSearchQuery("");
                    }
                  }}
                  className="pl-10 pr-12 py-2 rounded-xl border-2 border-black font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-64"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                
                {/* Virtual Keyboard Toggle Button */}
                <button
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-purple-600 transition-colors"
                  title="Toggle virtual keyboard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </button>
                
                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {showSearchResults && searchQuery.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 w-full bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50"
                    >
                      {searchResults.length > 0 ? (
                        <div className="max-h-80 overflow-y-auto">
                          {searchResults.map((result, index) => (
                            <Link
                              key={index}
                              href={result.url}
                              onClick={() => {
                                setShowSearchResults(false);
                                setSearchQuery("");
                              }}
                              className="block p-3 hover:bg-purple-50 border-b border-gray-200 last:border-b-0 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-bold text-black">{result.title}</div>
                                  <div className="text-sm text-gray-600">{result.category}</div>
                                </div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No results found for "{searchQuery}"
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                <a href="https://github.com/P-Sach" target="_blank" rel="noopener noreferrer" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold"
                  >
                    <Github className="h-5 w-5" /> Github
                  </Button>
                </a>
                <a href="https://linkedin.com/in/parthsachdeva" target="_blank" rel="noopener noreferrer" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold"
                  >
                    <Linkedin className="h-5 w-5" /> LinkedIn
                  </Button>
                </a>
                <a href="mailto:parthsachdeva10@gmail.com" className="block">
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
              
              {/* Photo Frame with Canvas Reveal Effect */}
              <div className="flex flex-col items-center gap-4 relative">
                {/* Neobrutalist Arrow - Only visible when photo is hidden and on desktop */}
                <AnimatePresence>
                  {!revealed && (
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
                    >
                      {/* Shadow/Offset Path - The swirl */}
                      <motion.path
                        d="M 30 20 Q 80 40, 100 80 Q 120 120, 90 160 Q 60 190, 130 220"
                        stroke="#9333ea"
                        strokeWidth="7"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                      {/* Main Path - The swirl */}
                      <motion.path
                        d="M 25 15 Q 75 35, 95 75 Q 115 115, 85 155 Q 55 185, 125 215"
                        stroke="#000"
                        strokeWidth="7"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />
                      {/* Arrow Head - pointing right and slightly down */}
                      <motion.path
                        d="M 125 215 L 110 210 M 125 215 L 120 225"
                        stroke="#000"
                        strokeWidth="7"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 1.3 }}
                      />
                      {/* Arrow Head Shadow */}
                      <motion.path
                        d="M 130 220 L 115 215 M 130 220 L 125 230"
                        stroke="#9333ea"
                        strokeWidth="7"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 1.3 }}
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>

                <div 
                  className={`relative flex items-center justify-center w-80 h-80 overflow-hidden bg-transparent rounded-full ${!revealed ? 'md:flex hidden' : ''}`}
                >
                  {/* Canvas Effect */}
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
                  
                  {/* Photo on top of animation */}
                  <AnimatePresence>
                    {revealed && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 z-20"
                      >
                        <div className="relative w-full h-full flex items-center justify-center -translate-y-20 -translate-x-8">
                          <Image
                            src="/photo_me-cropped.png"
                            alt="Profile"
                            fill
                            className="object-cover scale-[1.6]"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Click Me Button */}
                <button
                  onClick={() => {
                    console.log('Button clicked, revealed state:', revealed);
                    setRevealed(!revealed);
                  }}
                  className="btn-style5 px-6 py-3 text-lg font-semibold rounded-xl border-2 transition-all duration-300"
                  style={{
                    borderColor: '#000',
                    color: '#000',
                    boxShadow: '0.3em 0.3em 0 #9333ea',
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '-0.3em -0.3em 0 #000';
                    e.currentTarget.style.backgroundColor = '#9333ea';
                    e.currentTarget.style.borderColor = '#000';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0.3em 0.3em 0 #9333ea';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#000';
                    e.currentTarget.style.color = '#000';
                  }}
                >
                  {revealed ? 'Hide' : 'Reveal'}
                </button>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">About Me</h2>
                <p className="text-lg text-muted-foreground">
                  Based in <span className="font-semibold text-primary">Gurgaon, India</span>. Recent Computer Science graduate with strong foundation in software development, backend architecture, and AI/ML integration. Experienced in building scalable web applications and geospatial solutions. I'm open to remote and hybrid roles.
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">Available for work</span>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4">Core Expertise</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/50 rounded-xl border-2 border-black">
                      <h4 className="font-bold mb-2">Product Management</h4>
                      <p className="text-sm text-muted-foreground">PRDs, Roadmaps, Agile, Jira, Notion</p>
                    </div>
                    <div className="p-4 bg-white/50 rounded-xl border-2 border-black">
                      <h4 className="font-bold mb-2">Full-Stack Development</h4>
                      <p className="text-sm text-muted-foreground">React, Next.js, Node.js, Express</p>
                    </div>
                    <div className="p-4 bg-white/50 rounded-xl border-2 border-black">
                      <h4 className="font-bold mb-2">Backend & Databases</h4>
                      <p className="text-sm text-muted-foreground">REST APIs, PostgreSQL, MongoDB, Redis</p>
                    </div>
                    <div className="p-4 bg-white/50 rounded-xl border-2 border-black">
                      <h4 className="font-bold mb-2">Emerging Tech</h4>
                      <p className="text-sm text-muted-foreground">Blockchain, AI/ML, RAG, GIS</p>
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
      
      {/* Virtual Keyboard Modal Overlay */}
      <AnimatePresence>
        {showKeyboard && (
          <>
            {/* Blurred Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKeyboard(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
            />
            
            {/* Keyboard Container */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-0 bottom-0 z-50 p-4 flex flex-col items-center gap-4"
            >
              {/* Search Display with Results */}
              <div className="bg-white border-4 border-black rounded-2xl p-4 w-full max-w-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">Search Query:</div>
                    <div className="text-2xl font-bold min-h-[2rem]">{searchQuery || "Type something..."}</div>
                  </div>
                  <button
                    onClick={() => setShowKeyboard(false)}
                    className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(147,51,234,1)]"
                  >
                    Close
                  </button>
                </div>
                
                {/* Search Results in Keyboard Modal */}
                {searchQuery.trim() && searchResults.length > 0 && (
                  <div className="mt-4 border-t-2 border-gray-200 pt-4">
                    <div className="text-sm font-bold text-gray-600 mb-2">Search Results:</div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <Link
                          key={index}
                          href={result.url}
                          onClick={() => {
                            setShowKeyboard(false);
                            setSearchQuery("");
                          }}
                          className="block p-2 hover:bg-purple-50 rounded-lg border border-gray-200 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold text-black text-sm">{result.title}</div>
                              <div className="text-xs text-gray-600">{result.category}</div>
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {searchQuery.trim() && searchResults.length === 0 && (
                  <div className="mt-4 border-t-2 border-gray-200 pt-4 text-center text-gray-500 text-sm">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
              
              {/* Virtual Keyboard */}
              <div className="bg-white border-4 border-black rounded-2xl p-6 w-full max-w-6xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="space-y-2">
                  {/* Row 1 - Numbers */}
                  <div className="flex gap-1 justify-center">
                    {[
                      { key: "Esc", code: "Escape", color: "bg-red-500" },
                      { key: "1", code: "Digit1" },
                      { key: "2", code: "Digit2" },
                      { key: "3", code: "Digit3" },
                      { key: "4", code: "Digit4" },
                      { key: "5", code: "Digit5" },
                      { key: "6", code: "Digit6" },
                      { key: "7", code: "Digit7" },
                      { key: "8", code: "Digit8" },
                      { key: "9", code: "Digit9" },
                      { key: "0", code: "Digit0" },
                      { key: "-", code: "Minus" },
                      { key: "=", code: "Equal" },
                      { key: "Bksp", code: "Backspace", wide: true, color: "bg-blue-500" },
                    ].map(({ key, code, wide, color }) => (
                      <button
                        key={code}
                        onClick={() => {
                          if (code === "Backspace") setSearchQuery(prev => prev.slice(0, -1));
                          else if (code === "Escape") setShowKeyboard(false);
                          else setSearchQuery(prev => prev + key);
                        }}
                        className={`${wide ? "w-20" : "w-12"} h-12 ${activeKeys.has(code) ? "bg-white text-black translate-y-1" : color || "bg-black text-white"} font-bold border-2 ${activeKeys.has(code) ? "border-black" : "border-white"} rounded-lg hover:bg-gray-800 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] text-xs`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                  
                  {/* Row 2 - QWERTY */}
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={() => setSearchQuery(prev => prev + "\t")}
                      className={`w-16 h-12 ${activeKeys.has("Tab") ? "bg-white text-black translate-y-1" : "bg-black text-white"} font-bold border-2 ${activeKeys.has("Tab") ? "border-black" : "border-white"} rounded-lg hover:bg-gray-800 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] text-xs`}
                    >
                      Tab
                    </button>
                    {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((key) => (
                      <button
                        key={key}
                        onClick={() => setSearchQuery(prev => prev + key)}
                        className={`w-12 h-12 ${activeKeys.has(`Key${key}`) ? "bg-white text-black translate-y-1" : "bg-black text-white"} font-bold border-2 ${activeKeys.has(`Key${key}`) ? "border-black" : "border-white"} rounded-lg hover:bg-gray-800 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)]`}
                      >
                        {key}
                      </button>
                    ))}
                    {["[", "]", "\\"].map((key, idx) => (
                      <button
                        key={key}
                        onClick={() => setSearchQuery(prev => prev + key)}
                        className={`w-12 h-12 ${activeKeys.has(["BracketLeft", "BracketRight", "Backslash"][idx]) ? "bg-white text-black translate-y-1" : "bg-black text-white"} font-bold border-2 ${activeKeys.has(["BracketLeft", "BracketRight", "Backslash"][idx]) ? "border-black" : "border-white"} rounded-lg hover:bg-gray-800 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)]`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                  
                  {/* Row 3 - ASDF */}
                  <div className="flex gap-1 justify-center">
                    <button
                      className={`w-20 h-12 ${activeKeys.has("CapsLock") ? "bg-white text-black translate-y-1" : "bg-black text-white"} font-bold border-2 ${activeKeys.has("CapsLock") ? "border-black" : "border-white"} rounded-lg hover:bg-gray-800 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] text-xs`}
                    >
                      Caps
                    </button>
                    {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((key) => (
                      <button
                        key={key}
                        onClick={() => setSearchQuery(prev => prev + key)}
                        className={`w-12 h-12 ${activeKeys.has(`Key${key}`) ? "bg-white text-black translate-y-1" : "bg-black text-white"} font-bold border-2 ${activeKeys.has(`Key${key}`) ? "border-black" : "border-white"} rounded-lg hover:bg-gray-800 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)]`}
                      >
                        {key}
                      </button>
                    ))}
                    {[";", "'"].map((key, idx) => (
                      <button
                        key={key}
                        onClick={() => setSearchQuery(prev => prev + key)}
                        className={`w-12 h-12 ${activeKeys.has(["Semicolon", "Quote"][idx]) ? "bg-white text-black translate-y-1" : "bg-black text-white"} font-bold border-2 ${activeKeys.has(["Semicolon", "Quote"][idx]) ? "border-black" : "border-white"} rounded-lg hover:bg-gray-800 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)]`}
                      >
                        {key}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowKeyboard(false)}
                      className={`w-24 h-12 ${activeKeys.has("Enter") ? "bg-white text-green-600 translate-y-1" : "bg-green-500 text-white"} font-bold border-2 ${activeKeys.has("Enter") ? "border-black" : "border-white"} rounded-lg hover:bg-green-600 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] text-xs`}
                    >
                      Enter
                    </button>
                  </div>
                  
                  {/* Row 4 - ZXCV */}
                  <div className="flex gap-1 justify-center">
                    <button
                      className={`w-24 h-12 ${activeKeys.has("ShiftLeft") ? "bg-white text-black translate-y-1" : "bg-gray-600 text-white"} font-bold border-2 ${activeKeys.has("ShiftLeft") ? "border-black" : "border-white"} rounded-lg hover:bg-gray-700 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] text-xs`}
                    >
                      Shift
                    </button>
                    {["Z", "X", "C", "V", "B", "N", "M"].map((key) => (
                      <button
                        key={key}
                        onClick={() => setSearchQuery(prev => prev + key)}
                        className={`w-12 h-12 ${activeKeys.has(`Key${key}`) ? "bg-white text-black translate-y-1" : "bg-black text-white"} font-bold border-2 ${activeKeys.has(`Key${key}`) ? "border-black" : "border-white"} rounded-lg hover:bg-gray-800 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)]`}
                      >
                        {key}
                      </button>
                    ))}
                    {[",", ".", "/"].map((key, idx) => (
                      <button
                        key={key}
                        onClick={() => setSearchQuery(prev => prev + key)}
                        className={`w-12 h-12 ${activeKeys.has(["Comma", "Period", "Slash"][idx]) ? "bg-white text-black translate-y-1" : "bg-black text-white"} font-bold border-2 ${activeKeys.has(["Comma", "Period", "Slash"][idx]) ? "border-black" : "border-white"} rounded-lg hover:bg-gray-800 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)]`}
                      >
                        {key}
                      </button>
                    ))}
                    <button
                      className={`w-28 h-12 ${activeKeys.has("ShiftRight") ? "bg-white text-black translate-y-1" : "bg-gray-600 text-white"} font-bold border-2 ${activeKeys.has("ShiftRight") ? "border-black" : "border-white"} rounded-lg hover:bg-gray-700 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] text-xs`}
                    >
                      Shift
                    </button>
                  </div>
                  
                  {/* Row 5 - Bottom row */}
                  <div className="flex gap-1 justify-center">
                    <button
                      className={`w-16 h-12 ${activeKeys.has("ControlLeft") ? "bg-white text-black translate-y-1" : "bg-gray-300 text-black"} font-bold border-2 ${activeKeys.has("ControlLeft") ? "border-black" : "border-gray-400"} rounded-lg hover:bg-gray-400 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] text-xs`}
                    >
                      Ctrl
                    </button>
                    <button
                      className={`w-16 h-12 ${activeKeys.has("MetaLeft") ? "bg-white text-black translate-y-1" : "bg-gray-300 text-black"} font-bold border-2 ${activeKeys.has("MetaLeft") ? "border-black" : "border-gray-400"} rounded-lg hover:bg-gray-400 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] text-xs`}
                    >
                      Win
                    </button>
                    <button
                      className={`w-16 h-12 ${activeKeys.has("AltLeft") ? "bg-white text-black translate-y-1" : "bg-gray-300 text-black"} font-bold border-2 ${activeKeys.has("AltLeft") ? "border-black" : "border-gray-400"} rounded-lg hover:bg-gray-400 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] text-xs`}
                    >
                      Alt
                    </button>
                    <button
                      onClick={() => setSearchQuery(prev => prev + " ")}
                      className={`flex-1 h-12 ${activeKeys.has("Space") ? "bg-white text-black translate-y-1 border-black" : "bg-gray-200 text-black border-gray-400"} font-bold border-2 rounded-lg hover:bg-gray-300 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] text-xs`}
                    >
                      SPACE
                    </button>
                    <button
                      className={`w-16 h-12 ${activeKeys.has("AltRight") ? "bg-white text-black translate-y-1" : "bg-gray-300 text-black"} font-bold border-2 ${activeKeys.has("AltRight") ? "border-black" : "border-gray-400"} rounded-lg hover:bg-gray-400 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] text-xs`}
                    >
                      Alt
                    </button>
                    <button
                      className={`w-16 h-12 ${activeKeys.has("ControlRight") ? "bg-white text-black translate-y-1" : "bg-gray-300 text-black"} font-bold border-2 ${activeKeys.has("ControlRight") ? "border-black" : "border-gray-400"} rounded-lg hover:bg-gray-400 active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] text-xs`}
                    >
                      Ctrl
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
