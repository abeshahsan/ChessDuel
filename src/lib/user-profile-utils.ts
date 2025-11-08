// Helper functions for user profile operations on the client side

/**
 * Get user profile by email from localStorage
 */
export function getUserProfileByEmail(email: string): { ign: string; id: string; provider: string } | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem("chessduel_user_profiles");
    if (!stored) return null;
    
    const profiles = JSON.parse(stored);
    return profiles[email] || null;
  } catch (error) {
    console.error("Error reading user profiles from localStorage:", error);
    return null;
  }
}

/**
 * Get current user's IGN for use in matches and display
 */
export function getCurrentUserIgn(session: any): string {
  if (!session?.user?.email) return "Anonymous";
  
  const profile = getUserProfileByEmail(session.user.email);
  return profile?.ign || session?.user?.name || "Anonymous";
}

/**
 * Check if a user has completed their profile setup
 */
export function hasUserCompletedProfile(session: any): boolean {
  if (!session?.user?.email) return false;
  
  const profile = getUserProfileByEmail(session.user.email);
  return profile !== null && !!profile.ign;
}