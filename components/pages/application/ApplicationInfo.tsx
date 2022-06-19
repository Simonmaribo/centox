import { Anchor, Avatar, Box, Text, ThemeIcon } from "@mantine/core";
import dayjs from "dayjs";
import Link from "next/link";
import StatusBadge from "../../elements/StatusBadge";
import Application from "../../types/application";
import Form from "../../types/form";
import User from "../../types/user";
import { ImClock } from 'react-icons/im';
import AdminMenu from "./admin/AdminMenu";
import UserBadge from "../../elements/UserBadge";

export default function ApplicationInfo({ user, application, form }: { user: User, application: Application, form: Form }) {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'end'}}><AdminMenu application={application} form={form} user={user}/></Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
                <Text weight={600} sx={{ fontSize: 45 }}>{form.name} application</Text>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <UserBadge user={user}/>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <ThemeIcon variant="light" size={30}>
                        <ImClock size={18}/>
                    </ThemeIcon>
                    <Text weight={600}>{dayjs(application.createdAt).format('DD/MM/YYYY, HH:mm')}</Text>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <StatusBadge status={application.status}/>
                </Box>
                {/*
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                        <Text weight={600}>User: </Text>
                        <Anchor component={Link} href={`/user/${user.id}`}>
                            <Box sx={{ display: 'flex', gap: '0.1rem', cursor: 'pointer' }}>
                                <Avatar src={user.avatar} radius="xl" size={'sm'}/>
                                <Text weight={400}>{user.username}</Text>
                            </Box>
                        </Anchor>
                    </Box>
                */}
            </Box>
        </Box>
    )
}