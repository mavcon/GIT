import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useMember } from "../hooks/useMember";
import { Member } from "../types/member";
import { motion } from "framer-motion";

interface SettingsProps {
  currentUserId: string;
}

const ThemeSelector: React.FC = () => {
  const { theme, setTheme, currentTheme } = useTheme();

  return (
    <div className="flex flex-col gap-4 p-4 bg-base-200 rounded-lg">
      <h3 className="text-lg font-bold">Theme Preferences</h3>
      <div className="flex gap-4">
        {(["light", "dark", "system"] as const).map((themeOption) => (
          <button
            key={themeOption}
            onClick={() => setTheme(themeOption)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all
              ${
                theme === themeOption
                  ? "bg-primary text-primary-content shadow-lg"
                  : "bg-base-100 hover:bg-base-300 text-base-content"
              }`}
          >
            {themeOption === "light" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            )}
            {themeOption === "dark" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
            {themeOption === "system" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            )}
            <span className="capitalize font-bold">{themeOption}</span>
          </button>
        ))}
      </div>
      <p className="text-sm font-medium text-base-content/80">
        Currently using:{" "}
        {theme === "system" ? `System (${currentTheme})` : theme}
      </p>
    </div>
  );
};

const PrivacyToggle: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-base-content font-bold">{label}</span>
      <motion.button
        onClick={onChange}
        className={`p-2 rounded-full transition-colors ${
          checked ? "bg-primary shadow-lg" : "bg-base-300"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-colors ${
            checked ? "text-primary-content" : "text-base-content"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          animate={{ scale: checked ? 1 : 0.8 }}
        >
          {checked ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          )}
        </motion.svg>
      </motion.button>
    </label>
  );
};

const PrivacySettings: React.FC<{
  member: Member;
  onUpdate: (memberId: string, updates: Partial<Member>) => void;
}> = ({ member, onUpdate }) => {
  const toggleSetting = (key: keyof Member["privacySettings"]) => {
    onUpdate(member.id, {
      privacySettings: {
        ...member.privacySettings,
        [key]: !member.privacySettings[key],
      },
    });
  };

  const isPublicProfile = Object.values(member.privacySettings).some(
    (value) => value
  );

  return (
    <div className="flex flex-col gap-4 p-4 bg-base-200 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Privacy Settings</h3>
        <motion.div
          className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            isPublicProfile
              ? "bg-primary text-primary-content"
              : "bg-base-300 text-base-content"
          }`}
          animate={{ scale: isPublicProfile ? 1 : 0.95 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {isPublicProfile ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              />
            )}
          </svg>
          <span className="text-sm font-bold">
            {isPublicProfile ? "Public Profile" : "Private Profile"}
          </span>
        </motion.div>
      </div>
      <div className="flex flex-col gap-3">
        <PrivacyToggle
          label="Age"
          checked={member.privacySettings.ageVisibility}
          onChange={() => toggleSetting("ageVisibility")}
        />
        <PrivacyToggle
          label="Weight"
          checked={member.privacySettings.weightVisibility}
          onChange={() => toggleSetting("weightVisibility")}
        />
        <PrivacyToggle
          label="Height"
          checked={member.privacySettings.heightVisibility}
          onChange={() => toggleSetting("heightVisibility")}
        />
        <PrivacyToggle
          label="Connections"
          checked={member.privacySettings.connectionsVisibility}
          onChange={() => toggleSetting("connectionsVisibility")}
        />
      </div>
    </div>
  );
};

const UserInformation: React.FC<{ member: Member }> = ({ member }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-base-200 rounded-lg">
      <h3 className="text-lg font-bold">Account Information</h3>
      <div className="grid gap-3">
        <div className="flex justify-between">
          <span className="text-base-content/80 font-medium">Email</span>
          <span className="font-bold">{member.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/80 font-medium">Date Joined</span>
          <span className="font-bold">
            {formatDate(member.trainingStartDate)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/80 font-medium">Birthday</span>
          <span className="font-bold">{formatDate(member.dateOfBirth)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-base-content/80 font-medium">Height</span>
          <span className="font-bold">
            {member.height.value} {member.height.unit}
          </span>
        </div>
      </div>
    </div>
  );
};

const PasswordChange: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-base-200 rounded-lg">
      <h3 className="text-lg font-bold">Password</h3>
      <p className="text-sm font-medium text-base-content/80">
        Password management coming soon...
      </p>
      <button className="btn btn-primary font-bold" disabled>
        Change Password
      </button>
    </div>
  );
};

const LegalDocuments: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-base-200 rounded-lg">
      <h3 className="text-lg font-bold">Legal Documents</h3>
      <div className="flex flex-col gap-2">
        <a href="/terms" className="link link-primary font-bold">
          Terms of Service
        </a>
        <a href="/waiver" className="link link-primary font-bold">
          Liability Waiver
        </a>
      </div>
    </div>
  );
};

const Settings: React.FC<SettingsProps> = ({ currentUserId }) => {
  const { getMemberById, updateMember } = useMember(currentUserId);
  const member = getMemberById(currentUserId);

  if (!member) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>
      <div className="flex flex-col gap-6">
        <ThemeSelector />
        <PrivacySettings member={member} onUpdate={updateMember} />
        <PasswordChange />
        <UserInformation member={member} />
        <LegalDocuments />
      </div>
    </div>
  );
};

export default Settings;
