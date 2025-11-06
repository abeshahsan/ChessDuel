'use client';

import { Avatar, Box, IconButton, Menu, Tooltip, Typography, Divider } from "@mui/material";
import React from "react";
import { useSession } from "next-auth/react";
import MenuList from "./menu_list";

export default function UserMenu() {
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const { data: session } = useSession();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const userInitials = session?.user?.name 
        ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : 'U';

    return (
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={`${session?.user?.name || 'User'} - Open menu`}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                        alt={session?.user?.name || 'User'} 
                        src={session?.user?.image || ''}
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: session?.user?.image ? 'transparent' : 'primary.main',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {!session?.user?.image && userInitials}
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
                PaperProps={{
                    sx: { minWidth: 200 }
                }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                        {session?.user?.name || 'User'}
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

