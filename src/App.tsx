import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Lock, 
  Sparkles, 
  AlertCircle, 
  Eye, 
  ArrowRight, 
  Download, 
  Heart,
  Github,
  Linkedin,
  LogOut,
  FolderOpen,
  Cloud,
  Check,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { PortfolioData, PortfolioSection, SectionType } from './types';
import { blankPortfolioData } from './initialData';
import { db } from './lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

// Dynamic Components
import PortfolioHeader from './components/PortfolioHeader';
import SectionRenderer from './components/SectionRenderer';
import AdminPanel from './components/AdminPanel';
import ItemEditorModal from './components/ItemEditorModal';

export default function App() {
  // 1. Initial State Load
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(blankPortfolioData);

  // 2. Control/View States
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPasscodePromptOpen, setIsPasscodePromptOpen] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // 3. Modal States for Item Editing
  const [activeSectionForModal, setActiveSectionForModal] = useState<PortfolioSection | null>(null);
  const [activeItemForModal, setActiveItemForModal] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  // Firebase loading/sync states
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // 4. Real-time Firebase Synchronization (Loads database for everyone)
  useEffect(() => {
    const docRef = doc(db, 'portfolio', 'main');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PortfolioData;
        if (data.settings && Array.isArray(data.sections)) {
          setPortfolioData(data);
        }
      } else {
        // Doc doesn't exist yet, initialize it
        setDoc(docRef, blankPortfolioData).catch((err) => {
          console.error("Error creating initial document in Firestore:", err);
        });
      }
      setIsFirebaseLoading(false);
    }, (error) => {
      console.error("Firestore subscription error:", error);
      setFirebaseError(error.message);
      setIsFirebaseLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 5. Save changes to local cache and Firestore when modified by administrator
  useEffect(() => {
    localStorage.setItem('richa_portfolio_data', JSON.stringify(portfolioData));
    
    if (isAdmin && !isFirebaseLoading) {
      setIsSyncing(true);
      const docRef = doc(db, 'portfolio', 'main');
      setDoc(docRef, portfolioData)
        .then(() => {
          setIsSyncing(false);
        })
        .catch((error) => {
          console.error("Firestore write error:", error);
          setIsSyncing(false);
        });
    }
  }, [portfolioData, isAdmin, isFirebaseLoading]);

  // Handle verify passcode
  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = portfolioData.settings.passcode || 'Richa123';
    
    if (passcodeAttempt === correctPasscode) {
      setIsAdmin(true);
      setIsPasscodePromptOpen(false);
      setPasscodeAttempt('');
      setPasscodeError('');
    } else {
      setPasscodeError('Incorrect passcode. Please try again.');
    }
  };

  // State modification actions: settings
  const handleUpdateSettings = (newSettings: any) => {
    setPortfolioData(prev => ({
      ...prev,
      settings: newSettings
    }));
  };

  // State modification actions: add section
  const handleAddSection = (type: SectionType, title: string) => {
    const newSection: PortfolioSection = {
      id: `sec-${Date.now()}`,
      type,
      title,
      items: []
    };
    
    setPortfolioData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  // State modification actions: delete section
  const handleDeleteSection = (sectionId: string) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  };

  // State modification actions: edit section title in-place
  const handleEditSectionTitle = (sectionId: string, newTitle: string) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, title: newTitle } : s)
    }));
  };

  // State modification actions: reorder sections
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === portfolioData.sections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newSections = [...portfolioData.sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    setPortfolioData(prev => ({ ...prev, sections: newSections }));
  };

  // State modification actions: open modal for item
  const handleOpenItemModal = (section: PortfolioSection, item: any = null) => {
    setActiveSectionForModal(section);
    setActiveItemForModal(item);
  };

  // State modification actions: save item in section
  const handleSaveItem = (itemPayload: any) => {
    if (!activeSectionForModal) return;

    setPortfolioData(prev => {
      const updatedSections = prev.sections.map(sec => {
        if (sec.id === activeSectionForModal.id) {
          const isEditing = activeItemForModal !== null;
          let updatedItems;

          if (isEditing) {
            updatedItems = sec.items.map(item => item.id === itemPayload.id ? itemPayload : item);
          } else {
            updatedItems = [...sec.items, itemPayload];
          }

          return {
            ...sec,
            items: updatedItems
          };
        }
        return sec;
      });

      return {
        ...prev,
        sections: updatedSections
      };
    });

    setActiveSectionForModal(null);
    setActiveItemForModal(null);
  };

  // State modification actions: delete item from section
  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setPortfolioData(prev => ({
      ...prev,
      sections: prev.sections.map(sec => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            items: sec.items.filter(item => item.id !== itemId)
          };
        }
        return sec;
      })
    }));
  };

  // State modification actions: reorder items inside a section
  const handleMoveItem = (sectionId: string, itemId: string, direction: 'up' | 'down') => {
    setPortfolioData(prev => {
      const updatedSections = prev.sections.map(sec => {
        if (sec.id === sectionId) {
          const itemIndex = sec.items.findIndex(item => item.id === itemId);
          if (itemIndex === -1) return sec;

          if (direction === 'up' && itemIndex === 0) return sec;
          if (direction === 'down' && itemIndex === sec.items.length - 1) return sec;

          const targetIndex = direction === 'up' ? itemIndex - 1 : itemIndex + 1;
          const newItems = [...sec.items];
          const temp = newItems[itemIndex];
          newItems[itemIndex] = newItems[targetIndex];
          newItems[targetIndex] = temp;

          return {
            ...sec,
            items: newItems
          };
        }
        return sec;
      });

      return {
        ...prev,
        sections: updatedSections
      };
    });
  };

  // Bulk loaders for template manipulation
  const handleResetToBlank = () => {
    setPortfolioData(blankPortfolioData);
  };

  const handleImportData = (imported: PortfolioData) => {
    setPortfolioData(imported);
  };

  const getInitials = (name: string) => {
    if (!name) return 'RP';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const scrollToSection = (type: string) => {
    setActiveTab(type);
    if (type === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const sec = portfolioData.sections.find(s => s.type === type);
    if (sec) {
      const el = document.getElementById(`section-container-${sec.id}`);
      if (el) {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else if (type === 'contact') {
      const el = document.getElementById('portfolio-footer');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (isFirebaseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-gblue-500/10 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-gblue-500 border-r-gblue-500/30 border-b-gblue-500/30 border-l-gblue-500/30 animate-spin"></div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Loading Live Portfolio</h2>
          <p className="text-sm text-gray-500 mt-2">Connecting securely to Firestore live database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans transition-all selection:bg-gblue-100 selection:text-gblue-700">
      
      {/* 1. ADMIN PANEL CONTROL CENTER (Sticky, top of screen when logged in) */}
      {isAdmin && (
        <AdminPanel 
          portfolioData={portfolioData}
          onUpdateSettings={handleUpdateSettings}
          onAddSection={handleAddSection}
          onResetToBlank={handleResetToBlank}
          onImportData={handleImportData}
          isSyncing={isSyncing}
        />
      )}

      {/* 1.5 STICKY ARTISTIC HEADER NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 h-16 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 md:px-12 flex items-center justify-between transition-all shadow-xs gap-4">
        <div 
          onClick={() => scrollToSection('home')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-8.5 h-8.5 bg-gblue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
            {getInitials(portfolioData.settings.name || 'Richa Pandey')}
          </div>
          <span className="text-sm md:text-base font-semibold tracking-tight text-[#202124] group-hover:text-gblue-500 transition-colors hidden sm:block">
            {portfolioData.settings.name || 'Richa Pandey'}
          </span>
        </div>
        
        <div className="flex gap-4 md:gap-8 text-xs md:text-sm font-semibold text-[#5f6368] overflow-x-auto scrollbar-none whitespace-nowrap shrink-0 max-w-full">
          <span 
            onClick={() => scrollToSection('home')}
            className={`cursor-pointer h-16 flex items-center border-b-2 transition-all hover:text-[#1a73e8] ${
              activeTab === 'home' ? 'text-[#1a73e8] border-[#1a73e8] py-5' : 'border-transparent py-5'
            }`}
          >
            Home
          </span>
          {portfolioData.sections.some(s => s.type === 'experience') && (
            <span 
              onClick={() => scrollToSection('experience')}
              className={`cursor-pointer h-16 flex items-center border-b-2 transition-all hover:text-[#1a73e8] ${
                activeTab === 'experience' ? 'text-[#1a73e8] border-[#1a73e8] py-5' : 'border-transparent py-5'
              }`}
            >
              Experience
            </span>
          )}
          {portfolioData.sections.some(s => s.type === 'projects') && (
            <span 
              onClick={() => scrollToSection('projects')}
              className={`cursor-pointer h-16 flex items-center border-b-2 transition-all hover:text-[#1a73e8] ${
                activeTab === 'projects' ? 'text-[#1a73e8] border-[#1a73e8] py-5' : 'border-transparent py-5'
              }`}
            >
              Projects
            </span>
          )}
          {portfolioData.sections.some(s => s.type === 'education') && (
            <span 
              onClick={() => scrollToSection('education')}
              className={`cursor-pointer h-16 flex items-center border-b-2 transition-all hover:text-[#1a73e8] ${
                activeTab === 'education' ? 'text-[#1a73e8] border-[#1a73e8] py-5' : 'border-transparent py-5'
              }`}
            >
              Education
            </span>
          )}
          {portfolioData.sections.some(s => s.type === 'skills') && (
            <span 
              onClick={() => scrollToSection('skills')}
              className={`cursor-pointer h-16 flex items-center border-b-2 transition-all hover:text-[#1a73e8] ${
                activeTab === 'skills' ? 'text-[#1a73e8] border-[#1a73e8] py-5' : 'border-transparent py-5'
              }`}
            >
              Skills
            </span>
          )}
          {portfolioData.sections.some(s => s.type === 'certifications') && (
            <span 
              onClick={() => scrollToSection('certifications')}
              className={`cursor-pointer h-16 flex items-center border-b-2 transition-all hover:text-[#1a73e8] ${
                activeTab === 'certifications' ? 'text-[#1a73e8] border-[#1a73e8] py-5' : 'border-transparent py-5'
              }`}
            >
              Certifications
            </span>
          )}
          <span 
            onClick={() => scrollToSection('contact')}
            className={`cursor-pointer h-16 flex items-center border-b-2 transition-all hover:text-[#1a73e8] ${
              activeTab === 'contact' ? 'text-[#1a73e8] border-[#1a73e8] py-5' : 'border-transparent py-5'
            }`}
          >
            Contact
          </span>
        </div>
      </nav>

      {/* 2. MAIN PRESENTATION SPACE */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 md:py-12">
        
        {/* Intro Header */}
        <PortfolioHeader 
          settings={portfolioData.settings}
          sections={portfolioData.sections}
        />

        {/* Dynamic List Renderers */}
        <div className="space-y-6">
          {portfolioData.sections.map((section, index) => (
            <SectionRenderer 
              key={section.id}
              section={section}
              isAdmin={isAdmin}
              onMoveUp={() => handleMoveSection(index, 'up')}
              onMoveDown={() => handleMoveSection(index, 'down')}
              onDeleteSection={() => handleDeleteSection(section.id)}
              onEditSectionTitle={(newTitle) => handleEditSectionTitle(section.id, newTitle)}
              onAddItem={() => handleOpenItemModal(section)}
              onEditItem={(itemId) => handleOpenItemModal(section, section.items.find(item => item.id === itemId))}
              onDeleteItem={(itemId) => handleDeleteItem(section.id, itemId)}
              onMoveItemUp={(itemId) => handleMoveItem(section.id, itemId, 'up')}
              onMoveItemDown={(itemId) => handleMoveItem(section.id, itemId, 'down')}
            />
          ))}

          {/* Empty portfolio fallback (when there are absolutely no sections) */}
          {portfolioData.sections.length === 0 && (
            <div 
              id="empty-portfolio-state"
              className="bg-white rounded-3xl border border-gray-150 p-10 md:p-14 text-center shadow-xs"
            >
              <div className="w-16 h-16 bg-gblue-50 text-gblue-500 rounded-full flex items-center justify-center mx-auto mb-5">
                <FolderOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Portfolio is Empty</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                {isAdmin 
                  ? "Welcome Richa! Your workspace is active and blank. Click on any of the core sections in the control panel above to build your profile instantly."
                  : "This professional space is currently being initialized. Please check back shortly, or scan/login if you are the administrator."
                }
              </p>
              {isAdmin && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button 
                    id="btn-empty-add-skills"
                    onClick={() => handleAddSection('skills', 'Skills & Tech Stack')}
                    className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-gblue-500 hover:bg-gblue-600 text-white text-xs font-bold rounded-full transition-all shadow-sm"
                  >
                    + Add Skills Section
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 3. SUBTLE ADMIN LOGIN ACCESS & COPYRIGHT FOOTER */}
      <footer 
        id="portfolio-footer" 
        className={`bg-white border-t border-gray-200 py-6 md:py-8 px-6 md:px-12 mt-12 transition-all ${isAdmin ? 'pb-24 sm:pb-24' : ''}`}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm text-[#70757a] font-medium">
          <div>
            <span>© 2026 {portfolioData.settings.name || 'Richa Pandey'} • All rights reserved</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Subtle administrator prompt button */}
            {!isAdmin && (
              <button 
                id="btn-footer-edit"
                onClick={() => {
                  setPasscodeError('');
                  setIsPasscodePromptOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-250 text-gray-700 hover:text-black rounded-lg text-xs font-semibold transition-all shadow-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
                Edit Portfolio
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* 4. PASSCODE DIALOG MODAL (Slide overlay) */}
      {isPasscodePromptOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-xs">
          <div 
            id="passcode-prompt-dialog"
            className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-gray-100 overflow-hidden p-6 transform transition-all animate-scale-up"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-gblue-50 text-gblue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-gblue-100">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Administrator Access</h3>
              <p className="text-gray-500 text-xs mt-1 max-w-xs mx-auto leading-relaxed">
                Enter your secure passcode to reveal dynamic building controls and edit metadata.
              </p>
            </div>

            <form onSubmit={handleVerifyPasscode} className="mt-5 space-y-4">
              {passcodeError && (
                <div className="bg-gred-50 text-gred-600 p-2.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passcodeError}</span>
                </div>
              )}

              <div>
                <input 
                  id="input-login-passcode"
                  type="password"
                  required
                  autoFocus
                  placeholder="••••••••"
                  value={passcodeAttempt}
                  onChange={(e) => setPasscodeAttempt(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-250 rounded-xl px-4 py-2.5 text-sm text-center focus:border-gblue-500 focus:bg-white focus:ring-1 focus:ring-gblue-500 transition-all outline-none font-mono tracking-widest"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  id="btn-login-cancel"
                  type="button"
                  onClick={() => {
                    setIsPasscodePromptOpen(false);
                    setPasscodeAttempt('');
                    setPasscodeError('');
                  }}
                  className="flex-1 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  id="btn-login-submit"
                  type="submit"
                  className="flex-1 py-2 bg-gblue-500 hover:bg-gblue-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-1"
                >
                  Verify <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. STICKY BOTTOM ADMIN BAR (Contains real-time save status and Publish button) */}
      {isAdmin && (
        <div 
          id="sticky-admin-bottom-bar"
          className="fixed bottom-0 left-0 right-0 bg-gray-900/95 border-t border-gray-800 text-white py-4 px-6 md:px-12 shadow-[0_-10px_25px_rgba(0,0,0,0.3)] z-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up"
        >
          <div className="flex items-center gap-3 animate-fade-in">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSyncing ? 'bg-gblue-500/20 text-gblue-400' : 'bg-ggreen-500/20 text-ggreen-400'}`}>
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time Cloud Sync</p>
              <div className="text-sm font-semibold text-white mt-0.5">
                {isSyncing ? (
                  <span className="flex items-center gap-1.5">
                    Saving edits to live database...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-ggreen-400">
                    All changes synchronized and published!
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 font-medium hidden md:inline">
              Workspace is unlocked • Edits are live instantly
            </span>
            <button 
              id="btn-publish-lock-bottom"
              onClick={() => setIsAdmin(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gred-500 hover:bg-gred-600 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Eye className="w-4 h-4" /> Publish & Lock View
            </button>
          </div>
        </div>
      )}

      {/* 6. MODULAR SECTION ITEM FORM (Renders as overlay modal when activeSectionForModal is populated) */}
      {activeSectionForModal && (
        <ItemEditorModal 
          isOpen={activeSectionForModal !== null}
          sectionType={activeSectionForModal.type}
          sectionTitle={activeSectionForModal.title}
          item={activeItemForModal}
          onSave={handleSaveItem}
          onClose={() => {
            setActiveSectionForModal(null);
            setActiveItemForModal(null);
          }}
        />
      )}

    </div>
  );
}
