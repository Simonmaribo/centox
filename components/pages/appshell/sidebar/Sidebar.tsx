import React, { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { SegmentedControl, Box, MediaQuery, Image, Divider, ScrollArea, Anchor } from '@mantine/core';
import { FaUsers, FaDatabase, FaYoutube, FaListUl, FaHammer, FaHandshake, FaRegQuestionCircle } from "react-icons/fa";
import SidebarGroup from './SidebarGroup';
import Error from '../../../elements/Error';
import useUser from '../../../api/swr/useUser';
import { UserButton } from './UserButton';
import Link from 'next/link';
import LoadingScreen from '../../../elements/LoadingScreen';
import { useQuery } from 'react-query';
import getForms from '../../../api/forms/getForms';
import { IconType } from 'react-icons/lib';

interface SidebarSection {
    [key: string]: SidebarGroupData[]
}

interface SidebarGroupData {
    group?: string;
    links: SidebarLink[];
}

interface SidebarLink {
    label: string;
    icon?: IconType | string;
    link?: string;
    links?: SidebarLink[];
}

export default function Sidebar({ isExtended, admin }: { isExtended?: boolean, admin?: boolean }) {

    const matches = useMediaQuery('(min-width: 750px)');
    const [section, setSection] = useState(admin ? 'admin' : 'default');

    const { user, isLoading: isUserLoading, isError: isUserError } = useUser({ redirectTo: '/login' });

    const { isLoading: isFormLoading, isError: isFormError, data } = useQuery('forms', getForms)
    if(isFormLoading || !data?.forms) return <></>
    if(isFormError) return <Error/>



    var formLinks: SidebarLink[] = [];
    data.forms.forEach(form => {
        var permission = form.permissions[user.role];
        if(permission.create || permission.comment || permission.viewOthers || permission.changeStatus) {	
            var links: SidebarLink[] = [];
            if(permission.create) links.push({ label: 'Create application', link: `/forms/${form._id}/create` });
            if(permission.viewOthers) {
                links.push({ label: 'Open applications', link: `/forms/${form._id}/open` });
                if(permission.changeStatus)
                    links.push({ label: 'Closed applications', link: `/forms/${form._id}/closed` });
                
            }

            formLinks.push({
                label: form.name,
                icon: form.icon,
                links: links
            })
        }
    })

    const tabs: SidebarSection = {
        default: [
            {
                group: 'Forms',
                links: formLinks
            }
        ],
        admin: [
            {
                group: 'Administration',
                links: [
                    { link: '/admin/users', label: 'Users', icon: FaUsers },
                    { link: '/admin/roles', label: 'Roles', icon: FaListUl },
                    { link: '/admin/forms', label: 'Forms', icon: FaDatabase },
                ]
            }
        ],
    }

    return ( 
        <>
        {(matches || isExtended) && 
            <MediaQuery query="(max-width: 750px)" styles={{ width: '100%' }}>
            { (isUserError) 
            ? <Error /> 
            : ((!user || isUserLoading)
                ? <></>
                : 
                <Box sx={{ backgroundColor: '#fff', height: '100vh', transition: 'all 0.3s', width: 300, padding: '1rem', zIndex: 1, position: (isExtended && !matches ? "fixed" : "static")}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
                                <Anchor component={Link} href="/">
                                    <Image src="/logo.svg" alt="logo" width={170} height={41}/>
                                </Anchor>
                            </Box>
                            <Box>
                                {user?.role == "admin" &&
                                    <SegmentedControl
                                        value={section}
                                        onChange={setSection}
                                        transitionTimingFunction="ease"
                                        fullWidth
                                        data={[
                                            { label: 'User', value: 'default' },
                                            { label: 'Admin', value: 'admin' },
                                        ]}
                                    />
                                }
                            </Box>
                            <Divider/>
                            <ScrollArea>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    {
                                        tabs[section].map((item: any, index: number) => <SidebarGroup group={item} key={index} />)
                                    }
                                </Box>
                            </ScrollArea>
                        </Box>
                        <Box>
                            <Divider mb={3}/>
                            <UserButton user={user} />
                        </Box>
                    </Box>
                </Box>
                )}
            </MediaQuery>
        }
        </>
    )
}