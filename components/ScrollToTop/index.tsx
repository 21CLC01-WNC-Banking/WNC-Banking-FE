"use client";

import { IconArrowUp } from "@tabler/icons-react";
import { useWindowScroll } from "@mantine/hooks";
import { Affix, ActionIcon, Transition } from "@mantine/core";

const ScrollToTop = () => {
    const [scroll, scrollTo] = useWindowScroll();

    return (
        <>
            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <ActionIcon
                            variant="filled"
                            size="xl"
                            radius="xl"
                            aria-label="Settings"
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                            <IconArrowUp size={20} />
                        </ActionIcon>
                    )}
                </Transition>
            </Affix>
        </>
    );
};

export default ScrollToTop;
