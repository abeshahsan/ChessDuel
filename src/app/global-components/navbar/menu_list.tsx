import { MenuItem, Typography, ListItemIcon } from "@mui/material";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
    Person as ProfileIcon,
    Settings as SettingsIcon,
    Dashboard as DashboardIcon,
    History as HistoryIcon,
    Logout as LogoutIcon 
} from "@mui/icons-material";

export default function MenuList({ handleCloseNavMenu }: { handleCloseNavMenu: () => void }) {
    const router = useRouter();

    const handleLogout = async () => {
        handleCloseNavMenu();
        await signOut({ callbackUrl: "/" });
    };

    const handleNavigation = (path: string) => {
        handleCloseNavMenu();
        router.push(path);
    };

    return (
        <>
            <MenuItem onClick={() => handleNavigation("/profile")}>
                <ListItemIcon>
                    <ProfileIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Profile</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/dashboard")}>
                <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Dashboard</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/history")}>
                <ListItemIcon>
                    <HistoryIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Match History</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/settings")}>
                <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Settings</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="inherit">Sign Out</Typography>
            </MenuItem>
        </>
    );
}

