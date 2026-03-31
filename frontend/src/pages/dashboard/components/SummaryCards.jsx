import React from "react";
import { Box } from "@mui/material";
import {
    AccountBalance as AccountBalanceIcon,
    TrendingUp as TrendingUpIcon,
    BarChart as BarChartIcon,
    Paid as PaidIcon,
} from "@mui/icons-material";
import SummaryCard from "./SummaryCard";
import { useUIState } from "../../../contexts/UIStateContext";
import { dashboardLayoutStyles } from "../styles/dashboardStyles";

const SummaryCards = ({ summary }) => {
    const { isLoading } = useUIState();
    const loading = isLoading('dashboard-summary');

    const summaryData = [
        {
            icon: AccountBalanceIcon,
            value: summary.totalAccountsBalance,
            label: "Total Balance",
            color: "primary"
        },
        {
            icon: TrendingUpIcon,
            value: summary.monthlyIncome,
            label: "Monthly Income",
            color: "success"
        },
        {
            icon: PaidIcon,
            value: summary.monthlyExpenses,
            label: "Monthly Expenses",
            color: "error"
        },
        {
            icon: BarChartIcon,
            value: summary.netCashFlow,
            label: "Monthly Savings",
            color: "warning"
        }
    ];

    return (
        <Box sx={dashboardLayoutStyles.summaryGrid}>
            {summaryData.map((item) => (
                <SummaryCard
                    key={item.label}
                    icon={item.icon}
                    value={item.value}
                    label={item.label}
                    color={item.color}
                    isLoading={loading}
                />
            ))}
        </Box>
    );
};

export default SummaryCards;
