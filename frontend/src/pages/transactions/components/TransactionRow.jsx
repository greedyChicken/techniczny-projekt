import React from 'react';
import {
    TableRow,
    TableCell,
    Chip,
    Box,
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowUpward as IncomeIcon,
    ArrowDownward as ExpenseIcon
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../utils/formatters';

const TransactionRow = ({ transaction, accountName, onEdit, onDelete }) => {
    return (
        <TableRow>
            <TableCell>
                {formatDate(transaction.date)}
            </TableCell>
            <TableCell>
                <Chip
                    label={transaction.categoryName}
                    size="small"
                    color={transaction.amount < 0 ? 'error' : 'success'}
                    variant="outlined"
                />
            </TableCell>
            <TableCell>{transaction.description || '-'}</TableCell>
            <TableCell>{accountName}</TableCell>
            <TableCell align="right">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        color: transaction.amount < 0 ? 'error.main' : 'success.main'
                    }}
                >
                    {transaction.amount < 0 ? (
                        <ExpenseIcon fontSize="small" />
                    ) : (
                        <IncomeIcon fontSize="small" />
                    )}
                    <Typography sx={{ ml: 1 }}>
                        {formatCurrency(Math.abs(transaction.amount))}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="right">
                <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => onEdit(transaction)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => onDelete(transaction.id)}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
};

export default TransactionRow;