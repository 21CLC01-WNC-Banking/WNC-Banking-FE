export interface Transfer {
    amount: number;
    message: string;
    receiverAccount: string;
    receiverBank: string;
    senderAccount: string;
    senderHandlesFee: boolean;
}

export interface UserAccount {
    name: string;
    role: string;
    userId: string;
}

export interface ReceiverAccount {
    name: string;
    bank: string;
    accountNumber: string;
    nickname: string;
}

export interface Transaction {
    dateTime: string;
    accountType: string;
    amount: string;
    transactionType: "Nhận tiền" | "Chuyển khoản" | "Thanh toán";
    balance: string;
}

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
    id: number;
    dateTime: string;
    sender_account_number: string;
    amount: string;
    receiver_account_number: string;
    transactionType: "Nhận tiền" | "Chuyển khoản" | "Thanh toán";
    balance: string;
    message: string;
}
