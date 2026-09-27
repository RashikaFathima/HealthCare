import { User } from '../models';

// Mock users used by AuthService for frontend-only login.
// Password for ALL mock accounts is: password
export const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'usr-001',
    fullName: 'Ananya Sharma',
    email: 'patient@health.com',
    password: 'password',
    role: 'PATIENT',
    phone: '+91 98765 43210',
    avatarUrl: '',
    isActive: true,
    createdAt: '2025-01-10T09:00:00Z'
  },
  {
    id: 'usr-002',
    fullName: 'Dr. Rohan Mehta',
    email: 'doctor@health.com',
    password: 'password',
    role: 'DOCTOR',
    phone: '+91 91234 56780',
    avatarUrl: '',
    isActive: true,
    createdAt: '2024-11-05T09:00:00Z'
  },
  {
    id: 'usr-003',
    fullName: 'Priya Nair',
    email: 'reception@health.com',
    password: 'password',
    role: 'RECEPTIONIST',
    phone: '+91 99887 76655',
    avatarUrl: '',
    isActive: true,
    createdAt: '2024-09-01T09:00:00Z'
  },
  {
    id: 'usr-004',
    fullName: 'Vikram Singh',
    email: 'admin@health.com',
    password: 'password',
    role: 'ADMIN',
    phone: '+91 90000 11122',
    avatarUrl: '',
    isActive: true,
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: 'usr-005',
    fullName: 'Dr. Kavya Iyer',
    email: 'kavya.iyer@health.com',
    password: 'password',
    role: 'DOCTOR',
    phone: '+91 98220 44556',
    avatarUrl: '',
    isActive: true,
    createdAt: '2025-02-14T09:00:00Z'
  },
  {
    id: 'usr-006',
    fullName: 'Arjun Verma',
    email: 'arjun.verma@health.com',
    password: 'password',
    role: 'PATIENT',
    phone: '+91 98111 22334',
    avatarUrl: '',
    isActive: false,
    createdAt: '2025-03-20T09:00:00Z'
  }
];
