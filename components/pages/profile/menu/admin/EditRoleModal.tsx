import { Button, Group, Modal, Select, Text } from "@mantine/core";

import * as Yup from 'yup';
import { useForm, yupResolver } from "@mantine/form";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import User from "../../../../types/user";
import updateUser from "../../../../api/users/updateUser";
import getRoles from "../../../../api/roles/getRoles";


interface IEditRoleProps {
    user: User;
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
    setAlert: (alert: { text: string, type: string }) => void;
}

interface EditRoleValues {
    role: string | undefined;
}

const schema = Yup.object().shape({
    role: Yup.string().required("The role is required."),
});


export default function RolesModal({ user, isVisible, setVisible, setAlert }: IEditRoleProps){

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
                setAlert({text: response.message, type: 'success'})
                queryClient.invalidateQueries(['user', user.id])
            })
            .catch((error) => {
                setAlert({text: error.message, type: 'error'})
            })

        setVisible(false)
        setTimeout(() => setSubmitting(false), 500)
    }
    
    return (
        <Modal opened={isVisible} onClose={() => setVisible(false)} title={<Text weight={600}>Change {user.username}&apos;s role</Text>}>
            <form onSubmit={form.onSubmit(async (values) => await onSubmit(values))}>
                <Select
                    required
                    label="Role"
                    placeholder="The user's role"
                    {...form.getInputProps('role')}
                    data={data}
                />
                <Group position="right" mt="xl">
                    <Button type="submit" loading={isSubmitting}>Confirm</Button>
                </Group>
            </form>
        </Modal>
    )
}