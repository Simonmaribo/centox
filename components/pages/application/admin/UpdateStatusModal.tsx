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
                    title: 'Success',
                    color: 'teal',
                    radius: 'md'
                })
                queryClient.invalidateQueries(['application', application._id])
            })
            .catch((error) => {
                showNotification({
                    message: error.message,
                    title: 'Error',
                    color: 'red',
                    radius: 'md'
                })
            })
        setVisible(false)
    }
    
    return (
        <Modal opened={isVisible} onClose={() => setVisible(false)} title={<Text weight={600}>Change status of application</Text>}>
            <Select
                required
                label="Status"
                placeholder="Pending"
                value={status}
                onChange={(value: 'pending' | 'rejected' | 'accepted') => setStatus(value)}
                data={[
                    { value: 'pending', label: 'Pending' },
                    { value: 'rejected', label: 'Rejected' },
                    { value: 'accepted', label: 'Accepted' },
                ]}
            />
            <Group position="right" mt="xl" onClick={onSubmit}>
                <Button type="submit">Confirm</Button>
            </Group>
        </Modal>
    )
}