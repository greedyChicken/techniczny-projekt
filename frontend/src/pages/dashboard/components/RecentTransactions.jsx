import React, { useState, useEffect } from "react";
import {
    Grid,
    Paper,
    Typography,
    Divider,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
    TrendingUp,
    TrendingDown,
    SwapHoriz
} from "@mui/icons-material";
import { dashboardService } from "../../../api/dashboardService";
import { formatCurrency, formatDate } from "../utils/formatters";
import { useUIState } from "../../../contexts/UIStateContext";

const RecentTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const { showLoading, hideLoading, showError, isLoading } = useUIState();
    const loading = isLoading('recent-transactions');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            showLoading('recent-transactions');
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const data = await dashboardService.getRecentTransactions(user.id, 10);
                setTransactions(data.content || []);
            } catch (err) {
                console.error("Error fetching recent transactions:", err);
                showError("Failed to load recent transactions");
            } finally {
                hideLoading('recent-transactions');
            }
        };

        fetchRecentTransactions();
    }, [showLoading, hideLoading, showError]);

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'INCOME':
                return <TrendingUp />;
            case 'EXPENSE':
                return <TrendingDown />;
            case 'TRANSFER':
                return <SwapHoriz />;
            default:
                return <SwapHoriz />;
        }
    };

    const getTransactionColor = (type) => {
        switch (type) {
            case 'INCOME':
                return 'success';
            case 'EXPENSE':
                return 'error';
            case 'TRANSFER':
                return 'info';
            default:
                return 'default';
        }
    };

    const MobileTransactionCard = ({ transaction }) => (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                        {formatDate(transaction.date)}
                    </Typography>
                    <Chip
                        icon={getTransactionIcon(transaction.type)}
                        label={transaction.type}
                        size="small"
                        color={getTransactionColor(transaction.type)}
                        variant="outlined"
                    />
                </Box>
                <Typography variant="body1" gutterBottom>
                    {transaction.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        {transaction.categoryName || 'Uncategorized'}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: transaction.type === 'INCOME' ? 'success.main' :
                                transaction.type === 'EXPENSE' ? 'error.main' :
                                    'text.primary',
                            fontWeight: 'medium'
                        }}
                    >
                        {transaction.type === 'INCOME' ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Recent Transactions
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : transactions.length === 0 ? (
                        <Alert severity="info">No recent transactions found</Alert>
                    ) : (
                        <>
                            {isMobile ? (
                                <Box>
                                    {transactions.slice(0, 5).map((transaction) => (
                                        <MobileTransactionCard key={transaction.id} transaction={transaction} />
                                    ))}
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Category</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {transactions.map((transaction) => (
                                                <TableRow key={transaction.id} hover>
                                                    <TableCell>
                                                        {formatDate(transaction.date)}
                                                    </TableCell>
                                                    <TableCell>{transaction.description}</TableCell>
                                                    <TableCell>{transaction.categoryName || 'Uncategorized'}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            icon={getTransactionIcon(transaction.type)}
                                                            label={transaction.type}
                                                            size="small"
                                                            color={getTransactionColor(transaction.type)}
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{
                                                            color: transaction.type === 'INCOME' ? 'success.main' :
                                                                transaction.type === 'EXPENSE' ? 'error.main' :
                                                                    'text.primary',
                                                            fontWeight: 'medium'
                                                        }}
                                                    >
                                                        {transaction.type === 'INCOME' ? '+' : '-'}
                                                        {formatCurrency(Math.abs(transaction.amount))}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default RecentTransactions;