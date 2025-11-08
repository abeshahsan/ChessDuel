"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// User Profile Types and Interface
export interface UserProfile {
  id: string;
  email: string;
  ign: string; // In-game name
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileState {
  profile: UserProfile | null;
  isProfileComplete: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CreateProfilePayload {
  ign: string;
}

export interface UpdateProfilePayload {
  ign?: string;
}

// Local storage key for user profiles
const USER_PROFILES_KEY = "chessduel_user_profiles";

// Helper functions for localStorage
const getUserProfiles = (): { [email: string]: UserProfile } => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(USER_PROFILES_KEY);
  return stored ? JSON.parse(stored) : {};
};

const saveUserProfile = (profile: UserProfile): void => {
  if (typeof window === "undefined") return;
  const profiles = getUserProfiles();
  profiles[profile.email] = profile;
  localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(profiles));
};

const getUserProfileByEmail = (email: string): UserProfile | null => {
  const profiles = getUserProfiles();
  return profiles[email] || null;
};

// Initial state
const initialState: UserProfileState = {
  profile: null,
  isProfileComplete: false,
  isLoading: false,
  error: null,
};

// Redux slice
const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      state.error = null;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    loadUserProfile: (state, action: PayloadAction<{ email: string; id: string; provider: string }>) => {
      const { email, id, provider } = action.payload;
      const existingProfile = getUserProfileByEmail(email);
      
      if (existingProfile) {
        state.profile = existingProfile;
        state.isProfileComplete = true;
      } else {
        // User exists but no profile created yet
        state.profile = null;
        state.isProfileComplete = false;
      }
      state.isLoading = false;
      state.error = null;
    },
    
    createUserProfile: (state, action: PayloadAction<CreateProfilePayload & { email: string; id: string; provider: string }>) => {
      const { ign, email, id, provider } = action.payload;
      
      // Validate IGN
      if (!ign || ign.trim().length < 2) {
        state.error = "In-game name must be at least 2 characters long";
        return;
      }
      
      if (ign.trim().length > 20) {
        state.error = "In-game name must be less than 20 characters";
        return;
      }
      
      // Check if IGN already exists
      const profiles = getUserProfiles();
      const ignExists = Object.values(profiles).some(profile => 
        profile.ign.toLowerCase() === ign.trim().toLowerCase()
      );
      
      if (ignExists) {
        state.error = "This in-game name is already taken";
        return;
      }
      
      // Create new profile
      const newProfile: UserProfile = {
        id,
        email,
        ign: ign.trim(),
        provider,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save to localStorage
      saveUserProfile(newProfile);
      
      state.profile = newProfile;
      state.isProfileComplete = true;
      state.error = null;
      state.isLoading = false;
    },
    
    updateUserProfile: (state, action: PayloadAction<UpdateProfilePayload>) => {
      if (!state.profile) {
        state.error = "No profile to update";
        return;
      }
      
      const { ign } = action.payload;
      
      if (ign) {
        // Validate IGN
        if (ign.trim().length < 2) {
          state.error = "In-game name must be at least 2 characters long";
          return;
        }
        
        if (ign.trim().length > 20) {
          state.error = "In-game name must be less than 20 characters";
          return;
        }
        
        // Check if IGN already exists (excluding current user)
        const profiles = getUserProfiles();
        const ignExists = Object.values(profiles).some(profile => 
          profile.ign.toLowerCase() === ign.trim().toLowerCase() && 
          profile.email !== state.profile!.email
        );
        
        if (ignExists) {
          state.error = "This in-game name is already taken";
          return;
        }
        
        state.profile.ign = ign.trim();
      }
      
      state.profile.updatedAt = new Date().toISOString();
      
      // Save to localStorage
      saveUserProfile(state.profile);
      
      state.error = null;
    },
    
    clearUserProfile: (state) => {
      state.profile = null;
      state.isProfileComplete = false;
      state.error = null;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  loadUserProfile,
  createUserProfile,
  updateUserProfile,
  clearUserProfile,
  clearError,
} = userProfileSlice.actions;

export const selectUserProfile = (state: { userProfile: UserProfileState }) => state.userProfile.profile;
export const selectIsProfileComplete = (state: { userProfile: UserProfileState }) => state.userProfile.isProfileComplete;
export const selectProfileLoading = (state: { userProfile: UserProfileState }) => state.userProfile.isLoading;
export const selectProfileError = (state: { userProfile: UserProfileState }) => state.userProfile.error;

export default userProfileSlice.reducer;