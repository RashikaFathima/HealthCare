import { Appointment } from '../models';

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rohan Mehta',
    specialization: 'Cardiology',
    date: '2026-09-28',
    timeSlot: '10:30 AM',
    reason: 'Chest discomfort and routine ECG follow-up',
    status: 'BOOKED',
    createdAt: '2026-09-20T08:00:00Z'
  },
  {
    id: 'apt-002',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    doctorId: 'doc-002',
    doctorName: 'Dr. Kavya Iyer',
    specialization: 'Dermatology',
    date: '2026-08-14',
    timeSlot: '02:00 PM',
    reason: 'Skin allergy consultation',
    status: 'COMPLETED',
    createdAt: '2026-08-10T08:00:00Z'
  },
  {
    id: 'apt-003',
    patientId: 'pat-002',
    patientName: 'Arjun Verma',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rohan Mehta',
    specialization: 'Cardiology',
    date: '2026-09-26',
    timeSlot: '09:00 AM',
    reason: 'Annual heart checkup',
    status: 'CHECKED_IN',
    queueNumber: 1,
    createdAt: '2026-09-18T08:00:00Z'
  },
  {
    id: 'apt-004',
    patientId: 'pat-003',
    patientName: 'Meera Pillai',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rohan Mehta',
    specialization: 'Cardiology',
    date: '2026-09-26',
    timeSlot: '09:30 AM',
    reason: 'Palpitations',
    status: 'IN_CONSULTATION',
    queueNumber: 2,
    createdAt: '2026-09-19T08:00:00Z'
  },
  {
    id: 'apt-005',
    patientId: 'pat-002',
    patientName: 'Arjun Verma',
    doctorId: 'doc-004',
    doctorName: 'Dr. Neha Kapoor',
    specialization: 'Pediatrics',
    date: '2026-09-15',
    timeSlot: '11:00 AM',
    reason: 'Vaccination for child',
    status: 'CANCELLED',
    createdAt: '2026-09-10T08:00:00Z'
  },
  {
    id: 'apt-006',
    patientId: 'pat-001',
    patientName: 'Ananya Sharma',
    doctorId: 'doc-003',
    doctorName: 'Dr. Sanjay Rao',
    specialization: 'Orthopedics',
    date: '2026-07-02',
    timeSlot: '04:30 PM',
    reason: 'Knee pain evaluation',
    status: 'COMPLETED',
    createdAt: '2026-06-28T08:00:00Z'
  },
  {
    id: 'apt-007',
    patientId: 'pat-003',
    patientName: 'Meera Pillai',
    doctorId: 'doc-001',
    doctorName: 'Dr. Rohan Mehta',
    specialization: 'Cardiology',
    date: '2026-09-26',
    timeSlot: '10:00 AM',
    reason: 'Blood pressure monitoring',
    status: 'BOOKED',
    queueNumber: 3,
    createdAt: '2026-09-21T08:00:00Z'
  }
];
