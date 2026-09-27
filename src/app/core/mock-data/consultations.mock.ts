import { Consultation } from '../models';

export const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: 'con-001',
    appointmentId: 'apt-002',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    doctorId: 'doc-002',
    symptoms: 'Itchy red rash on forearms for 5 days',
    diagnosis: 'Contact dermatitis',
    clinicalNotes: 'Mild inflammation observed, no signs of infection. Advised to avoid known allergen.',
    followUpInstructions: 'Apply prescribed cream twice daily. Review in 2 weeks if not resolved.',
    followUpDate: '2026-08-28',
    status: 'COMPLETED',
    createdAt: '2026-08-14T14:20:00Z'
  },
  {
    id: 'con-002',
    appointmentId: 'apt-006',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    doctorId: 'doc-003',
    symptoms: 'Dull knee pain after running, worse on stairs',
    diagnosis: 'Patellofemoral pain syndrome',
    clinicalNotes: 'No swelling or instability. Recommended physiotherapy and activity modification.',
    followUpInstructions: 'Physiotherapy 3x/week for 4 weeks. Avoid running until reviewed.',
    followUpDate: '2026-07-30',
    status: 'COMPLETED',
    createdAt: '2026-07-02T16:35:00Z'
  },
  {
    id: 'con-003',
    appointmentId: 'apt-004',
    patientId: 'pat-003',
    patientName: 'Meera Pillai',
    doctorId: 'doc-001',
    symptoms: 'Occasional palpitations, more noticeable at night',
    diagnosis: 'Pending — ECG under review',
    clinicalNotes: 'Vitals stable. ECG ordered to rule out arrhythmia.',
    followUpInstructions: 'Await ECG results before finalizing treatment plan.',
    status: 'IN_PROGRESS',
    createdAt: '2026-09-26T09:35:00Z'
  }
];
