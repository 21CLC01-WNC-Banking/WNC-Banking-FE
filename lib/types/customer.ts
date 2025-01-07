export interface Transfer {
    amount: number;
    message: string;
    receiverAccount: string;
    receiverName: string;
    receiverBank: string;
    receiverBankId: number;
    senderAccount: string;
    senderName: string;
    transferFee: number;
    senderHandlesFee: boolean;
}

// formatted to comply with the backend API
// use this to create new payment requests as well
export interface TransferRequest {
    amount: number;
    description: string;
    isSourceFee?: boolean;
    partnerBankId?: number;
    sourceAccountNumber: string;
    targetAccountNumber: string;
    type: string;
}

export interface CustomerAccount {
    name: string;
    accountNumber: string;
    balance: number;
}

export interface ReceiverAccount {
    id: number;
    receiverAccountNumber: string;
    receiverNickname: string;
    bankId: number;
    bankShortName: string;
}

export interface PaymentRequest {
    receiver: string; // receiver name
    sender: string; // sender name
    debtReminder: {
        id: string;
        type: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string;
        bankId: number;
        amount: number;
        description: string;
        status: string;
        isSourceFee: boolean;
        sourceAccountNumber: string;
        sourceBalance: number;
        targetAccountNumber: string;
        targetBalance: number;
    };
    reply: {
        id: number;
        content: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: string;
        debtReminderId: string;
        userReplyName: string;
    };
}

// for retrieving transaction history
export interface Transaction {
    id: string;
    amount: number;
    balance: number;
    createdAt: string;
    description: string;
    sourceAccountNumber: string;
    targetAccountNumber: string;
    type: string;
}

export interface Notification {
    id: number;
    userId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    isSeen: boolean;
    type: string;
}

// PascalCase because for some god forsaken reason the backend uses PascalCase
export interface NotificationToast {
    Name: string;
    Amount: number;
    TransactionID: string;
    Type: "incoming_transfer" | "outgoing_transfer" | "debt_reminder" | "debt_cancel";
    CreatedAt: string;
}

export interface PartnerBank {
    id: number;
    bankCode: string;
    bankName: string;
    shortName: string;
    logoUrl: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface DebtCancelReply {
    content: string;
    createdAt: string;
    debtReminderId: string;
    deletedAt: string;
    id: number;
    updatedAt: string;
    userReplyName: string;
}
