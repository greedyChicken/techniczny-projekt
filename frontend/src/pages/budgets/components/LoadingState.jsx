import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";
import { budgetCardStyles, budgetListGridSx } from "../styles/budgetStyles";

const LoadingState = () => {
    return (
        <Box sx={budgetListGridSx}>
            {[...Array(6)].map((_, index) => (
                <Card key={index} sx={budgetCardStyles.root}>
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
            ))}
        </Box>
    );
};

export default LoadingState;
