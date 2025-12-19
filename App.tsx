
import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Scholarship, UserApplication, FilterState } from './types';
import { MOCK_SCHOLARSHIPS, FILTER_OPTIONS } from './constants';
import ScholarshipCard from './components/ScholarshipCard';
import { getSmartRecommendations, getScholarshipSummary } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [scholarships, setScholarships] = useState<Scholarship[]>(MOCK_SCHOLARSHIPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    fieldOfStudy: 'All',
    level: 'All',
    institutionType: 'All',
    fundType: 'All'
  });

  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [applications, setApplications] = useState<UserApplication[]>([
    { id: 'app1', scholarshipId: '2', status: 'Submitted', appliedDate: '2024-10-01' }
  ]);

  const toggleBookmark = (id: string) => {
    setScholarships(prev => prev.map(s => s.id === id ? { ...s, isBookmarked: !s.isBookmarked } : s));
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSearching(true);
    
    let baseResults = MOCK_SCHOLARSHIPS;
    
    // 1. AI or Text Search
    if (searchQuery.trim()) {
      const recommendedIds = await getSmartRecommendations(searchQuery, MOCK_SCHOLARSHIPS);
      baseResults = MOCK_SCHOLARSHIPS.filter(s => recommendedIds.includes(s.id));
    }

    // 2. Apply Manual Filters
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
    const defaultFilters = {
      fieldOfStudy: 'All',
      level: 'All',
      institutionType: 'All',
      fundType: 'All'
    };
    setFilters(defaultFilters);
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

      {/* Filter Panel */}
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
            <button 
              onClick={resetFilters}
              className="text-xs text-primary font-medium hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="space-y-4">
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
              <p className="text-sm">No scholarships match your current filters or search query.</p>
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
            <p>You haven't bookmarked any scholarships yet.</p>
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
              <div key={app.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                  <span className="material-icons-outlined">assignment</span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{s?.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-slate-500">{app.appliedDate}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
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
            <p>You haven't applied to any scholarships yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-4 flex-grow overflow-y-auto no-scrollbar">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Profile</h2>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6 text-center">
        <div className="w-24 h-24 mx-auto bg-slate-200 dark:bg-slate-700 rounded-full mb-4 flex items-center justify-center">
          <span className="material-icons-outlined text-4xl text-slate-400">person</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Alex Johnson</h3>
        <p className="text-slate-500 text-sm">Bachelor of Computer Science</p>
      </div>
      <div className="space-y-2">
        {['Personal Information', 'Educational History', 'Uploaded Documents', 'Settings', 'Help Center'].map((item) => (
          <button key={item} className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-left active:bg-slate-50 transition-colors">
            <span className="font-medium text-slate-700 dark:text-slate-300">{item}</span>
            <span className="material-icons-outlined text-slate-400">chevron_right</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="flex-grow flex flex-col h-full bg-white dark:bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-4 border-b dark:border-slate-800 flex items-center gap-4">
        <button onClick={() => setCurrentView('home')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <h2 className="font-bold text-lg line-clamp-1">Details</h2>
      </div>
      <div className="p-6 overflow-y-auto no-scrollbar flex-grow">
        <div className="flex items-center gap-2 mb-2">
           <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
            selectedScholarship?.status === 'OPEN' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {selectedScholarship?.status}
          </span>
          <h1 className="text-2xl font-bold leading-tight">{selectedScholarship?.title}</h1>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedScholarship?.tags.map(t => (
            <span key={t} className="text-xs font-medium py-1 px-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">{t}</span>
          ))}
          <span className="text-xs font-medium py-1 px-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">{selectedScholarship?.institutionType}</span>
          <span className="text-xs font-medium py-1 px-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">{selectedScholarship?.fundType}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Amount</p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{selectedScholarship?.amount}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Deadline</p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{selectedScholarship?.deadline}</p>
          </div>
        </div>

        <section className="mb-8">
          <h3 className="font-bold text-slate-400 uppercase text-[10px] mb-2 tracking-widest">AI Summary</h3>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 italic text-sm text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
            {summary}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="font-bold text-slate-400 uppercase text-[10px] mb-2 tracking-widest">Description</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            {selectedScholarship?.description}
          </p>
        </section>
      </div>
      <div className="p-4 border-t dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900">
        <button 
          onClick={() => applyForScholarship(selectedScholarship?.id || '')}
          className={`w-full py-4 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all ${
            selectedScholarship?.status === 'OPEN' ? 'bg-primary shadow-blue-500/30' : 'bg-slate-400 cursor-not-allowed'
          }`}
          disabled={selectedScholarship?.status === 'CLOSED'}
        >
          {selectedScholarship?.status === 'OPEN' ? 'Apply Now' : 'Application Closed'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-sm h-screen flex flex-col bg-background-light dark:bg-background-dark relative shadow-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
      {/* Header */}
      {currentView !== 'details' && (
        <header className="p-4 flex items-center justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-inner">
              <span className="material-icons-outlined text-2xl text-slate-600 dark:text-slate-300">school</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">EduGrant</h1>
          </div>
          <button className="relative p-2 active:scale-90 transition-transform">
            <span className="material-icons-outlined text-3xl text-slate-600 dark:text-slate-300">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
          </button>
        </header>
      )}

      {/* Main Content */}
      {currentView === 'home' && renderHome()}
      {currentView === 'saved' && renderSaved()}
      {currentView === 'applications' && renderApplications()}
      {currentView === 'profile' && renderProfile()}
      {currentView === 'details' && renderDetails()}

      {/* Bottom Nav */}
      {currentView !== 'details' && (
        <nav className="sticky bottom-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-20">
          <div className="flex justify-around items-center h-20">
            <button 
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'home' ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className="material-icons-outlined text-2xl">home</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
            </button>
            <button 
              onClick={() => setCurrentView('saved')}
              className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'saved' ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className="material-icons-outlined text-2xl">bookmark</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Saved</span>
            </button>
            <button 
              onClick={() => setCurrentView('applications')}
              className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'applications' ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className="material-icons-outlined text-2xl">assignment</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Applied</span>
            </button>
            <button 
              onClick={() => setCurrentView('profile')}
              className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'profile' ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className="material-icons-outlined text-2xl">person</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;
