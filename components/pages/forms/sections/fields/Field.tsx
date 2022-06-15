import { Box, Switch, TextInput, Textarea } from "@mantine/core";
import FormField from "../../../../types/formField";

// 'text' | 'heading' | 'shorttext' | 'longtext' | 'select' | 'checkbox'

function isFieldType(fieldType: string, ...types: string[]): boolean {
    return types.includes(fieldType);
}

export default function Field({ handleUpdateField, field }: { handleUpdateField: (field: FormField) => void, field: FormField }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '0.1rem'}}>
            { !isFieldType(field.type, 'text') &&
                <TextInput placeholder={isFieldType(field.type, 'heading') ? 'Enter a heading' : 'Enter a question'}
                    variant='unstyled' size='xl' required sx={{ height: '40px !important' }} defaultValue={field.label || ''}
                />
            }
            { !isFieldType(field.type, 'heading') &&
                <Textarea placeholder={isFieldType(field.type, 'text') ? 'This is a text block - add some text' : 'Enter a description'}
                    variant='unstyled' size='sm' autosize defaultValue={field.description || ''}
                    sx={isFieldType(field.type, 'text') ? { marginTop: '0.5rem' } : {}}
                />
            }
            { isFieldType(field.type, 'shorttext', 'longtext', 'select', 'checkbox') &&
                <Switch label='Required' checked={field.required} onChange={(event) => { handleUpdateField({ ...field, required: event.target.checked }) }}/>
            }
        </Box>
    )
}