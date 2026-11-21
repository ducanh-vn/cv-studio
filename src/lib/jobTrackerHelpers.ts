import type { JobApplication, JobApplicationStatus, JobTrackerStats } from '@/types/jobTracker';

const STATUS_ORDER: JobApplicationStatus[] = ['wishlist', 'applied', 'interviewing', 'offer', 'rejected'];

/**
 * Calculates high-level job application statistics.
 */
export function calculateTrackerStats(jobs: JobApplication[]): JobTrackerStats {
  const stats: JobTrackerStats = {
    total: jobs.length,
    wishlist: 0,
    applied: 0,
    interviewing: 0,
    offer: 0,
    rejected: 0,
    responseRate: 0,
  };

  jobs.forEach((job) => {
    if (job.status in stats) {
      stats[job.status]++;
    }
  });

  const responses = stats.interviewing + stats.offer;
  const denominator = stats.applied + stats.interviewing + stats.offer + stats.rejected;
  stats.responseRate = denominator > 0 ? Math.round((responses / denominator) * 100) : 0;

  return stats;
}

/**
 * Pure filter searching by query and optional status category.
 */
export function filterJobs(
  jobs: JobApplication[],
  searchTerm: string = '',
  statusFilter: string = 'all'
): JobApplication[] {
  const term = searchTerm.trim().toLowerCase();

  return jobs.filter((job) => {
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    if (!matchesStatus) return false;

    if (!term) return true;
    return (
      job.company.toLowerCase().includes(term) ||
      job.position.toLowerCase().includes(term) ||
      (job.location && job.location.toLowerCase().includes(term)) ||
      (job.notes && job.notes.toLowerCase().includes(term))
    );
  });
}

/**
 * Returns the next logical kanban status column or null if at the end.
 */
export function getNextStatus(current: JobApplicationStatus): JobApplicationStatus | null {
  if (current === 'wishlist') return 'applied';
  if (current === 'applied') return 'interviewing';
  if (current === 'interviewing') return 'offer';
  return null;
}

/**
 * Returns the previous logical kanban status column or null if at the start.
 */
export function getPrevStatus(current: JobApplicationStatus): JobApplicationStatus | null {
  if (current === 'offer') return 'interviewing';
  if (current === 'interviewing') return 'applied';
  if (current === 'applied') return 'wishlist';
  if (current === 'rejected') return 'applied';
  return null;
}

/**
 * Factory creating a fresh JobApplication object with timestamps and unique ID.
 */
export function createNewApplication(data: Partial<JobApplication>): JobApplication {
  const now = new Date().toISOString();
  return {
    id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    company: data.company?.trim() || 'Công ty mới',
    position: data.position?.trim() || 'Software Engineer',
    status: data.status || 'wishlist',
    location: data.location?.trim() || '',
    workType: data.workType || 'hybrid',
    salary: data.salary?.trim() || '',
    jobUrl: data.jobUrl?.trim() || '',
    appliedCvProfileId: data.appliedCvProfileId || '',
    appliedCvProfileName: data.appliedCvProfileName || '',
    appliedDate: data.appliedDate || '',
    interviewDate: data.interviewDate || '',
    notes: data.notes?.trim() || '',
    createdAt: now,
    updatedAt: now,
  };
}
