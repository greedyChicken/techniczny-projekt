import { useState, useEffect } from "react";
import { useUIState } from "../../../contexts/UIStateContext";
import { accountService } from "../../../api/accountService";

export const useDashboard = () => {
    const [summary, setSummary] = useState({
        totalAccountsBalance: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        netCashFlow: 0
    });
    const { showLoading, hideLoading, showError, isLoading } = useUIState();

    useEffect(() => {
        const fetchSummary = async () => {
            showLoading('dashboard-summary');
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.id) {
                    throw new Error("User not found");
                }
                const data = await accountService.getSummary(user.id);
                setSummary(data);
            } catch (err) {
                console.error("Error fetching summary:", err);
                showError("Failed to load dashboard data");
            } finally {
                hideLoading('dashboard-summary');
            }
        };

        fetchSummary();
    }, [showLoading, hideLoading, showError]);

    return {
        summary,
        isLoading: isLoading('dashboard-summary')
    };
};