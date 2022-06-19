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
                <TextInput placeholder={isFieldType(field.type, 'heading') ? 'Indtast en overskrift' : 'Indtast et spørgsmål'} id={field.id}
                    variant='unstyled' size='xl' required sx={!isFieldType(field.type, 'checkbox') ? { height: '40px !important' } : {}} defaultValue={field.label || ''}
                    onChange={(event) => { handleUpdateField({ ...field, label: event.target.value }) }}
                />
            }
            { !isFieldType(field.type, 'heading', 'checkbox') &&
                <Textarea placeholder={isFieldType(field.type, 'text') ? 'Dette er en tekstblok - tilføj noget tekst' : 'Indtast en beskrivelse'} id={field.id}
                    variant='unstyled' size='sm' autosize defaultValue={field.description || ''}
                    sx={isFieldType(field.type, 'text') ? { marginTop: '0.5rem' } : {}}
                    onChange={(event) => { handleUpdateField({ ...field, description: event.target.value }) }}
                />
            }

            { isFieldType(field.type, 'shorttext', 'longtext', 'select', 'checkbox') &&
                <Switch label='Påkrævet' checked={field.required} onChange={(event) => { handleUpdateField({ ...field, required: event.target.checked }) }} id={field.id}/>
            }
        </Box>
    )
}