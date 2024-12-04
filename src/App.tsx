import React, { useState } from "react";
import { ConnectionsProvider } from "./context/ConnectionsContext";
import { ChatProvider } from "./context/ChatContext";
import { NotificationProvider } from "./context/NotificationContext";
import RoleBasedRoutes from "./components/routing/RoleBasedRoutes";
import MemberNav from "./components/navigation/MemberNav";
import ProfileMenu from "./components/common/ProfileMenu";
import NotificationBell from "./components/common/NotificationBell";
import Toast from "./components/common/Toast";
import { useMember } from "./hooks/useMember";
import { useNotificationDemo } from "./hooks/useNotificationDemo";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
}

// This would normally come from auth context
const CURRENT_USER_ID = "1";

const AppContent = () => {
  const { getMemberById } = useMember(CURRENT_USER_ID);
  const currentUser = getMemberById(CURRENT_USER_ID);

  // Initialize demo notifications
  useNotificationDemo();

  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    isVisible: false,
  });

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  if (!currentUser) return null;

  return (
    <div className="App min-h-screen bg-base-200">
      <header className="bg-base-100 shadow-lg fixed top-0 left-0 right-0 z-50 h-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <img src="/DOJOLIBRE_LOGO2.svg" alt="DojoLibre" className="h-7" />
                <span className="text-xl font-bold italic text-base-content">
                  DOJOLIBRE
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <MemberNav />
            </div>
            <div className="flex items-center gap-0">
              <NotificationBell />
              <ProfileMenu
                username={currentUser.username}
                profilePhoto={currentUser.profilePhoto || "/default-avatar.png"}
                isOnline={currentUser.isOnline}
              />
            </div>
          </div>
        </div>
      </header>
      <main className="mt-12">
        <RoleBasedRoutes userRole="member" currentUserId={CURRENT_USER_ID} />
        {toast.isVisible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        )}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ConnectionsProvider>
      <ChatProvider currentUserId={CURRENT_USER_ID}>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </ChatProvider>
    </ConnectionsProvider>
  );
};

export default App;
