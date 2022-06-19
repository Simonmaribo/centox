import { Box, Text, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import getUser from "../../../api/users/getUser";
import StatusBadge from "../../../elements/StatusBadge";
import UserBadge from "../../../elements/UserBadge";
import Application from "../../../types/application";

export default function ApplicationStatusChanged({ application }: { application: Application }) {

    const { isLoading, isError, data } = useQuery(['userByObjectId', application.statusUpdatedBy], async () => await getUser(application.statusUpdatedBy));

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
            <Box sx={{ display: 'flex', gap: '0.2rem', justifyContent: 'center', alignItems: 'center'}}>
                {isLoading ? <Text>Loader...</Text> : isError || !data?.user ? <Text>Fejl</Text> : <UserBadge user={data?.user}/>}
                <Text>ændrede status til</Text>
                <StatusBadge status={application.status}/>
            </Box>
            <Tooltip withArrow label={dayjs(application.statusUpdatedAt).format('DD/MM/YYYY, HH:mm')} transition='fade' transitionDuration={200}>
                <Text weight={400} sx={{ opacity: 0.75, fontSize: 12 }}>
                    {new Date().getTime() < application.statusUpdatedAt + 127800000 ?
                        /* @ts-ignore */
                        `${dayjs(application.statusUpdatedAt).fromNow(true)} siden`
                        :
                        dayjs(application.statusUpdatedAt).format('HH:mm, DD/MM/YYYY')
                    }
                </Text>
            </Tooltip>
        </Box>
    )
}