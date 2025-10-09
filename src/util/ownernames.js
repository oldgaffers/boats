import { gql, useQuery } from '@apollo/client';

const MEMBER_QUERY = gql(`query members($members: [Int]!) {
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

function addNames(data, ownerships) {
    const members = data?.members;
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

export function useGetOwnerNames(boat) {
    const rawMemberNumbers = boat.ownerships?.filter((o) => queryIf(o)).map((o) => o.member) || [];
    const memberNumbers = [...new Set(rawMemberNumbers)]; // e.g. husband and wife owners
    const { error, loading, data } = useQuery(MEMBER_QUERY, { variables: { members: memberNumbers }});
    if (error) {
        console.log(error)
        return boat.ownerships;
    }
    if (loading) {
        return boat.ownerships;
    }
    if (data) {
        const ownerships = addNames(data, boat.ownerships);
        ownerships.sort((a, b) => a.start > b.start);
        return ownerships;
    }
    return boat.ownerships;
}
