import { Box, Container, Paper } from "@mantine/core";
import React from "react";
import PageContent from "../../../components/elements/PageContent";
import RolesList from "../../../components/pages/roles/RolesList";

export default function Roles(){
    return (
        <PageContent admin={true} title="Admin - Ranks">
            <Container size={'md'}>
                <Box mt={30}>
                    <Paper withBorder>
                        <RolesList/>
                    </Paper>
                </Box>
            </Container>
        </PageContent>
    )
}