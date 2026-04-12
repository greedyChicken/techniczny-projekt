import { budgetLayoutStyles } from "../pages/budgets/styles/budgetStyles";

/** Same vertical rhythm as Budgets / Dashboard. */
export const settingsPageContainerSx = budgetLayoutStyles.pageContainer;

/** Primary form surface: matches `budgetLayoutStyles.sectionCard`; full width of container like the page header. */
export const settingsAccountPaperSx = {
  ...budgetLayoutStyles.sectionCard,
  width: "100%",
};

export const settingsDangerPaperSx = {
  ...budgetLayoutStyles.sectionCard,
  width: "100%",
  borderColor: "error.light",
  boxShadow: "0 10px 24px rgba(239, 68, 68, 0.08)",
  bgcolor: "rgba(239, 68, 68, 0.03)",
};
