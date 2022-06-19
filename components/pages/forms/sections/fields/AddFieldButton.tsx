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
        <Menu control={<Button color='primary' leftIcon={<FaPlus/>}>Add field</Button>} position='top'>
            <Menu.Label>Content</Menu.Label>
            <Menu.Item icon={<BsParagraph/>} onClick={() => handleAddField('text')}>
                <Text weight={600}>Text</Text>
            </Menu.Item>
            <Menu.Item icon={<BiHeading/>} onClick={() => handleAddField('heading')}>
                <Text weight={600}>Heading</Text>
            </Menu.Item>

            <Menu.Label>Input</Menu.Label>
            <Menu.Item icon={<MdShortText/>} onClick={() => handleAddField('shorttext')}>
                <Text weight={600}>Short Text</Text>
            </Menu.Item>
            <Menu.Item icon={<GrTextAlignLeft/>} onClick={() => handleAddField('longtext')}>
                <Text weight={600}>Long Text</Text>
            </Menu.Item>
            <Menu.Item icon={<MdOutlineArrowDropDownCircle/>} disabled>
                <Text weight={600}>Select</Text>
            </Menu.Item>
            <Menu.Item icon={<TbSelect/>} onClick={() => handleAddField('checkbox')}>
                <Text weight={600}>Checkbox</Text>
            </Menu.Item>
        </Menu>   
    )
}