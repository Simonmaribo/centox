import { Box, Container } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import getForm from "../../../components/api/forms/getForm";
import Error from "../../../components/elements/Error";
import LoadingScreen from "../../../components/elements/LoadingScreen";
import PageContent from "../../../components/elements/PageContent";
import CreateApplicationBox from "../../../components/pages/applications/CreateApplicationBox";

export default function CreateForm(){

    const router = useRouter();
    var { id } = router.query;

    if(Array.isArray(id)) id = id[0];
    
    const { isLoading, isError, data } = useQuery(['form', id], async () => await getForm(id));

    return (
        <PageContent title={(isLoading || isError || !data || !data.form) ? "Opret ansøgning" : `Opret ${data.form.name} ansøgning`}>
            { isError 
            ? <Error error={data?.message || "Skemaet blev ikke fundet"}/> 
            : (isLoading || !data || !data.form 
                ? <LoadingScreen/>
                : 
                <Container size={'md'}>
                    <Box mt={30} mb={30}>
                        <CreateApplicationBox form={data.form}/>
                    </Box>
                </Container>
            )}
        </PageContent>
    )
}