import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import getUser from "../../components/api/users/getUser";
import Error from "../../components/elements/Error";
import LoadingScreen from "../../components/elements/LoadingScreen";
import PageContent from "../../components/elements/PageContent";
import ProfileBox from "../../components/pages/profile/ProfileBox";

export default function UserProfile(){
    const router = useRouter();
    var { id } = router.query;

    if(Array.isArray(id)) id = id[0];
    
    const { isLoading, isError, data } = useQuery(['user', id], async () => await getUser(id));

    return (
        <PageContent title={(isLoading || isError || !data || !data.user) ? "Profile" : `${data?.user?.username}'s profile`}>
            { isError 
            ? <Error error={data?.message ? data?.message : 'User not found'}/> 
            : (isLoading || !data || !data.user 
                ? <LoadingScreen/>
                : 
                <ProfileBox user={data.user} isViewing/>
            )}
        </PageContent>
    )
}

export const getStaticProps = async ({ locale }: { locale: any }) => ({
    props: {
      ...await serverSideTranslations(locale, ['common']),
    },
})