import { Prescription } from '../models';

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-001',
    consultationId: 'con-001',
    appointmentId: 'apt-002',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    doctorId: 'doc-002',
    doctorName: 'Dr. Kavya Iyer',
    medicines: [
      {
        id: 'med-001',
        name: 'Hydrocortisone Cream 1%',
        dosage: 'Thin layer',
        frequency: 'Twice daily',
        duration: '14 days',
        instructions: 'Apply to affected area only. Avoid eyes.'
      },
      {
        id: 'med-002',
        name: 'Cetirizine 10mg',
        dosage: '1 tablet',
        frequency: 'Once daily (night)',
        duration: '7 days',
        instructions: 'Take after dinner. May cause drowsiness.'
      }
    ],
    notes: 'Review if rash spreads or worsens.',
    createdAt: '2026-08-14T14:30:00Z'
  },
  {
    id: 'rx-002',
    consultationId: 'con-002',
    appointmentId: 'apt-006',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    doctorId: 'doc-003',
    doctorName: 'Dr. Sanjay Rao',
    medicines: [
      {
        id: 'med-003',
        name: 'Ibuprofen 400mg',
        dosage: '1 tablet',
        frequency: 'Twice daily, after food',
        duration: '5 days',
        instructions: 'Stop if stomach upset occurs.'
      }
    ],
    notes: 'Combine with physiotherapy for best results.',
    createdAt: '2026-07-02T16:40:00Z'
  }
];
