import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateProfile } from "../store/slices/userSlice";
import { assets } from "../assets/assets";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import LinkWebsiteModal from "../components/LinkWebsiteModal";

const MyProfile = () => {
  const dispatch = useAppDispatch();
  const { profile, isLoggedIn } = useAppSelector(state => state.user);
  const wishlisted = useAppSelector(state => state.wishlist.ids);
  const shortlisted = useAppSelector(state => state.shortlist.ids);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name ?? 'Riya Sharma',
    email: profile?.email ?? 'riya.sharma@example.com',
    phone: profile?.phone ?? '+91 98765 43210',
  });

  // ── Link Website modal state ─────────────────────────────────────────────
  const [websiteModalOpen, setWebsiteModalOpen] = useState(false);
  // Read any previously saved URL from the Redux profile (add `websiteUrl` to your userSlice)
  const existingWebsiteUrl = profile?.websiteUrl;

  const handleSave = () => {
    dispatch(updateProfile(form));
    setEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleCancel = () => {
    setForm({
      name: profile?.name ?? 'Riya Sharma',
      email: profile?.email ?? 'riya.sharma@example.com',
      phone: profile?.phone ?? '+91 98765 43210',
    });
    setEditing(false);
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Avatar & Stats ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={profile?.avatar ?? assets.profile_icon}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
              <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow hover:bg-primary-dull transition">
                <FiEdit2 className="text-xs" />
              </button>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-800">{form.name}</h2>
            <p className="text-sm text-gray-500">{form.email}</p>
            {isLoggedIn && (
              <span className="mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Verified</span>
            )}
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-primary">{wishlisted.length}</p>
              <p className="text-xs text-gray-500 mt-1">Wishlisted</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-primary">{shortlisted.length}</p>
              <p className="text-xs text-gray-500 mt-1">Shortlisted</p>
            </div>
          </div>
        </div>

        {/* ── Profile Form ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-sm text-primary border border-primary/30 px-4 py-1.5 rounded-full hover:bg-primary/5 transition"
                >
                  <FiEdit2 /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 text-sm bg-primary text-white px-4 py-1.5 rounded-full hover:bg-primary-dull transition"
                  >
                    <FiCheck /> Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 text-sm border border-gray-300 text-gray-600 px-4 py-1.5 rounded-full hover:bg-gray-50 transition"
                  >
                    <FiX /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <Field label="Full Name">
                {editing ? (
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{form.name}</p>
                )}
              </Field>

              <Field label="Email Address">
                {editing ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="cursor-not-allowed w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    disabled
                  />
                ) : (
                  <p className="text-sm text-gray-700">{form.email}</p>
                )}
              </Field>

              <Field label="Phone Number">
                {editing ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="cursor-not-allowed w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    disabled
                  />
                ) : (
                  <p className="text-sm text-gray-700">{form.phone}</p>
                )}
              </Field>

              <Field label="Member Since">
                <p className="text-sm text-gray-700">{profile?.createdAt ?? 'April 2026'}</p>
              </Field>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account</h3>
            <div className="space-y-3">
              {/* ── Link Website row ── */}
              <ActionRow
                label="Link Your Website"
                hint={existingWebsiteUrl ? existingWebsiteUrl : "Connect your website and get unlimited leads"}
                onManage={() => setWebsiteModalOpen(true)}
              />
              <ActionRow label="Change Password" hint="Last changed 3 months ago" />
              {/* <ActionRow label="Linked Accounts" hint="Google, Facebook" /> */}
              {/* <ActionRow label="Download My Data" hint="Export all your property interactions" /> */}
              {/* <ActionRow label="Delete Account" hint="Permanently remove your account" danger /> */}
            </div>
          </div>
        </div>

      </div>

      {/* ── Link Website Modal ── */}
      <LinkWebsiteModal
        isOpen={websiteModalOpen}
        onClose={() => setWebsiteModalOpen(false)}
        existingUrl={existingWebsiteUrl?.replace(/^https?:\/\//i, "")}
      />
    </div>
  );
};

// ── Small helpers ────────────────────────────────────────────────────────────
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium text-black uppercase tracking-wide mb-1">{label}</label>
    {children}
  </div>
);

const ActionRow = ({
  label,
  hint,
  danger,
  onManage,
}: {
  label: string;
  hint: string;
  danger?: boolean;
  onManage?: () => void;
}) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div>
      <p className={`text-sm font-medium ${danger ? 'text-red-500' : 'text-gray-800'}`}>{label}</p>
      <p className="text-xs text-gray-800 max-w-sm">{hint}</p>
    </div>
    <button
      onClick={onManage}
      className={`text-xs px-4 py-1.5 rounded-full border transition ${
        danger
          ? 'border-red-200 text-red-500 hover:bg-red-50'
          : 'border-gray-200 text-black hover:bg-gray-50'
      }`}
    >
      Manage
    </button>
  </div>
);

export default MyProfile;