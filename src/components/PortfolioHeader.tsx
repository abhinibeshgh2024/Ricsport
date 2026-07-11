import React from 'react';
import { Mail, Globe, MapPin, Sparkles, User, FileText } from 'lucide-react';
import { PortfolioSettings, PortfolioSection } from '../types';

interface PortfolioHeaderProps {
  settings: PortfolioSettings;
  sections: PortfolioSection[];
}

export default function PortfolioHeader({ settings, sections }: PortfolioHeaderProps) {
  // Extract contact links to display in header if they exist
  const contactSection = sections.find(s => s.type === 'contact');
  const emailItem = contactSection?.items.find((i: any) => i.type === 'email');
  const githubItem = contactSection?.items.find((i: any) => i.type === 'github');
  const linkedinItem = contactSection?.items.find((i: any) => i.type === 'linkedin');

  // Generate Google Material style avatar fallback if no image provided
  const renderAvatar = () => {
    if (settings.avatarUrl) {
      return (
        <img 
          id="img-portfolio-avatar"
          src={settings.avatarUrl} 
          alt={settings.name}
          className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white shadow-sm object-cover relative z-10"
          referrerPolicy="no-referrer"
        />
      );
    }
    
    // Google Accent Palette circular avatar
    return (
      <div 
        id="div-portfolio-avatar-fallback"
        className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white shadow-sm bg-gradient-to-tr from-gblue-500 via-ggreen-500 to-gyellow-500 flex items-center justify-center text-white font-bold text-5xl select-none relative z-10 animate-fade-in"
      >
        {settings.name ? settings.name.charAt(0) : 'R'}
      </div>
    );
  };

  return (
    <div 
      id="portfolio-header"
      className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 md:p-12 mb-8 overflow-hidden relative transition-all"
    >
      {/* Visual Google Accents Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gblue-50/75 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-ggreen-50/60 to-transparent rounded-full -ml-16 -mb-16 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative z-10">
        
        {/* Avatar Area */}
        <div className="shrink-0 relative">
          {renderAvatar()}
          {/* Subtle Google Sparkle Badge */}
          <div className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md border border-gray-100 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gyellow-600 animate-pulse" />
          </div>
        </div>

        {/* Info Area */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#202124] leading-tight">
              {settings.name || 'Richa Pandey'}
            </h1>
            <p className="text-xl md:text-2xl text-[#5f6368] font-normal mt-2.5 leading-relaxed">
              {settings.tagline || 'Creative Professional & Problem Solver'}
            </p>
          </div>

          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            {settings.bio || 'Your dynamic biography will appear here once configured in the control center.'}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <span className="px-4 py-1.5 bg-[#E8F0FE] text-[#1967D2] rounded-full text-sm font-medium transition-all hover:bg-gblue-100">
              Portfolio Active
            </span>
            <span className="px-4 py-1.5 bg-[#F1F3F4] text-[#5F6368] rounded-full text-sm font-medium transition-all hover:bg-gray-200">
              Open to opportunities
            </span>
          </div>

          {/* Quick Header Contact Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1.5">
            {emailItem && (
              <a 
                id="header-link-email"
                href={(emailItem as any).url || `mailto:${(emailItem as any).value}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gblue-50 hover:bg-gblue-100 text-[#1a73e8] text-xs font-semibold rounded-full transition-all border border-transparent hover:border-gblue-200"
              >
                <Mail className="w-3.5 h-3.5" /> {(emailItem as any).value}
              </a>
            )}
            {linkedinItem && (
              <a 
                id="header-link-linkedin"
                href={(linkedinItem as any).url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-[#5f6368] hover:text-[#202124] text-xs font-semibold rounded-full transition-all border border-gray-200"
              >
                LinkedIn
              </a>
            )}
            {githubItem && (
              <a 
                id="header-link-github"
                href={(githubItem as any).url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-[#5f6368] hover:text-[#202124] text-xs font-semibold rounded-full transition-all border border-gray-200"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
