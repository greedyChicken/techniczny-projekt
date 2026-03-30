import React from "react";
import { Grid, Card, CardContent, Skeleton, Box } from "@mui/material";
import { budgetCardStyles } from "../styles/budgetStyles";

const LoadingState = () => {
    return (
        <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                    <Card sx={budgetCardStyles.root}>
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Skeleton variant="text" width="60%" height={32} />
                                <Skeleton variant="rounded" width={32} height={32} />
                            </Box>
                            <Skeleton variant="text" width="40%" />
                            <Box sx={{ my: 2 }}>
                                <Skeleton variant="text" width="80%" />
                                <Skeleton variant="rounded" height={8} sx={{ mt: 1, borderRadius: 1 }} />
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                                <Skeleton variant="rounded" width={72} height={28} sx={{ borderRadius: 2 }} />
                                <Skeleton variant="rounded" width={88} height={28} sx={{ borderRadius: 2 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default LoadingState;
