export class WebSocketManager {
    private static instance: WebSocketManager;
    private socket: WebSocket | null = null;
    private subscribers = new Set<(data: string) => void>();
    private deviceId: number | undefined;
    private isConnecting = false;

    private constructor() {} // enforce singleton

    static getInstance() {
        if (!this.instance) {
            this.instance = new WebSocketManager();
        }

        return this.instance;
    }

    setDeviceId(deviceId: number | undefined) {
        if (this.socket) {
            this.socket = null;
        }

        this.deviceId = deviceId;
    }

    connect() {
        if (this.socket || !this.deviceId || this.isConnecting) return;

        const url = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?deviceId=${this.deviceId}`;

        this.isConnecting = true;
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log("WebSocket connection established");
            this.isConnecting = false;
        };

        this.socket.onmessage = (event) => {
            this.subscribers.forEach((callback) => callback(event.data));
        };

        this.socket.onclose = () => {
            console.log("WebSocket connection closed, attempting reconnect...");

            this.socket = null;
            this.isConnecting = false;

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

    cleanup() {
        if (this.socket) {
            this.socket = null;
        }

        this.isConnecting = false;
        this.subscribers.clear();
    }
}
