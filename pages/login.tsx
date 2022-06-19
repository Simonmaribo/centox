import { Anchor, Box, Center } from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import login from '../components/api/auth/login';
import useUser from '../components/api/swr/useUser';
import Error from '../components/elements/Error';
import LoadingScreen from '../components/elements/LoadingScreen';
import Meta from '../components/elements/Meta';
import DiscordLoginButton from '../components/pages/login/DiscordLoginButton';
import config from '../config.json';

export default function Login() {

    const router = useRouter();
    var { code, logout } = router.query;

    const { user, mutate, isLoading, isError } = useUser({
        redirectTo: "/",
        redirectIfFound: true,
    });

    useEffect(() => {
        if(code) {
            login({ code: Array.isArray(code) ? code[0] : code })
            .then((response) => {
                console.log(response)
                mutate(response)
                router.push("/");
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }, [router, code, mutate]);

    if(isError) return <Error />
    if(isLoading) return <LoadingScreen/>

    return (
        <>
            <Meta title="Login with Discord"/>
            <Center style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', borderRadius: '0.25rem', padding: '1.5rem 2rem 2rem 2rem', marginBottom: '1rem' }}>
                    <Box sx={{ padding: '1.5rem 0' }}>
                        <Image src="/logo.svg" alt="logo" width={170*2} height={41*2}/>
                    </Box>
                    <DiscordLoginButton clientId={config.discord.client_id} redirectUri={config.discord.redirect_uri}/>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Anchor href="https://github.com/simonmaribo/centox" target='_blank' color='gray' size='xs'>
                        © {new Date().getFullYear()} Centox - A Open Source Project.
                    </Anchor>
                </Box>
            </Center>
        </>
    )
}