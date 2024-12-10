export interface Transfer {
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
