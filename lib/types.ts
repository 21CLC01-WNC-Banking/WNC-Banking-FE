export interface Transfer {
    id?: number;
    senderAccount: string;
    receiverAccount: string;
    amount: number;
    message: string;
    senderHandlesFee: boolean;
}

export interface Account {
    name: string;
    bank: string;
    accountNumber: string;
    nickname: string;
}

// export interface Transaction {
//     dateTime: string;
//     accountType: string;
//     amount: string;
//     transactionType: "Nhận tiền" | "Chuyển khoản" | "Thanh toán";
//     balance: string;
// }

export interface PaymentRequest {
    requestor?: string;
    target?: string;
    amount: string;
    message: string;
    requestTime: string;
    resolveTime?: string;
    status: "Đã thanh toán" | "Chưa thanh toán" | "Đã hủy";
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