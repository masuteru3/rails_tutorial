rwlockfile
==========

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/jdxcode/rwlockfile.svg)](https://greenkeeper.io/)
[![codecov](https://codecov.io/gh/jdxcode/rwlockfile/branch/master/graph/badge.svg)](https://codecov.io/gh/jdxcode/rwlockfile)
[![CircleCI](https://circleci.com/gh/jdxcode/rwlockfile.svg?style=svg)](https://circleci.com/gh/jdxcode/rwlockfile)
[![Build status](https://ci.appveyor.com/api/projects/status/2s8cyotehrtap0t2/branch/master?svg=true)](https://ci.appveyor.com/project/Heroku/rwlockfile/branch/master)
[![npm](https://img.shields.io/npm/v/rwlockfile.svg)](https://npmjs.org/package/rwlockfile)
[![npm](https://img.shields.io/npm/dw/rwlockfile.svg)](https://npmjs.org/package/rwlockfile)
[![npm](https://img.shields.io/npm/l/rwlockfile.svg)](https://github.com/jdxcode/rwlockfile/blob/master/package.json)

node utility for read/write lockfiles

This is the only node package as of this writing I'm aware of that allows you to have read/write lockfiles. If you're looking for a simpler solution, check out [proper-lockfile](https://www.npmjs.com/package/proper-lockfile). Use this package if you need read/write lock support.

This follows the standard [Readers-Writers Lock design pattern](https://en.wikipedia.org/wiki/Readers–writer_lock). Any number of readers are allowed at one time. 1 writer is allowed at one time iff there are no current readers.

Usage
=====

```js
const {RWLockfile} = require('rwlockfile')

// 'myfile' is the path to a file to use as the base for the lockfile
// it will add '.lock' to the end for the actual lockfile, so in this case 'myfile.lock'
let lock = new RWLockfile('myfile', {
  // how long to wait until timeout. Default: 30000
  timeout: 30000,
  // mininum time to wait between checking for locks
  // automatically adds some noise and duplicates this number each check
  retryInterval: 10,
})

// add a reader async or synchronously. If the count is >= 1 it creates a read lock (see note below)
await lock.add('read')
lock.addSync('read')

// remove a reader async or synchronously. If the count == 0 it creates removes the read lock
await lock.remove('read')
lock.removeSync('read')

// add a writer async or synchronously
await lock.add('write')
lock.addSync('write')
```

Behavior Note
=============

The use of `.add()` and `.remove()` may be a bit misleading but allow me to attempt to explain what it means. It's designed to make it easy to add try/finally steps around locking. Each instance of RWLockfile has a count of readers and writers. The file itself has it's own count of readers and writers. When you increment the count, what you're doing is adding to the count of *just* that instance.

In other words, you can do `lock.add('write')` multiple times on the same instance. That instance will create the write lock if the count is greater than 1 but no other instances will be allowed to increase the count above 0.

Why? Because this way you can have functions in your code like this:

```js
async function doAThing() {
  await lock.add('write')
  try {
    // do something while locked
    doAnotherThing()
  } finally {
    await lock.remove('write')
  }
}

async function doAnotherThing() {
  await lock.add('write')
  try {
    // do something else while locked
  } finally {
    await lock.remove('write')
  }
}
```

This will only create a single write lock which will be removed after doAThing() is done. This way you can call doAnotherThing() and it ensures it has a lock if it doesn't exist, but will only remove the write lock if nothing it's using also has a write lock.

I've found this behavior to be perfect for working with, but this sort of nesting lock logic is a little difficult to explain.
