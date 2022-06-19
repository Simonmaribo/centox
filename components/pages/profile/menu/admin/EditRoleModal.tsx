import { Button, Group, Modal, Select, Text } from "@mantine/core";

import * as Yup from 'yup';
import { useForm, yupResolver } from "@mantine/form";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import User from "../../../../types/user";
import updateUser from "../../../../api/users/updateUser";
import getRoles from "../../../../api/roles/getRoles";
import { showNotification } from '@mantine/notifications';


interface IEditRoleProps {
    user: User;
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
}

interface EditRoleValues {
    role: string | undefined;
}

const schema = Yup.object().shape({
    role: Yup.string().required("Feltet 'role' er påkrævet."),
});


export default function RolesModal({ user, isVisible, setVisible }: IEditRoleProps){

    // Hacky fix to ensure the form object is recreated each rerender.

    const queryClient = useQueryClient()

    const [isSubmitting, setSubmitting] = useState(false);

    const form = useForm({
        schema: yupResolver(schema),
        initialValues: {
            role: user.role
        }
    })

    const { isLoading, isError, data: roles } = useQuery('roles', getRoles)
    if(isLoading || isError || !roles) return <></>

    const data = []
    for(const [key, value] of Object.entries(roles))
        data.push({value: value.id, label: value.label})

    async function onSubmit({ role }: EditRoleValues) {
        if(isSubmitting) return;
        setSubmitting(true)

        updateUser({ user, roleId: role })
            .then((response) => {
                showNotification({
                    message: response.message,
                    title: 'Succes',
                    color: 'teal',
                    radius: 'md'
                })
                queryClient.invalidateQueries(['user', user.id])
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
        <Modal opened={isVisible} onClose={() => setVisible(false)} title={<Text weight={600}>{`Ændrer ${user.username}'s rank`}</Text>}>
            <form onSubmit={form.onSubmit(async (values) => await onSubmit(values))}>
                <Select
                    required
                    label="Rank"
                    placeholder="Brugerens rank"
                    {...form.getInputProps('role')}
                    data={data}
                />
                <Group position="right" mt="xl">
                    <Button type="submit" loading={isSubmitting}>Gem</Button>
                </Group>
            </form>
        </Modal>
    )
}