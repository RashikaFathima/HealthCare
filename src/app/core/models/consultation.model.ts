export type ConsultationStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  symptoms: string;
  diagnosis: string;
  clinicalNotes: string;
  followUpInstructions: string;
  followUpDate?: string;
  status: ConsultationStatus;
  createdAt: string;
}
