'use client';
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TimelineItemData {
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string[];
  technologies: string[];
}

const experiences: TimelineItemData[] = [
  {
    company: "TechCurators",
    role: "Technical Program Manager Intern (Product)",
    duration: "Jun 2025 - Present",
    location: "Gurgaon, India",
    description: [
      "Drove end-to-end execution for 3+ client projects, aligning product, design, and development teams to deliver high-quality solutions.",
      "Conducted market research and collected user insights to refine product strategy and feature prioritization.",
      "Created product requirement documents (PRDs) and maintained roadmaps using Notion and Jira for effective project tracking.",
      "Led cross-functional standups and daily team meetings, conducted sprint reviews to ensure smooth delivery and team alignment.",
      "Used AI tools (ChatGPT, Notion AI, Perplexity) to enhance documentation, automation, and decision support processes."
    ],
    technologies: ["Product Management", "Notion", "Jira", "ChatGPT", "Notion AI", "Perplexity", "Agile", "Scrum", "PRDs", "Roadmapping", "Sprint Planning"]
  },
  {
    company: "Knowledge Spatial",
    role: "Software Development Intern",
    duration: "May 2024 - Aug 2024",
    location: "Gurgaon, India",
    description: [
      "Developed and maintained full-stack web applications using Node.js, Express.js, and React.js, ensuring seamless integration between frontend and backend systems.",
      "Designed and implemented RESTful APIs to support application features and facilitate data exchange between services.",
      "Built scalable server-side applications with optimized database queries for improved performance.",
      "Automated geospatial data processing workflows, converting files into Cloud-Optimized GeoTIFF (COG) format using Python scripts.",
      "Implemented map synchronization features using OpenLayers for multi-view GIS applications with real-time updates.",
      "Integrated PostgreSQL with PostGIS extension for efficient geospatial data storage and querying.",
      "Developed database integration scripts to maintain real-time logging and ensure data integrity across systems."
    ],
    technologies: ["Node.js", "Express.js", "React.js", "Python", "OpenLayers", "PostgreSQL", "PostGIS", "REST APIs", "Flask", "JavaScript", "HTML", "CSS", "Git"]
  },
  {
    company: "RightChoice.AI",
    role: "Product Intern",
    duration: "Jun 2023 - Aug 2023",
    location: "Gurgaon, India",
    description: [
      "Collaborated with cross-functional teams including marketing and sales to enhance the Local Keywords Finder tool based on user feedback and market analysis.",
      "Contributed to product improvement initiatives for tools managing local online presence through collaborative development.",
      "Participated in user research and testing to identify pain points and improvement opportunities.",
      "Supported data analysis efforts to track tool performance and user engagement metrics."
    ],
    technologies: ["Python", "Product Management", "User Research", "Data Analysis"]
  }
];

const initialVisibleTechCount = 3;

export default function Timeline() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-black/10"></div>

      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative"
          >
            {/* Timeline dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>

            <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8`}>
              {/* Content */}
              <div className="w-full md:w-1/2">
                <div className="bg-white/50 rounded-xl border-2 border-black p-6 cursor-pointer" onClick={() => handleToggleExpand(index)}>
                  {/* Always visible content */}
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
                     {/* Initially visible technologies and toggle indicator */}
                    {exp.technologies.slice(0, initialVisibleTechCount).map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-black/5 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {exp.technologies.length > initialVisibleTechCount && expandedIndex !== index && (
                       <span className="px-3 py-1 bg-black/10 rounded-full text-sm font-medium text-primary">
                        +{exp.technologies.length - initialVisibleTechCount} more
                      </span>
                    )}
                  </div>

                  {/* Collapsible content */}
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        {exp.description.map((item, i) => (
                          <li key={i} className="text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                         {/* Remaining technologies when expanded, shown after the initial ones */}
                        {exp.technologies.slice(initialVisibleTechCount).map((tech, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-black/5 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="w-full md:w-1/2"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 
