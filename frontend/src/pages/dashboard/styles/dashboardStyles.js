export const dashboardLayoutStyles = {
  pageContainer: {
    mt: { xs: 2, md: 3 },
    mb: { xs: 2, md: 4 },
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  contentStack: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
    gap: 3,
    mb: 3,
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

export const dashboardHeaderStyles = {
  wrapper: {
    p: { xs: 2, md: 3 },
    borderRadius: 3,
    color: "common.white",
    background:
      "linear-gradient(135deg, rgba(25,118,210,1) 0%, rgba(124,77,255,0.95) 100%)",
    boxShadow: "0 18px 36px rgba(25, 118, 210, 0.28)",
  },
  subtitle: {
    opacity: 0.88,
    maxWidth: "760px",
  },
};

export const summaryCardStyles = {
  card: {
    height: "100%",
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 10px 20px rgba(15, 23, 42, 0.05)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 14px 28px rgba(15, 23, 42, 0.09)",
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: 0.75,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    bgcolor: "action.hover",
  },
};
