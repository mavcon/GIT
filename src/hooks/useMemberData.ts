import { useCallback, useEffect, useState } from "react";
import { Member } from "../types/member";
import storageService, { STORAGE_EVENTS } from "../services/storage";
import { convertDBMemberToMember } from "../utils/memberUtils";
import { dummyMembers } from "../db/dummy-data";

export const useMemberData = () => {
  // Initialize members if needed
  const convertAndInitializeMembers = useCallback((): Member[] => {
    const convertedMembers = dummyMembers.map(convertDBMemberToMember);
    storageService.setMembers(convertedMembers);
    return convertedMembers;
  }, []);

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

  const updateMember = useCallback(
    (memberId: string, updates: Partial<Member>) => {
      storageService.updateMember(memberId, updates);
    },
    []
  );

  return {
    members,
    getAllMembers,
    getMemberById,
    updateMember,
  };
};
