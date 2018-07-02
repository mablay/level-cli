#!/usr/bin/env node

const program = require('commander')

program
  .option('-f, --from <from>', 'Read records starting at "from".')
  .option('-t, --to <to>', 'Read records until "to".')
  .action(function (cmd, options) {
    console.log('[keys] action', cmd)
  })

program.parse(process.argv)

console.log('[keys]')
