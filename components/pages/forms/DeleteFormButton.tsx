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
                title: 'Success',
                color: 'teal',
                radius: 'md'
            })
            router.push('/admin/forms');
        })
        .catch((error) => {
            showNotification({
                message: error.message,
                title: 'Error',
                color: 'red',
                radius: 'md'
            })
        })
    }

    return (
        <>
            <Button loading={isSubmitting} color='red' variant="outline" onClick={() => setDeleteModalVisible(true)}>Delete form</Button>
            <ConfirmationModal 
                title="Delete this form?" 
                opened={isDeleteModalVisible} 
                setOpened={setDeleteModalVisible}
                buttonText="Yes, delete form"
                onConfirm={() => handleDeleteForm()}
            >
                Hey there, are you sure you want to delete this form?<br/>
                All data will be lost. All of users applications will be deleted.
            </ConfirmationModal>
        </>
    )
}