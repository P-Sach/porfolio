"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ExternalLink, Github } from "lucide-react"
import ProjectIcon from "@/components/project-icon"
import { PROJECT_COLORS } from "@/lib/content/presets"
import type { Project } from "@/lib/content/schema"

const initialVisibleTechCount = 3

const pill = "px-3 py-1 bg-gray-200 rounded-full text-sm font-medium text-gray-700"

export default function ProjectSelector({ projects }: { projects: Project[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (projects.length === 0) {
    return <p className="text-center text-muted-foreground">No projects added yet.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 items-start">
      {projects.map((project, index) => {
        const technologies = project.technologies
        const expanded = expandedIndex === index
        // Link clicks shouldn't also toggle the card.
        const stop = (e: React.MouseEvent) => e.stopPropagation()

        return (
          <motion.div
            key={`${project.title}-${index}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden border-2 border-black cursor-pointer"
            onClick={() => setExpandedIndex(expanded ? null : index)}
          >
            <div className={`${PROJECT_COLORS[project.color]} p-6 flex items-center justify-between`}>
              <div className="flex items-center space-x-4">
                <ProjectIcon name={project.icon} className="h-8 w-8 text-white" />
                <h3 className="text-white text-xl font-bold">{project.title}</h3>
              </div>
              <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="h-6 w-6 text-white" />
              </motion.div>
            </div>

            <div className="bg-white p-6 flex flex-col justify-between">
              <p className="text-muted-foreground text-sm mb-4">{project.description}</p>

              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {technologies.slice(0, initialVisibleTechCount).map((tech, i) => (
                    <span key={i} className={pill}>
                      {tech}
                    </span>
                  ))}
                  {technologies.length > initialVisibleTechCount && !expanded && (
                    <span className={pill}>+{technologies.length - initialVisibleTechCount} more</span>
                  )}
                </div>
              )}

              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {technologies.length > initialVisibleTechCount && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {technologies.slice(initialVisibleTechCount).map((tech, i) => (
                        <span key={i} className={pill}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.features.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-bold mb-2">Key Features:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                        {project.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    {project.codeLink && (
                      <motion.a
                        href={project.codeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={stop}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 bg-black text-white rounded-md text-sm font-medium"
                      >
                        <Github className="h-4 w-4 mr-2" /> Code
                      </motion.a>
                    )}
                    {project.demoLink && (
                      <motion.a
                        href={project.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={stop}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" /> Demo
                      </motion.a>
                    )}
                    {project.learnMoreLink && (
                      <motion.a
                        href={project.learnMoreLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={stop}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 bg-white border border-black rounded-md text-sm font-medium text-black"
                      >
                        Learn More
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
