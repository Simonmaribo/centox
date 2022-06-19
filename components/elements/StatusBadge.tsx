import { Badge, Sx } from "@mantine/core";

export default function StatusBadge({ status, sx }: { status?: string, sx?: Sx }){

    switch(status) {
        case 'accepted':
            return <Badge color="green" sx={[sx]}>Accepted</Badge>
        case 'rejected':
            return <Badge color="red" sx={[sx]}>Rejected</Badge>
        case 'pending':
        default:
            return <Badge color="orange" sx={[sx]}>Pending</Badge>
    }
}