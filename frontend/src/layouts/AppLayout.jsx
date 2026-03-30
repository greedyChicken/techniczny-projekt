import { Fragment, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
    AppBar,
    Avatar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Stack,
    Toolbar,
    Tooltip,
    Typography,
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
    Savings as BrandIcon,
} from "@mui/icons-material";
import {
    DRAWER_WIDTH,
    appBarSx,
    brandBlockSx,
    brandIconWrapSx,
    drawerFooterSx,
    drawerPaperSx,
    mainContentSx,
    navItemButtonSx,
    navListSx,
    navSubheaderSx,
} from "./appShellStyles";

const NAV_GROUPS = [
    {
        title: "Overview",
        items: [{ text: "Dashboard", icon: DashboardIcon, path: "/dashboard" }],
    },
    {
        title: "Finances",
        items: [
            { text: "Accounts", icon: WalletIcon, path: "/accounts" },
            { text: "Transactions", icon: TrendingUpIcon, path: "/transactions" },
            { text: "Budgets", icon: BudgetIcon, path: "/budgets" },
        ],
    },
    {
        title: "Account",
        items: [{ text: "Settings", icon: SettingsIcon, path: "/settings" }],
    },
];

const flatNav = NAV_GROUPS.flatMap((g) => g.items);

const AppLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const currentPage = flatNav.find((item) => item.path === location.pathname);
    const pageTitle = currentPage?.text ?? "Finance";

    const userInitial =
        user?.email?.trim()?.charAt(0)?.toUpperCase() ?? "?";
    const userEmail = user?.email ?? "";

    const handleDrawerToggle = () => {
        setMobileOpen((open) => !open);
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const drawerContent = (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={brandBlockSx(theme)}>
                <Stack direction="row" spacing={1.75} alignItems="center">
                    <Box sx={brandIconWrapSx(theme)}>
                        <BrandIcon sx={{ fontSize: 26 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={700} noWrap>
                            Finance App
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                            Your money, organized
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <List disablePadding sx={navListSx} component="nav">
                {NAV_GROUPS.map((group) => (
                    <Fragment key={group.title}>
                        <ListSubheader disableSticky sx={navSubheaderSx}>
                            {group.title}
                        </ListSubheader>
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            const selected = location.pathname === item.path;
                            return (
                                <ListItem key={item.path} disablePadding>
                                    <ListItemButton
                                        selected={selected}
                                        onClick={() => handleNavigation(item.path)}
                                        sx={navItemButtonSx}
                                    >
                                        <ListItemIcon>
                                            <Icon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontWeight: selected ? 600 : 500,
                                                variant: "body2",
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </Fragment>
                ))}
            </List>

            <Box sx={drawerFooterSx}>
                <ListItemButton
                    onClick={() => {
                        logout();
                        if (isMobile) setMobileOpen(false);
                    }}
                    sx={{
                        borderRadius: 2,
                        py: 1,
                        color: "text.secondary",
                        "&:hover": { bgcolor: "action.hover", color: "error.main" },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                        primary="Log out"
                        primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                    />
                </ListItemButton>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            <AppBar position="fixed" elevation={0} sx={appBarSx}>
                <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1, sm: 2 } }}>
                    <IconButton
                        color="inherit"
                        aria-label="Open navigation"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 1.5, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="h6" noWrap component="h1" fontWeight={700}>
                            {pageTitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display={{ xs: "none", sm: "block" }}>
                            Signed in as {userEmail || "user"}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Tooltip title={userEmail || "Profile"}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: "primary.main",
                                    fontSize: "0.95rem",
                                    fontWeight: 700,
                                }}
                            >
                                {userInitial}
                            </Avatar>
                        </Tooltip>
                        <Tooltip title="Log out">
                            <IconButton
                                onClick={logout}
                                color="inherit"
                                aria-label="Log out"
                                sx={{
                                    display: { xs: "none", sm: "inline-flex" },
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 2,
                                }}
                            >
                                <LogoutIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
                aria-label="Main navigation"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        zIndex: (t) => t.zIndex.modal,
                        "& .MuiDrawer-paper": drawerPaperSx,
                    }}
                >
                    {drawerContent}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": drawerPaperSx,
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box component="main" sx={mainContentSx}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AppLayout;
