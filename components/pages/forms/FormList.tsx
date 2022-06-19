import { Box, Button, Table, Tooltip } from "@mantine/core"
import dayjs from "dayjs"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { useQuery, useQueryClient } from "react-query"
import createForm from "../../api/forms/createForm"
import getForms from "../../api/forms/getForms"
import Error from "../../elements/Error"
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications"

export default function AppFormList() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const { isLoading, isError, data } = useQuery('forms', getForms)

    const [isSubmitting, setSubmitting] = useState(false);

    async function createNewForm(){
        if(isSubmitting) return;
        setSubmitting(true)

        createForm()
            .then((response) => {
                showNotification({
                    message: response.message,
                    title: 'Succes',
                    color: 'teal',
                    radius: 'md'
                })
                queryClient.invalidateQueries('forms')
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
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Table highlightOnHover verticalSpacing={'md'} horizontalSpacing='xl'>
                    <thead>
                        <tr>
                            <th>Navn</th>
                            <th>Oprettet</th>
                            <th>Opdateret</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isError ? <tr><td colSpan={3}><Error height={'25vh'}/></td></tr> : (isLoading || !data ? <></> : 
                            data.forms?.map((form, index) => (
                                <Box component="tr" key={index} sx={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/forms/${form._id}`)}>
                                    <td>{form.name}</td>
                                    <Box component='td'>
                                        <Tooltip withArrow label={dayjs(form.createdAt).format('DD/MM/YYYY, HH:mm')} transition='fade' transitionDuration={200}>
                                            {/* @ts-ignore */}
                                            {`${dayjs(form.createdAt).fromNow(true)} siden`}
                                        </Tooltip>
                                    </Box>
                                    <Box component='td'>
                                        <Tooltip withArrow label={dayjs(form.updatedAt).format('DD/MM/YYYY, HH:mm')} transition='fade' transitionDuration={200}>
                                            {/* @ts-ignore */}
                                            {`${dayjs(form.updatedAt).fromNow(true)} siden`}
                                        </Tooltip>
                                    </Box>
                                </Box>
                            )))
                        }
                    </tbody>
                </Table>
                <Box sx={{ margin: '1rem'}}>
                    <Button variant="outline" radius='xl' leftIcon={<FaPlus/>} onClick={createNewForm} disabled={isSubmitting}>Opret skema</Button>
                </Box>
            </Box>
        </>
    )
}