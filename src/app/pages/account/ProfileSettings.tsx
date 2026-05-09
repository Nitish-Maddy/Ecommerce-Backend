import { useState } from 'react';
import { Settings, User, Lock, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../services/api';
import { toast } from 'sonner';

export function ProfileSettings() {
  const { user } = useAuth();
  const userId = user?._id;

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSavingProfile(true);
    try {
      await userApi.updateProfile(userId, profileForm);
      toast.success('Profile updated successfully');
      // Update localStorage
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        parsed.name = profileForm.name;
        parsed.email = profileForm.email;
        localStorage.setItem('auth_user', JSON.stringify(parsed));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    }
    setSavingProfile(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    try {
      await userApi.changePassword(userId, passwordForm.newPassword);
      toast.success('Password changed successfully');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    }
    setSavingPassword(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
        <Settings className="text-primary" size={24} /> Profile Settings
      </h1>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-4">
        <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <User size={18} className="text-primary" /> Personal Information
        </h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
        <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Lock size={18} className="text-primary" /> Change Password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
              minLength={6}
              placeholder="Re-enter your new password"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 bg-gray-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-900 transition-all disabled:opacity-50"
          >
            <Lock size={16} /> {savingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
