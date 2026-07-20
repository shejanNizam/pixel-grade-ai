"use client";

import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import {
  FiAlertTriangle as AlertTriangle,
  FiEye as Eye,
  FiEyeOff as EyeOff,
  FiKey as KeyRound,
  FiShield as ShieldCheck,
} from "react-icons/fi";
import { useState } from "react";

interface FieldErrors {
  old_password?: string[];
  new_password?: string[];
  general?: string;
}

const STRENGTH_LEVELS = [
  { level: 1, label: "Weak", color: "#ef4444" },
  { level: 2, label: "Fair", color: "#f97316" },
  { level: 3, label: "Good", color: "#eab308" },
  { level: 4, label: "Strong", color: "#22c55e" },
];

function getPasswordStrength(pwd: string) {
  if (!pwd) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return STRENGTH_LEVELS[score - 1] ?? { level: 0, label: "", color: "" };
}

export default function Security() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const strength = getPasswordStrength(newPassword);

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (!oldPassword) e.old_password = ["Current password is required."];
    if (!newPassword) e.new_password = ["New password is required."];
    else if (newPassword.length < 8)
      e.new_password = ["Password must be at least 8 characters."];
    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      e.general = "New passwords do not match.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setFieldErrors({});
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }

    try {
      await changePassword({ oldPassword, newPassword }).unwrap();
      setSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const data = (err as { data?: { message?: string } })?.data;
      // A 401 here means the current password was wrong; anything else is
      // surfaced as a general error.
      setFieldErrors({
        general: data?.message ?? "Couldn't change the password. Try again.",
      });
    }
  };

  const inputCls =
    "w-full rounded-lg border px-3 py-2 pr-10 text-sm outline-none transition-colors " +
    "bg-white border-gray-300 text-gray-900 placeholder-gray-400 " +
    "focus:border-blue-500 focus:ring-1 focus:ring-blue-500 " +
    "dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 " +
    "dark:focus:border-blue-400 dark:focus:ring-blue-400";

  const errorCls =
    "border-red-400 focus:border-red-400 focus:ring-red-400 dark:border-red-500 dark:focus:border-red-400";
  const successCls =
    "border-green-400 focus:border-green-400 focus:ring-green-400 dark:border-green-500 dark:focus:border-green-400";

  return (
    <div className="space-y-6">
      {/* ── Page heading ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Security
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your password and account security settings.
        </p>
      </div>

      {/* ── Change password card ── */}
      <section className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="shrink-0 rounded-lg bg-blue-50 dark:bg-blue-950/30 p-2 text-blue-600 dark:text-blue-400">
            <KeyRound className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Change Password
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Choose a strong password you don&apos;t use elsewhere. We
              recommend a mix of uppercase letters, numbers, and symbols.
            </p>

            {/* Success */}
            {success && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                Password updated successfully.
              </div>
            )}

            {/* General error */}
            {fieldErrors.general && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {fieldErrors.general}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-6 max-w-xl space-y-4"
            >
              {/* Current password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOld ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      setFieldErrors((p) => ({
                        ...p,
                        old_password: undefined,
                      }));
                    }}
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    className={`${inputCls} ${fieldErrors.old_password ? errorCls : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {fieldErrors.old_password && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {fieldErrors.old_password[0]}
                  </p>
                )}
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setFieldErrors((p) => ({
                        ...p,
                        new_password: undefined,
                      }));
                    }}
                    placeholder="Enter a new password"
                    autoComplete="new-password"
                    className={`${inputCls} ${fieldErrors.new_password ? errorCls : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Strength meter */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-colors duration-300"
                          style={{
                            background:
                              i <= strength.level ? strength.color : undefined,
                          }}
                        >
                          {i > strength.level && (
                            <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700" />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </div>
                )}
                {fieldErrors.new_password && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {fieldErrors.new_password[0]}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setFieldErrors((p) => ({ ...p, general: undefined }));
                    }}
                    placeholder="Re-enter your new password"
                    autoComplete="new-password"
                    className={`${inputCls} ${
                      confirmPassword && confirmPassword !== newPassword
                        ? errorCls
                        : confirmPassword && confirmPassword === newPassword
                          ? successCls
                          : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    Passwords don&apos;t match
                  </p>
                )}
                {confirmPassword && confirmPassword === newPassword && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                    Passwords match
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    />
                  </svg>
                )}
                {isLoading ? "Updating…" : "Update password"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Info note ── */}
      <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/30">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            After changing your password, you may be signed out of other active
            sessions automatically. Make sure to save your new password
            somewhere safe.
          </p>
        </div>
      </section>
    </div>
  );
}
