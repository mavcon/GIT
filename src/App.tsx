import React, { useState } from "react";
import { ConnectionsProvider } from "./context/ConnectionsContext";
import RoleBasedRoutes from "./components/routing/RoleBasedRoutes";
import MemberNav from "./components/navigation/MemberNav";
import ProfileMenu from "./components/common/ProfileMenu";
import NotificationBell from "./components/common/NotificationBell";
import Toast from "./components/common/Toast";
import { useMember } from "./hooks/useMember";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
}

const AppContent = () => {
  const currentUserId = "1"; // This would normally come from auth context
  const { getMemberById } = useMember(currentUserId);
  const currentUser = getMemberById(currentUserId);

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
      <header className="bg-base-100 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
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
              <NotificationBell count={3} />
              <ProfileMenu
                username={currentUser.username}
                profilePhoto={currentUser.profilePhoto || "/default-avatar.png"}
                isOnline={currentUser.isOnline}
              />
            </div>
          </div>
        </div>
      </header>
      <main>
        <RoleBasedRoutes userRole="member" currentUserId={currentUserId} />
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
      <AppContent />
    </ConnectionsProvider>
  );
};

export default App;
