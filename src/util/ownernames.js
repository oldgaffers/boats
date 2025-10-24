import { getScopedData } from './api';
import { useContext, useEffect, useState } from 'react';
import { TokenContext } from '../components/TokenProvider';

const queryIf = (o) => o.member && (o.name === undefined || o.name.trim() === '');

export function addNames(members, ownerships = []) {
    if (!members) {
        return ownerships;
    }
    return ownerships.map((ownership) => {
        const r = { ...ownership };
        const m = members.filter((member) => member.id === ownership.id);
        console.log('O', m);
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

export async function getOwnerNames(memberNumbers, accessToken) {
    const f = {
        fields: 'id,membership,firstname,lastname,GDPR',
        member: memberNumbers,
    };
    const d = await getScopedData('member', 'members', f, accessToken);
    return d?.Items ?? [];
}

export function useGetOwnerNames(boat) {
    const [data, setData] = useState();
    const accessToken = useContext(TokenContext);

    useEffect(() => {
        if (!data) {
            const memberNumbers = ownerMembershipNumbers(boat);
            getOwnerNames(memberNumbers, accessToken).then((d) => {
                setData(ownershipsWithNames(boat, d));
            });
        }
    }, [boat, data, accessToken]);

    return data || boat.ownerships;
}
