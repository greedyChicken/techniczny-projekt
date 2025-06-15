import {
    AccountBalance as BankIcon,
    CreditCard as CreditCardIcon,
    Savings as SavingsIcon,
    Wallet as WalletIcon,
} from "@mui/icons-material";

export const ACCOUNT_TYPE_ICONS = {
    CHECKING: BankIcon,
    SAVINGS: SavingsIcon,
    CREDIT_CARD: CreditCardIcon,
    CASH: WalletIcon,
};

export const CURRENCIES = [
    { code: "USD", label: "USD - US Dollar" },
    { code: "EUR", label: "EUR - Euro" },
    { code: "GBP", label: "GBP - British Pound" },
    { code: "PLN", label: "PLN - Polish Zloty" },
];

export const ACCOUNT_TYPES = [
    { value: "CHECKING", label: "Checking" },
    { value: "SAVINGS", label: "Savings" },
    { value: "CREDIT_CARD", label: "Credit Card" },
    { value: "INVESTMENT", label: "Investment" },
];