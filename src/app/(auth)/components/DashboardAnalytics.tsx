"use client";

import AdminAnalytics from "./AdminAnalytics";
import EmployeeAnalytics from "./EmployeeAnalytics";

interface DashboardAnalyticsProps {
  data: {
    role: "ADMIN" | "EMPLOYEE";
    metrics: any;
  };
}

export default function DashboardAnalytics({ data }: DashboardAnalyticsProps) {
  if (data.role === "ADMIN") {
    return <AdminAnalytics metrics={data.metrics} />;
  }

  return <EmployeeAnalytics metrics={data.metrics} />;
}
