is-process-active
=================

[![Build status](https://ci.appveyor.com/api/projects/status/fyhxf3w8gyqxv0ou/branch/master?svg=true)](https://ci.appveyor.com/project/Heroku/is-process-active/branch/master)
[![CircleCI](https://circleci.com/gh/jdxcode/is-process-active/tree/master.svg?style=svg)](https://circleci.com/gh/jdxcode/is-process-active/tree/master)
[![codecov](https://codecov.io/gh/jdxcode/is-process-active/branch/master/graph/badge.svg)](https://codecov.io/gh/jdxcode/is-process-active)
[![npm](https://img.shields.io/npm/v/is-process-active.svg)]()
[![npm](https://img.shields.io/npm/dw/is-process-active.svg)]()
[![npm](https://img.shields.io/npm/l/is-process-active.svg)]()
[![David](https://img.shields.io/david/jdxcode/is-process-active.svg)]()
[![GitHub top language](https://img.shields.io/github/languages/top/jdxcode/is-process-active.svg)]()

Cross-platform support for detecting if a process pid is active. Uses `process.kill(pid, 0)` on unix and `tasklist.exe` on Windows.

**Usage**:

```js
const pid = require('is-process-active')
if (pid.activeSync(myPid)) {
  // do something if process is active
}

// or...

if (await pid.active(myPid)) {
  // do something if process is active
}
```
