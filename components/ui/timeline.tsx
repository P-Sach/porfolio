"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import type { ExperienceItem } from "@/lib/content/schema"

const initialVisibleTechCount = 3

export default function Timeline({ items }: { items: ExperienceItem[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (items.length === 0) {
    return <p className="text-center text-muted-foreground">No experience added yet.</p>
  }

  return (
    <div className="relative">
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-black/10"></div>

      <div className="space-y-12">
        {items.map((exp, index) => (
          <motion.div
            key={`${exp.company}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative"
          >
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>

            <div className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8`}>
              <div className="w-full md:w-1/2">
                <div
                  className="bg-white/50 rounded-xl border-2 border-black p-6 cursor-pointer"
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{exp.role}</h2>
                      <h3 className="text-xl text-primary">{exp.company}</h3>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                      <p className="font-semibold">{exp.duration}</p>
                      <p className="text-muted-foreground">{exp.location}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {exp.technologies.slice(0, initialVisibleTechCount).map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-black/5 rounded-full text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                    {exp.technologies.length > initialVisibleTechCount && expandedIndex !== index && (
                      <span className="px-3 py-1 bg-black/10 rounded-full text-sm font-medium text-primary">
                        +{exp.technologies.length - initialVisibleTechCount} more
                      </span>
                    )}
                  </div>

                  {expandedIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        {exp.description.map((item, i) => (
                          <li key={i} className="text-muted-foreground">
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.slice(initialVisibleTechCount).map((tech, i) => (
                          <span key={i} className="px-3 py-1 bg-black/5 rounded-full text-sm font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
