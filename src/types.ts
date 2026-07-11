export type SectionType = 'education' | 'experience' | 'projects' | 'skills' | 'contact' | 'certifications';

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  category: string;
  imageUrl?: string;
  credentialUrl?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  duration: string; // e.g., "2021 - 2025" or "Graduated 2024"
  description?: string;
  grade?: string; // e.g., "GPA: 3.9/4.0" or "First Class"
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string; // e.g., "June 2023 - Present"
  location?: string;
  description: string; // support bullet points separated by newlines
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[]; // e.g., ["React", "TypeScript", "Tailwind"]
  link?: string;
  github?: string;
}

export interface SkillCategory {
  id: string;
  categoryName: string; // e.g., "Frontend", "Backend", "Languages"
  skills: string[]; // e.g., ["React", "HTML", "CSS"]
}

export interface ContactItem {
  id: string;
  type: 'email' | 'phone' | 'linkedin' | 'github' | 'twitter' | 'website' | 'other';
  label: string; // e.g., "Email", "LinkedIn"
  value: string; // e.g., "richa@example.com"
  url: string; // e.g., "mailto:richa@example.com" or "https://linkedin.com/..."
}

export interface PortfolioSection {
  id: string;
  type: SectionType;
  title: string; // Section Display Title (e.g., "My Journey", "Work Experience")
  isOpen?: boolean; // configuration/visibility
  items: (EducationItem | ExperienceItem | ProjectItem | SkillCategory | ContactItem | CertificateItem)[];
}

export interface PortfolioSettings {
  name: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  passcode: string;
  accentColor: string; // Google Blue, Google Green, etc.
}

export interface PortfolioData {
  settings: PortfolioSettings;
  sections: PortfolioSection[];
}
