import { Divider, Text, Box, ThemeIcon, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import { Router, useRouter } from "next/router";
import { useQuery } from "react-query";
import getForms from "../../api/forms/getForms";
import getApplications from "../../api/users/getApplications";
import Alert from "../../elements/Alert";
import Error from "../../elements/Error";
import StatusBadge from "../../elements/StatusBadge";
import Form from "../../types/form";
import User from "../../types/user";

export default function ApplicationsBox({ isProfile, user }: { isProfile: boolean, user: User }) {

    const router = useRouter();

    const { isLoading: isApplicationsLoading, isError: isApplicationsError, data: applications } = useQuery(['userApplications', user.id], async () => await getApplications(user.id));
    const { isLoading: isFormsLoading, isError: isFromsError, data: forms } = useQuery('forms', getForms);

    if(isApplicationsLoading || isFormsLoading || !applications || !forms || !applications.applications || !forms.forms) return <></>
    if(isApplicationsError || isFromsError) return <Error/>

    var formsObj: {[key: string]: Form} = {}
    forms.forms.forEach(form => {
        formsObj[form._id] = form
    })

    return (
        <Box>
            <Divider my='md' color='gray' label={<Text color='dark'>Applications</Text>} labelPosition='center'/>
            { applications.applications.length <= 0 ?
                <Alert text={isProfile ? "You have not created any applications" : `${user.username} has not created any applications`} type="warning" />
                :
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    { applications.applications.map((application, index) => (
                        <Box key={index} sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            cursor: 'pointer',
                            borderRadius: '0.25rem',
                            padding: '1rem',
                            '&:hover': {
                                backgroundColor: '#f8f9fa'
                            }
                        }} onClick={() => router.push(`/application/${application._id}`)}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                {formsObj[application.form].icon &&
                                    <ThemeIcon variant="light" size={50}>
                                        <i className={`${formsObj[application.form].icon}`} style={{fontSize: '18px'}}/>
                                    </ThemeIcon>
                                }
                                <Box>
                                    <Text sx={{ fontSize: 20 }} weight={500}>Application</Text>
                                    <Text sx={{ fontSize: 18 }} color='blue' weight={400}>{formsObj[application.form].name}</Text>
                                </Box>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'center', flexGrow: 1}}>
                                <Tooltip withArrow label={`Last updated ${dayjs(application.statusUpdatedAt).format('HH:mm, DD/MM/YYYY')}`} transition='fade' transitionDuration={200}>
                                    <StatusBadge status={application.status} sx={{ cursor: 'pointer'}} />
                                </Tooltip>
                            </Box>
                            <Box>
                                <Tooltip withArrow label={dayjs(application.createdAt).format('HH:mm, DD/MM/YYYY')} transition='fade' transitionDuration={200}>
                                    {/* @ts-ignore */}
                                    {`${dayjs(application.createdAt).fromNow(true)} ago`}
                                </Tooltip>
                            </Box>
                        </Box>
                    ))}
                </Box>
            }
        </Box>        
    )
}