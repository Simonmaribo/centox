import { Box, Text, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import getUser from "../../../api/users/getUser";
import UserBadge from "../../../elements/UserBadge";
import Comment from "../../../types/comment";

export default function ApplicationComment({ interaction }: { interaction: Comment }) {

    const { isLoading, isError, data } = useQuery(['userByObjectId', interaction.user], async () => await getUser(interaction.user));

    return (
        <Box>
            {isLoading ? <Text>Loading...</Text> : isError || !data?.user ? <Text>Error</Text> : <UserBadge user={data?.user}/>}
            <Box sx={{ paddingLeft: 34, paddingRight: 34 }}>
                {
                    interaction.text.split('\n').map((line, index) =>
                        <Text size={'sm'} key={index}>{line}</Text>
                    )
                }
                <Tooltip withArrow label={dayjs(interaction.timestamp).format('DD/MM/YYYY, HH:mm')} transition='fade' transitionDuration={200}>
                    <Text size="xs" color="dimmed">
                        {new Date().getTime() < interaction.timestamp + 127800000 ?
                            /* @ts-ignore */
                            `${dayjs(interaction.timestamp).fromNow(true)} siden`
                            :
                            dayjs(interaction.timestamp).format('HH:mm, DD/MM/YYYY')
                        }
                    </Text>
                </Tooltip>
            </Box>
        </Box>
    )
}