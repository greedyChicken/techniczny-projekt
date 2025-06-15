import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Button,
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    AccountBalanceWallet as WalletIcon,
    TrendingUp as TrendingUpIcon,
    AccountBalance as BudgetIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "Accounts", icon: <WalletIcon />, path: "/accounts" },
    { text: "Transactions", icon: <TrendingUpIcon />, path: "/transactions" },
    { text: "Budgets", icon: <BudgetIcon />, path: "/budgets" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

const AppLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const drawer = (
        <Box sx={{ overflow: "auto" }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    paddingLeft: 3,
                }}
            >
                <Typography variant="h6" component="div" noWrap>
                    Finance App
                </Typography>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton onClick={() => handleNavigation(item.path)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {user ? `Welcome, ${user.email}` : "Finance Manager"}
                    </Typography>
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AppLayout;