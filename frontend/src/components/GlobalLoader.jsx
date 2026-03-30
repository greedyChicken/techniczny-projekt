import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import { useUIState } from '../contexts/UIStateContext';

const GlobalLoader = () => {
    const { loading } = useUIState();

    return (
        <Backdrop
            sx={{
                color: "background.paper",
                zIndex: (theme) => theme.zIndex.modal,
                backgroundColor: "rgba(15, 23, 42, 0.45)",
            }}
            open={loading}
        >
            <Box display="flex" flexDirection="column" alignItems="center">
                <CircularProgress color="primary" />
                <Typography variant="body1" sx={{ mt: 2 }} color="text.primary">
                    Loading...
                </Typography>
            </Box>
        </Backdrop>
    );
};

export default GlobalLoader;