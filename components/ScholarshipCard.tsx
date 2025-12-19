
import React from 'react';
import { Scholarship } from '../types';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onToggleBookmark: (id: string) => void;
  onClick: (scholarship: Scholarship) => void;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship, onToggleBookmark, onClick }) => {
  return (
    <div 
      className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm active:scale-[0.98] transition-transform cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
      onClick={() => onClick(scholarship)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-grow pr-4">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded leading-none ${
              scholarship.status === 'OPEN' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {scholarship.status}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{scholarship.title}</h3>
          </div>
        </div>
        <button 
          className="p-1 -mr-1 -mt-1" 
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(scholarship.id);
          }}
        >
          <span className={`material-icons-outlined text-2xl ${scholarship.isBookmarked ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>
            {scholarship.isBookmarked ? 'bookmark' : 'bookmark_border'}
          </span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {scholarship.tags.map(tag => (
          <span key={tag} className="text-[10px] font-medium py-1 px-2.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {tag}
          </span>
        ))}
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium ml-auto self-center">
          {scholarship.deadline}
        </span>
      </div>
    </div>
  );
};

export default ScholarshipCard;
