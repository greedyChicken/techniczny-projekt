import { createContext, useContext, useState, useCallback } from 'react';

const UIStateContext = createContext(null);

export const UIStateProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingStates, setLoadingStates] = useState({});

    const showLoading = useCallback((key = 'global') => {
        setLoadingStates(prev => ({ ...prev, [key]: true }));
        if (key === 'global') setLoading(true);
    }, []);

    const hideLoading = useCallback((key = 'global') => {
        setLoadingStates(prev => {
            const newStates = { ...prev };
            delete newStates[key];
            return newStates;
        });
        if (key === 'global') setLoading(false);
    }, []);

    const showError = useCallback((message, options = {}) => {
        setError({
            message,
            severity: options.severity || 'error',
            autoHide: options.autoHide !== false,
            key: options.key || Date.now()
        });
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const isLoading = useCallback((key) => {
        if (key) return !!loadingStates[key];
        return loading || Object.keys(loadingStates).length > 0;
    }, [loading, loadingStates]);

    const value = {
        loading,
        error,
        isLoading,
        showLoading,
        hideLoading,
        showError,
        clearError
    };

    return (
        <UIStateContext.Provider value={value}>
            {children}
        </UIStateContext.Provider>
    );
};

export const useUIState = () => {
    const context = useContext(UIStateContext);
    if (!context) {
        throw new Error('useUIState must be used within a UIStateProvider');
    }
    return context;
};
