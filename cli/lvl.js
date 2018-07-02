#!/usr/bin/env node

const program = require('commander')
const {version} = require('../package.json')
const {stream, logTransform} = require('../src/stream')

program
  .version(version)
  .option('-p, --path <path>', 'Path to leveldb', '.')
  .option('-f, --from <from>', 'Read records starting at "from".')
  .option('-t, --to <to>', 'Read records until "to".')

program
  .command('keys')
  .action(() => run({keys: true}))

program
  .command('values')
  .action(() => run({values: true}))

program.parse(process.argv)

function run (options = {}) {
  if (program.from !== undefined) { options.gte = program.from }
  if (program.to !== undefined) { options.lte = program.to }
  options.objectMode = true
  console.log('[lvl] stream Reading leveldb:', program.path)
  console.log('[lvl] stream options', options)
  stream(program.path, options)
    .pipe(logTransform())
}
