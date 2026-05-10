import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setTheme,
  setLanguage,
  setCurrency,
  updateNotifications,
} from "../store/slices/settingsSlice";
import toast from "react-hot-toast";
import { FiMoon, FiSun } from "react-icons/fi";

const Settings = () => {
  const dispatch = useAppDispatch();
  const { theme, language, currency, notifications } = useAppSelector(state => state.settings);

  const handleSave = () => {
    toast.success('Settings saved');
    // TODO: call PATCH /api/user/settings when API is ready
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-8 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Settings</h1>

      <div className="max-w-2xl space-y-6">

        {/* ── Appearance ── */}
        <Section title="Appearance">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">Theme</p>
              <p className="text-xs text-gray-500">Choose between light and dark mode</p>
            </div>
            <div className="flex rounded-full border border-gray-200 overflow-hidden">
              <ThemeButton
                active={theme === 'light'}
                icon={<FiSun />}
                label="Light"
                onClick={() => dispatch(setTheme('light'))}
              />
              <ThemeButton
                active={theme === 'dark'}
                icon={<FiMoon />}
                label="Dark"
                onClick={() => dispatch(setTheme('dark'))}
              />
            </div>
          </div>
        </Section>

        {/* ── Regional ── */}
        <Section title="Regional">
          <SettingRow label="Language" hint="Interface language">
            <select
              value={language}
              onChange={e => dispatch(setLanguage(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="mr">Marathi</option>
            </select>
          </SettingRow>
          <SettingRow label="Currency" hint="Price display currency">
            <select
              value={currency}
              onChange={e => dispatch(setCurrency(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="₹">₹ Indian Rupee</option>
              <option value="$">$ US Dollar</option>
              <option value="€">€ Euro</option>
            </select>
          </SettingRow>
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications">
          <ToggleRow
            label="Email Notifications"
            hint="Receive updates via email"
            checked={notifications.email}
            onChange={v => dispatch(updateNotifications({ email: v }))}
          />
          <ToggleRow
            label="SMS Notifications"
            hint="Get SMS alerts for enquiries"
            checked={notifications.sms}
            onChange={v => dispatch(updateNotifications({ sms: v }))}
          />
          <ToggleRow
            label="Push Notifications"
            hint="Browser/app push alerts"
            checked={notifications.push}
            onChange={v => dispatch(updateNotifications({ push: v }))}
          />
          <ToggleRow
            label="Price Drop Alerts"
            hint="Notify when wishlisted property price drops"
            checked={notifications.priceAlerts}
            onChange={v => dispatch(updateNotifications({ priceAlerts: v }))}
          />
          <ToggleRow
            label="New Listing Alerts"
            hint="Notify for new properties in your saved searches"
            checked={notifications.newListings}
            onChange={v => dispatch(updateNotifications({ newListings: v }))}
          />
        </Section>

        {/* ── Privacy ── */}
        <Section title="Privacy & Security">
          <div className="space-y-3">
            <ActionRow label="Two-Factor Authentication" hint="Add extra security to your account" />
            <ActionRow label="Active Sessions" hint="Manage where you're logged in" />
            <ActionRow label="Privacy Controls" hint="Manage who can see your profile" />
          </div>
        </Section>

        <button
          onClick={handleSave}
          className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dull transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

// ── Local component helpers ──────────────────────────────────────────────────

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h3 className="text-base font-semibold text-gray-800 mb-5">{title}</h3>
    <div className="space-y-5">{children}</div>
  </div>
);

const SettingRow = ({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <p className="text-xs text-gray-400">{hint}</p>
    </div>
    {children}
  </div>
);

const ToggleRow = ({
  label, hint, checked, onChange,
}: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <p className="text-xs text-gray-400">{hint}</p>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  </div>
);

const ThemeButton = ({
  active, icon, label, onClick,
}: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2 text-sm transition ${
      active ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
    }`}
  >
    {icon} {label}
  </button>
);

const ActionRow = ({ label, hint }: { label: string; hint: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <p className="text-xs text-gray-400">{hint}</p>
    </div>
    <button className="text-xs px-4 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
      Manage
    </button>
  </div>
);

export default Settings;
