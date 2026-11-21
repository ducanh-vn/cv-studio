'use client';

import React from 'react';
import {
  X,
  Plus,
  Search,
  Kanban,
  Target,
  Send,
  MessageSquare,
  PartyPopper,
  ArchiveX,
  TrendingUp,
} from 'lucide-react';
import { KANBAN_COLUMNS, TRACKER_TEXTS } from '@/constants/jobTrackerConstants';
import { useJobTracker } from '@/hooks/useJobTracker';
import { JobCard } from '@/components/tracker/JobCard';
import { JobApplicationFormModal } from '@/components/tracker/JobApplicationFormModal';
import type { JobApplicationStatus } from '@/types/jobTracker';

export interface JobTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'vi' | 'en';
}

const COLUMN_ICONS: Record<string, React.ReactNode> = {
  Target: <Target className="w-4 h-4 text-neutral-400" />,
  Send: <Send className="w-4 h-4 text-blue-400" />,
  MessageSquare: <MessageSquare className="w-4 h-4 text-amber-400" />,
  PartyPopper: <PartyPopper className="w-4 h-4 text-emerald-400" />,
  ArchiveX: <ArchiveX className="w-4 h-4 text-rose-400" />,
};

export const JobTrackerModal: React.FC<JobTrackerModalProps> = ({
  isOpen,
  onClose,
  lang = 'vi',
}) => {
  const {
    filteredJobs,
    stats,
    searchTerm,
    setSearchTerm,
    editingJob,
    isFormOpen,
    openCreateForm,
    openEditForm,
    closeForm,
    addJob,
    updateJob,
    deleteJob,
    moveJobStatus,
  } = useJobTracker();

  if (!isOpen) return null;

  const texts = TRACKER_TEXTS[lang] || TRACKER_TEXTS.vi;

  const handleSaveForm = (data: any) => {
    if (editingJob && editingJob.id && !editingJob.id.startsWith('new-')) {
      updateJob(editingJob.id, data);
    } else {
      addJob(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-white/15 rounded-2xl w-full max-w-7xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#161B26]/80">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base sm:text-lg flex items-center space-x-2">
                <span>{texts.title}</span>
              </h2>
              <p className="text-xs text-neutral-400 hidden sm:block">
                {texts.subtitle}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center space-x-2 text-xs select-none flex-wrap gap-y-1">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono">
              {texts.statTotal}: <strong className="text-white">{stats.total}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono">
              {texts.statInterviewing}: <strong>{stats.interviewing}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono">
              {texts.statOffer}: <strong>{stats.offer}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono flex items-center space-x-1">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              <span>{texts.statRate}: <strong>{stats.responseRate}%</strong></span>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between gap-3 bg-[#131926]">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={texts.searchPlaceholder}
              className="w-full bg-[#1A2234] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="button"
            onClick={() => openCreateForm('wishlist')}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-md transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{texts.addNewJob}</span>
          </button>
        </div>

        {/* 5-Column Kanban Board Workspace */}
        <div className="flex-1 overflow-x-auto p-4 flex gap-4 bg-[#0B101B] custom-scrollbar-x">
          {KANBAN_COLUMNS.map((column) => {
            const columnJobs = filteredJobs.filter((j) => j.status === column.id);

            return (
              <div
                key={column.id}
                className={`w-72 sm:w-80 shrink-0 flex flex-col rounded-xl border ${column.borderColor} ${column.bgColor} backdrop-blur-xs overflow-hidden max-h-full`}
              >
                {/* Column Header */}
                <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between bg-black/20">
                  <div className="flex items-center space-x-2">
                    {COLUMN_ICONS[column.iconName]}
                    <h3 className={`font-semibold text-xs ${column.color}`}>
                      {lang === 'en' ? column.titleEn : column.titleVi}
                    </h3>
                    <span className={`px-2 py-0.2 rounded-full font-mono text-[10px] font-bold ${column.badgeBg} ${column.badgeText}`}>
                      {columnJobs.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openCreateForm(column.id as JobApplicationStatus)}
                    className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title={texts.addNewJob}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                  {columnJobs.length > 0 ? (
                    columnJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onEdit={openEditForm}
                        onDelete={(id) => {
                          if (window.confirm(texts.confirmDelete)) {
                            deleteJob(id);
                          }
                        }}
                        onMoveStatus={moveJobStatus}
                        lang={lang}
                      />
                    ))
                  ) : (
                    <div className="h-28 border border-dashed border-white/10 rounded-xl flex items-center justify-center p-4 text-center">
                      <span className="text-[11px] text-neutral-500 italic">
                        {texts.emptyColumn}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Job Application Add/Edit Form Modal */}
        <JobApplicationFormModal
          isOpen={isFormOpen}
          onClose={closeForm}
          onSave={handleSaveForm}
          initialData={editingJob}
          lang={lang}
        />
      </div>
    </div>
  );
};

export default JobTrackerModal;
