import { Patient } from '../models';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    userId: 'usr-001',
    fullName: 'Ananya Sharma',
    email: 'patient@health.com',
    phone: '+91 98765 43210',
    dateOfBirth: '1994-06-12',
    gender: 'FEMALE',
    bloodGroup: 'O+',
    address: '221B, Anna Salai, Chennai, Tamil Nadu',
    emergencyContact: { name: 'Ramesh Sharma', relationship: 'Father', phone: '+91 98765 00000' },
    avatarUrl: ''
  },
  {
    id: 'pat-002',
    userId: 'usr-006',
    fullName: 'Arjun Verma',
    email: 'arjun.verma@health.com',
    phone: '+91 98111 22334',
    dateOfBirth: '1988-11-02',
    gender: 'MALE',
    bloodGroup: 'B+',
    address: '14 MG Road, Bengaluru, Karnataka',
    emergencyContact: { name: 'Sunita Verma', relationship: 'Spouse', phone: '+91 98111 99887' },
    avatarUrl: ''
  },
  {
    id: 'pat-003',
    userId: 'usr-007',
    fullName: 'Meera Pillai',
    email: 'meera.pillai@example.com',
    phone: '+91 97654 11223',
    dateOfBirth: '2001-03-25',
    gender: 'FEMALE',
    bloodGroup: 'A-',
    address: '9 Marine Drive, Kochi, Kerala',
    emergencyContact: { name: 'Suresh Pillai', relationship: 'Father', phone: '+91 97654 00011' },
    avatarUrl: ''
  }
];
