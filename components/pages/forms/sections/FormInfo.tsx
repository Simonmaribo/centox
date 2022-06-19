import { TextInput, Box } from "@mantine/core";
import Form from "../../../types/form";

export default function FormInfo({ form, setForm }: { form: Form, setForm: (form: Form) => void }) {


    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <TextInput label="Navn" description="Navnet som brugeren ser" placeholder="Supporter" required sx={{ flexGrow: 1 }} id={'formName'} 
                value={form.name || ''}
                onChange={(event) => setForm({...form, name: event.target.value})}
            />
            <TextInput label="Ikon" description="Find ikoner på fontawesome.com" placeholder="fa-solid fa-handshake-angle" sx={{flexGrow: 1}} id={'formicon'} 
                value={form.icon || ''}
                onChange={(event) => setForm({...form, icon: event.target.value})}
            />
        </Box>
    )
}