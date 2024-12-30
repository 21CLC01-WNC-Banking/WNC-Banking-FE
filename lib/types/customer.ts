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

// use this to create new payment requests as well
export interface TransferRequest {
    amount: number;
    description: string;
    isSourceFee?: boolean;
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
