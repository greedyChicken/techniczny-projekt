export const budgetLayoutStyles = {
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

export const budgetPageHeaderStyles = {
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
};

export const budgetSummaryCardStyles = {
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
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 1,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    bgcolor: "action.hover",
  },
};

export const budgetCardStyles = {
  root: {
    height: "100%",
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "0 10px 20px rgba(15, 23, 42, 0.05)",
    transition: "box-shadow 0.2s ease",
    "&:hover": {
      boxShadow: "0 14px 28px rgba(15, 23, 42, 0.08)",
    },
  },
  actions: {
    display: "flex",
    gap: 0.5,
    "& .MuiIconButton-root": {
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      bgcolor: "background.paper",
      "&:hover": { bgcolor: "action.hover" },
    },
  },
};

export const budgetFabSx = {
  position: "fixed",
  bottom: 24,
  right: 24,
  boxShadow: "0 12px 28px rgba(37, 99, 235, 0.4)",
};

export const budgetSummaryGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
  gap: 3,
};

export const budgetListGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
  gap: 3,
};
