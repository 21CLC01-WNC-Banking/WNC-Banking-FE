// helper function to chunk data into pages
export function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) {
        return [];
    }

    const head = array.slice(0, size);
    const tail = array.slice(size);

    return [head, ...chunk(tail, size)];
}

// helper function to format currency
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
}

// helper function to format date
export const formatDateString = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(date.getUTCDate()).padStart(2, "0");

    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    const formattedDateTime = `${hours}:${minutes}, ${day}/${month}/${year}`;

    return formattedDateTime;
};

// helper function to format account number
export function formatAccountNumber(accountNumber: string): string {
    return accountNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
}
