import { Paper, Grid, Typography } from "@mui/material";
import { formatCurrency } from "../utils/formatters";
import { financesLayoutStyles } from "../styles/financesPageStyles";

const AccountsSummary = ({ totalBalance, accountCount }) => {
    return (
        <Paper sx={financesLayoutStyles.summaryCard}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom color="text.secondary">
                        Total Balance
                    </Typography>
                    <Typography variant="h4">
                        {formatCurrency(totalBalance)}
                    </Typography>
                </Grid>
                <Grid item xs={6} md={4}>
                    <Typography variant="h6" gutterBottom color="text.secondary">
                        Number of Accounts
                    </Typography>
                    <Typography variant="h4">{accountCount}</Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default AccountsSummary;