import {useCallback, useEffect, useState} from "react";
import {accountService} from "../../../api/accountService.js";
import { loadFailedMessage } from "../../../utils/feedbackMessages";

export const useAccounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAccounts = useCallback(async () => {
        setLoading(true);
        try {
            const userId = JSON.parse(localStorage.getItem("user")).id;
            const data = await accountService.getAccountsByUserId(userId);
            setAccounts(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching accounts:", err);
            setError(loadFailedMessage("accounts"));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return { accounts, loading, error, refetch: fetchAccounts };
};