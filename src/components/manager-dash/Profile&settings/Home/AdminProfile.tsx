"use client";
import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, Briefcase, Camera, CheckCircle } from 'lucide-react';

interface AdminProfileProps {
  initialData?: {
    fullName: string;
    phoneNumber: string;
    address: string;
    email: string;
    role: string;
    status: string;
    photo?: string;
  };
  onSave?: (data: { fullName: string; phoneNumber: string; address: string; email: string; role: string }) => void;
}

const AdminProfile: React.FC<AdminProfileProps> = ({ 
  initialData,
  onSave 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(initialData?.fullName || 'Banan Wael');
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || '+20 123 456 7890');
  const [address, setAddress] = useState(initialData?.address || 'Cairo, Egypt');
  const [email, setEmail] = useState(initialData?.email || 'banan.wael@medicare.com');
  const [role, setRole] = useState(initialData?.role || 'Pharmacy Admin');
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photo || null);

  const status = initialData?.status || 'Active';

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ fullName, phoneNumber, address, email, role });
    }
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFullName(initialData?.fullName || 'Banan Wael');
    setPhoneNumber(initialData?.phoneNumber || '+20 123 456 7890');
    setAddress(initialData?.address || 'Cairo, Egypt');
    setEmail(initialData?.email || 'banan.wael@medicare.com');
    setRole(initialData?.role || 'Pharmacy Admin');
    setIsEditing(false);
  };

  return (
    <div className="bg-secondary rounded-2xl  shadow-sm overflow-hidden  mx-auto p-3">
      {/* Header */}
      <div className="py-3 px-6 ">
        <h3 className="text-2xl font-bold text-primary-text">Admin Profile</h3>
      </div>

      <div className="px-6 space-y-6">
        {/* Profile Info Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-mintgreen/10 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-mintgreen" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1 bg-mintgreen rounded-full cursor-pointer hover:opacity-90 transition-colors">
                <Camera className="w-3.5 h-3.5 text-inverse-text" />
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
            <button 
              onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
              className="text-sm text-mintgreen hover:underline"
            >
              Change Photo
            </button>
          </div>

          {/* Name & Role */}
          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-semibold text-primary-text">{fullName}</h2>
            <p className="text-muted-text">{role}</p>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-softgreen rounded-full">
              <CheckCircle className="w-3 h-3 text-primary-text" />
              <span className="text-xs font-medium text-primary-text">{status}</span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 pt-2">
            <div className='grid grid-cols-2 gap-2'>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen transition-all text-sm"
              />
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-gray-200 dark:border-gray-700">
                <User className="w-4 h-4 text-muted-text" />
                <span className="text-primary-text">{fullName}</span>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen transition-all text-sm"
              />
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-gray-200 dark:border-gray-700">
                <Phone className="w-4 h-4 text-muted-text" />
                <span className="text-primary-text">{phoneNumber}</span>
              </div>
            )}
          </div>
</div>
<div className='grid grid-cols-2 gap-2'>
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen transition-all text-sm"
              />
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-gray-200 dark:border-gray-700">
                <MapPin className="w-4 h-4 text-muted-text" />
                <span className="text-primary-text">{address}</span>
              </div>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen transition-all text-sm"
              />
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-gray-200 dark:border-gray-700">
                <Mail className="w-4 h-4 text-muted-text" />
                <span className="text-primary-text">{email}</span>
              </div>
            )}
          </div>
</div>
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">
              Role
            </label>
            {isEditing ? (
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen transition-all text-sm"
              />
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-gray-200 dark:border-gray-700">
                <Briefcase className="w-4 h-4 text-muted-text" />
                <span className="text-primary-text">{role}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-mintgreen text-inverse-text rounded-lg hover:opacity-90 transition-colors font-medium text-sm"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-primary-text rounded-lg hover:bg-background transition-colors font-medium text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-2 bg-mintgreen text-inverse-text rounded-lg hover:opacity-90 transition-colors font-medium text-sm"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;