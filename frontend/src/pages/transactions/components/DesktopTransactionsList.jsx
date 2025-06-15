import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import TransactionRow from './TransactionRow';

const DesktopTransactionsList = ({
                                     transactions,
                                     onEdit,
                                     onDelete,
                                     getAccountName
                                 }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Account</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TransactionRow
                            key={transaction.id}
                            transaction={transaction}
                            accountName={getAccountName(transaction.accountId)}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DesktopTransactionsList;