import LeftJoin from "../src";
import { seed, random } from 'faker';

seed(7437599372);

const leftField = random.word();
const rightField = random.word();
const valueOne = random.word();
const valueTwo = random.word();

test.each([
    [
        'empty left',
        'empty right',
        [],
        [],
    ],
    [
        'one left',
        'empty right',
        [{[leftField]: valueOne}],
        [],
    ],
    [
        'empty left',
        'one right',
        [],
        [{[rightField]: valueOne}],
    ],
    [
        'one left',
        'one right non-match',
        [{[leftField]: valueOne}],
        [{[rightField]: valueTwo}],
    ],
    [
        'one left',
        'one right match',
        [{[leftField]: valueOne}],
        [{[rightField]: valueOne}],
    ],
    [
        'two left',
        'one right match',
        [{[leftField]: valueOne},{[leftField]: valueTwo}],
        [{[rightField]: valueOne}],
    ],
    [
        'two left',
        'two right same match',
        [{[leftField]: valueOne},{[leftField]: valueOne}],
        [{[rightField]: valueOne}],
    ],
    [
        'two left',
        'two right different match',
        [{[leftField]: valueOne},{[leftField]: valueTwo}],
        [{[rightField]: valueTwo},{[rightField]: valueOne}],
    ],
    [
        'one left',
        'two right multiple match',
        [{[leftField]: valueOne}],
        [{[rightField]: valueOne},{[rightField]: valueOne}],
    ],
    [
        'two left',
        'three right different match w/ one multiple',
        [{[leftField]: valueOne},{[leftField]: valueTwo}],
        [{[rightField]: valueTwo},{[rightField]: valueOne},{[rightField]: valueTwo}],
    ],
])('%s, %s',
 <T extends { [key:string]: any}>(
    leftName: string,
    rightName: string,
    leftCollection: T[],
    rightCollection: T[]
 ) => {
    expect(
        LeftJoin(
            leftName,
            leftCollection,
            rightName,
            rightCollection,
            leftField,
            rightField
        )
    ).toMatchSnapshot();
});