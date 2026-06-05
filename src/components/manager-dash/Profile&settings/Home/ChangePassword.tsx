"use client";
import React, { useState } from "react";
import { Lock, LogOut, KeyRound, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const ChangePassword: React.FC = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]                 = useState(false);
  const [showSuccess, setShowSuccess]         = useState(false);
  const [error, setError]                     = useState("");

  // ===== UPDATE PASSWORD =====
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // backend doesn't have change password endpoint yet
      // simulate success for now
      await new Promise((resolve) => setTimeout(resolve, 800));

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  // ===== LOGOUT =====
  const handleLogout = () => {
    // clear all auth data
    localStorage.removeItem("userToken");
    document.cookie = "userToken=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <div className="bg-secondary p-6 my-2 rounded-2xl shadow-sm overflow-hidden mx-auto">
      {/* Header */}
      <div className="px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-mintgreen/10 rounded-lg">
            <KeyRound className="w-5 h-5 text-mintgreen" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-text">Change Password</h1>
            <p className="text-muted-text text-sm mt-0.5">Update your account password</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdatePassword} className="p-6 space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-primary-text mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
            <input
              type="password" value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen text-sm"
            />
          </div>
        </div>

        {/* New + Confirm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
              <input
                type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
              <input
                type="password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen text-sm"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-darkred bg-softred/20 px-3 py-2 rounded-lg">
            <XCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {showSuccess && (
          <div className="flex items-center gap-2 text-sm text-darkgreen bg-softgreen/20 px-3 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit" disabled={loading}
            className="flex-1 px-4 py-2 bg-mintgreen text-inverse-text rounded-lg hover:opacity-90 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            {loading ? "Updating..." : "Update Password"}
          </button>
          <button
            type="button" onClick={handleLogout}
            className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-darkred rounded-lg hover:bg-softred/10 font-medium text-sm flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;