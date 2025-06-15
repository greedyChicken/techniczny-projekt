import React from 'react';
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
    Paper
} from '@mui/material';

const LoadingState = ({ isMobile }) => {
    if (isMobile) {
        return (
            <Box sx={{ mt: 2 }}>
                {[...Array(5)].map((_, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                            <Skeleton animation="wave" height={60} />
                            <Skeleton animation="wave" height={40} />
                            <Skeleton animation="wave" height={40} />
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    }

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
                                <Skeleton animation="wave" />
                            </TableCell>
                            <TableCell align="right">
                                <Skeleton animation="wave" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default LoadingState;