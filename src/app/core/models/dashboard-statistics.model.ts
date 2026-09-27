export interface DashboardStatistics {
  totalUsers?: number;
  totalPatients?: number;
  totalDoctors?: number;
  totalAppointments?: number;
  todaysAppointments?: number;
  completedConsultations?: number;
  pendingCases?: number;
  availableSlots?: number;
  checkedInPatients?: number;
  pendingAppointments?: number;
  cancelledBookings?: number;
}

export interface ChartSeries {
  label: string;
  data: number[];
}

export interface ChartData {
  categories: string[];
  series: ChartSeries[];
}
