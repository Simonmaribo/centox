import { ActionIcon, Menu, Text } from "@mantine/core";
import { useState } from "react";
import { BiCog } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import useUser from "../../../api/swr/useUser";
import Application from "../../../types/application";
import Form from "../../../types/form";
import User from "../../../types/user";
import DeleteApplicationMenuItem from "./DeleteApplicationModal";
import UpdateStatusModal from "./UpdateStatusModal";
import { AiOutlineEdit } from 'react-icons/ai';

export default function AdminMenu({ user, application, form }: { user: User, application: Application, form: Form }) {

    const [visibleModal, setVisibleModal] = useState<any>(null);

    const { user: viewer, isLoading, isError } = useUser({ redirectTo: '/login' });
    if(isLoading || !user || isError) return <></>

    if(user._id.toString() != viewer._id.toString() && viewer.role !== 'admin' && !form.permissions[viewer.role]?.changeStatus) return <></>

    return (
        <>
            <Menu transition="pop" withArrow placement="end" control={<ActionIcon size={35} color='blue'><BiCog size={25}/></ActionIcon>}>
                {(form.permissions[viewer.role]?.changeStatus) && 
                    <Menu.Item icon={<AiOutlineEdit size={16} />} onClick={() => setVisibleModal('update')}>
                        <Text weight={500} size="sm">Update status</Text>
                    </Menu.Item>                
                }
                {(viewer.role === 'admin' || user._id.toString() == viewer._id.toString()) &&
                    <Menu.Item icon={<MdDeleteForever size={16} />} color='red' onClick={() => setVisibleModal('delete')}>
                        <Text weight={500} size="sm">Delete application</Text>
                    </Menu.Item>
                }
            </Menu>
            <DeleteApplicationMenuItem application={application} isVisible={visibleModal == 'delete'} setVisible={setVisibleModal}/>
            <UpdateStatusModal application={application} isVisible={visibleModal == 'update'} setVisible={setVisibleModal}/>
        </>
    )
}