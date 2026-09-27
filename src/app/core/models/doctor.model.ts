export type DoctorApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Doctor {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  department: string;
  consultationFee: number;
  rating: number;
  bio: string;
  avatarUrl?: string;
  approvalStatus: DoctorApprovalStatus;
  isAvailableToday: boolean;
}
