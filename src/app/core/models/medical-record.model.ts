export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  visitDate: string;
  diagnosis: string;
  consultationNotes: string;
  prescriptionId?: string;
  attachmentName?: string;
}
