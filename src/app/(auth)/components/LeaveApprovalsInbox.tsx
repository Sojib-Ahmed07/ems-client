"use client";

import { useState, useEffect } from "react";

interface LeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  employee: {
    user: {
      name: string;
      email: string;
    };
  };
}

export default function LeaveApprovalsInbox() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  // Hydrate pending leave parameters from management channels
  useEffect(() => {
    const fetchPendingLeaves = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaves/pending` || "http://localhost:5000/api/leaves/pending", {
          credentials: "include",
        });
        const result = await res.json();
        if (result.success) setRequests(result.data);
      } catch (err) {
        console.error(
          "Security/Network error capturing leave tracking buffer records:",
          err,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPendingLeaves();
  }, []);

  // Dispatch Clearance Decision (Approve / Reject)
  const handleDecision = async (
    id: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    setActioningId(id);
    try {
      const res = await fetch(
        `http://localhost:5000/api/leaves/${id}/approve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
          credentials: "include",
        },
      );
      const result = await res.json();

      if (res.ok && result.success) {
        setRequests((prev) => prev.filter((req) => req.id !== id));
      } else {
        alert(
          result.message ||
            "Failed to commit decision status changes to database layer.",
        );
      }
    } catch (err) {
      alert(
        "Network connectivity failure committing leave state metadata variables.",
      );
    } finally {
      setActioningId(null);
    }
  };

  if (loading)
    return (
      <div className="text-xs text-gray-400 animate-pulse">
        Synchronizing leave application streams...
      </div>
    );

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          Absence Clearance Operations Desk
        </h2>
        <p className="text-xs text-gray-400">
          Process enterprise leave records. Confirming structural approvals
          updates workforce sheets immediately.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400 font-medium bg-gray-50 rounded-xl border border-dashed">
          🌴 No pending time-off applications are awaiting manager approval.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                <th className="p-4">Applicant Profile</th>
                <th className="p-4">Leave Configuration</th>
                <th className="p-4">Stated Reasoning</th>
                <th className="p-4 text-right">Clearance Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">
                      {req.employee?.user?.name}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {req.employee?.user?.email}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider block w-max mb-1">
                      {req.leaveType}
                    </span>
                    <span className="text-xs font-mono text-gray-600 block">
                      {new Date(req.startDate).toLocaleDateString()} →{" "}
                      {new Date(req.endDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td
                    className="p-4 text-xs text-gray-500 max-w-xs truncate"
                    title={req.reason}
                  >
                    {req.reason}
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      disabled={actioningId !== null}
                      onClick={() => handleDecision(req.id, "APPROVED")}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg shadow-sm transition disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      disabled={actioningId !== null}
                      onClick={() => handleDecision(req.id, "REJECTED")}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg border transition disabled:opacity-50"
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
