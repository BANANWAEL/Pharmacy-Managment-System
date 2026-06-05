"use client";
import React, { useState } from 'react';
import { Lock, LogOut, KeyRound, CheckCircle, XCircle } from 'lucide-react';

interface ChangePasswordProps {
  onUpdatePassword?: (data: { currentPassword: string; newPassword: string }) => void;
  onLogout?: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ 
  onUpdatePassword, 
  onLogout 
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    if (onUpdatePassword) {
      onUpdatePassword({ currentPassword, newPassword });
    }
    
    // Simulate success
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log('Logout clicked');
      alert('Logout functionality would be implemented here');
    }
  };

  return (
    <div className="bg-secondary p-6 my-2 rounded-2xl  shadow-sm overflow-hidden mx-auto">
      {/* Header */}
      <div className="px-6 py-3 ">
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
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-text" />
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg  focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen transition-all text-sm"
            />
          </div>
        </div>

        {/* New Password & Confirm Password (side by side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-text" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg   focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen transition-all text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-text" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg  focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-darkred bg-softred/20 px-3 py-2 rounded-lg">
            <XCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <div className="flex items-center gap-2 text-sm text-darkgreen bg-softgreen/20 px-3 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-mintgreen text-inverse-text rounded-lg hover:opacity-90 transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            Update Password
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-darkred rounded-lg hover:bg-softred/10 transition-colors font-medium text-sm flex items-center justify-center gap-2"
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