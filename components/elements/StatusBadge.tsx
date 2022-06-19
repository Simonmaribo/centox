import { Badge, Sx } from "@mantine/core";

export default function StatusBadge({ status, sx }: { status?: string, sx?: Sx }){

    switch(status) {
        case 'accepted':
            return <Badge color="green" sx={[sx]}>Accepteret</Badge>
        case 'rejected':
            return <Badge color="red" sx={[sx]}>Afvist</Badge>
        case 'pending':
        default:
            return <Badge color="orange" sx={[sx]}>Afventer svar</Badge>
    }
}