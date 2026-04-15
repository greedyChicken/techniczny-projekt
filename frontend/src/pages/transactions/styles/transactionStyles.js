export const transactionLayoutStyles = {
    pageContainer: {
        mt: { xs: 2, md: 3 },
        mb: { xs: 2, md: 4 },
    },
    contentStack: {
        display: "flex",
        flexDirection: "column",
        gap: 3,
    },
    sectionCard: {
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 12px 24px rgba(15, 23, 42, 0.06)",
        background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)",
    },
};

export const transactionPageHeaderStyles = {
    wrapper: {
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        color: "common.white",
        background:
            "linear-gradient(135deg, rgba(37,99,235,1) 0%, rgba(124,58,237,0.95) 100%)",
        boxShadow: "0 18px 36px rgba(37, 99, 235, 0.25)",
    },
    subtitle: {
        opacity: 0.9,
        maxWidth: "720px",
    },
    outlinedActionButtonSx: {
        borderColor: "rgba(255,255,255,0.5)",
        color: "common.white",
        "&:hover": {
            borderColor: "common.white",
            bgcolor: "rgba(255,255,255,0.12)",
        },
        "&.Mui-disabled": {
            borderColor: "rgba(255,255,255,0.28)",
            color: "rgba(255,255,255,0.55)",
        },
    },
};

export const transactionTableContainerSx = {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 10px 20px rgba(15, 23, 42, 0.05)",
    overflow: "hidden",
};

export const transactionMobileCardSx = {
    mb: 2,
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
    transition: "box-shadow 0.2s ease",
    "&:hover": {
        boxShadow: "0 12px 24px rgba(15, 23, 42, 0.08)",
    },
};

export const transactionTableHeadCellSx = {
    fontWeight: 700,
    bgcolor: "action.hover",
    borderBottom: "1px solid",
    borderColor: "divider",
};

export const transactionIconButtonGroupSx = {
    display: "inline-flex",
    gap: 0.5,
    "& .MuiIconButton-root": {
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.5,
        "&:hover": { bgcolor: "action.hover" },
    },
};

export const transactionFabSx = {
    position: "fixed",
    bottom: 24,
    right: 24,
    boxShadow: "0 12px 28px rgba(37, 99, 235, 0.4)",
};
