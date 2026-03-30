import React from "react";
import {
    Box,
    Card,
    CardContent,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import { transactionTableContainerSx, transactionTableHeadCellSx, transactionMobileCardSx } from "../styles/transactionStyles";

const LoadingState = ({ isMobile }) => {
    if (isMobile) {
        return (
            <Box sx={{ mt: 1 }}>
                {[...Array(5)].map((_, index) => (
                    <Card key={index} sx={transactionMobileCardSx}>
                        <CardContent>
                            <Skeleton animation="wave" height={24} sx={{ mb: 1 }} />
                            <Skeleton animation="wave" height={40} />
                            <Skeleton animation="wave" height={36} sx={{ mt: 1 }} />
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    }

    return (
        <TableContainer sx={transactionTableContainerSx}>
            <Table>
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
                    {[...Array(5)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton animation="wave" />
                            </TableCell>
                            <TableCell>
                                <Skeleton animation="wave" />
                            </TableCell>
                            <TableCell>
                                <Skeleton animation="wave" />
                            </TableCell>
                            <TableCell>
                                <Skeleton animation="wave" />
                            </TableCell>
                            <TableCell align="right">
                                <Skeleton animation="wave" sx={{ ml: "auto" }} />
                            </TableCell>
                            <TableCell align="right">
                                <Skeleton animation="wave" sx={{ ml: "auto" }} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default LoadingState;
