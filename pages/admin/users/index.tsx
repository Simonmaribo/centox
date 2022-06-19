import { Container } from '@mantine/core';

import PageContent from "../../../components/elements/PageContent";
import UserList from '../../../components/pages/users/UserList';

export default function Users(){

    return (
        <PageContent admin={true} title="Admin - Users">
            <Container size={'lg'}>
                <UserList sx={{ marginTop: 30 }}/>
            </Container>
        </PageContent>
    )
}