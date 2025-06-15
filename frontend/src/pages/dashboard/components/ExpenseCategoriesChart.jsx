import React, { useState, useEffect } from "react";
import { Paper, Typography, Divider, Box, CircularProgress, Alert } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { dashboardService } from "../../../api/dashboardService";
import { formatCurrency } from "../utils/formatters";
import { DASHBOARD_CONSTANTS } from "../utils/constants";
import { useUIState } from "../../../contexts/UIStateContext";

const ExpenseCategoriesChart = () => {
    const [categoryData, setCategoryData] = useState([]);
    const { showLoading, hideLoading, showError, isLoading } = useUIState();
    const loading = isLoading('expense-categories');

    useEffect(() => {
        const fetchCategoryData = async () => {
            showLoading('expense-categories');
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const now = new Date();
                const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
                const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

                const data = await dashboardService.getExpensesByCategory(user.id, startDate, endDate);

                const chartData = Object.entries(data || {}).map(([category, amount]) => ({
                    name: category,
                    value: amount
                }));

                setCategoryData(chartData);
            } catch (err) {
                console.error("Error fetching expense categories:", err);
            } finally {
                hideLoading('expense-categories');
            }
        };

        fetchCategoryData();
    }, [showLoading, hideLoading, showError]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{
                    bgcolor: 'background.paper',
                    p: 1,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1
                }}>
                    <Typography variant="body2">{payload[0].name}</Typography>
                    <Typography variant="body2" color="primary">
                        {formatCurrency(payload[0].value)}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
                                       cx, cy, midAngle, innerRadius, outerRadius, percent
                                   }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="12"
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);

    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Expense Categories
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Total: {formatCurrency(totalExpenses)}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: "300px" }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : categoryData.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Alert severity="info">No expense data available for this month</Alert>
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={DASHBOARD_CONSTANTS.CHART_COLORS[index % DASHBOARD_CONSTANTS.CHART_COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value, entry) => `${value}: ${formatCurrency(entry.payload.value)}`}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </Paper>
    );
};

export default ExpenseCategoriesChart;