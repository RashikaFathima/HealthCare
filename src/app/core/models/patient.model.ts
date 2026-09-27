export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Patient {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup?: string;
  address: string;
  emergencyContact: EmergencyContact;
  avatarUrl?: string;
}
