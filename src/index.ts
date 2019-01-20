type LookupList<C extends string,L> =  { [V in C]: L };

export default function LeftJoin<
    R extends F,
    S extends K,
    G extends string,
    J extends string,
    F extends string,
    K extends string,
    B extends { [P in F]: any },
    L extends { [Z in K]: any },
    C extends B[R] & L[S],
    U extends { [P in G]: B; } & { [Z in J]?: L; }
>(
    leftResultName: G, leftCollection: B[], rightResultName: J, rightCollection: L[], leftJoinField: R, rightJoinField: S
): U[] {

    const indexedLookup: LookupList<C,L[]> = rightCollection.reduce((a,i) => {
        const lookupSection: L[] = a[i[rightJoinField]] || [];
        a[i[rightJoinField]] = [...lookupSection, i];
        return a;
    }, {} as LookupList<C,L[]>);
    const combined:U[] = [];
    for(const item of leftCollection) {
        const lookupValue: C = item[leftJoinField];
        const lookupSection: L[S][] = indexedLookup[lookupValue];
        if(lookupSection) {
            for(const rightItem of lookupSection) {
                combined.push({
                    [leftResultName]: item,
                    [rightResultName]: rightItem
                } as U);
            }
        } else {
            combined.push({
                [leftResultName]: item,
            } as U);
        }
    }
    return combined;
}