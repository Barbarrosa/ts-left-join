type ResultType<U1,U2,G extends keyof U1,B> = U1 extends { [K in G]: B } ? U1 & Partial<U2> : never;
export default function LeftJoin<
    B extends { [P:string]: any },
    L extends { [Z:string]: any },
    R extends keyof B,
    S extends keyof L,
    U1 extends { [P:string]: B; },
    U2 extends { [Z:string]: L; },
    G extends keyof U1,
    J extends keyof U2,
    C extends B[R] & L[S],
    U extends ResultType<U1,U2,G,B>
>(
    leftResultAlias: G,
    leftCollection: B[],
    rightResultAlias: Exclude<J,typeof leftResultAlias>,
    rightCollection: L[],
    leftField: R,
    rightField: S
): U[] {

    const rightBuckets: Map<C,L[]> = rightCollection.reduce((rightBucketsPart,rightRow) => {
        const rightValue = rightRow[rightField];
        let rightBucket = rightBucketsPart.get(rightValue);
        if(!rightBucket) {
            rightBucket = [];
            rightBucketsPart.set(rightValue, rightBucket);
        }
        rightBucket.push(rightRow);
        return rightBucketsPart;
    }, new Map<C,L[]>());

    return leftCollection.reduce((joinedRows: U[], leftRow: B) => {
        const leftValue: C = leftRow[leftField];
        const leftRowData: U = {
            [leftResultAlias]: leftRow,
        } as U;
        const rightBucket = rightBuckets.get(leftValue);
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