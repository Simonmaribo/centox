import { Box, Paper, Sx, Table, Text, Pagination } from "@mantine/core";
import React, { useState } from "react";
import { useQuery } from "react-query";
import getUsers from "../../api/users/getUsers";
import Error from "../../elements/Error";
import UserListItem from "./UserListItem";

interface UserListProps {
    sx?: Sx;
}

export default function UserList({ sx }: UserListProps) {

    const [page, setPage] = useState(1);
    const { isLoading, isError, data } = useQuery(['users', page], () => getUsers(page), { keepPreviousData: true })

    return (
        <Paper sx={[sx]} withBorder>
            <Table highlightOnHover verticalSpacing={'md'} horizontalSpacing='xl'>
                <Box component='thead'>
                    <Box component='tr'>
                        <Text component='th'>Username</Text> 
                        <th>Role</th> 
                        <th>Joined</th> 
                    </Box>
                </Box>
                <tbody>
                    {
                        isError ? <tr><td colSpan={3}><Error height={'25vh'}/></td></tr> : (isLoading || !data ? <></> : 
                        data.users.map((user, index) => <UserListItem key={index} user={user}/>))
                    }
                </tbody>
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '1rem'}}>
                <Pagination page={page} onChange={setPage} total={data?.pages || 1} />
            </Box>
        </Paper>    
    )
}