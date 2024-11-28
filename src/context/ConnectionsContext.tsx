import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Connection } from "../types/member";
import storageService, { STORAGE_EVENTS } from "../services/storage";

interface ConnectionsContextType {
  connections: Connection[];
  addConnection: (connection: Connection) => void;
  removeConnection: (
    userId: string,
    targetUserId: string,
    connectionType: Connection["connectionType"]
  ) => void;
  isFollowing: (userId: string, targetUserId: string) => boolean;
  isBlocked: (userId: string, targetUserId: string) => boolean;
  isBlockedBy: (userId: string, targetUserId: string) => boolean;
  getFollowers: (userId: string) => Connection[];
  getFollowing: (userId: string) => Connection[];
  getBlocked: (userId: string) => Connection[];
  getBlockedBy: (userId: string) => Connection[];
}

const ConnectionsContext = createContext<ConnectionsContextType | undefined>(
  undefined
);

export const ConnectionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [connections, setConnections] = useState<Connection[]>(
    storageService.getConnections()
  );

  // Listen for storage changes
  useEffect(() => {
    const handleConnectionsUpdate = (event: CustomEvent<Connection[]>) => {
      setConnections(event.detail);
    };

    const cleanup = storageService.addStorageListener(
      STORAGE_EVENTS.CONNECTIONS_UPDATED,
      handleConnectionsUpdate
    );

    return cleanup;
  }, []);

  const addConnection = useCallback((connection: Connection) => {
    storageService.addConnection(connection);
  }, []);

  const removeConnection = useCallback(
    (
      userId: string,
      targetUserId: string,
      connectionType: Connection["connectionType"]
    ) => {
      storageService.removeConnection(userId, targetUserId, connectionType);
    },
    []
  );

  const isFollowing = useCallback(
    (userId: string, targetUserId: string) =>
      connections.some(
        (conn) =>
          conn.userId === userId &&
          conn.targetUserId === targetUserId &&
          conn.connectionType === "following"
      ),
    [connections]
  );

  const isBlocked = useCallback(
    (userId: string, targetUserId: string) =>
      connections.some(
        (conn) =>
          conn.userId === userId &&
          conn.targetUserId === targetUserId &&
          conn.connectionType === "blocked"
      ),
    [connections]
  );

  const isBlockedBy = useCallback(
    (userId: string, targetUserId: string) =>
      connections.some(
        (conn) =>
          conn.userId === targetUserId &&
          conn.targetUserId === userId &&
          conn.connectionType === "blocked"
      ),
    [connections]
  );

  const getFollowers = useCallback(
    (userId: string) =>
      connections.filter(
        (conn) =>
          conn.targetUserId === userId &&
          conn.connectionType === "following" &&
          !isBlocked(userId, conn.userId) &&
          !isBlockedBy(userId, conn.userId)
      ),
    [connections, isBlocked, isBlockedBy]
  );

  const getFollowing = useCallback(
    (userId: string) =>
      connections.filter(
        (conn) =>
          conn.userId === userId &&
          conn.connectionType === "following" &&
          !isBlocked(userId, conn.targetUserId) &&
          !isBlockedBy(userId, conn.targetUserId)
      ),
    [connections, isBlocked, isBlockedBy]
  );

  const getBlocked = useCallback(
    (userId: string) =>
      connections.filter(
        (conn) => conn.userId === userId && conn.connectionType === "blocked"
      ),
    [connections]
  );

  const getBlockedBy = useCallback(
    (userId: string) =>
      connections.filter(
        (conn) =>
          conn.targetUserId === userId && conn.connectionType === "blocked"
      ),
    [connections]
  );

  return (
    <ConnectionsContext.Provider
      value={{
        connections,
        addConnection,
        removeConnection,
        isFollowing,
        isBlocked,
        isBlockedBy,
        getFollowers,
        getFollowing,
        getBlocked,
        getBlockedBy,
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  );
};

export const useConnectionsContext = () => {
  const context = useContext(ConnectionsContext);
  if (context === undefined) {
    throw new Error(
      "useConnectionsContext must be used within a ConnectionsProvider"
    );
  }
  return context;
};

// Helper component to display a blocked profile
export const BlockedProfileCard: React.FC = () => (
  <div className="card bg-base-100 shadow-xl opacity-50">
    <div className="card-body">
      <div className="flex items-center gap-4">
        <div className="avatar placeholder">
          <div className="w-24 h-24 rounded-full bg-neutral-focus">
            <span className="text-3xl">?</span>
          </div>
        </div>
        <div>
          <h2 className="card-title">User Not Available</h2>
          <p className="text-base-content/70">This profile is not accessible</p>
        </div>
      </div>
    </div>
  </div>
);
