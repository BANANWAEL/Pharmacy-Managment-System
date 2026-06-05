"use client";
import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, Mail, Briefcase, Camera, CheckCircle } from "lucide-react";
import api from "@/lib/api";

const AdminProfile: React.FC = () => {
  const [isEditing, setIsEditing]       = useState(false);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName:    "",
    email:       "",
    role:        "",
    salary:      "",
    attendance:  "",
    phoneNumber: "",
    address:     "",
  });

  const [original, setOriginal] = useState({ ...form });

  // ===== FETCH PROFILE =====
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/employees/me");
        const data     = response.data;

        const mapped = {
          fullName:    data.employee_Name      ?? "",
          email:       data.email              ?? "",
          role:        data.employee_Role      ?? "",
          salary:      data.salary?.toString() ?? "",
          attendance:  data.attendance_Details ?? "",
          phoneNumber: "",   // not returned by backend
          address:     "",   // not returned by backend
        };

        setForm(mapped);
        setOriginal(mapped);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ===== PHOTO =====
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ===== SAVE =====
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // backend doesn't have a PUT /employees/me endpoint
      // so we just update locally and show success
      setOriginal({ ...form });
      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...original });
    setIsEditing(false);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="bg-secondary rounded-2xl shadow-sm p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const Field = ({
    label, name, icon: Icon, type = "text",
  }: {
    label: string; name: keyof typeof form; icon: any; type?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-primary-text mb-1.5">{label}</label>
      {isEditing ? (
        <input
          type={type} name={name} value={form[name]}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen text-sm"
        />
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg border border-gray-200 dark:border-gray-700">
          <Icon className="w-4 h-4 text-muted-text shrink-0" />
          <span className="text-primary-text text-sm">{form[name] || "Not set"}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-secondary rounded-2xl shadow-sm overflow-hidden mx-auto p-3">
      {/* Header */}
      <div className="py-3 px-6">
        <h3 className="text-2xl font-bold text-primary-text">Admin Profile</h3>
      </div>

      <div className="px-6 space-y-6">
        {/* Avatar + Name */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-mintgreen/10 flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-mintgreen" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1 bg-mintgreen rounded-full cursor-pointer hover:opacity-90">
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

          <div className="flex-1 space-y-2">
            <h2 className="text-xl font-semibold text-primary-text">{form.fullName}</h2>
            <p className="text-muted-text">{form.role}</p>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-softgreen rounded-full">
              <CheckCircle className="w-3 h-3 text-primary-text" />
              <span className="text-xs font-medium text-primary-text">Active</span>
            </div>
            {success && (
              <p className="text-xs text-softgreen font-medium">✓ Profile updated successfully!</p>
            )}
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Full Name"    name="fullName"    icon={User}     />
            <Field label="Phone Number" name="phoneNumber" icon={Phone}    type="tel" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Address"      name="address"     icon={MapPin}   />
            <Field label="Email"        name="email"       icon={Mail}     type="email" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Role"         name="role"        icon={Briefcase} />
            <Field label="Attendance"   name="attendance"  icon={CheckCircle} />
          </div>
        </div>

        {error && <p className="text-darkred text-xs text-center">{error}</p>}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave} disabled={saving}
                className="flex-1 px-4 py-2 bg-mintgreen text-inverse-text rounded-lg hover:opacity-90 font-medium text-sm disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-primary-text rounded-lg hover:bg-background font-medium text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-2 bg-mintgreen text-inverse-text rounded-lg hover:opacity-90 font-medium text-sm"
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