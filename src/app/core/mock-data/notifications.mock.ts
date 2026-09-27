import { AppNotification } from '../models';

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'ntf-001',
    userId: 'usr-001',
    type: 'APPOINTMENT',
    title: 'Upcoming appointment',
    message: 'Your appointment with Dr. Rohan Mehta is on Sep 28 at 10:30 AM.',
    isRead: false,
    createdAt: '2026-09-25T09:00:00Z'
  },
  {
    id: 'ntf-002',
    userId: 'usr-001',
    type: 'PRESCRIPTION',
    title: 'New prescription added',
    message: 'Dr. Kavya Iyer added a new prescription to your medical records.',
    isRead: false,
    createdAt: '2026-08-14T14:35:00Z'
  },
  {
    id: 'ntf-003',
    userId: 'usr-001',
    type: 'SYSTEM',
    title: 'Profile updated',
    message: 'Your profile details were updated successfully.',
    isRead: true,
    createdAt: '2026-07-01T09:00:00Z'
  },
  {
    id: 'ntf-004',
    userId: 'usr-002',
    type: 'APPOINTMENT',
    title: 'New appointment booked',
    message: 'Meera Pillai booked an appointment for Sep 26, 09:30 AM.',
    isRead: false,
    createdAt: '2026-09-19T08:05:00Z'
  }
];
