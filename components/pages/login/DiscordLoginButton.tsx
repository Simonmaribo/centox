import { Anchor, Box } from "@mantine/core";
import { BsDiscord } from "react-icons/bs";

export default function DiscordLoginButton({ clientId, redirectUri }: { clientId: string, redirectUri: string }) {
    return (
        <Anchor href={`https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify&prompt=none`} weight={600}
            sx={{
                display: 'flex',
                lineHeight: 1,
                border: '1px solid white',
                color: 'white',
                backgroundColor: 'rgba(88, 101, 242, 1)',
                borderRadius: '0.25rem',
                padding: '0.75rem 2rem',
                '&:hover': {
                    color: 'rgba(88, 101, 242, 1)',
                    backgroundColor: 'rgba(88, 101, 242, 0.1)',
                    borderColor: 'rgba(88, 101, 242, 1)',
                },
                transition: 'color 0.2s, background-color 0.2s',
            }}
        >
            <Box sx={{ paddingRight: '0.5rem' }}><BsDiscord/></Box> Login with Discord
        </Anchor>
    )
}