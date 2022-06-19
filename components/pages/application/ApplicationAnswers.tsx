import { Box, Checkbox, Textarea, TextInput } from "@mantine/core"
import Application from "../../types/application"
import Form from "../../types/form"

export default function ApplicationAnswers({ form, application}: {form: Form, application: Application}) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            {
                form.fields.map((field, index) => {
                    return (
                        <Box key={index}>
                            {field.type == 'shorttext' && 
                                <TextInput 
                                    id={field.id}
                                    label={field.label} 
                                    description={field.description} 
                                    required={field.required}
                                    value={application.answers[field.id]}
                                    error={field.required && !application.answers[field.id] ? "Dette spørgsmål er ikke blevet besvaret." : undefined}
                                    disabled
                                />
                            }
                            {field.type == 'longtext' &&
                                <Textarea 
                                    id={field.id}
                                    label={field.label} 
                                    description={field.description} 
                                    required={field.required} 
                                    value={application.answers[field.id]}
                                    error={field.required && !application.answers[field.id] ? "Dette spørgsmål er ikke blevet besvaret." : undefined}
                                    disabled
                                    autosize 
                                    minRows={5}
                                />
                            }
                            {field.type == 'checkbox' &&
                                <Checkbox 
                                    id={field.id}
                                    label={field.label} 
                                    checked={`${application.answers[field.id]}` === 'true'}
                                    disabled
                                />
                            }
                        </Box>
                    )
                })
            }
        </Box>
    )
}