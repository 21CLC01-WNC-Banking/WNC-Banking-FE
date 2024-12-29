export class WebSocketManager {
    private static instance: WebSocketManager;
    private socket: WebSocket | null = null;
    private subscribers = new Set<(data: string) => void>();

    private constructor() {} // enforce singleton

    static getInstance() {
        if (!this.instance) {
            this.instance = new WebSocketManager();
        }
        return this.instance;
    }

    connect() {
        if (this.socket) return;

        const url = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?deviceId=2`;

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        this.socket.onmessage = (event) => {
            this.subscribers.forEach((callback) => callback(event.data));
        };

        this.socket.onclose = () => {
            console.log("WebSocket connection closed, attempting reconnect...");
            this.socket = null;
            setTimeout(() => this.connect(), 1000);
        };

        this.socket.onerror = (error) => {
            console.log("WebSocket error: ", error);
        };
    }

    subscribe(callback: (data: string) => void) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
}
