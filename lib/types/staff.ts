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
    createdAt: string;
    sourceAccountNumber: string;
    amount: number;
    targetAccountNumber: string;
    transactionType: string;
    balance: number;
    description: string;
}