import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { SectionType } from '../types';

interface ItemEditorModalProps {
  isOpen: boolean;
  sectionType: SectionType;
  sectionTitle: string;
  item: any; // If null, we are adding. If populated, we are editing.
  onSave: (data: any) => void;
  onClose: () => void;
}

export default function ItemEditorModal({
  isOpen,
  sectionType,
  sectionTitle,
  item,
  onSave,
  onClose
}: ItemEditorModalProps) {
  
  // State for form fields
  // Common / Shared field states (mapped to specific fields per type)
  const [field1, setField1] = useState(''); // institution / company / projName / categoryName / contactLabel
  const [field2, setField2] = useState(''); // degree / role / projDesc / skillsCommaSeparated / contactValue
  const [field3, setField3] = useState(''); // duration / duration / projLink / contactUrl
  const [field4, setField4] = useState(''); // grade / location / projGithub
  const [field5, setField5] = useState(''); // description (edu) / description (exp)
  const [contactType, setContactType] = useState<'email' | 'phone' | 'linkedin' | 'github' | 'twitter' | 'website' | 'other'>('email');
  
  const [error, setError] = useState('');

  // Sync state with selected item when modal opens or item changes
  useEffect(() => {
    if (item) {
      if (sectionType === 'education') {
        setField1(item.institution || '');
        setField2(item.degree || '');
        setField3(item.duration || '');
        setField4(item.grade || '');
        setField5(item.description || '');
      } else if (sectionType === 'experience') {
        setField1(item.company || '');
        setField2(item.role || '');
        setField3(item.duration || '');
        setField4(item.location || '');
        setField5(item.description || '');
      } else if (sectionType === 'projects') {
        setField1(item.name || '');
        setField2(item.description || '');
        setField3(item.link || '');
        setField4(item.github || '');
        // Join technologies with comma
        setField5(item.technologies ? item.technologies.join(', ') : '');
      } else if (sectionType === 'skills') {
        setField1(item.categoryName || '');
        setField2(item.skills ? item.skills.join(', ') : '');
        setField3('');
        setField4('');
        setField5('');
      } else if (sectionType === 'contact') {
        setContactType(item.type || 'email');
        setField1(item.label || '');
        setField2(item.value || '');
        setField3(item.url || '');
        setField4('');
        setField5('');
      }
      setError('');
    } else {
      // Reset form for adding
      setField1('');
      setField2('');
      setField3('');
      setField4('');
      setField5('');
      setContactType('email');
      setError('');
    }
  }, [item, sectionType, isOpen]);

  // Handle contact type preset helpers
  const handleContactTypeChange = (type: any) => {
    setContactType(type);
    
    // Auto populate common label and formats
    switch (type) {
      case 'email':
        setField1('Email');
        if (!field2.includes('@') && field2 !== '') setField3(`mailto:${field2}`);
        break;
      case 'linkedin':
        setField1('LinkedIn');
        if (field2 && !field2.startsWith('http')) setField3(`https://linkedin.com/in/${field2}`);
        break;
      case 'github':
        setField1('GitHub');
        if (field2 && !field2.startsWith('http')) setField3(`https://github.com/${field2}`);
        break;
      case 'twitter':
        setField1('Twitter');
        if (field2 && !field2.startsWith('http')) setField3(`https://twitter.com/${field2}`);
        break;
      case 'phone':
        setField1('Phone');
        if (field2) setField3(`tel:${field2}`);
        break;
      case 'website':
        setField1('Portfolio Website');
        if (field2 && !field2.startsWith('http')) setField3(`https://${field2}`);
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!field1.trim()) {
      setError('Primary identifier is required.');
      return;
    }

    let payload: any = {
      id: item?.id || `item-${Date.now()}`
    };

    if (sectionType === 'education') {
      payload = {
        ...payload,
        institution: field1.trim(),
        degree: field2.trim(),
        duration: field3.trim() || 'Ongoing',
        grade: field4.trim(),
        description: field5.trim()
      };
    } else if (sectionType === 'experience') {
      if (!field2.trim()) {
        setError('Role / Designation is required.');
        return;
      }
      payload = {
        ...payload,
        company: field1.trim(),
        role: field2.trim(),
        duration: field3.trim() || 'Ongoing',
        location: field4.trim(),
        description: field5.trim()
      };
    } else if (sectionType === 'projects') {
      if (!field2.trim()) {
        setError('Project description is required.');
        return;
      }
      payload = {
        ...payload,
        name: field1.trim(),
        description: field2.trim(),
        link: field3.trim(),
        github: field4.trim(),
        technologies: field5.trim() ? field5.split(',').map(t => t.trim()).filter(Boolean) : []
      };
    } else if (sectionType === 'skills') {
      if (!field2.trim()) {
        setError('At least one skill is required.');
        return;
      }
      payload = {
        ...payload,
        categoryName: field1.trim(),
        skills: field2.split(',').map(s => s.trim()).filter(Boolean)
      };
    } else if (sectionType === 'contact') {
      if (!field2.trim()) {
        setError('Contact details / value is required.');
        return;
      }
      
      // Auto resolve URL schemes if missing
      let resolvedUrl = field3.trim();
      if (resolvedUrl) {
        if (contactType === 'email' && !resolvedUrl.startsWith('mailto:')) {
          resolvedUrl = `mailto:${resolvedUrl}`;
        } else if (contactType === 'phone' && !resolvedUrl.startsWith('tel:')) {
          resolvedUrl = `tel:${resolvedUrl}`;
        } else if (['linkedin', 'github', 'twitter', 'website'].includes(contactType) && !resolvedUrl.startsWith('http')) {
          resolvedUrl = `https://${resolvedUrl}`;
        }
      }

      payload = {
        ...payload,
        type: contactType,
        label: field1.trim() || contactType.toUpperCase(),
        value: field2.trim(),
        url: resolvedUrl
      };
    }

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-xs overflow-y-auto">
      <div 
        id="item-editor-modal"
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-scale-up max-h-[90vh] flex flex-col my-auto"
      >
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-semibold text-gblue-500 uppercase tracking-widest">{sectionTitle}</span>
            <h3 className="text-lg font-bold text-gray-900 mt-0.5">
              {item ? 'Edit Record' : 'Add New Entry'}
            </h3>
          </div>
          <button 
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 max-h-[calc(90vh-120px)] scrollbar-none">
          {error && (
            <div className="bg-gred-50 text-gred-600 p-3 rounded-2xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* DYNAMIC FORMS BASED ON SECTION TYPE */}

          {/* EDUCATION FORM */}
          {sectionType === 'education' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Institution / University *</label>
                <input 
                  id="input-edu-inst"
                  type="text"
                  required
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                  placeholder="e.g., State Institute of Technology"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Degree / Course</label>
                  <input 
                    id="input-edu-deg"
                    type="text"
                    value={field2}
                    onChange={(e) => setField2(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                    placeholder="e.g., B.Tech in Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Duration (Years)</label>
                  <input 
                    id="input-edu-dur"
                    type="text"
                    value={field3}
                    onChange={(e) => setField3(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                    placeholder="e.g., 2021 - 2025"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Grade / Performance Marker</label>
                <input 
                  id="input-edu-grade"
                  type="text"
                  value={field4}
                  onChange={(e) => setField4(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                  placeholder="e.g., GPA: 9.1/10 or First Class"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Additional Description</label>
                <textarea 
                  id="input-edu-desc"
                  value={field5}
                  onChange={(e) => setField5(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none resize-none"
                  placeholder="Highlight major coursework, awards, or details..."
                />
              </div>
            </>
          )}

          {/* EXPERIENCE FORM */}
          {sectionType === 'experience' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Company / Organization *</label>
                  <input 
                    id="input-exp-comp"
                    type="text"
                    required
                    value={field1}
                    onChange={(e) => setField1(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                    placeholder="e.g., Google"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Role / Position *</label>
                  <input 
                    id="input-exp-role"
                    type="text"
                    required
                    value={field2}
                    onChange={(e) => setField2(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                    placeholder="e.g., Software Engineer Intern"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Duration</label>
                  <input 
                    id="input-exp-dur"
                    type="text"
                    value={field3}
                    onChange={(e) => setField3(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                    placeholder="e.g., June 2023 - Present"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Location</label>
                  <input 
                    id="input-exp-loc"
                    type="text"
                    value={field4}
                    onChange={(e) => setField4(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                    placeholder="e.g., San Francisco / Remote"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Roles & Responsibilities (One bullet per line) *</label>
                <textarea 
                  id="input-exp-desc"
                  required
                  value={field5}
                  onChange={(e) => setField5(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none resize-none"
                  placeholder="Developed user dashboard with React.&#10;Decreased loading time by 20%.&#10;Mentored new junior developers."
                />
                <span className="text-[10px] text-gray-400 block mt-1">Each line will automatically be formatted with an elegant bullet point indicator on the main screen.</span>
              </div>
            </>
          )}

          {/* PROJECTS FORM */}
          {sectionType === 'projects' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Project Name *</label>
                <input 
                  id="input-proj-name"
                  type="text"
                  required
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                  placeholder="e.g., Portfolio Builder App"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Project Description *</label>
                <textarea 
                  id="input-proj-desc"
                  required
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none resize-none"
                  placeholder="Explain what problem it solves and what you designed."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Project URL / Live Link</label>
                  <input 
                    id="input-proj-link"
                    type="url"
                    value={field3}
                    onChange={(e) => setField3(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                    placeholder="e.g., https://richa-pandey.web.app"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">GitHub Repository Link</label>
                  <input 
                    id="input-proj-git"
                    type="url"
                    value={field4}
                    onChange={(e) => setField4(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                    placeholder="e.g., https://github.com/richa/repo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Technologies Used (Comma-separated)</label>
                <input 
                  id="input-proj-tech"
                  type="text"
                  value={field5}
                  onChange={(e) => setField5(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                  placeholder="e.g., React, TypeScript, Tailwind, Framer Motion"
                />
              </div>
            </>
          )}

          {/* SKILLS FORM */}
          {sectionType === 'skills' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Skill Category Name *</label>
                <input 
                  id="input-skill-cat"
                  type="text"
                  required
                  value={field1}
                  onChange={(e) => setField1(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                  placeholder="e.g., Frontend Web Development or Programming Languages"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Skills in Category (Comma-separated) *</label>
                <input 
                  id="input-skills-list"
                  type="text"
                  required
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                  placeholder="e.g., React, HTML5, CSS3, Javascript, Tailwind CSS"
                />
              </div>
            </>
          )}

          {/* CONTACT FORM */}
          {sectionType === 'contact' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Contact Type *</label>
                  <select 
                    id="select-contact-type"
                    value={contactType}
                    onChange={(e) => handleContactTypeChange(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                  >
                    <option value="email">Email Address</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                    <option value="twitter">X / Twitter</option>
                    <option value="phone">Phone Number</option>
                    <option value="website">Custom Website</option>
                    <option value="other">Other Link / Handle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Display Label *</label>
                  <input 
                    id="input-contact-lbl"
                    type="text"
                    required
                    value={field1}
                    onChange={(e) => setField1(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                    placeholder="e.g., LinkedIn Profile or Email Me"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Display Value / Detail *</label>
                <input 
                  id="input-contact-val"
                  type="text"
                  required
                  value={field2}
                  onChange={(e) => setField2(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                  placeholder="e.g., richa.pandey@example.com or linkedin.com/in/richa"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Direct Link URL (for clicks)</label>
                <input 
                  id="input-contact-url"
                  type="text"
                  value={field3}
                  onChange={(e) => setField3(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none"
                  placeholder="e.g., https://linkedin.com/in/richa (or blank for auto-generation)"
                />
                <span className="text-[10px] text-gray-400 block mt-1">If empty, it will be automatically formatted based on contact type.</span>
              </div>
            </>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 mt-6">
            <button 
              id="btn-cancel-modal"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button 
              id="btn-save-modal"
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-gblue-500 hover:bg-gblue-600 text-white text-sm font-semibold rounded-full transition-colors shadow-md hover:shadow-lg"
            >
              <Save className="w-4 h-4" /> Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
