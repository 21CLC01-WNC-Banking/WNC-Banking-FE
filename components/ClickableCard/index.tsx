import { Text, UnstyledButton } from "@mantine/core";

import classes from "./ClickableCard.module.css";

interface ClickableCardProps {
    title?: string;
    subtitle?: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const ClickableCard: React.FC<ClickableCardProps> = ({ title, subtitle, onClick }) => {
    return (
        <UnstyledButton my={8} className={classes.button} onClick={onClick}>
            <div>
                {title && (
                    <Text fw={500} mb={7} lh={1}>
                        {title}
                    </Text>
                )}

                {subtitle && (
                    <Text fz="sm" c="dimmed">
                        {subtitle}
                    </Text>
                )}
            </div>
        </UnstyledButton>
    );
};

export default ClickableCard;
