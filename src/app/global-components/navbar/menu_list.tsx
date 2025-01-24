import { MenuItem, Typography } from "@mui/material";
import { signOut } from "next-auth/react";

export default function MenuList({ handleCloseNavMenu }: { handleCloseNavMenu: () => void }) {
    const handleLogout = () => {
        handleCloseNavMenu();
        signOut();
    };

    return (
        <>
            <MenuItem onClick={handleCloseNavMenu}>
                <Typography variant="inherit">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseNavMenu}>
                <Typography variant="inherit">Account</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseNavMenu}>
                <Typography variant="inherit">Dashboard</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <Typography variant="inherit">Logout</Typography>
            </MenuItem>
        </>
    );
}

