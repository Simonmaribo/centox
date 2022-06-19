import { useRouter } from "next/router";
import { useQuery } from "react-query";
import getForm from "../../../components/api/forms/getForm";
import Error from "../../../components/elements/Error";
import LoadingScreen from "../../../components/elements/LoadingScreen";
import PageContent from "../../../components/elements/PageContent";
import ApplicationListStatus from "../../../components/pages/applications/list/ApplicationListStatus";

export default function OpenApplications(){

    const router = useRouter();
    var { id } = router.query;

    if(Array.isArray(id)) id = id[0];

    const { isLoading, isError, data } = useQuery(['form', id], async () => await getForm(id));
    
    return (
        <PageContent title={(isLoading || isError || !data || !data.form) ? "Ansøgninger" : `Afventende ${data.form.name} applications`}>
            {
                isError ? <Error error={data?.message || "Skemaet blev ikke fundet"}/> 
                    : isLoading || !data || !data.form ? <LoadingScreen/>
                        : <ApplicationListStatus status={'pending'} form={data.form}/>
            }
        </PageContent>
    )
}