import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import { useUIState } from '../contexts/UIStateContext';

const GlobalLoader = () => {
    const { loading } = useUIState();

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
        >
            <Box display="flex" flexDirection="column" alignItems="center">
                <CircularProgress color="inherit" />
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Loading...
                </Typography>
            </Box>
        </Backdrop>
    );
};

export default GlobalLoader;