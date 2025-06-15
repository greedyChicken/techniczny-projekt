import React from "react";
import {Container, Box, Alert, Grid, useMediaQuery} from "@mui/material";
import { useUIState } from "../../contexts/UIStateContext";
import { useDashboard } from "./hooks/useDashboard";

import DashboardHeader from "./components/DashboardHeader";
import SummaryCards from "./components/SummaryCards";
import RecentTransactions from "./components/RecentTransactions";
import ExpenseCategoriesChart from "./components/ExpenseCategoriesChart";
import BudgetOverview from "./components/BudgetOverview";
import LoadingState from "./components/LoadingState";
import theme from "../../styles/theme.js";

const DashboardPage = () => {
    const { error, hideLoading } = useUIState();
    const { summary, isLoading } = useDashboard();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 2, mb: 2 }}>
                <DashboardHeader />

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() => hideLoading('dashboard-summary')}
                    >
                        {error.message}
                    </Alert>
                )}

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
                </Grid>)}
            </Box>
        </Container>
    );
};

export default DashboardPage;
