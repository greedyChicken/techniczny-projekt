import { Grid, Paper, Typography, Button, Skeleton, Card, CardContent, Box } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import AccountCard from "./AccountCard";
import { accountService } from "../../../api/accountService";

const AccountsList = ({ accounts, loading, error, onRefetch, onEdit, onDelete, showSnackbar }) => {
    const handleDeleteAccount = async (accountId) => {
        if (!window.confirm("Are you sure you want to delete this account?")) {
            return;
        }

        try {
            await accountService.deleteAccount(accountId);
            onDelete(accountId);
        } catch (err) {
            console.error("Error deleting account:", err);
            showSnackbar("Failed to delete account. Please try again.", "error");
        }
    };

    if (loading) {
        return (
            <Grid container spacing={3}>
                {[1, 2, 3, 4].map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item}>
                        <Card>
                            <CardContent>
                                <Skeleton variant="text" width="60%" height={40} />
                                <Skeleton variant="text" width="40%" />
                                <Box sx={{ mt: 2 }}>
                                    <Skeleton variant="text" width="80%" />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (error) {
        return (
            <Paper sx={{ p: 3, backgroundColor: "#ffefef" }}>
                <Typography color="error">{error}</Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={onRefetch}
                >
                    Retry
                </Button>
            </Paper>
        );
    }

    if (accounts.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                    No accounts found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Create your first account to start tracking your finances.
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => onEdit()}
                >
                    Add Account
                </Button>
            </Paper>
        );
    }

    return (
        <Grid container spacing={3}>
            {accounts.map((account) => (
                <Grid item xs={12} sm={6} md={4} key={account.id}>
                    <AccountCard
                        account={account}
                        onEdit={() => onEdit(account)}
                        onDelete={() => handleDeleteAccount(account.id)}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default AccountsList;