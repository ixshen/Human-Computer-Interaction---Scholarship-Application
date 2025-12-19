
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Scholarship, UserApplication, FilterState, AppNotification } from './types';
import { MOCK_SCHOLARSHIPS, FILTER_OPTIONS, MOCK_NOTIFICATIONS } from './constants';
import ScholarshipCard from './components/ScholarshipCard';
import { getSmartRecommendations, getScholarshipSummary } from './services/geminiService';

interface UserProfile {
  name: string;
  education: string;
  level: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [scholarships, setScholarships] = useState<Scholarship[]>(MOCK_SCHOLARSHIPS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // User Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    education: 'Bachelor of Computer Science',
    level: 'Degree'
  });

  const [filters, setFilters] = useState<FilterState>({
    fieldOfStudy: 'All',
    level: 'All',
    institutionType: 'All',
    fundType: 'All'
  });

  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [applications, setApplications] = useState<UserApplication[]>([]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  const toggleBookmark = (id: string) => {
    setScholarships(prev => prev.map(s => s.id === id ? { ...s, isBookmarked: !s.isBookmarked } : s));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSearching(true);
    
    let baseResults = MOCK_SCHOLARSHIPS;
    
    if (searchQuery.trim()) {
      const recommendedIds = await getSmartRecommendations(searchQuery, MOCK_SCHOLARSHIPS);
      baseResults = MOCK_SCHOLARSHIPS.filter(s => recommendedIds.includes(s.id));
    }

    const filtered = baseResults.filter(s => {
      const matchStudy = filters.fieldOfStudy === 'All' || s.category === filters.fieldOfStudy;
      const matchLevel = filters.level === 'All' || s.level === filters.level;
      const matchInst = filters.institutionType === 'All' || s.institutionType === filters.institutionType || s.institutionType === 'Any';
      const matchFund = filters.fundType === 'All' || s.fundType === filters.fundType;
      return matchStudy && matchLevel && matchInst && matchFund;
    });

    setScholarships(filtered);
    setIsSearching(false);
  };

  const resetFilters = () => {
    setFilters({
      fieldOfStudy: 'All',
      level: 'All',
      institutionType: 'All',
      fundType: 'All'
    });
    setSearchQuery('');
    setScholarships(MOCK_SCHOLARSHIPS);
  };

  const openScholarship = async (s: Scholarship) => {
    setSelectedScholarship(s);
    setSummary('Summarizing with Gemini AI...');
    setCurrentView('details');
    const aiSummary = await getScholarshipSummary(s);
    setSummary(aiSummary);
  };

  const applyForScholarship = (id: string) => {
    if (applications.some(app => app.scholarshipId === id)) return;
    const newApp: UserApplication = {
      id: Math.random().toString(36).substr(2, 9),
      scholarshipId: id,
      status: 'In Progress',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    setApplications([...applications, newApp]);
    alert("Application started! Check 'My Applications' to complete it.");
  };

  const renderHome = () => (
    <div className="p-4 flex-grow overflow-y-auto no-scrollbar">
      <div className="mb-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Welcome back,</h2>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{userProfile.name}</h3>
      </div>
      <div className="flex flex-col gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative w-full flex items-center">
          <span className="material-icons-outlined absolute left-4 text-slate-400 dark:text-slate-500">search</span>
          <input 
            className="w-full pl-11 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-primary focus:border-primary focus:bg-white dark:focus:bg-slate-700 transition-all outline-none text-sm" 
            placeholder="Smart search (e.g. 'engineering')" 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-4 text-primary font-bold text-sm">
            {isSearching ? <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" /> : 'GO'}
          </button>
        </form>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all font-semibold text-sm ${showFilters ? 'bg-primary text-white shadow-lg' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
        >
          <span className="material-icons-outlined text-lg">tune</span>
          <span>{showFilters ? 'Hide Filters' : 'Filter Options'}</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md border border-slate-100 dark:border-slate-700 mb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-900 dark:text-white uppercase mb-1 tracking-tight">Field of Study</label>
              <select 
                value={filters.fieldOfStudy}
                onChange={(e) => setFilters({...filters, fieldOfStudy: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-lg text-xs p-2 text-slate-700 dark:text-slate-200"
              >
                {FILTER_OPTIONS.fieldOfStudy.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-900 dark:text-white uppercase mb-1 tracking-tight">Incoming Level</label>
              <select 
                value={filters.level}
                onChange={(e) => setFilters({...filters, level: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-lg text-xs p-2 text-slate-700 dark:text-slate-200"
              >
                {FILTER_OPTIONS.level.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-900 dark:text-white uppercase mb-1 tracking-tight">Institution Type</label>
              <select 
                value={filters.institutionType}
                onChange={(e) => setFilters({...filters, institutionType: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-lg text-xs p-2 text-slate-700 dark:text-slate-200"
              >
                {FILTER_OPTIONS.institutionType.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-900 dark:text-white uppercase mb-1 tracking-tight">Type of Fund</label>
              <select 
                value={filters.fundType}
                onChange={(e) => setFilters({...filters, fundType: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-lg text-xs p-2 text-slate-700 dark:text-slate-200"
              >
                {FILTER_OPTIONS.fundType.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button 
              onClick={resetFilters}
              className="flex-1 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              Reset
            </button>
            <button 
              onClick={() => { handleSearch(); setShowFilters(false); }}
              className="flex-[2] py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recommended</h2>
          {(searchQuery || filters.fieldOfStudy !== 'All' || filters.level !== 'All') && (
            <button onClick={resetFilters} className="text-xs text-primary font-medium hover:underline">Clear All</button>
          )}
        </div>
        <div className="space-y-4 pb-10">
          {scholarships.map(s => (
            <ScholarshipCard 
              key={s.id} 
              scholarship={s} 
              onToggleBookmark={toggleBookmark} 
              onClick={openScholarship}
            />
          ))}
          {scholarships.length === 0 && (
            <div className="text-center py-20 text-slate-400 px-6">
              <span className="material-icons-outlined text-4xl mb-4 block">sentiment_dissatisfied</span>
              <p className="text-sm">No scholarships match your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderSaved = () => (
    <div className="p-4 flex-grow overflow-y-auto no-scrollbar">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Saved</h2>
      <div className="space-y-4">
        {scholarships.filter(s => s.isBookmarked).length > 0 ? (
          scholarships.filter(s => s.isBookmarked).map(s => (
            <ScholarshipCard 
              key={s.id} 
              scholarship={s} 
              onToggleBookmark={toggleBookmark} 
              onClick={openScholarship}
            />
          ))
        ) : (
          <div className="text-center py-20 text-slate-400">
            <span className="material-icons-outlined text-5xl mb-2">bookmark_border</span>
            <p>No saved scholarships.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="p-4 flex-grow overflow-y-auto no-scrollbar animate-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Activity</h2>
        <button onClick={markAllAsRead} className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Mark all as read</button>
      </div>
      <div className="space-y-3">
        {notifications.map(note => (
          <div key={note.id} className={`p-4 rounded-2xl border transition-all flex gap-4 ${note.isRead ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-800/50 border-primary/20 shadow-sm'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              note.type === 'deadline' ? 'bg-red-50 text-red-500' : 
              note.type === 'match' ? 'bg-primary/10 text-primary' : 
              note.type === 'status' ? 'bg-emerald-50 text-emerald-500' : 
              'bg-slate-100 text-slate-400'
            }`}>
              <span className="material-icons-outlined text-xl">
                {note.type === 'deadline' ? 'alarm' : 
                 note.type === 'match' ? 'auto_awesome' : 
                 note.type === 'status' ? 'sync' : 
                 'info'}
              </span>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <h4 className={`text-sm font-bold ${note.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>{note.title}</h4>
                <span className="text-[9px] text-slate-400 font-medium">{note.timestamp}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{note.message}</p>
            </div>
            {!note.isRead && (
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
            )}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <span className="material-icons-outlined text-5xl mb-2 opacity-20">notifications_off</span>
            <p className="text-sm">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="p-4 flex-grow overflow-y-auto no-scrollbar">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">My Applications</h2>
      <div className="space-y-4">
        {applications.length > 0 ? (
          applications.map(app => {
            const s = MOCK_SCHOLARSHIPS.find(item => item.id === app.scholarshipId);
            return (
              <div key={app.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex items-center gap-4 border border-slate-100 dark:border-slate-700">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                  <span className="material-icons-outlined">assignment</span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 text-sm">{s?.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">{app.appliedDate}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 text-slate-400">
            <span className="material-icons-outlined text-5xl mb-2">inbox</span>
            <p>No applications yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-4 flex-grow overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Profile</h2>
        {!isEditingProfile && (
          <button 
            onClick={() => setIsEditingProfile(true)}
            className="text-primary text-sm font-bold flex items-center gap-1"
          >
            <span className="material-icons-outlined text-sm">edit</span>
            EDIT
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6 border border-slate-100 dark:border-slate-700">
        <div className="w-24 h-24 mx-auto bg-slate-100 dark:bg-slate-900 rounded-full mb-6 flex items-center justify-center border-4 border-slate-50 dark:border-slate-700">
          <span className="material-icons-outlined text-4xl text-slate-400">person</span>
        </div>

        {isEditingProfile ? (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
              <input 
                type="text" 
                value={userProfile.name}
                onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-lg text-sm p-3 text-slate-800 dark:text-slate-100 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Current Major / Education</label>
              <input 
                type="text" 
                value={userProfile.education}
                onChange={(e) => setUserProfile({...userProfile, education: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-lg text-sm p-3 text-slate-800 dark:text-slate-100 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Academic Level</label>
              <select 
                value={userProfile.level}
                onChange={(e) => setUserProfile({...userProfile, level: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-900 border-transparent rounded-lg text-sm p-3 text-slate-800 dark:text-slate-100 focus:ring-primary"
              >
                {FILTER_OPTIONS.level.filter(l => l !== 'All').map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button 
              onClick={() => setIsEditingProfile(false)}
              className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-md active:scale-95 transition-all mt-2"
            >
              Save Profile
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{userProfile.name}</h3>
            <p className="text-slate-500 text-sm mb-1">{userProfile.education}</p>
            <span className="inline-block text-[10px] font-black py-0.5 px-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded uppercase tracking-widest">
              {userProfile.level}
            </span>
          </div>
        )}
      </div>

      {!isEditingProfile && (
        <div className="space-y-2">
          {['Educational History', 'Uploaded Documents', 'Bank Details', 'Privacy Settings', 'Help & Feedback'].map((item) => (
            <button key={item} className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-50 dark:border-slate-700 text-left active:bg-slate-50 transition-colors">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</span>
              <span className="material-icons-outlined text-slate-400 text-sm">chevron_right</span>
            </button>
          ))}
          <button className="w-full py-4 text-red-500 text-sm font-bold uppercase tracking-widest mt-4">Sign Out</button>
        </div>
      )}
    </div>
  );

  const renderDetails = () => (
    <div className="flex-grow flex flex-col h-full bg-white dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-4 border-b dark:border-slate-800 flex items-center gap-4">
        <button onClick={() => setCurrentView('home')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <h2 className="font-bold text-lg line-clamp-1">Scholarship Details</h2>
      </div>
      <div className="p-6 overflow-y-auto no-scrollbar flex-grow pb-32">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
             <span className={`text-[10px] font-black px-2.5 py-1.5 rounded leading-none tracking-widest uppercase ${
              selectedScholarship?.status === 'OPEN' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {selectedScholarship?.status}
            </span>
          </div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 dark:text-white">{selectedScholarship?.title}</h1>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            selectedScholarship?.category,
            selectedScholarship?.level,
            selectedScholarship?.institutionType,
            selectedScholarship?.fundType
          ].map((t, idx) => (
            <span key={idx} className="text-[10px] font-bold py-1.5 px-3 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg uppercase tracking-tight border border-slate-100 dark:border-slate-700">
              {t}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Fund Amount</p>
            <div className="flex items-center gap-2">
              <span className="material-icons-outlined text-slate-400 text-base">payments</span>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-200">{selectedScholarship?.amount}</p>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Application Deadline</p>
            <div className="flex items-center gap-2">
              <span className="material-icons-outlined text-slate-400 text-base">event</span>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-200">{selectedScholarship?.deadline}</p>
            </div>
          </div>
        </div>

        <section className="mb-10">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 uppercase text-[11px] mb-3 tracking-widest flex items-center gap-2">
            <span className="material-icons-outlined text-sm">auto_awesome</span>
            AI Insights
          </h3>
          <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700 italic text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed shadow-inner">
            {summary}
          </div>
        </section>

        <section className="mb-10">
          <h3 className="font-bold text-slate-400 uppercase text-[11px] mb-3 tracking-widest">Full Description</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            {selectedScholarship?.description}
          </p>
        </section>
      </div>
      <div className="p-6 border-t dark:border-slate-800 absolute bottom-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <button 
          onClick={() => applyForScholarship(selectedScholarship?.id || '')}
          className={`w-full py-4 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all text-sm uppercase tracking-widest ${
            selectedScholarship?.status === 'OPEN' ? 'bg-primary shadow-blue-500/20' : 'bg-slate-400 cursor-not-allowed shadow-none'
          }`}
          disabled={selectedScholarship?.status === 'CLOSED'}
        >
          {selectedScholarship?.status === 'OPEN' ? 'Apply Now' : 'Closed'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-sm h-screen flex flex-col bg-background-light dark:bg-background-dark relative shadow-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
      {currentView !== 'details' && (
        <header className="p-5 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 dark:bg-slate-100 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3">
              <span className="material-icons-outlined text-2xl text-white dark:text-slate-900">school</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">EduGrant</h1>
          </div>
          <button 
            onClick={() => setCurrentView('notifications')}
            className={`relative p-2 active:scale-90 transition-transform rounded-full ${currentView === 'notifications' ? 'bg-primary/10 text-primary' : 'text-slate-400'}`}
          >
            <span className="material-icons-outlined text-2xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-[8px] text-white flex items-center justify-center font-black rounded-full ring-2 ring-background-light dark:ring-background-dark animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </header>
      )}

      {currentView === 'home' && renderHome()}
      {currentView === 'saved' && renderSaved()}
      {currentView === 'notifications' && renderNotifications()}
      {currentView === 'applications' && renderApplications()}
      {currentView === 'profile' && renderProfile()}
      {currentView === 'details' && renderDetails()}

      {currentView !== 'details' && (
        <nav className="sticky bottom-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-20">
          <div className="flex justify-around items-center h-20">
            {[
              { id: 'home', icon: 'home', label: 'Home' },
              { id: 'saved', icon: 'bookmark', label: 'Saved' },
              { id: 'applications', icon: 'assignment', label: 'Applied' },
              { id: 'profile', icon: 'person', label: 'Profile' }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => { setCurrentView(item.id as AppView); setIsEditingProfile(false); }}
                className={`flex flex-col items-center gap-1.5 transition-all px-4 py-2 rounded-xl ${currentView === item.id ? 'text-primary scale-110' : 'text-slate-400 opacity-60'}`}
              >
                <span className="material-icons-outlined text-2xl">{item.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;
