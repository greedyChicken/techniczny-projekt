import React from "react";
import { Container, Box, Grid, Card, CardContent, Skeleton } from "@mui/material";
import { dashboardLayoutStyles } from "../styles/dashboardStyles";

const LoadingState = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={dashboardLayoutStyles.pageContainer}>
                {/* Header Loading */}
                <Box sx={{ mb: 3, borderRadius: 3, p: { xs: 2, md: 3 }, bgcolor: "action.hover" }}>
                    <Skeleton variant="text" width="200px" height={40} />
                    <Skeleton variant="text" width="60%" height={20} sx={{ mt: 1 }} />
                </Box>

                {/* Summary Cards Loading */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {[1, 2, 3, 4].map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item}>
                            <Card sx={dashboardLayoutStyles.sectionCard}>
                                <CardContent sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}>
                                    <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                                    <Skeleton variant="text" width={100} height={32} />
                                    <Skeleton variant="text" width={80} height={20} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Recent Transactions Loading */}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card sx={dashboardLayoutStyles.sectionCard}>
                            <Skeleton variant="text" width="200px" height={28} />
                            <Box sx={{ mt: 2, height: "300px" }}>
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <Skeleton
                                        key={item}
                                        variant="rectangular"
                                        width="100%"
                                        height={40}
                                        sx={{ mb: 1 }}
                                    />
                                ))}
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default LoadingState;
