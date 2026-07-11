import { PortfolioData } from './types';

// Strict blank state as requested
export const blankPortfolioData: PortfolioData = {
  settings: {
    name: "Richa Pandey",
    tagline: "Software Engineer & Designer",
    bio: "Welcome to my professional portfolio. This space represents my skills, education, and experiences.",
    avatarUrl: "",
    passcode: "Richa123",
    accentColor: "#1a73e8", // Google Blue
  },
  sections: []
};

// Rich sample data for easy previewing / demonstration
export const samplePortfolioData: PortfolioData = {
  settings: {
    name: "Richa Pandey",
    tagline: "Product Engineer & Tech Enthusiast",
    bio: "Passionate about building highly intuitive, user-centric web applications and system solutions. Specialized in React, TypeScript, and modern engineering practices with a focus on polished UI design.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    passcode: "Richa123",
    accentColor: "#1a73e8", // Google Blue
  },
  sections: [
    {
      id: "sec-skills-1",
      type: "skills",
      title: "Skills & Expertise",
      items: [
        {
          id: "skill-cat-1",
          categoryName: "Languages & Core Tech",
          skills: ["TypeScript", "JavaScript", "Python", "HTML5 & CSS3", "SQL"]
        } as any,
        {
          id: "skill-cat-2",
          categoryName: "Frameworks & Libraries",
          skills: ["React", "Vite", "Node.js", "Express", "Tailwind CSS", "Motion"]
        } as any,
        {
          id: "skill-cat-3",
          categoryName: "Tools & Platforms",
          skills: ["Git & GitHub", "Firebase", "Vercel", "Google Cloud Platform", "Figma"]
        } as any
      ]
    },
    {
      id: "sec-exp-1",
      type: "experience",
      title: "Professional Experience",
      items: [
        {
          id: "exp-1",
          company: "Google Developer Student Clubs",
          role: "Technical Lead",
          duration: "2024 - Present",
          location: "Campus",
          description: "Led development of student projects using React and Firebase.\nMentored 20+ juniors in frontend web development practices.\nOrganized hands-on hackathons and web tech workshops."
        } as any,
        {
          id: "exp-2",
          company: "Tech Innovations Inc.",
          role: "Software Engineer Intern",
          duration: "Summer 2023",
          location: "Remote",
          description: "Developed and optimized key features for user-facing dashboards.\nImproved application load times by 25% through lazy-loading and asset compression.\nCollaborated closely with UI/UX designers to implement Material Design systems."
        } as any
      ]
    },
    {
      id: "sec-proj-1",
      type: "projects",
      title: "Featured Projects",
      items: [
        {
          id: "proj-1",
          name: "Smart QR Portfolio Generator",
          description: "An elegant, secure portfolio application designed for fast QR-code sharing. Built with a hidden passcode-protected dashboard allowing real-time edits, exports, and fully reactive layouts.",
          technologies: ["React", "TypeScript", "Tailwind CSS", "Motion"],
          link: "https://github.com",
          github: "https://github.com"
        } as any,
        {
          id: "proj-2",
          name: "AI-Powered Study Assistant",
          description: "A Chrome Extension that summarizes long academic articles and formats core takeaways. Leveraged Gemini API models for high-quality, lightweight context extraction.",
          technologies: ["JavaScript", "Tailwind CSS", "Gemini SDK"],
          link: "https://github.com"
        } as any
      ]
    },
    {
      id: "sec-edu-1",
      type: "education",
      title: "Education",
      items: [
        {
          id: "edu-1",
          institution: "State Institute of Technology",
          degree: "Bachelor of Technology in Computer Science",
          duration: "2021 - 2025",
          grade: "GPA: 8.9/10.0",
          description: "Core coursework: Data Structures & Algorithms, Database Systems, Software Engineering, Web Architectures."
        } as any
      ]
    },
    {
      id: "sec-contact-1",
      type: "contact",
      title: "Get in Touch",
      items: [
        {
          id: "cont-1",
          type: "email",
          label: "Email Me",
          value: "richa.pandey@example.com",
          url: "mailto:richa.pandey@example.com"
        } as any,
        {
          id: "cont-2",
          type: "linkedin",
          label: "LinkedIn Profile",
          value: "linkedin.com/in/richapandey",
          url: "https://linkedin.com"
        } as any,
        {
          id: "cont-3",
          type: "github",
          label: "GitHub Profile",
          value: "github.com/richapandey",
          url: "https://github.com"
        } as any
      ]
    },
    {
      id: "sec-certs-1",
      type: "certifications",
      title: "Certifications & Credentials",
      items: [
        {
          id: "cert-1",
          title: "Google Cloud Certified Associate Cloud Engineer",
          issuer: "Google Cloud",
          date: "2024",
          category: "Cloud Computing",
          credentialUrl: "https://www.credential.net/..."
        } as any,
        {
          id: "cert-2",
          title: "Advanced React & Web Architectures",
          issuer: "Meta",
          date: "2023",
          category: "Web Development",
          credentialUrl: "https://coursera.org/..."
        } as any
      ]
    }
  ]
};
