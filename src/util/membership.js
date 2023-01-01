
export function memberPredicate(id, member, excludeNotPaid=true) {
    if (!member) {
        return false;
    }
    if (id !== member.id) {
        return false;
    }
    if (member.status === 'Left OGA') {
        return false;
    }
    if (excludeNotPaid && member.status === 'Not Paid') {
        return false;
    }
    return member.GDPR;
}
