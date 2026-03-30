import React from "react";
import {
    Card,
    CardContent,
    Box,
    Typography,
    LinearProgress,
    Chip,
    IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { formatCurrency, getBudgetStatus } from "../utils/formatters";
import { budgetCardStyles } from "../styles/budgetStyles";

const BudgetCard = ({ budget, onEdit, onDelete }) => {
    const { status, color } = getBudgetStatus(budget);
    const amount = Number(budget.amount) || 0;
    const spent = Number(budget.spentAmount) || 0;
    const percentage = amount > 0 ? Math.min((spent / amount) * 100, 100) : 0;

    return (
        <Card sx={budgetCardStyles.root}>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1, sm: 0 },
                    }}
                >
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontSize: { xs: "1.1rem", sm: "1.2rem" },
                            fontWeight: 700,
                            wordBreak: "break-word",
                            pr: { sm: 1 },
                        }}
                    >
                        {budget.name}
                    </Typography>
                    <Box sx={budgetCardStyles.actions}>
                        <IconButton
                            size="small"
                            aria-label="Edit budget"
                            onClick={() => onEdit(budget)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            aria-label="Delete budget"
                            onClick={() => onDelete(budget.id)}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {format(budget.startDate, "MMM dd")} – {format(budget.endDate, "MMM dd, yyyy")}
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                            flexWrap: "wrap",
                            gap: 0.5,
                        }}
                    >
                        <Typography variant="body2">
                            {formatCurrency(spent)} / {formatCurrency(amount)}
                        </Typography>
                        <Typography variant="body2" color={`${color}.main`} fontWeight={700}>
                            {percentage.toFixed(0)}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={percentage}
                        color={color}
                        sx={{ height: 8, borderRadius: 1 }}
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1, sm: 0 },
                    }}
                >
                    <Chip
                        label={budget.active ? "Active" : "Inactive"}
                        color={budget.active ? "success" : "default"}
                        size="small"
                        variant={budget.active ? "filled" : "outlined"}
                    />
                    <Chip
                        label={
                            status === "over"
                                ? "Over budget"
                                : status === "warning"
                                  ? "Near limit"
                                  : "On track"
                        }
                        color={color}
                        size="small"
                        variant="outlined"
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default BudgetCard;
