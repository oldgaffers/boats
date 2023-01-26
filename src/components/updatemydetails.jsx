import React, { useEffect, useState } from 'react';
import RoleRestricted from './rolerestrictedcomponent';
import YearbookBoats from './yearbook_boats';
import YearbookMembers from './yearbook_members';
import { membersBoats } from './yearbook';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery, gql } from '@apollo/client';
import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { getFilterable } from './boatregisterposts';

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
                return <Typography> Your Yearbook entry will be as shown below.</Typography>;
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

export default function UpdateMyDetails() {

  const [data, setData] = useState();
  const { user } = useAuth0();

  useEffect(() => {
    if (!data) {
      getFilterable().then((r) => setData(r.data)).catch((e) => console.log(e));
    }
  }, [data]);

  if (!data) return <CircularProgress />;

  const id = user?.["https://oga.org.uk/id"];
  const ownedBoats = data.filter((b) => b.owners?.includes(id));
  let boats = data;
    return (
    <>
        <RoleRestricted>
            <Typography>
                Log in to see what your entry will look like.
            </Typography>
        </RoleRestricted>
        <RoleRestricted role='member'>
        <Typography>
            Here you will be able to request updates to your profile on this page.
            You request will be checked by the membership secretary and should be active soon.
        </Typography>
        <Typography>
            For now you can see the data that would be in the printed yearbook.
        </Typography>
        <MemberData boats={ownedBoats} />
        </RoleRestricted>
    </>
    );
}
