import { alpha } from "@mui/material/styles";

export const DRAWER_WIDTH = 280;

export const mainContentSx = {
  flexGrow: 1,
  width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
  minHeight: "100vh",
  bgcolor: "background.default",
  px: { xs: 2, sm: 3 },
  py: { xs: 2, sm: 3 },
};

export const appBarSx = {
  zIndex: (theme) => theme.zIndex.drawer + 1,
  width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
  ml: { sm: `${DRAWER_WIDTH}px` },
  bgcolor: "background.paper",
  color: "text.primary",
  borderBottom: 1,
  borderColor: "divider",
  boxShadow: "none",
};

export const drawerPaperSx = {
  width: DRAWER_WIDTH,
  boxSizing: "border-box",
  borderRight: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
  display: "flex",
  flexDirection: "column",
};

export const brandBlockSx = (theme) => ({
  px: 2.5,
  py: 2.25,
  borderBottom: 1,
  borderColor: "divider",
  background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(
    theme.palette.secondary.main,
    0.06
  )} 100%)`,
});

export const brandIconWrapSx = (theme) => ({
  width: 44,
  height: 44,
  borderRadius: 2,
  display: "grid",
  placeItems: "center",
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: "primary.contrastText",
  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
});

export const navSubheaderSx = {
  px: 2.5,
  pt: 2,
  pb: 0.75,
  typography: "overline",
  fontWeight: 700,
  letterSpacing: "0.12em",
  color: "text.secondary",
  lineHeight: 1.2,
};

export const navListSx = { px: 1.5, py: 0.5, flex: 1 };

export const navItemButtonSx = {
  borderRadius: 2,
  mb: 0.25,
  py: 1,
  px: 1.25,
  "& .MuiListItemIcon-root": {
    minWidth: 40,
  },
  "&:not(.Mui-selected) .MuiListItemIcon-root": {
    color: "text.secondary",
  },
  "&:not(.Mui-selected):hover": {
    bgcolor: "action.hover",
  },
  "&.Mui-selected": {
    bgcolor: "primary.main",
    color: "primary.contrastText",
    "&:hover": { bgcolor: "primary.dark" },
    "& .MuiListItemIcon-root": { color: "inherit" },
  },
};

export const drawerFooterSx = {
  borderTop: 1,
  borderColor: "divider",
  p: 1.5,
  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.06),
};
