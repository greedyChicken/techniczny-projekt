import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    IconButton,
    Divider,
    Tooltip,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    AccountBalance as BankIcon,
} from "@mui/icons-material";
import { ACCOUNT_TYPE_ICONS } from "../utils/constants";
import { formatCurrency, formatAccountType } from "../utils/formatters";

const AccountCard = ({ account, onEdit, onDelete }) => {
    const IconComponent = ACCOUNT_TYPE_ICONS[account.accountType] || BankIcon;

    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box sx={{ mr: 1, color: "primary.main" }}>
                        <IconComponent />
                    </Box>
                    <Typography variant="h6" component="div" noWrap>
                        {account.name}
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formatAccountType(account.accountType)}
                </Typography>
                <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                    {formatCurrency(account.balance, account.currencyCode)}
                </Typography>
                {account.institutionName && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {account.institutionName}
                    </Typography>
                )}
            </CardContent>
            <Divider />
            <CardActions>
                <Box sx={{ flexGrow: 1 }} />
                <Tooltip title="Edit Account">
                    <IconButton size="small" onClick={onEdit}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Account">
                    <IconButton size="small" onClick={onDelete}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default AccountCard;