import React from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  FolderGit2, 
  Award, 
  Mail, 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  Plus, 
  Pencil,
  ExternalLink,
  Github,
  Phone,
  Linkedin,
  Twitter,
  Globe,
  PlusCircle,
  MoveUp,
  MoveDown,
  Sparkles
} from 'lucide-react';
import { 
  PortfolioSection, 
  EducationItem, 
  ExperienceItem, 
  ProjectItem, 
  SkillCategory, 
  ContactItem 
} from '../types';

interface SectionRendererProps {
  section: PortfolioSection;
  isAdmin: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDeleteSection: () => void;
  onEditSectionTitle: (newTitle: string) => void;
  onAddItem: () => void;
  onEditItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onMoveItemUp: (itemId: string) => void;
  onMoveItemDown: (itemId: string) => void;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  isAdmin,
  onMoveUp,
  onMoveDown,
  onDeleteSection,
  onEditSectionTitle,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onMoveItemUp,
  onMoveItemDown
}) => {
  
  // Icon picker for each section type
  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'education':
        return <GraduationCap className="w-5 h-5 text-gblue-500" />;
      case 'experience':
        return <Briefcase className="w-5 h-5 text-ggreen-500" />;
      case 'projects':
        return <FolderGit2 className="w-5 h-5 text-gyellow-600" />;
      case 'skills':
        return <Award className="w-5 h-5 text-gred-500" />;
      case 'contact':
        return <Mail className="w-5 h-5 text-gblue-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-gblue-500" />;
    }
  };

  const getSectionColorClass = (type: string) => {
    switch (type) {
      case 'education': return 'border-l-4 border-gblue-500';
      case 'experience': return 'border-l-4 border-ggreen-500';
      case 'projects': return 'border-l-4 border-gyellow-500';
      case 'skills': return 'border-l-4 border-gred-500';
      case 'contact': return 'border-l-4 border-gblue-500';
      default: return 'border-l-4 border-gblue-500';
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4 text-gblue-500" />;
      case 'linkedin': return <Linkedin className="w-4 h-4 text-[#0a66c2]" />;
      case 'github': return <Github className="w-4 h-4 text-gray-900" />;
      case 'twitter': return <Twitter className="w-4 h-4 text-[#1da1f2]" />;
      case 'phone': return <Phone className="w-4 h-4 text-ggreen-500" />;
      default: return <Globe className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div 
      id={`section-container-${section.id}`} 
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6 transition-all duration-200 relative hover:shadow-md ${getSectionColorClass(section.type)}`}
    >
      {/* Admin Section Actions */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-xl border border-gray-100 z-10 shadow-xs">
          <button 
            id={`btn-sec-up-${section.id}`}
            onClick={onMoveUp}
            className="p-1.5 text-gray-500 hover:text-gblue-500 hover:bg-gblue-50 rounded-lg transition-colors"
            title="Move Section Up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button 
            id={`btn-sec-down-${section.id}`}
            onClick={onMoveDown}
            className="p-1.5 text-gray-500 hover:text-gblue-500 hover:bg-gblue-50 rounded-lg transition-colors"
            title="Move Section Down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-200 mx-1"></div>
          <button 
            id={`btn-sec-del-${section.id}`}
            onClick={onDeleteSection}
            className="p-1.5 text-gray-400 hover:text-gred-500 hover:bg-gred-50 rounded-lg transition-colors"
            title="Delete Section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-100 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-50 rounded-xl flex items-center justify-center">
            {getSectionIcon(section.type)}
          </div>
          {isAdmin ? (
            <input 
              id={`input-sec-title-${section.id}`}
              type="text"
              value={section.title}
              onChange={(e) => onEditSectionTitle(e.target.value)}
              className="text-xl font-semibold text-gray-800 bg-gray-50 border-b border-transparent hover:border-gray-300 focus:border-gblue-500 focus:bg-white px-2 py-1 rounded-md transition-all outline-none"
              placeholder="Section Title"
            />
          ) : (
            <h2 className="text-xl font-bold tracking-tight text-ggray-900">{section.title}</h2>
          )}
        </div>
        
        {isAdmin && (
          <button 
            id={`btn-add-item-${section.id}`}
            onClick={onAddItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gblue-50 hover:bg-gblue-100 text-gblue-500 hover:text-gblue-700 text-xs font-semibold rounded-full transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        )}
      </div>

      {/* Empty State within Section */}
      {section.items.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          No entries added yet. {isAdmin && "Click 'Add Item' above to populate this section."}
        </div>
      )}

      {/* Render Items */}
      <div className="space-y-6">
        {section.items.map((item, index) => (
          <div 
            id={`item-${item.id}`} 
            key={item.id} 
            className="group relative border-b border-gray-50 last:border-0 pb-6 last:pb-0"
          >
            {/* Item Editor Controls (Admin) */}
            {isAdmin && (
              <div className="absolute right-0 top-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 bg-white border border-gray-100 rounded-lg shadow-sm p-1 z-10">
                <button 
                  id={`btn-item-up-${item.id}`}
                  onClick={() => onMoveItemUp(item.id)}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-gblue-500 hover:bg-gray-50 rounded disabled:opacity-30 transition-all"
                  title="Move Item Up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button 
                  id={`btn-item-down-${item.id}`}
                  onClick={() => onMoveItemDown(item.id)}
                  disabled={index === section.items.length - 1}
                  className="p-1 text-gray-500 hover:text-gblue-500 hover:bg-gray-50 rounded disabled:opacity-30 transition-all"
                  title="Move Item Down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button 
                  id={`btn-item-edit-${item.id}`}
                  onClick={() => onEditItem(item.id)}
                  className="p-1 text-gblue-500 hover:bg-gblue-50 rounded transition-all"
                  title="Edit Item"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button 
                  id={`btn-item-del-${item.id}`}
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1 text-gred-500 hover:bg-gred-50 rounded transition-all"
                  title="Delete Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Type Specific Rendering */}
            
            {/* EDUCATION RENDERER */}
            {section.type === 'education' && (
              (() => {
                const edu = item as EducationItem;
                return (
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-baseline gap-1 md:gap-4 pr-16">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-[16px]">{edu.institution}</h3>
                      <p className="text-gray-600 font-medium text-sm mt-0.5">{edu.degree}</p>
                      {edu.grade && (
                        <span className="inline-block bg-gblue-50 text-gblue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-2">
                          {edu.grade}
                        </span>
                      )}
                      {edu.description && (
                        <p className="text-gray-500 text-sm mt-2 whitespace-pre-line leading-relaxed">{edu.description}</p>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap self-start md:self-auto mt-2 md:mt-0">
                      {edu.duration}
                    </div>
                  </div>
                );
              })()
            )}

            {/* EXPERIENCE RENDERER */}
            {section.type === 'experience' && (
              (() => {
                const exp = item as ExperienceItem;
                return (
                  <div className="flex flex-col md:flex-row md:justify-between items-start gap-2 pr-16">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-[16px]">{exp.company}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-gray-700 font-medium text-sm">{exp.role}</span>
                        {exp.location && (
                          <>
                            <span className="text-gray-300 text-xs">•</span>
                            <span className="text-gray-500 text-xs">{exp.location}</span>
                          </>
                        )}
                      </div>
                      <div className="mt-3 space-y-1.5 text-sm text-gray-500 whitespace-pre-line leading-relaxed">
                        {exp.description.split('\n').map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <span className="text-ggreen-500 mt-1.5 font-bold">•</span>
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap self-start md:self-auto">
                      {exp.duration}
                    </div>
                  </div>
                );
              })()
            )}

            {/* PROJECTS RENDERER */}
            {section.type === 'projects' && (
              (() => {
                const proj = item as ProjectItem;
                return (
                  <div className="flex flex-col gap-2 pr-16">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 text-[16px]">{proj.name}</h3>
                      <div className="flex items-center gap-1.5">
                        {proj.link && (
                          <a 
                            id={`link-proj-ext-${proj.id}`}
                            href={proj.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-1 hover:bg-gblue-50 text-gblue-500 hover:text-gblue-700 rounded transition-all"
                            title="Visit Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {proj.github && (
                          <a 
                            id={`link-proj-git-${proj.id}`}
                            href={proj.github} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-1 hover:bg-gray-100 text-gray-700 hover:text-black rounded transition-all"
                            title="View Github"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">{proj.description}</p>
                    
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {proj.technologies.map((tech, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="bg-gyellow-50 text-gyellow-600 border border-amber-100 font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()
            )}

            {/* SKILLS RENDERER */}
            {section.type === 'skills' && (
              (() => {
                const cat = item as SkillCategory;
                return (
                  <div className="flex flex-col md:flex-row md:items-center gap-3 pr-16">
                    <span className="font-semibold text-gray-700 text-sm md:w-48 shrink-0">{cat.categoryName}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.skills.map((sk, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="bg-gred-50 text-gred-500 border border-red-50 font-medium text-xs px-3 py-1 rounded-full shadow-xs hover:scale-105 transition-transform cursor-default"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()
            )}

            {/* CONTACT RENDERER */}
            {section.type === 'contact' && (
              (() => {
                const contact = item as ContactItem;
                return (
                  <div className="flex items-center gap-3 pr-16">
                    <div className="p-2 bg-gray-50 rounded-lg flex items-center justify-center">
                      {getContactIcon(contact.type)}
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="font-semibold text-gray-800 text-sm">{contact.label}</span>
                      {contact.url ? (
                        <a 
                          id={`link-contact-${contact.id}`}
                          href={contact.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gblue-500 hover:text-gblue-700 hover:underline text-sm font-medium flex items-center gap-1"
                        >
                          {contact.value} <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-600 text-sm font-medium">{contact.value}</span>
                      )}
                    </div>
                  </div>
                );
              })()
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionRenderer;
