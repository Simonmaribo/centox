import { Anchor, Avatar, Box, Group, Text, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";
import { useQuery } from "react-query";
import getUser from "../../../api/users/getUser";
import UserBadge from "../../../elements/UserBadge";
import Comment from "../../../types/comment";

export default function ApplicationComment({ comment }: { comment: Comment }) {

    const { isLoading, isError, data } = useQuery(['userByObjectId', comment.user], async () => await getUser(comment.user));

    return (
        <Box>
            {isLoading ? <Text>Loading...</Text> : isError || !data?.user ? <Text>Error</Text> : <UserBadge user={data?.user}/>}
            <Box sx={{ paddingLeft: 34, paddingRight: 34 }}>
                {
                    comment.text.split('\n').map((line, index) =>
                        <Text size={'sm'} key={index}>{line}</Text>
                    )
                }
                <Tooltip withArrow label={dayjs(comment.createdAt).format('DD/MM/YYYY, HH:mm')} transition='fade' transitionDuration={200}>
                    <Text size="xs" color="dimmed">
                        {new Date().getTime() < comment.createdAt + 127800000 ?
                            /* @ts-ignore */
                            `${dayjs(comment.createdAt).fromNow(true)} ago`
                            :
                            dayjs(comment.createdAt).format('HH:mm, DD/MM/YYYY')
                        }
                    </Text>
                </Tooltip>
            </Box>
        </Box>
    )
}