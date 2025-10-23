import { gql, useQuery } from '@apollo/client';

export const MEMBER_QUERY = gql(`query members($members: [Int]!) {
  members(members: $members) {
    firstname
    lastname
    member
    id
    GDPR
    skipper { text }
  }
}`);

const queryIf = (o) => o.member && (o.name === undefined || o.name.trim() === '');

export function addNames(members, ownerships = []) {
    if (!members) {
        return ownerships;
    }
    return ownerships.map((ownership) => {
        const r = { ...ownership };
        const m = members.filter((member) => member.id === ownership.id);
        if (m.length > 0) {
            const { skipper, GDPR, firstname, lastname } = m[0];
            if (GDPR) {
                r.name = `${firstname} ${lastname}`;
            }
            if (skipper) {
                r.skipper = skipper;
            }
        }
        return r;
    });
};

export function ownerMembershipNumbers(boat) {
    const rawMemberNumbers = boat.ownerships?.filter((o) => queryIf(o)).map((o) => o.member) || [];
    return [...new Set(rawMemberNumbers)]; // e.g. husband and wife owners
}

export function ownershipsWithNames(boat, members) {
    const ownerships = addNames(members, boat.ownerships || []);
    ownerships.sort((a, b) => a.start > b.start);
    return ownerships;
}

export function useGetOwnerNames(boat) {
    const memberNumbers = ownerMembershipNumbers(boat);
    const { error, loading, data } = useQuery(MEMBER_QUERY, { variables: { members: memberNumbers }});
    if (error) {
        console.log(error)
        return boat.ownerships;
    }
    if (loading) {
        return boat.ownerships;
    }
    if (data) {
        return ownershipsWithNames(boat, data.members);
    }
    return boat.ownerships;
}
