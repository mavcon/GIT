import { useCallback, useEffect, useState } from "react";
import { Member, Connection, validateTrainingArts } from "../types/member";
import { useConnectionsContext } from "../context/ConnectionsContext";
import storageService, { STORAGE_EVENTS } from "../services/storage";
import { dummyMembers } from "../db/dummy-data";

export const useMember = (currentUserId: string) => {
  const connections = useConnectionsContext();

  const convertDBMemberToMember = useCallback(
    (dbMember: (typeof dummyMembers)[0]): Member => ({
      id: dbMember.id,
      username: dbMember.username,
      profilePhoto: dbMember.profile_photo,
      email: dbMember.email,
      dateOfBirth: dbMember.date_of_birth,
      trainingStartDate: dbMember.training_start_date,
      trainingArts: validateTrainingArts(dbMember.training_arts),
      bio: dbMember.bio,
      weight: {
        value: dbMember.weight_value,
        unit: dbMember.weight_unit,
      },
      height: {
        value: dbMember.height_value,
        unit: dbMember.height_unit,
      },
      privacySettings: {
        profileVisibility: dbMember.privacy_settings.profile_visibility,
        metricsVisibility: dbMember.privacy_settings.metrics_visibility,
        ageVisibility: dbMember.privacy_settings.age_visibility,
        weightVisibility: dbMember.privacy_settings.weight_visibility,
        heightVisibility: dbMember.privacy_settings.height_visibility,
        connectionsVisibility: dbMember.privacy_settings.connections_visibility,
      },
      status: dbMember.status,
      isOnline: dbMember.is_online,
      lastActive: dbMember.last_active,
    }),
    []
  );

  // Initialize members if needed
  const convertAndInitializeMembers = useCallback((): Member[] => {
    const convertedMembers = dummyMembers.map(convertDBMemberToMember);
    storageService.setMembers(convertedMembers);
    return convertedMembers;
  }, [convertDBMemberToMember]);

  // Initialize storage with dummy data if empty
  useEffect(() => {
    const storage = localStorage.getItem("connections");
    if (!storage) {
      localStorage.setItem("connections", JSON.stringify([]));
    }

    const members = localStorage.getItem("members");
    if (!members) {
      const initialMembers = convertAndInitializeMembers();
      localStorage.setItem("members", JSON.stringify(initialMembers));
    }
  }, [convertAndInitializeMembers]);

  const [members, setMembers] = useState<Member[]>(() => {
    const storedMembers = storageService.getMembers();
    return storedMembers.length ? storedMembers : convertAndInitializeMembers();
  });

  // Listen for storage changes
  useEffect(() => {
    const handleMembersUpdate = (event: CustomEvent<Member[]>) => {
      setMembers(event.detail);
    };

    const cleanup = storageService.addStorageListener(
      STORAGE_EVENTS.MEMBERS_UPDATED,
      handleMembersUpdate
    );

    return cleanup;
  }, []);

  const getAllMembers = useCallback(() => members, [members]);

  const getMemberById = useCallback(
    (memberId: string) => members.find((m) => m.id === memberId) || null,
    [members]
  );

  const getConnectionState = useCallback(
    (memberId: string) => ({
      isFollowing: connections.isFollowing(currentUserId, memberId),
      isBlocked: connections.isBlocked(currentUserId, memberId),
      isBlockedBy: connections.isBlockedBy(currentUserId, memberId),
    }),
    [currentUserId, connections]
  );

  const getVisibleMembers = useCallback(() => {
    return members.filter((member) => {
      const state = getConnectionState(member.id);
      return !state.isBlocked && !state.isBlockedBy;
    });
  }, [members, getConnectionState]);

  const getVisibleConnections = useCallback(
    (
      memberId: string
    ): {
      followers: Connection[];
      following: Connection[];
    } => {
      const state = getConnectionState(memberId);
      if (state.isBlocked || state.isBlockedBy) {
        return {
          followers: [],
          following: [],
        };
      }

      return {
        followers: connections.getFollowers(memberId),
        following: connections.getFollowing(memberId),
      };
    },
    [connections, getConnectionState]
  );

  const updateMember = useCallback(
    (memberId: string, updates: Partial<Member>) => {
      storageService.updateMember(memberId, updates);
    },
    []
  );

  const handleFollow = useCallback(
    (member: Member) => {
      connections.addConnection({
        id: `${currentUserId}-${member.id}-following`,
        userId: currentUserId,
        targetUserId: member.id,
        username: member.username,
        profilePhoto: member.profilePhoto,
        connectionType: "following",
        isOnline: member.isOnline,
        lastActive: member.lastActive,
      });
    },
    [currentUserId, connections]
  );

  const handleUnfollow = useCallback(
    (memberId: string) => {
      connections.removeConnection(currentUserId, memberId, "following");
    },
    [currentUserId, connections]
  );

  const handleBlock = useCallback(
    (member: Member) => {
      // Remove any existing connections first
      connections.removeConnection(currentUserId, member.id, "following");
      connections.removeConnection(member.id, currentUserId, "following");
      // Add block connection
      connections.addConnection({
        id: `${currentUserId}-${member.id}-blocked`,
        userId: currentUserId,
        targetUserId: member.id,
        username: member.username,
        profilePhoto: member.profilePhoto,
        connectionType: "blocked",
        isOnline: member.isOnline,
        lastActive: member.lastActive,
      });
    },
    [currentUserId, connections]
  );

  const handleUnblock = useCallback(
    (memberId: string) => {
      connections.removeConnection(currentUserId, memberId, "blocked");
    },
    [currentUserId, connections]
  );

  const handleChat = useCallback((memberId: string) => {
    console.log("Opening chat with member:", memberId);
  }, []);

  return {
    members,
    getAllMembers,
    getMemberById,
    getVisibleMembers,
    updateMember,
    getConnectionState,
    getVisibleConnections,
    handleFollow,
    handleUnfollow,
    handleBlock,
    handleUnblock,
    handleChat,
    ...connections,
  };
};
