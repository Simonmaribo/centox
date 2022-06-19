import { Paper, Text, Group, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRef, useState } from "react";
import updateForm from "../../api/forms/updateForm";
import Form from "../../types/form";
import DeleteFormButton from "./DeleteFormButton";
import FormFields from "./sections/fields/FormFields";
import FormInfo from "./sections/FormInfo";
import FormPermissions from "./sections/FormPermissions";

export default function FormBox({ form: startForm }: { form: Form }){

    const [form, setForm] = useState(startForm);
    const [isSubmitting, setSubmitting] = useState(false);

    async function saveChanges() {
        if(isSubmitting) return;
        setSubmitting(true)

        updateForm(form)
            .then((response) => {
                showNotification({
                    message: response.message,
                    title: 'Succes',
                    color: 'teal',
                    radius: 'md'
                })                
                //queryClient.invalidateQueries(['form', form._id])
            })
            .catch((error) => {
                showNotification({
                    message: error.message,
                    title: 'Fejl',
                    color: 'red',
                    radius: 'md'
                })
            })
        setTimeout(() => setSubmitting(false), 500)
    }

    return (
        <Paper p='md' withBorder sx={{ display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <Text weight={600} sx={{ fontSize: 35 }} color='dark'>Ændrer skema</Text>
            <FormInfo form={form} setForm={setForm}/>
            <FormPermissions form={form} setForm={setForm}/>
            <FormFields form={form} setForm={setForm}/>
            <Group position="right" mt="xl">
                <DeleteFormButton isSubmitting={isSubmitting} form={form}/>
                <Button loading={isSubmitting} variant='outline' onClick={() => saveChanges()}>Gem</Button>
            </Group>
        </Paper>
    )
}