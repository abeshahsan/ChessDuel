"use client";

import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { ReactNode } from "react";
import { selectIsProfileComplete, selectUserProfile } from "@/app/store/user_profile_slice";
import { Container, Paper, Typography, Box, CircularProgress } from "@mui/material";
import { AccountCircle as ProfileIcon } from "@mui/icons-material";

interface ProfileGuardProps {
  children: ReactNode;
  requireProfile?: boolean;
}

export default function ProfileGuard({ 
  children, 
  requireProfile = true 
}: ProfileGuardProps) {
  const { data: session, status } = useSession();
  const isProfileComplete = useSelector(selectIsProfileComplete);
  const userProfile = useSelector(selectUserProfile);

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // If not authenticated, let AuthGuard handle it
  if (status === "unauthenticated") {
    return <>{children}</>;
  }

  // If profile is required but not complete, show profile setup message
  if (requireProfile && !isProfileComplete) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: "center",
            borderRadius: 2
          }}
        >
          <Box sx={{ mb: 3 }}>
            <ProfileIcon 
              sx={{ 
                fontSize: 64, 
                color: "primary.main",
                mb: 2
              }} 
            />
          </Box>
          
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Complete Your Profile
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Please complete your profile setup to access this feature. 
            You'll be prompted to choose an in-game name when you're ready.
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Your profile setup dialog should appear shortly. If it doesn't, 
            please try refreshing the page.
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Profile is complete or not required, render children
  return <>{children}</>;
}