"use client";

import { Users, Clock, CalendarCheck, Percent } from "lucide-react";

interface AdminAnalyticsProps {
  metrics: {
    totalEmployees: number;
    currentlyClockedIn: number;
    pendingApprovalsQueue: number;
    onboardingProbations: number;
    attendanceRateToday: number;
  };
}

export default function AdminAnalytics({ metrics }: AdminAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Headcount Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Headcount
          </p>
          <p className="text-3xl font-extrabold text-gray-900 mt-2">
            {metrics.totalEmployees}
          </p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Users size={22} />
        </div>
      </div>

      {/* On-Site Now Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Active On-Site
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">
            {metrics.currentlyClockedIn}
          </p>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <Clock size={22} />
        </div>
      </div>

      {/* Approvals Backlog Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Pending Leaves
          </p>
          <p className="text-3xl font-extrabold text-amber-500 mt-2">
            {metrics.pendingApprovalsQueue}
          </p>
        </div>
        <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
          <CalendarCheck size={22} />
        </div>
      </div>

      {/* Operations Rate Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Utilization Rate
          </p>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2">
            {metrics.attendanceRateToday}%
          </p>
        </div>
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <Percent size={22} />
        </div>
      </div>
    </div>
  );
}
