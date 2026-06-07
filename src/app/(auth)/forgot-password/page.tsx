"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ FIX: Directly fetch your backend's exact custom forget-password route slug
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/request-password-reset` ||
        "http://localhost:5000/api/auth/request-password-reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`, 
          }),
        },
      );

      const result = await response.json();

      if (response.ok || result.success) {
        setSuccess(true);
      } else {
        setError(result.message || "Failed to trigger recovery procedure.");
      }
    } catch (err: any) {
      setError("Network link communication error with authentication cluster.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Enter your email to receive a secure recovery code
          </p>
        </div>

        {success ? (
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200 text-center">
            Recovery instructions have been dispatched to your email address.
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
                placeholder="you@company.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Send Reset Link"}
            </button>
          </form>
        )}
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
