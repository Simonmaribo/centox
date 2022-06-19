import { Box, Text, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import getUser from "../../../api/users/getUser";
import StatusBadge from "../../../elements/StatusBadge";
import UserBadge from "../../../elements/UserBadge";
import StatusUpdate from "../../../types/statusUpdate";

export default function ApplicationStatusUpdate({ interaction }: { interaction: StatusUpdate }) {

    const { isLoading, isError, data } = useQuery(['userByObjectId', interaction.user], async () => await getUser(interaction.user));

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: '0.2rem', justifyContent: 'center', alignItems: 'center'}}>
                {isLoading ? <Text>Loading...</Text> : isError || !data?.user ? <Text>Error</Text> : <UserBadge user={data?.user}/>}
                <Text>ændrede status til</Text>
                <StatusBadge status={interaction.status}/>
            </Box>
            <Tooltip withArrow label={dayjs(interaction.timestamp).format('DD/MM/YYYY, HH:mm')} transition='fade' transitionDuration={200}>
                <Text weight={400} sx={{ opacity: 0.75, fontSize: 12 }}>
                    {new Date().getTime() < interaction.timestamp + 127800000 ?
                        /* @ts-ignore */
                        `${dayjs(interaction.timestamp).fromNow(true)} siden`
                        :
                        dayjs(interaction.timestamp).format('HH:mm, DD/MM/YYYY')
                    }
                </Text>
            </Tooltip>
        </Box>
    )
}