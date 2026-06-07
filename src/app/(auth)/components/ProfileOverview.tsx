"use client";

interface ProfileOverviewProps {
  session: any;
  profile: any;
}

export default function ProfileOverview({
  session,
  profile,
}: ProfileOverviewProps) {
  return (
    <div className="col-span-2 rounded-2xl bg-white p-6 border border-gray-100 shadow-sm flex items-center gap-6">
      <img
        src={session?.user?.image || "https://avatar.iran.liara.run/public"}
        alt="User Avatar"
        className="h-24 w-24 rounded-2xl border shadow-sm object-cover"
      />
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-gray-900">
          {session?.user?.name}
        </h2>
        <p className="text-sm font-mono font-semibold text-indigo-600">
          {profile?.employeeCode || "SYS-ADMIN"}
        </p>
        <div className="flex gap-2 pt-1">
          <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-700 border border-green-200 uppercase tracking-wide">
            {profile?.employmentStatus || "ACTIVE"}
          </span>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600 border border-gray-200 uppercase tracking-wide">
            Level {session?.user?.role}
          </span>
        </div>
      </div>
    </div>
  );
}
