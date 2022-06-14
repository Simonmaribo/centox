import { TextInput, Box } from "@mantine/core";
import Form from "../../../types/form";

export default function FormInfo({ form, setForm }: { form: Form, setForm: (form: Form) => void }) {


    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <TextInput label="Name" description="The name the user sees" placeholder="Supporter" required sx={{ flexGrow: 1 }} 
                value={form.name || ''}
                onChange={(event) => setForm({...form, name: event.target.value})}
            />
            <TextInput label="Icon" description="Find icons on fontawesome.com" placeholder="fa-solid fa-handshake-angle" sx={{flexGrow: 1}} 
                value={form.icon || ''}
                onChange={(event) => setForm({...form, icon: event.target.value})}
            />
        </Box>
    )
}