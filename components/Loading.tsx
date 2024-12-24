import { Center, Loader } from "@mantine/core";

const Loading = () => {
    return (
        <Center style={{ height: "100vh" }}>
            <Loader color="blue" size="lg" />
        </Center>
    );
};

export default Loading;
