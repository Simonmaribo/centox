import { Menu, Button, Text } from "@mantine/core";
import { BiHeading } from "react-icons/bi";
import { BsParagraph } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { GrTextAlignLeft } from "react-icons/gr";
import { MdShortText, MdOutlineArrowDropDownCircle } from "react-icons/md";
import { TbSelect } from "react-icons/tb";
import FormField from "../../../../types/formField";

export default function AddFieldButton({ handleAddField }: { handleAddField: (type: FormField['type']) => void }) {
    return (
        <Menu control={<Button color='primary' leftIcon={<FaPlus/>}>Tilføj felt</Button>} position='top'>
            <Menu.Label>Content</Menu.Label>
            <Menu.Item icon={<BsParagraph/>} onClick={() => handleAddField('text')}>
                <Text weight={600}>Tekst</Text>
            </Menu.Item>
            <Menu.Item icon={<BiHeading/>} onClick={() => handleAddField('heading')}>
                <Text weight={600}>Overskrift</Text>
            </Menu.Item>

            <Menu.Label>Input</Menu.Label>
            <Menu.Item icon={<MdShortText/>} onClick={() => handleAddField('shorttext')}>
                <Text weight={600}>Kort tekst</Text>
            </Menu.Item>
            <Menu.Item icon={<GrTextAlignLeft/>} onClick={() => handleAddField('longtext')}>
                <Text weight={600}>Lang tekst</Text>
            </Menu.Item>
            <Menu.Item icon={<MdOutlineArrowDropDownCircle/>} disabled>
                <Text weight={600}>Vælg</Text>
            </Menu.Item>
            <Menu.Item icon={<TbSelect/>} onClick={() => handleAddField('checkbox')}>
                <Text weight={600}>Afkrydsningsfelt</Text>
            </Menu.Item>
        </Menu>   
    )
}