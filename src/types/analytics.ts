export interface AdminMetrics {
  totalEmployees: number;
  currentlyClockedIn: number;
  pendingApprovalsQueue: number;
  onboardingProbations: number;
  attendanceRateToday: number;
}

export interface EmployeeMetrics {
  daysWorkedThisPeriod: number;
  tardinessCount: number;
  punctualityRate: number;
  upcomingHolidays: {
    id: string;
    type: string;
    start: string;
    end: string;
  }[];
}

export interface AnalyticsResponse {
  success: boolean;
  role: "ADMIN" | "EMPLOYEE";
  metrics: AdminMetrics & EmployeeMetrics; // Intersection allows runtime flexibility
}