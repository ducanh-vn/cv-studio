'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, Briefcase, DollarSign, MapPin, Calendar, Link as LinkIcon, FileText } from 'lucide-react';
import type { JobApplication, JobApplicationStatus, JobWorkType } from '@/types/jobTracker';
import { KANBAN_COLUMNS, TRACKER_TEXTS } from '@/constants/jobTrackerConstants';

export interface JobApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<JobApplication>) => void;
  initialData?: JobApplication | null;
  lang?: 'vi' | 'en';
}

export const JobApplicationFormModal: React.FC<JobApplicationFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  lang = 'vi',
}) => {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState<JobApplicationStatus>('wishlist');
  const [workType, setWorkType] = useState<JobWorkType>('hybrid');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || '');
      setPosition(initialData.position || '');
      setStatus(initialData.status || 'wishlist');
      setWorkType(initialData.workType || 'hybrid');
      setSalary(initialData.salary || '');
      setLocation(initialData.location || '');
      setJobUrl(initialData.jobUrl || '');
      setInterviewDate(initialData.interviewDate || '');
      setNotes(initialData.notes || '');
    } else {
      setCompany('');
      setPosition('');
      setStatus('wishlist');
      setWorkType('hybrid');
      setSalary('');
      setLocation('');
      setJobUrl('');
      setInterviewDate('');
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const texts = TRACKER_TEXTS[lang] || TRACKER_TEXTS.vi;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;

    onSave({
      ...(initialData || {}),
      company: company.trim(),
      position: position.trim(),
      status,
      workType,
      salary: salary.trim(),
      location: location.trim(),
      jobUrl: jobUrl.trim(),
      interviewDate: interviewDate.trim(),
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-[#161B26] border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-white font-semibold text-base">
              {initialData?.id ? texts.editJob : texts.addNewJob}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto text-xs text-neutral-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Tên công ty *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="VD: Google, VNG, Shopee..."
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Vị trí ứng tuyển *</label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="VD: Senior Frontend Engineer..."
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Trạng thái tuyển dụng</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobApplicationStatus)}
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 cursor-pointer"
              >
                {KANBAN_COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {lang === 'en' ? col.titleEn : col.titleVi}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Hình thức làm việc</label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value as JobWorkType)}
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="hybrid">Hybrid (Linh hoạt)</option>
                <option value="remote">Remote (Từ xa 100%)</option>
                <option value="onsite">Onsite (Tại văn phòng)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Mức lương mong muốn / đãi ngộ</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="VD: 30 - 45M VND, $2,000..."
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Địa điểm làm việc</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="VD: Hà Nội, TP.HCM, Singapore..."
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-medium">Link tin tuyển dụng (URL bài đăng)</label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-medium">Lịch hẹn phỏng vấn (nếu có)</label>
            <input
              type="text"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              placeholder="VD: 25/11 lúc 14:00 (Phỏng vấn với Head of Engineering)"
              className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-medium">Ghi chú riêng / Kinh nghiệm cần ôn</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú vòng thi, câu hỏi đã hỏi hoặc đãi ngộ cần lưu ý..."
              className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              {texts.cancelBtn}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium shadow-md transition-all cursor-pointer"
            >
              {texts.saveBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationFormModal;
