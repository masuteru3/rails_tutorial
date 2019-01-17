#!/usr/bin/env node
const {run} = require('@cli-engine/engine')
const config = {
  channel: 'stable',
  version: '6.99.0-ec9edad'
}
run(process.argv, config)
