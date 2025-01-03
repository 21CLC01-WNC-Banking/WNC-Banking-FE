import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks/withTypes";
import { WebSocketManager } from "@/lib/websocket";

const useWebSocket = (onMessage: (data: string) => void) => {
    const deviceId = useAppSelector((state) => state.auth.authUser?.userId);

    useEffect(() => {
        if (!deviceId) return;

        const manager = WebSocketManager.getInstance();
        manager.setDeviceId(deviceId);
        manager.connect();

        const unsubscribe = manager.subscribe(onMessage);

        return () => {
            unsubscribe();

            // only call cleanup if component is unmounting permanently
            if (!deviceId) {
                manager.cleanup();
            }
        };
    }, [onMessage, deviceId]);
};

export default useWebSocket;
