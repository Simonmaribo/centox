import Error from "../components/elements/Error";
import PageContent from "../components/elements/PageContent";

export default function PageNotFound(){
    return (
        <PageContent title="Page not found">
            <Error error="Page not found"/>
        </PageContent>
    )
}