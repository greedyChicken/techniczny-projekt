export const financesLayoutStyles = {
    pageContainer: {
        mt: { xs: 2, md: 3 },
        mb: { xs: 2, md: 4 },
    },
    hero: {
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        color: "common.white",
        background:
            "linear-gradient(135deg, rgba(37,99,235,1) 0%, rgba(124,58,237,0.95) 100%)",
        boxShadow: "0 18px 36px rgba(37, 99, 235, 0.25)",
    },
    heroSubtitle: {
        opacity: 0.9,
        maxWidth: "720px",
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
    summaryCard: {
        p: { xs: 2, md: 3 },
        mb: { xs: 2, md: 3 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 10px 20px rgba(15, 23, 42, 0.05)",
    },
    fab: {
        position: "fixed",
        bottom: 24,
        right: 24,
        boxShadow: "0 12px 28px rgba(37, 99, 235, 0.4)",
    },
};

export const transferListContainerSx = {
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    overflow: "hidden",
};
