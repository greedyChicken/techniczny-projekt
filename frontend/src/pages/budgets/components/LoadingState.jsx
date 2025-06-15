import React from 'react';
import { Grid, Card, CardContent, Skeleton, Box } from '@mui/material';

const LoadingState = () => {
    return (
        <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Card raised>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Skeleton variant="text" width="60%" height={32} />
                                <Skeleton variant="circular" width={24} height={24} />
                            </Box>
                            <Skeleton variant="text" width="40%" />
                            <Box sx={{ my: 2 }}>
                                <Skeleton variant="text" width="80%" />
                                <Skeleton variant="rectangular" height={8} sx={{ mt: 1, borderRadius: 1 }} />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 2 }} />
                                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 2 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default LoadingState;