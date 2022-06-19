import { Box, Avatar, Tooltip, ActionIcon, Text } from "@mantine/core";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { FaCrown } from "react-icons/fa";
import { useQuery } from "react-query";
import getUser from "../../../api/users/getUser";
import StatusBadge from "../../../elements/StatusBadge";
import Application from "../../../types/application";

export default function ApplicationListItem({ application, full }: { application: Application, full?: boolean }) {
    const router = useRouter()

    const { isLoading, isError, data } = useQuery(['userByObjectId', application.user], async () => await getUser(application.user));

    return (
        <Box component='tr' sx={{ cursor: 'pointer'}} onClick={() => router.push(`/application/${application._id}`)}>
            { isLoading || isError || !data || !data.user ?
                <Box>
                    <Avatar radius="xl" />  
                    <Text weight={500}>{`BRUGER#0000`}</Text>   
                </Box>
                :
                <Box component='td' sx={{ display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <Avatar src={data.user.avatar} radius="xl" />
                    <Text weight={500}>{data.user.username}</Text>
                    {data.user.owner &&
                        <Tooltip withArrow label={'Denne bruger er ejeren af siden.'} transition='fade' transitionDuration={200} sx={{ marginLeft: '-1rem'}}>
                            <ActionIcon color="orange" radius="xs" variant="transparent"><FaCrown/></ActionIcon>
                        </Tooltip>
                    }
                </Box>
            }
            <td><StatusBadge status={application.status}/></td>
            {full && 
                <td>
                    <Tooltip withArrow label={dayjs(application.latestInteraction).format('DD/MM/YYYY, HH:mm')} transition='fade' transitionDuration={200}>
                        {/* @ts-ignore */}
                        {`${dayjs(application.latestInteraction).fromNow(true)} siden`}
                    </Tooltip>
                </td>
            }
            <td>
                <Tooltip withArrow label={dayjs(application.createdAt).format('DD/MM/YYYY, HH:mm')} transition='fade' transitionDuration={200}>
                    {/* @ts-ignore */}
                    {`${dayjs(application.createdAt).fromNow(true)} siden`}
                </Tooltip>
            </td>
        </Box>
    )
}