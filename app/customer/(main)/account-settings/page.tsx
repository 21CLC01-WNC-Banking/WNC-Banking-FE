import { Fieldset, Stack, Divider, Flex } from "@mantine/core";

import CloseAccount from "./components/CloseAccount";
import ChangePasswordForm from "./components/ChangePasswordForm";

const AccountSettings = () => {
    return (
        <Stack gap="xl" justify="center" my={40} mx={120}>
            <Fieldset radius="md" p={50}>
                <Flex
                    direction="row"
                    gap="xl"
                    justify="space-between"
                    align="flex-start"
                    wrap="nowrap"
                >
                    <ChangePasswordForm />

                    <Divider mx="lg" orientation="vertical" />

                    <CloseAccount />
                </Flex>
            </Fieldset>
        </Stack>
    );
};

export default AccountSettings;
