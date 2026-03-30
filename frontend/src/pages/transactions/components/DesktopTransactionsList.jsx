import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import TransactionRow from "./TransactionRow";
import { transactionTableContainerSx, transactionTableHeadCellSx } from "../styles/transactionStyles";

const DesktopTransactionsList = ({ transactions, onEdit, onDelete, getAccountName }) => {
    return (
        <TableContainer sx={transactionTableContainerSx}>
            <Table size="medium">
                <TableHead>
                    <TableRow>
                        <TableCell sx={transactionTableHeadCellSx}>Date</TableCell>
                        <TableCell sx={transactionTableHeadCellSx}>Category</TableCell>
                        <TableCell sx={transactionTableHeadCellSx}>Description</TableCell>
                        <TableCell sx={transactionTableHeadCellSx}>Account</TableCell>
                        <TableCell align="right" sx={transactionTableHeadCellSx}>
                            Amount
                        </TableCell>
                        <TableCell align="right" sx={transactionTableHeadCellSx}>
                            Actions
                        </TableCell>
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
