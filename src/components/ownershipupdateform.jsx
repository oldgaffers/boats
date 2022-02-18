import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import CircularProgress from "@mui/material/CircularProgress";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import { useLazyQuery, gql } from '@apollo/client';

const MEMBER_QUERY = gql(`query members($members: [Int]!) {
    members(members: $members) {
      firstname
      lastname
      member
      id
    }
  }`);

export const ownershipUpdateForm = {
    title: "Update Ownerships",
    name: "ownerships",
    component: componentTypes.SUB_FORM,
    fields: [
        {
            component: "ownership-form",
            name: "ownerships",
            label: "Known Owners",
        },
    ],
};

const queryIf = (o) => o.member && (o.name === undefined || o.name.trim() === '');

export default function OwnershipForm(props) {
    const { user } = useAuth0();
    const { input, meta } = useFieldApi(props);
    const [ownerships, setOwnerships] = useState(input.value);
    console.log('meta', meta);
    console.log('owners', ownerships);
    let membership;
    if (user && user['https://oga.org.uk/id'] && user['https://oga.org.uk/member']) {
        membership = {
            id: parseInt(user['https://oga.org.uk/id']),
            member: parseInt(user['https://oga.org.uk/member']),
        };
    }
    console.log(membership);  
    const [getMembers, getMembersResults] = useLazyQuery(MEMBER_QUERY);
    if (getMembersResults.loading) return <CircularProgress />;
    const { owners } = ownerships;
    let ownersWithNames = owners;
    if (getMembersResults.error) {
        console.log(`Error! ${getMembersResults.error}`);
    }
    const memberNumbers = owners.filter((o) => queryIf(o)).map((o) => o.member);
    if (membership) {
        memberNumbers.push(membership.member);
    }
    console.log('memberNumbers', memberNumbers);
    let members = [];
    if (getMembersResults.data) {
        if (getMembersResults.data.members) {
            members = getMembersResults.data.members;
        }
    } else if (memberNumbers.length > 0) {
        getMembers({ variables: {members: memberNumbers }});
    }
    ownersWithNames = owners.map((owner, index) => {
        if (owner.name) {
            return { ...owner, id: index };
        }
        let name = '';
        const m = members.filter((member) => member.id === owner.id);
        if (m.length > 0) {
            name = `${m[0].firstname} ${m[0].lastname}`;
        }
        return {
            ...owner,
            name,
            id: index,
        }
    }).sort((a, b) => a.start > b.start);

    const ends = owners.filter((o) => o.end).sort((a, b) => a.end < b.end);
    const lastEnd = (ends.length > 0) ? ends[0].end : undefined;
    console.log('new owner could start at', lastEnd);

    const handleClaim = () => {
        console.log('members', members);
        const family = members.filter((m) => m.member === membership.member);
        console.log(family);
        family.forEach((m) => {
            const o = { start: lastEnd, id: m.id, member: m.member, current: true, share: Math.floor(64/family.length) };
            console.log('claim', o);
            owners.push(o);    
        })
        setOwnerships({ ...ownerships, owners });
    }

    const handleAddRow = () => console.log('add');

    return (
        <div style={{ height: 300, width: '100%' }}>
            <DataGrid
                rows={ownersWithNames}
                columns={[
                    { field: 'name', headerName: 'Name', flex: 1, valueGetter: ({ row }) => row.name || row.note },
                    { field: 'start', headerName: 'Start', width: 90, valueGetter: ({ row }) => row.start || '?' },
                    { field: 'end', headerName: 'End', width: 90, valueGetter: ({ row }) => row.end || '-' },
                    { field: 'share', headerName: 'Share', width: 90, valueGetter: ({ row }) => row.share ? `${row.share}/64` : '' },
                ]}
            />
            <Stack
                sx={{ width: '100%', mb: 1 }}
                direction="row"
                alignItems="flex-start"
                columnGap={1}
            >
                <Button size="small" onClick={handleClaim}>
                    This is my boat
                </Button>
                <Button size="small" onClick={handleAddRow}>
                    I know of other people who have owned her
                </Button>
            </Stack>
        </div>
    );
}
