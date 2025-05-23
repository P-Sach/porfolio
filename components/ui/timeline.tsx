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
    company: "Knowledge Spatial",
    role: "Software Development Intern",
    duration: "May 2024 - August 2024",
    location: "Gurgaon, India",
    description: [
      "Assisted in development of scripts to automate the processing of geospatial data, converting files into Cloud Optimized GeoTIFF (COG) format.",
      "Worked on map synchronization using OpenLayers, ensuring accurate real-time map updates for multi-view GIS applications.",
      "Integrated PostgreSQL for data logging and developed database integration scripts to maintain real-time logging and data integrity."
    ],
    technologies: ["Python", "OpenLayers", "PostgreSQL", "GIS", "HTML", "CSS", "JavaScript", "Node.js","Flask","express.js"]
  },
  {
    company: "RightChoice.AI",
    role: "Software Development Intern",
    duration: "June 2023 - August 2022",
    location: "Gurgaon, India",
    description: [
      "Collaborated with marketing and sales teams to enhance the Local Keywords Finder tool based on user feedback.",
      "Supported improvement of tools for managing local online presence through collaborative development."
    ],
    technologies: ["Python","Flask"]
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