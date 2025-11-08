'use client';

import { Avatar, Box, IconButton, Menu, Tooltip, Typography, Divider } from "@mui/material";
import React from "react";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { selectUserProfile } from "@/app/store/user_profile_slice";
import MenuList from "./menu_list";

export default function UserMenu() {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const { data: session } = useSession();
    const userProfile = useSelector(selectUserProfile);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Use IGN from profile instead of OAuth name
    const displayName = userProfile?.ign || session?.user?.name || 'User';
    const userInitials = displayName.length >= 2 
        ? displayName.substring(0, 2).toUpperCase()
        : displayName.charAt(0).toUpperCase();

    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={`${displayName} - Open menu`}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                        alt={displayName} 
                        src={''} // Don't use OAuth provider image
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'primary.main', // Always use colored background
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {userInitials}
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                disableScrollLock={true} // Prevent scrollbar hiding
                PaperProps={{
                    sx: { minWidth: 200 }
                }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                        {displayName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {session?.user?.email}
                    </Typography>
                    {session?.provider && (
                        <Typography variant="caption" color="text.secondary" display="block">
                            via {session.provider.charAt(0).toUpperCase() + session.provider.slice(1)}
                        </Typography>
                    )}
                </Box>
                <Divider />
                <MenuList handleCloseNavMenu={handleCloseUserMenu} />
            </Menu>
        </Box>
    );
}

