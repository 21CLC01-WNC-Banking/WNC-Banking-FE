"use client";

import { useEffect, useState } from "react";
import { Text, Box } from "@mantine/core";

const CurrentTime: React.FC = () => {

    const [currentTime, setCurrentTime] = useState<string>("");
    const [currentDate, setCurrentDate] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();

            // Định dạng giờ phút theo kiểu 12 giờ với AM/PM
            const timeString = now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });

            setCurrentTime(timeString);

            // Định dạng ngày theo kiểu "Thứ năm, 05/12/2024"
            const dateString = now.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });

            setCurrentDate(dateString);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box>
            <Text size="xl" fw={700} c="gray">{currentTime}</Text>
            <Text size="lg" c="gray">{currentDate}</Text>
        </Box>
    );
}
export default CurrentTime;