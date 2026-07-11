import React, { useState } from 'react';
import { 
  Lock, 
  Settings, 
  Plus, 
  Download, 
  Upload, 
  RefreshCw, 
  Check, 
  Trash2, 
  Key, 
  User, 
  Sparkles,
  FileText
} from 'lucide-react';
import { PortfolioData, SectionType } from '../types';

interface AdminPanelProps {
  portfolioData: PortfolioData;
  onUpdateSettings: (settings: any) => void;
  onAddSection: (type: SectionType, title: string) => void;
  onResetToBlank: () => void;
  onImportData: (data: PortfolioData) => void;
  isSyncing?: boolean;
}

export default function AdminPanel({
  portfolioData,
  onUpdateSettings,
  onAddSection,
  onResetToBlank,
  onImportData,
  isSyncing = false
}: AdminPanelProps) {
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings Form States
  const [name, setName] = useState(portfolioData.settings.name);
  const [tagline, setTagline] = useState(portfolioData.settings.tagline);
  const [bio, setBio] = useState(portfolioData.settings.bio);
  const [avatarUrl, setAvatarUrl] = useState(portfolioData.settings.avatarUrl);
  const [passcode, setPasscode] = useState(portfolioData.settings.passcode);
  const [showPasscode, setShowPasscode] = useState(false);
  const [isAvatarDragging, setIsAvatarDragging] = useState(false);
  
  // Status feedback
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleAvatarUpload = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxSize = 300; // Profile avatars can be smaller for great performance

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85); // 85% quality JPEG
          setAvatarUrl(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!passcode.trim()) return;

    onUpdateSettings({
      name: name.trim(),
      tagline: tagline.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      passcode: passcode.trim(),
      accentColor: portfolioData.settings.accentColor || '#1a73e8'
    });

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  // Export to JSON file
  const handleExport = () => {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${portfolioData.settings.name.toLowerCase().replace(/\s+/g, '_')}_portfolio_backup.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import from JSON file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target?.result as string);
          if (parsedData.settings && Array.isArray(parsedData.sections)) {
            onImportData(parsedData);
            // Update local form state too
            setName(parsedData.settings.name);
            setTagline(parsedData.settings.tagline);
            setBio(parsedData.settings.bio);
            setAvatarUrl(parsedData.settings.avatarUrl);
            setPasscode(parsedData.settings.passcode);
            alert("Portfolio data imported successfully!");
          } else {
            alert("Invalid backup file. Ensure it contains settings and sections.");
          }
        } catch (err) {
          alert("Failed to parse JSON file. Ensure the file is a valid backup.");
        }
      };
    }
  };

  return (
    <div 
      id="admin-panel-container"
      className="bg-gray-900 text-gray-100 py-4 px-4 sm:px-6 md:px-8 border-b border-gray-800 shadow-md relative z-40"
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gblue-500 p-2 rounded-xl flex items-center justify-center animate-pulse">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm tracking-wide uppercase text-gblue-100">Editor Workspace</h4>
                <span className="bg-ggreen-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">UNLOCKED</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs mt-0.5">
                {isSyncing ? (
                  <span className="flex items-center gap-1 text-gblue-400 font-medium">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Saving to live database...
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-ggreen-400 font-medium">
                    <Check className="w-3 h-3" /> Synchronized with live database (visible to everyone)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              id="btn-toggle-settings"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${isSettingsOpen ? 'bg-gblue-500 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-200'}`}
            >
              <Settings className="w-3.5 h-3.5" /> 
              {isSettingsOpen ? 'Hide General Settings' : 'Edit Bio & Passcode'}
            </button>

            <button 
              id="btn-export-backup"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-full text-xs font-semibold transition-all"
              title="Download backup file"
            >
              <Download className="w-3.5 h-3.5" /> Export Data
            </button>

            <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-full text-xs font-semibold transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Import Data
              <input 
                id="input-file-import"
                type="file" 
                accept=".json" 
                onChange={handleImport} 
                className="hidden" 
              />
            </label>
          </div>
        </div>

        {/* Dynamic Section Creator Panel (Quick Access) */}
        <div className="mt-4 pt-3 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
            <Plus className="w-3.5 h-3.5" /> CREATE NEW SECTION:
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              id="btn-add-sec-skills"
              onClick={() => onAddSection('skills', 'Skills & Expertise')}
              className="px-3 py-1 bg-gray-800 hover:bg-gred-500/10 hover:text-gred-500 border border-gray-700 hover:border-gred-500/30 rounded-lg text-xs font-medium transition-all"
            >
              + Skills Category
            </button>
            <button 
              id="btn-add-sec-exp"
              onClick={() => onAddSection('experience', 'Professional Experience')}
              className="px-3 py-1 bg-gray-800 hover:bg-ggreen-500/10 hover:text-ggreen-500 border border-gray-700 hover:border-ggreen-500/30 rounded-lg text-xs font-medium transition-all"
            >
              + Experience Section
            </button>
            <button 
              id="btn-add-sec-proj"
              onClick={() => onAddSection('projects', 'Featured Projects')}
              className="px-3 py-1 bg-gray-800 hover:bg-gyellow-500/10 hover:text-gyellow-500 border border-gray-700 hover:border-gyellow-500/30 rounded-lg text-xs font-medium transition-all"
            >
              + Projects Section
            </button>
            <button 
              id="btn-add-sec-edu"
              onClick={() => onAddSection('education', 'Education')}
              className="px-3 py-1 bg-gray-800 hover:bg-gblue-500/10 hover:text-gblue-500 border border-gray-700 hover:border-gblue-500/30 rounded-lg text-xs font-medium transition-all"
            >
              + Education Section
            </button>
            <button 
              id="btn-add-sec-cont"
              onClick={() => onAddSection('contact', 'Contact Information')}
              className="px-3 py-1 bg-gray-800 hover:bg-gblue-500/10 hover:text-gblue-500 border border-gray-700 hover:border-gblue-500/30 rounded-lg text-xs font-medium transition-all"
            >
              + Contact Directory
            </button>
            <button 
              id="btn-add-sec-certs"
              onClick={() => onAddSection('certifications', 'Certifications & Credentials')}
              className="px-3 py-1 bg-gray-800 hover:bg-gyellow-500/10 hover:text-gyellow-500 border border-gray-700 hover:border-gyellow-500/30 rounded-lg text-xs font-medium transition-all"
            >
              + Certifications Section
            </button>
          </div>
        </div>

        {/* Settings Collapsible Box */}
        {isSettingsOpen && (
          <div className="mt-4 p-5 bg-gray-850 rounded-2xl border border-gray-800 animate-slide-down">
            <h4 className="font-bold text-sm text-gblue-400 flex items-center gap-1.5 mb-4 border-b border-gray-800 pb-2">
              <User className="w-4 h-4" /> General Bio & Administration Security Settings
            </h4>
            
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                  <input 
                    id="input-set-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-gblue-500 transition-all outline-none"
                    placeholder="Richa Pandey"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Professional Tagline</label>
                  <input 
                    id="input-set-tagline"
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-gblue-500 transition-all outline-none"
                    placeholder="e.g., Lead Developer & UI Architect"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Short Biography</label>
                <textarea 
                  id="input-set-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-gblue-500 transition-all outline-none resize-none"
                  placeholder="Tell visitors who you are in a few sentences..."
                />
              </div>

              {/* Profile Picture Upload & Preview Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`bg-gray-800/40 p-4 rounded-xl border flex flex-col sm:flex-row gap-4 items-center transition-all ${
                    isAvatarDragging ? 'border-gblue-500 bg-gblue-500/10' : 'border-gray-800'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsAvatarDragging(true);
                  }}
                  onDragLeave={() => setIsAvatarDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsAvatarDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleAvatarUpload(file);
                  }}
                >
                  <div className="w-16 h-16 rounded-full border border-gray-700 bg-gray-900 overflow-hidden shrink-0 flex items-center justify-center relative group/avatar shadow-md">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Profile Preview" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-700" />
                    )}
                  </div>
                  <div className="flex-1 w-full text-center sm:text-left">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Profile Photo / Avatar</label>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <button
                          type="button"
                          onClick={() => document.getElementById('avatar-file-uploader')?.click()}
                          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border border-gray-700"
                        >
                          <Upload className="w-3 h-3" /> Upload Local Photo
                        </button>
                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setAvatarUrl('')}
                            className="px-3 py-1.5 bg-gred-500/10 text-gred-400 hover:bg-gred-500/20 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border border-gred-500/15"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500">Drag & drop image file or browse (PNG, JPG)</span>
                      <input 
                        id="avatar-file-uploader"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleAvatarUpload(file);
                        }}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between bg-gray-800/10 p-4 rounded-xl border border-gray-800/45">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Or Direct Web Image URL</label>
                    <input 
                      id="input-set-avatar"
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-gblue-500 transition-all outline-none"
                      placeholder="e.g., https://images.unsplash.com/photo-..."
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 leading-relaxed block mt-2">
                    Paste a link from Unsplash, LinkedIn or any source. Drag & drop or local upload is compressed automatically.
                  </span>
                </div>
              </div>

              {/* Security Key Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex justify-between items-center">
                    <span>Admin Mode Passcode (Custom Security Key)</span>
                    <button 
                      id="btn-reveal-code"
                      type="button" 
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="text-[10px] text-gblue-400 hover:underline hover:text-gblue-300"
                    >
                      {showPasscode ? 'Hide' : 'Reveal'}
                    </button>
                  </label>
                  <div className="relative">
                    <input 
                      id="input-set-passcode"
                      type={showPasscode ? "text" : "password"}
                      required
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white focus:border-gblue-500 transition-all outline-none"
                      placeholder="Richa123"
                    />
                    <Key className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-3" />
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500 px-1 pt-4">
                  The Admin passcode protects your workspace so only you can unlock the control center. Change it anytime.
                </div>
              </div>

              {/* Advanced Actions inside settings */}
              <div className="pt-3 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button 
                    id="btn-reset-blank"
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete all sections? This will make the portfolio completely blank as requested.")) {
                        onResetToBlank();
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gred-500/10 text-gred-400 border border-gred-500/20 hover:bg-gred-500/20 rounded-lg text-xs font-semibold transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Wipe and Start Blank
                  </button>
                </div>

                <button 
                  id="btn-save-settings"
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gblue-500 hover:bg-gblue-600 text-white text-xs font-bold rounded-full transition-all shadow-md"
                >
                  {saveStatus === 'saved' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" /> Settings Updated!
                    </>
                  ) : (
                    <>
                      Save Profile & Key
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
