export interface Transfer {
    amount: number;
    message: string;
    receiverAccount: string;
    receiverName: string;
    receiverBank: string;
    senderAccount: string;
    senderName: string;
    transferFee: number;
    senderHandlesFee: boolean;
}

export interface TransferRequest {
    amount: number;
    description: string;
    isSourceFee: boolean;
    sourceAccountNumber: string;
    targetAccountNumber: string;
    type: string;
}

export interface UserAccount {
    name: string;
    accountNumber: string;
    balance: number;
}

export interface ReceiverAccount {
    id: number;
    receiverAccountNumber: string;
    receiverNickname: string;
    bank: string;
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
