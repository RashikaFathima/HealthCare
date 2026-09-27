import { DoctorAvailability } from '../models';

function slots(prefix: string, count: number, bookedIndexes: number[] = []): any[] {
  const times = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','02:00 PM','02:30 PM','03:00 PM','03:30 PM'];
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-slot-${i + 1}`,
    startTime: times[i] ?? `0${9 + i}:00 AM`,
    endTime: times[i + 1] ?? `0${10 + i}:00 AM`,
    isBooked: bookedIndexes.includes(i)
  }));
}

export const MOCK_AVAILABILITY: DoctorAvailability[] = [
  { id: 'avl-001', doctorId: 'doc-001', date: '2026-09-26', slots: slots('a1', 6, [0, 1, 2]) },
  { id: 'avl-002', doctorId: 'doc-001', date: '2026-09-28', slots: slots('a2', 6, [0]) },
  { id: 'avl-003', doctorId: 'doc-001', date: '2026-09-29', slots: slots('a3', 8, []) },
  { id: 'avl-004', doctorId: 'doc-002', date: '2026-09-27', slots: slots('a4', 6, [1, 2]) },
  { id: 'avl-005', doctorId: 'doc-004', date: '2026-09-27', slots: slots('a5', 8, []) },
  { id: 'avl-006', doctorId: 'doc-006', date: '2026-09-27', slots: slots('a6', 6, []) }
];
