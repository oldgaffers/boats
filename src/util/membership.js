
export function memberPredicate(id, member) {
    if (!member) {
        return false;
    }
    if (id !== member.id) {
        return false;
    }
    if (member.status === 'Left OGA') {
        return false;
    }
    if (member.status === 'Not Paid') {
        return false;
    }
    return member.GDPR;
}

// change to this one when prepping the yearbook as the paid up status is not usually correct at this time
export function memberPredicateForUseDuringFebruary(id, member) {
    if (id !== member.id) {
        return false;
    }
    if (member.status === 'Left OGA') {
        return false;
    }
    return member.GDPR;
}
