import Error from "../components/elements/Error";
import PageContent from "../components/elements/PageContent";

export default function PageNotFound(){
    return (
        <PageContent title="Siden blev ikke fundet">
            <Error error="Siden blev ikke fundet."/>
        </PageContent>
    )
}