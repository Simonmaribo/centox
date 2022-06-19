import { Menu, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import deleteApplication from "../../../api/applications/deleteApplication";
import ConfirmationModal from "../../../elements/ConfirmationModal";
import Application from "../../../types/application";

export default function DeleteApplicationMenuItem({ application, isVisible, setVisible }: { application: Application, isVisible: boolean, setVisible: (visible: boolean) => void }) {

    const router = useRouter();

    async function handleDeleteApplication() {
        await deleteApplication(application._id)
            .then((response) => {
                showNotification({
                    message: response?.message,
                    title: 'Success',
                    color: 'teal',
                    radius: 'md'
                })
                router.push('/')
            })
            .catch((error) => {
                showNotification({
                    message: error?.message,
                    title: 'Error',
                    color: 'red',
                    radius: 'md'
                })
            })
    }

    return (
        <ConfirmationModal 
            title="Delete this application?" 
            opened={isVisible} 
            setOpened={setVisible}
            buttonText="Yes, delete application"
            onConfirm={() => handleDeleteApplication()}
        >
            Hey there, are you sure you want to delete this application? This action cannot be undone.
        </ConfirmationModal>
    )
}