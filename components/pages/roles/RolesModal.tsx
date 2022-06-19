import { Button, Group, Modal, Select, Text, TextInput } from "@mantine/core";

import Role from "../../types/role"
import * as Yup from 'yup';
import { useForm, yupResolver } from "@mantine/form";
import { useState } from "react";
import createRole from "../../api/roles/createRole";
import { useQueryClient } from "react-query";
import deleteRole from "../../api/roles/deleteRole";
import { showNotification } from "@mantine/notifications";


interface IRolesModalProps {
    role?: Role;
    setVisible: (visible: boolean) => void;
}

interface RolesModalValues {
    label: string;
    color: string,
    id?: string;
}

const schema = Yup.object().shape({
    label: Yup.string().required("Feltet 'navn' er påkrævet."),
    color: Yup.string().required("Feltet 'color' er påkrævet."),
});


export default function RolesModal({ role, setVisible }: IRolesModalProps){

    // Hacky fix to ensure the form object is recreated each rerender.

    const queryClient = useQueryClient()

    const [isSubmitting, setSubmitting] = useState(false);

    const form = useForm({
        schema: yupResolver(schema),
        initialValues: {
            label: role?.label || '',
            color: role?.color || '',
            id: role?.id || undefined,
        }
    })

    async function onSubmit({ label, color, id }: RolesModalValues) {
        if(isSubmitting) return;
        setSubmitting(true)

        createRole({ label, color, id })
            .then((response) => {
                showNotification({
                    message: response.message,
                    title: 'Succes',
                    color: 'teal',
                    radius: 'md'
                })
                queryClient.invalidateQueries('roles')
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
        setTimeout(() => setSubmitting(false), 500)
    }

    async function deleteRoleWithId({ id }: { id: string }) {
        if(isSubmitting) return;
        setSubmitting(true)

        deleteRole({ id })
            .then((response) => {
                showNotification({
                    message: response.message,
                    title: 'Succes',
                    color: 'teal',
                    radius: 'md'
                })
                queryClient.invalidateQueries('roles')
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
        setTimeout(() => setSubmitting(false), 500)
    }
    
    return (
        <Modal opened={true} onClose={() => setVisible(false)} title={<Text weight={600}>{role ? `Redigerer '${role.label}'` : "Opretter ny rank"}</Text>}>
            <form onSubmit={form.onSubmit(async (values) => await onSubmit(values))}>
                <TextInput
                    required
                    label="Navn"
                    placeholder="Admin"
                    {...form.getInputProps('label')}
                />
                <Select
                    required
                    label="Farve"
                    placeholder="red"
                    {...form.getInputProps('color')}
                    data={[
                        { label: 'Gray', value: 'gray' },
                        { label: 'Red', value: 'red' },
                        { label: 'Pink', value: 'pink' },
                        { label: 'Grape', value: 'grape' },
                        { label: 'Violet', value: 'violet' },
                        { label: 'Indigo', value: 'indigo' },
                        { label: 'Blue', value: 'blue' },
                        { label: 'Cyan', value: 'cyan' },
                        { label: 'Green', value: 'green' },
                        { label: 'Lime', value: 'lime' },
                        { label: 'Yellow', value: 'yellow' },
                        { label: 'Orange', value: 'orange' },
                        { label: 'Teal', value: 'teal' },
                    ]}
                />
                <Group position="right" mt="xl">
                    {role && <Button onClick={() => deleteRoleWithId({ id: role.id })} color='red'>Slet</Button>}
                    <Button type="submit" loading={isSubmitting}>{role ? 'Gem' : 'Opret rank'}</Button>
                </Group>
            </form>
        </Modal>
    )
}