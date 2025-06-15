import {
    BrowserRouter as Router,
    Routes,
    Route,

} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./styles/theme";

import AppLayout from "./layouts/AppLayout";

import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AccountsPage from "./pages/accounts/AccountsPage";
import TransactionsPage from "./pages/transactions/TransactionsPage";
import BudgetsPage from "./pages/budgets/BudgetsPage";
import SettingsPage from "./pages/SettingsPage";
import ConditionalRedirect from "./components/ConditionalRedirect";
import PublicRoute from "./components/PublicRoute";
import {UIStateProvider} from "./contexts/UIStateContext.jsx";
import GlobalLoader from "./components/GlobalLoader.jsx";
import React from "react";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <UIStateProvider>
                    <AuthProvider>
                        <GlobalLoader/>
                        <Routes>
                            <Route element={<PublicRoute />}>
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                            </Route>

                            <Route element={<ProtectedRoute />}>
                                <Route element={<AppLayout />}>
                                    <Route path="/dashboard" element={<DashboardPage />} />
                                    <Route path="/accounts" element={<AccountsPage />} />
                                    <Route path="/transactions" element={<TransactionsPage />} />
                                    <Route path="/budgets" element={<BudgetsPage />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                </Route>
                            </Route>

                            <Route path="/" element={<ConditionalRedirect />} />

                            {/* 404 page */}
                            <Route
                                path="*"
                                element={
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "100vh",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <h1>404 - Page Not Found</h1>
                                        <p>The page you're looking for doesn't exist.</p>
                                        <a href="/">Go back to homepage</a>
                                    </div>
                                }
                            />
                        </Routes>
                    </AuthProvider>
                </UIStateProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;