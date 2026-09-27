export interface TimeSlot {
  id: string;
  startTime: string; // "09:00 AM"
  endTime: string;   // "09:30 AM"
  isBooked: boolean;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  date: string; // ISO date
  slots: TimeSlot[];
}
