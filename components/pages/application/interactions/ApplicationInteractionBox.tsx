import { Box } from "@mantine/core";
import Application from "../../../types/application";
import Form from "../../../types/form";
import ApplicationComment from "./ApplicationComment";
import ApplicationCreateComment from "./ApplicationCreateComment";
import ApplicationStatusUpdate from "./ApplicationStatusUpdate";

export default function ApplicationInteractionBox({ form, application }: { form: Form, application: Application }) {
    return (
        <Box sx={{ marginLeft: '2rem', marginRight: '2rem' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {application.interactions.map((interaction, index) => {
                    if (interaction.type === 'comment') {
                        return <ApplicationComment key={index} interaction={interaction} />
                    }
                    if (interaction.type == 'statusUpdate'){
                        return <ApplicationStatusUpdate key={index} interaction={interaction} />
                    }
                })}
            </Box>
            <ApplicationCreateComment application={application} form={form}/>
        </Box>
    )
}