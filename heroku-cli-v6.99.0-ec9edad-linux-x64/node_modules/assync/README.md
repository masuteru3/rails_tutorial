[![view on npm](http://img.shields.io/npm/v/assync.svg)](https://www.npmjs.org/package/assync)
[![npm module downloads](http://img.shields.io/npm/dt/assync.svg)](https://www.npmjs.org/package/assync)
[![CircleCI](https://circleci.com/gh/jdxcode/assync.svg?style=svg)](https://circleci.com/gh/jdxcode/assync)
[![Dependency Status](https://david-dm.org/jdxcode/assync.svg)](https://david-dm.org/jdxcode/assync)
[![codecov](https://codecov.io/gh/jdxcode/assync/branch/master/graph/badge.svg)](https://codecov.io/gh/jdxcode/assync)

assync
======

Asynchronous, parallel .map(), .filter(), and more. Works really well with async/await.

**Example**

```js
const {HTTP} = require('http-call')
const {assync} = require('assync')

async function main () {
  const output = await assync(['jdxcode']) // start with github user 'jdxcode'
    .map(userID => )
}
main()
```
