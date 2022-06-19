import { Box, Container } from "@mantine/core";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import getForm from "../../../components/api/forms/getForm";
import Error from "../../../components/elements/Error";
import LoadingScreen from "../../../components/elements/LoadingScreen";
import PageContent from "../../../components/elements/PageContent";
import FormBox from "../../../components/pages/forms/FormBox";

export default function Form(){

    const router = useRouter();
    var { id } = router.query;

    if(Array.isArray(id)) id = id[0];
    
    const { isLoading, isError, data } = useQuery(['form', id], async () => await getForm(id));

    return (
        <PageContent admin={true} title={(isLoading || isError || !data || !data.form) ? "Admin - Form" : `Admin - ${data.form.name} form`}>
            { isError 
            ? <Error error={data?.message || "Form not found"}/> 
            : (isLoading || !data || !data.form 
                ? <LoadingScreen/>
                : 
                <Container size={'md'}>
                    <Box mt={30}>
                        <FormBox form={data.form}/>
                    </Box>
                </Container>
            )}
        </PageContent>
    )
}