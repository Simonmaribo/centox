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
                    title: 'Succes',
                    color: 'teal',
                    radius: 'md'
                })
                router.push('/')
            })
            .catch((error) => {
                showNotification({
                    message: error?.message,
                    title: 'Fejl',
                    color: 'red',
                    radius: 'md'
                })
            })
    }

    return (
        <ConfirmationModal 
            title="Slet denne ansøgning?" 
            opened={isVisible} 
            setOpened={setVisible}
            buttonText="Ja, slet ansøgning"
            onConfirm={() => handleDeleteApplication()}
        >  
            Er du sikker på du vil slette denne ansøgning? Dette kan ikke fortrydes.
        </ConfirmationModal>
    )
}