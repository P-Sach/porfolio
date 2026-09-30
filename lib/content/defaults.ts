import type { SiteContent } from "./schema"

// Seed content. Used when Supabase isn't configured or a section hasn't been
// saved yet, so the public site never renders empty.
export const defaultContent: SiteContent = {
  profile: {
    name: "Parth Sachdeva",
    title: "Software Developer",
    tagline:
      "I enjoy building thoughtful digital solutions using modern technologies, with a focus on usability and clarity.",
    location: "Gurgaon, India",
    about:
      "Recent Computer Science graduate with strong foundation in software development, backend architecture, and AI/ML integration. Experienced in building scalable web applications and geospatial solutions. I'm open to remote and hybrid roles.",
    available: true,
    availableText: "Available for work",
    showResume: true,
    expertise: [
      { title: "Product Management", description: "PRDs, Roadmaps, Agile, Jira, Notion" },
      { title: "Full-Stack Development", description: "React, Next.js, Node.js, Express" },
      { title: "Backend & Databases", description: "REST APIs, PostgreSQL, MongoDB, Redis" },
      { title: "Emerging Tech", description: "Blockchain, AI/ML, RAG, GIS" },
    ],
    socials: {
      github: "https://github.com/P-Sach",
      linkedin: "https://linkedin.com/in/parthsachdeva",
      email: "parthsachdeva10@gmail.com",
    },
  },

  experience: [
    {
      company: "Cars24",
      role: "Ai Program Manager Intern (Product)",
      duration: "Feb 2026 - Current",
      location: "Gurgaon, India",
      description: [
        "Designed LLM-based Customer support chatbot workflows with structured prompts for negotiation, support and ticket handling.",
        "Managed end-to-end chatbot lifecycle, integrating MessageBird and Langfuse for deployment, monitoring and customer-facing support.",
        "Built telemetry-driven auditing pipeline (Snowflake → LLM evaluation) integrated with Power BI dashboards to proactively identify at-risk users and surface migration guidance.",
        "Led cross-functional standups and daily team meetings, conducted sprint reviews to ensure smooth delivery and team alignment.",
        "Automated internal workflows via Power Automate, AppScript and n8n, reducing manual load and standardizing cross-team communication processes.",
      ],
      technologies: ["Product Management", "Excel", "Claude", "Codex", "Power Automate", "PRDs", "Workflows", "Sprint Planning", "MessageBird", "Langfuse", "Snowflake", "Power BI", "AppScript", "n8n"],
    },
    {
      company: "TechCurators",
      role: "Technical Program Manager Intern (Product)",
      duration: "Jun 2025 - Nov 2025",
      location: "Gurgaon, India",
      description: [
        "Drove end-to-end execution for 3+ client projects, aligning product, design, and development teams to deliver high-quality solutions.",
        "Conducted market research and collected user insights to refine product strategy and feature prioritization.",
        "Created product requirement documents (PRDs) and maintained roadmaps using Notion and Jira for effective project tracking.",
        "Led cross-functional standups and daily team meetings, conducted sprint reviews to ensure smooth delivery and team alignment.",
        "Used AI tools (ChatGPT, Notion AI, Perplexity) to enhance documentation, automation, and decision support processes.",
      ],
      technologies: ["Product Management", "Notion", "Jira", "ChatGPT", "Notion AI", "Perplexity", "Agile", "Scrum", "PRDs", "Roadmapping", "Sprint Planning"],
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
        "Developed database integration scripts to maintain real-time logging and ensure data integrity across systems.",
      ],
      technologies: ["Node.js", "Express.js", "React.js", "Python", "OpenLayers", "PostgreSQL", "PostGIS", "REST APIs", "Flask", "JavaScript", "HTML", "CSS", "Git"],
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
        "Supported data analysis efforts to track tool performance and user engagement metrics.",
      ],
      technologies: ["Python", "Product Management", "User Research", "Data Analysis"],
    },
  ],

  projects: [
    {
      title: "Adoptable.in",
      description:
        "Non-profit blockchain-powered pet adoption and welfare platform using NFTs for pet identities, smart contracts for adoption, and tokenized rewards (March 2025 - Present)",
      color: "pink",
      icon: "Heart",
      technologies: ["Blockchain", "NFTs", "Smart Contracts", "Web3", "Solidity", "React.js", "Node.js"],
      features: [
        "Blockchain-powered pet adoption platform",
        "NFT-based pet identity and ownership records",
        "Smart contracts for secure adoption processes",
        "Tokenized rewards system for platform engagement",
        "Non-profit welfare initiative for animal care",
        "Transparent and immutable adoption history",
      ],
      demoLink: "https://adoptable.in/",
    },
    {
      title: "AnonShare",
      description:
        "Led end-to-end development of anonymous file sharing platform with secure peer-to-peer local network transfers (Oct 2024 - Nov 2024)",
      color: "indigo",
      icon: "Share2",
      technologies: ["Node.js", "Express.js", "React.js", "MongoDB", "Redis", "WebRTC", "Vite"],
      features: [
        "Product Leadership: Led end-to-end development of anonymous file sharing platform",
        "Anonymous file transfers with secure temporary storage",
        "Time-limited access links for enhanced security",
        "QR code generation for easy mobile access",
        "Feature Innovation: LocShare for secure peer-to-peer local network transfers with password protection",
        "Peer-to-peer WebRTC transfers with no external server dependency",
      ],
      codeLink: "https://github.com/P-Sach/AnonShare",
      demoLink: "https://anonshare-vaultdrop.vercel.app/",
    },
    {
      title: "Let's Talk",
      description:
        "Open-source Python library simplifying LLM integration for game NPCs using RAG architecture for context-aware conversations",
      color: "green",
      icon: "MessageSquare",
      technologies: ["Python", "LLM", "RAG Architecture", "HuggingFace", "NLP"],
      features: [
        "Simplified LLM integration for game development",
        "RAG implementation for retrieving in-game context",
        "NPC memory of past interactions and events",
        "Dynamic responses based on world state",
        "Easy-to-use API for game developers",
        "Support for multiple LLM providers",
      ],
    },
    {
      title: "Pricey",
      description:
        "AI-powered chatbot providing real-time market prices for groceries across India using web scraping and natural language processing",
      color: "orange",
      icon: "ShoppingCart",
      technologies: ["Python", "AI/ML", "NLP", "Web Scraping", "Chatbot", "REST APIs"],
      features: [
        "Real-time grocery price tracking across multiple retailers",
        "Natural language interface for easy queries",
        "Market data analysis and price trends",
        "Location-based pricing for major Indian cities",
        "Automated data collection and updates",
        "Price comparison and recommendations",
      ],
      codeLink: "https://github.com/P-Sach/Pricey",
    },
    {
      title: "GIS Mapping Application",
      description:
        "Multi-view geospatial application with real-time map synchronization and optimized data processing",
      color: "blue",
      icon: "Map",
      technologies: ["Python", "OpenLayers", "PostgreSQL", "PostGIS", "Cloud-Optimized GeoTIFF", "JavaScript"],
      features: [
        "Real-time map synchronization across multiple views",
        "Cloud-Optimized GeoTIFF (COG) format processing",
        "Efficient geospatial data storage with PostGIS",
        "Optimized database queries for large datasets",
        "Interactive map controls and layers",
        "Automated geospatial data processing workflows",
      ],
    },
  ],

  skills: [
    { title: "Programming Languages", items: ["Python", "PostgreSQL", "JavaScript", "HTML/CSS", "TypeScript", "SQL"] },
    { title: "Developer Tools", items: ["Git", "VS Code", "Postman", "Docker Desktop", "MongoDB", "Replit", "V0", "Cursor", "Windsurf", "Notion", "Jira", "n8n", "Airtable"] },
    { title: "Familiarity with", items: ["PostGIS", "Redis", "MongoDB", "Supabase", "Cloudflare v2", "Trello", "Node.js", "Next.js", "React", "Express.js", "Flask", "FastAPI", "Hugging Face", "Figma", "OpenLayers", "Cloud-Optimized GeoTIFF (COG)", "WebRTC", "RAG Architecture", "REST APIs", "Prompt Engineering", "Power BI", "Agile Methodologies", "CI/CD Pipelines", "Unit Testing", "Integration Testing", "Data Visualization", "Data Analysis"] },
  ],

  assets: { resume: null, photo: null },
}
