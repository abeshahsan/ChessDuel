"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { 
  createUserProfile, 
  clearError, 
  selectProfileError, 
  selectProfileLoading,
  selectIsProfileComplete
} from "@/app/store/user_profile_slice";

interface UsernameSetupDialogProps {
  open: boolean;
  onClose?: () => void;
}

export default function UsernameSetupDialog({ open, onClose }: UsernameSetupDialogProps) {
  const [ign, setIgn] = useState("");
  const dispatch = useDispatch();
  const { data: session } = useSession();
  
  const error = useSelector(selectProfileError);
  const isLoading = useSelector(selectProfileLoading);
  const isProfileComplete = useSelector(selectIsProfileComplete);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.email || !session?.user?.id) {
      return;
    }

    dispatch(createUserProfile({
      ign: ign.trim(),
      email: session.user.email,
      id: session.user.id,
      provider: session.provider || "unknown",
    }));
  };

  const handleIgnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only alphanumeric characters, underscores, and hyphens
    const sanitized = value.replace(/[^a-zA-Z0-9_-]/g, "");
    setIgn(sanitized);
    
    if (error) {
      dispatch(clearError());
    }
  };

  const isValidIgn = ign.trim().length >= 2 && ign.trim().length <= 20;

  // Close dialog when profile is successfully created
  React.useEffect(() => {
    if (isProfileComplete && onClose) {
      onClose();
    }
  }, [isProfileComplete, onClose]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      disableEscapeKeyDown={true}
      disableScrollLock={true} // Prevent scrollbar hiding
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          Welcome to ChessDuel!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Choose your in-game name
        </Typography>
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              autoFocus
              fullWidth
              label="In-Game Name"
              variant="outlined"
              value={ign}
              onChange={handleIgnChange}
              placeholder="Enter your display name"
              helperText="2-20 characters, letters, numbers, underscore, and dash allowed"
              inputProps={{
                maxLength: 20,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
            
            <Box sx={{ 
              p: 2, 
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
              borderRadius: 1,
              border: "1px solid",
              borderColor: (theme) => theme.palette.mode === 'dark' ? 'grey.700' : 'grey.200'
            }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                📝 Why do we need this?
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • Your in-game name will be displayed to other players<br/>
                • We don't use your OAuth provider's name or photo<br/>
                • Your email remains private<br/>
                • This name must be unique across all players
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={!isValidIgn || isLoading}
            sx={{
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 1,
            }}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Creating Profile...
              </Box>
            ) : (
              "Start Playing"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}