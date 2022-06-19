import { ActionIcon, Menu, Text } from "@mantine/core";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiLogOut } from 'react-icons/fi';

export default function ProfileMenu(){
    return (
        <Menu transition="pop" withArrow placement="end" control={<ActionIcon size={35} color='blue'><BsThreeDotsVertical size={25}/></ActionIcon>}>
            <Menu.Item component='a' href='/api/auth/logout' icon={<FiLogOut size={16} />} color='red'>
                <Text weight={500} size="sm">Logout</Text>
            </Menu.Item>
        </Menu>
    )
}