import { useState, useEffect } from "react";
import {transferService} from "../../../api/transferService.js";

export const useTransfers = (viewMode) => {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalTransfers, setTotalTransfers] = useState(0);

    const fetchTransfers = async () => {
        if (viewMode !== "transfers") return;

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
            setError("Failed to load transfers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (viewMode === "transfers") {
            fetchTransfers();
        }
    }, [viewMode, page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return {
        transfers,
        loading,
        error,
        fetchTransfers,
        page,
        rowsPerPage,
        totalTransfers,
        handleChangePage,
        handleChangeRowsPerPage
    };
};