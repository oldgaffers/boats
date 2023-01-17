import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import FiberNewTwoToneIcon from '@mui/icons-material/FiberNewTwoTone';
import RoleRestricted from './rolerestrictedcomponent';
import YearbookBoats from './yearbook_boats';
import YearbookMembers from './yearbook_members';
import { membersBoats } from './yearbook';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery, gql } from '@apollo/client';

const MEMBER_QUERY = gql(`query members($members: [Int]!) {
    members(members: $members) {
        salutation firstname lastname member id GDPR 
        smallboats status telephone mobile area town
    }
  }`);

function statusText({ GDPR, status }) {
    if (status === 'Left OGA') {
        return 'Not in Yearbook - left OGA';
    }
    if (GDPR) {
        return 'will be in the Yearbook';
    }
    return 'Not in Yearbook - consent not given';
}

function MemberStatus({ memberNo, members }) {
    if (members.length === 1) {
        if (members[0].status !== 'Left OGA') {
            if (members[0].GDPR) {
                return <Typography>Your Yearbook entry will be as shown below.</Typography>;
            } else {
                return <Typography>
                    Your Yearbook entry would be as shown below, but you will
                    have to contact the membership secretary to give consent.
                </Typography>;
            }
        } else {
            return <Typography>
                Our records indicate you are no-longer a member. If you want to be in the Yearbook,
                please rejoin.
            </Typography>
        }
    } else {
        return <>
            <Typography variant='h6'>
                Membership {memberNo} includes the following people
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Yearbook</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        members.map((member, i) => (
                            <TableRow key={i}>
                                <TableCell>{member.salutation} {member.firstname} {member.lastname}</TableCell>
                                <TableCell>
                                    <Typography>{statusText(member)}</Typography>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </>;
    }
}

function MemberData({ boats }) {
    const { user } = useAuth0();
    const memberNo = user?.["https://oga.org.uk/member"];
    const memberResult = useQuery(MEMBER_QUERY, { variables: { members: [memberNo] } });
    if (!memberResult.data) {
        return <CircularProgress />
    }
    const { members } = memberResult.data;
    const myBoats = membersBoats(boats, members);

    return <>
        <MemberStatus key={memberNo} memberNo={memberNo} members={members} />
        <Typography sx={{ marginTop: '2px' }} variant='h6'>Your 2023 entry in the members list would be</Typography>
        <YearbookMembers members={members} boats={myBoats} components={{}} />
        <Typography variant='h6'>Your 2023 entry in the boat list would be</Typography>
        <YearbookBoats boats={myBoats} components={{}} />
    </>;
}

export default function AboutYearbook({ view, boats }) {
    if (view === 'sell') {
        return '';
    }
    return (
        <Accordion defaultExpanded={false}>
            <AccordionSummary expandIcon={
                <Tooltip placement='left' title='click to show or hide the text'>
                    <ExpandCircleDownIcon />
                </Tooltip>
            }>
                <Typography>About the Yearbook</Typography>
                <FiberNewTwoToneIcon color='error' fontSize='large' />
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant='h5'>
                    The 2023 yearbook will be published soon.
                </Typography>
                <RoleRestricted>
                    <Typography>
                        Log in to see what your entry will look like.
                    </Typography>
                    <Typography>
                        If you want to be in the yearbook you need be a paid up member and you need to have given consent.
                        If you want your boat listed in the yearbook, make sure we know you own her.
                    </Typography>
                </RoleRestricted>
                <RoleRestricted role='member'>
                    <MemberData boats={boats} />
                    <Typography>
                        If your boat isn't shown, you can update the ownership using the 'I have edits' button
                        on the boat's detail page.
                        If your boat isn't on the register, add it here.
                    </Typography>
                </RoleRestricted>
            </AccordionDetails>
        </Accordion>
    );
}
