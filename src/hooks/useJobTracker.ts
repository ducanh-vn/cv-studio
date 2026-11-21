'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { JobApplication, JobApplicationStatus } from '@/types/jobTracker';
import { JOB_TRACKER_STORAGE_KEY, DEFAULT_SAMPLE_JOBS } from '@/constants/jobTrackerConstants';
import {
  calculateTrackerStats,
  filterJobs,
  createNewApplication,
} from '@/lib/jobTrackerHelpers';

export function useJobTracker() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(JOB_TRACKER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setJobs(parsed);
          setIsLoaded(true);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved job applications:', e);
    }

    // Default sample seed
    setJobs(DEFAULT_SAMPLE_JOBS);
    setIsLoaded(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(JOB_TRACKER_STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
      console.error('Failed to save job applications:', e);
    }
  }, [jobs, isLoaded]);

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
