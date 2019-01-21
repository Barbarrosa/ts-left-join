# ts-left-join [![Build Status](https://travis-ci.com/Barbarrosa/ts-left-join.svg?branch=master)](https://travis-ci.com/Barbarrosa/ts-left-join)
*Typescript-friendly implementation of a left join on arrays*

This library can provide basic left-joins for arrays, but you may want to check out [`data-forge-ts`](https://github.com/data-forge/data-forge-ts/) if you need to do some serious data wrangling. They have a more comprehensive [join implementation](https://github.com/data-forge/data-forge-ts/blob/master/docs/guide.md#join).

## Installation
```sh
npm i --save ts-left-join
```

## Usage
```typescript
import LeftJoin from 'ts-left-join';

const dogs = [
    {name: "Spaz", preference: "tail"},
    {name: "Lone Wolf", preference: "ears"},
];

const cats = [
    {name: "Boing", best_feature: "tail"},
    {name: "Dud", best_feature: "claws"},
];

const best_buds = LeftJoin(
    // left-side field name and array
    "dog",dogs,
    // right-side field name and array
    "cat",cats,
    // join field names (left, right)
    "preference","best_feature"
);
```
The value `best_buds` now contains the following.
```javascript
[
    {
        dog: {name: "Spaz", preference: "tail"},
        cat: {name: "Boing", best_feature: "tail"},
    },
    {
        dog: {name: "Lone Wolf", preference: "ears"},
    },
]
```

### Type Checking
This library uses strict type checking to validate that your fields match your specified data structures.
If you don't intend to take advantage of this feature or haven't specified your data structures yet, then
you can circumvent the type checking as shown below.

```typescript
const best_buds = LeftJoin(
    dogName as string,
    dogs,
    // Circumvent field name overlap check
    "cat" as Exclude<string, typeof dogName>,
    cats,
    // Circumvent row field name checks
    "preference" as keyof typeof dogs[any],
    "best_feature" as keyof typeof cats[any]
);
```