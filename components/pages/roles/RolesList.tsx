import { Box, Button, Table } from "@mantine/core";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useQuery } from "react-query";
import getRoles from "../../api/roles/getRoles";
import Error from "../../elements/Error";
import Loading from "../../elements/Loading";
import RoleBadge from "../../elements/RoleBadge";
import Role from "../../types/role";
import RolesModal from "./RolesModal";

export default function RolesList() {

    const { isLoading, isError, data: roles } = useQuery('roles', getRoles)
    const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined)
    const [isVisible, setVisible] = useState(false);


    const openRoleModal = (role?: Role) => {
        setSelectedRole(role)
        setVisible(true)
    }

    return (
        <>
            {(isLoading || !roles) ? (isError ? <Error/> : <Loading/>) : 
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Table highlightOnHover verticalSpacing={'md'} horizontalSpacing='xl'>
                    <thead>
                        <tr>
                            <th>Navn</th>
                            <th>Badge</th>
                            <th>Medlemmer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            isError ? <tr><td colSpan={3}><Error height={'25vh'}/></td></tr> : (isLoading || !roles ? <></> : 
                            Object.keys(roles).map((key, index) => (
                                <Box component="tr" key={index} onClick={() => openRoleModal(roles[key])} sx={{ cursor: 'pointer' }}>
                                    <td>{roles[key].label}</td>
                                    <td><RoleBadge role={key}/></td>
                                    <td>0</td>
                                </Box>
                            )))
                        }
                    </tbody>
                </Table>
                <Box sx={{ margin: '1rem'}}>
                    <Button variant="outline" radius='xl' onClick={() => openRoleModal(undefined)} leftIcon={<FaPlus/>}>Opret rank</Button>
                </Box>
            </Box>
            }
            {isVisible && <RolesModal role={selectedRole} setVisible={setVisible} />}
        </>
    )
}