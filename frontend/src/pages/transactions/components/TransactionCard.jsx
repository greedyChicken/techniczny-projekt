import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Box,
    Typography,
    IconButton,
    Collapse,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button
} from '@mui/material';
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    AccountBalance as AccountIcon,
    CalendarToday as CalendarIcon,
    Category as CategoryIcon,
    Description as DescriptionIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../utils/formatters';

const TransactionCard = ({
                             transaction,
                             accountName,
                             expanded,
                             onToggleExpand,
                             onEdit,
                             onDelete
                         }) => {
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(transaction.date)}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            color: transaction.amount < 0 ? 'error.main' : 'success.main'
                        }}
                    >
                        {formatCurrency(Math.abs(transaction.amount))}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>
                        {transaction.description || 'No description'}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={() => onToggleExpand(transaction.id)}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </Box>
            </CardContent>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ pt: 0, pb: 1 }}>
                    <Divider sx={{ my: 1 }} />
                    <List dense disablePadding>
                        <ListItem disablePadding sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <AccountIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Account"
                                secondary={accountName}
                                primaryTypographyProps={{ variant: 'caption' }}
                            />
                        </ListItem>

                        <ListItem disablePadding sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <CalendarIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Date"
                                secondary={formatDate(transaction.date)}
                                primaryTypographyProps={{ variant: 'caption' }}
                            />
                        </ListItem>

                        <ListItem disablePadding sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <CategoryIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Category"
                                secondary={transaction.categoryName}
                                primaryTypographyProps={{ variant: 'caption' }}
                            />
                        </ListItem>

                        {transaction.description && (
                            <ListItem disablePadding sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <DescriptionIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Description"
                                    secondary={transaction.description}
                                    primaryTypographyProps={{ variant: 'caption' }}
                                />
                            </ListItem>
                        )}
                    </List>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', pt: 0, pb: 1, px: 2 }}>
                    <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => onEdit(transaction)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => onDelete(transaction.id)}
                    >
                        Delete
                    </Button>
                </CardActions>
            </Collapse>
        </Card>
    );
};

export default TransactionCard;