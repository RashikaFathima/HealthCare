import { MedicalRecord } from '../models';

export const MOCK_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-001',
    patientId: 'pat-001',
    doctorId: 'doc-002',
    doctorName: 'Dr. Kavya Iyer',
    specialization: 'Dermatology',
    visitDate: '2026-08-14',
    diagnosis: 'Contact dermatitis',
    consultationNotes: 'Mild inflammation observed, no signs of infection. Advised to avoid known allergen.',
    prescriptionId: 'rx-001',
    attachmentName: 'dermatology-visit-summary.pdf'
  },
  {
    id: 'rec-002',
    patientId: 'pat-001',
    doctorId: 'doc-003',
    doctorName: 'Dr. Sanjay Rao',
    specialization: 'Orthopedics',
    visitDate: '2026-07-02',
    diagnosis: 'Patellofemoral pain syndrome',
    consultationNotes: 'No swelling or instability. Recommended physiotherapy and activity modification.',
    prescriptionId: 'rx-002',
    attachmentName: 'ortho-visit-summary.pdf'
  },
  {
    id: 'rec-003',
    patientId: 'pat-001',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rohan Mehta',
    specialization: 'Cardiology',
    visitDate: '2026-03-11',
    diagnosis: 'Routine cardiac screening — normal',
    consultationNotes: 'ECG and BP within normal range. No follow-up required.',
    attachmentName: 'cardiology-checkup.pdf'
  }
];
