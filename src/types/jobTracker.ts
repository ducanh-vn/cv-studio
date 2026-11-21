export type JobApplicationStatus = 'wishlist' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export type JobWorkType = 'remote' | 'onsite' | 'hybrid';

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: JobApplicationStatus;
  location?: string;
  workType?: JobWorkType;
  salary?: string;
  jobUrl?: string;
  appliedCvProfileId?: string;
  appliedCvProfileName?: string;
  appliedDate?: string;
  interviewDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumnDef {
  id: JobApplicationStatus;
  titleVi: string;
  titleEn: string;
  color: string;
  borderColor: string;
  bgColor: string;
  badgeBg: string;
  badgeText: string;
  iconName: string;
}

export interface JobTrackerStats {
  total: number;
  wishlist: number;
  applied: number;
  interviewing: number;
  offer: number;
  rejected: number;
  responseRate: number;
}
