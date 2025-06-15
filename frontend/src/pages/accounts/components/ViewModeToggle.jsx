import { ToggleButton, ToggleButtonGroup, Box } from "@mui/material";
import { AccountBalance as BankIcon, SwapHoriz as TransferIcon } from "@mui/icons-material";

const ViewModeToggle = ({ viewMode, setViewMode }) => {
    const handleViewModeChange = (event, newMode) => {
        if (newMode !== null) {
            setViewMode(newMode);
        }
    };

    return (
        <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
            <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
                sx={{
                    width: { xs: "100%", sm: "auto" },
                    "& .MuiToggleButton-root": {
                        flex: { xs: 1, sm: "initial" }
                    }
                }}
            >
                <ToggleButton value="accounts" aria-label="accounts view">
                    <BankIcon sx={{ mr: 1 }} />
                    Accounts
                </ToggleButton>
                <ToggleButton value="transfers" aria-label="transfers view">
                    <TransferIcon sx={{ mr: 1 }} />
                    Transfers
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};

export default ViewModeToggle;