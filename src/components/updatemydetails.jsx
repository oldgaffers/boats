import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery, gql } from '@apollo/client';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, List, ListItem, Radio, RadioGroup, Snackbar, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import RoleRestricted from './rolerestrictedcomponent';
import YearbookBoats from './yearbook_boats';
import YearbookMembers from './yearbook_members';
import { membersBoats } from './yearbook';
import { getFilterable, postGeneralEnquiry } from './boatregisterposts';
import { Stack } from '@mui/system';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

const MEMBER_QUERY = gql(`query members($members: [Int]!) {
    members(members: $members) {
        salutation firstname lastname member id GDPR 
        smallboats status telephone mobile area town
        interests
    }
  }`);

const areas = [
    { label: 'Bristol Channel', value: 'BC', funded: true },
    { label: 'Dublin Bay', value: 'DB', funded: true },
    { label: 'East Coast', value: 'EC', funded: true },
    { label: 'North East', value: 'NE', funded: true },
    { label: 'North Wales', value: 'NWa', funded: true },
    { label: 'North West', value: 'NW', funded: true },
    { label: 'Scotland', value: 'SC', funded: true },
    { label: 'Solent', value: 'SO', funded: true },
    { label: 'South West', value: 'SW', funded: true },
    { label: 'The Americas', value: 'AM', funded: false },
    { label: 'Continental Europe', value: 'EU', funded: false },
    { label: 'Rest of World', value: 'RW', funded: false },
];

function UpdateMyDetailsDialog({ user, onCancel, onSubmit, open }) {
    const [smallboats, setSmallboats] = useState(user?.smallboats || false);
    const [primary, setPrimary] = useState(user?.area);
    const [additional, setAdditional] = useState(user?.interests || []);
    const [text, setText] = useState('');

    const handleAreaChange = (event) => {
        const { name, value } = event.target;
        const abbr = name.split('-')[0]; // the area abbreviation
        const areaName = areas.find((area) => area.value === abbr).label;
        switch (value) {
            case 'P':
                if (primary && primary !== areaName) {
                    const v = areas.find((area) => area.label === primary).value;
                    const a = new Set(additional);
                    a.add(v);
                    a.delete(abbr)
                    setAdditional([...a]);
                }
                setPrimary(areaName);
                break;
            case 'S':
                if (primary && primary === areaName) {
                    setPrimary(undefined);
                }
                {
                    const a = new Set(additional);
                    a.add(abbr);
                    setAdditional([...a]);
                }
                break;
            default:
                if (primary && primary === areaName) {
                    setPrimary(undefined);
                }
                {
                    const a = new Set(additional);
                    a.delete(abbr);
                    setAdditional([...a]);
                }
        }
    }

    const val = (area) => {
        if (area.label === primary) {
            return 'P'
        }
        if (additional.includes(area.value)) {
            return 'S';
        }
        return 'N';
    }

    const handleSubmit = () => {
        onSubmit({ ...user, smallboats, interests: additional, area: primary }, text)
    };

    return (
        <Dialog
            open={open}
            aria-labelledby="dialog-update-member-details"
            maxWidth='md'
            fullWidth
        >
            <DialogTitle>Update Preferences</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Set one primary area and any secondary areas you want to receive communications from.
                </DialogContentText>
                <Stack>
                <FormGroup>
                    <FormControlLabel control={
                    <Checkbox checked={smallboats} onChange={(_, checked) => setSmallboats(checked)} />
                    } label="Small boats" />
                    <FormHelperText>If you check the small boats box, you will be told about events for small boats in all areas</FormHelperText>
                </FormGroup>
                <FormLabel><Typography>Areas</Typography></FormLabel>
                <FormHelperText>
                Your primary area will receive a portion of your membership fee.
                    Some areas are not currently set up to be primary areas
                    </FormHelperText>
                <Grid2 container>
                {areas.map((area) =>
                <Grid2 item xs={6}>
                    <FormControl>
                        <FormLabel id={area.value}><Typography variant='caption'>{area.label}</Typography></FormLabel>
                        <RadioGroup
                            value={val(area)}
                            onChange={handleAreaChange}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name={`${area.value}-group`}
                        >
                            <FormControlLabel disabled={!area.funded} value="P" control={<Radio />} label="Primary" />
                            <FormControlLabel value="S" control={<Radio />} label="Secondary" />
                            <FormControlLabel value="N" control={<Radio />} label="None" />
                        </RadioGroup>
                    </FormControl>
                    </Grid2>)}
                    </Grid2>
                    <FormLabel><Typography>If anything else needs changing, just ask here.</Typography></FormLabel>
                    <TextField multiline rows={3} label="Other changes" variant="outlined" onChange={(event) => setText(event.target.value)} />
                    </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}

function statusText({ GDPR, status }) {
    if (status === 'Left OGA') {
        return 'Not in Yearbook - left OGA';
    }
    if (GDPR) {
        return 'will be in the next printed Yearbook';
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

function MemberData({ memberNo, boats, members }) {
    const myBoats = membersBoats(boats, members);
    return <>
        <MemberStatus key={memberNo} memberNo={memberNo} members={members} />
        <Typography sx={{ marginTop: '2px' }} variant='h6'>Your entry in the members list would be</Typography>
        <YearbookMembers members={members} boats={myBoats} components={{}} />
        <Typography variant='h6'>Your entry in the boat list would be</Typography>
        <YearbookBoats boats={myBoats} components={{}} />
    </>;
}

export default function UpdateMyDetails() {
    const [open, setOpen] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [boats, setBoats] = useState();
    const { user } = useAuth0();
    const id = user?.["https://oga.org.uk/id"];
    const memberNo = user?.["https://oga.org.uk/member"];
    const memberResult = useQuery(MEMBER_QUERY, { variables: { members: [memberNo] } });

    const handleSubmit = (newData, text) => {
        console.log('submit', newData, text);
        setOpen(false);
        postGeneralEnquiry('member', 'profile', { ...newData, text})
            .then((response) => {
                setSnackBarOpen(true);
            })
            .catch((error) => {
                console.log("post", error);
                // TODO snackbar from response.data
            });
    }

    useEffect(() => {
        if (!boats) {
            getFilterable()
                .then((r) => {
                    const b = r.data.filter((b) => b.owners?.includes(id));
                    setBoats(b);
                }).catch((e) => console.log(e));
        }
    }, [boats, id]);

    if (!memberResult.data) {
        return <CircularProgress />
    }
    const { members } = memberResult.data;
    const record = members.find((m) => m.id === id);
    return (
        <>
            <RoleRestricted role='member'>
                <Typography variant='h6'>Hi {user.name}.</Typography>
                <List>
                    <ListItem>your membership number is {memberNo}</ListItem>
                    <ListItem>
                        Your primary area is {record.area}
                    </ListItem>
                    {record.smallboats ? (
                        <ListItem>
                            You have registered interest in small boat events
                        </ListItem>
                    ) : ''}
                </List>
                <Stack direction='row' spacing={2} sx={{ marginBottom: 2 }}>
                    <Button size="small"
                        endIcon={<EditIcon />}
                        variant="contained"
                        color="primary" onClick={() => setOpen(true)}>
                        Update My Interests
                    </Button>
                </Stack>
                <MemberData boats={boats} memberNo={memberNo} members={members} />
                <UpdateMyDetailsDialog user={record} onSubmit={handleSubmit} onCancel={() => setOpen(false)} open={open} />
            </RoleRestricted>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={snackBarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackBarOpen(false)}
                message="Thanks, we'll get back to you."
                severity="success"
            />
        </>
    );
}
