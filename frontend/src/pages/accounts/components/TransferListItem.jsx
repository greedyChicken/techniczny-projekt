import {
    Paper,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    IconButton,
    Tooltip,
} from "@mui/material";
import {
    SwapHoriz as TransferIcon,
    ArrowForward as ArrowIcon,
    AccessTime as TimeIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { formatCurrency, formatDateTime } from "../utils/formatters";

const TransferListItem = ({ transfer, onEdit, onDelete }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
                position: "relative",
            }}
        >
            {(onEdit || onDelete) && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        zIndex: 1,
                        display: "flex",
                    }}
                >
                    {onEdit && (
                        <Tooltip title="Edit transfer">
                            <IconButton
                                size="small"
                                aria-label="Edit transfer"
                                onClick={() => onEdit(transfer)}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    {onDelete && (
                        <Tooltip title="Delete transfer">
                            <IconButton
                                size="small"
                                aria-label="Delete transfer"
                                onClick={() => onDelete(transfer.id)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            )}
            <ListItem
                sx={{
                    py: 2,
                    pr: onEdit || onDelete ? { xs: 1, sm: 10 } : 2,
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                }}
            >
                <Box sx={{ display: "flex", flex: 1, width: "100%" }}>
                    <ListItemIcon sx={{ minWidth: isMobile ? 40 : 56 }}>
                        <TransferIcon color="primary" fontSize={isMobile ? "medium" : "large"} />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        flexWrap: isMobile ? "nowrap" : "wrap",
                                        mb: isMobile ? 1 : 0,
                                    }}
                                >
                                    <Typography
                                        variant={isMobile ? "body1" : "subtitle1"}
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: isMobile ? "0.875rem" : "1rem",
                                            whiteSpace: isMobile ? "nowrap" : "normal",
                                            overflow: isMobile ? "hidden" : "visible",
                                            textOverflow: isMobile ? "ellipsis" : "clip",
                                            maxWidth: isMobile ? "40%" : "none",
                                        }}
                                    >
                                        {transfer.sourceAccountName}
                                    </Typography>
                                    <ArrowIcon fontSize="small" color="action" sx={{ flexShrink: 0 }} />
                                    <Typography
                                        variant={isMobile ? "body1" : "subtitle1"}
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: isMobile ? "0.875rem" : "1rem",
                                            whiteSpace: isMobile ? "nowrap" : "normal",
                                            overflow: isMobile ? "hidden" : "visible",
                                            textOverflow: isMobile ? "ellipsis" : "clip",
                                            maxWidth: isMobile ? "40%" : "none",
                                        }}
                                    >
                                        {transfer.targetAccountName}
                                    </Typography>
                                </Box>
                                {isMobile && (
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            color: "primary.main",
                                            mt: 1,
                                            mb: 1,
                                        }}
                                    >
                                        {formatCurrency(transfer.amount, transfer.currencyCode)}
                                    </Typography>
                                )}
                            </Box>
                        }
                        secondary={
                            <Box component="div" sx={{ mt: 1 }}>
                                {transfer.description && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            mb: 0.5,
                                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                                        }}
                                    >
                                        {transfer.description}
                                    </Typography>
                                )}
                                <Box
                                    component="span"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        flexWrap: "nowrap",
                                    }}
                                >
                                    <TimeIcon fontSize="small" color="action" />
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                            whiteSpace: "nowrap",
                                            fontSize: isMobile ? "0.7rem" : "0.75rem",
                                        }}
                                    >
                                        {formatDateTime(transfer.transferDate)}
                                    </Typography>
                                </Box>
                            </Box>
                        }
                        secondaryTypographyProps={{
                            component: "div",
                        }}
                    />
                </Box>
                {!isMobile && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            minWidth: 120,
                            ml: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                color: "primary.main",
                            }}
                        >
                            {formatCurrency(transfer.amount, transfer.currencyCode)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {transfer.currencyCode}
                        </Typography>
                    </Box>
                )}
            </ListItem>
        </Paper>
    );
};

export default TransferListItem;
