import { Box, Container, Paper } from "@mantine/core";
import React, { useState } from "react";
import PageContent from "../../../components/elements/PageContent";
import AppFormList from "../../../components/pages/forms/FormList";

export default function Applications(){
    return (
        <PageContent admin={true} title="Admin - Skemaer">
            <Container size={'md'}>
                <Box mt={30}>
                    <Paper withBorder>
                        <AppFormList/>
                    </Paper>
                </Box>
            </Container>
        </PageContent>
    )
}