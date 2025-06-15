import { Box, Paper, Typography, Button, Skeleton, List, TablePagination, useTheme, useMediaQuery } from "@mui/material";
import { SwapHoriz as TransferIcon } from "@mui/icons-material";
import TransferListItem from "./TransferListItem";
import MobilePagination from "../../../components/MobilePagination";

const TransfersList = ({
                           transfers,
                           loading,
                           onMakeTransfer,
                           page,
                           rowsPerPage,
                           totalTransfers,
                           onPageChange,
                           onRowsPerPageChange
                       }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (loading) {
        return (
            <Box>
                {[1, 2, 3].map((item) => (
                    <Paper key={item} sx={{ p: 2, mb: 2 }}>
                        <Skeleton variant="text" width="60%" height={30} />
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="text" width="80%" />
                    </Paper>
                ))}
            </Box>
        );
    }

    if (transfers.length === 0 && !loading) {
        return (
            <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                    No transfers found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Create your first transfer to move money between accounts.
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<TransferIcon />}
                    onClick={onMakeTransfer}
                >
                    Make Transfer
                </Button>
            </Paper>
        );
    }

    return (
        <Box>
            <List>
                {transfers.map((transfer) => (
                    <TransferListItem
                        key={transfer.id}
                        transfer={transfer}
                    />
                ))}
            </List>

            {isMobile ? (
                <MobilePagination
                    count={totalTransfers}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            ) : (
                <TablePagination
                    component="div"
                    count={totalTransfers}
                    page={page}
                    onPageChange={onPageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={onRowsPerPageChange}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="Rows per page:"
                    sx={{
                        borderTop: 1,
                        borderColor: 'divider',
                        mt: 2
                    }}
                />
            )}
        </Box>
    );
};

export default TransfersList;