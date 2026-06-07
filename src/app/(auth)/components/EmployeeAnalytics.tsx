"use client";

import { CheckSquare, AlertTriangle, Activity } from "lucide-react";

interface EmployeeAnalyticsProps {
  metrics: {
    daysWorkedThisPeriod: number;
    tardinessCount: number;
    punctualityRate: number;
    upcomingHolidays: Array<{
      id: string;
      type: string;
      start: string;
      end: string;
    }>;
  };
}

export default function EmployeeAnalytics({ metrics }: EmployeeAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Shifts Tracked */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Shifts Tracked
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mt-2">
              {metrics.daysWorkedThisPeriod} Days
            </p>
          </div>
          <div className="p-3 bg-gray-50 text-gray-600 rounded-xl">
            <CheckSquare size={22} />
          </div>
        </div>

        {/* Lateness Flags */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Late Flags
            </p>
            <p className="text-3xl font-extrabold text-rose-500 mt-2">
              {metrics.tardinessCount} Times
            </p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
            <AlertTriangle size={22} />
          </div>
        </div>

        {/* Punctuality Rating */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Punctuality Score
            </p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-2">
              {metrics.punctualityRate}%
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Activity size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}
