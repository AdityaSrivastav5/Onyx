export const getCurrencySymbol = (currencyCode: string): string => {
    switch (currencyCode) {
        case "USD":
            return "$";
        case "EUR":
            return "€";
        case "GBP":
            return "£";
        case "INR":
            return "₹";
        case "JPY":
            return "¥";
        default:
            return currencyCode;
    }
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
    }).format(amount);
};
