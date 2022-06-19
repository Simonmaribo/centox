import { Box, Container } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import getApplication from "../../components/api/applications/getApplication";
import Error from "../../components/elements/Error";
import LoadingScreen from "../../components/elements/LoadingScreen";
import PageContent from "../../components/elements/PageContent";
import ApplicationBox from "../../components/pages/application/ApplicationBox";

export default function Application(){
    const router = useRouter();
    var { id } = router.query;

    if(Array.isArray(id)) id = id[0];
    const { isLoading, isError, data } = useQuery(['application', id], async () => await getApplication(id));
    
    return (
        <PageContent title={(isLoading || isError || !data) ? "Ansøgning" : `${data.user?.username}'s ${data.form?.name} ansøgning`}>
            { isError 
            ? <Error error={data?.message ? data?.message : 'Der gik noget galt.'}/> 
            : (isLoading || !data || !data.user || !data.application || !data.form 
                ? <LoadingScreen/>
                : 
                <Container size={'md'}>
                    <Box mt={30} mb={30}>
                        <ApplicationBox user={data.user} application={data.application} form={data.form}/>
                    </Box>
                </Container>
            )}
        </PageContent>
    )
}