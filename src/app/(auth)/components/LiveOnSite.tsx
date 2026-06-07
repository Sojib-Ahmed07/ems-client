"use client";

interface LiveOnSiteProps {
  liveStaff: any[];
}

export default function LiveOnSite({ liveStaff }: LiveOnSiteProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
      <div className="border-b border-gray-100 pb-3">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Live On-Site Personnel Stream
        </h2>
        <p className="text-xs text-gray-400">
          Real-time compilation of every workforce asset currently clocked into
          your tracking environments.
        </p>
      </div>

      {liveStaff.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400 font-medium bg-gray-50 rounded-xl border border-dashed">
          🏢 No employees currently active on-site.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-100">
                <th className="p-4">Personnel</th>
                <th className="p-4">Inbound Stamp</th>
                <th className="p-4">Log Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {liveStaff.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={
                        log.employee?.user?.image ||
                        "https://avatar.iran.liara.run/public"
                      }
                      className="h-8 w-8 rounded-full"
                      alt=""
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {log.employee?.user?.name}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {log.employee?.user?.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs font-bold text-gray-600">
                    {new Date(log.clockIn).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                        log.status === "LATE"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      }`}
                    >
                      {log.status}
                    </span>
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
