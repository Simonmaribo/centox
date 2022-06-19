import { Divider, Text, Box, ThemeIcon, Tooltip, Alert } from "@mantine/core";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { BsQuestionCircle } from "react-icons/bs";
import { useQuery } from "react-query";
import getForms from "../../api/forms/getForms";
import getApplications from "../../api/users/getApplications";
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
            <Divider my='md' color='gray' label={<Text color='dark'>Ansøgninger</Text>} labelPosition='center'/>
            { applications.applications.length <= 0 ?
                <Alert icon={<BsQuestionCircle size={16}/>} color='orange'>{isProfile ? "Du har ikke oprettet nogle ansøgninger." : `${user.username} har ikke oprettet nogle ansøgninger.`}</Alert>
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
                                <Tooltip withArrow label={`Sidst opdateret ${dayjs(application.statusUpdatedAt).format('DD/MM/YYYY, HH:mm')}`} transition='fade' transitionDuration={200}>
                                    <StatusBadge status={application.status} sx={{ cursor: 'pointer'}} />
                                </Tooltip>
                            </Box>
                            <Box>
                                <Tooltip withArrow label={dayjs(application.createdAt).format('DD/MM/YYYY, HH:mm')} transition='fade' transitionDuration={200}>
                                    {/* @ts-ignore */}
                                    {`${dayjs(application.createdAt).fromNow(true)} siden`}
                                </Tooltip>
                            </Box>
                        </Box>
                    ))}
                </Box>
            }
        </Box>        
    )
}