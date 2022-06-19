import { Box, Center, Text } from '@mantine/core';

const Error = ({ title, error, height}: { title: string, error: string, height: string }) => {
    return (
        <Box 
            sx={{
                backgroundColor: "rgba(240, 62, 62, 0.3)"
            }}>
            <Center style={{ height }} sx={{ flexDirection: 'column' }}>
                {title && <Text color='red' weight='bold'>{title}</Text>}
                {error && <Text color='red'>{error}</Text>}
            </Center>
        </Box>
    )
}

Error.defaultProps = {
    title: "Oh snap!",
    error: "Something went wrong.",
    height: '100vh'
}


export default Error;