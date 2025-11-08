"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { 
  loadUserProfile, 
  selectIsProfileComplete, 
  selectUserProfile 
} from "@/app/store/user_profile_slice";
import UsernameSetupDialog from "@/app/components/UsernameSetupDialog";

interface UserProfileProviderProps {
  children: React.ReactNode;
}

export default function UserProfileProvider({ children }: UserProfileProviderProps) {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const isProfileComplete = useSelector(selectIsProfileComplete);
  const userProfile = useSelector(selectUserProfile);
  
  const [showUsernameDialog, setShowUsernameDialog] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email && session?.user?.id) {
      // Load user profile when authenticated
      dispatch(loadUserProfile({
        email: session.user.email,
        id: session.user.id,
        provider: session.provider || "unknown",
      }));
    }
  }, [status, session, dispatch]);

  useEffect(() => {
    // Show username dialog if user is authenticated but profile is not complete
    if (status === "authenticated" && !isProfileComplete && !userProfile) {
      setShowUsernameDialog(true);
    } else {
      setShowUsernameDialog(false);
    }
  }, [status, isProfileComplete, userProfile]);

  const handleUsernameDialogClose = () => {
    // Don't allow closing the dialog without completing setup
    // This ensures users must complete their profile
  };

  return (
    <>
      {children}
      
      <UsernameSetupDialog
        open={showUsernameDialog}
        onClose={handleUsernameDialogClose}
      />
    </>
  );
}