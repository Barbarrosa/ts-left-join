import { ObjectKey } from "ObjectKey";

type LookupList<C extends string,L> =  { [V in C]: L };

export default function LeftJoin<
    R extends F,
    S extends K,
    G extends Exclude<ObjectKey,J>,
    J extends Exclude<ObjectKey,G>,
    F extends ObjectKey,
    K extends ObjectKey,
    B extends { [P in F]: any },
    L extends { [Z in K]: any },
    C extends B[R] & L[S],
    U extends { [P in G]: B; } & { [Z in J]?: L; }
>(
    leftResultAlias: G, leftCollection: B[], rightResultAlias: J, rightCollection: L[], leftField: R, rightField: S
): U[] {

    const rightBuckets: LookupList<C,L[]> = rightCollection.reduce((rightBucketsPart,rightRow) => {
        const rightValue = rightRow[rightField];
        const rightBucket = rightBucketsPart[rightValue] || [];
        rightBucketsPart[rightValue] = [...rightBucket, rightRow];
        return rightBucketsPart;
    }, {} as LookupList<C,L[]>);

    return leftCollection.reduce((joinedRows: U[], leftRow: B) => {
        const leftValue: C = leftRow[leftField];
        const leftRowData: U = {
            [leftResultAlias]: leftRow,
        } as U;
        const rightBucket = rightBuckets[leftValue];
        if(rightBucket) {
            rightBucket.forEach((rightValue: L) => {
                joinedRows.push({
                    ...leftRowData,
                    [rightResultAlias]: rightValue,
                });
            });
        } else {
            joinedRows.push(leftRowData);
        }
        return joinedRows;
    }, []);
}