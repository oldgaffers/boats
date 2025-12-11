import { getScopedData } from './api';
import { useContext, useEffect, useState } from 'react';
import { TokenContext } from '../components/TokenProvider';
import { useAuth0 } from "@auth0/auth0-react";

const queryIf = (o) => o.member && (o.name === undefined || o.name.trim() === '');

export function ownershipsWithNames(ownerships = [], members) {
    if (!members) {
        return ownerships;
    }
    return ownerships.map((ownership) => {
        const r = { note: 'problem identifying owner' };
        const m = members.filter((member) => member.id === ownership.id);
        if (m.length > 0) {
            const { skipper, GDPR, firstname, lastname } = m[0];
            if (GDPR) {
                r.name = `${firstname} ${lastname}`;
            } else {
                r.note = 'name on record but withheld';
            }
            if (skipper) {
                r.skipper = skipper;
            }
        }
        return { ...ownership, ...r }
    });
};

export function ownerMembershipNumbers(ownerships=[]) {
    const rawMemberNumbers = ownerships.filter((o) => queryIf(o)).map((o) => o.member) || [];
    return [...new Set(rawMemberNumbers)]; // e.g. husband and wife owners
}

export function useGetMemberData(subject, filter) {
    const [data, setData] = useState();
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        if (!data) {
            getAccessTokenSilently().then((accessToken) =>
              getScopedData('member', subject, filter, accessToken).then((d) => {
                setData(d?.Items ?? []);
              })
            );
        }
    }, [subject, filter, data, getAccessTokenSilently]);

    return data;
}

export function useGetOwnerNamesNew(ownerships) {
    const f = {
        fields: 'id,membership,firstname,lastname,GDPR',
        member: ownerMembershipNumbers(ownerships),
    };
    const members = useGetMemberData('members', f);
    return ownershipsWithNames(ownerships, members);
}

export async function getOwnerNames(memberNumbers, accessToken) {
    const f = {
        fields: 'id,membership,firstname,lastname,GDPR',
        member: memberNumbers,
    };
    const d = await getScopedData('member', 'members', f, accessToken);
    return d?.Items ?? [];
}

export function useGetOwnerNames(ownerships) {
    const [data, setData] = useState();
    const accessToken = useContext(TokenContext);

    useEffect(() => {
        if (!data) {
            const memberNumbers = ownerMembershipNumbers(ownerships);
            getOwnerNames(memberNumbers, accessToken).then((d) => {
                setData(ownershipsWithNames(ownerships, d));
            });
        }
    }, [boat, data, accessToken]);

    return data || ownerships;
}
