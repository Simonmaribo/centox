import { Button, Group, Modal, Select, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { useQueryClient } from "react-query";
import updateStatus from "../../../api/applications/updateStatus";
import Application from "../../../types/application";

export default function UpdateStatusModal({ application, isVisible, setVisible }: { application: Application, isVisible: boolean, setVisible: (visible: boolean) => void }) {

    const queryClient = useQueryClient()

    const [status, setStatus] = useState(application.status);

    async function onSubmit() {

        updateStatus({ applicationId: application._id, status: status })
            .then((response) => {
                showNotification({
                    message: response.message,
                    title: 'Succes',
                    color: 'teal',
                    radius: 'md'
                })
                queryClient.invalidateQueries(['application', application._id])
            })
            .catch((error) => {
                showNotification({
                    message: error.message,
                    title: 'Fejl',
                    color: 'red',
                    radius: 'md'
                })
            })
        setVisible(false)
    }
    
    return (
        <Modal opened={isVisible} onClose={() => setVisible(false)} title={<Text weight={600}>Ændrer ansøgningens status</Text>}>
            <Select
                required
                label="Status"
                placeholder="Afventer"
                value={status}
                onChange={(value: 'pending' | 'rejected' | 'accepted') => setStatus(value)}
                data={[
                    { value: 'pending', label: 'Afventer' },
                    { value: 'rejected', label: 'Afvist' },
                    { value: 'accepted', label: 'Accepteret' },
                ]}
            />
            <Group position="right" mt="xl" onClick={onSubmit}>
                <Button type="submit">Gem</Button>
            </Group>
        </Modal>
    )
}