"use client";

import { useState, useEffect } from "react";

interface LeaveBalance {
  type: string;
  allocated: number;
  consumed: number;
}

export default function LeavePanel({ employeeId }: { employeeId: string }) {
  // Application Form States
  const [leaveType, setLeaveType] = useState("ANNUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Leave Allotment Balance States
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(true);

  // Gather current workforce leave balances on initialization
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/leaves/balance/${employeeId}`,
          { credentials: "include" },
        );
        const result = await res.json();
        if (result.success) setBalances(result.data);
      } catch (err) {
        console.error(
          "Operational breakdown fetching ledger mapping balances:",
          err,
        );
      } finally {
        setLoadingBalances(false);
      }
    };
    if (employeeId) fetchBalances();
  }, [employeeId]);

  // Handle Form Submission Pipeline
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason)
      return alert(
        "Please map all structural context variables before submission.",
      );

    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaves/request` || "http://localhost:5000/api/leaves/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaveType,
          startDate,
          endDate,
          reason,
          employeeId,
        }),
        credentials: "include",
      });
      const result = await res.json();

      if (res.ok && result.success) {
        alert("Leave tracking request successfully dispatched.");
        setStartDate("");
        setEndDate("");
        setReason("");
        if (result.updatedBalances) setBalances(result.updatedBalances);
      } else {
        alert(
          result.message ||
            "An operational anomaly occurred while storing the application metadata.",
        );
      }
    } catch (err) {
      alert(
        "Network disruption routing information tracking packet to API gateway.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 text-black lg:grid-cols-3 gap-6">
      {/* 📊 VISUAL BALANCE LEDGER CARD */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-400">
          Leave Balance Matrix
        </h3>
        {loadingBalances ? (
          <div className="text-xs text-gray-400 animate-pulse py-2">
            Recalculating quotas...
          </div>
        ) : balances.length === 0 ? (
          <div className="text-xs text-gray-400 py-2">
            No contractual policy mapping configured for your account.
          </div>
        ) : (
          <div className="space-y-3">
            {balances.map((b) => (
              <div
                key={b.type}
                className="p-3 bg-gray-50 border rounded-xl flex justify-between items-center border-gray-100"
              >
                <div>
                  <span className="text-xs font-bold text-gray-700 block uppercase tracking-wide">
                    {b.type}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Consumed: {b.consumed} / {b.allocated} Days
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-indigo-600">
                    {b.allocated - b.consumed}
                  </span>
                  <span className="text-[10px] text-gray-400 block font-medium">
                    Available
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📝 CORE APPLICATION CONTEXT FORM */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-400">
          Apply for Absence Allocation
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Absence Classification
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-indigo-600"
              >
                <option value="ANNUAL">Annual Planned Leave</option>
                <option value="SICK">Medical / Sick Leave</option>
                <option value="MATERNITY">Maternity / Paternity Leave</option>
                <option value="UNPAID">Unpaid Absenteeism Clearance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Start Timeline Stamp
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                End Target Stamp
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Reason / Context Blueprint
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State structural reasoning matrix to present context metrics to management clearance pipelines..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-indigo-600 resize-none"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-sm transition"
            >
              {isSubmitting
                ? "Processing Request Package..."
                : "Transmit Leave Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
