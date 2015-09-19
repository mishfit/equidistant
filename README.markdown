# Equidistant
A colleague posted this riddle on our team wall and I've created a
programmatic way to solve it:

> You have the following numbers:

> 1, 1, 2, 2, 3, 3, 4, 4

> Sort the numbers such that all pair of numbers have a distance of
> their [individual] value. e.g.:

> [1, 2, 1] :+1: (the pair of ones have exactly one digit between them)

> [1, 1, 2] :-1:

## Requirements
The example requires [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) to run

```bash
git clone https://github.com/mishfit/equidistant.git
cd equidistant
npm install .
node equidistant.js
```

Initially the script run will error out (this is intentional).

**Modify the "sort" function until tests pass**.

The answer to the original riddle is part of the test and is slightly *"obfuscated"*.
Obviously this is based on the "honor" system, however,
if you'd like to see the answer head on over to the "[answer](https://github.com/mishfit/equidistant/tree/answer)" branch.

