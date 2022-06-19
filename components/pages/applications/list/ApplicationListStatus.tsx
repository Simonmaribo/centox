import { Box, Container } from "@mantine/core";
import useUser from "../../../api/swr/useUser";
import Error from "../../../elements/Error";
import LoadingScreen from "../../../elements/LoadingScreen";
import Form from "../../../types/form";
import ApplicationList from "./ApplicationList";

export default function ApplicationListStatus({ status, form, full }: { status: string[] | string, form: Form, full?: boolean }) {

    const { user, isLoading, isError } = useUser({ redirectTo: '/login' });

    return (
        <>
            {
                isLoading ? <LoadingScreen/>
                : isError ? <Error/>
                    : !form.permissions[user.role]?.viewOthers ? <Error error='You do not have permission to view this list.'/> 
                        : <Container size={'md'}>
                            <Box mt={30} mb={30}>
                                <ApplicationList status={status} form={form} full={full}/>
                            </Box>
                        </Container>
            }
        </>
    )
}
