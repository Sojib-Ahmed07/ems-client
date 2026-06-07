"use client";

import { useEffect, useState } from "react";

interface AttendanceCardProps {
  attendanceLog: any;
  attendanceLoading: boolean;
  // Updated handler configuration signature signature to pipeline position values
  onToggle: (coords: { lat: number; lng: number } | null) => Promise<void>;
}

export default function AttendanceCard({
  attendanceLog,
  attendanceLoading,
  onToggle,
}: AttendanceCardProps) {
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString(),
  );
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const handleClockAction = () => {
    // If the employee is clocking out, skip geofence calculations
    if (attendanceLog && !attendanceLog.clockOut) {
      onToggle(null);
      return;
    }

    if (!navigator.geolocation) {
      alert(
        "Geolocation data collection services are not supported by this browser software layer.",
      );
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        onToggle({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        setGeoLoading(false);
        console.error("Perimeter telemetry collection failure:", error);
        alert(
          "Verification Required: Please permit location context flags to authorize your on-site clock-in request.",
        );
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const isTerminatedToday = attendanceLog && attendanceLog.clockOut;

  return (
    <div className="col-span-1 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-between text-center space-y-4">
      <div className="w-full">
        <span className="text-xs uppercase font-extrabold text-gray-400 tracking-widest block mb-1">
          Station Local Time
        </span>
        <div className="text-3xl font-mono font-bold text-gray-900 bg-gray-50 py-2 rounded-xl border tracking-tight">
          {currentTime || "00:00:00 AM"}
        </div>
      </div>

      <div className="space-y-1 w-full">
        <button
          disabled={attendanceLoading || geoLoading || isTerminatedToday}
          onClick={handleClockAction}
          className={`w-full py-3 rounded-xl font-bold text-sm shadow-sm transition border ${
            attendanceLog
              ? isTerminatedToday
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500 text-white border-red-700"
              : "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-700"
          } disabled:opacity-60`}
        >
          {attendanceLoading
            ? "Transmitting..."
            : geoLoading
              ? "Locating Perimeter..."
              : attendanceLog
                ? isTerminatedToday
                  ? "Shift Terminated Today"
                  : "Clock Out Personnel"
                : "Clock In Shift"}
        </button>

        {attendanceLog && (
          <div className="text-[11px] font-medium text-gray-500 pt-2 flex items-center justify-center gap-1.5 flex-wrap">
            <span
              className={`h-2 w-2 rounded-full ${
                attendanceLog.status === "LATE"
                  ? "bg-amber-500"
                  : "bg-green-500"
              }`}
            />
            Logged in as{" "}
            <strong className="uppercase">{attendanceLog.status}</strong> at{" "}
            {new Date(attendanceLog.clockIn).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {attendanceLog.clockOut &&
              ` • Out at ${new Date(attendanceLog.clockOut).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}`}
          </div>
        )}
      </div>
    </div>
  );
}
