import React from 'react';
import {
    Box,
    IconButton,
    Typography,
    Select,
    MenuItem,
    FormControl
} from '@mui/material';
import {
    KeyboardArrowLeft as PrevIcon,
    KeyboardArrowRight as NextIcon,
    FirstPage as FirstPageIcon,
    LastPage as LastPageIcon
} from '@mui/icons-material';

const MobilePagination = ({
                              count,
                              page,
                              rowsPerPage,
                              onPageChange,
                              onRowsPerPageChange
                          }) => {
    const totalPages = Math.ceil(count / rowsPerPage);
    const startIndex = page * rowsPerPage + 1;
    const endIndex = Math.min((page + 1) * rowsPerPage, count);

    const handleFirstPageClick = (event) => {
        onPageChange(event, 0);
    };

    const handlePrevClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageClick = (event) => {
        onPageChange(event, totalPages - 1);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            py: 2,
            px: 1
        }}>
            {/* Row count info */}
            <Typography variant="caption" color="text.secondary">
                {startIndex}-{endIndex} of {count}
            </Typography>

            {/* Controls */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
            }}>
                {/* Rows per page selector */}
                <FormControl size="small" variant="standard">
                    <Select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(e)}
                        sx={{
                            fontSize: '0.875rem',
                            '& .MuiSelect-select': {
                                py: 0.5,
                                pr: 3
                            }
                        }}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                    </Select>
                </FormControl>

                <Typography variant="caption" color="text.secondary" sx={{ mx: 1 }}>
                    per page
                </Typography>

                {/* Navigation buttons */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        onClick={handleFirstPageClick}
                        disabled={page === 0}
                        size="small"
                        sx={{ p: 0.5 }}
                    >
                        <FirstPageIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={handlePrevClick}
                        disabled={page === 0}
                        size="small"
                        sx={{ p: 0.5 }}
                    >
                        <PrevIcon fontSize="small" />
                    </IconButton>

                    <Typography variant="caption" sx={{ mx: 1, minWidth: '3rem', textAlign: 'center' }}>
                        {page + 1} / {totalPages}
                    </Typography>

                    <IconButton
                        onClick={handleNextClick}
                        disabled={page >= totalPages - 1}
                        size="small"
                        sx={{ p: 0.5 }}
                    >
                        <NextIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={handleLastPageClick}
                        disabled={page >= totalPages - 1}
                        size="small"
                        sx={{ p: 0.5 }}
                    >
                        <LastPageIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default MobilePagination;