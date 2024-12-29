import { useEffect } from "react";
import { WebSocketManager } from "@/lib/websocket";

const useWebSocket = (onMessage: (data: string) => void) => {
    useEffect(() => {
        const manager = WebSocketManager.getInstance();
        manager.connect();

        const unsubscribe = manager.subscribe(onMessage);

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [onMessage]);
};

export default useWebSocket;
