'use client';

import React from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  DollarSign,
  FileText,
} from 'lucide-react';
import type { JobApplication, JobApplicationStatus } from '@/types/jobTracker';
import { getNextStatus, getPrevStatus } from '@/lib/jobTrackerHelpers';

export interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onMoveStatus: (id: string, newStatus: JobApplicationStatus) => void;
  lang?: 'vi' | 'en';
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onEdit,
  onDelete,
  onMoveStatus,
  lang = 'vi',
}) => {
  const prevStatus = getPrevStatus(job.status);
  const nextStatus = getNextStatus(job.status);

  return (
    <div className="bg-[#181F2E] border border-white/10 hover:border-white/25 rounded-xl p-3.5 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between space-y-3">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm truncate flex items-center space-x-1.5" title={job.company}>
              <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{job.company}</span>
            </h4>
            <p className="text-xs text-neutral-300 font-medium mt-0.5 line-clamp-1" title={job.position}>
              {job.position}
            </p>
          </div>

          {job.workType && (
            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-white/5 border border-white/10 text-neutral-300">
              {job.workType}
            </span>
          )}
        </div>

        {/* Metadata Details */}
        <div className="mt-2.5 space-y-1 text-[11px] text-neutral-400">
          {job.salary && (
            <div className="flex items-center space-x-1 text-emerald-400 font-medium">
              <DollarSign className="w-3 h-3 shrink-0" />
              <span>{job.salary}</span>
            </div>
          )}

          {job.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 shrink-0 text-neutral-500" />
              <span className="truncate">{job.location}</span>
            </div>
          )}

          {job.interviewDate && (
            <div className="flex items-center space-x-1 text-amber-300 font-medium bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
              <Calendar className="w-3 h-3 shrink-0 text-amber-400" />
              <span className="truncate">{job.interviewDate}</span>
            </div>
          )}

          {job.appliedCvProfileName && (
            <div className="flex items-center space-x-1 text-neutral-400 truncate pt-0.5">
              <FileText className="w-3 h-3 shrink-0 text-neutral-500" />
              <span className="truncate font-mono text-[10px]">{job.appliedCvProfileName}</span>
            </div>
          )}

          {job.notes && (
            <p className="text-[10px] text-neutral-400 italic line-clamp-2 pt-1 border-t border-white/5">
              &ldquo;{job.notes}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
        {/* Move Left */}
        <div>
          {prevStatus ? (
            <button
              type="button"
              onClick={() => onMoveStatus(job.id, prevStatus)}
              className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title={lang === 'en' ? 'Move to previous column' : 'Chuyển về cột trước'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <span className="w-4 inline-block" />
          )}
        </div>

        {/* Center Controls: Link, Edit, Delete */}
        <div className="flex items-center space-x-1">
          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-cyan-400 transition-colors"
              title={lang === 'en' ? 'Open Job Link' : 'Mở link tuyển dụng'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={() => onEdit(job)}
            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={lang === 'en' ? 'Edit application' : 'Chỉnh sửa đơn'}
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(job.id)}
            className="p-1 rounded hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
            title={lang === 'en' ? 'Delete application' : 'Xóa đơn'}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Move Right */}
        <div>
          {nextStatus ? (
            <button
              type="button"
              onClick={() => onMoveStatus(job.id, nextStatus)}
              className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title={lang === 'en' ? 'Move to next column' : 'Chuyển sang cột tiếp theo'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="w-4 inline-block" />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
