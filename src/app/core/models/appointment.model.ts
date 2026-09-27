export type AppointmentStatus =
  | 'BOOKED'
  | 'CHECKED_IN'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;       // ISO date, e.g. 2026-10-02
  timeSlot: string;    // e.g. "10:30 AM"
  reason: string;
  status: AppointmentStatus;
  queueNumber?: number;
  createdAt: string;
}
