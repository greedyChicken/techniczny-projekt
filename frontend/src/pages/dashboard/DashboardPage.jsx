import React from "react";
import { Container, Box, Alert, Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useUIState } from "../../contexts/UIStateContext";
import { useDashboard } from "./hooks/useDashboard";

import DashboardHeader from "./components/DashboardHeader";
import SummaryCards from "./components/SummaryCards";
import RecentTransactions from "./components/RecentTransactions";
import ExpenseCategoriesChart from "./components/ExpenseCategoriesChart";
import BudgetOverview from "./components/BudgetOverview";
import LoadingState from "./components/LoadingState";
import { dashboardLayoutStyles } from "./styles/dashboardStyles";
import { pageErrorAlertSx } from "../../styles/feedbackStyles";

const DashboardPage = () => {
    const { error, clearError } = useUIState();
    const { summary, isLoading } = useDashboard();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={dashboardLayoutStyles.pageContainer}>
                <DashboardHeader />

                {error && (
                    <Alert
                        severity={error.severity || "error"}
                        sx={pageErrorAlertSx}
                        onClose={clearError}
                    >
                        {error.message}
                    </Alert>
                )}

                <Box sx={dashboardLayoutStyles.contentStack}>
                    <SummaryCards summary={summary} />
                    <RecentTransactions />

                    {!isMobile && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <ExpenseCategoriesChart />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <BudgetOverview />
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default DashboardPage;
