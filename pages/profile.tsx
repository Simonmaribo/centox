import useUser from "../components/api/swr/useUser";
import Error from "../components/elements/Error";
import PageContent from "../components/elements/PageContent";
import ProfileBox from "../components/pages/profile/ProfileBox";

export default function Profile(){

    const { user, isLoading, isError } = useUser({
        redirectTo: "/login"
    });

    return (
        <PageContent title="Din profil">
            { isError 
            ? <Error /> 
            : (isLoading 
                ? <></> 
                : 
                <ProfileBox user={user}/>
            )}
        </PageContent>
    )
}