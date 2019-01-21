import LeftJoin from "../src";
import { ObjectKey } from "../src/ObjectKey";
import { seed, random } from 'faker';

seed(7437599372);

const leftField = random.word();
const rightField = random.word();

const describeData = [
    ['string', random.word(), random.word()],
    ['number', random.number(), random.number()],
    ['symbol', Symbol.for('valueOne'), Symbol.for('valueTwo')],
    ['object identity', {[random.word()]: random.word()}, {[random.word()]: random.word()}],
];
describe.each(describeData)('%s key', (_name: string, valueOne: ObjectKey|object, valueTwo: ObjectKey|object) => {
    const testData = [
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
    ];

    type PossibleValues = typeof valueOne|typeof valueTwo;
    type LeftCollection = {[K in typeof leftField]:PossibleValues}[];
    type RightCollection = {[K in typeof rightField]:PossibleValues}[];
    test.each(testData)('%s, %s',(
        leftName: string,
        rightName: string,
        leftCollection: LeftCollection,
        rightCollection: RightCollection
    ) => {
        expect(
            LeftJoin(
                leftName as typeof testData[any][0] & string,
                leftCollection,
                rightName as Exclude<typeof testData[any][1] & string,typeof leftName>,
                rightCollection,
                leftField,
                rightField
            )
        ).toMatchSnapshot();
    });
});
