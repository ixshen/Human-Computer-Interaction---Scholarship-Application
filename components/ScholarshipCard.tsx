
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
      className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm active:scale-[0.98] transition-all cursor-pointer border border-slate-100 dark:border-slate-700 hover:shadow-md"
      onClick={() => onClick(scholarship)}
    >
      <div className="flex justify-between items-start gap-4 mb-3">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight flex-grow">
          {scholarship.title}
        </h3>
        <button 
          className="p-1 -mr-1 -mt-1 shrink-0 transition-transform active:scale-125" 
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(scholarship.id);
          }}
        >
          <span className={`material-icons-outlined text-2xl ${scholarship.isBookmarked ? 'text-primary' : 'text-slate-300 dark:text-slate-600'}`}>
            {scholarship.isBookmarked ? 'bookmark' : 'bookmark_border'}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-[10px] font-black px-2.5 py-1 rounded leading-none tracking-widest uppercase ${
          scholarship.status === 'OPEN' 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {scholarship.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        <span className="text-[10px] font-bold py-1 px-2.5 rounded bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase tracking-tight border border-slate-200 dark:border-slate-700">
          {scholarship.category}
        </span>
        <span className="text-[10px] font-bold py-1 px-2.5 rounded bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase tracking-tight border border-slate-200 dark:border-slate-700">
          {scholarship.level}
        </span>
        <span className="text-[10px] font-bold py-1 px-2.5 rounded bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase tracking-tight border border-slate-200 dark:border-slate-700">
          {scholarship.institutionType}
        </span>
        <span className="text-[10px] font-bold py-1 px-2.5 rounded bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 uppercase tracking-tight border border-slate-200 dark:border-slate-700">
          {scholarship.fundType}
        </span>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-700/50">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Fund Amount</span>
          <div className="flex items-center gap-1.5">
            <span className="material-icons-outlined text-sm text-slate-400">payments</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{scholarship.amount}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Deadline</span>
          <div className="flex items-center gap-1.5">
            <span className="material-icons-outlined text-sm text-slate-400">event</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{scholarship.deadline}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCard;
