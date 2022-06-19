import { Badge } from "@mantine/core";
import { useQuery } from "react-query";
import getRoles from "../api/roles/getRoles";

export default function RoleBadge({ role }: { role: string | undefined }){

    const { isLoading, isError, data: roles } = useQuery('roles', getRoles)
    if(isLoading || isError || !roles) return <Badge color="gray">Loader...</Badge>

    const label = role ? roles[role]?.label : "Spiller";
    const color = role ? roles[role]?.color : "grey";

    return (
        <Badge color={color} size='md'>{label}</Badge>
    )
}