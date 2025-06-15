import React from 'react';
import { Box } from '@mui/material';
import TransactionCard from './TransactionCard';

const MobileTransactionsList = ({
                                    transactions,
                                    expandedCards,
                                    onEdit,
                                    onDelete,
                                    onToggleExpand,
                                    getAccountName
                                }) => {
    return (
        <Box sx={{ mt: 2 }}>
            {transactions.map((transaction) => (
                <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    accountName={getAccountName(transaction.accountId)}
                    expanded={expandedCards[transaction.id] || false}
                    onToggleExpand={onToggleExpand}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </Box>
    );
};

export default MobileTransactionsList;