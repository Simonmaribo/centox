import { Box, Divider, Paper } from "@mantine/core";
import Application from "../../types/application";
import Form from "../../types/form";
import User from "../../types/user";
import ApplicationAnswers from "./ApplicationAnswers";
import ApplicationInfo from "./ApplicationInfo";
import ApplicationCommentBox from "./comments/ApplicationCommentBox";
import ApplicationStatusChanged from "./status/ApplicationStatusChangedBox";

export default function ApplicationBox({ user, application, form }: {user: User, application: Application, form: Form}) {
    return (
        <Paper p='md' withBorder sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <ApplicationInfo form={form} user={user} application={application}/>
            <Divider labelPosition="center" label='Svar'/>
            <ApplicationAnswers form={form} application={application}/>
            <Box sx={{ marginTop: '1rem'}}>
                <ApplicationCommentBox form={form} application={application}/>
                { application.statusUpdatedBy && <ApplicationStatusChanged application={ application }/> }
            </Box>
        </Paper>
    )
}