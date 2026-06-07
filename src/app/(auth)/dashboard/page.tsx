"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Component Imports
import AttendanceCard from "../components/AttendanceCard";
import ProfileOverview from "../components/ProfileOverview";
import LiveOnSite from "../components/LiveOnSite";
import PendingApprovals from "../components/PendingApprovals";
import LeavePanel from "../components/LeavePanel";
import LeaveApprovalsInbox from "../components/LeaveApprovalsInbox";
import DashboardAnalytics from "../components/DashboardAnalytics";

export default function DashboardPage() {
  const router = useRouter();
  const { data: sessionData, isPending: sessionLoading } =
    authClient.useSession();
  const session = sessionData as any;

  const [profile, setProfile] = useState<any>(null);
  const [syncLoading, setSyncLoading] = useState(true);
  const [syncError, setSyncError] = useState("");

  // Control Data Roster States
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [liveStaff, setLiveStaff] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // Attendance Telemetry States
  const [attendanceLog, setAttendanceLog] = useState<any>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Core Analytical State
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const isEmailUnverified = session?.user && !session.user.emailVerified;
  const isAdmin = session?.user?.role === "ADMIN";

  // Security Gate
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push("/login");
    }
  }, [session, sessionLoading, router]);

  // Data Hydration Operations
  const fetchPendingUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/employees/pending`,
        { method: "GET", credentials: "include" },
      );
      const result = await response.json();
      if (result.success) setPendingUsers(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLiveStaff = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/attendance/live-onsite`,
        { method: "GET", credentials: "include" },
      );
      const result = await response.json();
      if (result.success) setLiveStaff(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodayAttendance = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/attendance/today-status`,
        { method: "GET", credentials: "include" },
      );
      const result = await response.json();
      if (result.success) setAttendanceLog(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalyticsSummary = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/analytics/dashboard`,
        { method: "GET", credentials: "include" },
      );
      const result = await response.json();
      if (result.success) setAnalyticsData(result);
    } catch (err) {
      console.error("Analytical system link failed:", err);
    }
  };

  // Sync Profile Engine
  useEffect(() => {
    if (sessionLoading || !session || !session.user?.emailVerified) return;

    const syncEmployeeProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/employees/sync`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );
        const result = await response.json();

        if (result.success) {
          setProfile(result.data);
          setSyncError("");
          fetchTodayAttendance();
          fetchAnalyticsSummary();
          if (session?.user?.role === "ADMIN") {
            fetchPendingUsers();
            fetchLiveStaff();
          }
        } else {
          if (result.data) setProfile(result.data);
          setSyncError(result.message || "Failed to map operational profile.");
        }
      } catch (err) {
        setSyncError(
          "Network link communication error with API backend cluster.",
        );
      } finally {
        setSyncLoading(false);
      }
    };

    syncEmployeeProfile();
  }, [session, sessionLoading]);

  // Attendance Telemetry Handlers with Geolocation Coordinates Routing
  const handleAttendanceToggle = async (
    coords: { lat: number; lng: number } | null,
  ) => {
    setAttendanceLoading(true);
    const endpoint = attendanceLog ? "clock-out" : "clock-in";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/attendance/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ coords }),
        },
      );
      const result = await response.json();
      if (response.ok && result.success) {
        setAttendanceLog(result.data);
        fetchAnalyticsSummary();
        if (isAdmin) fetchLiveStaff();
      } else {
        alert(result.message || "Attendance validation operation error.");
      }
    } catch (err) {
      alert("Network disruption processing tracking telemetry.");
    } finally {
      setAttendanceLoading(false);
    }
  };

  // Administration Approvals Handlers
  const handleApproveUser = async (id: string) => {
    setAdminLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/employees/activate/${id}`,
        { method: "PUT", credentials: "include" },
      );
      const result = await response.json();
      if (result.success) {
        setPendingUsers((prev) => prev.filter((u) => u.id !== id));
        fetchAnalyticsSummary();
      } else {
        alert(result.message || "Approval execution error.");
      }
    } catch (err) {
      alert("Communication error processing activation.");
    } finally {
      setAdminLoading(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  // UI Processing Pipelines
  if (
    sessionLoading ||
    (syncLoading && session && !isEmailUnverified && !profile)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto" />
          <p className="text-sm font-medium text-gray-500 animate-pulse">
            Synchronizing Core Profile...
          </p>
        </div>
      </div>
    );
  }

  if (isEmailUnverified) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100">
            <svg
              className="h-7 w-7 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 19v-8.93a2 2 0 01.89-1.664l8-4.8a2 2 0 012.22 0l8 4.8A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-600">
              We have dispatched a security link to{" "}
              <span className="font-semibold text-gray-800">
                {session?.user?.email}
              </span>
              .
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-sm"
            >
              I have Verified My Email
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (
    !isAdmin &&
    (profile?.employmentStatus === "PROBATION" ||
      (!profile && session?.user && !syncError))
  ) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
            <svg
              className="h-7 w-7 text-amber-500 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-11a3 3 0 11-6 0 3 3 0 016 0zM2 20V18a4 4 0 014-4h12a4 4 0 014 4v2"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Awaiting Admin Verification
            </h2>
            <p className="text-sm text-gray-600">
              Welcome to the team,{" "}
              <span className="font-semibold text-gray-800">
                {session?.user?.name}
              </span>
              !
            </p>
            <p className="text-xs text-gray-400 pt-1">
              Your registration is complete, but administrative staff must clear
              your status from probation to active.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
            >
              Check Status
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (syncError && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl p-6 border shadow-sm text-center space-y-4">
          <p className="text-sm text-red-600 font-medium">{syncError}</p>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-semibold"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* NAV HEADER */}
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              EMS Operational Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Corporate tracking environment active for role:{" "}
              <span className="font-bold text-indigo-600 uppercase">
                {session?.user?.role}
              </span>
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
          >
            Sign Out
          </button>
        </div>

        {/* 📊 CORE OPERATIONAL TELEMETRY METRICS CARD */}
        {analyticsData && <DashboardAnalytics data={analyticsData} />}

        {/* CORE TELEMETRY ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AttendanceCard
            attendanceLog={attendanceLog}
            attendanceLoading={attendanceLoading}
            onToggle={handleAttendanceToggle}
          />
          <ProfileOverview session={session} profile={profile} />
        </div>

        {/* 🚀 MODULE: LEAVE REQUESTS & ALLOTMENT BALANCES */}
        {!isAdmin && profile?.id && <LeavePanel employeeId={profile.id} />}

        {/* 🛡️ ADMIN MANAGEMENT LAYERS */}
        {isAdmin && (
          <div className="space-y-6">
            <LeaveApprovalsInbox />
            <LiveOnSite liveStaff={liveStaff} />
            <PendingApprovals
              pendingUsers={pendingUsers}
              adminLoading={adminLoading}
              onApprove={handleApproveUser}
            />
          </div>
        )}
      </div>
    </div>
  );
}
