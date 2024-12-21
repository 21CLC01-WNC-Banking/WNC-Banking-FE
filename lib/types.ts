export interface Transfer {
    senderAccount: string;
    receiverAccount: string;
    amount: number;
    message: string;
}

export interface Transaction {
    id: number,
    dateTime: string;
    sender_account_number: string;
    amount: string;
    receiver_account_number: string;
    transactionType: "Nhận tiền" | "Chuyển khoản" | "Thanh toán";
    balance: string;
    message: string;
}