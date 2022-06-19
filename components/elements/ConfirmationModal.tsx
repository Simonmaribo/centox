import { Box, Button, Group, Modal, Text } from "@mantine/core";

interface ConfirmationModalProps {
    opened: boolean;
    setOpened: (opened: boolean) => void;
    title: string;
    buttonText: string;
    onConfirm: () => void;
    children: any;
}

export default function ConfirmationModal({ opened, setOpened, title, children, buttonText, onConfirm }: ConfirmationModalProps) {
    return (
        <Modal title={<Text weight={600} size={'lg'}>{title}</Text>} opened={opened} onClose={() => setOpened(!opened)}>
            <Box>
                {children}
            </Box>
            <Group position="right" mt="xl">
                <Button variant='outline' onClick={() => setOpened(!opened)}>Annuller</Button>
                <Button color='red' variant="outline" onClick={() => {
                    setOpened(!opened);
                    onConfirm();
                }}>{buttonText}</Button>
            </Group>
        </Modal>
    )
}