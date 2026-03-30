import { useState, useEffect, useCallback } from "react";
import { transferService } from "../../../api/transferService.js";
import { loadFailedMessage } from "../../../utils/feedbackMessages";

export const useTransfers = () => {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalTransfers, setTotalTransfers] = useState(0);

    const fetchTransfers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const userId = JSON.parse(localStorage.getItem("user")).id;
            const response = await transferService.getTransfers(
                userId,
                page,
                rowsPerPage,
                "transferDate,desc"
            );
            setTransfers(response.content || []);
            setTotalTransfers(response.totalElements || 0);
        } catch (err) {
            console.error("Error fetching transfers:", err);
            setError(loadFailedMessage("transfers"));
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage]);

    useEffect(() => {
        fetchTransfers();
    }, [fetchTransfers]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const dismissError = () => setError(null);

    return {
        transfers,
        loading,
        error,
        fetchTransfers,
        dismissError,
        page,
        rowsPerPage,
        totalTransfers,
        handleChangePage,
        handleChangeRowsPerPage,
    };
};
