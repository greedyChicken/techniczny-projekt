import React from "react";
import { TableRow, TableCell, Chip, Box, Typography, IconButton, Tooltip } from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowUpward as IncomeIcon,
    ArrowDownward as ExpenseIcon,
} from "@mui/icons-material";
import { formatCurrency, formatDate } from "../utils/formatters";
import { transactionIconButtonGroupSx } from "../styles/transactionStyles";

const TransactionRow = ({ transaction, accountName, onEdit, onDelete }) => {
    const isExpense = transaction.amount < 0;

    return (
        <TableRow hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell>{formatDate(transaction.date)}</TableCell>
            <TableCell>
                <Chip
                    label={transaction.categoryName}
                    size="small"
                    color={isExpense ? "error" : "success"}
                    variant="outlined"
                />
            </TableCell>
            <TableCell>{transaction.description || "—"}</TableCell>
            <TableCell>{accountName}</TableCell>
            <TableCell align="right">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 0.5,
                        color: isExpense ? "error.main" : "success.main",
                        fontWeight: 600,
                    }}
                >
                    {isExpense ? <ExpenseIcon fontSize="small" /> : <IncomeIcon fontSize="small" />}
                    <Typography component="span" variant="body2" fontWeight={700}>
                        {formatCurrency(Math.abs(transaction.amount))}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="right">
                <Box sx={transactionIconButtonGroupSx}>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => onEdit(transaction)} aria-label="Edit transaction">
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => onDelete(transaction.id)} aria-label="Delete transaction">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default TransactionRow;
