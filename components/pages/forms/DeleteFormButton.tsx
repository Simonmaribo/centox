import { Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";
import deleteForm from "../../api/forms/deleteForm";
import ConfirmationModal from "../../elements/ConfirmationModal";
import Form from "../../types/form";

export default function DeleteFormButton({ isSubmitting, form }: { isSubmitting: boolean, form: Form }) {
    
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const router = useRouter();

    async function handleDeleteForm() {
        await deleteForm(form._id)
        .then((response) => {
            showNotification({
                message: response.message,
                title: 'Succes',
                color: 'teal',
                radius: 'md'
            })
            router.push('/admin/forms');
        })
        .catch((error) => {
            showNotification({
                message: error.message,
                title: 'Fejl',
                color: 'red',
                radius: 'md'
            })
        })
    }

    return (
        <>
            <Button loading={isSubmitting} color='red' variant="outline" onClick={() => setDeleteModalVisible(true)}>Slet skema</Button>
            <ConfirmationModal 
                title="Slet dette skema?" 
                opened={isDeleteModalVisible} 
                setOpened={setDeleteModalVisible}
                buttonText="Ja, slet skema"
                onConfirm={() => handleDeleteForm()}
            >
                Er du sikker på at du vil slette dette skema? Alle ansøgninger til dette skema vil også blive slettet.
            </ConfirmationModal>
        </>
    )
}