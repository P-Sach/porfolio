"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { SearchItem } from "@/lib/content/search"

type Variant = "dark" | "red" | "blue" | "green" | "gray" | "light" | "space"
type Action = "char" | "backspace" | "close" | "none"

interface KeyDef {
  label: string
  code: string
  width?: string
  variant?: Variant
  action?: Action
}

const IDLE: Record<Variant, string> = {
  dark: "bg-black text-white border-white hover:bg-gray-800",
  red: "bg-red-500 text-white border-white hover:bg-gray-800",
  blue: "bg-blue-500 text-white border-white hover:bg-gray-800",
  green: "bg-green-500 text-white border-white hover:bg-green-600",
  gray: "bg-gray-600 text-white border-white hover:bg-gray-700",
  light: "bg-gray-300 text-black border-gray-400 hover:bg-gray-400",
  space: "bg-gray-200 text-black border-gray-400 hover:bg-gray-300",
}
const PRESSED = "bg-white text-black translate-y-1 border-black"

const chars = (labels: string[], codes?: string[]): KeyDef[] =>
  labels.map((label, i) => ({
    label,
    code: codes?.[i] ?? (/\d/.test(label) ? `Digit${label}` : `Key${label}`),
  }))

const ROWS: KeyDef[][] = [
  [
    { label: "Esc", code: "Escape", variant: "red", action: "close" },
    ...chars(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="], [
      "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal",
    ]),
    { label: "Bksp", code: "Backspace", width: "w-20", variant: "blue", action: "backspace" },
  ],
  [
    { label: "Tab", code: "Tab", width: "w-16", action: "none" },
    ...chars(["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]),
    ...chars(["[", "]", "\\"], ["BracketLeft", "BracketRight", "Backslash"]),
  ],
  [
    { label: "Caps", code: "CapsLock", width: "w-20", action: "none" },
    ...chars(["A", "S", "D", "F", "G", "H", "J", "K", "L"]),
    ...chars([";", "'"], ["Semicolon", "Quote"]),
    { label: "Enter", code: "Enter", width: "w-24", variant: "green", action: "close" },
  ],
  [
    { label: "Shift", code: "ShiftLeft", width: "w-24", variant: "gray", action: "none" },
    ...chars(["Z", "X", "C", "V", "B", "N", "M"]),
    ...chars([",", ".", "/"], ["Comma", "Period", "Slash"]),
    { label: "Shift", code: "ShiftRight", width: "w-28", variant: "gray", action: "none" },
  ],
  [
    { label: "Ctrl", code: "ControlLeft", width: "w-16", variant: "light", action: "none" },
    { label: "Win", code: "MetaLeft", width: "w-16", variant: "light", action: "none" },
    { label: "Alt", code: "AltLeft", width: "w-16", variant: "light", action: "none" },
    { label: "SPACE", code: "Space", width: "flex-1", variant: "space", action: "char" },
    { label: "Alt", code: "AltRight", width: "w-16", variant: "light", action: "none" },
    { label: "Ctrl", code: "ControlRight", width: "w-16", variant: "light", action: "none" },
  ],
]

interface VirtualKeyboardProps {
  open: boolean
  onClose: () => void
  query: string
  setQuery: (update: (prev: string) => string) => void
  results: SearchItem[]
}

export default function VirtualKeyboard({ open, onClose, query, setQuery, results }: VirtualKeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())

  // Mirror the physical keyboard into the on-screen one while it's open.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      const { key, code } = e
      setActiveKeys((prev) => new Set(prev).add(code))

      if (key === "Escape") onClose()
      else if (key === "Backspace") {
        e.preventDefault()
        setQuery((prev) => prev.slice(0, -1))
      } else if (key === "Enter") {
        e.preventDefault()
      } else if (key.length === 1) {
        e.preventDefault()
        setQuery((prev) => prev + key)
      }
    }
    const onKeyUp = (e: KeyboardEvent) =>
      setActiveKeys((prev) => {
        const next = new Set(prev)
        next.delete(e.code)
        return next
      })

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [open, onClose, setQuery])

  const press = (key: KeyDef) => {
    const action = key.action ?? "char"
    if (action === "backspace") setQuery((prev) => prev.slice(0, -1))
    else if (action === "close") onClose()
    else if (action === "char") setQuery((prev) => prev + (key.code === "Space" ? " " : key.label))
  }

  const pickResult = () => {
    setQuery(() => "")
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
          />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 z-50 p-4 flex flex-col items-center gap-4"
          >
            <div className="bg-white border-4 border-black rounded-2xl p-4 w-full max-w-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">Search Query:</div>
                  <div className="text-2xl font-bold min-h-[2rem]">{query || "Type something..."}</div>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(147,51,234,1)]"
                >
                  Close
                </button>
              </div>

              {query.trim() && results.length > 0 && (
                <div className="mt-4 border-t-2 border-gray-200 pt-4">
                  <div className="text-sm font-bold text-gray-600 mb-2">Search Results:</div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {results.map((result) => (
                      <Link
                        key={`${result.category}-${result.title}`}
                        href={result.url}
                        onClick={pickResult}
                        className="block p-2 hover:bg-purple-50 rounded-lg border border-gray-200 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-black text-sm">{result.title}</div>
                            <div className="text-xs text-gray-600">{result.category}</div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {query.trim() && results.length === 0 && (
                <div className="mt-4 border-t-2 border-gray-200 pt-4 text-center text-gray-500 text-sm">
                  No results found for &quot;{query}&quot;
                </div>
              )}
            </div>

            <div className="bg-white border-4 border-black rounded-2xl p-6 w-full max-w-6xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="space-y-2">
                {ROWS.map((row, r) => (
                  <div key={r} className="flex gap-1 justify-center">
                    {row.map((key) => (
                      <button
                        key={key.code}
                        onClick={() => press(key)}
                        className={`${key.width ?? "w-12"} h-12 font-bold border-2 rounded-lg active:translate-y-1 transition-all shadow-[2px_2px_0px_0px_rgba(147,51,234,1)] ${
                          key.label.length > 1 ? "text-xs" : ""
                        } ${activeKeys.has(key.code) ? PRESSED : IDLE[key.variant ?? "dark"]}`}
                      >
                        {key.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
