'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { JobApplication, JobApplicationStatus } from '@/types/jobTracker';
import {
  JOB_TRACKER_STORAGE_KEY,
  DEFAULT_SAMPLE_JOBS,
  getUserJobTrackerStorageKey,
} from '@/constants/jobTrackerConstants';
import {
  calculateTrackerStats,
  filterJobs,
  createNewApplication,
} from '@/lib/jobTrackerHelpers';

export function useJobTracker(userId: string = 'guest') {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Initialize from user-scoped localStorage
  useEffect(() => {
    setIsLoaded(false);
    const storageKey = getUserJobTrackerStorageKey(userId);
    try {
      let raw = localStorage.getItem(storageKey);

      // Migration fallback: if guest and no guest key yet, import legacy single-user data
      if (!raw && (!userId || userId === 'guest')) {
        const legacyRaw = localStorage.getItem(JOB_TRACKER_STORAGE_KEY);
        if (legacyRaw) {
          raw = legacyRaw;
          localStorage.setItem(storageKey, legacyRaw);
        }
      }

      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setJobs(parsed);
          setIsLoaded(true);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved job applications:', e);
    }

    // Default sample seed for new accounts or guests
    setJobs(DEFAULT_SAMPLE_JOBS);
    setIsLoaded(true);
  }, [userId]);

  // Sync to user-scoped localStorage
  useEffect(() => {
    if (!isLoaded) return;
    const storageKey = getUserJobTrackerStorageKey(userId);
    try {
      localStorage.setItem(storageKey, JSON.stringify(jobs));
    } catch (e) {
      console.error('Failed to save job applications:', e);
    }
  }, [jobs, isLoaded, userId]);

  const stats = useMemo(() => calculateTrackerStats(jobs), [jobs]);

  const filteredJobs = useMemo(
    () => filterJobs(jobs, searchTerm, statusFilter),
    [jobs, searchTerm, statusFilter]
  );

  const addJob = useCallback((data: Partial<JobApplication>) => {
    const newApp = createNewApplication(data);
    setJobs((prev) => [newApp, ...prev]);
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<JobApplication>) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id
          ? { ...job, ...updates, updatedAt: new Date().toISOString() }
          : job
      )
    );
  }, []);

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }, []);

  const moveJobStatus = useCallback(
    (id: string, newStatus: JobApplicationStatus) => {
      updateJob(id, { status: newStatus });
    },
    [updateJob]
  );

  const openCreateForm = useCallback((defaultStatus: JobApplicationStatus = 'wishlist') => {
    setEditingJob(createNewApplication({ status: defaultStatus }));
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((job: JobApplication) => {
    setEditingJob(job);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setEditingJob(null);
    setIsFormOpen(false);
  }, []);

  const resetToDefaults = useCallback(() => {
    setJobs(DEFAULT_SAMPLE_JOBS);
  }, []);

  return {
    jobs,
    filteredJobs,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    editingJob,
    isFormOpen,
    openCreateForm,
    openEditForm,
    closeForm,
    addJob,
    updateJob,
    deleteJob,
    moveJobStatus,
    resetToDefaults,
  };
}
