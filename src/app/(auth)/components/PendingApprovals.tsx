"use client";

interface PendingApprovalsProps {
  pendingUsers: any[];
  adminLoading: boolean;
  onApprove: (id: string) => Promise<void>;
}

export default function PendingApprovals({
  pendingUsers,
  adminLoading,
  onApprove,
}: PendingApprovalsProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          Pending Workforce Approval Queue
        </h2>
        <p className="text-xs text-gray-400">
          Review and verify recently registered profiles to grant active
          platform database permissions.
        </p>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400 font-medium bg-gray-50 rounded-xl border border-dashed">
          🎉 No employees currently awaiting activation clearance.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                <th className="p-4">Name / Contact Info</th>
                <th className="p-4">Employee Code</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {pendingUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">
                      {user.user?.name || "Unnamed Employee"}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {user.user?.email || "No email mapping"}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-indigo-600 font-bold">
                    {user.employeeCode}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider text-[10px]">
                      {user.employmentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      disabled={adminLoading}
                      onClick={() => onApprove(user.id)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-50 transition"
                    >
                      Approve Personnel
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
