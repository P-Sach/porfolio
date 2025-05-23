"use client"

import React, { useState } from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import { Icon, Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface ProjectData {
  title: string;
  description: string;
  color: string; // Tailwind class for background color
  icon: string; // Name of lucide-react icon
  link?: string; // Primary Project link (optional now)
  technologies?: string[];
  features?: string[];
  codeLink?: string;
  demoLink?: string;
  learnMoreLink?: string;
}

const projects: ProjectData[] = [
  {
    title: "AnonShare",
    description: "A privacy-focused file sharing platform enabling anonymous transfers with time-limited links and QR code access",
    color: "bg-gradient-to-br from-indigo-500 to-purple-500",
    icon: "Share2",
    link: "#", // Optional primary link
    technologies: ["Redis", "MongoDB", "Node.js", "Express.js","React.js","Vite"],
    features: ["Anonymous file transfers",
      "Time-limited access links",
      "QR code access",
      "Secure temporary storage"],
    codeLink: "#",
    demoLink: "#",
    learnMoreLink: "#",
  },
  {
    title: "LocShare (WIP)",
    description: "Local network sharing mode with password protection for secure peer-to-peer transfers.(Its a Sub-Part of AnonShare)",
    color: "bg-gradient-to-br from-blue-500 to-cyan-500",
    icon: "Network",
    link: "#",
    technologies: ["WebRTC", "Node.js", "React","Express.js"],
    features: ["Local network file sharing",
      "Password protection",
      "Peer-to-peer transfers",
      "No external server dependency"],
    codeLink: "#",
    demoLink: "#",
    learnMoreLink: "#",
  },
  {
    title: "Let's Talk",
    description: "Open-source Python library to simplify LLM integration for game NPCs with RAG implementation",
    color: "bg-gradient-to-br from-green-500 to-teal-500",
    icon: "MessageSquare",
    link: "#",
    technologies: ["Python", "LLM", "RAG", "HuggingFace"],
    features: ["Simplified LLM integration for games",
      "Retrieve and use in-game context",
      "NPC memory of past events",
      "Dynamic world state responses"],
    codeLink: "#",
    demoLink: "#",
    learnMoreLink: "#",
  },
  {
    title: "Pricey",
    description: "AI-enabled chatbot providing current market prices of groceries in India",
    color: "bg-gradient-to-br from-orange-500 to-red-500",
    icon: "ShoppingCart",
    link: "#",
    technologies: ["Python", "AI", "Chatbot", "Web Scraping"],
    features: ["Real-time grocery price tracking",
      "Natural language interface",
      "Market data analysis",
      "India-specific pricing"],
    codeLink: "#",
    demoLink: "#",
    learnMoreLink: "#",
  },
];

const initialVisibleTechCount = 3; // Number of technologies to show when collapsed

const IconComponent = ({ name, color }: { name: string; color: string }) => {
  const LucideIcon = Icon[name as keyof typeof Icon] as React.ElementType;
  return LucideIcon ? <LucideIcon className={`h-8 w-8 ${color}`} /> : null;
};

export default function ProjectSelector() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 items-start">
      {projects.map((project, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden border-2 border-black cursor-pointer"
          onClick={() => handleToggleExpand(index)}
        >
          {/* Always visible content */}
          <div className={`${project.color} p-6 flex items-center justify-between`}>
            {/* Icon and Title */}
            <div className="flex items-center space-x-4">
              <IconComponent name={project.icon} color="text-white" />
              <h3 className="text-white text-xl font-bold">{project.title}</h3>
            </div>
            {/* Expand/Collapse Icon */}
            <motion.div
              animate={{ rotate: expandedIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-6 w-6 text-white" />
            </motion.div>
          </div>
          <div className="bg-white p-6 flex flex-col justify-between">
            {/* Description */}
            <p className="text-muted-foreground text-sm mb-4">{project.description}</p>

            {/* Initially visible technologies and toggle indicator */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, initialVisibleTechCount).map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-200 rounded-full text-sm font-medium text-gray-700">
                    {tech}
                  </span>
                ))}
                {project.technologies.length > initialVisibleTechCount && expandedIndex !== index && (
                  <span className="px-3 py-1 bg-gray-200 rounded-full text-sm font-medium text-gray-700">
                    +{project.technologies.length - initialVisibleTechCount} more
                  </span>
                )}
              </div>
            )}

            {/* Collapsible content */}
            {expandedIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0, maxHeight: 0, padding: 0 }}
                animate={{ opacity: 1, height: 'auto', maxHeight: '1000px', padding: 'revert' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {/* Remaining Technologies when expanded */}
                {project.technologies && project.technologies.length > initialVisibleTechCount && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(initialVisibleTechCount).map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-200 rounded-full text-sm font-medium text-gray-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Key Features */}
                {project.features && project.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-lg font-bold mb-2">Key Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                      {project.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {project.codeLink && (
                    <Link href={project.codeLink} passHref legacyBehavior>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 bg-black text-white rounded-md text-sm font-medium"
                      >
                        <Github className="h-4 w-4 mr-2" /> Code
                      </motion.a>
                    </Link>
                  )}
                  {project.demoLink && (
                    <Link href={project.demoLink} passHref legacyBehavior>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" /> Demo
                      </motion.a>
                    </Link>
                  )}
                  {project.learnMoreLink && (
                    <Link href={project.learnMoreLink} passHref legacyBehavior>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center px-4 py-2 bg-white border border-black rounded-md text-sm font-medium text-black"
                      >
                        Learn More
                      </motion.a>
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
